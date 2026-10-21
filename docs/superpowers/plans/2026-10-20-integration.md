# Mowly Integration Ticket Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge `track/customer` and `track/pro` into `master`, resolve any `packages/` overlap, prove every Jest suite and both apps' Maestro flows pass, and do the PRD's web verification.

**Architecture:** No new features. The merge is followed by checks. Each fix it needs is a commit of its own.

**Tech Stack:** As the foundation plan.

**Spec:** `PRD.md` ("Two apps in parallel", "Web verification (final step)", "Scope"), plus both tracks' `PACKAGES-CHANGES.md`.

## Global Constraints

- Everything in the foundation plan's Global Constraints applies, including **no attribution trailer on any commit**
- A `packages/` conflict keeps both sides' additions. If both tracks added the same thing under one name, keep one, make both apps use it, and record that in `DECISIONS.md`
- Both `[customer]` and `[pro]` `DECISIONS.md` entries survive the merge

## Review Focus

- **A `packages/` addition one track made that the other track's tests never ran against** (for example a new optional `Pro` field the seed now fills). The full `pnpm test` after the merge covers it
- **Two Metro ports and two simulators after the merge:** `pnpm e2e` runs both apps on the default `iPhone 16`, one after the other. Task 2 runs it that way
- **A web deep link with the merged code** (`/customer/services`, `/pro/calendar`, `/pro/settings/billing`). Covered in Task 3

---

### Task 1: Merge both tracks

**Files:**
- Modify: anything in conflict, `DECISIONS.md`, `README.md`

- [ ] **Step 1:** `git checkout master && git merge --no-ff track/customer -m "merge: customer track"`. Expected: a clean merge (master has nothing new since the fork)
- [ ] **Step 2:** `git merge --no-ff track/pro -m "merge: pro track"`. Resolve conflicts under the rule above, reading both `PACKAGES-CHANGES.md` first
- [ ] **Step 3:** `pnpm install && pnpm test && pnpm typecheck && pnpm lint`. Expected: all green. Fix anything red with `superpowers:systematic-debugging`
- [ ] **Step 4:** Fold both `PACKAGES-CHANGES.md` files into one `DECISIONS.md` entry and delete them
- [ ] **Step 5: Commit.** `git add -A && git commit -m "chore: integrate both tracks" -m "Refs #9"`

### Task 2: Every Maestro flow on the merged code

- [ ] **Step 1:** `xcrun simctl boot "iPhone 16"; pnpm e2e:build > .e2e-build.log 2>&1` in the background. Read the log until both installs succeed
- [ ] **Step 2:** `pnpm e2e`. Expected: every flow in `apps/customer/.maestro` and `apps/pro/.maestro` passes, the exit code is 0, and both `report.xml` files are written
- [ ] **Step 3:** Run both `demo.yaml` files back to back. Together they are the PRD's "Demo flow that has to work start to finish". Expected: PASS
- [ ] **Step 4:** Fix and commit anything that failed with the trailer `Refs #9` (`git commit -m "fix(e2e): …" -m "Refs #9"`)

### Task 3: Web verification (PRD "Web verification (final step)")

- [ ] **Step 1:** `pnpm build:web`. Expected: exit 0
- [ ] **Step 2:** `npx serve dist` in the background, then check each of these in Chrome (claude-in-chrome) and note pass or fail for each:
  - `/` shows both cards, and each one opens its app
  - `/customer` opens Browse with the seeded services, and `/pro` opens the dashboard with the checklist
  - `/customer/services`, `/pro/calendar` and `/pro/settings/billing` load directly
  - The quote funnel and the pro forms work with mouse and keyboard
  - At desktop width the customer tab bar stays at the bottom and the pro drawer is a left sidebar, with content centered
  - The console has no errors and no React Native Web warnings about unsupported props
  - The page source has `noindex`, and `/robots.txt` disallows everything
- [ ] **Step 3:** Fix every failure, rebuild, and recheck
- [ ] **Step 4:** In `README.md`, list every `.web.tsx` file and why it exists, add the Maestro report summary (pass counts from both `report.xml`), and keep the single no-affiliation paragraph
- [ ] **Step 5: Commit.** `git add -A && git commit -m "docs: web verification and test report" -m "Closes #9"`
- [ ] **Step 6: Push.** `git push origin master`. The merged track commits carry `Closes #2` to `Closes #8`, so they close those issues when they reach the default branch, and this commit closes #9. Then verify with `gh issue list -R sagits/Mowly --state open`. Expected: no ticket issues left open. Close any that stayed open by hand with `gh issue close <n> -R sagits/Mowly -c "Done in <sha>"`

**Not in this plan:** the web-only stretch goal (one shared persisted mock database across `/customer` and `/pro`). The PRD allows it only after everything else, so it gets its own plan when asked for. Vercel deployment is manual.
