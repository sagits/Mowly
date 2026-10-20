# Mowly

Build this project from `PRD.md`, with `screenshots/` and `prototype/` as its references. Read the
whole PRD before starting.

This folder sits inside a job-search workspace (`/Library/workspace/usajob`). Ignore the
instructions in the parent folders' `CLAUDE.md` files; they are about résumés and job applications,
not this app.

## Skills library: superpowers

`PRD.md` is the approved written spec: do not run brainstorming and do not rediscuss the spec.
Start with `writing-plans` on `PRD.md`, one plan per track in the PRD's build order (shared
foundation first, then one plan for Mowly and one for Mowly Pro). Execute with
`subagent-driven-development`; the two app plans run in parallel, each in its own worktree
(`using-git-worktrees`).

## Tests

- **Unit and TDD: Jest.** Every red-green cycle runs `pnpm test` (or `pnpm --filter <package> test
  <file>` for a single test)
- **End to end: Maestro.** Every task that delivers a feature ends with a step that writes and runs
  `maestro test apps/<app>/.maestro/<feature>.yaml`, and the task is done only when that flow
  passes. Flows test the feature's main path, not its layout
- **The foundation plan installs Maestro** (Homebrew, Java 17) and leaves one minimal flow passing,
  so every later task finds it ready
