import * as stylex from '@stylexjs/stylex';
import { colors } from '../tokens/colors.stylex';

export type CardTone = 'red' | 'amber' | 'green' | 'blue' | 'violet' | 'gray';

/** Color of a status dot per tone (token-backed). */
export const toneColor = stylex.create({
  red: { color: colors['--oniva-color-danger-solid'] },
  amber: { color: colors['--oniva-color-warning-solid'] },
  green: { color: colors['--oniva-color-success-solid'] },
  blue: { color: colors['--oniva-color-info-solid'] },
  violet: { color: colors['--oniva-color-purple-fg'] },
  gray: { color: colors['--oniva-color-icon-muted'] },
});
