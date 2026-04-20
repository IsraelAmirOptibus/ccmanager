# CCManager

A terminal UI for running and switching between multiple AI coding-agent sessions (Claude Code, Gemini CLI, Codex, Cursor Agent, Copilot CLI, Cline, OpenCode, Kimi) — one session per Git worktree, all visible in a single menu with live status indicators.

This build adds **Shift+Enter for multi-line prompts** inside a session and **one-click notification presets** (macOS banners, `say`, Linux `notify-send`, terminal bell) for status-change hooks — see [Additions in this build](#additions-in-this-build) for details.

## What it does

- **Parallel sessions across worktrees.** Each worktree gets its own agent session running in the background; switch between them from a menu without losing state.
- **Live status.** The menu shows whether each session is **busy**, **waiting for input**, or **idle**, so you know where to look.
- **Worktree management.** Create, merge, and delete Git worktrees from inside the TUI.
- **Multi-project mode.** Point it at a directory and it discovers every Git repo underneath, so you can jump between projects as well as worktrees.
- **Status-change hooks with notification presets.** Run a shell command whenever a session's state changes — pick a ready-made notification (macOS banner, `say`, `notify-send`, terminal bell) or supply your own.
- **Keyboard shortcuts.** Customizable bindings for menu navigation, filtering, and session controls — including **Shift+Enter** for inserting newlines in multi-line agent prompts.
- **Command presets.** Configure which agent and arguments to launch, with automatic fallbacks.
- **Devcontainer integration.** Run the agent inside a container while CCManager stays on the host.
- **Auto-approval (experimental).** Optionally let CCManager auto-confirm safe Claude Code prompts.
- **Session restoration.** Returning to a session replays the terminal state, so your scrollback is intact.

## Additions in this build

### Shift+Enter → newline

Inside an active session, **Shift+Enter** inserts a literal newline instead of submitting. Useful for writing multi-line prompts to Claude / Codex / etc. It works even after the child agent redraws its UI or you jump between worktrees, because CCManager re-asserts the terminal's `modifyOtherKeys` mode and strips conflicting escape sequences from the child's output.

### Notification hook presets

Under **Global Configuration → Configure Status Hooks**, each status (busy / waiting / idle) now offers one-click presets instead of only a custom command field:

- macOS notification
- macOS notification including the worktree branch name
- macOS `say` (text-to-speech)
- Linux `notify-send`
- Terminal bell
- …or write your own

Picking a preset fills in the shell command for you; you can still edit or replace it.

## Install

```bash
npm install -g @israel-amir/ccmanager
```

Requires Node.js. No other setup needed — `dist/` is shipped prebuilt.

## Usage

```bash
ccmanager
```

Or without installing:

```bash
npx @israel-amir/ccmanager
```

### Multi-project mode

```bash
export CCMANAGER_MULTI_PROJECT_ROOT="/path/to/your/projects"
ccmanager --multi-project
```

### Keyboard shortcuts (defaults)

- **Ctrl+E** — return to the menu from an active session
- **Esc** — cancel / back in dialogs
- **/** — filter the menu
- **Shift+Enter** — newline inside a session (this fork)

Customize in **Global Configuration → Configure Shortcuts**.

## How the session model works

Each session is a real PTY running the agent command inside the worktree's directory. CCManager keeps it alive across menu navigation — when you re-enter a session it writes the saved terminal snapshot back to your screen, so you see exactly what you left. Status detection reads the child's output through a headless xterm, so busy/waiting/idle reflect the actual UI of whichever agent you're using.

Status hooks fire whenever a session transitions between states, receiving env vars like `CCMANAGER_NEW_STATE`, `CCMANAGER_WORKTREE_BRANCH`, `CCMANAGER_WORKTREE_DIR`, and `CCMANAGER_PRESET_NAME` — enough to tailor a notification per project or per agent.

## Supported agents

| Agent | Command |
|-------|---------|
| Claude Code (default) | `claude` |
| Gemini CLI | `gemini` |
| Codex CLI | `codex` |
| Cursor Agent | `cursor-agent` |
| Copilot CLI | `copilot` |
| Cline CLI | `cline` |
| OpenCode | `opencode` |
| Kimi CLI | `kimi` |

## Development

```bash
npm install
npm run dev        # watch mode
npm run build
npm test
npm run lint
npm run typecheck
```

---

Based on [kbwo/ccmanager](https://github.com/kbwo/ccmanager), with added improvements such as **Shift+Enter for multi-line prompts** and **one-click notification presets** for status-change hooks (macOS banners, `say`, Linux `notify-send`, terminal bell). All upstream features are preserved.
