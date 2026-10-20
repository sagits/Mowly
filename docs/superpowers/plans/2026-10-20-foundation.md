# Mowly Foundation (Ticket 01) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the `sagits/repairs` template into the Mowly monorepo. The result has every shared package the two app tracks need (tokens, components, domain types and schemas, the full seed with every mock resolver, query hooks), both app shells booting on iOS and web, a landing page, Maestro with one passing flow per app, and the web build.

**Architecture:** Turborepo + pnpm (hoisted). There are two Expo Router apps (`apps/customer`, `apps/pro`) plus a static `apps/landing`. All server-shaped data lives in an in-memory mock database (`packages/mocks`) behind async resolvers that wait 600 to 1200 ms. Screens read it only through the TanStack Query hooks in `packages/api`. Zustand holds client-only state. Components are RN core components styled with NativeWind, with Mowly tokens.

**Tech Stack:** Expo 57.0.26, Expo Router ~57.0.24, RN 0.86.3, React 19.2.3, TypeScript ~6.0.3, NativeWind ^4.2.7, Tailwind ^3.4.19, TanStack Query ^5.104.0, Zustand ^5.0.15, React Hook Form ^7.89.0, @hookform/resolvers ^5.9.1, Zod ^4.6.5, Turborepo ^2.6.1, pnpm 12.3.4, Jest ~29.7.0, jest-expo ~57.0.5, RNTL ^14.0.1, Maestro.

**Spec:** `PRD.md` (with `screenshots/` and `prototype/index.html`). Read the whole PRD before Task 1.

**Branching:** All the foundation work happens on the feature branch `foundation`, in a worktree, and never on `master`. `master` gets only two things: the initial commit (Task 1 Step 1) and the merge at the end (Task 11 Step 6). Every path in this plan is relative to the worktree root.

## Global Constraints

- Versions are exactly the PRD Tech stack table's. Do not upgrade and do not look for newer ones. Add packages only with `npx expo install` (run inside the app folder)
- Only two dependencies are added beyond repairs: `@expo/vector-icons` (Ionicons) and `react-native-svg`. Both get installed in Task 1 so no later native rebuild is needed. Any other addition is a `DECISIONS.md` entry
- Mock data only. No backend, no auth, no real API, no payments. Never run a command that needs an Expo, Apple or Google login. No EAS
- JSDoc on every exported function, component, hook and type. Each file starts with one short comment saying what it is for. Inside a file, comment only what the name cannot say
- **Commits never carry `Co-Authored-By` or any other agent attribution.** This PRD rule overrides any harness default
- Colors come only from tokens (`packages/ui/tokens.js`). No hex values in screens or components
- Copy names Mowly, never the real company. The word "repairs" appears nowhere except `DECISIONS.md`
- Back navigation is the Expo Router `Stack` native header tinted `primary`, with the title centered and green. Never render a "Back" text button
- Simulator is `iPhone 16`. Boot it with `xcrun simctl boot "iPhone 16"`. Never `open -a Simulator`, never `xcode-select`. Native builds take 10 to 20 minutes, so run them in the background and read the log
- `render`, `renderHook`, `rerender` and `unmount` from RNTL 14 are async. Always `await` them
- testIDs are kebab-case `<area>-<thing>` (`tab-browse`, `service-tile-mowing`). Maestro selects by `id` only
- `DECISIONS.md` records every open point decided, with its reason. Do not ask questions
- Bundle ids: `com.renatoprobst.mowly` (customer) and `com.renatoprobst.mowlypro` (pro). Metro ports are 8081 (customer) and 8082 (pro)

## Review Focus

- **A mock write must be visible to the very next read.** After `createBooking`, `getBookings()` contains it at the top. After `claimJob`, the job leaves available and enters claimed. Covered in Task 3 and Task 4 tests
- **Seeded relative dates must stay correct across a month or year boundary.** With `today` = `2026-12-30`, available-job dates and `addDays` roll into January 2027. Covered in Task 2 and Task 4 tests
- **The same address always gets the same price, and the demo address gets exactly the catalog price.** Mowing Weekly is $57. Covered in Task 3
- **`SEED=false` empties every list (bookings, threads, available, claimed, route, billing) but keeps the catalog, addresses and the two demo people**, so empty states are reachable. Covered in Task 3 and Task 4
- **A web deep link loads directly under its base URL** (`/pro/settings/billing` served by `npx serve dist`), not just client-side navigation. Verified in Task 11

---

### Task 1: Copy and strip the repairs template

