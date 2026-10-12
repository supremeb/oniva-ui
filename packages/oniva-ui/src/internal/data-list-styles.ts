import * as stylex from '@stylexjs/stylex';
import { media } from '../tokens/media.stylex';
import { colors } from '../tokens/colors.stylex';
import { font } from '../tokens/font.stylex';
import { motion } from '../tokens/motion.stylex';
import { radius } from '../tokens/radius.stylex';
import { shadow } from '../tokens/shadow.stylex';

/** Shared by ListBox, List (GridList) and TreeView. */
export const listStyles = stylex.create({
  root: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    gap: 2,
    maxHeight: 360,
    outline: 'none',
    overflow: 'auto',
    padding: 4,
    width: '100%',
  },
  rootFocus: {
    boxShadow: `0 0 0 3px color-mix(in srgb, ${colors['--oniva-color-focus-ring']} 25%, transparent)`,
  },
  item: {
    alignItems: 'center',
    backgroundColor: { default: 'transparent', ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-hover'] } },
    borderRadius: radius['--oniva-radius-md'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    fontSize: font['--oniva-font-size-14'],
    gap: 10,
    lineHeight: font['--oniva-font-lh-14'],
    minHeight: 36,
    outline: 'none',
    paddingBlock: 6,
    paddingInline: 8,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, color',
    transitionTimingFunction: motion['--oniva-motion-ease-standard'],
  },
  itemFocus: { backgroundColor: colors['--oniva-color-surface-inset-hover'] },
  itemFocusRing: {
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: -2,
    outlineStyle: 'solid',
    outlineWidth: 2,
  },
  itemSelected: {
    backgroundColor: {
      default: colors['--oniva-color-accent-soft'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-accent-soft-hover'] },
    },
    color: colors['--oniva-color-accent-soft-fg'],
  },
  itemDisabled: { color: colors['--oniva-color-text-disabled'], cursor: 'not-allowed' },
  icon: { color: colors['--oniva-color-icon-muted'], display: 'inline-flex', flexShrink: 0 },
  iconSelected: { color: colors['--oniva-color-accent-soft-fg'] },
  text: { display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 },
  label: { fontWeight: font['--oniva-font-weight-medium'] },
  description: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    lineHeight: font['--oniva-font-lh-12'],
  },
  section: { display: 'flex', flexDirection: 'column', gap: 2 },
  sectionHeader: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-semibold'],
    letterSpacing: font['--oniva-font-track-label'],
    paddingBlock: 6,
    paddingInline: 8,
    textTransform: 'uppercase',
  },
  trail: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
  },
  card: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-xs'],
  },
});
