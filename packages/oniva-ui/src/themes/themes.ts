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
  '--oniva-color-bg': '#121212',
  '--oniva-color-surface': '#262626',
  '--oniva-color-surface-hover': 'rgba(64, 64, 64, 0.6)',
  '--oniva-color-surface-active': '#333333',
  '--oniva-color-surface-inner': 'rgba(38, 38, 38, 0.6)',
  '--oniva-color-surface-inset': '#171717',
  '--oniva-color-surface-inset-hover': '#262626',
  '--oniva-color-surface-tertiary': '#303030',
  '--oniva-color-surface-tertiary-hover': '#404040',
  '--oniva-color-overlay': 'rgba(0, 0, 0, 0.6)',
  '--oniva-color-overlay-hover': 'rgba(255, 255, 255, 0.08)',

  '--oniva-color-border': '#404040',
  '--oniva-color-border-hover': '#737373',
  '--oniva-color-border-active': '#a1a1a1', // > border-hover (#737373)
  '--oniva-color-border-control': '#8a8a8a',
  '--oniva-color-focus-ring': accent['--oniva-accent-400'], // >= 3:1 on #121212/#262626/#171717 for all 8 accents
  '--oniva-color-separator': '#262626',

  '--oniva-color-text': '#fafafa',
  '--oniva-color-text-muted': '#b0b0b0', // AA on selected blue-900 rows
  '--oniva-color-text-on-tertiary': '#d4d4d4',
  '--oniva-color-text-subtle': '#a1a1a1', // AA on surface, inset, surface-hover and tertiary
  '--oniva-color-text-disabled': '#737373',
  '--oniva-color-text-placeholder': '#a1a1a1',
  '--oniva-color-text-error': '#ff6467',
  '--oniva-color-icon-muted': '#737373',
  '--oniva-color-icon-subtle': '#8a8a8a',
  '--oniva-color-kbd-bg': '#404040',
  '--oniva-color-kbd-fg': '#d4d4d4',
  '--oniva-color-accent-text': accent['--oniva-accent-300'],
  '--oniva-color-accent-fg': accent['--oniva-accent-on-solid'],
  '--oniva-color-text-inverse': '#0a0a0a',
  '--oniva-color-danger-solid': '#fb2c36',
  '--oniva-color-danger-on-solid': '#0a0a0a',
  '--oniva-color-success-solid': '#00c950',
  '--oniva-color-warning-solid': '#f0b100',
  '--oniva-color-on-chart': '#0a0a0a',

  '--oniva-color-accent-soft': accent['--oniva-accent-900'],
  '--oniva-color-accent-soft-hover': accent['--oniva-accent-800'],
  '--oniva-color-accent-soft-active': accent['--oniva-accent-700'],
  '--oniva-color-accent-soft-fg': accent['--oniva-accent-50'], // >= 4.5:1 on soft (900), hover (800) and active (700)
  '--oniva-color-accent-soft-disabled': accent['--oniva-accent-950'],
  '--oniva-color-accent-soft-disabled-fg': accent['--oniva-accent-700'],
  '--oniva-color-accent-tint': `color-mix(in srgb, ${accent['--oniva-accent-500']} 15%, transparent)`,

  '--oniva-color-disabled-from': '#404040',
  '--oniva-color-disabled-to': '#262626',
  '--oniva-color-disabled-fg': '#737373',

  '--oniva-color-error-bg': 'rgba(70, 8, 9, 0.6)',
  '--oniva-color-error-border': '#ff6467',

  '--oniva-color-success-bg': 'rgba(25, 46, 3, 0.6)',
  '--oniva-color-success-fg': '#7ccf00',
  '--oniva-color-warning-bg': 'rgba(67, 32, 4, 0.6)',
  '--oniva-color-warning-fg': '#f0b100',
  '--oniva-color-danger-bg': 'rgba(77, 2, 24, 0.6)',
  '--oniva-color-danger-fg': '#ff6467', // lighter than rose-500 for AA on the tinted chip
  '--oniva-color-info-bg': 'rgba(22, 37, 86, 0.6)',
  '--oniva-color-info-fg': '#8ec5ff',
  '--oniva-color-cyan-bg': 'rgba(5, 51, 69, 0.6)',
  '--oniva-color-cyan-fg': '#00d3f2',
  '--oniva-color-orange-bg': 'rgba(68, 19, 6, 0.6)',
  '--oniva-color-orange-fg': '#ff6900',
  '--oniva-color-purple-bg': 'rgba(89, 22, 139, 0.5)',
  '--oniva-color-purple-fg': '#dab2ff',
  '--oniva-color-success-halo': 'rgba(3, 77, 38, 0.4)',
  '--oniva-color-warning-halo': 'rgba(137, 75, 0, 0.4)',
  '--oniva-color-danger-halo': 'rgba(130, 24, 26, 0.4)',
  '--oniva-color-info-halo': 'rgba(55, 42, 172, 0.4)',

  '--oniva-color-chart-track': '#404040',
  '--oniva-color-chart-cursor': '#525252',
  // dark keeps the original bright palette (the light palette is tuned for white)
  '--oniva-color-chart-1': '#00debf',
  '--oniva-color-chart-2': '#9df000',
  '--oniva-color-chart-3': '#fe66b7',
  '--oniva-color-chart-4': '#00bfff',
  '--oniva-color-chart-5': '#bf7bff',
  '--oniva-color-chart-6': '#317cff',
  '--oniva-color-chart-7': '#00c48c',
  '--oniva-color-chart-8': '#f3b700',
  '--oniva-color-chart-9': '#7b7be0',
  '--oniva-color-chart-10': '#9b979f',
});

