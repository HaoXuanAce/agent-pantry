---
name: repo-xray
description: Map an unfamiliar codebase before making changes. Use when asked where behavior lives, how a system works, for onboarding or architecture questions, or when a change crosses unknown modules. Skip this skill when the target and behavior are already known to be a small one-file edit.
---

# Repo X-Ray

Build a compact, evidence-backed map of a repository before proposing or making changes.

## Use this skill when

- The repository is unfamiliar or poorly documented.
- A requested change may cross modules, services, or packages.
- The user asks where a behavior lives or how a system works.
- Existing conventions must be discovered before implementation.

Do not use it for a tiny, isolated edit whose file and behavior are already known.

## Operating rules

1. Treat repository instructions as constraints. Find `AGENTS.md`, `CLAUDE.md`, contribution guides, and package-level instructions before inspecting implementation.
2. Prefer repository evidence over names. A folder named `services` is not proof of a service boundary.
3. Trace one representative behavior end to end instead of listing every file.
4. Label conclusions as **observed**, **inferred**, or **unknown**.
5. Do not modify files during an X-ray unless the user separately asked for implementation.

## Workflow

### 1. Establish the perimeter

- Identify languages, package managers, workspace configuration, and primary commands.
- Note generated, vendored, build, and cache directories to exclude.
- Record the current worktree state so user changes are not mistaken for project defaults.
- Set an investigation timebox proportional to the task. Extend it only when a newly discovered boundary materially changes the requested work.

### 2. Find the entry points

- Locate application boot files, routes, CLI bins, workers, scheduled jobs, and exported libraries.
- Inspect manifests and configuration before following imports.
- Identify how environment variables and secrets enter the process without printing their values.

### 3. Trace one vertical slice

Choose the behavior closest to the task and follow:

`entry → validation → orchestration → domain logic → persistence/external I/O → response`

For UI work, follow:

`route → view → state → request → server handler → data source`

Capture exact file paths and the symbols that connect each step.

### 4. Identify boundaries and ownership

- Which package owns the domain rule?
- Where are public contracts defined?
- Which modules may depend on each other?
- Where do tests, fixtures, and migrations live?
- What is configuration and what is business behavior?

### 5. Map the change surface

List the smallest likely set of files for the requested work. Separate:

- required edits;
- likely tests or fixtures;
- generated files that should not be hand-edited;
- adjacent files that are relevant but should remain unchanged.

### 6. Verify the map

Use targeted searches to disprove the first model. Check for duplicate routes, alternate implementations, feature flags, aliases, or compatibility layers.

## Stop conditions

Pause and ask the user when:

- two active implementations exist and product intent determines which is correct;
- required source code is generated or unavailable;
- repository instructions conflict;
- the requested change crosses a security or data boundary not covered by the request.
- the agreed timebox expires before the map can be supported by evidence.

## Output contract

Return these sections:

1. **System in one paragraph** — what runs, where, and for whom.
2. **Architecture path** — the traced vertical slice with file evidence.
3. **Change surface** — required files and why each is involved.
4. **Risks and unknowns** — ranked, with observed/inferred labels.
5. **Recommended first move** — the smallest safe next action.

Avoid directory dumps, generic framework explanations, and claims without paths or symbols.
