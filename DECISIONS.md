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