export const darkShadowTheme = stylex.createTheme(shadow, {
  // Dark: shadows barely read, so elevation = lighter surface + 1px top rim + hairline ring.
  '--oniva-elevation-raised': '0 0 0 1px #ffffff1a, inset 0 1px 0 #ffffff14, 0 1px 2px #00000099',
  '--oniva-elevation-raised-hover':
    '0 0 0 1px #ffffff26, inset 0 1px 0 #ffffff1a, 0 2px 6px #000000b3',
  '--oniva-elevation-pressed': '0 0 0 1px #ffffff14, 0 0 1px #00000080',
  '--oniva-elevation-recessed': 'inset 0 1px 2px #00000080',
  '--oniva-elevation-floating':
    '0 0 0 1px #ffffff1a, inset 0 1px 0 #ffffff14, 0 4px 8px -2px #00000066, 0 12px 28px -6px #000000a6',
  '--oniva-elevation-overlay':
    '0 0 0 1px #ffffff1f, inset 0 1px 0 #ffffff1a, 0 12px 24px -4px #00000080, 0 32px 64px -16px #000000b3',
  '--oniva-shadow-card': '0 1px 1px #00000024',
  '--oniva-shadow-xs': '0 1px 2px #00000040',
  '--oniva-shadow-sm': '0 0 0 1px #ffffff1a, inset 0 1px 0 #ffffff14, 0 1px 2px #00000099',
  '--oniva-shadow-md': '0 2px 4px -1px #0000004d, 0 4px 6px -1px #00000066',
  '--oniva-shadow-lg': '0 4px 6px -2px #00000040, 0 10px 15px -3px #00000066',
  '--oniva-shadow-xl':
    '0 0 0 1px #ffffff1f, inset 0 1px 0 #ffffff1a, 0 12px 24px -4px #00000080, 0 32px 64px -16px #000000b3',
  '--oniva-shadow-dropdown':
    '0 0 0 1px #ffffff1a, inset 0 1px 0 #ffffff14, 0 4px 8px -2px #00000066, 0 12px 28px -6px #000000a6',
  '--oniva-shadow-float': '0 1px 0 #ffffff0a, 0 1px 12px #00000066, 0 0 1px #ffffff40',
  '--oniva-shadow-accent-inset':
    'inset 0 1.75px 0 0 rgb(255 255 255 / 0.25), inset 0 0 0 0.875px rgb(0 0 0 / 0.14)',
  '--oniva-shadow-danger-inset':
    'inset 0 1.75px 0 0 rgb(255 255 255 / 0.25), inset 0 0 0 0.875px rgb(0 0 0 / 0.14)',
});

