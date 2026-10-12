import * as stylex from '@stylexjs/stylex';
import { accent } from '../tokens/accent.stylex';
import { colors } from '../tokens/colors.stylex';
import { shadow } from '../tokens/shadow.stylex';
import { hues, type AccentName } from '../tokens/primitives';

export type { AccentName };

/**
 * Dark mode. Neutrals/status only: the accent ramp lives in a separate group, so
 * `darkTheme` + any accent theme compose. Accent-derived tokens that differ per mode
 * (soft fills) are remapped here against the ramp.
 */
export const darkTheme = stylex.createTheme(colors, {
  bg: '#121212',
  surface: '#262626',
  surfaceHover: 'rgba(64, 64, 64, 0.6)',
  surfaceActive: '#262626',
  surfaceInner: 'rgba(38, 38, 38, 0.6)',
  surfaceInset: '#171717',
  surfaceInsetHover: '#262626',
  surfaceTertiary: '#262626',
  surfaceTertiaryHover: '#404040',
  overlay: 'rgba(0, 0, 0, 0.6)',

  border: '#404040',
  borderHover: '#737373',
  borderActive: '#525252',
  borderControl: '#404040',
  separator: '#262626',

  text: '#fafafa',
  textMuted: '#a1a1a1',
  textOnTertiary: '#d4d4d4',
  textSubtle: '#525252',
  textDisabled: '#262626',
  textPlaceholder: '#a1a1a1',
  textError: '#ff6467',
  iconMuted: '#737373',
  iconSubtle: '#525252',
  kbdBg: '#404040',
  kbdFg: '#a1a1a1',

  accentSoft: accent.accent900,
  accentSoftHover: accent.accent800,
  accentSoftActive: accent.accent700,
  accentSoftFg: accent.accent300,
  accentSoftDisabled: accent.accent950,
  accentSoftDisabledFg: accent.accent700,
  accentTint: `color-mix(in srgb, ${accent.accent500} 15%, transparent)`,

  disabledFrom: '#404040',
  disabledTo: '#262626',
  disabledFg: '#737373',

  errorBg: 'rgba(70, 8, 9, 0.6)',
  errorBorder: '#ff6467',

  successBg: 'rgba(25, 46, 3, 0.6)',
  successFg: '#7ccf00',
  warningBg: 'rgba(67, 32, 4, 0.6)',
  warningFg: '#f0b100',
  dangerBg: 'rgba(77, 2, 24, 0.6)',
  dangerFg: '#ff6467', // lighter than rose-500 for AA on the tinted chip
  infoBg: 'rgba(22, 37, 86, 0.6)',
  infoFg: '#8ec5ff',
  cyanBg: 'rgba(5, 51, 69, 0.6)',
  cyanFg: '#00d3f2',
  orangeBg: 'rgba(68, 19, 6, 0.6)',
  orangeFg: '#ff6900',
  purpleBg: 'rgba(89, 22, 139, 0.5)',
  purpleFg: '#dab2ff',
  successHalo: 'rgba(3, 77, 38, 0.4)',
  warningHalo: 'rgba(137, 75, 0, 0.4)',
  dangerHalo: 'rgba(130, 24, 26, 0.4)',
  infoHalo: 'rgba(55, 42, 172, 0.4)',

  chartTrack: '#262626',
  chartCursor: '#404040',
});

export const darkShadowTheme = stylex.createTheme(shadow, {
  card: '0 1px 1px #00000024',
  xs: '0 1px 2px #00000040',
  sm: '0 1px 2px #0000004d, 0 1px 3px #00000066',
  md: '0 2px 4px -1px #0000004d, 0 4px 6px -1px #00000066',
  lg: '0 4px 6px -2px #00000040, 0 10px 15px -3px #00000066',
  xl: '0 10px 10px -5px #00000040, 0 20px 25px -5px #00000066',
  dropdown: '0 1px 1px #00000040, 0 4px 4px #00000026, 0 8px 24px #00000080',
  float: '0 1px 0 #ffffff0a, 0 1px 12px #00000066, 0 0 1px #ffffff40',
});

