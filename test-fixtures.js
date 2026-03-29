// TEST MODE
//
// Type "test question" in the question field to run the full session
// flow with mock data — no API calls, no tokens spent.
//
// Flow: hatter #1 → sage round 1 → hatter #2 (questionnaire) → sage round 2 → hatter synthesis
//
// How it works: monkey-patches submitQuestion, submitAnswers,
// submitAnswers2, doReset. Only activates when the question exactly
// matches the trigger. Real sessions are unaffected.
//
// To disable: remove <script src="/test-fixtures.js"> from ui.html.
(function() {
const TEST_TRIGGERS = ['тестовый вопрос', 'test question', '测试问题', 'pregunta de prueba', 'question test', 'testfrage', 'テスト質問', 'teste', 'परीक्षण प्रश्न', 'سؤال تجريبي'];
let _active = false;

const TEST_DATA = {
  hatterQuestions: [
    {question: 'What is the main problem with your product?', options: ['No users', 'No monetization', 'Too broad a focus']},
    {question: 'What stage are you at right now?', options: ['Idea', 'Prototype', 'First users', 'Growth']},
    {question: 'How much time are you willing to invest?', options: ['Weekends', 'Half a day every day', 'Full-time']},
  ],
  sageResponses: SAGES.map((_, i) => ({
    index: i,
    preview: `${SAGES[i].name} sees ${['an opportunity', 'a risk', 'a pattern', 'a trap', 'an MVP', 'a story', 'a horizon'][i]} in this.`,
    round1: [
      `**The real question isn't about the product — it's about who needs it.** You're describing a solution, but I don't hear the problem. Who is this person who wakes up in the morning thinking: "I need exactly this"?\n\nThere are two types of products. The first is a painkiller. The second is a vitamin. Nobody buys vitamins until they start hurting. You need a painkiller.\n\n## What I would do\n\n- Throw out everything that "would be nice to have." Keep one thing that solves one problem for one type of user\n- Talk to ten people. Don't show the product — listen to what they say about their problem\n- If after ten conversations you can't say in one sentence what your product does — you don't have a product\n\n> Complexity is your enemy. Simplicity is what people pay for.`,
      `**Timing is everything.** It doesn't matter how good the idea is if the market isn't ready or is already saturated. I see a window, but it's closing.\n\nYour competitors are already moving in this direction. Not all of them, but enough. In six months, what's unique now will become a standard feature in three other products.\n\n## Positioning\n\n- Don't compete on features — compete on context. "For whom" matters more than "what it does"\n- Pick a niche where you can be first, not best\n- Build a bridge: what is already familiar to the user, and how does your product logically extend what they already use\n\n> The best strategy is not to fight on someone else's turf.`,
      `**Let's do the math.** Emotions aside — where will the money come from?\n\nYou're talking about a subscription. Good. How much does it cost to acquire one user? What's the LTV? If the subscription is $20/mo, you need a CAC below $60 with 6+ months retention. Is that realistic?\n\n## Unit economics\n\n- **Acquisition channel:** organic, word of mouth, content? Each is cheap but slow. Paid — fast but expensive\n- **Retention:** does your product solve a one-time problem or an ongoing one? One-time = poor retention = poor subscription\n- **Moat:** what stops a competitor from copying this over a weekend? Data? Community? Habit?\n\n> A business without economics is a hobby. Hobbies are wonderful, but don't call it a business.`,
      `**I don't like it.** And that's a good thing — that's why I'm here.\n\nYou're building on assumptions you haven't tested. "Users will want it" — how do you know? "The market is growing" — according to whose data? "There are no competitors" — did you really look?\n\n## Where it breaks\n\n- **Tail risks:** what if your only acquisition channel shuts down? What if regulators step in? What if a key API raises prices 10x?\n- **Asymmetry:** you're risking a year of work for potential you haven't quantified. That's not an investment — it's a lottery ticket\n- **Survivorship bias:** you're looking at those who survived. Not at the thousands who did the same thing and failed\n\n> Don't confuse optimism with analysis. Analysis is when you look for reasons why it WON'T work.`,
      `**How many weeks until the first version?** If the answer is "I don't know" — you don't have a plan, you have a dream.\n\nI'd break this into 6-week cycles. Each cycle — one thing you can show and get feedback on.\n\n## Scope\n\n- **Week 1-2:** The minimum you can show to one person. Not a "demo" — a working thing\n- **Week 3-4:** Feedback → adjustment. What to cut, what to add\n- **Week 5-6:** Get it to the state where "10 people can use it without my help"\n\nEverything else — next cycle. Not this one.\n\n> Shipped is better than perfect. And perfect is the enemy of shipped.`,
      `**You don't have a story.** You have a product, you have features, but you don't have a reason for someone to tell a friend.\n\nPeople don't retell features. They retell transformations. "I was X, now I'm Y because of Z." Where is your transformation?\n\n## Narrative\n\n- **Tribe:** who are your people? Not "all entrepreneurs," but a specific group with a shared language, pain, and rituals\n- **Enemy:** what are you against? Not competitors, but a state of the world that drives you crazy\n- **Ritual:** what recurring action ties the user to the product?\n\nWithout a story — you're noise. With a story — you're a movement.\n\n> Marketing is not advertising. Marketing is meaning, packaged so people want to pass it on.`,
      `**In ten years this will look completely different.** And the question isn't what to build now, but rather — which bricks will still be standing in ten years?\n\nInterfaces will change. Models will change. Platforms will change. What will remain?\n\n## Horizon\n\n- **Data** — if you're accumulating unique data that nobody else has — that's a compound advantage\n- **Habit** — if the user has built you into their workflow, switching costs are high\n- **Community** — if people came for other people, not for the product — that's a network, not a tool\n\nEverything else will be replaced. The question is: what part of your product will outlast the technology shift?\n\n> The best way to predict the future is to invent it.`,
    ][i],
    question: `How do you approach the question of ${['focus', 'positioning', 'economics', 'risks', 'scope', 'narrative', 'the future'][i]}?`,
  })),
  hatter2Questions: [
    {question: 'How do you define product focus and who it\'s for?', options: ['I already know exactly', 'I have a rough idea', 'Haven\'t decided yet']},
    {question: 'What\'s your approach to economics and risks?', options: ['I calculate unit economics', 'I go with intuition', 'Haven\'t thought about it yet']},
    {question: 'How quickly are you ready to launch the first version?', options: ['This weekend', 'In 6 weeks', 'When it\'s ready']},
    {question: 'How do you plan to attract first users?', options: ['Word of mouth', 'Content marketing', 'Paid advertising', 'Already have an audience']},
  ],
  round2: SAGES.map((_, i) => ({
    index: i,
    round2: [
      `**Having listened to my colleagues, let me clarify.** Maverick is right — you need to move fast. But moving fast doesn't mean moving without focus. Fast + no focus = fast into a wall.\n\nStrategist talks about positioning. I agree, but positioning is a consequence of focus, not the other way around. First understand who it's for, then — who it's against.\n\n## Adjusted recommendation\n\n- Choose one person. Literally one. Make it so they can't live without your product\n- When one person can't live without it — find ten more like them\n- When ten are paying — you know your focus`,
      `**Skeptic raised an important point about risks — but didn't finish the thought.** The main risk isn't regulators or competitors. The main risk is that you yourself will lose interest in 3 months because you don't see traction.\n\nSo timing matters: the first 6 weeks are decisive. If in 6 weeks you don't have 10 people who came back twice — that's not a product problem. That's a positioning problem.\n\n## Clarification\n\n- Don't build "a product for everyone, but starting with X." Build "a product for X. Period"\n- The bridge to the next segment is built only after you dominate the first one`,
      `**Visionary talks about a ten-year horizon. Beautiful. But you don't have ten years if you don't have revenue in 3 months.**\n\nLet's come back to the numbers. Product Person is right: 6-week cycles. But I'll add economics to each cycle.\n\n## Refined model\n\n- Cycle 1: 0 → 10 users. Price: free. Metric: retention week-2\n- Cycle 2: 10 → 30. Price: $X. Metric: conversion free → paid\n- Cycle 3: does unit economics converge? If yes — scale. If no — pivot`,
      `**I hear consensus and I don't like it.** When everyone agrees — usually everyone is wrong.\n\nFocuser says "one user." Product Person says "6 weeks." Everyone is right on tactics. But nobody answered the strategic question: **what if the problem you're solving doesn't exist?**\n\n## Antithesis\n\n- Before you focus — make sure there's something to focus on\n- 10 interviews before the first line of code. Not "I'll show a prototype," but "I'll listen to the pain"\n- If 7 out of 10 didn't say "shut up and take my money" — you don't have a problem`,
      `**I agree with Pragmatist on cycles, disagree on metrics.** Retention week-2 is a lagging indicator. You'll find out what's broken when it's already too late.\n\n## Better metrics for early stage\n\n- **Time to value:** how many seconds from first visit to the "aha moment"\n- **Referral rate:** how many people brought a friend without being asked\n- **Return frequency:** do they come back daily, weekly, monthly? This determines the monetization model`,
      `**Skeptic asks: "does the problem even exist?" Right question. Wrong method.** 10 interviews won't give you the answer. People lie in interviews — not because they're bad people, but because they don't know what they want until they see it.\n\n## How to actually validate\n\n- Make a landing page with a price. Not a product — a page. Spend $100 on ads\n- Who clicked "buy"? Those are your people. Talk to them\n- Conversion > 3%? There's a problem. < 1%? No problem`,
      `**Marketer is right about the landing, but thinking tactically.** $100 in ads will show current demand. It won't show future demand.\n\n## What I'll add\n\n- If you're building for a world that doesn't exist yet — interviews and landings are useless. Ford: "If I had asked people, they would have asked for a faster horse"\n- But! If you're not Ford (and you're not Ford), then start with existing pain and reframe it\n- Compound advantage is built from day one. Even if the first product is garbage, the data you collect is gold`,
    ][i],
  })),
  synthesis: `## Consensus\n\nThe board converges on three points:\n\n1. **Focus beats breadth.** Better to do one thing well than three things halfway.\n2. **Time is the key resource.** Not money, not ideas.\n3. **First users decide everything.** Without them — it's fantasy.\n\n## Disagreements\n\nSkeptic and Visionary disagree on the planning horizon. Skeptic insists on 6-week cycles, Visionary — on a 10-year vision.\n\n## Recommendation\n\nStart with **one fixed offer**. Six weeks. Ten paying users. Then scale.\n\n## The Flip\n\nWhat if the problem isn't the product? What if you yourself are the product? Your experience, knowledge, approach to solving problems — that's what people will pay for. The product is just packaging. Start selling yourself, not code.`,
};

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// --- Monkey-patch: intercept only when trigger matches ---

const _origSubmitQuestion = window.submitQuestion;
window.submitQuestion = async function() {
  const q = document.getElementById('inp-question').value.trim();
  if (TEST_TRIGGERS.includes(q.toLowerCase())) {
    _active = true;
    const btn = document.getElementById('btn-summon');
    const inp = document.getElementById('inp-question');
    btn.disabled = true; btn.textContent = t.summoning; inp.disabled = true;
    state.question = q; state.phase = 'hatter';
    show('sec-interview');
    document.getElementById('interview-list').innerHTML = `
      <div class="hatter-thinking">
        <div class="hatter-thinking-icon" aria-hidden="true">🎩</div>
        ${esc(t.hatterThinking)}
      </div>`;
    document.getElementById('sec-interview').scrollIntoView({behavior:'smooth'});
    updateStatus();
    await sleep(1500);
    state.interview = TEST_DATA.hatterQuestions.map(q => ({q: q.question, options: q.options, a: ''}));
    state._hatterStep = 0;
    renderHatterStep();
    updateStatus();
    return;
  }
  return _origSubmitQuestion.call(this);
};

const _origSubmitAnswers = window.submitAnswers;
window.submitAnswers = async function() {
  if (!_active) return _origSubmitAnswers.call(this);
  archiveInterview();
  show('sec-sages');
  SAGES.forEach((_, i) => document.getElementById(`sage-tab-${i}`).classList.add('thinking'));
  showSagesOverlay(t.sagePending);
  document.getElementById('sec-sages').scrollIntoView({behavior:'smooth'});
  state.phase = 'sages_round1';
  updateStatus();
  for (const sage of TEST_DATA.sageResponses) {
    await sleep(800);
    if (sage.index === 0) hideSagesOverlay();
    state.sages[sage.index] = {...state.sages[sage.index], ...sage};
    const tab = document.getElementById(`sage-tab-${sage.index}`);
    tab.classList.remove('thinking');
    tab.classList.add('filled');
    renderFilledSage(sage.index);
    if (!state.sages.some((s, j) => j < sage.index && s.round1)) switchTab(sage.index);
    updateSagesProgress();
    updateStatus();
  }
  // Hatter questionnaire #2
  await sleep(1000);
  state.phase = 'hatter2';
  show('sec-interview2');
  document.getElementById('interview2-list').innerHTML = `
    <div class="hatter-thinking">
      <div class="hatter-thinking-icon" aria-hidden="true">🎩</div>
      ${esc(t.hatter2Thinking)}
    </div>`;
  updateStatus();
  await sleep(1500);
  state.interview2 = TEST_DATA.hatter2Questions.map(q => ({q: q.question, options: q.options, a: ''}));
  state._hatter2Step = 0;
  renderHatter2Step();
  document.getElementById('sec-interview2').scrollIntoView({behavior:'smooth'});
  updateStatus();
};

const _origSubmitAnswers2 = window.submitAnswers2;
window.submitAnswers2 = async function() {
  if (!_active) return _origSubmitAnswers2.call(this);
  archiveInterview2();
  SAGES.forEach((_, i) => {
    if (state.sages[i].round1) document.getElementById(`sage-tab-${i}`).classList.add('thinking');
  });
  showSagesOverlay(t.round2pending);
  document.getElementById('sec-sages').scrollIntoView({behavior:'smooth'});
  state.phase = 'sages_round2';
  updateStatus();
  for (const r2 of TEST_DATA.round2) {
    await sleep(600);
    if (r2.index === 0) hideSagesOverlay();
    state.sages[r2.index].round2 = r2.round2;
    const tab = document.getElementById(`sage-tab-${r2.index}`);
    tab.classList.remove('thinking');
    renderFilledSage(r2.index);
    switchRoundTab(r2.index, 2);
    updateSagesProgress();
    updateStatus();
  }
  // Hatter synthesis thinking
  state.phase = 'synthesis';
  show('sec-synthesis');
  document.getElementById('synthesis-container').innerHTML = `
    <div class="hatter-thinking" style="padding:40px">
      <div style="font-size:48px;animation:thinkPulse 1.5s ease-in-out infinite">🎩</div>
      <div style="margin-top:12px">${esc(t.synthesisPending)}</div>
    </div>`;
  updateStatus();
  await sleep(2000);
  state.synthesis = TEST_DATA.synthesis;
  state.phase = 'done';
  renderSynthesis(TEST_DATA.synthesis);
  updateStatus();
  _active = false;
};

const _origDoReset = window.doReset;
window.doReset = async function() {
  _active = false;
  return _origDoReset.call(this);
};
})();
