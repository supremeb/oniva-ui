import * as stylex from '@stylexjs/stylex';
import { colors } from '../tokens/colors.stylex';
import { font } from '../tokens/font.stylex';
import { motion } from '../tokens/motion.stylex';
import { radius } from '../tokens/radius.stylex';
import { shadow } from '../tokens/shadow.stylex';

/** Shared surfaces for AI components (disclosure triggers, inset panels, white tiles). */
export const aiStyles = stylex.create({
  panel: {
    backgroundColor: colors.surfaceInset,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    fontFamily: font.sans,
  },
  tile: {
    backgroundColor: colors.surfaceInner,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow.card,
    boxSizing: 'border-box',
  },
  triggerReset: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: 'inherit',
    cursor: 'pointer',
    display: 'flex',
    fontFamily: font.sans,
    fontSize: font.size13,
    fontWeight: font.weightMedium,
    gap: 8,
    outlineColor: colors.focusRing,
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    textAlign: 'start',
    width: '100%',
  },
  chevron: {
    color: colors.iconMuted,
    flexShrink: 0,
    transitionDuration: motion.durBase,
    transitionProperty: 'transform',
    transitionTimingFunction: motion.easeStandard,
  },
  chevronOpen: { transform: 'rotate(90deg)' },
  heading: { margin: 0 },
  muted: { color: colors.textMuted },
  num: { fontVariantNumeric: 'tabular-nums' },
});