// Literal values on purpose: createTheme() only accepts statically evaluable arguments.
// Source of truth for the ramps is tokens/primitives.ts (used for swatches); keep in sync.
export const accentBlue = stylex.createTheme(accent, {
  accent50: '#eff6ff',
  accent100: '#dbeafe',
  accent200: '#bedbff',
  accent300: '#8ec5ff',
  accent400: '#3392ff',
  accent500: '#2b7fff',
  accent600: '#155dfc',
  accent700: '#1447e6',
  accent800: '#193cb8',
  accent900: '#1c398e',
  accent950: '#162556',
});

export const accentViolet = stylex.createTheme(accent, {
  accent50: '#f5f3ff',
  accent100: '#ede9fe',
  accent200: '#ddd6ff',
  accent300: '#c4b4ff',
  accent400: '#a684ff',
  accent500: '#8e51ff',
  accent600: '#7f22fe',
  accent700: '#7008e7',
  accent800: '#5d0ec0',
  accent900: '#4d179a',
  accent950: '#2f0d68',
});

export const accentPink = stylex.createTheme(accent, {
  accent50: '#fdf2f8',
  accent100: '#fce7f3',
  accent200: '#fccee8',
  accent300: '#fda5d5',
  accent400: '#fb64b6',
  accent500: '#f6339a',
  accent600: '#e60076',
  accent700: '#c6005c',
  accent800: '#a3004c',
  accent900: '#861043',
  accent950: '#510424',
});

export const accentRed = stylex.createTheme(accent, {
  accent50: '#fef2f2',
  accent100: '#ffe2e2',
  accent200: '#ffc9c9',
  accent300: '#ffa2a2',
  accent400: '#ff6467',
  accent500: '#fb2c36',
  accent600: '#e7000b',
  accent700: '#c10007',
  accent800: '#9f0712',
  accent900: '#82181a',
  accent950: '#460809',
});

export const accentAmber = stylex.createTheme(accent, {
  accent50: '#fffbeb',
  accent100: '#fef3c6',
  accent200: '#fee685',
  accent300: '#ffd230',
  accent400: '#ffb900',
  accent500: '#fe9a00',
  accent600: '#e17100',
  accent700: '#bb4d00',
  accent800: '#973c00',
  accent900: '#7b3306',
  accent950: '#461901',
});

export const accentEmerald = stylex.createTheme(accent, {
  accent50: '#ecfdf5',
  accent100: '#d0fae5',
  accent200: '#a4f4cf',
  accent300: '#5ee9b5',
  accent400: '#00d492',
  accent500: '#00bc7d',
  accent600: '#009966',
  accent700: '#007a55',
  accent800: '#006045',
  accent900: '#004f3b',
  accent950: '#002c22',
});

export const accentCyan = stylex.createTheme(accent, {
  accent50: '#ecfeff',
  accent100: '#cefafe',
  accent200: '#a2f4fd',
  accent300: '#53eafd',
  accent400: '#00d3f2',
  accent500: '#00b8db',
  accent600: '#0092b8',
  accent700: '#007595',
  accent800: '#005f78',
  accent900: '#104e64',
  accent950: '#053345',
});

export const accentIndigo = stylex.createTheme(accent, {
  accent50: '#eef2ff',
  accent100: '#e0e7ff',
  accent200: '#c6d2ff',
  accent300: '#a3b3ff',
  accent400: '#7c86ff',
  accent500: '#615fff',
  accent600: '#4f39f6',
  accent700: '#432dd7',
  accent800: '#372aac',
  accent900: '#312c85',
  accent950: '#1e1a4d',
});

export const accentThemes = {
  blue: accentBlue,
  violet: accentViolet,
  pink: accentPink,
  red: accentRed,
  amber: accentAmber,
  emerald: accentEmerald,
  cyan: accentCyan,
  indigo: accentIndigo,
} as const;

export const accentNames = Object.keys(accentThemes) as AccentName[];

/** Preview swatch colors (accent-500) for UI like the accent switcher. */
export const accentSwatches: Record<AccentName, string> = Object.fromEntries(
  accentNames.map((n) => [n, hues[n]['500']]),
) as Record<AccentName, string>;
