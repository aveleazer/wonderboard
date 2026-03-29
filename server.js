const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFile, exec } = require('child_process');
const crypto = require('crypto');

const PORT = parseInt(process.env.BOARD_PORT || '3737');

const SAGES = [
  {emoji: '🎯', name: 'Focuser', role: 'focus and essence', color: '#b8942e', file: 'focuser.md'},
  {emoji: '⚔️', name: 'Strategist', role: 'positioning and timing', color: '#5a7fa8', file: 'strategist.md'},
  {emoji: '💰', name: 'Pragmatist', role: 'economics and moat', color: '#5a9a5a', file: 'pragmatist.md'},
  {emoji: '🔥', name: 'Skeptic', role: 'fragility and optionality', color: '#b85040', file: 'skeptic.md'},
  {emoji: '🔧', name: 'Product Person', role: 'scope and deadlines', color: '#7a7a7a', file: 'product.md'},
  {emoji: '📢', name: 'Marketer', role: 'tribe and narrative', color: '#c9874c', file: 'marketer.md'},
  {emoji: '🔮', name: 'Visionary', role: '10-year horizon', color: '#8a6ec9', file: 'visionary.md'},
];

const LANG_NAMES = {
  ru: 'Russian', en: 'English', zh: 'Chinese', es: 'Spanish', hi: 'Hindi',
  ar: 'Arabic', pt: 'Portuguese', fr: 'French', de: 'German', ja: 'Japanese',
};

// --- Business context ---

const CONTEXT_PATH = path.join(__dirname, 'context.md');
if (!fs.existsSync(CONTEXT_PATH)) {
  fs.writeFileSync(CONTEXT_PATH, `# Business Context

Describe your business here. This context is included in every sage's prompt.

Example:
- Main product: ...
- Revenue model: ...
- Team size: ...
- Current challenges: ...
`);
  console.log('Created context.md — edit it to describe your business.');
}
const BUSINESS_CONTEXT = fs.readFileSync(CONTEXT_PATH, 'utf-8');

// --- Profiles ---

const PROFILES_DIR = path.join(__dirname, 'profiles');
const profiles = {};
for (const sage of SAGES) {
  profiles[sage.file] = fs.readFileSync(path.join(PROFILES_DIR, sage.file), 'utf-8');
}
profiles['hatter.md'] = fs.readFileSync(path.join(PROFILES_DIR, 'hatter.md'), 'utf-8');

// --- Prompts ---

const PROMPTS_DIR = path.join(__dirname, 'prompts');
const prompts = {};
for (const f of fs.readdirSync(PROMPTS_DIR)) {
  prompts[f.replace('.md', '')] = fs.readFileSync(path.join(PROMPTS_DIR, f), 'utf-8');
}

function fillPrompt(name, vars) {
  return prompts[name].replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? '');
}

// --- State ---

const SESSIONS_DIR = path.join(__dirname, 'sessions');
const STATE_FILE = path.join(SESSIONS_DIR, '.current.json');
fs.mkdirSync(SESSIONS_DIR, {recursive: true});

let state = loadState() || freshState();

function freshState() {
  return {
    phase: 'idle',
    lang: 'en',
    model: 'sonnet',
    tokens: {input: 0, output: 0},
    title: null,
    question: null,
    interview: [],
    hatterSessionId: null,
    interview2: [],
    sages: SAGES.map(s => ({emoji: s.emoji, name: s.name, role: s.role, color: s.color, sessionId: null, preview: null, round1: null, question: null, round2: null})),
    synthesis: null,
  };
}

function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const saved = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
      if (saved.phase !== 'idle' && saved.question) {
        console.log(`Restored session: "${saved.question}" (phase: ${saved.phase})`);
        return saved;
      }
    }
  } catch {}
  return null;
}

function saveState() {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// --- SSE ---

const sseClients = new Set();

setInterval(() => {
  for (const res of sseClients) {
    if (!res.writable) { sseClients.delete(res); continue; }
    res.write(': heartbeat\n\n');
  }
}, 15000);

function broadcast(type, data) {
  const payload = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of sseClients) {
    if (!res.writable) { sseClients.delete(res); continue; }
    res.write(payload);
  }
}

function trackUsage(response) {
  state.tokens.input += response.input_tokens;
  state.tokens.output += response.output_tokens;
  broadcast('usage', {tokens: state.tokens});
}

// --- Claude CLI ---

async function callClaude(prompt, sessionId, model) {
  const args = ['-p', '--output-format', 'json', '--model', model || state.model];
  if (sessionId) args.push('--session-id', sessionId);
  return _exec(args, prompt);
}

async function resumeClaude(prompt, sessionId, model) {
  return _exec(['-p', '--output-format', 'json', '--model', model || state.model, '--resume', sessionId], prompt);
}

