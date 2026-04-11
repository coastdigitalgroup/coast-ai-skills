# coast-ai-skills

[![GitHub issues](https://img.shields.io/github/issues/coastdigitalgroup/coast-ai-skills)](https://github.com/coastdigitalgroup/coast-ai-skills/issues)
[![GitHub pulls](https://img.shields.io/github/issues-pr/coastdigitalgroup/coast-ai-skills)](https://github.com/coastdigitalgroup/coast-ai-skills/pulls)
[![License](https://img.shields.io/github/license/coastdigitalgroup/coast-ai-skills)](LICENSE)

Portable, reusable AI skills organized for cross-platform agent workflows.

This repository is a public skill library for agents and human operators. Its
purpose is to store complete, reusable skills that can be copied into other
repositories, local skill directories, or agent runtimes with minimal
modification.

This is not an app repo, a docs dump, or a place for shallow prompts. Each
contribution should improve the library as a transferable execution asset.

## Core Principle

Build for portability first.

Assume a skill may be copied into GitHub agents, Codex, Jules,
Anthropic-compatible workflows, internal automation systems, or other local
agent runtimes. Avoid repository-specific assumptions unless they are clearly
isolated and documented.

## What Belongs Here

- complete, reusable skills
- clear operating guidance for agents
- standardized support files that improve execution quality
- practical assets that travel well between environments

## What Is a Skill?

A skill is a self-contained, reusable capability that an agent can apply
repeatedly.

A strong skill is:

- portable
- scoped
- understandable by another agent or human operator
- complete enough to be useful without missing critical pieces
- organized for reuse

A skill is not:

- a vague idea
- a placeholder
- a scratchpad
- a one-off note
- a thin prompt with no operating guidance

## Repository Layout

Skills are organized by category first, then by skill name:

```text
coast-ai-skills/
  <category>/
    <skill-name>/
      SKILL.md
```

Example:

```text
coast-ai-skills/
  engineering/
    repo-audit/
      SKILL.md
  operations/
    daily-control-report/
      SKILL.md
  product/
    spec-writing/
      SKILL.md
```

Repository rules:

- level 1 is the major category
- level 2 is the portable skill unit
- each skill must contain a `SKILL.md`
- keep the structure shallow and predictable
- do not add an extra top-level `skills/` folder
- do not create unnecessary nested skill trees

## Skill Contents

Each skill must include:

```text
<category>/<skill-name>/
  SKILL.md
```

It may also include these standardized support folders:

```text
<category>/<skill-name>/
  SKILL.md
  examples/
  templates/
  references/
  assets/
  scripts/
```

Use these folder names consistently. Do not invent new support-folder names when
one of the standard options already fits.

## Definition of Done

A skill is complete when it includes:

1. A clear purpose
2. Defined use cases or triggers
3. Explicit inputs
4. Expected outputs
5. Workflow or execution steps
6. Decision rules and constraints
7. Boundaries and non-goals
8. Error handling or escalation guidance when relevant
9. Examples, templates, references, scripts, or assets when needed
10. Enough depth that another agent can use it with minimal guesswork

Prefer fewer complete skills over many shallow ones.

## Writing Standard

Every `SKILL.md` should be practical and execution-oriented. Use plain language
and write for agents and operators.

A strong `SKILL.md` usually includes:

- title
- purpose
- use when
- do not use when
- inputs
- outputs
- constraints
- workflow
- decision rules
- escalation conditions
- quality bar
- related files in the skill folder

## Categories and Naming

Create a category when it improves browsing and groups multiple related skills.
Create a skill when it is a standalone reusable capability that makes sense on
its own outside this repository.

Naming rules:

- categories should be lowercase, concise, and broad but clear
- skill folders should be lowercase, hyphen-separated, and capability-oriented
- avoid vague names like `helper`, `misc`, or `stuff`

## Current Status

This repository currently defines the structure and quality bar for the library.
Add skills under the category-first layout described above.

## Contributing

Contributions should prioritize portability, reuse, and execution quality over
volume. Strengthen an existing skill before creating a near-duplicate, and avoid
placeholder-heavy drafts.

Start with [CONTRIBUTING.md](CONTRIBUTING.md).

## Related Projects

- [CoastAi Agents](https://github.com/coastdigitalgroup/coast-ai-agents)
- [CoastAi Instructions](https://github.com/coastdigitalgroup/coast-ai-instructions)

## License

MIT. See [LICENSE](LICENSE).
