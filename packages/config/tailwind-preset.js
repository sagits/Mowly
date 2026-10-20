/**
 * The one Tailwind preset all three apps extend. It layers the design tokens onto NativeWind's
 * preset, so a token is defined once in `@mowly/ui/tokens` and reaches every app's class names.
 */
const { colors, radius, layout } = require('@mowly/ui/tokens');

/**
 * `System` on iOS and Android (an unregistered family is rejected on iOS), Inter on web. NativeWind
 * sets `NATIVEWIND_OS` to the bundle's platform ("web" included), so the gate names the native ones.
 * Plain values, no `platformSelect`: the config is evaluated once per platform bundle.
 */
const native = ['ios', 'android'].includes(process.env.NATIVEWIND_OS ?? '');
const sans = native ? ['System'] : ['Inter', 'system-ui', 'sans-serif'];

module.exports = {
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors,
      fontFamily: { sans },
      fontSize: {
        display: ['36px', { lineHeight: '40px', fontWeight: '800' }],
        'title-lg': ['28px', { lineHeight: '34px', fontWeight: '700' }],
        'title-md': ['26px', { lineHeight: '32px', fontWeight: '700' }],
        'title-sm': ['22px', { lineHeight: '28px', fontWeight: '700' }],
        heading: ['18px', { lineHeight: '24px', fontWeight: '700' }],
        nav: ['17px', { lineHeight: '22px', fontWeight: '500' }],
        plan: ['17px', { lineHeight: '22px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        body: ['14px', { lineHeight: '20px', fontWeight: '400' }],
        label: ['14px', { lineHeight: '18px', fontWeight: '600' }],
        button: ['14px', { lineHeight: '18px', fontWeight: '700', letterSpacing: '0.06em' }],
        caption: ['13px', { lineHeight: '18px', fontWeight: '400' }],
        overline: ['12px', { lineHeight: '16px', fontWeight: '600', letterSpacing: '0.1em' }],
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '700' }],
        fine: ['12px', { lineHeight: '16px', fontWeight: '400' }],
        micro: ['9px', { lineHeight: '12px', fontWeight: '600' }],
      },
      borderRadius: { field: `${radius.field}px`, card: `${radius.card}px` },
      maxWidth: { content: `${layout.maxContentWidth}px` },
      spacing: { sidebar: `${layout.sidebarWidth}px` },
    },
  },
};