**Files:**
- Create from repairs: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `eslint.config.js`, `packages/config/*`, `packages/{api,stores,features,types,ui}/package.json`, `packages/ui/src/{ConfirmDialog,FormField,HeaderBand,Screen}.tsx`, `packages/api/src/queryClient.ts`, `packages/features/src/{AppProviders,WebShell}.tsx`, `apps/customer/*` (from `apps/client`), `apps/pro/*`
- Create: `apps/customer/jest.config.js`, `apps/pro/jest.config.js`, `apps/*/jest.setup.ts`, `apps/*/app/index.tsx` (placeholder), `apps/customer/tests/smoke.test.tsx`, `DECISIONS.md`
- Modify: `.gitignore` (merge repairs' with the existing one, and add `.turbo/`, `expo-env.d.ts`, `.worktrees/`, `.e2e-*.log`)

**Interfaces:**
- Produces: workspace packages `@mowly/{customer,pro,config,ui,api,stores,features,types,mocks}`. Root scripts `dev:customer`, `dev:pro`, `test`, `typecheck`, `lint`, `build:web`, `e2e:build`, `e2e`, `e2e:customer`, `e2e:pro` (the last four are filled in by Tasks 10 and 11). Single test runs: `pnpm --filter @mowly/customer test <path>` for anything under `apps/customer` or `packages/`, and `pnpm --filter @mowly/pro test <path>` for `apps/pro`

- [ ] **Step 1: Commit the references on `master` and push.** Run this from the main checkout, which is still on `master`. Append `.worktrees/` to `.gitignore`, then `git add -A && git commit -m "chore: PRD, screenshots, prototype and plans" -m "Refs #1" && git push -u origin master`. This gives the worktree a base and makes `master` the default branch on GitHub, which the `Closes #1` at the end relies on. The `.MP4` recordings stay ignored
- [ ] **Step 1b: Create the feature branch.** Use `superpowers:using-git-worktrees` to create a worktree on the new branch `foundation` from `master`. Prefer the native worktree tool; otherwise run `git worktree add .worktrees/foundation -b foundation`. Every later step runs inside that worktree
- [ ] **Step 2: Clone the template outside the repo.** `git clone --depth 1 https://github.com/sagits/repairs "$TMPDIR/repairs"`. Then read `$TMPDIR/repairs/DECISIONS.md` in full before touching config
- [ ] **Step 3: Copy only the Keep list from PRD "Start from the repairs template".** Copy `apps/client` to `apps/customer` and `apps/pro` to `apps/pro`. Do not copy `apps/both`, `.agents`, `.claude`, `.github`, `docs`, `scripts`, `packages/testing`, `vercel.json`, `skills-lock.json` or repairs' `AGENTS.md`/`CLAUDE.md`/`PRD.md`/`README.md`/`PROMPTS.md`/`GLOSSARY.md`/`DECISIONS.md`
- [ ] **Step 4: Strip and rename.**
  - Delete every Detox file and `e2e:*` script, `fixtures.ts`, `dev-reset.ts`, `packages/api/src/{client,map,overlay,schemas,scopes,useJobs}*` and every repairs screen, type, store and test in `packages/*/src`. Keep only the files in this task's Files list
  - Remove `detox` and `dtrace-provider` from `allowBuilds`
  - Rename `@repairs/*` to `@mowly/*` everywhere
  - Root `package.json` gets `"name": "mowly"`
  - `app.json` per the PRD Naming table. Scheme `mowly` and `mowly-pro`, `experiments.baseUrl` `/customer` and `/pro`, `web.output: "static"`, `web.bundler: "metro"`
  - Each app's `dev` script is `expo start --ios --port 8081` (customer) or `--port 8082` (pro). `build:web` is `expo export --platform web --output-dir dist`
- [ ] **Step 5: Jest, one project per app.** Base both on repairs' `apps/both/jest.config.js`. `apps/customer/jest.config.js` roots are `<rootDir>/app`, `<rootDir>/src`, `<rootDir>/tests` and `../../packages`. `apps/pro/jest.config.js` roots are `<rootDir>/app`, `<rootDir>/src` and `<rootDir>/tests` only, so package tests run once (in the customer project). Use the `@mowly/*` devDependencies of repairs' `apps/both`, minus `detox` and `@repairs/testing`, in both apps, and add `"test": "jest"` to both. Each `jest.setup.ts` holds the lines Task 3 defines. Leave it empty for now. Also add `apps/*/tests` and `apps/*/src` to each app's `tsconfig.json` `include`
- [ ] **Step 6: Install and add the two dependencies.** `pnpm install`, then `cd apps/customer && npx expo install @expo/vector-icons react-native-svg`, and the same in `apps/pro`
- [ ] **Step 7: Placeholder screens and a smoke test.** Each app's `app/index.tsx` renders `<Text testID="app-placeholder">Mowly</Text>`, and its `app/_layout.tsx` is `AppProviders` around a `Stack`. Write `apps/customer/tests/smoke.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react-native';
import Index from '../app/index';

test('the customer app renders', async () => {
  await render(<Index />);
  expect(screen.getByTestId('app-placeholder')).toBeTruthy();
});
```
- [ ] **Step 8: Verify.** Run `pnpm test && pnpm typecheck && pnpm lint`. Expected: all pass. Run `grep -ri repairs --exclude-dir=node_modules --exclude-dir=.git . | grep -v DECISIONS.md | grep -v docs/superpowers`. Expected: no output
- [ ] **Step 9: Start `DECISIONS.md`.** Add one entry for the template origin (what was kept and dropped, and why). Add one entry for the Jest split (package tests run in the customer project, which is the repairs one-project pattern applied to two apps). Add one entry each for `@expo/vector-icons` and `react-native-svg`
- [ ] **Step 10: Commit.** `git add -A && git commit -m "chore: monorepo from the repairs template, renamed to mowly" -m "Refs #1"`

---

### Task 2: Domain types, dates and schemas (`packages/types`)

**Files:**
- Create: `packages/types/src/domain.ts`, `packages/types/src/dates.ts`, `packages/types/src/schemas.ts`, `packages/types/src/index.ts`
- Test: `packages/types/src/dates.test.ts`, `packages/types/src/schemas.test.ts`

**Interfaces:**
- Produces (`domain.ts`, all exported, with JSDoc):

```ts
type IsoDate = string; // 'YYYY-MM-DD', local time
type ServiceId = 'mowing' | 'leaf-removal' | 'flower-bed-weeding' | 'bush-trimming' | 'pool-cleaning'
  | 'lawn-treatment' | 'mosquito-prevention' | 'aeration' | 'aeration-overseeding' | 'cleanup' | 'weeding';
type Frequency = 'weekly' | 'every-2-weeks' | 'monthly' | 'one-time' | 'recurring';
const FREQUENCY_LABELS: Record<Frequency, string>; // Weekly, Every 2 Weeks, Monthly, One-time, Recurring
const FREQUENCY_DAYS: Record<Frequency, number>;  // 7, 14, 30, 7, 30 (used by Skip)
type PlanOption = { frequency: Frequency; price: number; recommended: boolean };
type Service = { id: ServiceId; name: string; included: string; plans: PlanOption[] };
type Address = { id: string; line1: string; city: string; state: string; zip: string };
type Customer = { name: string; email: string; phone: string; address: Address; card: string };
type BookingStatus = 'scheduled' | 'paused' | 'cancelled';
type Booking = { id: string; serviceId: ServiceId; serviceName: string; frequency: Frequency; price: number;
  nextDate: IsoDate; status: BookingStatus; pausedUntil: IsoDate | null; proName: string; address: Address; createdAt: number };
type NewBooking = { serviceId: ServiceId; frequency: Frequency; price: number; startDate: IsoDate; addressId: string };
type BookingChange = { type: 'skip' } | { type: 'reschedule'; date: IsoDate } | { type: 'frequency'; frequency: Frequency; price: number }
  | { type: 'pause'; until: IsoDate } | { type: 'cancel' };
type Message = { id: string; from: 'customer' | 'pro'; text: string; sentAt: number };
type Thread = { id: string; proName: string; initials: string; serviceName: string; messages: Message[] };
type Job = { id: string; customerName: string; address: Address; yardSqft: number; serviceName: string; frequency: Frequency;
  price: number; availableDates: IsoDate[]; claimedDate: IsoDate | null; distanceMiles: number;
  pin: { x: number; y: number }; routeOrder: number | null; notes: string };
type BillingEntry = { jobId: string; date: IsoDate; description: string; amount: number };
type Billing = { balance: number; entries: BillingEntry[] };
type ChecklistItemId = 'profile' | 'skills' | 'evaluate' | 'work-area' | 'gps' | 'damage-fee' | 'tax' | 'bank';
type NotificationChannel = 'email' | 'text' | 'push';
type NotificationPrefs = Record<'jobs' | 'messages', Record<NotificationChannel, boolean>>;
type TaxInfo = { entityType: 'individual' | 'llc' | 'corporation'; legalName: string; dateOfBirth: string; legalAddress: string };
type Pro = { firstName: string; lastName: string; businessName: string; yearFounded: string; crewSize: number; city: string;
  customersServed: number; email: string; mobilePhone: string; officePhone: string; businessAddress: string; bio: string;
  avatar: number | null; truckPhoto: number | null; category: 'lawn' | 'pool'; skills: string[];
  equipment: { mower: boolean; trimmer: boolean; blower: boolean }; equipmentAnswered: boolean;
  startingPoint: Address; workAreaMode: 'one' | 'by-day'; workAreaSaved: boolean; gpsEnabled: boolean;
  damageFeeAccepted: boolean; taxInfo: TaxInfo | null; bankLinked: boolean; notifications: NotificationPrefs };
type Recommendation = { id: string; jobId: string; service: string; price: number; note: string };
```
- Produces (`dates.ts`): `today(): IsoDate`, `setToday(date: IsoDate | null): void` (a test override), `addDays(date: IsoDate, days: number): IsoDate`, `nextWeekday(from?: IsoDate): IsoDate` (the first Mon to Fri strictly after `from`, defaulting to today), `formatLong(date): string` (`'Sunday, October 25'`), `formatShort(date): string` (`'Oct 25'`), `formatMoney(amount: number): string` (`'$53.00'`), `weekdayShort(date): string` (`'Sun'`). Name arrays are built by hand, no `Intl` (repairs `DECISIONS.md` explains why)
- Produces (`schemas.ts`), each with its inferred `…Input` type: `QuoteContactSchema {name, addressId, addressText, apt, phone}`, `AccountSchema {firstName, lastName, email, cardNumber, cardExpiry, cardCvc, acceptTerms}`, `SignInSchema {email, password}`, `SignUpSchema {zip, email, phone, category}`, `BuildProfileSchema {businessName, yearFounded, crewSize}`, `BusinessProfileSchema {companyName, officePhone, businessAddress, bio}`, `AccountInfoSchema {firstName, lastName, mobilePhone, email}`, `TaxInfoSchema {entityType, legalName, dateOfBirth, legalAddress}`, `RecommendSchema {price, note}`. Phones keep only digits and must have exactly 10. `DEMO_CARD = '4242 4242 4242 4242'`

- [ ] **Step 1: Write the failing tests**

```ts
// dates.test.ts
beforeEach(() => setToday('2026-10-20')); // a Tuesday
test('addDays crosses month and year', () => {
  expect(addDays('2026-10-30', 3)).toBe('2026-11-02');
  expect(addDays('2026-12-30', 3)).toBe('2027-01-02');
});
test('nextWeekday skips the weekend', () => {
  expect(nextWeekday()).toBe('2026-10-21');
  expect(nextWeekday('2026-10-23')).toBe('2026-10-26');
});
test('formats', () => {
  expect(formatLong('2026-10-25')).toBe('Sunday, October 25');
  expect(formatShort('2026-10-25')).toBe('Oct 25');
  expect(formatMoney(53)).toBe('$53.00');
  expect(formatMoney(29.99)).toBe('$29.99');
});
test('today follows the override', () => expect(today()).toBe('2026-10-20'));
```

```ts
// schemas.test.ts: the error messages are the copy the screens show
const contact = { name: 'Renato Probst', addressId: 'a1', addressText: '1820 Maple Ridge Drive', apt: '', phone: '(512) 555-0147' };
test('quote contact', () => {
  expect(QuoteContactSchema.safeParse(contact).success).toBe(true);
  expect(issue(QuoteContactSchema, { ...contact, name: '' })).toBe('Enter your name');
  expect(issue(QuoteContactSchema, { ...contact, addressId: '' })).toBe('Pick an address from the list');
  expect(issue(QuoteContactSchema, { ...contact, phone: '555-0147' })).toBe('Enter a 10-digit phone number');
});
test('account only accepts the demo card and needs the terms', () => {
  const ok = { firstName: 'Renato', lastName: 'Probst', email: 'renato@example.com', cardNumber: DEMO_CARD, cardExpiry: '12 / 34', cardCvc: '123', acceptTerms: true };
  expect(AccountSchema.safeParse(ok).success).toBe(true);
  expect(issue(AccountSchema, { ...ok, cardNumber: '4000 0000 0000 0002' })).toBe('Use the demo card 4242 4242 4242 4242');
  expect(issue(AccountSchema, { ...ok, acceptTerms: false })).toBe('Accept the Terms of Service');
  expect(issue(AccountSchema, { ...ok, email: 'nope' })).toBe('Enter a valid email');
});
test('sign up and profile forms', () => {
  expect(issue(SignUpSchema, { zip: '7870', email: 'a@b.co', phone: '5125550147', category: 'lawn' })).toBe('Enter a 5-digit zip code');
  expect(issue(BuildProfileSchema, { businessName: 'S', yearFounded: '2099', crewSize: 2 })).toBe('Enter a valid year');
  expect(issue(BusinessProfileSchema, { companyName: 'S', officePhone: '5125550147', businessAddress: 'x', bio: 'a'.repeat(251) })).toBe('250 characters max');
});
// helper in the test file: const issue = (s, v) => s.safeParse(v).error?.issues[0]?.message;
```
- [ ] **Step 2: Run to verify they fail.** `pnpm --filter @mowly/customer test packages/types`. Expected: FAIL, module not found
- [ ] **Step 3: Implement `domain.ts`, `dates.ts`, `schemas.ts` and `index.ts` (re-exports everything)**
- [ ] **Step 4: Run to verify they pass.** Same command. Expected: PASS
- [ ] **Step 5: Commit.** `git add packages/types && git commit -m "feat(types): domain types, date helpers and form schemas" -m "Refs #1"`

---

### Task 3: Mock database, customer seed and customer resolvers (`packages/mocks`)

**Files:**
- Create: `packages/mocks/package.json` (`@mowly/mocks`, depends on `@mowly/types`), `src/delay.ts`, `src/pricing.ts`, `src/seed.ts`, `src/db.ts`, `src/customer.ts`, `src/index.ts`
- Modify: `apps/customer/package.json` and `apps/pro/package.json` (add `@mowly/mocks` so Metro resolves it), `apps/*/jest.setup.ts`
- Test: `packages/mocks/src/pricing.test.ts`, `packages/mocks/src/customer.test.ts`

**Interfaces:**
- Consumes: Task 2 types and `today`/`addDays`/`nextWeekday`
- Produces:
  - `setMockDelay(minMs: number, maxMs: number): void` and `delay(): Promise<void>` (default 600 to 1200)
  - `configureMocks({ seed }: { seed: boolean }): void`, `getDb(): MockDb`, `resetDb(): void` (rebuilds from the seed and honors `configureMocks`)
  - `MockDb = { services: Service[]; addresses: Address[]; customer: Customer; bookings: Booking[]; threads: Thread[]; pro: Pro; jobs: Job[]; recommendations: Recommendation[] }`
  - `lotSizeSqft(addressId: string): number` (FNV-1a 32-bit hash of the id, `5000 + hash % 7000`), `priceForLot(base: number, lotSqft: number): number` (`Math.round(base * lotSqft / lotSizeSqft(DEMO_ADDRESS_ID))`), and `DEMO_ADDRESS_ID = 'addr-maple-ridge'`
  - Resolvers, each `await delay()` first and each returning copies (never live db objects): `getServices(): Promise<Service[]>`, `getService(id): Promise<Service>`, `searchAddresses(query: string): Promise<Address[]>` (case-insensitive substring on `line1`), `getQuote(serviceId, addressId): Promise<{ plans: PlanOption[]; lotSqft: number }>`, `getNeighbors(zip): Promise<number>` (`78704` gives 49; otherwise `20 + hash(zip) % 60`), `getCustomer(): Promise<Customer>`, `getBookings(): Promise<Booking[]>` (excludes `cancelled`, newest `createdAt` first), `getBooking(id): Promise<Booking>`, `createBooking(input: NewBooking): Promise<Booking>` (pro `Greenleaf Lawn Co.`, status `scheduled`, `nextDate = startDate`), `updateBooking(id, change: BookingChange): Promise<Booking>` (skip adds `FREQUENCY_DAYS`; pause sets `status: 'paused'` and `pausedUntil`), `getThreads(): Promise<Thread[]>`, `getThread(id): Promise<Thread>`, `sendMessage(threadId, text): Promise<Thread>` (appends now, then appends the canned pro reply `"Thanks! We'll take care of it."` 2000 ms later through `setTimeout`), `resetDemo(): Promise<void>`. An unknown id rejects with `Error('Not found')`
- Seed content (from PRD "Seed data"): the 11 services in PRD order. Mowing is Weekly $57 (recommended), Every 2 Weeks $60, Monthly $60. Lawn Treatment, Mosquito Prevention and Pool Cleaning offer Monthly (recommended) and Every 2 Weeks. The rest offer One-time (recommended) and Monthly. Pick plausible prices and record them in `DECISIONS.md`. There are 6 Austin addresses: `1820 Maple Ridge Drive, Austin, TX 78704` (id `addr-maple-ridge`) plus 5 invented ones. Customer: Renato Probst, `renato.probst@example.com`, `(512) 555-0147`, card `4242`. Bookings: `b-mowing` (Lawn Mowing, monthly, +5 days, $53, Greenleaf Lawn Co.) and `b-treatment` (Lawn Treatment, recurring, +10 days). Thread `t-greenleaf` (initials `GL`, Lawn Mowing, 3 messages, last from the pro)

- [ ] **Step 1: Set up the Jest seam.** Both `apps/*/jest.setup.ts` get `setMockDelay(0, 0); setToday('2026-10-20'); beforeEach(() => resetDb());`
- [ ] **Step 2: Write the failing tests**

```ts
// pricing.test.ts
test('lot size is stable and in range', () => {
  expect(lotSizeSqft('addr-x')).toBe(lotSizeSqft('addr-x'));
  for (const id of ['a', 'b', 'addr-maple-ridge']) expect(lotSizeSqft(id)).toBeGreaterThanOrEqual(5000);
});
test('the demo address gets the catalog price', async () => {
  const { plans } = await getQuote('mowing', DEMO_ADDRESS_ID);
  expect(plans).toEqual([
    { frequency: 'weekly', price: 57, recommended: true },
    { frequency: 'every-2-weeks', price: 60, recommended: false },
    { frequency: 'monthly', price: 60, recommended: false },
  ]);
});
```

```ts
// customer.test.ts
test('catalog and seed', async () => {
  expect((await getServices()).map((s) => s.name)[0]).toBe('Mowing');
  expect(await getServices()).toHaveLength(11);
  expect((await getBookings()).map((b) => b.id)).toEqual(['b-mowing', 'b-treatment']);
  expect((await getBooking('b-mowing')).nextDate).toBe('2026-10-25');
  expect(await searchAddresses('maple')).toHaveLength(1);
  expect(await getNeighbors('78704')).toBe(49);
});
test('a new booking is the first thing the next read returns', async () => {
  const b = await createBooking({ serviceId: 'leaf-removal', frequency: 'one-time', price: 129, startDate: '2026-10-21', addressId: DEMO_ADDRESS_ID });
  expect((await getBookings())[0]!.id).toBe(b.id);
});
test('skip, pause and cancel', async () => {
  expect((await updateBooking('b-mowing', { type: 'skip' })).nextDate).toBe('2026-11-24');
  expect((await updateBooking('b-mowing', { type: 'pause', until: '2027-03-01' })).status).toBe('paused');
  await updateBooking('b-mowing', { type: 'cancel' });
  expect((await getBookings()).map((b) => b.id)).toEqual(['b-treatment']);
});
test('a canned reply arrives two seconds after sending', async () => {
  jest.useFakeTimers();
  await sendMessage('t-greenleaf', 'Can you come Friday?');
  jest.advanceTimersByTime(2000);
  expect((await getThread('t-greenleaf')).messages.at(-1)!.from).toBe('pro');
  jest.useRealTimers();
});
test('SEED=false empties the lists but keeps the catalog', async () => {
  configureMocks({ seed: false }); resetDb();
  expect(await getBookings()).toEqual([]);
  expect(await getThreads()).toEqual([]);
  expect(await getServices()).toHaveLength(11);
  configureMocks({ seed: true });
});
test('unknown ids reject', () => expect(getBooking('nope')).rejects.toThrow('Not found'));
```
- [ ] **Step 3: Run to verify they fail.** `pnpm --filter @mowly/customer test packages/mocks`. Expected: FAIL
- [ ] **Step 4: Implement the files above.** `seed.ts` exports `createSeed(): MockDb`, which builds every date from `today()`. The `pro` and `jobs` fields are typed now but filled by Task 4. Use `structuredClone` for the returned copies
- [ ] **Step 5: Run to verify they pass.** Same command. Expected: PASS
- [ ] **Step 6: Commit.** `git add packages/mocks apps/*/package.json apps/*/jest.setup.ts pnpm-lock.yaml && git commit -m "feat(mocks): in-memory database, customer seed and resolvers" -m "Refs #1"`

---

### Task 4: Pro seed and pro resolvers

**Files:**
- Create: `packages/mocks/src/pro.ts`
- Modify: `packages/mocks/src/seed.ts`, `packages/mocks/src/index.ts`
- Test: `packages/mocks/src/pro.test.ts`

**Interfaces:**
- Consumes: Task 3 `getDb`, `delay`, `MockDb`
- Produces: `getPro(): Promise<Pro>`, `updatePro(patch: Partial<Pro>): Promise<Pro>`, `getAvailableJobs(day?: IsoDate): Promise<Job[]>` (unclaimed jobs; with `day`, only those whose `availableDates` include it), `getClaimedJobs(): Promise<Job[]>` (sorted by `claimedDate`, then `routeOrder`), `getJob(id): Promise<Job>`, `claimJob(id: string, date: IsoDate): Promise<Job>` (rejects with `Error('Already claimed')` if claimed; if `date === today()` sets `routeOrder` to the current max + 1), `getTodayRoute(): Promise<Job[]>` (claimed today, by `routeOrder`), `getBilling(): Promise<Billing>` (one entry per claimed job dated before today, and the balance is their sum), `sendRecommendation(input: Omit<Recommendation, 'id'>): Promise<Recommendation>`
- Seed content (PRD "Pro app"): Mike Sullivan, Sullivan Lawn Care, Austin, TX, crew of 2, `customersServed: 1291`, category `lawn`, skills `['Mowing', 'Edging', 'Blowing']`, `businessName` and `yearFounded` filled (the "Build a profile" item counts as done) and `skills` non-empty (the "Add your skills" item counts as done). Every other checklist flag is false/null. Notifications are all true, and the bio and photos are empty. Jobs `job-01`…`job-10` are available, `job-11`…`job-22` are claimed, and `job-11`…`job-13` are claimed today with route order 1 to 3. Every pin `x`/`y` is between 0.1 and 0.9

- [ ] **Step 1: Write the failing tests**

```ts
test('seed invariants', async () => {
  const available = await getAvailableJobs();
  expect(available).toHaveLength(10);
  for (const j of available) {
    expect(j.price).toBeGreaterThanOrEqual(29.99); expect(j.price).toBeLessThanOrEqual(40.99);
    for (const d of j.availableDates) { expect(d >= today()).toBe(true); expect(d <= addDays(today(), 4)).toBe(true); }
  }
  expect(new Set(available.map((j) => j.serviceName)).size).toBeGreaterThanOrEqual(3);
  const claimed = await getClaimedJobs();
  expect(claimed).toHaveLength(12);
  expect(claimed.every((j) => j.claimedDate! >= today())).toBe(true);
  expect((await getTodayRoute()).map((j) => j.id)).toEqual(['job-11', 'job-12', 'job-13']);
  expect(await getBilling()).toEqual({ balance: 0, entries: [] });
});
test('the day filter', async () => {
  const day = addDays(today(), 1);
  expect((await getAvailableJobs(day)).every((j) => j.availableDates.includes(day))).toBe(true);
});
test('claiming for today moves the job to the end of the route', async () => {
  const job = (await getAvailableJobs(today()))[0]!;
  await claimJob(job.id, today());
  expect((await getAvailableJobs()).find((j) => j.id === job.id)).toBeUndefined();
  expect((await getTodayRoute()).at(-1)!.id).toBe(job.id);
  await expect(claimJob(job.id, today())).rejects.toThrow('Already claimed');
});
test('dates roll over a year boundary', async () => {
  setToday('2026-12-30'); resetDb();
  const dates = (await getAvailableJobs()).flatMap((j) => j.availableDates);
  expect(dates.some((d) => d.startsWith('2027-01'))).toBe(true);
  setToday('2026-10-20');
});
test('updatePro merges', async () => {
  await updatePro({ bankLinked: true });
  expect((await getPro()).bankLinked).toBe(true);
  expect((await getPro()).businessName).toBe('Sullivan Lawn Care');
});
test('SEED=false empties the job lists', async () => {
  configureMocks({ seed: false }); resetDb();
  expect(await getAvailableJobs()).toEqual([]); expect(await getClaimedJobs()).toEqual([]);
  configureMocks({ seed: true });
});
```
- [ ] **Step 2: Run to verify they fail.** `pnpm --filter @mowly/customer test packages/mocks/src/pro`. Expected: FAIL
- [ ] **Step 3: Implement the pro seed in `createSeed()` and the resolvers in `pro.ts`**
- [ ] **Step 4: Run to verify they pass.** Expected: PASS
- [ ] **Step 5: Commit.** `git add packages/mocks && git commit -m "feat(mocks): pro seed and resolvers" -m "Refs #1"`

---

### Task 5: Query hooks (`packages/api`)

**Files:**
- Modify: `packages/api/src/queryClient.ts`, `packages/api/src/index.ts`, `packages/api/package.json` (depends on `@mowly/mocks`, `@mowly/types`)
- Create: `packages/api/src/customer.ts`, `packages/api/src/pro.ts`
- Test: `packages/api/src/customer.test.tsx`, `packages/api/src/pro.test.tsx`

**Interfaces:**
- Consumes: every resolver from Tasks 3 and 4
- Produces:
  - `createQueryClient(): QueryClient`. Under Jest (`process.env.NODE_ENV === 'test'`) it uses `retry: false`, `gcTime: 0` for queries and mutations, and `notifyOnChangeProps: 'all'`. Otherwise it uses repairs' defaults. Repairs `DECISIONS.md` "Two more ways a green Jest run refuses to exit" explains why
  - `queryKeys`: `services`, `service(id)`, `addresses(query)`, `quote(serviceId, addressId)`, `neighbors(zip)`, `customer`, `bookings`, `booking(id)`, `threads`, `thread(id)`, `pro`, `jobs` (root `['jobs']`), `availableJobs(day?)`, `claimedJobs`, `job(id)`, `route`, `billing`
  - Customer hooks: `useServices()`, `useService(id)`, `useAddressSearch(query)`, `useQuote(serviceId, addressId)` (disabled while either is null), `useNeighbors(zip)`, `useCustomer()`, `useBookings()`, `useBooking(id)`, `useThreads()`, `useThread(id)` (uses `refetchInterval: 1000` while the last message is from the customer, so the canned reply shows up), `useCreateBooking()` (invalidates `bookings`), `useUpdateBooking()` (variables `{ id, change }`, invalidates `bookings`), `useSendMessage()` (variables `{ threadId, text }`, invalidates `threads`), `useResetDemo()` (invalidates everything)
  - Pro hooks: `usePro()`, `useUpdatePro()` (invalidates `pro`), `useAvailableJobs(day?)`, `useClaimedJobs()`, `useJob(id)`, `useTodayRoute()`, `useBilling()`, `useClaimJob()` (variables `{ id, date }`, invalidates `jobs`), `useSendRecommendation()`

- [ ] **Step 1: Write the failing tests.** Use a wrapper built from `createQueryClient()`, `await renderHook(...)`, and `waitFor`

```tsx
test('a booking created through the hook shows up in useBookings', async () => {
  const { result } = await renderHook(() => ({ list: useBookings(), create: useCreateBooking() }), { wrapper });
  await waitFor(() => expect(result.current.list.data).toHaveLength(2));
  await act(() => result.current.create.mutateAsync({ serviceId: 'mowing', frequency: 'weekly', price: 57, startDate: '2026-10-21', addressId: 'addr-maple-ridge' }));
  await waitFor(() => expect(result.current.list.data).toHaveLength(3));
});
test('useQuote waits for an address', async () => {
  const { result } = await renderHook(() => useQuote('mowing', null), { wrapper });
  expect(result.current.fetchStatus).toBe('idle');
});
// pro.test.tsx
test('claiming invalidates available and claimed', async () => {
  const { result } = await renderHook(() => ({ a: useAvailableJobs(), c: useClaimedJobs(), claim: useClaimJob() }), { wrapper });
  await waitFor(() => expect(result.current.a.data).toHaveLength(10));
  await act(() => result.current.claim.mutateAsync({ id: 'job-01', date: result.current.a.data![0]!.availableDates[0]! }));
  await waitFor(() => { expect(result.current.a.data).toHaveLength(9); expect(result.current.c.data).toHaveLength(13); });
});
```
- [ ] **Step 2: Run to verify they fail.** `pnpm --filter @mowly/customer test packages/api`. Expected: FAIL
- [ ] **Step 3: Implement.** Each hook is a thin `useQuery`/`useMutation` over its resolver with the key above
- [ ] **Step 4: Run to verify they pass.** Expected: PASS. Then `await waitFor(() => expect(client.isFetching()).toBe(0))` at the end of each test that leaves a refetch in flight
- [ ] **Step 5: Commit.** `git add packages/api && git commit -m "feat(api): query hooks over the mock resolvers" -m "Refs #1"`

---

### Task 6: Tokens, Tailwind preset and the basic components

**Files:**
- Modify: `packages/ui/tokens.js`, `packages/config/tailwind-preset.js`, `packages/ui/src/index.ts`
- Create: `packages/ui/src/{Button,Spinner,TextField,Checkbox,Radio,Toggle,Badge,Card,Skeleton}.tsx`, `packages/ui/src/useIsWide.ts`
- Modify: `packages/ui/src/FormField.tsx` (now a React Hook Form `Controller` around `TextField`), `packages/ui/src/HeaderBand.tsx` (green `primaryHeader` band, white title, `leading`/`action` slots and an optional `children` row below for the address), `packages/ui/src/Screen.tsx` (white background, with a `muted` prop for `pageMuted`)
- Delete: `packages/ui/src/StatusPill.tsx` (its job is now `Badge`)
- Test: `packages/ui/src/basics.test.tsx`

**Interfaces:**
- Produces:
  - `tokens.js` exports `colors` (exactly the PRD Design table plus `surface: '#FFFFFF'`, `border: '#E0E0E0'`, `scrim: 'rgba(0,0,0,0.4)'`, `routeBlue: '#2F80ED'`, `calendarBlue: '#2F80ED'`), `radius` and `layout` (`sidebarWidth: 240`, `maxContentWidth: 720`, `wideBreakpoint: 768`)
  - The preset's `theme.extend` carries `colors`, the PRD Typography `fontSize` block verbatim, and `fontFamily.sans` through NativeWind's `platformSelect`: `System` on iOS and `Inter, system-ui, sans-serif` on web, with Inter loaded from Google Fonts in `WebShell` (Task 9). This deviates from the PRD's literal `['Inter', 'System']` because iOS rejects an unregistered family. Record it in `DECISIONS.md`
  - `Button({ label, onPress, testID, variant = 'filled', disabled, loading }: { variant?: 'filled' | 'outline' | 'orange' | 'text'; … })`. It is pill-shaped and full width, with an uppercase label in the `button` text style. While `loading` it shows a disabled gray button with a `Spinner` inside, and that spinner's testID is `${testID}-spinner`
  - `Spinner({ testID?, size?: 'small' | 'large' })`, a gray `ActivityIndicator`
  - `TextField({ label, value, onChangeText, testID, placeholder?, error?, secureTextEntry?, keyboardType?, multiline?, maxLength?, editable?, right?: ReactNode, onFocus?, onBlur? })`. It has a green border while focused, shows `error` below with testID `${testID}-error`, and uses `placeholder` color tokens
  - `FormField<T>({ control, name, …TextField props without value/onChangeText/error })`
  - `Checkbox({ checked, onChange, testID, label?: ReactNode })`, `Radio({ selected, onPress, testID, label })`, `Toggle({ value, onValueChange, testID, label? })` (wraps `Switch`, track `primary`)
  - `Badge({ label, tone = 'green' }: { tone?: 'green' | 'gray' | 'orange' })` (the "Scheduled" chip, and also the numeric badge), `Card({ children, className?, testID? })`, `Skeleton({ className?, testID? })`
  - `useIsWide(): boolean` (window width ≥ `layout.wideBreakpoint`)

- [ ] **Step 1: Write the failing tests**

```tsx
test('Button disables and spins while loading', async () => {
  const onPress = jest.fn();
  await render(<Button testID="b" label="Continue" onPress={onPress} loading />);
  expect(screen.getByTestId('b-spinner')).toBeTruthy();
  fireEvent.press(screen.getByTestId('b'));
  expect(onPress).not.toHaveBeenCalled();
});
test('Button disabled does not press', async () => { /* same with disabled */ });
test('TextField shows its error', async () => {
  await render(<TextField testID="t" label="Name" value="" onChangeText={() => {}} error="Enter your name" />);
  expect(screen.getByTestId('t-error')).toHaveTextContent('Enter your name');
});
test('Checkbox toggles', async () => {
  const onChange = jest.fn();
  await render(<Checkbox testID="c" checked={false} onChange={onChange} label="Terms" />);
  fireEvent.press(screen.getByTestId('c'));
  expect(onChange).toHaveBeenCalledWith(true);
});
test('Toggle reports the new value', async () => { /* fireEvent(getByTestId('g'), 'valueChange', true) */ });
```
- [ ] **Step 2: Run to verify they fail.** `pnpm --filter @mowly/customer test packages/ui`. Expected: FAIL
- [ ] **Step 3: Implement.** Use accessibility roles (`button`, `checkbox`, `radio`, `switch`) with `accessibilityState`
- [ ] **Step 4: Run to verify they pass.** Expected: PASS
- [ ] **Step 5: Commit.** `git add packages && git commit -m "feat(ui): Mowly tokens, type scale and basic components" -m "Refs #1"`

---

### Task 7: Overlay and list components

**Files:**
- Create: `packages/ui/src/{BottomSheet,Select,Accordion,ListRow,Toast,Wordmark,SwitchAppLink,TabBar}.tsx`, `packages/ui/src/images.ts`, `packages/ui/assets/services/<serviceId>.jpg` ×11, `packages/ui/assets/aerial.jpg`, `packages/ui/assets/avatars/{1,2,3,4}.jpg`, `packages/ui/assets/CREDITS.md`
- Modify: `packages/ui/src/ConfirmDialog.tsx` (Mowly tokens, iOS-alert look for P25, and a `destructive?: boolean` defaulting to true that makes confirm `danger`, else `primary`), `packages/ui/src/index.ts`
- Test: `packages/ui/src/overlays.test.tsx`

**Interfaces:**
- Produces:
  - `BottomSheet({ visible, onClose, testID, title?, children })` (a `Modal` sliding up over a `scrim` that closes on tap)
  - `Select<V extends string>({ label, value, options: { value: V; label: string }[], onChange, testID, placeholder? })`. Its field opens a `BottomSheet`, and option testIDs are `${testID}-option-${value}`
  - `Accordion({ title, testID, children, defaultOpen? })`. Pressing the header (testID `${testID}-header`) toggles the body (testID `${testID}-body`)
  - `ListRow({ title, testID, subtitle?, left?, right?, onPress?, disabled?, chevron = true, badge? })`, with a green chevron (Ionicons `chevron-forward`) and gray text while `disabled`
  - `showToast(message: string): void` plus `<ToastHost />` (testID `toast`, hides after 2500 ms). Backed by a tiny Zustand store inside `packages/ui`
  - `Wordmark({ subtitle? })`: "Mowly", with "for lawn care professionals" for pro
  - `SwitchAppLink()`: `null` on native. On web it is a small "Switch app" link (testID `switch-app`) that sets `window.location.href = '/'`
  - `TabBar(props: BottomTabBarProps)` for Expo Router `Tabs` `tabBar`. It draws Ionicons with labels, green when active and gray otherwise, and lays out vertically when `useIsWide()`
  - `serviceImage(id: ServiceId): ImageSourcePropType`, `AERIAL_IMAGE`, `AVATARS: ImageSourcePropType[]` (the avatars are indexed by `Pro.avatar`)
- Photos: free stock (Unsplash or Pexels license) downloaded into the repo, about 800px wide JPEGs, with each source URL listed in `CREDITS.md`

- [ ] **Step 1: Write the failing tests**

```tsx
test('Select opens a sheet and picks', async () => {
  const onChange = jest.fn();
  await render(<Select testID="s" label="Category" value={undefined} onChange={onChange}
    options={[{ value: 'lawn', label: 'Basic Lawn Care' }, { value: 'pool', label: 'Basic Pool Care' }]} />);
  fireEvent.press(screen.getByTestId('s'));
  fireEvent.press(screen.getByTestId('s-option-pool'));
  expect(onChange).toHaveBeenCalledWith('pool');
});
test('Accordion toggles', async () => {
  await render(<Accordion testID="a" title="Q">Answer</Accordion>);
  expect(screen.queryByTestId('a-body')).toBeNull();
  fireEvent.press(screen.getByTestId('a-header'));
  expect(screen.getByTestId('a-body')).toBeTruthy();
});
test('ListRow disabled ignores presses', async () => { /* onPress not called */ });
test('toast shows then hides', async () => {
  jest.useFakeTimers();
  await render(<ToastHost />);
  act(() => showToast('Recommendation sent'));
  expect(screen.getByTestId('toast')).toHaveTextContent('Recommendation sent');
  act(() => jest.advanceTimersByTime(2500));
  expect(screen.queryByTestId('toast')).toBeNull();
  jest.useRealTimers();
});
test('ConfirmDialog confirms', async () => { /* onConfirm called on confirmTestID */ });
```
- [ ] **Step 2: Run to verify they fail.** `pnpm --filter @mowly/customer test packages/ui/src/overlays`. Expected: FAIL
- [ ] **Step 3: Implement, and download the photos**
- [ ] **Step 4: Run to verify they pass.** Expected: PASS
- [ ] **Step 5: Commit.** `git add packages/ui && git commit -m "feat(ui): sheets, select, accordion, rows, toast, tab bar and images" -m "Refs #1"`

---

### Task 8: Session store, providers and the customer shell

**Files:**
- Create: `packages/stores/src/useSession.ts`, `packages/stores/src/index.ts`, `apps/customer/app/(tabs)/_layout.tsx`, `apps/customer/app/(tabs)/{index,services,inbox,profile}.tsx`, `apps/customer/app/+html.tsx`
- Modify: `packages/features/src/AppProviders.tsx` (no hydration gate; mounts `ToastHost`; takes `queryClient?: QueryClient` for tests), `packages/features/src/WebShell.tsx` (`title` prop, `<meta name="robots" content="noindex">`, Inter from Google Fonts, `body` background `#FFFFFF`), `apps/customer/app/_layout.tsx`, `apps/customer/app/index.tsx` (delete; Browse is `(tabs)/index`)
- Test: `apps/customer/tests/shell.test.tsx` (replaces `smoke.test.tsx`), `packages/stores/src/useSession.test.ts`

**Interfaces:**
- Consumes: `TabBar`, `HeaderBand`, `Screen`, `SwitchAppLink`, `configureMocks`
- Produces:
  - `useSession`: `{ signedIn: boolean; signIn(): void; signOut(): void }`, starting at `signedIn: true`, not persisted (PRD: persistence only if needed; both apps boot signed in. Record in `DECISIONS.md`)
  - Root layout: `configureMocks({ seed: process.env.EXPO_PUBLIC_SEED !== 'false' })` at module scope, then `<AppProviders><Stack screenOptions={{ headerTintColor: colors.primary, headerTitleAlign: 'center', headerTitleStyle: { color: colors.primary } }}>`. `(tabs)` has `headerShown: false`
  - Tabs: `index` "Browse" (`storefront-outline`), `services` "Service" (`calendar-outline` with a check; the closest Ionicon), `inbox` "Inbox" (`file-tray-outline`), `profile` "Profile" (`person-outline`). Tab button testIDs are `tab-browse`, `tab-services`, `tab-inbox`, `tab-profile`. `tabBarPosition: 'left'` when `useIsWide()`
  - Each tab screen is a placeholder `HeaderBand` with its title (`Browse`, `My Services`, `Inbox`, `Profile`) and screen testID `screen-<tab>`. The customer track replaces them
  - `+html.tsx`: `WebShell title="Mowly"`
  - Test helper `apps/customer/tests/renderApp.tsx`: `renderApp(initialUrl = '/')` = `renderRouter(<path to apps/customer/app>, { initialUrl })` from `expo-router/testing-library`

- [ ] **Step 1: Write the failing tests**

```tsx
test('boots on Browse and switches tabs', async () => {
  await renderApp('/');
  expect(await screen.findByTestId('screen-browse')).toBeTruthy();
  fireEvent.press(screen.getByTestId('tab-services'));
  expect(await screen.findByTestId('screen-services')).toBeTruthy();
  expect(screen).toHavePathname('/services');
});
// useSession.test.ts
test('sign out and back in', () => {
  useSession.getState().signOut(); expect(useSession.getState().signedIn).toBe(false);
  useSession.getState().signIn(); expect(useSession.getState().signedIn).toBe(true);
});
```
- [ ] **Step 2: Run to verify they fail.** `pnpm --filter @mowly/customer test shell useSession`. Expected: FAIL
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run to verify they pass.** Expected: PASS. Then run `pnpm typecheck`
- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat(customer): providers and the four-tab shell" -m "Refs #1"`

---

### Task 9: Pro drawer shell

**Files:**
- Create: `apps/pro/app/(app)/_layout.tsx`, `apps/pro/app/(app)/{index,jobs,skills,calendar,crews,inbox,customers,performance,support,settings}.tsx` (placeholders; the pro track turns some into folders), `apps/pro/app/welcome.tsx` (placeholder), `apps/pro/app/+html.tsx`, `apps/pro/src/drawer/{DrawerMenu,useDrawer,DrawerButton}.tsx`, `apps/pro/tests/renderApp.tsx`
- Modify: `apps/pro/app/_layout.tsx` (same root as customer, with `configureMocks`), delete `apps/pro/app/index.tsx`
- Test: `apps/pro/tests/shell.test.tsx`

**Interfaces:**
- Consumes: `useSession`, `ListRow`, `Badge`, `useIsWide`
- Produces:
  - `DRAWER_ITEMS: { href: Href; label: string; icon: IoniconName; testID: string }[]` in PRD order: Dashboard `/`, Available Jobs `/jobs`, Skills and Services `/skills`, Calendar `/calendar`, Crews `/crews`, Inbox `/inbox`, Customer Search `/customers`, Performance `/performance`, Support `/support`, Settings `/settings`. TestIDs are `drawer-<last path segment or dashboard>`
  - `useDrawer`: Zustand `{ open: boolean; setOpen(open: boolean): void }` (app-local UI flag)
  - `DrawerMenu({ settingsBadge }: { settingsBadge: number })`: the user's name in green capitals, then the rows with a green icon when active and gray otherwise. On narrow screens it is a left-sliding `Modal`. When `useIsWide()` it is a permanent sidebar and `DrawerButton` hides
  - `DrawerButton()`: the green hamburger (testID `drawer-toggle`) used as `headerLeft` on drawer-root screens
  - `(app)/_layout.tsx`: `<Redirect href="/welcome" />` when `!signedIn`. Otherwise a row with `DrawerMenu` and a native `Stack` (title color/tint `primary`, centered). `settingsBadge` is `0` here. The pro track computes the real count
  - `+html.tsx`: `WebShell title="Mowly Pro"`
  - Drawer placeholders render their title with screen testID `screen-<segment>` (`screen-dashboard` for `/`)

- [ ] **Step 1: Write the failing tests**

```tsx
test('the drawer navigates', async () => {
  await renderApp('/');
  expect(await screen.findByTestId('screen-dashboard')).toBeTruthy();
  fireEvent.press(screen.getByTestId('drawer-toggle'));
  fireEvent.press(screen.getByTestId('drawer-calendar'));
  expect(await screen.findByTestId('screen-calendar')).toBeTruthy();
});
test('signed out goes to welcome', async () => {
  useSession.getState().signOut();
  await renderApp('/settings');
  expect(screen).toHavePathname('/welcome');
  useSession.getState().signIn();
});
```
- [ ] **Step 2: Run to verify they fail.** `pnpm --filter @mowly/pro test shell`. Expected: FAIL
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run to verify they pass.** Expected: PASS
- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat(pro): drawer shell with every destination" -m "Refs #1"`

---

### Task 10: Maestro, simulator builds and the smoke flows

**Files:**
- Create: `scripts/e2e.sh`, `apps/customer/.maestro/common/launch.yaml`, `apps/customer/.maestro/smoke.yaml`, `apps/pro/.maestro/common/launch.yaml`, `apps/pro/.maestro/common/open-drawer-item.yaml`, `apps/pro/.maestro/smoke.yaml`
- Modify: root and app `package.json` scripts

**Interfaces:**
- Produces:
  - App script `e2e:build`: `expo prebuild --platform ios && expo run:ios --device "${E2E_DEVICE:-iPhone 16}" --port <8081|8082> --no-bundler`. Root script: `turbo run e2e:build --concurrency 1`
  - `scripts/e2e.sh <customer|pro|all> [flow.yaml]`. It boots `${E2E_DEVICE:-iPhone 16}`, starts that app's Metro on its port in the background (log in `.e2e-metro-<app>.log`), waits until `curl -s localhost:<port>/status` returns `packager-status:running`, then runs `maestro --device <udid> test --format junit --output apps/<app>/.maestro/report.xml <flow or apps/<app>/.maestro>`, kills Metro, and exits with Maestro's code. `all` runs both apps and exits non-zero if either failed
  - Root scripts: `e2e: scripts/e2e.sh all`, `e2e:customer: scripts/e2e.sh customer`, `e2e:pro: scripts/e2e.sh pro`
  - `common/launch.yaml` (customer): `launchApp: { appId: com.renatoprobst.mowly, clearState: true }` then `extendedWaitUntil: { visible: { id: tab-browse }, timeout: 120000 }`. For pro: appId `com.renatoprobst.mowlypro`, waiting for `drawer-toggle`
  - `common/open-drawer-item.yaml` (pro): taps `drawer-toggle`, then `id: ${ITEM}`
  - Every flow starts with `runFlow: common/launch.yaml`

- [ ] **Step 1: Install Maestro.** If `java -version` reports less than 17, run `brew install openjdk@17` and export `JAVA_HOME` per brew's caveat. Then `brew tap mobile-dev-inc/tap && brew install mobile-dev-inc/tap/maestro && maestro --version`. Expected: a version prints with no login prompt
- [ ] **Step 2: Build both apps for the simulator in the background.** `xcrun simctl boot "iPhone 16"; pnpm e2e:build > .e2e-build.log 2>&1` with `run_in_background`, then read the log until it ends with both installs succeeding (10 to 20 minutes each)
- [ ] **Step 3: Write the smoke flows.** Customer: launch, then `tapOn: { id: tab-services }`, then `assertVisible: { id: screen-services }`. Pro: launch, then `runFlow: { file: common/open-drawer-item.yaml, env: { ITEM: drawer-calendar } }`, then `assertVisible: { id: screen-calendar }`
- [ ] **Step 4: Run them.** `pnpm e2e`. Expected: both flows PASS, exit 0, and `apps/*/.maestro/report.xml` written (it is gitignored)
- [ ] **Step 5: Record in `DECISIONS.md`** the per-app Metro ports and the `E2E_DEVICE` variable. The pro track runs on its own simulator (`xcrun simctl create "iPhone 16 Mowly Pro" "iPhone 16"`) so the two tracks never drive one device at once
- [ ] **Step 6: Commit.** `git add -A && git commit -m "test(e2e): Maestro harness and smoke flows for both apps" -m "Refs #1"`

---

### Task 11: Landing page, web build and the foundation check

**Files:**
- Create: `apps/landing/index.html`, `apps/landing/robots.txt`, `scripts/assemble-web.mjs`, `README.md` (replaces the Portuguese planning README; that file moves to `docs/planning.md`)
- Modify: root `package.json` (`build:web: turbo run build:web && node scripts/assemble-web.mjs`), `turbo.json` (`build:web` outputs `dist/**`)

**Interfaces:**
- Produces:
  - `apps/landing/index.html`: a single page in Mowly's design system with the wordmark and two large cards side by side, stacked under 768px. "I need lawn care" links to `/customer/` and "I'm a lawn pro" links to `/pro/`. One line says the apps run on mock data. It has `<meta name="robots" content="noindex">`. Inline CSS uses token hex values copied from `tokens.js`, with a comment saying so (it has no build step)
  - `robots.txt`: `User-agent: *` / `Disallow: /`
  - `assemble-web.mjs`: empties `dist/`, copies `apps/landing/*` to `dist/`, `apps/customer/dist` to `dist/customer`, and `apps/pro/dist` to `dist/pro`
  - `README.md`: what Mowly is, the run commands (PRD "Running it"), and the one disclaimer paragraph (a UI and architecture study for a portfolio, with no affiliation with or endorsement by LawnStarter). This is the only place the company is named

- [ ] **Step 1: Build.** `pnpm build:web`. Expected: exit 0 and `dist/index.html`, `dist/robots.txt`, `dist/customer/index.html`, `dist/pro/settings.html` exist
- [ ] **Step 2: Serve and check.** `npx serve dist` in the background. Open `/`, `/customer`, `/pro/settings` and `/pro/calendar` directly in Chrome (claude-in-chrome). Expected: landing cards link through, each app loads its shell, deep links load without a 404, the "Switch app" link returns to `/`, and the console has no errors. At width ≥ 768 the customer tabs sit on the left and the pro drawer is permanent
- [ ] **Step 3: Fix anything the check found**, then rerun Steps 1 and 2
- [ ] **Step 4: Foundation done check.** `pnpm test && pnpm typecheck && pnpm lint && pnpm build:web && pnpm e2e`, then the Task 1 `grep -ri repairs` line. Expected: all green and no grep output
- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat(web): landing page and one static dist for both apps" -m "Closes #1"`
- [ ] **Step 6: Merge into `master` and push** (through `superpowers:finishing-a-development-branch`, choosing a local merge). From the main checkout, run `git checkout master && git merge --no-ff foundation -m "merge: foundation" -m "Refs #1" && git push origin master`. The `Closes #1` commit reaches `master` through the merge, so the push closes #1. Confirm with `gh issue view 1 -R sagits/Mowly --json state`. Expected: `CLOSED`. Then remove the worktree (`git worktree remove .worktrees/foundation`) and delete the branch (`git branch -d foundation`). Both track worktrees branch from this `master`
