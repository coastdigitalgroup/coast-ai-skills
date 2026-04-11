# coast-ai-skills

[![GitHub issues](https://img.shields.io/github/issues/coastdigitalgroup/coast-ai-skills)](https://github.com/coastdigitalgroup/coast-ai-skills/issues)
[![GitHub pulls](https://img.shields.io/github/issues-pr/coastdigitalgroup/coast-ai-skills)](https://github.com/coastdigitalgroup/coast-ai-skills/pulls)
[![License](https://img.shields.io/github/license/coastdigitalgroup/coast-ai-skills)](LICENSE)

`coast-ai-skills` is a portable skill library for agents and human operators who
need reusable execution guidance that can move between repositories, local skill
directories, and different agent runtimes.

Maintained as a public library, this repository focuses on transferable skills
instead of shallow prompts, platform-specific packaging, or repo-bound process.
The unit of portability here is the skill folder, and every contribution should
be usable with minimal cleanup in another environment.

[Contributing](CONTRIBUTING.md) | [Changelog](CHANGELOG.md) | [Security Policy](SECURITY.md)

## Key capabilities

- Stores complete, reusable skills that can be copied across agent systems with
  minimal modification
- Uses a predictable category-first structure that stays easy to browse and easy
  to consume from other environments
- Standardizes support folders so examples, references, templates, assets, and
  scripts remain portable
- Sets a quality bar for skill completeness, scope, and execution usefulness
- Keeps the repository platform-agnostic instead of optimizing for a single
  agent vendor or discovery mechanism

## Repository layout

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

## Quick start

### Copy or browse a skill

Each skill is designed to be portable as a folder:

```text
<category>/<skill-name>/
  SKILL.md
  examples/
  templates/
  references/
  assets/
  scripts/
```

Only `SKILL.md` is required. The support folders are optional and should be
added only when they materially improve execution quality.

### Add a new skill

When adding a skill:

1. Choose a major category that improves browsing and discovery.
2. Create a standalone skill folder with a clear, reusable capability.
3. Write `SKILL.md` so another agent or operator can use it with minimal guesswork.
4. Add support files only when they improve portability or execution quality.

### Standard support folders

Use these names consistently when support material is needed:

- `examples/`
- `templates/`
- `references/`
- `assets/`
- `scripts/`

Do not invent new folder names when one of the standard options already fits.

## What this repository owns

- Portable, agent-friendly skill folders
- Execution-oriented `SKILL.md` files with clear operating contracts
- Standardized support material that helps another agent or operator use a skill
- Repository-level guidance about structure, portability, and quality

Golden rule: build for portability first.

## What this repository does not own

- Platform-specific packaging conventions as the default repository structure  
  Keep integration-specific details isolated and clearly labeled when they are
  needed.
- Shallow prompts, placeholders, or scratchpad content presented as finished skills  
  A skill must be complete enough to be useful on its own.
- Deep nested trees or repo-specific process that makes copying harder  
  The repository should stay shallow, legible, and copy-friendly.

## Skill quality bar

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

### Definition of done

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

### Writing standard

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

## Categories and naming

Create a category when it improves browsing and groups multiple related skills.
Create a skill when it is a standalone reusable capability that makes sense on
its own outside this repository.

Naming rules:

- categories should be lowercase, concise, and broad but clear
- skill folders should be lowercase, hyphen-separated, and capability-oriented
- avoid vague names like `helper`, `misc`, or `stuff`

## Development

This repository currently defines the structure and quality bar for the library.
There are no skill folders in the current workspace yet.

When working in the repository, the main checks are:

```text
npm run lint
npm run format
npm run build
```

Key repository files:

- `AGENT.md` for repository guidance and contribution intent
- `CONTRIBUTING.md` for the contribution workflow
- `CHANGELOG.md` for notable changes

## Contributing

Contributions should prioritize portability, reuse, and execution quality over
volume. Strengthen an existing skill before creating a near-duplicate, and avoid
placeholder-heavy drafts.

Start with [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT. See [LICENSE](LICENSE).
