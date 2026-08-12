---
name: api-contract-auditor
description: Detect breaking changes across OpenAPI or REST, GraphQL, protobuf or RPC, event payloads, webhooks, runtime validators, shared types, generated SDKs, and independently deployed consumers. Use whenever producer and consumer versions may differ.
---

# API Contract Auditor

Determine whether a contract change is compatible in the environments where producers and consumers actually run.

## Contract model

Treat all of these as contract:

- paths, methods, operation names, and event topics;
- request and response fields, types, formats, defaults, and nullability;
- status codes, error shapes, headers, pagination, ordering, and rate limits;
- authentication, authorization, scopes, and tenant behavior;
- timing, retries, idempotency, and delivery guarantees;
- documented and de facto behavior used by real consumers.

Generated schemas alone are not proof of runtime behavior.

## Workflow

### 1. Establish the comparison

Identify old and new versions, producer deployment order, active consumers, and supported compatibility window. If the baseline is unclear, do not guess.

### 2. Diff the declared contract

Compare specifications, schemas, shared types, validators, and generated clients. Flag:

- removed or renamed operations and fields;
- optional-to-required or nullable-to-non-null changes;
- narrowed enums or numeric ranges;
- changed formats, units, or meanings;
- new validation on previously accepted input;
- changed defaults, status codes, or error bodies.

### 3. Trace runtime implementation

Confirm routing, validation, serialization, and error handling match the declaration. Check feature flags and version-specific branches.

### 4. Search real consumers

Find call sites, SDKs, mobile/web clients, jobs, tests, dashboards, and external integration docs. Look for assumptions such as exhaustive enum switches, field presence, stable ordering, or one-page responses.

### 5. Model version skew

Test or reason through:

- old consumer → new producer;
- new consumer → old producer;
- mixed versions during rolling deployment;
- delayed, duplicated, or replayed events;
- persisted payloads decoded after deployment.

### 6. Classify compatibility

- **Breaking** — an allowed existing use can fail or change meaning.
- **Conditionally compatible** — safe only with a stated consumer or deployment constraint.
- **Additive** — existing uses remain valid, but consumers may need defensive handling.
- **Internal** — no exposed contract, with evidence.

### 7. Design migration

Prefer expand-and-contract: add the new shape, support both, migrate consumers, observe usage, then remove the old shape. Define deprecation notice, telemetry, owner, and removal criteria.

## Common traps

- Adding an enum member can break exhaustive consumers.
- Adding a required response field can break strict decoders.
- Making a request field optional can still change server defaults.
- Renaming while keeping the same type is breaking.
- GraphQL nullable-to-non-null can increase whole-query failure propagation.
- Event changes persist longer than request/response changes because old payloads may be replayed.

## Output contract

1. **Verdict**: breaking, conditional, additive, or internal.
2. **Contract diff** with exact schema or implementation evidence.
3. **Consumer impact** with affected call sites and version-skew scenarios.
4. **Migration path** with ordering and deprecation criteria.
5. **Verification gaps** for consumers or contracts not available locally.
