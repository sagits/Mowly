# Mowly

Mowly is a lawn-care marketplace built as two Expo apps in one monorepo: a customer app (browse
services, get a quote, book) and a pro app (jobs, calendar, route, billing). Both run on iOS and on
the web from one codebase, on mock data only: no backend, no auth, no payments.

## Running it

| What | Command |
|---|---|
| Customer app in the simulator | `pnpm dev:customer` |
| Pro app in the simulator | `pnpm dev:pro` |
| Simulator builds for e2e | `pnpm e2e:build` |
| Maestro flows | `pnpm e2e` (both apps), `pnpm e2e:customer`, `pnpm e2e:pro` |
| Unit and integration tests | `pnpm test` |
| Web build | `pnpm build:web` (landing + both apps into `dist/`) |
| Web smoke check | `npx serve dist` |

## Platform-specific files

There are no `.web.tsx` files. Web behavior comes from responsive layout inside shared components.

## Disclaimer

Mowly is a UI and architecture study for a portfolio. It has no affiliation with and is not
endorsed by LawnStarter.

The earlier planning notes are in [docs/planning.md](docs/planning.md).
