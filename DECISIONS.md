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

*Superseded for the pro track by "[pro] Pro navigation: Drawer inside a Stack".* **Pattern for the pro track:** a drawer screen that needs pushed screens becomes a folder with a `Stack` `_layout` (for example `settings/_layout.tsx` plus `settings/index.tsx`). In the drawer layout that screen gets `headerShown: false`, and its Stack shows the title, `DrawerButton` as `headerLeft` on the root screen, and the native back button on pushed ones.

## [pro] Checklist progress is derived from the `Pro` record

The PRD lists "onboarding progress in Zustand". `checklistDone(pro)` derives every row from the `Pro` record instead (`businessName`, `skills`, `equipmentAnswered`, `workAreaSaved`, `gpsEnabled`, `damageFeeAccepted`, `taxInfo`, `bankLinked`), so a settings screen that saves its step unlocks the next row with no second store to keep in sync. The Settings drawer badge (`openSettingsCount`) reads the same record.

## [pro] Drawer `backBehavior="history"` and a green back button for non-drawer (app) screens

*Superseded by "[pro] Pro navigation: Drawer inside a Stack".* The pro Drawer uses `backBehavior="history"`, so `router.back()` from a step screen returns to whoever opened it (Dashboard, Settings) rather than the first drawer route. (app)-level screens that are not drawer items (`evaluate`; later `profile`, `route`) are registered with a `Drawer.Screen` (title only, so they stay out of the custom menu) and show `BackButton` (a green back chevron calling `router.back()`) as `headerLeft` instead of the hamburger.

## [pro] Dashboard fidelity differences from P06

Done checklist rows show a green check (P06 is captured in an all-open state, so it has no done row), and the header shows the green centered "Dashboard" title (PRD navigation rule; P06 shows none).

## [pro] Build a profile: folder with a Stack, exit through drawer history

*Navigation superseded by "[pro] Pro navigation: Drawer inside a Stack" (profile is now two Stack screens above the drawer and the form exits with `router.dismiss(2)`):* `profile/` was a folder with a native `Stack` (intro the root, `form` pushed); saving ran `router.dismiss()` then `router.back()`, and the intro showed the green `BackButton`.

Differences from P08/P09: a leaf icon replaces the illustration, the form is prefilled from the Pro record once it loads (so re-saving never wipes the avatar), and the camera glyph is Ionicons' `camera-outline`.

## [pro] Core skills follow P05; the seed skills were renamed to match
`CORE_SKILLS.lawn` is the P05 list (Cleanup, Lawn Mowing, Leaf Removal, Weed Pulling, Weeding). The foundation seed used invented names (Mowing, Edging, Blowing) that are not in P05, so the seed's `skills` became `['Lawn Mowing', 'Leaf Removal', 'Cleanup']` so the toggles preselect. Value-only change in `packages/mocks/src/seed.ts` (no other use of those names).

## [pro] Settings is a folder with a Stack; `settings` Drawer.Screen is configured in the DRAWER_ITEMS map
*Superseded by "[pro] Pro navigation: Drawer inside a Stack".* `settings` is already a drawer item, so `headerShown: false` is applied inside the map (a second `Drawer.Screen name="settings"` throws "Screen names must be unique"). Work area opened from the Dashboard has a one-screen stack, so back falls through to drawer history; a test confirms the Settings item still shows the list afterwards.

## [pro] Fidelity of skills, evaluate and work area
Not compared against a live screenshot (the simulator was stuck on an "Open in Mowly Pro" system dialog after a deep-link attempt). Built from P21 and P05 by inspection: work-area copy, "Main Crew", Mon-Sun row with pencil, radios, startingPoint address with pencil, full-width green Save. The pool category list and the callout header are transcribed/invented as in the prototype.

