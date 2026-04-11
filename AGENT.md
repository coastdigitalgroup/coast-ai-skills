# AGENT.md

## Purpose

This repository is a portable, agent-friendly skill library.

Its job is to store complete, reusable skills that can be copied into other
agent systems, repositories, or local skill directories with minimal
modification.

This is **not** an app repo, a docs dump, or a place for shallow prompts. Every
contribution should improve the library as a transferable execution asset.

---

## Core Operating Principle

Build for portability first.

Assume a person or agent may copy a skill folder from this repository into
another environment such as GitHub agents, Codex, Jules, Anthropic-compatible
workflows, local agent runtimes, or internal automation systems.

Do not optimize for one platform's folder discovery rules at the expense of
portability. Do not hard-code repository-specific assumptions unless they are
clearly isolated and documented.

---

## Repository Structure

The repository uses this structure:

```text
/<category>/<skill-name>/SKILL.md
```

Example:

```text
/engineering/repo-audit/SKILL.md
/operations/daily-control-report/SKILL.md
/product/spec-writing/SKILL.md
```

### Rules

- Level 1 is the **major category**
- Level 2 is the **portable skill unit**
- Each skill must contain a `SKILL.md`
- Keep structure shallow and predictable
- Do not create an extra top-level `skills/` folder
- Do not create unnecessary nested skill trees

---

## What a Skill Is

A skill is a self-contained, reusable capability that an agent can apply
repeatedly.

A valid skill is:

- portable
- scoped
- understandable by another agent or human operator
- complete enough to be useful without missing critical pieces
- organized for reuse

A skill is **not**:

- a vague idea
- a one-off note
- a placeholder
- a scratchpad
- a thin prompt with no operating guidance

---

## Definition of Done for a Skill

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

Do not merge shallow skills. Prefer fewer complete skills over many weak ones.

---

## Allowed Skill Contents

Each skill may include only what improves portability and execution quality.

### Required

- `SKILL.md`

### Optional standardized folders

- `examples/`
- `templates/`
- `references/`
- `assets/`
- `scripts/`

Use these names consistently across the repo. Do not invent unnecessary folder
names when a standard folder already fits.

---

## How to Decide Category vs Skill vs Support File

### Make something a category when:

- it groups multiple related skills
- it improves browsing and discovery
- it is broad enough to contain multiple portable capabilities

Examples:

- `engineering`
- `operations`
- `product`
- `growth`

### Make something a skill when:

- it is a standalone reusable capability
- it can be copied and used on its own
- it has its own operating contract
- it would still make sense outside this repository

Examples:

- `repo-audit`
- `dependency-upgrade`
- `incident-handoff`
- `spec-writing`

### Keep something as support material inside a skill when:

- it is just a checklist, example, reference, script, or template
- it cannot stand well on its own
- it mainly exists to support the parent skill

Do not split support material into separate skills unless it clearly deserves an
independent lifecycle.

---

## Skill Writing Standard

Every `SKILL.md` should be practical and execution-oriented.

Use plain language. Write for agents and operators. Avoid filler, motivational
language, and vague abstraction.

A strong `SKILL.md` usually contains:

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

The exact section order may vary, but the skill must remain clear and complete.

---

## Contribution Rules

When adding or editing a skill:

- keep the blast radius narrow
- preserve portability
- do not add platform-specific assumptions unless clearly labeled
- do not add placeholder files or TODO-heavy drafts
- do not create duplicate skills with overlapping intent
- strengthen existing skills before creating weak new ones
- prefer standard folders and consistent naming
- keep categories clean and legible

If an existing skill can be expanded into a complete solution, do that before
creating a near-duplicate.

---

## Quality Bar

Every contribution should move the repository toward a best-in-class public
skill library.

That means:

- complete over shallow
- reusable over clever
- structured over messy
- portable over platform-locked
- practical over theoretical

A person should be able to browse this repository, copy a skill folder, and
understand how to use it without reading the entire repo.

---

## Naming Rules

### Categories

- lowercase
- concise
- broad but clear
- hyphenated only if needed

### Skill folders

- lowercase
- hyphen-separated
- action-oriented or capability-oriented
- short enough to scan quickly

Examples:

- `repo-audit`
- `test-failure-triage`
- `daily-control-report`
- `offer-positioning`

Avoid vague names like:

- `helper`
- `misc`
- `stuff`
- `general-tooling`

---

## Platform Agnostic Guidance

This repository is intentionally platform-agnostic.

Some runtimes may expect skills in different install paths, but that is an
integration concern, not a repository design concern. The unit of portability
here is the skill folder.

Design each skill so it can be copied into another system with minimal cleanup.

Do not assume:

- one specific agent vendor
- one specific directory discovery mechanism
- one specific execution environment

If platform-specific notes are needed, place them inside the relevant skill and
label them clearly.

---

## What Not to Do

Do not:

- create a top-level `skills/` directory
- bury skills in deep nested trees
- add incomplete daily filler skills
- treat prompts alone as complete skills
- create duplicate skills with slightly different names
- add unnecessary repo-specific process that reduces portability

---

## Preferred Build Strategy

When expanding the repository:

1. Choose a major category
2. Identify a clearly standalone skill
3. Build the skill to completion
4. Add support files only where they improve execution
5. Keep structure shallow and copy-friendly
6. Revisit and strengthen existing skills over time

Prefer one strong skill over five weak ones.

---

## Maintainer Intent

This repository aims to become a high-quality, public, reusable skill library.

The standard is not volume. The standard is transferability, completeness, and
agent usefulness.

Every file should support that goal.
