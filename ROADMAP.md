# Roadmap

Agent Pantry grows by closing real workflow gaps, not by chasing a catalog count. The order below is a direction, not a release promise.

## Next engineering milestones

- publish the `agent-pantry` CLI with npm provenance;
- add reproducible with-skill and without-skill benchmark runs;
- expose local-versus-catalog diffs in the web catalog;
- add version pins and update receipts to the installer;
- validate on Windows, macOS, and Linux in CI;
- publish a machine-readable catalog schema.

## Candidate Skills

Each candidate needs a distinct trigger boundary, a complete workflow, stop conditions, an output contract, and evaluation scenarios before acceptance.

- `log-to-root-cause` — correlate distributed logs without mistaking timing for causality;
- `observability-gap-finder` — identify the smallest telemetry needed to answer an operational question;
- `performance-regression-hunter` — design comparable measurements and isolate a real regression;
- `accessibility-journey-auditor` — verify keyboard, focus, semantics, zoom, and screen-reader journeys;
- `data-backfill-planner` — bound, throttle, observe, pause, and recover large data corrections;
- `feature-flag-retirement` — safely remove stale branches, configuration, and observability;
- `monorepo-change-router` — map ownership, dependency edges, and package-specific verification;
- `prompt-injection-boundary-reviewer` — inspect agent instructions, tool authority, and untrusted context flow.

## What we will not optimize for

- a large number of near-duplicate Skills;
- scores without raw outputs and reproducible runs;
- mandatory accounts, telemetry, or proprietary runtimes;
- helper scripts whose behavior cannot be inspected before execution.

Proposals are welcome through the Skill proposal issue form. A strong proposal starts with a costly failure mode and explains why an existing Skill cannot already handle it.
