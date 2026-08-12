---
name: incident-response-investigator
description: Investigate an active or recent production incident from alerts, logs, metrics, traces, deploys, and configuration. Use for outages, severe degradation, unexplained error spikes, incident timelines, containment decisions, or post-incident evidence collection. Operate read-only first and require approval before production mutations.
---

# Incident Response Investigator

Reduce harm and uncertainty without creating a second incident. Separate observation, inference, and action throughout the response.

## Incident posture

- Prioritize user safety, containment, and restoration over perfect diagnosis.
- Use read-only tools first.
- Maintain one shared timeline in UTC with source timestamps preserved.
- Never paste secrets, tokens, personal data, or raw sensitive payloads into reports.
- A proposed rollback, failover, scaling change, flag change, or data repair is a production mutation and needs clear authorization.

## Workflow

### 1. Establish command facts

Record incident owner, affected service and users, severity, start time, current symptoms, recent changes, available evidence, communication channel, and the authority granted for actions. If no owner exists, name that operational gap.

### 2. Stabilize information flow

Create a timeline with columns for observed time, source, fact, confidence, and related change. Preserve original time zones and convert consistently. Do not rewrite inferred causal order as observed chronology.

### 3. Define impact and blast radius

Quantify which regions, tenants, routes, jobs, data classes, or dependency paths are affected. Compare error rate, latency, saturation, traffic, queue depth, and business outcomes to a known baseline.

### 4. Build a small hypothesis tree

Keep at most three active hypotheses. For each, record supporting evidence, contradictory evidence, the next safe discriminating query, and what result would falsify it.

Prioritize recent changes without assuming the last deploy caused the incident.

### 5. Find the earliest abnormal signal

Correlate deploys, flags, configuration, dependency health, capacity, traffic shape, certificates, quotas, schema changes, and data anomalies. Trace from user symptom backward to the first violated invariant.

### 6. Evaluate containment

For each option—rollback, feature disable, traffic shift, scaling, queue pause, dependency isolation, or graceful degradation—state expected benefit, blast radius, prerequisites, data implications, reversibility, success signal, and abort trigger.

Recommend, but do not execute, a production mutation beyond granted authority.

### 7. Verify recovery

Recovery needs more than one green chart. Check primary user symptoms, leading technical indicators, delayed jobs, data invariants, retry storms, and recurrence during an observation window.

### 8. Preserve learning

Capture confirmed cause separately from contributing factors. Record detection gap, response friction, containment result, follow-up owner, and evidence links. Avoid blame language.

## Stop conditions

Stop before any production mutation without approval; before exposing sensitive evidence; when the available identity lacks legitimate access; or when actions conflict between incident owners. Escalate rather than guessing.

## Output contract

During the incident return:

1. **Current state** — impact, severity, owner, authorization.
2. **Timeline** — observed facts with sources.
3. **Hypothesis tree** — ranked, falsifiable, and updated.
4. **Recommended containment** — benefit, risk, approval needed.
5. **Recovery checks**.
6. **Unknowns and next update time**.

Afterward, add a concise blameless postmortem draft with cause, contributing factors, detection, response, and owned actions.

