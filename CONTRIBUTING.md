# Contributing to CoastAi Skills

Thanks for helping build a public library of high-quality AI skills.

## What we want

Contribute skills that are:

- broadly useful across projects and domains
- triggered correctly by agent search and description matching
- complete enough that an agent can execute without guesswork
- maintained like open-source artifacts, not one-off prompts

## How the library works

Skills are served to AI agents via an MCP server. When an agent calls `search_skills("some topic")`, it scans every skill's `name` and `description` frontmatter. When it calls `get_skill("skill-name")`, it loads the full `SKILL.md` content.

This means two things matter most when writing a skill:

1. **The `description` field** — this is how agents discover your skill. Write it as a trigger: what task should cause an agent to load this skill?
2. **The `SKILL.md` body** — this is what the agent actually executes. Make it procedural, complete, and decision-ready.

## Skill structure

Each skill lives at `/<category>/<skill-name>/SKILL.md`. The category is the top-level folder.

```text
/<category>/<skill-name>/
  SKILL.md          ← required
  examples/         ← optional
  templates/        ← optional
  references/       ← optional
  assets/           ← optional
  scripts/          ← optional
```

Only `SKILL.md` is required. Add support folders only when they materially improve execution quality or portability.

## Writing a good SKILL.md

Use clear YAML frontmatter:

```markdown
---
name: your-skill-name
description:
  One or two sentences explaining what this skill does and when to trigger it.
  Write for an agent scanning descriptions to find the right skill for a task.
---
```

A strong `SKILL.md` body includes:

- **Purpose** — what this skill does and why it exists
- **Use Cases** — when to reach for this skill
- **When NOT to Use** — where this skill does not apply
- **Inputs** — what the agent needs before starting
- **Outputs** — what the agent produces
- **Workflow** — numbered steps an agent can follow
- **Decision Rules** — how to handle tradeoffs and edge cases
- **Constraints** — hard limits and non-goals
- **Common Failure Patterns** — what goes wrong and how to avoid it
- **Validation** — how to confirm the output is correct

Keep the body lean and procedural. Link to `references/` files instead of stuffing everything into `SKILL.md`.

## Adding a new category

If no existing category fits your skill, create a new top-level folder. Use a name that is:

- lowercase and hyphen-separated
- broad enough to group multiple future skills
- clear without being vague (`creative-writing` not `writing`)

The MCP server discovers new categories automatically.

## Pull requests

When submitting a new skill or revising an existing one:

1. Add or update the skill folder.
2. Confirm `SKILL.md` has valid frontmatter with `name` and `description`.
3. Include only support files that materially improve the skill.
4. Explain in the PR what user or agent requests should trigger the skill.
5. Describe any notable templates, references, or assets included.

## MCP server changes

If you change anything in `src/`:

```bash
npm install
npm run build
```

Confirm the build is clean before submitting. Editing skill content never requires a rebuild — only TypeScript source changes in `src/` do.

## Quality bar

Prefer one strong skill over ten shallow ones.

A good contribution has:

- a tight description that triggers well in agent searches
- a workflow another agent can follow without additional context
- references or scripts only where they add real execution value
- examples grounded in realistic work

## License

By contributing, you agree that your contributions are licensed under the MIT License.
