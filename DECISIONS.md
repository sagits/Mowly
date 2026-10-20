# Decisions

Every open point decided while building Mowly, with its reason, newest last.

## The monorepo starts from `sagits/repairs`, stripped to its skeleton

Cloned the template at depth 1 and copied only what the PRD's Keep list names: root `package.json`,
`pnpm-workspace.yaml`, `turbo.json`, `eslint.config.js`, `packages/config`, and per-app config
(`app.json`, babel, metro, tailwind, `global.css`, `nativewind-env.d.ts`, `tsconfig.json`,
`app/_layout.tsx`, `app/+html.tsx`). `apps/client` became `apps/customer`; `apps/pro` stayed.
Kept in the packages: the query client factory, `AppProviders` (query client and safe-area only),
`WebShell`, and `ConfirmDialog`, `FormField`, `HeaderBand`, `Screen`, `StatusPill` in `packages/ui`
with `tokens.js`, because the Tailwind preset imports the tokens and later tasks rewrite them.

Dropped: `apps/both`, the parity script, every Detox file and dependency, the DummyJSON client,
the write overlay, the Role lock, hydration gates, `packages/testing`, and every repairs screen,
type, store and test. The packages' `index.ts` barrels export only what survived. `StatusPill`
carries a local placeholder status type until the Mowly domain types exist. Mowly runs on Maestro
(PRD) and a persisting mock database, so none of that machinery has a job here.

The inherited config decisions still hold: hoisted `nodeLinker`, `autoInstallPeers: false`, ESLint
pinned to 9, the `paths` entry for `expo-router` in each app's `tsconfig.json`, and `@mowly/config`
depending on `@mowly/ui` for the tokens. ESLint's resolver path now points at `apps/customer`.

## Jest is one project per app, and package tests run in the customer project

Each app has its own `jest.config.js`. The customer project's roots are its `app`, `src` and
`tests` plus `../../packages`; the pro project's roots stop at its own folders. Package tests run
once, in the customer project, which is repairs' one-project pattern applied to two apps: a second
copy would run the same tests against the same files. The pro project sets `passWithNoTests` so
`pnpm test` stays green until the pro app has tests of its own. The AsyncStorage Jest mock that
repairs kept in `jest.setup.js` is not carried over, because no store persists yet.

## `@expo/vector-icons` is added for the icon set

Mowly needs dozens of icons (tab bar, drawer, list rows) and repairs draws its few by hand. Ionicons
from `@expo/vector-icons` is the one set used throughout. Installed with `npx expo install` in both
apps, in Task 1, so no later native rebuild is needed.

## `react-native-svg` is added for drawn shapes

Installed with `npx expo install` in both apps for the same reason: it is a native module, so it
goes in before the first native build. Used for shapes the icon set cannot express.

## Service prices and the five invented Austin addresses

PRD fixes only Mowing (Weekly $57, Every 2 Weeks $60, Monthly $60). The rest are plausible catalog prices at the demo address (other addresses scale by lot size): Leaf Removal $129 one-time / $99 monthly; Flower Bed Weeding $79 / $69; Bush Trimming $89 / $79; Pool Cleaning $119 monthly / $129 every 2 weeks; Lawn Treatment $69 / $79; Mosquito Prevention $74 / $84; Aeration $119 / $109; Aeration & Overseeding $189 / $169; Cleanup $149 / $129; Weeding $69 / $59. The five invented addresses next to 1820 Maple Ridge Drive: 2406 Barton Hills Drive 78704, 715 Oak Hollow Lane 78745, 3310 Live Oak Street 78722, 9102 Cedar Crest Road 78748, 1204 Pecan Grove Court 78704. The seeded Lawn Treatment booking is $69 to match its catalog price.

## Font family: `System` on native, Inter on web (deviates from the PRD)

The PRD's Typography block says `fontFamily.sans: ['Inter', 'System']`. On iOS an unregistered family name is rejected rather than falling back, so the preset picks per platform: `System` on iOS and Android, `Inter, system-ui, sans-serif` on web, with Inter loaded from Google Fonts in `WebShell` (Task 9). NativeWind sets `NATIVEWIND_OS` to the bundle's platform for the Tailwind config (including `web`), so the preset tests for `ios` or `android` and treats anything else (web, unset) as web. Plain values are used instead of NativeWind's `platformSelect`, whose native string form cannot carry the comma-separated web stack.

## Both apps boot signed in, and the session is not persisted

`useSession` starts at `signedIn: true` and lives in memory only. The PRD asks for persistence only if needed, and a demo that opens straight onto the app needs none.

## Jest and `expo-router` in the hoisted layout

The template's `tsconfig.json` mapped `expo-router` to `./node_modules/expo-router` inside each app. With hoisted installs that folder does not exist, and jest-expo turns tsconfig `paths` into module mappers, so `expo-router/testing-library` could not load. Both apps now point at `../../node_modules/expo-router`. The customer's Jest config also stubs `*.css` (NativeWind's stylesheet cannot be parsed by Jest), and `tests/renderApp.tsx` copies `renderRouter`'s `getPathname` helpers onto RNTL's `screen`, because RNTL 14's async `render` leaves them on the pending promise and `toHavePathname` would otherwise fail.

## Pro drawer: `Placeholder` helper and the name source

The ten drawer placeholders share `apps/pro/src/drawer/Placeholder.tsx` (title plus `screen-<segment>` testID) instead of repeating the markup. The drawer header name comes from `usePro()` (first and last name, uppercased). Pro's Jest project now stubs `*.css` and drops `passWithNoTests`; its tsconfig gained `types: ["jest","node"]`, mirroring the customer fixes. `SwitchAppLink` sits at the bottom of the drawer (renders null on native).

## Maestro harness: ports, device, and three build/run findings

- **Metro ports:** customer 8081, pro 8082. `scripts/e2e.sh` starts only the Metro of the app under test and kills it on exit (trap). `E2E_DEVICE` (default `iPhone 16`) picks the simulator for both the build and the run. The pro track can use its own simulator (`xcrun simctl create "iPhone 16 Mowly Pro" "iPhone 16"`, then `E2E_DEVICE="iPhone 16 Mowly Pro"`) so two tracks never drive one device at once.
- **`--port` and `--no-bundler` are mutually exclusive in `expo run:ios`** (the brief's verbatim script fails with "CommandError"). The port is baked into the Debug build through `RCT_METRO_PORT` (Info.plist reads `$(RCT_METRO_PORT)`), so each app's `e2e:build` sets `RCT_METRO_PORT=<port>` for prebuild and run and drops `--port`.
- **Never start Metro with `--ios`/`--ios=false`:** Expo parses `--ios=false` as true and opens Expo Go with an "Open in Mowly?" system dialog over the app. Metro starts with `--port` only; the Debug build already points at it.
- **Maestro `clearState` fails with "did not stop in time"** when the other app was left in the foreground by the previous flow. `e2e.sh` terminates both apps before each Maestro run.
- Both builds took about 7 minutes together on this machine.
