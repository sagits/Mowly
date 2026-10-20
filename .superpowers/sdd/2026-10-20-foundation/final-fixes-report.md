# Final fixes report (foundation)

1. Tailwind globs: `apps/customer/tailwind.config.js:9`, `apps/pro/tailwind.config.js:9` add `./src/**`. Built pro CSS now has `.w-sidebar{width:240px}` and `.bg-scrim{background-color:#0006}`.
2. Coerced numbers: `packages/types/src/schemas.ts:57,90` (`z.coerce.number`, same messages; '' becomes 0 and fails min/positive). Test added at end of `schemas.test.ts` ('2' -> 2, '' -> error, both schemas).
3. JSDoc: `find` moved to `packages/mocks/src/find.ts` (not exported from index), imported in `customer.ts`, `pro.ts`. `/** */` on every `*Input` type in `schemas.ts`.
4. Centering: `packages/ui/src/Screen.tsx` wraps children in `w-full max-w-content flex-1 self-center` when wide. DECISIONS.md entry.
5. Maestro lock: `scripts/e2e.sh` (LOCK, release_lock, EXIT trap, retry loop around `maestro test`). DECISIONS.md entry.
6. `README.md`: planning.md link line removed.
7. DECISIONS.md: single-file package test command.
8. `apps/pro/src/drawer/DrawerMenu.tsx:60,68,71`: `w-sidebar` (already in preset) and `bg-scrim`.
9. DECISIONS.md: StatusPill and passWithNoTests corrected; new entries for all listed points.
10. `packages/api/src/queryKeys.ts` (new); customer.ts and pro.ts import it; `index.ts` exports `queryKeys` from it.
11. One-line header added to all 8 test files that lacked one (loop over `git ls-files '*.test.ts*'` finds none missing).
12. Favicon: inline SVG data URI `<link rel="icon">` in `packages/features/src/WebShell.tsx` (color from tokens) and `apps/landing/index.html`. `dist/index.html` and `dist/pro/index.html` each contain it.
13. `packages/mocks/src/seed.ts` CLAIMED_DAYS capped at 28 (0,0,0,1,2,4,7,12,16,20,24,28). Test with `setToday('2026-10-30')` and `'2027-01-31'` in `pro.test.ts`.
14. seed.ts header fixed, double blank line removed.

## Verification
- `pnpm test`: customer 47 passed, pro 2 passed.
- `pnpm typecheck`, `pnpm lint`: all tasks successful.
- `pnpm build:web`: exit 0.
- repairs grep from global-constraints.md: no output.
- `pnpm e2e`: customer smoke Passed (13s), pro smoke Passed (11s), exit 0.
