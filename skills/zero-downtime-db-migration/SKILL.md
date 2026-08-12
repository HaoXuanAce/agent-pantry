---
name: zero-downtime-db-migration
description: Design or review a production database schema or data migration for zero-downtime rollout. Use for expand-contract changes, backfills, large tables, locks, indexes, dual reads or writes, mixed application versions, destructive cleanup, and migration rollback or recovery.
---

# Zero-Downtime DB Migration

Design for the period when old code, new code, old rows, and new rows coexist. A migration is safe only when every intermediate state is safe.

## Required context

Establish database engine and version, table sizes and traffic shape, deployment strategy, application versions that may coexist, replication topology, migration framework, maintenance budget, and recovery objectives. State unknowns rather than assuming defaults.

## Workflow

### 1. Define old and target invariants

Describe the data shape and behavior before and after. Identify constraints, ownership, nullability, uniqueness, ordering, and derived values. Separate schema transformation from product behavior change.

### 2. Model mixed-version compatibility

Walk through:

- old application with expanded schema;
- new application before backfill completes;
- concurrent old and new writes;
- readers encountering partially migrated rows;
- replicas or consumers lagging behind;
- rollback of application code after schema changes.

### 3. Split into expand, migrate, contract

**Expand:** add backward-compatible structures without removing old behavior.

**Migrate:** backfill in bounded, resumable, observable batches; reconcile dual representations; make retries idempotent.

**Contract:** remove old reads, writes, fields, indexes, or constraints only after telemetry proves no active dependency remains.

Each phase should be independently deployable and reversible or have a documented forward recovery.

### 4. Assess database mechanics

For every statement, evaluate lock type and duration, table rewrite, transaction size, WAL/binlog growth, replication lag, disk headroom, index build mode, constraint validation mode, deadlock exposure, and timeout behavior using engine-specific evidence.

Do not call an operation online merely because its syntax accepts an online option; version, table shape, and concurrent workload matter.

### 5. Design the backfill

Specify stable cursor or key ranges, batch size controls, rate limits, checkpointing, retry semantics, conflict handling, observability, pause/resume, validation queries, and the owner. Avoid offset pagination for a mutating large dataset.

### 6. Define cutover evidence

Use measurable conditions: percentage backfilled, invariant violations, old-field read/write counts, replication lag, error rate, lock wait, and dual-representation mismatches. Name the required observation window.

### 7. Design recovery

Rollback may be unsafe after new writes. Define separately:

- application rollback;
- migration pause;
- forward repair;
- data restoration or reconciliation;
- contract-phase cancellation.

Never promise rollback if the real strategy is forward-only recovery.

### 8. Produce the runbook

Order commands and deploys, prerequisites, approvals, owners, signals, abort thresholds, and post-migration cleanup. Prefer dry runs or representative staging evidence without claiming staging load equals production.

## Stop conditions

Stop when schema facts, engine/version, table scale, traffic, mixed-version deployment order, or recovery strategy are unknown; when validation requires unapproved production writes; or when the requested one-step destructive migration cannot meet the stated availability goal.

## Output contract

1. **Verdict and unknowns**.
2. **Phase plan** — expand, migrate, cutover, contract.
3. **Compatibility matrix** for old/new code and data.
4. **Lock, replication, and data risks** with evidence.
5. **Backfill and validation design**.
6. **Abort thresholds and recovery procedure**.

