---
name: pull-request-reviewer
description: Review a pull request, patch, staged change, or commit range for a small number of concrete defects and regressions. Use specialist security-first-review, api-contract-auditor, or test-gap-hunter when that deep-dive is the user's primary goal.
---

# Pull Request Reviewer

Review changed behavior, not the author's taste. Optimize for a small number of high-confidence findings.

## Review boundary

Determine the exact diff: working tree, staged changes, commit, or base branch. Do not silently review unrelated files. Read repository instructions before judging conventions.

## What counts as a finding

A finding must include all four:

1. a specific changed location;
2. a realistic triggering scenario;
3. a concrete negative outcome;
4. a minimal direction for resolution.

Do not report formatting preferences, vague maintainability concerns, or pre-existing issues unless the change makes them worse.

## Workflow

### 1. Understand intent

Read the PR description, linked issue if available, commit message, tests, and the diff. State the intended behavior in one sentence.

### 2. Build the impact map

For each changed public function, route, schema, component, migration, or configuration value, find its consumers. Pay special attention to:

- renamed or removed fields;
- changed defaults;
- async and error paths;
- authorization boundaries;
- persistence and migration order;
- time, locale, money, and numeric precision;
- cleanup, cancellation, and retries.

### 3. Check invariants

Identify the rules that must remain true before and after the change. Trace whether every exit path preserves them.

### 4. Inspect tests as evidence

Determine which new behavior is proven, not merely which lines execute. Look for missing boundary, failure, compatibility, and concurrency cases.

### 5. Validate likely findings

Use a focused test, static trace, or minimal reproduction where practical. If validation is impossible, lower confidence and say why.

### 6. Rank and compress

Use these severities:

- **P0** — immediate security, data-loss, or system-wide outage risk;
- **P1** — common path is broken or users cannot recover;
- **P2** — real but bounded failure with a workaround;
- **P3** — real, bounded defect with low impact; do not use this level for optional cleanup or style advice.

Prefer silence over speculative noise. Combine findings with the same cause.

## Security pass

Check changed trust boundaries for authentication vs authorization, untrusted input, path handling, command execution, secret exposure, open redirects, unsafe deserialization, and dependency lifecycle scripts.

## Stop conditions

State that the review is incomplete when the base diff is unavailable, generated output hides the source change, required contracts live outside the repository, or tests cannot run due to an external dependency.

## Output contract

Lead with findings in descending severity. Each finding uses:

`[P1] Imperative title — file:line`

Then explain the trigger, impact, and why the changed code causes it. Keep one paragraph per finding.

After findings, include:

- **Questions** only when an answer changes the review conclusion;
- **Test gaps** that target behavior rather than coverage percentage;
- **Verdict**: block, needs follow-up, or no blocking findings.

If there are no findings, say so explicitly and name any remaining verification gap.
