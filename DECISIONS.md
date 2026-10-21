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

Differences from P08/P09: a leaf icon replaces the illustration, the form is prefilled from the Pro record once it loads (so re-saving never wipes the avatar), and the camera glyph is Ionicons' `camera-outline`. The field labels use the shared `FormField`/`TextField` label weight, slightly bolder than P09's.

## [pro] Core skills follow P05; the seed skills were renamed to match
`CORE_SKILLS.lawn` is the P05 list (Cleanup, Lawn Mowing, Leaf Removal, Weed Pulling, Weeding). The foundation seed used invented names (Mowing, Edging, Blowing) that are not in P05, so the seed's `skills` became `['Lawn Mowing', 'Leaf Removal', 'Cleanup']` so the toggles preselect. Value-only change in `packages/mocks/src/seed.ts` (no other use of those names).

## [pro] Settings is a folder with a Stack; `settings` Drawer.Screen is configured in the DRAWER_ITEMS map
*Superseded by "[pro] Pro navigation: Drawer inside a Stack".* `settings` is already a drawer item, so `headerShown: false` is applied inside the map (a second `Drawer.Screen name="settings"` throws "Screen names must be unique"). Work area opened from the Dashboard has a one-screen stack, so back falls through to drawer history; a test confirms the Settings item still shows the list afterwards.

## [pro] Fidelity of skills, evaluate and work area
*Stale: the screens were later checked on the simulator; see "Work area fidelity differences from P21" and "GPS and damage fee fidelity".* Built from P21 and P05 by inspection: work-area copy, "Main Crew", Mon-Sun row with pencil, radios, startingPoint address with pencil, full-width green Save. The pool category list and the callout header are transcribed/invented as in the prototype.

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
- [pro] Flows go back with `tapOn: Back`: the `(app)` Stack sets `headerBackTitle: 'Back'` next to `headerBackButtonDisplayMode: 'minimal'`, so the native chevron looks the same but Maestro can find it by text. `headerBackAccessibilityLabel` does not exist in this native-stack version; coordinates are not used.
- [pro] Sign out dialog (P25): it is the shared `ConfirmDialog` (rounded sheet, solid pill buttons, green "Sign out", no blur/shadow), not iOS's translucent alert; the title fits on one line and the SIGN OUT button and version line sit right under the list instead of pinned to the bottom, and the row badge is a circle.
- [pro] Welcome (P01): the wordmark is the text "Mowly" (not a logo image) and the version line reads "Mowly for Providers - v1.0.0"; the house is a green Ionicons glyph instead of the isometric illustration; slides 2 and 3 are invented ("Plan your day", "Get paid weekly"). Dots track the page on swipe end only.
- [pro] Sign in (P02): the Sign In button sits right under the "I need help accessing my account" link, not pinned to the bottom. iOS drew the keyboard over a bottom button, which made it untappable (`KeyboardAvoidingView` left stale padding under the native Stack). The help link is inert. Sign in validates with the app-local `ProSignInSchema` (`apps/pro/src/schemas.ts`, email and password each non-empty), so any non-empty input signs in as the PRD says; the shared `SignInSchema` (well formed email) is left unchanged for the customer app (ruling R13, revising R10).
- [pro] The sign-out Maestro flow taps `signin-eye` before typing the password: Maestro's `inputText` into a secure iOS field drops characters.
- [pro] Sign up (P03/P04/P05): the nav title reads "Sign Up" (P03 shows "Get Started") and the back chevron shows the "Back" label; "LawnStarter" is "Mowly" in the heading and consent text, and the terms/privacy words are plain text, not blue links; the NEXT button sits right under the consent text instead of being pinned at the bottom; fields use the shared `TextField` (thin gray border, smaller radius) rather than P03's thicker borders. The Core skills callout is a plain View (gray header, bulb outline icon, bordered body). P04 (the category picker) is the shared `Select` bottom sheet.
- [pro] Core skills lists: the lawn list was transcribed from P05, but the pool list (Deep Pool Cleaning, Pool Cleaning, Pool Open & Close) was taken from the prototype, not from a screenshot (P05 only shows lawn).
- [pro] The sign up test uses the brief's values (zip 78704, phone 5125550147); they satisfy `SignUpSchema`, so no substitution. The core-skills assertion matches by regex because `toHaveTextContent` with a string is an exact match on the whole callout.
- [pro] The sign up form uses `keyboardDismissMode="on-drag"`: the phone pad has no return key and its keyboard hid NEXT from the Maestro flow, whose `scrollUntilVisible` drag now dismisses it.

