import * as stylex from '@stylexjs/stylex';

/**
 * Accent ramp, kept in its OWN var group so accent themes compose with light/dark themes
 * (two themes touching the same group would conflict). Default = blue.
 */
export const accent = stylex.defineVars({
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
});
