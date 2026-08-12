---
name: release-readiness
description: Decide whether a change is safe to deploy or launch. Use for ship decisions, release checklists, feature flags, canaries, migrations, artifact provenance, observability, rollout, and rollback planning.
---

# Release Readiness

Produce an evidence-based ship decision. A green build is one input, not the decision.

## Inputs to establish

- exact release artifact, tag, commit, or diff;
- target environment and rollout method;
- affected users, data, integrations, and operators;
- release window and recovery constraints;
- ownership for rollout and rollback.

If the artifact or target is ambiguous, resolve that before assessing readiness.

## Workflow

### 1. Summarize changed behavior

Explain what users or systems will observe differently. Include configuration-only changes, dependency updates, migrations, and infrastructure changes.

### 2. Classify risk

Rate impact and reversibility for:

- data writes and schema evolution;
- authentication, authorization, billing, and secrets;
- public API or event contracts;
- availability and latency;
- background jobs, retries, and idempotency;
- third-party dependencies;
- client/server version skew.

Risk is higher when the blast radius is broad, detection is slow, or rollback cannot restore prior state.

### 3. Verify evidence

Run the smallest relevant checks allowed by the repository. Confirm the actual outcome of tests rather than merely listing configured scripts. Inspect skipped tests, quarantined suites, and environment-dependent gaps.

### 4. Audit data and contracts

For every migration or contract change, determine:

- forward and backward compatibility;
- order of application;
- behavior during mixed-version deployment;
- lock or resource cost;
- whether rollback loses or corrupts new data.

### 5. Check configuration and dependencies

Confirm required environment variables, defaults, feature flags, runtime permissions, dependency integrity, and deployment manifests. Never print secret values.

### 6. Define observability

Name the signals that prove success or detect failure: error rate, latency, queue depth, business events, data invariants, or targeted logs. Provide thresholds and an observation window where possible.

### 7. Design rollout and rollback

Prefer the smallest blast radius: preview, canary, percentage rollout, region, tenant, or feature flag. A rollback plan must state the trigger, command or procedure, owner, expected duration, and data implications.

### 8. Make the decision

Choose one:

- **GO** — evidence covers material risks and rollback is executable;
- **GO WITH CONDITIONS** — named, time-bounded checks must occur during rollout;
- **NO-GO** — a blocking risk lacks mitigation or evidence.

## Non-negotiable blockers

- unknown recovery or compensation strategy for a migration or irreversible data effect;
- missing authorization coverage on a changed protected path;
- no way to detect the primary failure mode;
- required secrets or config absent in the target;
- release artifact does not match what was verified.

## Output contract

1. **Decision** and confidence.
2. **Change and blast radius**.
3. **Evidence checked** with results.
4. **Blocking risks** and owners.
5. **Rollout plan** with success signals.
6. **Rollback plan** with triggers and data caveats.

Never call a release safe solely because CI is green.
