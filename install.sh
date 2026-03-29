#!/usr/bin/env bash
# install.sh — register Wonderboard as a Claude Code skill
set -euo pipefail

BOARD_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_DIR="$HOME/.claude/skills/board"

# Check node
if ! command -v node &>/dev/null; then
  echo "ERROR: Node.js not found. Install Node.js 18+ and try again."
  exit 1
fi

NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "ERROR: Node.js 18+ required, found $(node -v)"
  exit 1
fi
echo "OK Node.js $(node -v)"

# Check claude CLI
if ! command -v claude &>/dev/null; then
  echo "ERROR: Claude Code CLI not found."
  echo "  Install: https://claude.ai/code"
  exit 1
fi
echo "OK Claude Code CLI"

# Install skill
mkdir -p "$SKILL_DIR"
cat > "$SKILL_DIR/SKILL.md" << SKILL
---
name: board
description: "Virtual board of directors — 7 AI advisors for strategic consultations. Use when the user wants business advice, a board session, or a polyphony of opinions on a strategic question. Triggers: 'board', 'board of directors', 'session', 'convene the board', 'ask the sages'."
---

# Board Launcher

1. Check server: \`curl -s -o /dev/null -w "%{http_code}" http://localhost:3737/\`
2. If not 200: \`cd ${BOARD_DIR} && node server.js &\` and wait 2s
3. Open browser: the server auto-opens on start
4. Tell user: "Board is open in the browser. The entire session runs there."

Do not orchestrate the session. The server handles everything.
SKILL

echo "OK Skill installed to $SKILL_DIR"
echo ""
echo "Done! Type /board in Claude Code to start a session."
