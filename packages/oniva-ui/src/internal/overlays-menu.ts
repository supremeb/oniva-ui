import * as stylex from '@stylexjs/stylex';
import { media } from '../tokens/media.stylex';
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
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-dropdown'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    minWidth: 200,
    outline: 'none',
    overflow: 'hidden',
    transformOrigin: 'var(--trigger-anchor-point, center)',
  },
  popupEntering: {
    animationDuration: motion['--oniva-motion-dur-base'],
    animationFillMode: 'both',
    animationName: { default: popIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  popupExiting: {
    animationDuration: motion['--oniva-motion-dur-fast'],
    animationFillMode: 'both',
    animationName: { default: popOut, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-in'],
  },
  menu: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    gap: 2,
    maxHeight: 'inherit',
    outline: 'none',
    overflow: 'auto',
    padding: 4,
  },
  item: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-md'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 8,
    lineHeight: font['--oniva-font-lh-14'],
    minHeight: 32,
    outline: 'none',
    paddingBlock: 6,
    paddingInline: 8,
    textDecoration: 'none',
    transitionDuration: motion['--oniva-motion-dur-fast'],
    transitionProperty: 'background-color, color',
    userSelect: 'none',
  },
  itemFocused: { backgroundColor: colors['--oniva-color-surface-inset-hover'] },
  itemOpen: { backgroundColor: colors['--oniva-color-surface-inset-hover'] },
  itemDanger: { color: colors['--oniva-color-text-error'] },
  itemDangerFocused: {
    backgroundColor: colors['--oniva-color-error-bg'],
    color: colors['--oniva-color-danger-fg'],
  },
  itemDisabled: { color: colors['--oniva-color-text-disabled'], cursor: 'not-allowed' },
  itemLabel: {
    flexGrow: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  itemIcon: {
    alignItems: 'center',
    color: colors['--oniva-color-icon-muted'],
    display: 'inline-flex',
    flexShrink: 0,
    height: 16,
    justifyContent: 'center',
    width: 16,
  },
  itemIconDanger: { color: 'inherit' },
  check: {
    alignItems: 'center',
    color: colors['--oniva-color-text'],
    display: 'inline-flex',
    flexShrink: 0,
    height: 16,
    justifyContent: 'center',
    width: 16,
  },
  shortcut: {
    color: colors['--oniva-color-text-muted'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    letterSpacing: font['--oniva-font-track-label'],
    marginInlineStart: 16,
  },
  chevron: { color: colors['--oniva-color-icon-subtle'], display: 'inline-flex', flexShrink: 0 },
  section: { display: 'flex', flexDirection: 'column', gap: 2 },
  sectionHeader: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    letterSpacing: font['--oniva-font-track-label'],
    lineHeight: font['--oniva-font-lh-12'],
    paddingBlock: 6,
    paddingInline: 8,
  },
  separator: {
    backgroundColor: colors['--oniva-color-separator'],
    borderWidth: 0,
    flexShrink: 0,
    height: 1,
    marginBlock: 4,
    marginInline: -4,
  },
});
