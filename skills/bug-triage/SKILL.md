---
name: bug-triage
description: Turn a vague software symptom into a reproducible, evidence-backed root cause. Use when asked why something is failing, or for regressions, flaky tests, environment-only failures, production-only symptoms, and non-trivial fixes whose cause is not yet proven.
---

# Bug Triage

Diagnose before fixing. Produce the smallest causal explanation that accounts for the observed behavior.

## Use this skill when

- A user reports a failure without a known cause.
- Behavior changed after a release or dependency update.
- A test is flaky or only fails in one environment.
- Logs show symptoms far from the originating defect.

If the user only asks for an explanation, stop after diagnosis. A debugging request does not automatically authorize implementation. If the user explicitly asks for a fix, complete the diagnosis first, then implement and verify the smallest authorized correction.

## Evidence ladder

Prefer evidence in this order:

1. a deterministic reproduction;
2. a failing automated test;
3. a trace, log, or debugger observation;
4. a minimal experiment that changes one variable;
5. static code reasoning;
6. speculation, clearly labeled.

## Workflow

### 1. Normalize the report

Extract expected behavior, actual behavior, frequency, affected versions, environment, and the last known good state. Do not invent missing values.

### 2. Protect the scene

- Read repository instructions.
- Check the worktree and preserve unrelated changes.
- Do not delete caches, reset state, rewrite lockfiles, or modify production data as a diagnostic shortcut.
- Redact secrets and personal data from output.

### 3. Reproduce at the narrowest layer

Start with the smallest existing command or test that exercises the behavior. If reproduction is expensive, create a minimal, reversible probe inside the authorized scope.

Record the exact command, input, result, and whether the failure is deterministic.

### 4. Bound the regression

Compare working and failing paths:

- inputs and validation;
- configuration and environment;
- dependency or schema versions;
- concurrency and timing;
- permissions and identity;
- error handling and retries.

Change one variable at a time.

### 5. Rank hypotheses

Maintain no more than three active hypotheses. For each, state:

- why it fits;
- what evidence would falsify it;
- the cheapest discriminating check.

Run the highest-information check first, not the easiest-looking edit.

### 6. Trace the causal chain

Find the earliest incorrect state, not merely the final exception. Explain:

`trigger → violated assumption → incorrect state → visible symptom`

### 7. Confirm the root cause

A root cause is confirmed only when one of these is true:

- correcting or isolating it makes the reproduction pass;
- a focused test fails before and passes after the proposed change;
- direct instrumentation observes the violated assumption.

### 8. Define the fix boundary

Recommend the smallest change that removes the cause and preserves contracts. List the regression test and any monitoring or cleanup needed.

## Stop conditions

Stop and report the blocker when reproduction needs unavailable credentials, destructive production access, private user data, or a product decision between valid behaviors.

## Output contract

1. **Reproduction** — command, input, expected, actual, consistency.
2. **Root cause** — one sentence followed by the causal chain.
3. **Evidence** — paths, lines/symbols, logs, and experiments.
4. **Rejected hypotheses** — what was ruled out and how.
5. **Fix boundary** — minimal change, regression test, residual risk.

When implementation was explicitly requested, add **Implemented and verified** with the files changed and focused checks run.

Never present an untested guess as a confirmed root cause.
