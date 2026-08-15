# Release Checklist

This checklist is for the release steward role in this repository. Use it before
publishing a package, cutting a GitHub release, or treating a branch as
production ready.

## 1. Scope

- Review the full diff and identify whether the change touches skills, source,
  package metadata, root documentation, generated files, or release assets.
- Confirm every meaningful change has an entry in `CHANGELOG.md` under
  `[Unreleased]`.
- Check that the public promise in `README.md` still matches the actual package
  behavior.

## 2. Skill Content

For each changed skill:

- Confirm `/<category>/<skill-name>/SKILL.md` exists.
- Confirm frontmatter contains `name` and `description`.
- Confirm `name` matches the folder name.
- Confirm the description is trigger-focused for agent search.
- Confirm the body is procedural enough for an agent to execute.
- Confirm support files live only in `examples/`, `templates/`, `references/`,
  `assets/`, or `scripts/`.
- Check for placeholder content, stale references, and duplicate skill scope.
- If ~20-30 skills have been added since the last full audit, run the
  `AUDIT.md` process first — this checklist gates the changed skills in this
  release, not the library's accumulated structural/duplicate drift.

## 3. Source And Package Checks

Run these when source, package configuration, or release packaging changes:

```bash
npm run validate
```

For skill-only or documentation-only changes, record why these checks were not
needed.

## 4. MCP Behavior

When source or package contents change, verify:

- `list_skills` returns expected categories and descriptions.
- `search_skills` finds changed skills using realistic task keywords.
- `get_skill` returns the full `SKILL.md` content.
- New top-level folders are either intended skill categories or excluded from
  discovery in `src/skills.ts`.

## 5. Documentation Alignment

Check these files for contradictions:

- `README.md`
- `CONTRIBUTING.md`
- `AGENT.md`
- `AGENTS.md`
- `CLAUDE.md`
- `CODEX.md`
- `COPILOT.md`
- `JULES.md`
- `RELEASE.md`
- `CHANGELOG.md`
- `.codex/README.md`
- `.github/copilot-instructions.md`

The root docs should agree on structure, commands, supported editors, quality
bar, agent role boundaries, and release expectations.

## 6. Versioning

Before publishing:

- Decide the SemVer bump from the actual change set.
- Update only `package.json` for the package version. `src/server.ts` reads the
  version from `package.json`.
- Move `[Unreleased]` changelog entries into the new version heading with the
  release date.
- Confirm `package-lock.json` is consistent if package metadata changed.

## 7. Final Gate

Do not release if any of these are true:

- The working tree contains unexplained changes.
- Build, lint, or typecheck fails for a source/package change.
- A skill has invalid frontmatter or shallow placeholder content.
- Public docs describe behavior the MCP server does not provide.
- New dependencies were added without a concrete reason.
- Generated package contents are stale for a package-ready release.
