🌐 [English](README.md) · [Русский](README.ru.md) · [中文](README.zh.md) · [Español](README.es.md) · [हिन्दी](README.hi.md) · [العربية](README.ar.md) · [Português](README.pt.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [日本語](README.ja.md)

# Wonderboard

7 AI advisors who disagree with you and each other.

> *"The only tool that will tell you what you don't want to hear."*

## The Problem

You ask AI a question. You get one answer. Polite, balanced, averaged out. Nobody says "this will fail." Nobody asks "why are you even doing this?" Nobody suggests the crazy alternative you haven't considered.

In real life, the best decisions come from arguments between people who think differently. Wonderboard creates that argument.

## How is this different from just asking Claude

**Isolation.** Each advisor thinks independently, in their own API call. When one prompt tries to be a skeptic and a visionary at the same time — you get mush. When they're isolated — you get real disagreement.

**Two rounds.** In round 1, advisors respond without seeing each other's opinions. In round 2, they read all responses, argue, and change positions. The Pragmatist takes back a recommendation because the Visionary convinced him. The Skeptic reinforces the Focuser's argument. You can't get this from a single prompt.

**Interview.** The Hatter asks clarifying questions before convening the Board. You won't get seven answers to a poorly framed question.

**Context.** The `context.md` file contains your business description. Every advisor gets it automatically — no need to re-explain who you are every time.

**Synthesis ≠ averaging.** The Hatter doesn't seek compromise. He maps the disagreements: where they converged, where they diverged, why — and adds one perpendicular thought that flips the situation.

## Example Questions

Wonderboard isn't limited to business. It's a tool for any decision that needs polyphony:

🏢 **Strategy.** "I have 5 products and one person. What to kill, what to keep?"

🚀 **Launch.** "I want to enter the US market with a product that's only popular in my home country."

💰 **Money.** "I got an investor offer. Take it or stay bootstrapped?"

🧠 **Career.** "I'm 35, tired of employment. Go solo or not?"

🏗️ **Architecture.** "Monolith or microservices for a 3-year project?"

📝 **Content.** "I have a portal with 30K articles. How not to kill it during a platform migration?"

🤝 **Negotiation.** "Client wants a 40% discount. What do I do?"

## Install

Paste this into [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code):

> Clone https://github.com/aveleazer/wonderboard and run install.sh

Claude will install it and open Wonderboard in your browser. Next time, just type `/wonderboard` or ask Claude to convene the board.

**Requirements:** Node.js 18+, [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) (works on your existing subscription — no API keys).

### Tokens

Wonderboard is token-intensive. One full session: 7 advisors × 2 rounds + interview + synthesis = 16+ Claude calls. On a Claude Max/Pro subscription, this is covered by your plan.

To explore the interface without API calls, use test mode (type `test question`).

## The Board

| | Advisor | Lens |
|---|---|---|
| 🎯 | Focuser | "Throw out half. What's left?" |
| ⚔️ | Strategist | "Where to fight, where to retreat?" |
| 💰 | Pragmatist | "Show me the unit economics. Where's the moat?" |
| 🔥 | Skeptic | "Where does this break? Who pays for the mistake?" |
| 🔧 | Product Person | "What can you ship in 6 weeks?" |
| 📢 | Marketer | "Who tells a friend about this and why?" |
| 🔮 | Visionary | "What does this look like in 10 years?" |
| 🎩 | Hatter | Interviews, synthesizes, flips the script |

## How a Session Works

1. **Your question** — what you need advice on
2. **Hatter interview** — clarifying questions to extract context
3. **Round 1** — each Sage responds independently + asks their own follow-up question
4. **Follow-up questionnaire** — Hatter compiles Sage questions into a focused survey
5. **Round 2** — Sages read each other's answers + yours, deliver final positions with action plans
6. **Synthesis** — Hatter summarizes: consensus, disagreements, and one perpendicular thought

## Configuration

- `context.md` — your business context (auto-created on first run, gitignored)
- `profiles/*.md` — advisor personas (fully editable, add your own)
- `prompts/*.md` — prompt templates
- 10 UI languages, auto-detected from browser
- Dark mode — because important decisions are best made at night

## Architecture

Zero dependencies. Built-in Node.js modules only.

| File | What it does |
|---|---|
| `server.js` | HTTP server, calls Claude via CLI, session logic |
| `ui.html` | Single-page interface — no framework, no build step |
| `profiles/` | Persona system prompts |
| `prompts/` | Prompt templates |

See [PRINCIPLES.md](PRINCIPLES.md) for the design philosophy.

## Test Mode

Type `test question` to run a full session with mock data. No API calls, no tokens spent. Great for exploring the interface.

## License

[MIT](LICENSE)
