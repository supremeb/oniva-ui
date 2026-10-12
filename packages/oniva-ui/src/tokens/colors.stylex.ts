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
  '--oniva-color-border-active': '#a1a1a1',
  '--oniva-color-border-control': '#d4d4d4', // checkbox / radio
  '--oniva-color-separator': '#ebebeb',
  '--oniva-color-focus-ring': accent['--oniva-accent-500'],

  // text + icon
  '--oniva-color-text': '#0a0a0a',
  '--oniva-color-text-muted': '#6b6b6b', // n500 nudged darker for AA on #f7f7f7
  '--oniva-color-text-on-tertiary': '#525252', // text on tertiary fills (badges, avatars)
  '--oniva-color-text-subtle': '#a1a1a1',
  '--oniva-color-text-disabled': '#d4d4d4',
  '--oniva-color-text-placeholder': '#a1a1a1',
  '--oniva-color-text-error': '#e7000b', // red-600: AA on white (red-500 is 3.8:1)
  '--oniva-color-icon-muted': '#737373',
  '--oniva-color-icon-subtle': '#a1a1a1',

  '--oniva-color-kbd-bg': '#d4d4d4',
  '--oniva-color-kbd-fg': '#737373',

  // accent-derived
  '--oniva-color-accent-fg': '#ffffff',
  '--oniva-color-on-solid': '#ffffff', // text on solid danger/status fills (same in both themes)
  '--oniva-color-on-chart': '#0a0a0a', // text on bright chart fills (same in both themes)
  '--oniva-color-overlay-hover': 'rgba(0, 0, 0, 0.08)', // translucent hover wash on any surface
  '--oniva-color-accent-soft': accent['--oniva-accent-100'],
  '--oniva-color-accent-soft-hover': accent['--oniva-accent-200'],
  '--oniva-color-accent-soft-active': accent['--oniva-accent-300'],
  '--oniva-color-accent-soft-fg': accent['--oniva-accent-700'],
  '--oniva-color-accent-soft-disabled': accent['--oniva-accent-50'],
  '--oniva-color-accent-soft-disabled-fg': accent['--oniva-accent-300'],
  '--oniva-color-accent-tint': `color-mix(in srgb, ${accent['--oniva-accent-500']} 12%, transparent)`,

  // disabled solid (gradient stops)
  '--oniva-color-disabled-from': '#ebebeb',
  '--oniva-color-disabled-to': '#d4d4d4',
  '--oniva-color-disabled-fg': '#a1a1a1',

  // danger solid
  '--oniva-color-danger-from': '#fb2c36',
  '--oniva-color-danger-to': '#e7000b',
  '--oniva-color-danger-hover-from': '#ff6467',
  '--oniva-color-danger-hover-to': '#fb2c36',
  '--oniva-color-danger-active-from': '#e7000b',
  '--oniva-color-danger-active-to': '#c10007',
  '--oniva-color-error-bg': '#ffe2e2',
  '--oniva-color-error-border': '#fb2c36',

  // status chips (bg / fg) + solid dot + halo
  '--oniva-color-success-bg': '#d8f999',
  '--oniva-color-success-fg': '#3c6300',
  '--oniva-color-success-solid': '#00c950',
  '--oniva-color-success-halo': '#dbfce7',
  '--oniva-color-warning-bg': '#fff085',
  '--oniva-color-warning-fg': '#894b00',
  '--oniva-color-warning-solid': '#f0b100',
  '--oniva-color-warning-halo': '#fff085',
  '--oniva-color-danger-bg': '#ffccd3',
  '--oniva-color-danger-fg': '#a50036',
  '--oniva-color-danger-solid': '#fb2c36',
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

  // charts (not accent-driven)
  '--oniva-color-chart-1': '#00d5be',
  '--oniva-color-chart-2': '#9ae600',
  '--oniva-color-chart-3': '#fb64b6',
  '--oniva-color-chart-4': '#00bcff',
  '--oniva-color-chart-5': '#c27aff',
  '--oniva-color-chart-6': '#3392ff',
  '--oniva-color-chart-7': '#00d492',
  '--oniva-color-chart-8': '#fdc700',
  '--oniva-color-chart-9': '#7c86ff',
  '--oniva-color-chart-10': '#a1a1a1',
  '--oniva-color-chart-track': '#ebebeb',
  '--oniva-color-chart-cursor': '#d4d4d4',
});
