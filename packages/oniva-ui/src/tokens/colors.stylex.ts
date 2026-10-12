import * as stylex from '@stylexjs/stylex';
import { accent } from './accent.stylex';

/**
 * Semantic color tokens (light values). Dark overrides live in themes/themes.ts.
 * Accent-derived tokens reference the `accent` ramp so accent themes flow through.
 */
export const colors = stylex.defineVars({
  // surfaces
  '--oniva-color-bg': '#ffffff', // page canvas
  '--oniva-color-surface': '#ffffff', // primary: tiles, buttons, inputs
  '--oniva-color-surface-hover': '#f7f7f7',
  '--oniva-color-surface-active': '#ebebeb',
  '--oniva-color-surface-inner': '#ffffff', // tile inside an inset card
  '--oniva-color-surface-inset': '#f7f7f7', // OUTER card, segmented track
  '--oniva-color-surface-inset-hover': '#ebebeb',
  '--oniva-color-surface-tertiary': '#ebebeb', // badges, pills, avatars
  '--oniva-color-surface-tertiary-hover': '#d4d4d4',
  '--oniva-color-overlay': 'rgba(10, 10, 10, 0.4)',

  // borders
  '--oniva-color-border': '#ebebeb',
  '--oniva-color-border-hover': '#d4d4d4',
  '--oniva-color-border-active': '#737373', // 4.7:1 on white: hover/pressed control edges
  '--oniva-color-border-control': '#8a8a8a', // checkbox / radio / switch edge: >= 3:1 on bg, surface and inset
  '--oniva-color-separator': '#ebebeb',
  '--oniva-color-focus-ring': accent['--oniva-accent-focus'], // >= 3:1 on bg/surface/inset for all 8 accents (dark: accent-400)

  // text + icon
  '--oniva-color-text': '#0a0a0a',
  '--oniva-color-text-muted': '#595959', // AA on inset #f7f7f7, #ebebeb and blue-100 selected rows
  '--oniva-color-text-on-tertiary': '#525252', // text on tertiary fills (badges, avatars)
  '--oniva-color-text-subtle': '#666666', // AA (4.5:1) on white, inset and error-bg
  '--oniva-color-text-disabled': '#a1a1a1', // 2.6:1: disabled is exempt, but stays legible
  '--oniva-color-text-placeholder': '#666666', // AA on white, inset and error-bg
  '--oniva-color-text-error': '#c10007', // red-700: AA on white, inset, tertiary and error-bg
  '--oniva-color-icon-muted': '#737373',
  '--oniva-color-icon-subtle': '#8a8a8a', // 3.4:1 on white

  '--oniva-color-kbd-bg': '#d4d4d4',
  '--oniva-color-kbd-fg': '#525252',

  // accent-derived
  '--oniva-color-accent-fg': accent['--oniva-accent-on-solid'], // text on accent solid fills: white, or near-black on amber/emerald/cyan
  '--oniva-color-accent-text': accent['--oniva-accent-700'], // accent-colored text on bg/surface/inset (>= 4.5:1 for all 8 accents)
  '--oniva-color-text-inverse': '#ffffff',
  '--oniva-color-on-solid': '#ffffff', // text on the danger gradient (same in both themes)
  '--oniva-color-on-solid-light': '#0a0a0a', // text on bright solid fills (success/warning)
  '--oniva-color-success-on-solid': '#0a0a0a',
  '--oniva-color-warning-on-solid': '#0a0a0a',
  '--oniva-color-danger-on-solid': '#ffffff', // dark theme: #0a0a0a on the brighter danger-solid
  '--oniva-color-info-on-solid': '#ffffff',
  '--oniva-color-on-chart': '#ffffff', // text on chart fills (light palette is dark enough for white; dark theme flips to near-black)
  '--oniva-color-overlay-hover': 'rgba(0, 0, 0, 0.08)', // translucent hover wash on any surface
  '--oniva-color-accent-soft': accent['--oniva-accent-100'],
  '--oniva-color-accent-soft-hover': accent['--oniva-accent-200'],
  '--oniva-color-accent-soft-active': accent['--oniva-accent-300'],
  '--oniva-color-accent-soft-fg': accent['--oniva-accent-900'], // >= 4.5:1 on soft, hover (200) and active (300) for all 8 accents
  '--oniva-color-accent-soft-disabled': accent['--oniva-accent-50'],
  '--oniva-color-accent-soft-disabled-fg': accent['--oniva-accent-300'],
  '--oniva-color-accent-tint': `color-mix(in srgb, ${accent['--oniva-accent-500']} 12%, transparent)`,

  // disabled solid (gradient stops)
  '--oniva-color-disabled-from': '#ebebeb',
  '--oniva-color-disabled-to': '#d4d4d4',
  '--oniva-color-disabled-fg': '#737373',

  // danger solid
  // every stop keeps white (on-solid) text >= 4.5:1
  '--oniva-color-danger-from': '#e7000b',
  '--oniva-color-danger-to': '#c10007',
  '--oniva-color-danger-hover-from': '#c10007',
  '--oniva-color-danger-hover-to': '#9f0712',
  '--oniva-color-danger-active-from': '#9f0712',
  '--oniva-color-danger-active-to': '#82181a',
  '--oniva-color-error-bg': '#ffe2e2',
  '--oniva-color-error-border': '#fb2c36',

  // status chips (bg / fg) + solid dot + halo
  '--oniva-color-success-bg': '#d8f999',
  '--oniva-color-success-fg': '#3c6300',
  '--oniva-color-success-solid': '#00a63e', // 3.2:1 on white (status dots / icons)
  '--oniva-color-success-halo': '#dbfce7',
  '--oniva-color-warning-bg': '#fff085',
  '--oniva-color-warning-fg': '#894b00',
  '--oniva-color-warning-solid': '#b87300', // 3.8:1 on white
  '--oniva-color-warning-halo': '#fff085',
  '--oniva-color-danger-bg': '#ffccd3',
  '--oniva-color-danger-fg': '#a50036',
  '--oniva-color-danger-solid': '#e7000b', // 4.8:1 on white; white text OK
  '--oniva-color-danger-halo': '#ffe2e2',
  '--oniva-color-info-bg': '#bedbff',
  '--oniva-color-info-fg': '#193cb8',
  '--oniva-color-info-solid': '#615fff',
  '--oniva-color-info-halo': '#e0e7ff',
  '--oniva-color-cyan-bg': '#a2f4fd',
  '--oniva-color-cyan-fg': '#005f78',
  '--oniva-color-orange-bg': '#ffd6a7',
  '--oniva-color-orange-fg': '#9f2d00',
  '--oniva-color-purple-bg': '#f3e8ff',
  '--oniva-color-purple-fg': '#9810fa',

  // charts (not accent-driven). Light palette: every mark >= 3:1 on white; series 1-10 stay >= ~3.3 dE apart under protan/deutan/tritan simulation (docs: reviews/loop6-fixes-F1.md).
  '--oniva-color-chart-1': '#0b8579',
  '--oniva-color-chart-2': '#6a9a00',
  '--oniva-color-chart-3': '#d12c84',
  '--oniva-color-chart-4': '#0092c9',
  '--oniva-color-chart-5': '#c026d3',
  '--oniva-color-chart-6': '#2563eb',
  '--oniva-color-chart-7': '#166534',
  '--oniva-color-chart-8': '#b45309',
  '--oniva-color-chart-9': '#4338ca',
  '--oniva-color-chart-10': '#525252',
  '--oniva-color-chart-track': '#e0e0e0', // 1.3:1 on white
  '--oniva-color-chart-cursor': '#d4d4d4',
});
