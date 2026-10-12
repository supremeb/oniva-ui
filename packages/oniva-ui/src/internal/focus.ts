import * as stylex from '@stylexjs/stylex';
import { colors } from '../tokens/colors.stylex';

/**
 * The single focus-visible ring. Add as a style to `stylex.props(styles.base, focus.ring, ...)`
 * (before `xstyle`). `inset` is for elements clipped by an overflow parent (table cells, list rows).
 */
export const focus = stylex.create({
  ring: {
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
  },
  inset: {
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: -2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
  },
});
