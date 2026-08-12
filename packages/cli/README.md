# Agent Pantry CLI

Inspect and install human-reviewed Agent Skills for Codex, Claude Code, Cursor, Gemini CLI, and GitHub Copilot.

```bash
npx agent-pantry list
npx agent-pantry inspect vibe-to-verified
npx agent-pantry add vibe-to-verified --agent codex --dry-run
npx agent-pantry add vibe-to-verified --agent codex
```

## Transparent installation

The CLI bundles the same plain-text `skills/` directories published in the [Agent Pantry repository](https://github.com/HaoXuanAce/agent-pantry). It validates a Skill before touching an existing installation, stages the copy, and then swaps it into the exact target directory.

Existing Skills are never replaced without `--force`. Use `diff` before updating:

```bash
npx agent-pantry diff vibe-to-verified --agent codex
npx agent-pantry add vibe-to-verified --agent codex --force
```

Remove only the named Skill and target agent path:

```bash
npx agent-pantry remove vibe-to-verified --agent codex --yes
```

## Mission packs

```bash
npx agent-pantry pack list
npx agent-pantry pack add trust-ai-code --agent codex --dry-run
```

## Commands

```text
agent-pantry list [--phase <name>]
agent-pantry search <query>
agent-pantry inspect <skill>
agent-pantry add <skill> --agent <agent> [--global] [--force] [--dry-run]
agent-pantry diff <skill> --agent <agent> [--global]
agent-pantry remove <skill> --agent <agent> [--global] --yes
agent-pantry pack list
agent-pantry pack add <pack> --agent <agent> [--global] [--force] [--dry-run]
agent-pantry verify [skill]
agent-pantry doctor
```

No account, API key, daemon, or telemetry is used. Installation copies files and never executes bundled Skill scripts.