function _exec(args, prompt) {
  return new Promise((resolve, reject) => {
    const proc = execFile('claude', args, {
      timeout: 180000,
      maxBuffer: 1024 * 1024,
    }, (err, stdout) => {
      if (err) return reject(err);
      try {
        const data = JSON.parse(stdout);
        resolve({
          result: data.result,
          input_tokens: (data.usage?.input_tokens || 0)
            + (data.usage?.cache_read_input_tokens || 0)
            + (data.usage?.cache_creation_input_tokens || 0),
          output_tokens: data.usage?.output_tokens || 0,
        });
      } catch (parseErr) {
        resolve({result: stdout.trim(), input_tokens: 0, output_tokens: 0});
      }
    });
    proc.stdin.write(prompt);
    proc.stdin.end();
  });
}

// --- Parsing ---

function parseJSON(raw) {
  try { return JSON.parse(raw); } catch {}
  const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) try { return JSON.parse(match[1]); } catch {}
  const start = raw.search(/[\[{]/);
  if (start >= 0) {
    const end = raw.lastIndexOf(raw[start] === '[' ? ']' : '}');
    if (end > start) try { return JSON.parse(raw.slice(start, end + 1)); } catch {}
  }
  throw new Error('Failed to parse JSON from claude response');
}

function parseSageResponse(response) {
  const lines = response.split('\n');
  let questionIdx = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim().match(/^(QUESTION|MY QUESTION|МОЙ ВОПРОС)\s*:/i)) {
      questionIdx = i;
      break;
    }
  }
  if (questionIdx >= 0) {
    const question = lines[questionIdx].replace(/^(QUESTION|MY QUESTION|МОЙ ВОПРОС)\s*:\s*/i, '').trim();
    const body = lines.slice(0, questionIdx).join('\n').replace(/\n*---\s*$/, '').trim();
    return {body, question};
  }
  return {body: response.trim(), question: ''};
}

// --- Flows ---

async function runHatter(question, lang) {
  state.phase = 'hatter';
  state.question = question;
  state.lang = lang;
  broadcast('hatter_thinking', {});

  state.hatterSessionId = crypto.randomUUID();

  const langName = LANG_NAMES[lang] || 'English';
  const prompt = fillPrompt('hatter-interview', {
    PROFILE: profiles['hatter.md'], QUESTION: question,
    BUSINESS_CONTEXT, LANG: langName,
  });

  try {
    const response = await callClaude(prompt, state.hatterSessionId);
    trackUsage(response);
    const raw = response.result;
    const parsed = parseJSON(raw);
    const questions = parsed.questions || parsed;
    const title = parsed.title || null;
    state.title = title;
    state.interview = questions.map(q => ({...q, a: ''}));
    broadcast('hatter_questions', {title, questions});
  } catch (err) {
    broadcast('error', {message: err.message, phase: 'hatter'});
  }
}

async function runSagesRound1(interviewAnswers) {
  state.phase = 'sages_round1';
  const interviewContext = interviewAnswers
    .filter(a => a.a)
    .map(a => `Q: ${a.q}\nA: ${a.a}`)
    .join('\n\n');

  const langName = LANG_NAMES[state.lang] || 'English';

  const promises = SAGES.map(async (sage, index) => {
    const sessionId = crypto.randomUUID();
    state.sages[index].sessionId = sessionId;
    broadcast('sage_thinking', {index});

    const profile = profiles[sage.file];
    const prompt = fillPrompt('sage-round1', {
      PROFILE: profile, BUSINESS_CONTEXT,
      INTERVIEW_CONTEXT: interviewContext || 'No interview was conducted.',
      QUESTION: state.question, LANG: langName,
    });

    try {
      const response = await callClaude(prompt, sessionId);
      trackUsage(response);
      const {body, question} = parseSageResponse(response.result);
      const preview = body.split('\n').filter(l => l.trim()).slice(0, 2).join(' ').slice(0, 200);

      state.sages[index] = {...state.sages[index], preview, round1: body, question};
      broadcast('sage', {index, preview, round1: body, question});
    } catch (err) {
      broadcast('error', {message: `${sage.name}: ${err.message}`, phase: 'sage_round1'});
    }
  });

  await Promise.allSettled(promises);
  saveState();
  saveSession();
  await runHatterQuestionnaire2();
}

