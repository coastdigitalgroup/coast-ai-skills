# coast-ai-skills

[![GitHub issues](https://img.shields.io/github/issues/coastdigitalgroup/coast-ai-skills)](https://github.com/coastdigitalgroup/coast-ai-skills/issues)
[![GitHub pulls](https://img.shields.io/github/issues-pr/coastdigitalgroup/coast-ai-skills)](https://github.com/coastdigitalgroup/coast-ai-skills/pulls)
[![License](https://img.shields.io/github/license/coastdigitalgroup/coast-ai-skills)](LICENSE)

Open-source AI skills organized in standardized, generic folders.

This repository is meant to be a practical skills library:

- high-quality, reusable skills
- simple folder-per-skill organization
- lightweight instructions with progressive disclosure
- optional bundled references, scripts, and assets

## What Is A Skill?

A skill is a self-contained folder that helps an AI agent perform a class of tasks
more reliably.

Each skill should include:

```text
skill-name/
  SKILL.md
```

It may also include:

```text
skill-name/
  SKILL.md
  references/
  scripts/
  assets/
```

## Repository Layout

This repo keeps one folder per skill at the repository root.

```text
coast-ai-skills/
  typescript/
    SKILL.md
    references/
      basics.md
```

This keeps the library easy to browse, easy to copy from, and easy to consume
from other repos or agent runtimes.

## Design Principles

- Keep `SKILL.md` concise and focused on workflow.
- Put detailed material in `references/` instead of bloating the main skill.
- Add `scripts/` only when determinism or repeatability matters.
- Add `assets/` only when the skill needs templates or reusable artifacts.
- Prefer skills that are broadly useful in real engineering work.
- Treat each skill as a production-quality open-source artifact, not a prompt dump.

## Current Skills

| Skill | Focus |
| --- | --- |
| `api-design/` | API contracts, resource modeling, naming, and evolution |
| `customer-support/` | Clear and actionable support responses |
| `debugging/` | Systematic bug investigation and verification |
| `meeting-notes/` | Decisions, action items, and follow-up summaries |
| `project-planning/` | Scope, milestones, sequencing, and risks |
| `react/` | Maintainable React component and state patterns |
| `research-brief/` | Decision-friendly synthesis of information |
| `technical-writing/` | Clear technical docs and procedural writing |
| `typescript/` | Strict TypeScript architecture, validation, and maintainable type-system patterns |

## Contributing

We want this repo to become a strong public library of agent skills. Contributions
should prioritize clarity, reuse, and quality over volume.

Start with [CONTRIBUTING.md](CONTRIBUTING.md).

## Related Projects

- [CoastAi Agents](https://github.com/coastdigitalgroup/coast-ai-agents)
- [CoastAi Instructions](https://github.com/coastdigitalgroup/coast-ai-instructions)

## License

MIT. See [LICENSE](LICENSE).
