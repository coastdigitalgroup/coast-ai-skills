# AGENTS.md

This repository is a library of reusable AI skills.

## Mission

Add and refine portable skill folders that people can copy into whatever project
structure fits their workflow.

Do not invent platform-specific packaging or custom folder conventions unless the
user explicitly asks for them.

## Standard Skill Structure

Each skill should live in its own top-level folder:

```text
skill-name/
  SKILL.md
  references/
  scripts/
  assets/
```

Rules:

- `SKILL.md` is required.
- `references/`, `scripts/`, and `assets/` are optional.
- Keep the structure generic and portable.
- Do not add provider-specific metadata by default.

## What Good Skills Look Like

- The `description` in `SKILL.md` should clearly say what the skill does and
  when to use it.
- The body should be concise, procedural, and easy for another agent to follow.
- Put detailed supporting material in `references/` instead of bloating
  `SKILL.md`.
- Add `scripts/` only when a repeatable helper materially improves the skill.
- Add `assets/` only when templates or reusable artifacts are genuinely useful.

## Repository Guidance

- Prefer broadly useful skills over niche one-off prompts.
- Keep skill names simple, lowercase, and folder-friendly.
- Preserve the existing plain folder-per-skill organization.
- Update `README.md` when adding or removing skills so the catalog stays useful.
- Keep `CONTRIBUTING.md` aligned with the actual repository structure.

## Editing Guidance

- Favor small, clear improvements over large speculative rewrites.
- Preserve the user's chosen structure and naming conventions.
- Do not remove or replace existing skills unless explicitly asked.
- If adding a new skill, make it good enough that someone could use it without
  extra explanation.

## Default Behavior For Agents

When asked to expand the library:

1. Add new skills as top-level folders.
2. Give each skill a strong `SKILL.md`.
3. Add references only when they clearly improve usability.
4. Keep everything standardized and generic.
5. Update the README catalog.
