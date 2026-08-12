# Security policy

Agent Skills influence how coding agents inspect files, execute tools, and modify systems. Treat skill updates with the same care as code changes.

## Supported versions

Security fixes are applied to the latest release and the `main` branch.

## Report a vulnerability

Please use GitHub's private vulnerability reporting for this repository. Do not open a public issue for an unpatched vulnerability.

Include:

- affected skill, CLI command, or site component;
- realistic impact and prerequisites;
- a minimal, non-destructive reproduction;
- suggested mitigation if known.

Do not include real credentials, personal data, or production artifacts.

## Trust model

- The CLI installs only Skills bundled with its published package and validates them before replacing any existing copy.
- Installation stages files and swaps the exact Skill directory only after validation succeeds.
- Installation copies files and never executes a skill's scripts.
- Existing skill directories are not replaced unless `--force` is supplied.
- The catalog site has no account, analytics, or telemetry.
- Skill instructions are human-readable and should be reviewed before use.

The repository's structural checks and authored eval scenarios do not prove that every model will follow a Skill correctly. A `reviewed` badge is not a benchmark score or security certification. Pin versions for controlled environments, use `agent-pantry diff` before updating, and review changes before replacement.
