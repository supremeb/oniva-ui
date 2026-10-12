import * as stylex from '@stylexjs/stylex';
import { colors } from '../tokens/colors.stylex';
import { font } from '../tokens/font.stylex';
import { motion } from '../tokens/motion.stylex';
import { radius } from '../tokens/radius.stylex';
import { shadow } from '../tokens/shadow.stylex';

/** Shared by ListBox, List (GridList) and TreeView. */
export const listStyles = stylex.create({
  root: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    gap: 2,
    maxHeight: 360,
    outline: 'none',
    overflow: 'auto',
    padding: 4,
    width: '100%',
  },
  rootFocus: { boxShadow: `0 0 0 3px color-mix(in srgb, ${colors.focusRing} 25%, transparent)` },
  item: {
    alignItems: 'center',
    backgroundColor: { default: 'transparent', ':hover': colors.surfaceHover },
    borderRadius: radius.md,
    boxSizing: 'border-box',
    color: colors.text,
    cursor: 'pointer',
    display: 'flex',
    fontSize: font.size14,
    gap: 10,
    lineHeight: font.lh14,
    minHeight: 36,
    outline: 'none',
    paddingBlock: 6,
    paddingInline: 8,
    transitionDuration: motion.durBase,
    transitionProperty: 'background-color, color',
    transitionTimingFunction: motion.easeStandard,
  },
  itemFocus: { backgroundColor: colors.surfaceInsetHover },
  itemFocusRing: {
    outlineColor: colors.focusRing,
    outlineOffset: -2,
    outlineStyle: 'solid',
    outlineWidth: 2,
  },
  itemSelected: {
    backgroundColor: { default: colors.accentSoft, ':hover': colors.accentSoftHover },
    color: colors.accentSoftFg,
  },
  itemDisabled: { color: colors.textDisabled, cursor: 'not-allowed' },
  icon: { color: colors.iconMuted, display: 'inline-flex', flexShrink: 0 },
  iconSelected: { color: colors.accentSoftFg },
  text: { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 },
  label: { fontWeight: font.weightMedium },
  description: { color: colors.textMuted, fontSize: font.size12, lineHeight: font.lh12 },
  section: { display: 'flex', flexDirection: 'column', gap: 2 },
  sectionHeader: {
    color: colors.textMuted,
    fontSize: font.size12,
    fontWeight: font.weightSemibold,
    letterSpacing: font.trackLabel,
    paddingBlock: 6,
    paddingInline: 8,
    textTransform: 'uppercase',
  },
  trail: { color: colors.textMuted, fontSize: font.size12, fontVariantNumeric: 'tabular-nums' },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow.xs,
  },
});
