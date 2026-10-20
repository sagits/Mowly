/**
 * The one Tailwind preset all three apps extend. It layers the design tokens onto NativeWind's
 * preset, so a token is defined once in `@mowly/ui/tokens` and reaches every app's class names.
 */
const { colors, radius, shadow, layout } = require('@mowly/ui/tokens');

module.exports = {
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors,
      borderRadius: { card: `${radius.card}px` },
      boxShadow: { card: shadow.card.boxShadow },
      maxWidth: { content: `${layout.maxContentWidth}px` },
      spacing: { sidebar: `${layout.sidebarWidth}px` },
    },
  },
};
