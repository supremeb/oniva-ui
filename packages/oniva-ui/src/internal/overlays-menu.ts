import * as stylex from '@stylexjs/stylex';
import { colors } from '../tokens/colors.stylex';
import { font } from '../tokens/font.stylex';
import { motion } from '../tokens/motion.stylex';
import { radius } from '../tokens/radius.stylex';
import { shadow } from '../tokens/shadow.stylex';

/** Shared popup animation (fade + scale), disabled for reduced motion. */
const popIn = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(0.96)' },
  to: { opacity: 1, transform: 'scale(1)' },
});
const popOut = stylex.keyframes({
  from: { opacity: 1, transform: 'scale(1)' },
  to: { opacity: 0, transform: 'scale(0.96)' },
});

/** Shared surface + item styles for DropdownMenu, ContextMenu and CommandPalette. */
export const menuStyles = stylex.create({
  popup: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow.dropdown,
    boxSizing: 'border-box',
    color: colors.text,
    minWidth: 200,
    outline: 'none',
    overflow: 'hidden',
    transformOrigin: 'var(--trigger-anchor-point, center)',
  },
  popupEntering: {
    animationDuration: motion.durBase,
    animationFillMode: 'both',
    animationName: { default: popIn, '@media (prefers-reduced-motion: reduce)': 'none' },
    animationTimingFunction: motion.easeOut,
  },
  popupExiting: {
    animationDuration: motion.durFast,
    animationFillMode: 'both',
    animationName: { default: popOut, '@media (prefers-reduced-motion: reduce)': 'none' },
    animationTimingFunction: motion.easeIn,
  },
  menu: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    gap: 2,
    maxHeight: 'inherit',
    outline: 'none',
    overflow: 'auto',
    padding: 4,
  },
  item: {
    alignItems: 'center',
    borderRadius: radius.md,
    boxSizing: 'border-box',
    color: colors.text,
    cursor: 'pointer',
    display: 'flex',
    fontFamily: font.sans,
    fontSize: font.size14,
    fontWeight: font.weightMedium,
    gap: 8,
    lineHeight: font.lh14,
    minHeight: 32,
    outline: 'none',
    paddingBlock: 6,
    paddingInline: 8,
    textDecoration: 'none',
    transitionDuration: motion.durFast,
    transitionProperty: 'background-color, color',
    userSelect: 'none',
  },
  itemFocused: { backgroundColor: colors.surfaceInsetHover },
  itemOpen: { backgroundColor: colors.surfaceInsetHover },
  itemDanger: { color: colors.textError },
  itemDangerFocused: { backgroundColor: colors.errorBg, color: colors.dangerFg },
  itemDisabled: { color: colors.textDisabled, cursor: 'not-allowed' },
  itemLabel: {
    flexGrow: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  itemIcon: {
    alignItems: 'center',
    color: colors.iconMuted,
    display: 'inline-flex',
    flexShrink: 0,
    height: 16,
    justifyContent: 'center',
    width: 16,
  },
  itemIconDanger: { color: 'inherit' },
  check: {
    alignItems: 'center',
    color: colors.text,
    display: 'inline-flex',
    flexShrink: 0,
    height: 16,
    justifyContent: 'center',
    width: 16,
  },
  shortcut: {
    color: colors.textMuted,
    fontFamily: font.sans,
    fontSize: font.size12,
    fontWeight: font.weightMedium,
    letterSpacing: font.trackLabel,
    marginInlineStart: 16,
  },
  chevron: { color: colors.iconSubtle, display: 'inline-flex', flexShrink: 0 },
  section: { display: 'flex', flexDirection: 'column', gap: 2 },
  sectionHeader: {
    color: colors.textMuted,
    fontSize: font.size12,
    fontWeight: font.weightMedium,
    letterSpacing: font.trackLabel,
    lineHeight: font.lh12,
    paddingBlock: 6,
    paddingInline: 8,
  },
  separator: {
    backgroundColor: colors.separator,
    borderWidth: 0,
    flexShrink: 0,
    height: 1,
    marginBlock: 4,
    marginInline: -4,
  },
});
