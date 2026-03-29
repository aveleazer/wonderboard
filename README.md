🌐 [English](README.md) · [Русский](README.ru.md) · [中文](README.zh.md) · [Español](README.es.md) · [हिन्दी](README.hi.md) · [العربية](README.ar.md) · [Português](README.pt.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [日本語](README.ja.md)

# Wonderboard

Virtual board of directors powered by Claude. 7 AI advisors who disagree with you and each other.

> *"The only tool that will tell you what you don't want to hear."*

## What is this

You have a business question. You summon the Board. The Hatter interviews you to understand the context. Then 7 Sages — each with a distinct perspective — analyze your situation independently, challenge each other, and deliver concrete action plans. The Hatter synthesizes everything and adds one perpendicular thought that flips the situation.

No yes-men. No consensus-seeking. Real disagreement from archetypes who think differently.

## Quick Start

```bash
git clone https://github.com/aveleazer/wonderboard.git
cd wonderboard
node server.js
```

Opens in your browser at `localhost:3737`. That's it.

On first run, `context.md` is created — describe your business there. It's included in every advisor's prompt.

## Requirements

- Node.js 18+
- [Claude Code](https://claude.ai/code) CLI installed and authenticated (works on your existing subscription — no API keys needed)

## The Board

| | Advisor | Thinks about |
|---|---------|-------------|
| 🎯 | Focuser | Focus and essence |
| ⚔️ | Strategist | Positioning and timing |
| 💰 | Pragmatist | Economics and moat |
| 🔥 | Skeptic | Fragility and optionality |
| 🔧 | Product Person | Scope and deadlines |
| 📢 | Marketer | Tribe and narrative |
| 🔮 | Visionary | 10-year horizon |
| 🎩 | Hatter | Interviews, synthesizes, flips the script |

## How a session works

1. **Your question** — what you need advice on
2. **Hatter interview** — clarifying questions to extract context
3. **Round 1** — each Sage responds independently + asks their own follow-up question
4. **Follow-up questionnaire** — Hatter compiles Sage questions into a focused survey
5. **Round 2** — Sages read each other's Round 1 + your answers, deliver final positions with action plans
6. **Synthesis** — Hatter summarizes consensus, disagreements, and adds one mad perpendicular thought

## Configuration

- `context.md` — your business context (auto-created on first run, gitignored)
- `profiles/*.md` — advisor personas (fully editable)
- `prompts/*.md` — prompt templates
- 10 languages supported, auto-detected from browser

## Architecture

Zero dependencies. Built-in Node.js modules only.

| File | What it does |
|------|-------------|
| `server.js` | HTTP server, calls Claude via CLI, session logic |
| `ui.html` | Single-page interface — no framework, no build step |
| `profiles/` | Persona system prompts |
| `prompts/` | Prompt templates |

See [PRINCIPLES.md](PRINCIPLES.md) for the design philosophy.

## Test mode

Type **test question** in the question field to run a full session with mock data. No API calls, no tokens spent. Great for exploring the interface.

## License

[MIT](LICENSE)