async function runHatterQuestionnaire2() {
  state.phase = 'hatter2';
  broadcast('hatter2_thinking', {});

  const sageQuestions = state.sages
    .filter(s => s.question)
    .map(s => `${s.emoji} ${s.name}: ${s.question}`)
    .join('\n');

  if (!sageQuestions) {
    state.interview2 = [];
    broadcast('hatter_questionnaire2', []);
    return;
  }

  const langName = LANG_NAMES[state.lang] || 'English';
  const prompt = fillPrompt('hatter-followup', {SAGE_QUESTIONS: sageQuestions, LANG: langName});

  try {
    const response = await resumeClaude(prompt, state.hatterSessionId);
    trackUsage(response);
    const questions = parseJSON(response.result);
    state.interview2 = questions.map(q => ({...q, a: ''}));
    saveState();
    broadcast('hatter_questionnaire2', questions);
  } catch (err) {
    broadcast('error', {message: err.message, phase: 'hatter2'});
  }
}

async function runSagesRound2(answers2) {
  state.phase = 'sages_round2';
  const allRound1 = state.sages
    .map(s => `${s.emoji} ${s.name}: ${s.round1}`)
    .join('\n\n---\n\n');
  const answersText = answers2
    .filter(a => a.a)
    .map(a => `Q: ${a.q}\nA: ${a.a}`)
    .join('\n\n');
  const langName = LANG_NAMES[state.lang] || 'English';

  const promises = SAGES.map(async (sage, index) => {
    const sessionId = state.sages[index].sessionId;
    if (!sessionId) return;
    broadcast('sage_thinking', {index});

    const answersBlock = answersText
      ? `USER'S ANSWERS TO FOLLOW-UP QUESTIONS:\n${answersText}\n\n`
      : '';
    const prompt = fillPrompt('sage-round2', {
      ANSWERS_BLOCK: answersBlock, ALL_ROUND1: allRound1,
      ANSWERS_NOTE: answersText ? ' You also have the user\'s answers to follow-up questions.' : '',
      LANG: langName,
    });

    try {
      const response = await resumeClaude(prompt, sessionId);
      trackUsage(response);
      state.sages[index].round2 = response.result;
      broadcast('sage_round2', {index, round2: response.result});
    } catch (err) {
      broadcast('error', {message: `${sage.name} round 2: ${err.message}`, phase: 'sage_round2'});
    }
  });

  await Promise.allSettled(promises);
  saveState();
  saveSession();
  await runHatterSynthesis();
}

async function runHatterSynthesis() {
  state.phase = 'synthesis';
  broadcast('synthesis_thinking', {});

  const allResponses = state.sages.map(s => {
    let text = `${s.emoji} ${s.name} (${s.role}):\n${s.round1}`;
    if (s.round2) text += `\n\nFinal position:\n${s.round2}`;
    return text;
  }).join('\n\n===\n\n');

  const langName = LANG_NAMES[state.lang] || 'English';
  const prompt = fillPrompt('hatter-synthesis', {ALL_RESPONSES: allResponses, LANG: langName});

  try {
    const response = await resumeClaude(prompt, state.hatterSessionId);
    trackUsage(response);
    state.synthesis = response.result;
    state.phase = 'done';
    broadcast('synthesis', response.result);
    saveState();
    saveSession();
  } catch (err) {
    broadcast('error', {message: err.message, phase: 'synthesis'});
  }
}

// --- Session save ---

function buildProtocol() {
  const date = new Date().toISOString().slice(0, 10);
  let md = `---\ndate: ${date}\nquestion: ${state.question}\nmembers: [${state.sages.map(s => s.name).join(', ')}]\nlang: ${state.lang}\n---\n\n# Board Session Protocol\n\n## Question\n${state.question}\n`;
  if (state.interview?.length) {
    md += `\n## Interview\n`;
    for (const item of state.interview) {
      if (item.a) md += `**Q:** ${item.q || item.question}\n**A:** ${item.a}\n\n`;
    }
  }
  md += `## Voices\n`;
  for (const s of state.sages) {
    md += `\n### ${s.emoji} ${s.name}\n#### First Round\n${s.round1}\n`;
    if (s.question) md += `\n#### Question\n${s.question}\n`;
    if (s.round2) md += `\n#### Second Round\n${s.round2}\n`;
  }
  if (state.interview2?.length) {
    md += `\n## Follow-up Questions\n`;
    for (const item of state.interview2) {
      if (item.a) md += `**Q:** ${item.q || item.question}\n**A:** ${item.a}\n\n`;
    }
  }
  if (state.synthesis) md += `\n## Synthesis\n${state.synthesis}\n`;
  md += `\n---\n*Generated by [Board](https://github.com/aveleazer/wonderboard) — Virtual Board of Directors*\n`;
  return md;
}

function saveSession() {
  const date = new Date().toISOString().slice(0, 10);
  const raw = (state.title || state.question || 'session').slice(0, 40);
  const topic = raw.replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase() || 'session';
  const filename = path.join(SESSIONS_DIR, `${date}_${topic}.json`);
  fs.writeFileSync(filename, JSON.stringify(state, null, 2));
  console.log(`Session saved: ${filename}`);
}

// --- HTTP ---

function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => resolve(data));
  });
}

