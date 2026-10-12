import * as stylex from '@stylexjs/stylex';

/**
 * Accent ramp, kept in its OWN var group so accent themes compose with light/dark themes
 * (two themes touching the same group would conflict). Default = blue.
 */
export const accent = stylex.defineVars({
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
