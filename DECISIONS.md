# Decisions

Every open point decided while building Mowly, with its reason, newest last.

## The monorepo starts from `sagits/repairs`, stripped to its skeleton

Cloned the template at depth 1 and copied only what the PRD's Keep list names: root `package.json`,
`pnpm-workspace.yaml`, `turbo.json`, `eslint.config.js`, `packages/config`, and per-app config
(`app.json`, babel, metro, tailwind, `global.css`, `nativewind-env.d.ts`, `tsconfig.json`,
`app/_layout.tsx`, `app/+html.tsx`). `apps/client` became `apps/customer`; `apps/pro` stayed.
Kept in the packages: the query client factory, `AppProviders` (query client and safe-area only),
`WebShell`, and `ConfirmDialog`, `FormField`, `HeaderBand`, `Screen` in `packages/ui` (`StatusPill` was kept at first and deleted in Task 6)
with `tokens.js`, because the Tailwind preset imports the tokens and later tasks rewrite them.

Dropped: `apps/both`, the parity script, every Detox file and dependency, the DummyJSON client,
the write overlay, the Role lock, hydration gates, `packages/testing`, and every repairs screen,
type, store and test. The packages' `index.ts` barrels export only what survived. Mowly runs on Maestro
(PRD) and a persisting mock database, so none of that machinery has a job here.

The inherited config decisions still hold: hoisted `nodeLinker`, `autoInstallPeers: false`, ESLint
pinned to 9, the `paths` entry for `expo-router` in each app's `tsconfig.json`, and `@mowly/config`
depending on `@mowly/ui` for the tokens. ESLint's resolver path now points at `apps/customer`.

## Jest is one project per app, and package tests run in the customer project

Each app has its own `jest.config.js`. The customer project's roots are its `app`, `src` and
`tests` plus `../../packages`; the pro project's roots stop at its own folders. Package tests run
once, in the customer project, which is repairs' one-project pattern applied to two apps: a second
copy would run the same tests against the same files. The pro project briefly set `passWithNoTests` until the pro app had tests of its own (it has them now, so the flag is gone). The AsyncStorage Jest mock that
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