function json(res, obj, status = 200) {
  res.writeHead(status, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'});
  res.end(JSON.stringify(obj));
}

async function handler(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  if (req.method === 'GET' && url.pathname === '/') {
    const uiPath = path.join(__dirname, 'ui.html');
    if (!fs.existsSync(uiPath)) {
      res.writeHead(404);
      return res.end('ui.html not found');
    }
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    return res.end(fs.readFileSync(uiPath));
  }

  if (req.method === 'GET' && url.pathname.startsWith('/fonts/')) {
    const fontFile = path.basename(url.pathname);
    const fontPath = path.join(__dirname, 'fonts', fontFile);
    if (!fs.existsSync(fontPath)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, {'Content-Type': 'font/woff2', 'Cache-Control': 'public, max-age=31536000'});
    return res.end(fs.readFileSync(fontPath));
  }

  if (req.method === 'GET' && url.pathname === '/test-fixtures.js') {
    const p = path.join(__dirname, 'test-fixtures.js');
    if (!fs.existsSync(p)) { res.writeHead(404); return res.end(); }
    res.writeHead(200, {'Content-Type': 'application/javascript; charset=utf-8'});
    return res.end(fs.readFileSync(p));
  }

  if (req.method === 'GET' && url.pathname === '/events') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    });
    res.write(`event: state\ndata: ${JSON.stringify(state)}\n\n`);
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/api/session') {
    return json(res, state);
  }

  if (req.method === 'GET' && url.pathname === '/api/sessions') {
    const files = fs.readdirSync(SESSIONS_DIR)
      .filter(f => f.endsWith('.json') && f !== '.current.json')
      .sort()
      .reverse()
      .map(f => {
        try {
          const data = JSON.parse(fs.readFileSync(path.join(SESSIONS_DIR, f), 'utf-8'));
          return {file: f, title: data.title || null, question: data.question || f, date: f.slice(0, 10)};
        } catch { return {file: f, question: f, date: ''}; }
      });
    return json(res, files);
  }

  if (req.method === 'GET' && url.pathname.startsWith('/api/sessions/')) {
    const file = path.basename(decodeURIComponent(url.pathname.slice('/api/sessions/'.length)));
    const filePath = path.join(SESSIONS_DIR, file);
    if (!fs.existsSync(filePath)) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
    return res.end(fs.readFileSync(filePath, 'utf-8'));
  }

  if (req.method === 'POST' && url.pathname === '/api/reset') {
    state = freshState();
    try { fs.unlinkSync(STATE_FILE); } catch {}
    broadcast('state', state);
    return json(res, {ok: true});
  }

  if (req.method === 'POST' && url.pathname === '/api/question') {
    const body = JSON.parse(await readBody(req));
    state.model = body.model || 'sonnet';
    json(res, {ok: true});
    runHatter(body.question, body.lang || 'en');
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/answers') {
    const body = JSON.parse(await readBody(req));
    json(res, {ok: true});
    runSagesRound1(body);
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/answers2') {
    const body = JSON.parse(await readBody(req));
    json(res, {ok: true});
    runSagesRound2(body);
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/skip-round2') {
    json(res, {ok: true});
    runSagesRound2([]);
    return;
  }

  if (req.method === 'POST' && url.pathname === '/api/chat') {
    const body = JSON.parse(await readBody(req));
    const idx = body.index;
    const sessionId = state.sages[idx]?.sessionId;
    if (!sessionId) return json(res, {error: 'No session for this sage'}, 400);
    try {
      const response = await resumeClaude(body.message, sessionId);
      trackUsage(response);
      return json(res, {response: response.result});
    } catch (err) {
      return json(res, {error: err.message}, 500);
    }
  }

  if (req.method === 'GET' && url.pathname === '/api/download') {
    if (!state.question) {
      res.writeHead(400);
      return res.end('No session to download');
    }
    const protocol = buildProtocol();
    const slug = (state.title || 'session').slice(0, 40).replace(/[^a-z0-9а-яё]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
    const filename = `board-${slug}-${new Date().toISOString().slice(0, 10)}.md`;
    res.writeHead(200, {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });
    return res.end(protocol);
  }

  res.writeHead(404);
  res.end('Not found');
}

// --- Startup ---

function openBrowser() {
  const url = `http://localhost:${PORT}`;
  const cmd = process.platform === 'win32' ? `start ${url}`
    : process.platform === 'darwin' ? `open ${url}`
    : `xdg-open ${url} 2>/dev/null || wslview ${url} 2>/dev/null`;
  exec(cmd);
}

const server = http.createServer(handler);

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} already in use — board is already running.`);
    openBrowser();
    process.exit(0);
  }
  throw err;
});

server.listen(PORT, () => {
  console.log(`Board: http://localhost:${PORT}`);
  openBrowser();
});
