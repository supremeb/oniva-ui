import * as stylex from '@stylexjs/stylex';
import { colors } from '../tokens/colors.stylex';
import { radius } from '../tokens/radius.stylex';

/** Token-based surfaces for the Group C demos (so they follow light/dark). */
export const demoStyles = stylex.create({
  tile: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    fontSize: 14,
    paddingBlock: 10,
    paddingInline: 12,
  },
  muted: { color: colors['--oniva-color-text-muted'], fontSize: 13 },
  strong: {
    color: colors['--oniva-color-text'],
    fontSize: 24,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 600,
  },
  panel: { color: colors['--oniva-color-text'], fontSize: 14, paddingBlock: 16 },
});
