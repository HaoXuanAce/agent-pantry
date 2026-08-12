---
name: browser-acceptance-evidence
description: Verify a web user journey in a real browser and produce auditable evidence. Use for acceptance testing, pre-release browser QA, screenshot proof, console or network checks, responsive flows, keyboard accessibility, or when the user asks to prove that a frontend workflow actually works.
compatibility: Requires an available browser-control tool for interactive verification.
---

# Browser Acceptance Evidence

Prove an observable user outcome in a real browser. A successful build, HTTP 200, or DOM snapshot is not acceptance evidence by itself.

## Boundary

This skill verifies an existing reachable application. It does not implement missing product behavior unless the user separately asks for fixes. Use local, preview, staging, or an explicitly authorized environment; avoid production mutations.

## Workflow

### 1. Define the acceptance contract

Turn the request into explicit journeys:

- starting state and identity;
- viewport and device assumptions;
- user actions;
- observable success state;
- important failure or empty state;
- data mutation and cleanup implications.

Do not infer credentials or destructive consent.

### 2. Establish the environment

Record URL, build or commit, browser family, viewport, authentication state, feature flags, seed data, and time. Confirm the environment corresponds to the code under review.

### 3. Capture baseline evidence

Before interaction, check page title and primary landmarks, visible error states, console errors, failed or unexpected network requests, layout at the target viewport, and current data state. Ignore known noise only when documented.

### 4. Execute like a user

Use semantic controls and visible text rather than brittle coordinates where possible. For each step, record action, expected result, actual result, and evidence reference. Wait for observable state rather than arbitrary sleeps.

### 5. Verify multiple channels

For material steps, corroborate visible UI with relevant URL, accessibility state, network outcome, console state, persisted or refreshed behavior, and focus position. Do not inspect cookies, passwords, tokens, or browser storage unless explicitly required and authorized.

### 6. Exercise critical variants

At minimum, test the requested happy path and the highest-risk applicable variant:

- validation or server failure;
- empty or loading state;
- narrow and wide viewport;
- keyboard-only operation and visible focus;
- refresh, back navigation, cancellation, or duplicate submit.

Choose variants based on risk rather than running a fixed checklist blindly.

### 7. Capture evidence

Create a manifest for screenshots or recordings with step, viewport, timestamp, and what the artifact proves. Capture only necessary user data and redact sensitive content. A screenshot should show the relevant state, not merely the whole screen.

### 8. Report without overclaiming

Distinguish passed journeys, failed journeys, blocked journeys, and areas not tested. A single browser and viewport do not prove cross-browser compatibility.

## Stop conditions

Stop when browser control is unavailable, authentication needs user action, the target environment cannot be tied to the requested build, a journey would create destructive or expensive production data, or required evidence would expose sensitive information.

## Output contract

1. **Environment** — URL, build, browser, viewport, identity class.
2. **Journey table** — step, expected, actual, result.
3. **Evidence manifest** — screenshot/recording and what each proves.
4. **Console and network observations**.
5. **Keyboard and responsive results**.
6. **Failures, blockers, and untested scope**.

Never claim visual parity or cross-browser coverage without the corresponding comparison evidence.

