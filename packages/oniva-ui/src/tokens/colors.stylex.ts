import * as stylex from '@stylexjs/stylex';
import { accent } from './accent.stylex';

/**
 * Semantic color tokens (light values). Dark overrides live in themes/themes.ts.
 * Accent-derived tokens reference the `accent` ramp so accent themes flow through.
 */
export const colors = stylex.defineVars({
  // surfaces
  bg: '#ffffff', // page canvas
  surface: '#ffffff', // primary: tiles, buttons, inputs
  surfaceHover: '#f7f7f7',
  surfaceActive: '#ebebeb',
  surfaceInner: '#ffffff', // tile inside an inset card
  surfaceInset: '#f7f7f7', // OUTER card, segmented track
  surfaceInsetHover: '#ebebeb',
  surfaceTertiary: '#ebebeb', // badges, pills, avatars
  surfaceTertiaryHover: '#d4d4d4',
  overlay: 'rgba(10, 10, 10, 0.4)',

  // borders
  border: '#ebebeb',
  borderHover: '#d4d4d4',
  borderActive: '#a1a1a1',
  borderControl: '#d4d4d4', // checkbox / radio
  separator: '#ebebeb',
  focusRing: accent.accent500,

  // text + icon
  text: '#0a0a0a',
  textMuted: '#6b6b6b', // n500 nudged darker for AA on #f7f7f7
  textOnTertiary: '#525252', // text on tertiary fills (badges, avatars)
  textSubtle: '#a1a1a1',
  textDisabled: '#d4d4d4',
  textPlaceholder: '#a1a1a1',
  textError: '#e7000b', // red-600: AA on white (red-500 is 3.8:1)
  iconMuted: '#737373',
  iconSubtle: '#a1a1a1',

  kbdBg: '#d4d4d4',
  kbdFg: '#737373',

  // accent-derived
  accentFg: '#ffffff',
  accentSoft: accent.accent100,
  accentSoftHover: accent.accent200,
  accentSoftActive: accent.accent300,
  accentSoftFg: accent.accent700,
  accentSoftDisabled: accent.accent50,
  accentSoftDisabledFg: accent.accent300,
  accentTint: `color-mix(in srgb, ${accent.accent500} 12%, transparent)`,

  // disabled solid (gradient stops)
  disabledFrom: '#ebebeb',
  disabledTo: '#d4d4d4',
  disabledFg: '#a1a1a1',

  // danger solid
  dangerFrom: '#fb2c36',
  dangerTo: '#e7000b',
  dangerHoverFrom: '#ff6467',
  dangerHoverTo: '#fb2c36',
  dangerActiveFrom: '#e7000b',
  dangerActiveTo: '#c10007',
  errorBg: '#ffe2e2',
  errorBorder: '#fb2c36',

  // status chips (bg / fg) + solid dot + halo
  successBg: '#d8f999',
  successFg: '#3c6300',
  successSolid: '#00c950',
  successHalo: '#dbfce7',
  warningBg: '#fff085',
  warningFg: '#894b00',
  warningSolid: '#f0b100',
  warningHalo: '#fff085',
  dangerBg: '#ffccd3',
  dangerFg: '#a50036',
  dangerSolid: '#fb2c36',
  dangerHalo: '#ffe2e2',
  infoBg: '#bedbff',
  infoFg: '#193cb8',
  infoSolid: '#615fff',
  infoHalo: '#e0e7ff',
  cyanBg: '#a2f4fd',
  cyanFg: '#005f78',
  orangeBg: '#ffd6a7',
  orangeFg: '#9f2d00',
  purpleBg: '#f3e8ff',
  purpleFg: '#9810fa',

  // charts (not accent-driven)
  chart1: '#00d5be',
  chart2: '#9ae600',
  chart3: '#fb64b6',
  chart4: '#00bcff',
  chart5: '#c27aff',
  chart6: '#3392ff',
  chart7: '#00d492',
  chart8: '#fdc700',
  chart9: '#7c86ff',
  chart10: '#a1a1a1',
  chartTrack: '#ebebeb',
  chartCursor: '#d4d4d4',
});
