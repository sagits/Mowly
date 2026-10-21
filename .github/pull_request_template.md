### What is this change?

**Issue:** Closes #<issue>

- What the change gives the user, one bullet per feature, in plain words (no file names here)

### Solution

- `path/or/package`: what changed there and why, one bullet per area
- Shared package changes, if any, and whether existing callers are affected

### How to test

1. `pnpm install`, then `pnpm test && pnpm typecheck && pnpm lint`
2. `pnpm e2e:<app>`: which Maestro flows should pass
3. Manual steps on the simulator or the web build that show the feature

### Evidences

| Platform | Screenshot |
| -------- | ---------- |
| iOS      | Screen recording or screenshots (drag the file into the PR on GitHub) |
| Web      | What was checked and at which widths |

### Notes

- Follow-ups, known gaps, and anything a reviewer should know
