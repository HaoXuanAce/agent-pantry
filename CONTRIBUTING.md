# Contributing to Agent Pantry

Thanks for helping build a small, trustworthy collection of Agent Skills.

## What belongs here

A proposed skill should encode a repeatable workflow that materially improves an agent's process. It must solve a distinct job, define when it should and should not trigger, and be useful across more than one repository.

We generally do not accept:

- persona prompts or collections of tips;
- vendor marketing copied into instructions;
- skills whose main purpose is installing or promoting a product;
- duplicate workflows with only a framework name changed;
- instructions that bypass permissions, conceal actions, or weaken security boundaries;
- scraped or generated bulk submissions that were not individually reviewed.

## Propose before writing

Open a skill proposal issue describing:

1. the job and target user;
2. why existing skills do not cover it;
3. one success case and one adversarial case;
4. the expected output contract.

This prevents contributors from spending time on an entry that overlaps the pantry.

## Skill requirements

Create this structure:

```text
skills/<kebab-case-name>/
├── SKILL.md
└── evals/
    └── evals.json
```

`SKILL.md` must contain:

- YAML frontmatter with `name` and a specific third-person `description`;
- triggering and non-triggering guidance;
- ordered workflow steps;
- evidence and safety rules;
- explicit stop conditions;
- a stable output contract.

`evals/evals.json` must follow the Skill Creator schema and contain at least four scenarios. Include normal, boundary, adversarial, and non-trigger cases where relevant. Each case defines an integer `id`, realistic `prompt`, `expected_output`, optional `files`, and at least three observable `expectations`.

Add the skill metadata to `catalog.json`. Do not edit the web catalog separately; it consumes the shared file.

## Writing style

- Use direct, operational language.
- Prefer decisions and observable behavior over adjectives.
- State authorization boundaries explicitly.
- Do not claim a workflow was benchmarked unless reproducible results, model versions, prompts, and scoring are included.
- Keep the complete `SKILL.md` readable in a few minutes.

## Validate locally

```bash
pnpm install
pnpm check
```

For the catalog site:

```bash
pnpm dev
```

Verify search, filters, the skill drawer, command copying, and narrow-screen layout.

## Pull request checklist

- [ ] The workflow solves a distinct job.
- [ ] Trigger and stop conditions are explicit.
- [ ] Claims are supported by inspectable reasoning or evidence.
- [ ] At least four evaluation cases are included.
- [ ] `catalog.json` matches the skill folder.
- [ ] Documentation contains no secrets, private data, or copied proprietary material.
- [ ] `pnpm check` passes.

By contributing, you agree that your contribution is licensed under the repository's MIT License.
