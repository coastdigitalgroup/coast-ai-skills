# Contributing to CoastAi Skills

Thanks for helping build a public library of high-quality AI skills.

## What We Want

Contribute skills that are:

- broadly useful
- easy for agents to trigger correctly
- concise in core instructions
- practical in real engineering or operations work
- maintained like open-source artifacts, not one-off prompts

## Skill Structure

Each skill lives in its own top-level folder and must include a `SKILL.md`.

Recommended layout:

```text
my-skill/
  SKILL.md
  references/
  scripts/
  assets/
```

Rules:

- `SKILL.md` is required.
- `references/` is for detailed docs that should only be loaded when needed.
- `scripts/` is for deterministic helpers.
- `assets/` is for templates or reusable files used in outputs.

## Writing Good Skills

- Use clear YAML frontmatter with `name` and `description`.
- Put trigger language in the `description`.
- Keep the body lean and procedural.
- Link to reference files instead of stuffing everything into `SKILL.md`.
- Avoid extra docs inside a skill folder such as `README.md` or `CHANGELOG.md`.

## Pull Requests

When submitting a new skill or revising an existing one:

1. Add or update the skill folder.
2. Make sure `SKILL.md` is valid and readable.
3. Include only the support files that materially improve the skill.
4. Explain what user requests should trigger the skill.
5. Describe any notable scripts, references, or assets included.

## Quality Bar

Prefer one strong skill over ten shallow ones.

A good contribution usually has:

- a tight description that triggers well
- a workflow another agent can actually follow
- references or scripts only where they add real value
- examples grounded in realistic work

## Development

```bash
git clone https://github.com/coastdigitalgroup/coast-ai-skills.git
cd coast-ai-skills
```

## License

By contributing, you agree that your contributions are licensed under the MIT
License.