## [pro] Work area fidelity differences from P21
Checked on the simulator. Work area shows the native back chevron, tinted green, with no label (the "Back" text of P21 is dropped; see "Pro navigation: Drawer inside a Stack"). The Settings stack shows the header hairline like P21. P21 renders the radio labels bold with a black ring; the shared `Radio` is left unchanged (customer app uses it), so labels are regular weight and the ring is grey/green. The address is the seed's Austin address, not the screenshot's Bellevue one.

## [pro] Damage fee pre-accept state is invented
P17 only shows the opted-in state. Before accepting, the screen shows the same two paragraphs (first one reworded to "Accepting adds security...", fee amount omitted as in P17) and an ACCEPT button (damage-fee-accept) that sets damageFeeAccepted and goes back. Once accepted it shows the P17 green title and paragraphs, no button. Brand reads Mowly, not LawnStarter.

## [pro] GPS and damage fee fidelity
Checked on the simulator against P22 and P17. Differences: native-looking green chevron instead of "Back" text, Ionicons location pin instead of the check-pin illustration, FAQ bodies collapsed by default (P22 shows them faded), brand text reads Mowly, no fee amount in the damage-fee copy.

## [pro] Pro navigation: Drawer inside a Stack
Supersedes the foundation's "folder with a Stack" pattern for the pro track. `(app)/_layout.tsx` is a native `Stack` (green tint, centered green title, `headerBackButtonDisplayMode: 'minimal'` so the back button is a chevron, not the "(drawer)" route name) whose first screen is the `(drawer)` group. `(app)/(drawer)/_layout.tsx` holds the Drawer with only the DRAWER_ITEMS roots, each a plain file with the hamburger (`settings.tsx` is the Settings list). Step screens (`profile/index`, `profile/form`, `evaluate`, `settings/work-area|location|damage-fee`, later job detail and route) are Stack screens above the drawer and use the native back button. Why: with per-folder Stacks nested in drawer items, a step opened from the Dashboard stayed in the Settings stack, so the next step backed onto the stale one; the leaveStep workaround (`navigate("/")`) broke "save, then go back to the opener". Now every step saves and calls `router.back()`, the profile form uses `router.dismiss(2)`, and URLs are unchanged (Expo Router merges `(drawer)/settings.tsx` at `/settings` with `settings/work-area.tsx` at `/settings/work-area`). The Stack sets `unstable_settings.initialRouteName = '(drawer)'`, so a step opened by deep link or web refresh has the drawer underneath (back and save land on the Dashboard). The Drawer is back to the default `backBehavior` (`skills`, the only drawer item a step opens, backs to the Dashboard, its first route). `BackButton` and `leaveStep` are gone. Web: on a wide screen the drawer is a permanent sidebar and pushed screens cover it (sidebar hidden while a step is open); accepted for now.

- [pro] Bank CONTINUE: the checklist href is `/settings/bank?from=checklist`; the Bank screen shows CONTINUE (`bank-done`, goes `back()`) after linking only when that param is present. Opened from Settings it just shows the linked line.
- [pro] Tax info fidelity: P18 splits the name (first/last) and date of birth (MM/DD/YYYY boxes) and has an eye toggle on the SSN. We keep the brief's single `tax-legal-name` and `tax-dob` fields, and the SSN is a disabled field with "Not collected in this demo".

## [pro] Available Jobs is a drawer root (hamburger, not back) and its map is drawn with SVG
P10 shows a back button because the screenshot was taken after opening the screen from elsewhere. Ours is a drawer root (`(app)/(drawer)/jobs.tsx`, no jobs Stack, per "Pro navigation: Drawer inside a Stack"), so it shows the green hamburger. Job detail (Task 7) will be a pushed Stack screen above the drawer. The PRD's bundled map image is replaced by `CityMap`, drawn with `react-native-svg` (a few blocks, streets, a park and a river in token colours, no image asset); `MapPin` is its own file and Task 8 reuses both. The day strip labels read "Tue" (the shared `weekdayShort`), P10 abbreviates to "Tu". CLAIM JOB has a ref guard in `ClaimSheet` on top of the disabled/loading button, so two taps within one render claim once; the job card has a light green tint (`bg-primaryTint/40`) behind the white date cards, which P10 only hints at; a rejected claim (job already taken) shows the toast "This job was already claimed", refetches the jobs lists (the shared hook only does so on success) and closes the sheet.

