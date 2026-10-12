import * as stylex from '@stylexjs/stylex';

export const motion = stylex.defineVars({
  durFast: '100ms',
  durBase: '150ms',
  durSlow: '250ms',
  easeStandard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
});