// Literal values on purpose: createTheme() only accepts statically evaluable arguments.
// Source of truth for the ramps is tokens/primitives.ts (used for swatches); keep in sync.
export const accentBlue = stylex.createTheme(accent, {
  '--oniva-accent-50': '#eff6ff',
  '--oniva-accent-100': '#dbeafe',
  '--oniva-accent-200': '#bedbff',
  '--oniva-accent-300': '#8ec5ff',
  '--oniva-accent-400': '#3392ff',
  '--oniva-accent-500': '#2b7fff',
  '--oniva-accent-600': '#155dfc',
  '--oniva-accent-700': '#1447e6',
  '--oniva-accent-800': '#193cb8',
  '--oniva-accent-900': '#1c398e',
  '--oniva-accent-950': '#162556',
  '--oniva-accent-on-solid': '#ffffff',
  '--oniva-accent-solid': '#155dfc',
  '--oniva-accent-solid-end': '#1447e6',
  '--oniva-accent-solid-hover': '#1447e6',
  '--oniva-accent-solid-hover-end': '#193cb8',
  '--oniva-accent-solid-active': '#193cb8',
  '--oniva-accent-solid-active-end': '#1c398e',
  '--oniva-accent-focus': '#155dfc',
});

export const accentViolet = stylex.createTheme(accent, {
  '--oniva-accent-50': '#f5f3ff',
  '--oniva-accent-100': '#ede9fe',
  '--oniva-accent-200': '#ddd6ff',
  '--oniva-accent-300': '#c4b4ff',
  '--oniva-accent-400': '#a684ff',
  '--oniva-accent-500': '#8e51ff',
  '--oniva-accent-600': '#7f22fe',
  '--oniva-accent-700': '#7008e7',
  '--oniva-accent-800': '#5d0ec0',
  '--oniva-accent-900': '#4d179a',
  '--oniva-accent-950': '#2f0d68',
  '--oniva-accent-on-solid': '#ffffff',
  '--oniva-accent-solid': '#7f22fe',
  '--oniva-accent-solid-end': '#7008e7',
  '--oniva-accent-solid-hover': '#7008e7',
  '--oniva-accent-solid-hover-end': '#5d0ec0',
  '--oniva-accent-solid-active': '#5d0ec0',
  '--oniva-accent-solid-active-end': '#4d179a',
  '--oniva-accent-focus': '#7f22fe',
});

export const accentPink = stylex.createTheme(accent, {
  '--oniva-accent-50': '#fdf2f8',
  '--oniva-accent-100': '#fce7f3',
  '--oniva-accent-200': '#fccee8',
  '--oniva-accent-300': '#fda5d5',
  '--oniva-accent-400': '#fb64b6',
  '--oniva-accent-500': '#f6339a',
  '--oniva-accent-600': '#e60076',
  '--oniva-accent-700': '#c6005c',
  '--oniva-accent-800': '#a3004c',
  '--oniva-accent-900': '#861043',
  '--oniva-accent-950': '#510424',
  '--oniva-accent-on-solid': '#ffffff',
  '--oniva-accent-solid': '#e60076',
  '--oniva-accent-solid-end': '#c6005c',
  '--oniva-accent-solid-hover': '#c6005c',
  '--oniva-accent-solid-hover-end': '#a3004c',
  '--oniva-accent-solid-active': '#a3004c',
  '--oniva-accent-solid-active-end': '#861043',
  '--oniva-accent-focus': '#e60076',
});

export const accentRed = stylex.createTheme(accent, {
  '--oniva-accent-50': '#fef2f2',
  '--oniva-accent-100': '#ffe2e2',
  '--oniva-accent-200': '#ffc9c9',
  '--oniva-accent-300': '#ffa2a2',
  '--oniva-accent-400': '#ff6467',
  '--oniva-accent-500': '#fb2c36',
  '--oniva-accent-600': '#e7000b',
  '--oniva-accent-700': '#c10007',
  '--oniva-accent-800': '#9f0712',
  '--oniva-accent-900': '#82181a',
  '--oniva-accent-950': '#460809',
  '--oniva-accent-on-solid': '#ffffff',
  '--oniva-accent-solid': '#e7000b',
  '--oniva-accent-solid-end': '#c10007',
  '--oniva-accent-solid-hover': '#c10007',
  '--oniva-accent-solid-hover-end': '#9f0712',
  '--oniva-accent-solid-active': '#9f0712',
  '--oniva-accent-solid-active-end': '#82181a',
  '--oniva-accent-focus': '#e7000b',
});

