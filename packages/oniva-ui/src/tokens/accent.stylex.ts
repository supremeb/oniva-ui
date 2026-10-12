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
  /** Text color on accent solid fills (white, or near-black on amber/emerald/cyan). Always >= 4.5:1 on the solid ramp below. */
  '--oniva-accent-on-solid': '#ffffff',
  /** Solid fill gradient stops (top -> bottom) chosen so on-solid text is >= 4.5:1 at rest, hover and press. */
  '--oniva-accent-solid': '#155dfc',
  '--oniva-accent-solid-end': '#1447e6',
  '--oniva-accent-solid-hover': '#1447e6',
  '--oniva-accent-solid-hover-end': '#193cb8',
  '--oniva-accent-solid-active': '#193cb8',
  '--oniva-accent-solid-active-end': '#1c398e',
  /** Light-mode focus ring color: accent-600 (accent-700 on amber) so it keeps >= 3:1 on bg, surface and inset. */
  '--oniva-accent-focus': '#155dfc',
});
