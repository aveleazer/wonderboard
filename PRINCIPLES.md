# Cherny Principle

The bar: if Boris Cherny (creator of Claude Code) saw this project, he'd say "I wouldn't have done it better."

Solo developer who built a tool for himself — and it became a product for everyone. Same story here.

## 7 Angles

### 1. Zero middlemen
Nothing unnecessary between the user and the result. If an action is mechanical — code does it, not an agent.

### 2. Zero dependencies
If you can't read every line that runs — you don't control it. Built-in modules only. No CDN, no npm, no package trees.

### 3. Runs on subscription
Works on what the user already pays for. No API keys, no separate accounts, no token anxiety.

### 4. Copy and run
Installation = copy folder + one command. No build steps, no config wizards, no registration.

### 5. One interface
The user looks in one place. No jumping between terminal and browser. No context switching.

### 6. Skill = door
One word to enter. Behind the door — anything. But the door is always one word.

### 7. AI thinks, code routes
AI generates what requires intelligence. Code handles everything else: data flow, rendering, storage. The boundary is crisp.

## Code Principles

1. **One file, one responsibility.** `server.js` — server and logic. `ui.html` — interface. `profiles/*.md` — personas. No abstractions, helpers, or utility files.

2. **A function does one thing.** `callClaude` calls claude. `parseSageResponse` parses a response. `broadcast` sends SSE. No God-functions.

3. **No premature abstractions.** Three similar lines are better than one abstraction that needs explaining. Abstract only when duplication hurts readability.

4. **Errors next to the call.** try/catch wraps the specific `callClaude`, not the entire flow. One sage fails → error on that card. Others keep working.

5. **No obvious comments.** `// broadcast to all clients` before `broadcast()` is noise. Comment only when the code isn't self-evident.

6. **Names from the domain.** `sage`, `hatter`, `round1`, `synthesis` — not `processor`, `handler`, `manager`. Code reads like a session description.

7. **Everything in English.** Code, prompts, comments. User's language is set by one line: `Respond in ${lang}` — not by duplicating prompts.