## [pro] Calendar: past-day counts are gray, and the day list and job detail are pushed Stack screens
P11 shows past days with a gray count and future days blue, so `MonthGrid` does the same. `calendar/[date]` and `jobs/[id]/index` sit directly in `(app)/` next to the drawer roots `calendar.tsx` and `jobs.tsx` (no `_layout.tsx`); Expo Router accepts both. `route.tsx` and `jobs/[id]/recommend.tsx` are placeholders for Tasks 8 and 13.

P11 differences kept on purpose: the page background is `pageMuted` (P11 uses a lighter gray-green), the palette is the shared Pro tokens (`priceBlock` tabs, `calendarBlue` counts, `primary` outline), fonts are the system font, and dates are the live months instead of June and July 2021.

## [pro] Route Map and the demo flow
`MapPin` takes `variant: 'price' | 'number'` (default `price`, so Available Jobs is unchanged); `number` is a 28px round pin centred on its point. The route polyline is a `Polyline` in a 0..100 `Svg` laid over `CityMap` (same space as the pins, `preserveAspectRatio="none"`). `CityMap` keeps its "Austin" label. P13 differences kept: illustrated map instead of satellite tiles, round numbered pins instead of teardrops, no orange start marker, plain tinted banner without the calendar icon, no distance arrow icon, "mi" instead of "miles".

[pro] The damage fee unlocks only in order, so `demo.yaml` completes evaluate, work area and GPS first, then damage fee, then claims a job for today (`day-today` before the date) and opens the route, which must show stop 4.

## [pro] Settings list and Business profile: fidelity differences kept
- Row titles follow the Task 9 brief ("Starting Point", "Notifications"), not P15's "Starting Point (original service area)" and "Notification Preferences".
- The "1" badge is the shared `Badge` (a pill, a circle at one digit), not P15's rounded square.
- P16 puts the photo labels above the circles ("Profile Photo", "Truck Photo"); ours sit below them.
- The bio counter sits below the field (`bp-bio-count`), not inline with the label as in P16.
- Rows use the shared `ListRow` padding, tighter than P15's, and have full-width dividers instead of inset ones.
- The business-profile save sends `avatar` and `truckPhoto` along with the form fields, because `businessProfileComplete` needs both and the circles live outside the form.
- [pro] Billing (P20): the Filter button is inert; the card has a thin border and no soft shadow; the segmented control is a plain row of pills with the selected one white (no shadow); the top-left shows the green chevron without the "Back" label (the shared Stack uses minimal back buttons). Rows (`billing-row-<jobId>`) are invented, as P20 only shows the empty state.
- [pro] Notifications (P23): switches are the native iOS `Switch` through the shared `Toggle` (solid green track, white thumb), not P23's pale track with a dark outline; the row dividers also run under the last row of each section.
- [pro] Account management (P24): the Account Deletion row is the shared `ListRow` (inset padding, full-width divider underneath), not P24's divider-less row. The confirm dialog is invented (P24 does not show it); Delete only closes it and shows a "Not in this demo" toast.
- [pro] Billing test is split in two (empty state, then listed rows under both tabs): a second `renderApp` inside one test leaves overlapping act() scopes that break the next test in the file.
- [pro] Flows go back with `tapOn: Back`: the `(app)` Stack sets `headerBackTitle: 'Back'` next to `headerBackButtonDisplayMode: 'minimal'`, so the native chevron looks the same but Maestro can find it by text. `headerBackAccessibilityLabel` does not exist in this native-stack version; coordinates are not used.
