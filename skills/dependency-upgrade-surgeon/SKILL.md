---
name: dependency-upgrade-surgeon
description: Plan or execute a dependency upgrade safely. Use for major-version migrations, deprecations, security updates, framework upgrades, lockfile conflicts, codemods, peer-dependency changes, or when release notes and compatibility must be reconciled with real repository usage.
---

# Dependency Upgrade Surgeon

Upgrade one dependency boundary at a time and prove the repository still honors its contracts.

## Principles

- Treat release notes and migration guides as inputs, not infallible instructions.
- Inspect actual usage before applying codemods or broad replacements.
- Preserve the repository's package manager and lockfile.
- Separate a version upgrade from unrelated refactoring.
- Never resolve a dependency conflict by weakening constraints globally without explaining the compatibility effect.

## Workflow

### 1. Establish the upgrade contract

Record current version, target version or acceptable range, reason, package manager, runtime constraints, supported platforms, and whether implementation is authorized. Confirm the package identity to avoid typo or substitution risk.

### 2. Inspect the dependency surface

Find direct imports, re-exports, configuration, plugins, generated clients, types, test helpers, build tooling, peer dependencies, transitive overrides, and runtime feature detection. Identify which usages touch removed or changed APIs.

### 3. Gather primary migration evidence

Use official release notes, changelog, migration guide, API reference, and package metadata for every crossed major version. Record publication source and version. Do not rely on an unverified blog when primary documentation exists.

### 4. Build a compatibility map

List:

- runtime and language version requirements;
- peer and plugin compatibility;
- removed, deprecated, or behavior-changed APIs;
- configuration and default changes;
- data, cache, build-output, and SSR compatibility;
- rollback constraints.

Classify each as required, not applicable with evidence, or unknown.

### 5. Choose an upgrade sequence

Prefer the smallest reversible steps:

1. strengthen characterization or contract tests;
2. remove deprecated local usage where possible;
3. update the direct dependency and lockfile using the repository's package manager;
4. apply targeted migrations;
5. update plugins or peers only when required;
6. verify focused behavior, then the broader suite.

For a large jump, consider intermediate supported versions when they expose clearer migrations or data transformations.

### 6. Review package effects

Inspect lockfile diff, new transitive packages, lifecycle scripts, provenance, bundle or binary changes, licenses when relevant, and duplicated major versions. Do not hand-edit lockfile semantics.

### 7. Verify behavior

Run repository-native type, test, build, and smoke checks proportional to the dependency role. Add a focused regression for each behavior change not already covered. Compare bundle, performance, schema, or generated output when the package can affect them.

### 8. Report and hand off

Distinguish changes completed, checks passed, warnings, deprecations intentionally deferred, and unknown external compatibility.

## Stop conditions

Stop when the target version is ambiguous, official migration evidence is unavailable, required runtime changes exceed scope, a peer conflict represents an actual incompatible contract, or production data conversion lacks recovery.

## Output contract

1. **Upgrade scope** — current, target, and reason.
2. **Compatibility map** — applicable changes with sources.
3. **Repository impact** — concrete usages and files.
4. **Upgrade sequence or implementation**.
5. **Lockfile and supply-chain observations**.
6. **Verification evidence and remaining unknowns**.