(Superseded in part by "Pro drawer is Expo Router's Drawer" below: the menu is now the Drawer's `drawerContent`, not a Modal.) The ten drawer placeholders share `apps/pro/src/drawer/Placeholder.tsx` (title plus `screen-<segment>` testID) instead of repeating the markup. The drawer header name comes from `usePro()` (first and last name, uppercased). Pro's Jest project now stubs `*.css` and has no `passWithNoTests`; its tsconfig gained `types: ["jest","node"]`, mirroring the customer fixes. `SwitchAppLink` sits at the bottom of the drawer (renders null on native).

## Maestro harness: ports, device, and three build/run findings

- **Metro ports:** customer 8081, pro 8082. `scripts/e2e.sh` starts only the Metro of the app under test and kills it on exit (trap). `E2E_DEVICE` (default `iPhone 16`) picks the simulator for both the build and the run. The pro track can use its own simulator (`xcrun simctl create "iPhone 16 Mowly Pro" "iPhone 16"`, then `E2E_DEVICE="iPhone 16 Mowly Pro"`) so two tracks never drive one device at once.
- **`--port` and `--no-bundler` are mutually exclusive in `expo run:ios`** (the brief's verbatim script fails with "CommandError"). The port is baked into the Debug build through `RCT_METRO_PORT` (Info.plist reads `$(RCT_METRO_PORT)`), so each app's `e2e:build` sets `RCT_METRO_PORT=<port>` for prebuild and run and drops `--port`.
- **Never start Metro with `--ios`/`--ios=false`:** Expo parses `--ios=false` as true and opens Expo Go with an "Open in Mowly?" system dialog over the app. Metro starts with `--port` only; the Debug build already points at it.
- **Maestro `clearState` fails with "did not stop in time"** when the other app was left in the foreground by the previous flow. `e2e.sh` terminates both apps before each Maestro run.
- Both builds took about 7 minutes together on this machine.

- **Maestro driver host port:** `maestro` and `maestro test` 2.11.0 expose no option for the iOS driver's host port (only `--device`, `--format`, `--[no-]reinstall-driver` and similar), so `e2e.sh` cannot give each app its own driver port. Two concurrent runs on two simulators are untested.
- **`apps/*/.gitignore` stay tracked:** `expo start` regenerates them (expo-env.d.ts entry) on every run, so deleting them leaves `git status` dirty. Kept.
- `e2e.sh` runs Metro in its own process group and kills the group on every exit path, and refuses to start if the port already serves a Metro.

## Final review fixes (foundation)

- **Single test file in a package:** packages have no `test` script; their tests run in the customer Jest project. Run one with `pnpm --filter @mowly/customer test packages/<pkg>/src/<file>`. `pnpm --filter @mowly/pro test` never runs package tests. This replaces the `pnpm --filter <package> test <file>` form in `CLAUDE.md`.
- **Content centering lives in `Screen`:** at `md` and up (`useIsWide()`), `Screen` wraps its children in a `w-full max-w-content self-center` column; `HeaderBand` stays full width because screens render it outside that column only if they choose to. Neither track re-implements centering.
- **Maestro runs are serialized across worktrees:** Maestro 2.11 has no driver-port option, so two concurrent runs collide. `scripts/e2e.sh` takes `mkdir /tmp/mowly-maestro.lock` around the `maestro test` call only (retry every 2 s, prints "waiting for Maestro lock" once, errors after 15 minutes, released in the EXIT trap only by the process that took it). Metro and builds stay parallel. A stale lock after a crashed run is removed with `rmdir /tmp/mowly-maestro.lock`.
- **Tailwind content globs include `./src/**`** in both apps, so classes written in app `src/` (the pro drawer) reach the built CSS.
- **Number fields use `z.coerce.number()`:** `FormField` stores TextInput strings. An empty string coerces to 0, which still fails `.min(1)` / `.positive()` with the required message.
- **`delay()` at 0 ms resolves without a timer,** so tests with `setMockDelay(0, 0)` need no fake timers.
- **`getAvailableJobs` sorts by id,** so the list order is stable between reads and refetches.
- **`useClaimJob` invalidates jobs, route and billing,** because a claim for today changes the route and a claim creates a billing entry.
- **Photos come from Wikimedia Commons** (CC0, public domain or CC BY, credited in `packages/ui/assets/CREDITS.md`) instead of Unsplash or Pexels, which the build environment could not reach.
- **`EXPO_PUBLIC_SEED=false` is the PRD's `SEED=false`.** Expo only inlines `EXPO_PUBLIC_` variables. Metro must be restarted (or the web/native bundle rebuilt) with the variable set.
- **`useIsWide` renders narrow first** and switches after mount, so the hydrated tree matches the static HTML (avoids React error #418).
- **The web `<Head>` title override is guarded off native** (`Platform.OS === 'web'`), because `Head` throws on native; on web it replaces the empty `<title>` React Navigation injects.
- **Pro `(app)/_layout.tsx` derives `Drawer.Screen` names (formerly `Stack.Screen`) from `href.slice(1)`.** A drawer destination whose route is nested (for example `settings/index.tsx`) must keep a name that matches, or the screen loses its title and header button.
- **Query keys live in `packages/api/src/queryKeys.ts`,** still exported as `queryKeys` from the package, so the two tracks do not both edit `customer.ts`.
- **Favicon:** an inline SVG data URI `<link rel="icon">` in `WebShell` and the landing page (the green M), so the browser makes no `/favicon.ico` request. Color comes from the primary token.
- **Claimed job dates are capped at +28 days,** so they stay within the current and next month (the calendar shows two months) whatever day it is.
- **`find` is internal** (`packages/mocks/src/find.ts`, not re-exported).

## [foundation] Pro drawer is Expo Router's Drawer on `@react-navigation/drawer`

The repo owner asked for `@react-navigation/drawer`. It and `react-native-gesture-handler` are added to the pro app only (`npx expo install`), which supersedes the "only two dependencies" rule for these two packages, and replace the custom Modal drawer (which slid up from the bottom, with no swipe). Reason: the left slide-in, the edge swipe and the permanent sidebar match P07 and the PRD. The Zustand `useDrawer` flag is gone; the navigator owns open and close. `GestureHandlerRootView` wraps the pro root layout. Jest mocks `react-native-reanimated` and `react-native-worklets` and loads gesture-handler's `jestSetup` in `apps/pro/jest.setup.ts`. Note: Expo Router 57 vendors its own drawer navigator (`expo-router/drawer`), so always import `Drawer` and its types from `expo-router/drawer`, never from `@react-navigation/drawer`. The package stays installed at the owner's request.

**Pattern for the pro track:** a drawer screen that needs pushed screens becomes a folder with a `Stack` `_layout` (for example `settings/_layout.tsx` plus `settings/index.tsx`). In the drawer layout that screen gets `headerShown: false`, and its Stack shows the title, `DrawerButton` as `headerLeft` on the root screen, and the native back button on pushed ones.

## [customer] Service select (C01-C03) screenshot simplifications

The "Mowly" wordmark is the shared `Wordmark` (smaller than the LawnStarter logo, no registered mark), so the heading "Get started with Mowly!" fits on one line where the reference wraps. The phone icon is a plain Ionicons `call` in a bordered circle. Tiles use the `card` radius (8) and a lighter gray from the tokens. The reference's top scroll indicator and fade above CONTINUE are not reproduced.

## [customer] Quote form screenshot simplifications (C04-C06)

The form keeps C04-C06's copy, order and green focus border, but drops the red-asterisk required marks, the
label-less "Apartment/Suite Number" placeholder (the field keeps a visible label), the raw-digit phone display
(the demo phone shows formatted), the thicker grey borders and focus glow, the full marketing consent paragraph
(shortened to one sentence with the two links), and the title wrapping onto two lines (it follows the type
scale of the other funnel screens). The address dropdown renders inline under the field rather than floating
over the next one, so it pushes the form down instead of overlapping it.

## [customer] Policy FAQ screenshot simplifications (C16, C17)

The shared `Accordion` keeps its divider lines, green chevrons and semibold questions (the reference has no dividers, black chevrons and bolder questions), answers render as plain paragraphs without the bullet dot, and the title is a step smaller. Only the first three answers are fully readable in the references (the others are faded behind the transition), so the wording of questions 4 to 7 is written to match the visible fragments, with the Mowly name and no phone number.

## [customer] Pick your plan screenshot simplifications (C08-C12)

Prices show whole dollars as in C09 (the plan prices are integers). The date sheet is a plain list of 14 days in a bottom sheet rather than the native iOS picker the reference opens. The promo modal is the shared `BottomSheet` with one field and APPLY, without the reference's X button. The "Code applied" text replaces the ADD A PROMO CODE link once a code is applied. The loading state is gray skeleton blocks (C08), CONTINUE swaps to the in-button spinner for 800 ms with nothing behind it (C12).

The plan screen's spacing is slightly taller than the reference, so ADD A PROMO CODE sits below the fold on the 16 (the reference shows it above the footer); the page scrolls to it. The "What's included?" bullet is a small dot, and the included text is the catalog string rather than LawnStarter's. The FAQ modal's title clears the status bar (checked on the simulator), so `faq.tsx` needed no inset change.
