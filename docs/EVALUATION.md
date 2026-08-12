# Evaluation policy

Agent Pantry separates three different claims that skill repositories often blur together.

## 1. Repository validation

`pnpm validate` checks deterministic facts: catalog and folder parity, frontmatter, required metadata, eval shape, referenced fixtures, unique identifiers, and pack membership. Passing this gate earns the `reviewed` maturity label.

It does **not** prove that a particular model will follow the skill correctly.

## 2. Scenario definitions

Every skill ships with at least four cases in `evals/evals.json`. A case contains a realistic prompt, an expected output description, optional input files, and at least three observable expectations. These files are reviewable test specifications, not benchmark results.

`vibe-to-verified` also contains a 20-query trigger-boundary pilot in `evals/trigger-evals.json`: ten queries that should select the skill and ten close negatives that should not. The pilot is intentionally committed as data so reviewers can challenge the boundary.

## 3. Model benchmarks

No aggregate model score is published yet. A future result must include all of the following before it appears in the catalog:

- exact model and version;
- run date and relevant runtime configuration;
- with-skill and without-skill raw outputs;
- deterministic checks and human rubric scores kept separate;
- pass, fail, and variance details for every scenario;
- the evaluator instructions and any input fixtures;
- a reproducible command or public workflow.

Until then, `reviewed` means inspectable and structurally validated—nothing more.

## Reviewing the pilot

The repository maintainer can generate an interactive review page from the Skill Creator template. The page is local-only and ignored by Git:

```bash
pnpm eval:review
```

Open `.eval-review/vibe-to-verified.html`, edit any query or trigger label, and use **Export Eval Set** to save the reviewed JSON.