- [pro] Recommend a service (P12): the reference uses a light Montserrat-style font and a thin pale-green tile border; ours uses the app font and `border-primary/20`. The selected tile (not shown in the reference) gets a solid green border and a 10% green fill. The price and note fields appear only after a tile is picked (as the PRD says). Price uses the iOS `numbers-and-punctuation` keyboard with a Done key (a plain number pad has no way to dismiss it, so Maestro cannot reach Send).

[pro] Support (P14) differences from the screenshot: card buttons use the shared text Button (uppercase, bright green, spaced) where the original has sentence-case dark green semibold; the page ground is the shared surfaceMuted token, a little darker than the original light gray; body text is slightly larger and more loosely spaced; the "click here" link reads "tap here" and both it and the buttons only toast "Not in this demo"; copy says Mowly instead of LawnStarter.

- [pro] Pro inbox reuses the customer-facing `Thread` type: `proName` holds the customer's name, `initials` theirs, `serviceName` the service. `Thread` itself is unchanged.
- [pro] Crews, Customer Search, Performance and Inbox (invented screens) differences from the prototype: rows have no chevron because they open nothing (the prototype shows chevrons); Crews lists one row per person with a role ("Mike Sullivan, Owner", "Dan Ortiz, Crew member") instead of grouping into "Main Crew"/"Crew 2"; Performance shows the three stats the brief names (no Tier card) as stacked cards; Customer Search shows the claimed jobs' customer name plus street; claimed seed jobs cycle through Renato Probst, Jane Kim and Tom Reyes (the prototype's past customers).

- [pro] Invented drawer screens, checked on the simulator against `prototype/index.html`: Customer Search shows a "Search" label above the field (the prototype has only the placeholder) and the row subtitle is the street without the "Name · address" one-line format; Performance uses the shared `surfaceMuted` ground, darker than the prototype's light page, and three stacked full-width cards instead of its 2-column grid of four tiles; Crews and Inbox rows are plain two-line rows (no avatar circle with initials in Inbox, no grouping in Crews).

- [pro] Dashboard after the checklist (invented), checked on the simulator against `prototype/index.html`: the "You're all set." card has no "(invented)" tag; the route card shows "N stops today" plus the first address (the prototype lists every stop and a "View route" link); job rows are compact cards (service, price, street) in bordered boxes like the prototype's rows, and each opens Available Jobs; an empty route shows "No jobs on your route today."

## [pro] Track wrap-up: fidelity sweep and web pass (Task 17)
- [pro] Final fidelity sweep, P01 to P25 re-shot on the simulator: no regressions. Differences not recorded before:
  - Drawer (P07): Ionicons outline glyphs in gray with the active one green (P07 uses filled glyphs, green on Dashboard/Support/Settings and gray on the rest), every row enabled, a divider under each row, and the Settings badge is a round pill showing `openSettingsCount` (6 on the seed: one per open settings step), where P07 shows a square "1".
  - Build a profile intro (P08): it sits in the `(app)` Stack, so it shows the white header with the green back chevron; P08 has no header.
  - Business profile (P16): the "NEW! ..." prompt is a single orange line with no divider under it (P16: bold dark "NEW!" plus gray text above a divider), and the fields use the shared gray-bordered `TextField`, not P16's green borders.
  - Tax info (P18): the header shows a gray "Secured" pill, not the "Powered by stripe" badge that P18 (and our Bank screen, P19) shows.
  - GPS (P22): the FAQ chevrons are green (P22: black) and the titles are bolder. Notifications (P23): the section headings are larger and heavier.
  - Dev builds only: React Native's LogBox shows a yellow "Sending `onAnimatedValueUpdate` with no listeners registered" warning after a few navigations. It comes from the native animated driver, not from app code, and release builds do not show LogBox.
