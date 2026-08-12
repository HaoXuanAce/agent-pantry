---
name: test-gap-hunter
description: Derive a focused, risk-based test plan when the user asks what tests are missing, wants regression tests for an escaped bug, or suspects weak snapshots or mocks hide behavior. Do not use as a substitute for a general code review.
---

# Test Gap Hunter

Find behavior that can break but is not meaningfully proven. Optimize for confidence gained, not test count or coverage percentage.

## Use this skill when

- reviewing a pull request or release;
- adding tests around legacy behavior;
- a regression escaped despite a green suite;
- deciding which tests are worth writing first.

## Workflow

### 1. Define the behavior delta

Describe what inputs, state transitions, outputs, side effects, or contracts changed. Ignore unchanged implementation details unless they constrain the new behavior.

### 2. Identify exposed invariants

List rules the system must preserve, such as:

- money is neither lost nor duplicated;
- authorization holds for every object and tenant;
- retries do not repeat non-idempotent effects;
- old and new clients can coexist;
- cancellation releases resources;
- errors do not commit partial state.

### 3. Build a compact risk matrix

Consider these dimensions:

- happy path;
- empty, minimum, maximum, and just-outside boundaries;
- malformed and adversarial input;
- dependency timeout, failure, and partial response;
- duplicate, retry, cancellation, and concurrency;
- locale, time zone, ordering, and numeric precision;
- permissions and tenant boundaries;
- version skew and migration state.

Rank each case by likelihood, impact, and whether another test already proves it.

### 4. Inspect existing evidence

Read assertions, not test names. Detect tests that only assert status codes, snapshot unstable markup, mock away the changed contract, or pass without reaching the intended branch.

### 5. Choose the right layer

- Unit test pure rules and boundary transformations.
- Integration test persistence, transactions, serialization, and adapter contracts.
- End-to-end test only the critical user journey and system wiring.

Prefer the lowest layer that can reproduce the risk without replacing the behavior under test with mocks.

### 6. Specify each proposed test

Every recommendation includes setup, action, observable assertion, and the regression it prevents. A test title alone is not a plan.

### 7. Implement only when authorized

If asked to add tests, follow repository conventions and run the narrowest relevant command. Do not change production behavior merely to make a weak test pass unless the discovered defect is also in scope.

## What not to recommend

- tests for framework internals;
- snapshots with no reviewed semantic contract;
- duplicate happy paths at multiple layers;
- implementation-detail assertions that block harmless refactors;
- cases justified only by raising coverage percentage.

## Output contract

1. **Behavior at risk**.
2. **Existing evidence** and what it genuinely proves.
3. **Ranked gaps** with risk rationale.
4. **Test specifications**: setup, action, assertion, layer.
5. **Deliberately omitted cases** and why they are low value.

If coverage is already adequate for the change, say so rather than inventing work.
