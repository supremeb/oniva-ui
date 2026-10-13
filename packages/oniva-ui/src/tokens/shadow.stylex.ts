import * as stylex from '@stylexjs/stylex';

export const shadow = stylex.defineVars({
  '--oniva-shadow-card': '0 1px 1px #0000000d',
  '--oniva-shadow-xs': '0 1px 2px #0000000d',
  '--oniva-shadow-sm': '0 1px 2px #0000000f, 0 1px 3px #0000001a',
  '--oniva-shadow-md': '0 2px 4px -1px #0000000f, 0 4px 6px -1px #0000001a',
  '--oniva-shadow-lg': '0 4px 6px -2px #0000000d, 0 10px 15px -3px #0000001a',
  '--oniva-shadow-xl': '0 10px 10px -5px #0000000a, 0 20px 25px -5px #0000001a',
  '--oniva-shadow-dropdown': '0 1px 1px #0000000a, 0 4px 4px #00000005, 0 8px 24px #0000001a',
  '--oniva-shadow-float': '0 1px 0 #00000005, 0 1px 12px #0000000f, 0 0 1px #00000052',
  /** Inner highlight on solid accent surfaces (primary button, active nav, switch). */
  // Edge is translucent black so it always reads as a slightly darker rim of whatever fill sits under it
  // (was accent-500, which showed as a lighter outline once solid fills moved to 600/700 for contrast).
  '--oniva-shadow-accent-inset': 'inset 0 1.75px 0 0 rgb(255 255 255 / 0.25), inset 0 0 0 0.875px rgb(0 0 0 / 0.14)',
  '--oniva-shadow-danger-inset': 'inset 0 1.75px 0 0 rgb(255 255 255 / 0.25), inset 0 0 0 0.875px rgb(0 0 0 / 0.14)',
});