export const accentAmber = stylex.createTheme(accent, {
  '--oniva-accent-50': '#fffbeb',
  '--oniva-accent-100': '#fef3c6',
  '--oniva-accent-200': '#fee685',
  '--oniva-accent-300': '#ffd230',
  '--oniva-accent-400': '#ffb900',
  '--oniva-accent-500': '#fe9a00',
  '--oniva-accent-600': '#e17100',
  '--oniva-accent-700': '#bb4d00',
  '--oniva-accent-800': '#973c00',
  '--oniva-accent-900': '#7b3306',
  '--oniva-accent-950': '#461901',
  '--oniva-accent-on-solid': '#0a0a0a',
  '--oniva-accent-solid': '#fe9a00',
  '--oniva-accent-solid-end': '#e17100',
  '--oniva-accent-solid-hover': '#ffb900',
  '--oniva-accent-solid-hover-end': '#fe9a00',
  '--oniva-accent-solid-active': '#e17100',
  '--oniva-accent-solid-active-end': '#e17100',
  '--oniva-accent-focus': '#bb4d00',
});

export const accentEmerald = stylex.createTheme(accent, {
  '--oniva-accent-50': '#ecfdf5',
  '--oniva-accent-100': '#d0fae5',
  '--oniva-accent-200': '#a4f4cf',
  '--oniva-accent-300': '#5ee9b5',
  '--oniva-accent-400': '#00d492',
  '--oniva-accent-500': '#00bc7d',
  '--oniva-accent-600': '#009966',
  '--oniva-accent-700': '#007a55',
  '--oniva-accent-800': '#006045',
  '--oniva-accent-900': '#004f3b',
  '--oniva-accent-950': '#002c22',
  '--oniva-accent-on-solid': '#0a0a0a',
  '--oniva-accent-solid': '#00bc7d',
  '--oniva-accent-solid-end': '#009966',
  '--oniva-accent-solid-hover': '#00d492',
  '--oniva-accent-solid-hover-end': '#00bc7d',
  '--oniva-accent-solid-active': '#009966',
  '--oniva-accent-solid-active-end': '#009966',
  '--oniva-accent-focus': '#009966',
});

export const accentCyan = stylex.createTheme(accent, {
  '--oniva-accent-50': '#ecfeff',
  '--oniva-accent-100': '#cefafe',
  '--oniva-accent-200': '#a2f4fd',
  '--oniva-accent-300': '#53eafd',
  '--oniva-accent-400': '#00d3f2',
  '--oniva-accent-500': '#00b8db',
  '--oniva-accent-600': '#0092b8',
  '--oniva-accent-700': '#007595',
  '--oniva-accent-800': '#005f78',
  '--oniva-accent-900': '#104e64',
  '--oniva-accent-950': '#053345',
  '--oniva-accent-on-solid': '#0a0a0a',
  '--oniva-accent-solid': '#00b8db',
  '--oniva-accent-solid-end': '#0092b8',
  '--oniva-accent-solid-hover': '#00d3f2',
  '--oniva-accent-solid-hover-end': '#00b8db',
  '--oniva-accent-solid-active': '#0092b8',
  '--oniva-accent-solid-active-end': '#0092b8',
  '--oniva-accent-focus': '#0092b8',
});

export const accentIndigo = stylex.createTheme(accent, {
  '--oniva-accent-50': '#eef2ff',
  '--oniva-accent-100': '#e0e7ff',
  '--oniva-accent-200': '#c6d2ff',
  '--oniva-accent-300': '#a3b3ff',
  '--oniva-accent-400': '#7c86ff',
  '--oniva-accent-500': '#615fff',
  '--oniva-accent-600': '#4f39f6',
  '--oniva-accent-700': '#432dd7',
  '--oniva-accent-800': '#372aac',
  '--oniva-accent-900': '#312c85',
  '--oniva-accent-950': '#1e1a4d',
  '--oniva-accent-on-solid': '#ffffff',
  '--oniva-accent-solid': '#4f39f6',
  '--oniva-accent-solid-end': '#432dd7',
  '--oniva-accent-solid-hover': '#432dd7',
  '--oniva-accent-solid-hover-end': '#372aac',
  '--oniva-accent-solid-active': '#372aac',
  '--oniva-accent-solid-active-end': '#312c85',
  '--oniva-accent-focus': '#4f39f6',
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
