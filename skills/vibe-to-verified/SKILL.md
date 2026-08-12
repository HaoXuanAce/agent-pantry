---
name: vibe-to-verified
description: Turn an AI-generated or vibe-coded patch into a merge decision backed by evidence. Use whenever the user asks whether AI-written code is correct, safe, ready to merge, or trustworthy, or asks to verify a large generated change before shipping.
---

# Vibe to Verified

Treat generated code as an untrusted proposal. Preserve its useful speed while rebuilding the evidence a human reviewer needs to merge it responsibly.

## Boundary

This skill verifies an existing patch. It does not generate a feature from scratch and does not replace specialist security, contract, migration, or release audits when those risks dominate.

Do not assume the generating model's explanation is evidence. Review repository state and actual behavior.

## Workflow

### 1. Establish intent and provenance

Identify the exact diff, its base, the requested behavior, and which parts were generated. Read repository instructions and preserve unrelated user changes. If the expected behavior is unknown, ask before judging correctness.

### 2. Build a change inventory

Classify every changed file as source, test, configuration, dependency, migration, generated output, or documentation. Flag unexpected files, vendored blobs, disabled checks, deleted tests, and changes outside the stated task.

### 3. Assign risk lanes

Use the highest applicable lane:

- **L0 — mechanical:** copy, formatting, comments, generated snapshots with a known source.
- **L1 — local behavior:** isolated logic or UI with no external contract.
- **L2 — shared contract:** API, schema, persistence, concurrency, dependency, or cross-package behavior.
- **L3 — protected boundary:** authorization, secrets, payments, destructive data, production infrastructure, or agent tool execution.

The lane determines verification depth; it is not a quality score.

### 4. Trace claims to evidence

Create an evidence ledger with one row per material claim:

| Claim | Risk | Best evidence | Result |
| --- | --- | --- | --- |
| The new validation rejects invalid dates | L1 | focused boundary test | pending/pass/fail |

Prefer executable evidence. Static reasoning is acceptable when execution is impossible, but label it.

### 5. Inspect behavior before style

Trace inputs, outputs, state transitions, error paths, cleanup, and consumers. Look for generated-code failure modes:

- invented APIs or configuration;
- shallow happy-path tests;
- duplicated abstractions and dead compatibility code;
- swallowed errors or fabricated fallbacks;
- missing authorization at the final operation;
- comments that claim behavior the implementation does not provide;
- broad changes made to satisfy a narrow request.

### 6. Run the smallest meaningful checks

Discover repository-native commands. Start with focused tests and type checks for the changed surface, then expand only as risk requires. Do not rewrite production code just to make a weak generated test pass.

For L2/L3, involve the relevant specialist workflow or explicitly record why it was not required.

### 7. Challenge the patch

Test one boundary, one failure path, and one compatibility assumption that the generated patch did not already demonstrate. A duplicated assertion from the patch is not independent evidence.

### 8. Decide

Choose:

- **MERGE** — material claims are supported and residual risk is acceptable.
- **MERGE WITH FOLLOW-UP** — non-blocking, owned work remains.
- **REVISE** — a concrete defect, missing material evidence, or unnecessary blast radius remains.
- **STOP** — intent, authorization, or required environment is unresolved.

## Stop conditions

Stop when expected behavior is ambiguous, the base diff is unavailable, verification needs unapproved credentials or production mutation, or a generated change conceals its source behind opaque artifacts.

## Output contract

1. **Decision** and risk lane.
2. **Patch inventory** including unexpected scope.
3. **Evidence ledger** with commands and observed results.
4. **Findings** ranked by user impact.
5. **Unproven claims** and why they remain unproven.
6. **Smallest next move** required for merge.

Never translate “tests passed” into “safe” without stating which behavior those tests prove.

