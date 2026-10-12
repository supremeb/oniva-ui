import * as stylex from '@stylexjs/stylex';
import { accent } from './accent.stylex';

export const shadow = stylex.defineVars({
  card: '0 1px 1px #0000000d',
  xs: '0 1px 2px #0000000d',
  sm: '0 1px 2px #0000000f, 0 1px 3px #0000001a',
  md: '0 2px 4px -1px #0000000f, 0 4px 6px -1px #0000001a',
  lg: '0 4px 6px -2px #0000000d, 0 10px 15px -3px #0000001a',
  xl: '0 10px 10px -5px #0000000a, 0 20px 25px -5px #0000001a',
  dropdown: '0 1px 1px #0000000a, 0 4px 4px #00000005, 0 8px 24px #0000001a',
  float: '0 1px 0 #00000005, 0 1px 12px #0000000f, 0 0 1px #00000052',
  /** Inner highlight on solid accent surfaces (primary button, active nav, switch). */
  accentInset: `inset 0 1.75px 0 0 #ffffff40, inset 0 0 0 0.875px ${accent.accent500}`,
  dangerInset: 'inset 0 1.75px 0 0 #ffffff40, inset 0 0 0 0.875px #fb2c36',
});
