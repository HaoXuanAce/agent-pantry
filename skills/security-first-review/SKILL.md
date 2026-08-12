---
name: security-first-review
description: Review changed code through trust boundaries and attacker-controlled data. Use whenever a diff touches authentication, tenant isolation, uploads, webhooks, shell or filesystem access, network requests, secrets, dependencies, or AI tool calls—even when the user only says to review the change.
---

# Security-First Review

Find exploitable paths in changed behavior and explain them with evidence. This is a focused engineering review, not a compliance certification.

## Scope first

Establish the exact code, commit range, route, service, or workflow under review. Identify protected assets and the identities that interact with them.

Do not perform active exploitation against external or production systems unless the user explicitly authorizes it and the environment is safe.

## Trust-boundary map

Trace data across:

`untrusted source → parsing → validation → authorization → transformation → sensitive sink`

Sources include HTTP input, files, webhooks, model output, database content, environment configuration, message queues, and dependency metadata.

Sinks include command execution, SQL, templates, file paths, network requests, secrets, logs, redirects, deserialization, and privileged state changes.

## Workflow

### 1. Identify assets and actors

List sensitive data, actions, and availability requirements. Distinguish anonymous users, authenticated users, tenants, operators, services, and third parties.

### 2. Review identity and access

Check authentication, session handling, object-level authorization, tenant isolation, role checks, token scope, default permissions, and failure behavior. Verify checks occur server-side at the final sensitive operation.

### 3. Follow attacker-controlled data

For each changed input, inspect canonicalization, allowlists, size limits, type validation, encoding, and its eventual sink. Validation at one representation may not protect a later transformed representation.

### 4. Inspect dangerous capabilities

Focus on:

- shell and process execution;
- filesystem traversal and archive extraction;
- server-side requests and redirects;
- SQL and query construction;
- template or script evaluation;
- unsafe parsing or deserialization;
- upload content and storage permissions;
- model/tool calls based on untrusted instructions.

### 5. Check secrets and observability

Look for credentials in source, errors, logs, URLs, client bundles, test fixtures, and generated artifacts. Ensure security events are observable without logging sensitive values.

### 6. Check dependencies and delivery

Review new packages, install scripts, unpinned actions, artifact provenance, runtime permissions, and configuration defaults. A new dependency is code execution, not just metadata.

### 7. Validate findings safely

Prefer unit tests, local fixtures, static traces, and inert payloads. Never expose real secrets or harm data to prove a point.

## Severity model

- **Critical** — unauthenticated or low-complexity path to broad compromise, secret loss, or destructive data access.
- **High** — practical privilege escalation, cross-tenant access, code execution, or sensitive data exposure.
- **Medium** — constrained exploit requiring conditions, or material defense-in-depth failure.
- **Low** — limited security impact with a clear hardening benefit.

Consider exploitability, privileges, user interaction, scope, detection, and recovery.

## Output contract

For each finding provide title, severity, changed location, asset at risk, prerequisite, step-by-step exploit path, impact, evidence, and minimal remediation. Clearly separate confirmed findings from hardening suggestions.

Finish with reviewed boundaries, verification gaps, and residual risk. If no exploitable path is found, say so without implying the system is certified secure.
