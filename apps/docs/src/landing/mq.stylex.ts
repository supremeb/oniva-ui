import * as stylex from '@stylexjs/stylex';

export const mq = stylex.defineConsts({
  BP: '@media (min-width: 800px)',
  RM: '@media (prefers-reduced-motion: reduce)',
  EASE: 'cubic-bezier(0.23, 1, 0.32, 1)',
  DISPLAY: "'InterDisplay', 'Inter', ui-sans-serif, system-ui, sans-serif",
});
