import * as stylex from '@stylexjs/stylex';

export const motion = stylex.defineVars({
  '--oniva-motion-dur-fast': {
    default: '100ms',
    '@media (prefers-reduced-motion: reduce)': '0.01ms',
  },
  '--oniva-motion-dur-base': {
    default: '150ms',
    '@media (prefers-reduced-motion: reduce)': '0.01ms',
  },
  '--oniva-motion-dur-slow': {
    default: '250ms',
    '@media (prefers-reduced-motion: reduce)': '0.01ms',
  },
  '--oniva-motion-ease-standard': 'cubic-bezier(0.4, 0, 0.2, 1)',
  '--oniva-motion-ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
  '--oniva-motion-ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
});
