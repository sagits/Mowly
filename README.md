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
  bottom at every width. The pro app uses a drawer that slides in from the left and becomes a
  permanent left sidebar on wide web screens. On wide screens content is centered with a max width.
- **Web.** Both apps use static export, so deep links such as `/pro/calendar` load directly on any
  static host. Every page is `noindex`. There are no `.web.tsx` files: web behaviour comes from the
  responsive layout inside the shared components.

## Tech stack

Expo 57 with Expo Router, React Native 0.86, React 19, TypeScript, NativeWind and Tailwind, TanStack
Query, Zustand, React Hook Form with Zod, Turborepo with pnpm. Tests use Jest with React Native
Testing Library, and Maestro for end-to-end flows on the iOS simulator.

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

## Pull requests

PR descriptions follow [`.github/pull_request_template.md`](.github/pull_request_template.md): What is this
change?, Solution, How to test, Evidences and Notes. GitHub prefills it on new PRs.

## Disclaimer

Mowly is a UI and architecture study built for a portfolio. It has no affiliation with and is not
endorsed by LawnStarter.
