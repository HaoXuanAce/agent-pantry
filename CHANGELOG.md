# Changelog

All notable changes to Agent Pantry are documented here.

The project follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Six production-focused Skills: AI patch verification, Skill supply-chain audit, dependency upgrades, zero-downtime migrations, incident investigation, and browser acceptance evidence.
- Four curated mission packs.
- Standard `evals/evals.json` suites with explicit expected outputs and expectations.
- CLI dry-run, installed diff, confirmed removal, pack installation, and atomic replacement.
- Shareable catalog links through the `?skill=` URL parameter.

### Changed

- Made Simplified Chinese the default repository README and kept English in `README.en.md`.
- Removed unsupported numeric quality scores and `stable` claims in favor of an explicit `reviewed` maturity label.
- Consolidated catalog categories into Explore, Build, Diagnose, Verify, Ship, and Operate phases.
- Strengthened catalog-to-filesystem, frontmatter, eval schema, and pack validation.

## [0.1.0] - 2026-08-12

### Added

- Eight inspectable Agent Skills with adversarial evaluation cases.
- `agent-pantry` CLI with list, search, inspect, add, verify, and doctor commands.
- Vue catalog site with search, filters, detail drawer, and install command copying.
- Support for Codex, Claude Code, Cursor, Gemini CLI, and GitHub Copilot paths.
- English and Simplified Chinese documentation.
