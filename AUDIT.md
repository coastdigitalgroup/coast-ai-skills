# Skill Library Audit Process

This document defines the recurring process for keeping the skill library
clean, non-redundant, and structurally consistent as it grows. It is separate
from `RELEASE.md` (which gates a single release) and `AGENT.md` (which defines
what a complete skill looks like) — this file defines how to periodically
sweep the *whole library* for drift and redundancy that accumulates gradually
across many independent skill additions.

## When to Run This

- Every ~20-30 new skills added since the last audit.
- Before a minor/major version release that adds a meaningful number of
  skills.
- When `AGENT.md`'s skill-writing standard changes (re-check existing skills
  against the new standard).
- On request, e.g. "clean up the skills docs."

`npm run check:skills` runs on every validation pass and catches missing
frontmatter or malformed skills, but it does **not** catch heading-naming
drift, duplicate scope, or content thinness — that's what this process is for.

## The Three-Pass Structure

Run these as three independent passes, one per category
(`website-design/`, `website-development/`, `website-growth/`) so each stays
scoped and reviewable. For a library this size, run the three category audits
in parallel (e.g. as separate subagents) rather than serially — each pass is
read-only and independent until the fix stage.

### Pass 1 — Structural consistency

For every `SKILL.md` in the category, check:

- Frontmatter has `name` (matches folder name) and `description`
  (present-tense, task-focused, trigger-oriented).
- Section skeleton matches the category's own majority pattern: Purpose, Use
  Cases, When NOT to Use, Inputs, Outputs, Workflow, Decision Rules,
  Constraints, (Non-Goals where the category uses it), Common Failure
  Patterns, Validation Criteria.
- Heading text is identical across files for the same section — drift like
  `Validation Steps` / `Validation Methods` / `Validation Criteria` all
  meaning the same thing is a defect even though each individually is valid
  markdown. Normalize to the term `AGENT.md`/`CLAUDE.md` document
  (`Validation Criteria`).
- No stray sections that exist in only one or two files in a category — either
  the content belongs in an existing section (fold it in) or the whole
  category should adopt it (raise it as a standard change instead of a
  one-off).

Report every deviation as `<file path> — <what's missing/inconsistent>`, not
prose.

### Pass 2 — Duplicate and overlap detection

Compare every skill's name + frontmatter `description` + "When NOT to Use"
section against its category siblings (and, for skills that clearly could
apply cross-category, against the other two categories too). Flag a pair or
group when an agent scanning `list_skills`/`search_skills` output could not
confidently choose between them for a given task.

For each flagged group, classify it before touching any files:

- **True subsumption / near-identical scope** — one skill's stated scope
  fully contains another's (e.g. a skill's own description claims to solve
  what a second, dedicated skill already owns), or two skills cover the same
  mechanism with only cosmetic differences in wording. → **Merge candidate.**
- **Adjacent but distinct mechanism or trigger** — the skills solve related
  problems but through genuinely different techniques, triggers, or points in
  the user journey (e.g. exit-intent vs. entry-popup vs. persistent banner;
  form friction vs. content-gate friction). Merging would delete real,
  non-redundant guidance. → **Cross-reference candidate**, not a merge.
- **Unclear** — flag for a human decision rather than guessing; do not merge
  or leave silently ambiguous.

This classification step matters more than the detection step. Only merge
what is actually redundant — the goal is fewer *weak* skills, not fewer
skills. `AGENT.md`'s "prefer fewer complete skills over many weak ones" is
about not fragmenting one capability across near-duplicates, not about
collapsing genuinely different capabilities into one bloated file.

### Pass 3 — Content quality

Grep the category for stub markers (`TODO`, `TBD`, `FIXME`, `coming soon`,
`lorem ipsum`) and generic motivational filler ("unlock the power of",
"game-changer", "cutting-edge", "take it to the next level" — the kind of
language `AGENT.md`'s writing standard already forbids). Spot-check the
shortest files in the category (thin files are the likeliest place for
shallow content to hide) and any file already flagged in Pass 1 or 2. Flag
empty or near-empty sections and workflow steps too generic to execute
without additional guesswork.

## Applying Fixes

1. **Structural fixes are mechanical** — apply directly (heading renames,
   folding a stray section into its natural home, adding a missing section
   with real, skill-specific content written to match sibling files' tone —
   never boilerplate).
2. **Merges** — keep the more complete/broader file as the survivor, fold in
   any genuinely distinct content from the retired file (integrate into the
   right sections, don't concatenate), delete the retired folder, then grep
   the whole repo (`README.md`, other `SKILL.md` files, `ROADMAP.md`,
   `TODO.md`) for the retired skill name and fix every dangling reference.
   Never edit `CHANGELOG.md` history when doing this — only forward-looking
   references.
3. **Cross-reference fixes** — add short, reciprocal "When NOT to Use"
   bullets to every skill in the group, pointing at its siblings and naming
   the distinguishing trigger or mechanism in one line. Keep it terse; this
   is disambiguation, not a rewrite.
4. Re-run `node scripts/check-skills.mjs` after every category's fixes land.
   A skill-count drop after merges is expected — confirm it matches the
   number of folders deleted.
5. Update `CHANGELOG.md` under `[Unreleased]` for merges and any
   structural-standard changes (heading renames across many files don't need
   individual changelog lines, but the merge itself does — record what was
   merged into what and why).

## Handoff

This process never includes a git commit. Once fixes are applied and
`check:skills` passes, stop and hand off to Codex or Bradley Potts with a
summary of: files changed per category, skills merged (and why they were true
duplicates rather than distinct-but-adjacent), and confirmation validation
passed. See the companywide git policy in `CLAUDE.md`.

## Related Files

- `AGENT.md` — defines what a complete, non-duplicate skill looks like; this
  file defines how to periodically re-check the whole library against that
  standard.
- `RELEASE.md` — section 2 ("Skill Content") gates individual changed skills
  before a release; this file gates the library as a whole, independent of
  any specific release.
- `scripts/check-skills.mjs` — automated frontmatter/structure validation;
  catches a subset of Pass 1, none of Pass 2 or 3.
