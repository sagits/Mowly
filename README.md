# Mowly

Mowly is a lawn care marketplace with two sides, each its own app:

- **Mowly**, for homeowners: pick a service, get an instant quote for your address, choose how often
  and when to start, and book. Once booked, you can manage upcoming services (skip, reschedule,
  change frequency, pause, cancel) and message your pro.
- **Mowly Pro**, for lawn care professionals: finish an onboarding checklist, browse and claim
  available jobs, see claimed jobs on a calendar, follow today's route, recommend extra services to
  a customer, and manage settings and billing.

Both apps run on iOS and on the web from the same code. On the web the customer app is served at
`/customer` and the pro app at `/pro`; `/` opens the pro app.

Everything runs on mock data. There is no backend, no real sign in, and no payments.


## Workflow

1. Took screenshots and videos of both Lawnstarter apps and put them in `screenshots/` (separated by app)
2. Discussed with an agent that I wanted to build a turbo monorepo with 2 apps to clone the 2 apps in the `screenshots/` folder. Also sent the links to the store apps and website of LawnStarter so the agent could understand what the company does
3. Explained the architecture (libraries, system design, e2e with Maestro, integration tests with Jest, using react-native-web to generate a web build to be able to host at vercel) I wanted to use and asked the agent to create a [PRD](./PRD.md) to recreate the features on the screenshots using this stack
4. Reviewed the generated [PRD](./PRD.md) (app names, stack, scope), made the necessary changes to it (updated things the agent didn't get right, decided some more libraries we could use, reviewed the architecture of the project)
5. Created a new repo for the clone, with the [PRD](./PRD.md) and screenshots inside `poc/`
6. Added the superpowers skill set to the repo and init `CLAUDE.md` with information about using it
7. Worked inside the repo with superpowers to break [`PRD.md`](./PRD.md) into tickets and implementation plans, which generated [GitHub issues](https://github.com/sagits/Mowly/issues)
8. Used superpowers to implement the issues and build the project, with e2e and integration tests

## Architecture

```
apps/
  customer/   Mowly (Expo Router, iOS + web)
  pro/        Mowly Pro (Expo Router, iOS + web)
  landing/    static page at / that redirects to /pro/
packages/
  types/      domain types (Service, Booking, Job, Pro...), date helpers, Zod form schemas
  mocks/      seed data, in-memory database and async resolvers
  api/        TanStack Query hooks and query keys over the resolvers
  stores/     Zustand stores for client-only state (session, UI flags)
  ui/         design tokens and shared React Native components
  features/   app providers and the web document shell
  config/     shared TypeScript, ESLint and Tailwind preset
```

- **Data flow.** Screens read and write only through the TanStack Query hooks in `packages/api`.
  The hooks call async mock resolvers that behave like a real API: they wait 600 to 1200 ms and
  return copies. A write updates the in-memory database and invalidates the queries it affects, so
  the next read returns the new data.
- **Seed data.** Every date is relative to today, so the demo never looks stale. Set
  `EXPO_PUBLIC_SEED=false` to start with empty lists and see the empty states.
- **Client state.** Zustand holds only what the mock API does not own: the session, the quote in
  progress, UI flags.
- **UI.** Screens use React Native core components styled with NativeWind (Tailwind). Every color
  comes from the tokens in `packages/ui/tokens.js`. Shared building blocks live in `packages/ui`:
  Button, TextField, Select, BottomSheet, ConfirmDialog, Accordion, ListRow, Toast, TabBar and
  others.
- **Navigation.** The customer app uses bottom tabs (Browse, Service, Inbox, Profile), fixed at the
  bottom at every width. The pro app uses a drawer that slides in from the left when you tap the
  hamburger, at every width.
- **Web.** Both apps use static export, so static deep links such as `/pro/calendar` load directly on
  any static host. The dynamic ones (service, chat, job and day pages) need the host rewrites in
  `vercel.json`; the Vercel project needs the env var `ENABLE_EXPERIMENTAL_COREPACK=1`. Every page is `noindex` and `robots.txt` disallows everything. The web is a showcase
  of the phone apps: on a desktop browser each app draws an iPhone whose screen is an `<iframe>` of
  the current URL, with a guide to both apps on the left and a "Switch to client app" / "Switch to
  provider app" link above the phone. Inside the iframe the window really is 393 px wide, so the app
  renders exactly as on a phone. Phone browsers get the plain app, with the switch link in the
  customer tabs strip and at the bottom of the pro drawer. `/` opens the pro app.
- **`.web.tsx` files.** None (`git ls-files '*.web.tsx'` is empty). Every screen renders on the web
  from the same source; the few web-only details (the phone frame, the switch link, `aria-*` props
  for react-native-web) are `Platform.OS === 'web'` checks inside shared components.

## Tech stack

- Expo 57 with Expo Router
- React Native 0.86 and React 19
- TypeScript
- NativeWind and Tailwind
- TanStack Query
- Zustand
- React Hook Form with Zod
- Turborepo with pnpm
- Jest with React Native Testing Library for unit and integration tests
- Maestro for end-to-end flows on the iOS simulator

## Running it

Requires Node 22.13 or later and pnpm 12. Run `pnpm install` first.

| What | Command |
|---|---|
| Customer app in the iOS simulator | `pnpm dev:customer` |
| Pro app in the iOS simulator | `pnpm dev:pro` |
| Unit and integration tests | `pnpm test` |
| Type check and lint | `pnpm typecheck`, `pnpm lint` |
| Simulator builds for end-to-end tests | `pnpm e2e:build` |
| Maestro flows | `pnpm e2e` (both apps), `pnpm e2e:customer`, `pnpm e2e:pro` |
| Web build (root redirect + both apps into `dist/`) | `pnpm build:web` |
| Serve the web build locally | `npx serve dist` |

The simulator commands expect an `iPhone 16` simulator. Boot it with `xcrun simctl boot "iPhone 16"`.

## Test report

`pnpm test` runs Jest: 106 tests in 28 suites for the customer app and 79 in 20 suites for the pro
app, all passing. The Maestro flows ran on an iPhone 16 simulator (iOS 18.6); the reports are `apps/customer/.maestro/report.xml` and `apps/pro/.maestro/report.xml`.

| App | Flows | Passed | Failed |
|---|---|---|---|
| Mowly (customer) | 10: smoke, quote-funnel, funnel-close, address, my-services, manage-service, inbox, chat, profile, demo | 10 | 0 |
| Mowly Pro | 9: smoke, sign-up, sign-out, checklist, available-jobs, calendar, recommend, settings, demo | 9 | 0 |

The web build was checked in Chrome at 1280 px (phone frame) and 390 px (plain app): every route
and static deep link, both switch links, the guide, the quote funnel and the pro forms with mouse and
keyboard, and a console with no errors or react-native-web warnings.

## Pull requests

PR descriptions follow [`.github/pull_request_template.md`](.github/pull_request_template.md): What is this
change?, Solution, How to test, Evidences and Notes. GitHub prefills it on new PRs.

## Disclaimer

Mowly is a UI and architecture study built for a portfolio. It has no affiliation with and is not
endorsed by LawnStarter.
