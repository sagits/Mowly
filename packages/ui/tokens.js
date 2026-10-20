/**
 * The design tokens, as plain CommonJS so `tailwind.config.js` can `require()` them with no build
 * step. `allowJs` infers the types straight from these values, so there is no hand-written `.d.ts`
 * beside this file to drift from them.
 */
const colors = {
  primary: '#18C058',
  primaryHeader: '#08B460',
  primaryTint: '#DCF4E8',
  accent: '#F48C04',
  surfaceMuted: '#D8D8D8',
  priceBlock: '#A0A0A0',
  callout: '#E0E0E4',
  pageMuted: '#E8E8EC',
  ink: '#111111',
  inkSoft: '#222222',
  inkPro: '#3A3A3A',
  inkProBody: '#4C4C4C',
  fee: '#575757',
  muted: '#616161',
  legal: '#888888',
  disabled: '#9E9E9E',
  placeholder: '#A6A6A6',
  link: '#5779A6',
  danger: '#FF3B30',
  surface: '#FFFFFF',
  border: '#E0E0E0',
  /** The dark wash a modal lays over the screen behind it. */
  scrim: 'rgba(0,0,0,0.4)',
  routeBlue: '#2F80ED',
  calendarBlue: '#2F80ED',
};

const radius = { field: 4, card: 8 };

/**
 * `boxShadow` because one declaration covers native and web. The `shadow*` props are not
 * deprecated — the current React Native docs still recommend them for simple shadows — so this
 * is a choice for a single cross-platform spelling, not a migration. See `DECISIONS.md`.
 */
const shadow = { card: { boxShadow: '0px 2px 10px rgba(43, 52, 80, 0.38)' } };

const layout = { sidebarWidth: 240, maxContentWidth: 720, wideBreakpoint: 768 };

module.exports = { colors, radius, shadow, layout };