- [pro] Web: the closed drawer at phone width stayed in the DOM off-screen with all its rows in the tab order (the first Tab went to an invisible "Dashboard" row). `DrawerMenu` now marks the drawer `aria-hidden` and drops its rows and the Switch app link to `tabIndex -1` while it is a closed overlay on web (`useDrawerStatus`, not wide), and blurs the pressed row before closing, because the browser refuses `aria-hidden` on an ancestor of the focused element. This needed an optional `focusable` prop on the shared `ListRow` and `SwitchAppLink` (see PACKAGES-CHANGES). Native is unchanged.
- [pro] Web: the Available Jobs pager arrows get `accessibilityRole="button"` (they were plain `generic` elements to screen readers, although they were in the tab order).
- [pro] Web: no `.web.tsx` files exist in the pro app or in `packages/`.
- [pro] Web deep links: `output: "static"` pre-renders every static route, so `/pro/settings/billing` loads directly from a plain static server (`npx serve`, no fallback). Dynamic routes (`/pro/jobs/:id`, `/pro/jobs/:id/recommend`, `/pro/calendar/:date`) are exported as `[id].html` / `[date].html` and 404 without rewrites. With `serve.json` rewrites to those files they load and render the right record. The real rewrites belong to the deferred Vercel config of the integration plan; no hosting config was added here. On a directly loaded dynamic route the header's "Go back" link has a stale `href` (`/pro/?id=[id]`, from the pre-rendered params); clicking it still lands on `/pro/`.
- [pro] Web, kept: each shared `Toggle` takes two tab stops (react-native-web's `Switch` root and its inner checkbox); only the second toggles on Space. It is shared code the customer app uses, so it is left alone. Opening the drawer from the hamburger keeps focus on the hamburger (no focus move into the drawer), React Navigation's default.

## [pro] Final review fixes
- [pro] Auth guard: the root Stack wraps `(app)` in `Stack.Protected guard={signedIn}` and `welcome`/`sign-in`/`sign-up` in `Stack.Protected guard={!signedIn}`. Flipping the session swaps the stack, so after sign out then sign in, back (edge swipe, Android back, browser Back) cannot reach Welcome or Sign in, and a signed-in deep link to `/welcome` lands on the Dashboard. This replaces the `Redirect` in `(app)/_layout.tsx` and the `router.replace` calls after `signIn`/`signOut`.
- [pro] Notifications: the switches render from local state seeded from the Pro record (the screen's source of truth while mounted), and each change sets that state and saves. Rendering the query data made RN's `Switch` snap back until the save and the refetch landed.
- [pro] Loading states (PRD "Loading states"): one app-local `ScreenLoading` (`apps/pro/src/components/ScreenLoading.tsx`, testID `screen-loading`). Without `rows` it is a centered `Spinner` for full-screen loads: the forms backed by `usePro` (profile form, account info, business profile, tax info, notifications, skills, evaluate, work area), Billing and job detail. With `rows` it is a stack of `Skeleton` rows for lists and cards: Crews, Inbox, Customer Search, Performance and the day list (3 rows), and Calendar (6 rows), which shows no month grid until the claimed jobs load, because an empty month reads as "no jobs". Dashboard, Available Jobs and Route already had their own loading states and are unchanged.
- [pro] Evaluate your skills (invented): the three questions read "Do you own a commercial mower?", "a string trimmer?" and "a leaf blower?", where the brief's example was "Do you own a mower?". The PRD only says "own mower, trimmer, blower"; naming the commercial gear reads like a pro vetting question.
- [pro] Recommend a service (P12, `screenshots/providers-app/recomend-services.webp`): the heading is `text-2xl`, larger than the reference (about `text-lg`), and the tiles are `h-24` at 48% width (about 1.75:1), squarer than the reference's wide tiles (about 2.8:1). Kept: the larger heading and tiles are easier tap targets and keep the six options above the price and note fields on an iPhone 16.
- [pro] Dashboard after the checklist: the "near you" jobs are compact rows, not the `JobCard` from Available Jobs. `JobCard` is the per-date picker (address, yard size and one row per available date, each opening the claim sheet); on the Dashboard the rows only open Available Jobs, so the full card is too heavy for a summary.
- [pro] Testing note (moved from the Billing fidelity list): the billing test is split in two (empty state, then listed rows under both tabs), because a second `renderApp` inside one test leaves overlapping act() scopes that break the next test in the file.

## [pro] Maps show an aerial photo

The repo owner asked for a map image like P13's satellite map, on Route Map and Available Jobs. `CityMap` now draws `apps/pro/src/assets/city-map.jpg` (cropped to fill) under the pins, replacing the drawn SVG map. The image is stitched from public-domain USGS tiles of Austin (The National Map, `USGSImageryTopo`, zoom 12), so it can ship without a license and is credited "USGS" in the corner. Pins still sit at the mock `pin.x/y` fractions, not real coordinates.

## [pro] Web drawer slides in like the app

The repo owner wants the web build to simulate the app, so the drawer is a slide-in opened by the hamburger at every width. This overrides the PRD's "permanent left sidebar at `md` and above" for the pro app: `drawerType` is always `'front'`, `DrawerButton` always renders, and `DrawerMenu` drops its wide-screen branches.

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

Plan rows are 56 pt high with the reference's 8 pt gap, so ADD A PROMO CODE sits above the footer as in C09 (Task 14 sweep). The "What's included?" bullet is a small dot, and the included text is the catalog string rather than LawnStarter's. The FAQ modal's title clears the status bar (checked on the simulator), so `faq.tsx` needed no inset change.

## [customer] My Services screenshot simplifications (C19)

C19 is an Android screenshot, rebuilt in the iOS language of C01-C17. The header band has only the title: the gift icon and the address selector come with the shared CustomerHeader (Task 8). Cards use a hairline border instead of the Android drop shadow, and the next date reads "Sunday, October 25" (the shared long format) rather than "Sat, Nov 18". Icons are Ionicons outlines, and the empty state is a plain "No services yet" with a GET A QUOTE button (not in the references).

## [customer] Create your account and booked screen simplifications (C13-C15)

The account page uses the native header (back arrow, no title) instead of C13's grey circle back button plus the funnel header, and the title sits below it. First and last name share a row under a single "First name" / "Last name" label pair rather than one "Full Name*" label, and the red asterisks are dropped. The card block is the demo card: plain prefilled fields (no VISA or CVC icons) and the line "Demo card, nothing is charged". The policy summary card (C15) shows three short bullets with a pin icon and no bold terms section, since the real terms are not shown in the references. The "Terms of Service" link is not tappable. The booked screen is invented (no reference): green check, "You're booked!", service, plan and first date, and GO TO MY SERVICES.

## [customer] Browse screenshot simplifications (C18)

C18 is an Android screenshot, rebuilt in the iOS language of C01-C17. The recommended cards use the service photo where the reference has a cartoon gardener (no illustration asset), carry a hairline border instead of the drop shadow, and the three cards are Take a break, Keep it green and Bite-free summer. The service rows use the catalog `included` sentence (clamped to one line) and the shared `Button` outline pill. The address row shows the seeded address (1820 Maple Ridge Drive) and opens a sheet with that one address and an inert "Add address". The gift icon is inert. The header is shared by all four tabs.

The Browse pills size to their content (no fixed widths) so the labels stay on one line. The service summary is clamped to one line as briefed, so long catalog sentences end in an ellipsis (C18's two-line summaries are shorter than the catalog text).

## [customer] Service detail screenshot simplifications (C20)

C20 is an Android screenshot, rebuilt in the iOS language. The header uses the native stack header (chevron back, plain help-circle icon without the white discs), the title block is centered by iOS rather than left-aligned, the status bar text stays dark, and action row titles are regular weight with the shared `ListRow` green chevron instead of C20's bold titles and dark chevrons. The "What's included?" text is the catalog sentence, shorter than C20's paragraph. Price reads "$53.00 per service" and the pro is the seeded Greenleaf Lawn Co.

## [customer] Inbox screenshot simplifications (C21)

C21 is an Android screenshot, rebuilt in the iOS language. The date uses the short format ("Oct 19") instead of "10/19/23", and the preview shows the last message text without the sender-name prefix ("John: ..."). The chat screen behind a row is a placeholder until Task 12.

## [customer] Service management sheets (Task 11)

The frequency and pause sheets have no subtitle line and no "Keep as is" outline button (the prototype has both); closing is by scrim or back. Frequency reuses `PlanRow`, the same cards as the plan screen. Skip, cancel and pause apply on tap and close the sheet immediately; reschedule reuses `DateSheet` (title "Preferred start date").

## [customer] Chat simplifications (prototype)

The chat is an invented screen. Against `prototype/index.html`: the header is the native stack header (green chevron, green pro name) instead of the prototype's dark title bar; the send button is the app's primary green circle, not the prototype's dark header-colour pill; the canned reply reads "Thanks! We'll take care of it." (the mocks' text) instead of "Thanks! Noted for the next visit."

## [customer] Profile simplifications (invented screen)

Profile reuses the shared `ListRow`, so against P15's list style the dividers run edge to edge in the neutral border colour (P15 insets them and tints them green) and rows are slightly shorter. The header is the green customer header, not P15's white bar. Name and email sit in a block above the rows (prototype c-profile). Reset demo asks to confirm, then shows the "Demo reset" toast; a failure shows an error toast.

## [customer] Fidelity sweep, remaining differences (Task 14)

The Task 14 re-shoot of C01-C21 fixed the tile, plan-row and footer sizes, the sizing ring size and the Browse pill size (the compact `Button size="sm"`). What is left, on purpose:

- The funnel header (wordmark and address) stays fixed while the page scrolls; in C02, C05 and C06 it scrolls away with the content.
- C08 shows a lone spinner under the header; Mowly shows the skeleton blocks and the cost footer at $0 with a disabled CONTINUE.
- C12 keeps the CONTINUE label beside its spinner; the shared `Button` replaces the label with the spinner (changing that would change the pro app's buttons too).
- C11 is a full-screen modal with an X and a large title; Mowly's promo sheet is the shared bottom sheet, which now rises above the keyboard (`avoidKeyboard`).
- C14's card block has a "Card" heading with an icon; Mowly goes straight to the fields.
- C16 and C17 are a full-screen sheet with larger, darker answer text; Mowly's FAQ is the iOS page-sheet modal with the shared `Accordion`.
- Browse service summaries stay clamped to one line (C18 shows two).

## [customer] Web build notes (Task 14)

No `.web.tsx` files: every screen renders on web from the same source. Web-only adjustments live inline:

- Service photos on Browse set their size in `style`, not `className`: on web an `Image` with only a size class takes the asset's intrinsic size and broke the cards.
- The FAQ, sizing and chat screens use `Screen`, so at `md` and above they sit in the centered column like the rest of the funnel.
- Pressables that open something carry `accessibilityRole` (`button` or `link`), and the checkbox and plan rows set `aria-checked`, because react-native-web reads `aria-*` props and ignores `accessibilityState`.
- The "Switch app" link sits once, in the strip above the tabs (it was also in the green header, where its blue text was unreadable). Funnel screens do not show it.

Known web limitations, recorded rather than fixed:

- The shared `HeaderBand` keeps its 64 px top padding (meant for the iOS status bar) on web.
- Pushed screens (service detail, chat, account) use the full-width stack header, so the back arrow sits at the far left outside the centered column, and the tab bar is hidden while they are open.
- The checkbox toggles with Enter but not Space: react-native-web only maps Space to a press for the `button` role.
- The back link's accessible name is the previous route's name ("(tabs), back", "plan, back").
- Deep links to dynamic routes (`/customer/chat/<id>`, `/customer/service/<id>`) 404 on a plain static server; they need the host rewrites that are deferred to the integration ticket. Static routes such as `/customer/services` load directly.
- The mock database is in memory, so a full page reload brings back the seed.
- Chrome logs "Blocked aria-hidden on an element because its descendant retained focus" when a press pushes a screen: React Navigation hides the previous screen while the pressed button still has focus. No errors and no react-native-web prop warnings.

## [customer] Final review fixes

- **Leaving the funnel.** The funnel screens' header starts with an X (`funnel-close`, label "Close"), and the account step has it as the native header's right button. It closes the quote modal and keeps the draft, so VIEW PRICE again resumes where the user left. With nothing under the modal (a web reload or deep link) it replaces to Browse. The LawnStarter references have no X; without one, VIEW PRICE from Browse left no way out on iOS.
- **Empty draft.** A funnel step whose earlier steps are missing from the draft redirects to the first missing one (`missingStep` in `useQuoteDraft.ts`): no service → service select, no contact → the form, no plan → the plan step. The confirmation with nothing in the draft shows My Services. The draft lives in memory, so a web reload always lands on service select.
- **Prices.** Funnel prices show whole dollars as in C09 ("$57") and cents only when there are some ("$3.99"), through `formatPrice` in `src/pricing.ts`; Service detail keeps `formatMoney` ("$53.00 per service") as in C20.
- **Change frequency** in the manage sheet saves the plan's full price for the new frequency. A promo applied at booking is not carried over.
- **Typecheck** passes without Metro (the committed `types.d.ts` covers what Expo's generated files would), but typed routes are only enforced once Metro has generated `.expo/types/router.d.ts`; until then `Href` accepts any string.
- **Tests and timers.** `renderApp` (expo-router's `renderRouter`) installs Jest fake timers itself. Tests advance them inside an async `act`: a synchronous `act(() => jest.advanceTimersByTime(...))` left the next render in the same file blank, which was the order-dependent failure first seen in Task 5.


## Desktop web shows the app inside an iPhone

The web build is how reviewers try the apps without a store install, so on a desktop browser both apps render a drawn iPhone 16 (CSS bezel, Dynamic Island, a "9:41" status bar, home indicator) whose screen is an `<iframe>` of the current URL. Desktop means `(hover: hover) and (pointer: fine)` and a window at least `layout.wideBreakpoint` wide; phone browsers and native are unchanged. The iframe is the point: inside it the window really is 393 px, so `useIsWide`, the drawer, modals and toasts behave exactly as on a phone with no per-screen changes. The root layout returns `PhoneFrame` when `useShowPhoneFrame()` is true (false during hydration, so the static HTML still matches) and renders normally inside the iframe (`window.self !== window.top`). Costs: the app bundle loads twice on desktop (outer page and iframe), the address bar does not follow navigation inside the phone, and windows under about 930 px tall scale the phone down.

## "Switch to <app>" goes straight to the other app

The repo owner asked for the web link to name the other app instead of "Switch app". `SwitchAppLink to="pro"` (customer tabs strip) reads "Switch to Mowly Pro" and opens `/pro/`; `to="customer"` (pro drawer) reads "Switch to Mowly" and opens `/customer/`. This overrides the PRD's link "back to `/`"; the landing stays at the site root. Navigation uses `window.top`, so from inside the desktop phone frame the whole page switches and the other app gets its own frame. It only works on the assembled site (`pnpm build:web`), where both apps share one origin; under `expo start` each app has its own server and the other app's path does not exist there.
