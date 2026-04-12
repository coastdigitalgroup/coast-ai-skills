# coast-ai-skills

[![GitHub issues](https://img.shields.io/github/issues/coastdigitalgroup/coast-ai-skills)](https://github.com/coastdigitalgroup/coast-ai-skills/issues)
[![GitHub pulls](https://img.shields.io/github/issues-pr/coastdigitalgroup/coast-ai-skills)](https://github.com/coastdigitalgroup/coast-ai-skills/pulls)
[![License](https://img.shields.io/github/license/coastdigitalgroup/coast-ai-skills)](LICENSE)

`coast-ai-skills` is a portable, agent-friendly skill library for reusable execution guidance.
It is designed for skills that can be copied into other repositories, local skill directories, and different agent runtimes with minimal modification.

This repository is maintained as a transferable skill library, not an app repo, a docs dump, or a collection of shallow prompts. The unit of portability here is the skill folder, and every contribution should improve the library as a reusable execution asset.

[Contributing](CONTRIBUTING.md) | [Changelog](CHANGELOG.md) | [Security Policy](SECURITY.md)

## Key capabilities

- Stores complete, reusable skills that can move between agent systems with minimal cleanup
- Uses a predictable category-first structure that stays easy to browse and copy
- Standardizes support folders for examples, references, templates, assets, and scripts
- Keeps the repository platform-agnostic instead of optimizing around one vendor or runtime
- Sets a quality bar for skill completeness, scope, and execution usefulness

## Repository structure

The repository uses this layout:

```text
/<category>/<skill-name>/SKILL.md
```

Each skill folder is the portable unit. Keep the structure shallow, predictable, and easy to lift into another environment.

Example:

```text
/website-development/accessible-modal-dialog/SKILL.md
/website-design/fluid-typography-system/SKILL.md
/website-growth/hero-section-optimization/SKILL.md
```

Repository rules:

- Level 1 is the major category
- Level 2 is the portable skill unit
- Each skill must contain a `SKILL.md`
- Do not add an extra top-level `skills/` folder
- Do not create unnecessary nested skill trees

## Available skills

Current categories and skills in this repository:

- `website-development/accessible-modal-dialog`
  Implements and audits accessible modal dialogs with proper semantics, focus management, keyboard handling, and assistive technology support.
- `website-design/fluid-typography-system`
  Creates responsive typographic systems using CSS `clamp()` and a structured scale across viewport sizes.
- `website-growth/hero-section-optimization`
  Audits and improves hero sections for clarity, engagement, and conversion-focused outcomes.

Each skill may include support material alongside `SKILL.md` when it improves execution quality:

- `examples/`
- `templates/`
- `references/`
- `assets/`
- `scripts/`

Only `SKILL.md` is required. Use the support folders only when they materially improve reuse, portability, or execution quality.

## Quick start

### Browse a skill

Open a skill folder and start with its `SKILL.md`.

```text
<category>/<skill-name>/
  SKILL.md
  examples/
  templates/
  references/
  assets/
  scripts/
```

### Copy a skill into another environment

The intended portable unit is the skill folder itself. In most cases, you should copy the entire skill directory so its support files stay attached to the operating guidance in `SKILL.md`.

### Add a new skill

When adding a skill:

1. Choose a category that improves browsing and discovery.
2. Create a standalone skill folder with a clear reusable capability.
3. Write `SKILL.md` so another agent or operator can use it with minimal guesswork.
4. Add support files only when they improve portability or execution quality.

## What this repository owns

- Portable, agent-friendly skill folders
- Execution-oriented `SKILL.md` files with clear operating guidance
- Standardized support material that helps another agent or operator use a skill
- Repository-level structure and quality standards for a transferable public skill library

This repository should stay portability-first.

## What this repository does not own

- Platform-specific packaging conventions as the default repository structure
- Placeholder-heavy drafts, scratchpads, or shallow prompts presented as finished skills
- Deep nested trees or repo-specific process that makes copying harder
- Skills that depend on undocumented local assumptions to be usable

If an integration needs platform-specific details, keep them isolated and clearly labeled instead of letting them shape the repository structure.

## Skill quality bar

A skill is a self-contained, reusable capability that an agent can apply repeatedly.

A valid skill is:

- portable
- scoped
- understandable by another agent or human operator
- complete enough to be useful without missing critical pieces
- organized for reuse

A skill is not:

- a vague idea
- a one-off note
- a placeholder
- a scratchpad
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

Every `SKILL.md` should be practical and execution-oriented. Use plain language and write for agents and operators.

A strong `SKILL.md` usually includes:

- Title
- Purpose
- Use when
- Do not use when
- Inputs
- Outputs
- Constraints
- Workflow
- Decision rules
- Escalation conditions
- Quality bar
- Related files in the skill folder

## Categories and naming

Create a category when it improves browsing and groups multiple related skills. Create a skill when it is a standalone reusable capability that still makes sense outside this repository.

Naming rules:

- Categories should be lowercase, concise, and broad but clear
- Skill folders should be lowercase, hyphen-separated, and capability-oriented
- Avoid vague names like `helper`, `misc`, `stuff`, or `general-tooling`

## Development

This repository is content-first. The main work is improving skill clarity, structure, and portability rather than building an application runtime.

Key repository files:

- `AGENT.md` for repository guidance and contribution intent
- `CONTRIBUTING.md` for the contribution workflow
- `CHANGELOG.md` for notable changes

Key skill areas:

- `website-development/`
- `website-design/`
- `website-growth/`

## Contributing

Contributions should prioritize portability, reuse, and execution quality over volume. Strengthen an existing skill before creating a near-duplicate, and avoid placeholder-heavy drafts.

Start with [CONTRIBUTING.md](CONTRIBUTING.md) and use [AGENT.md](AGENT.md) as the repository-level source of truth for structure, quality, and scope.

## License

MIT. See [LICENSE](LICENSE).
