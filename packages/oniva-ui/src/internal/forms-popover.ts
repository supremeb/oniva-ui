import * as stylex from '@stylexjs/stylex';
import { media } from '../tokens/media.stylex';
import { colors } from '../tokens/colors.stylex';
import { font } from '../tokens/font.stylex';
import { motion } from '../tokens/motion.stylex';
import { radius } from '../tokens/radius.stylex';
import { shadow } from '../tokens/shadow.stylex';

/** Shared popover + listbox styles for Select / Combobox / MultiSelect / DatePicker (Group A). */
export const fp = stylex.create({
  popover: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-dropdown'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-sans'],
    minWidth: 'var(--trigger-width)',
    overflow: 'auto',
    overscrollBehavior: 'contain',
    zIndex: 50,
  },
  popoverAuto: { minWidth: 0 },
  listbox: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    maxHeight: 280,
    outline: 'none',
    overflow: 'auto',
    overscrollBehavior: 'contain',
    padding: 4,
  },
  item: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-md'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 8,
    lineHeight: font['--oniva-font-lh-14'],
    minHeight: 32,
    outline: 'none',
    paddingBlock: 6,
    paddingInline: 8,
    // highlight is instant on enter (0ms via itemFocused), soft on leave
    transitionDuration: motion['--oniva-motion-dur-press'],
    transitionProperty: 'background-color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  itemFocused: {
    backgroundColor: colors['--oniva-color-surface-hover'],
    transitionDuration: '0ms',
  },
  itemSelected: { backgroundColor: colors['--oniva-color-accent-tint'] },
  itemDisabled: { color: colors['--oniva-color-text-disabled'], cursor: 'not-allowed' },
  itemLabel: {
    flexGrow: 1,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  itemDescription: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-regular'],
    lineHeight: font['--oniva-font-lh-12'],
  },
  check: { color: colors['--oniva-color-accent-soft-fg'], flexShrink: 0 },
  sectionHeader: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-semibold'],
    letterSpacing: font['--oniva-font-track-label'],
    lineHeight: font['--oniva-font-lh-12'],
    paddingBlock: 6,
    paddingInline: 8,
  },
  dot: { borderRadius: radius['--oniva-radius-full'], flexShrink: 0, height: 8, width: 8 },
  dotSuccess: {
    backgroundColor: colors['--oniva-color-success-solid'],
    boxShadow: `0 0 0 3px ${colors['--oniva-color-success-halo']}`,
  },
  dotWarning: {
    backgroundColor: colors['--oniva-color-warning-solid'],
    boxShadow: `0 0 0 3px ${colors['--oniva-color-warning-halo']}`,
  },
  dotDanger: {
    backgroundColor: colors['--oniva-color-danger-solid'],
    boxShadow: `0 0 0 3px ${colors['--oniva-color-danger-halo']}`,
  },
  dotInfo: {
    backgroundColor: colors['--oniva-color-info-solid'],
    boxShadow: `0 0 0 3px ${colors['--oniva-color-info-halo']}`,
  },
  dotNeutral: {
    backgroundColor: colors['--oniva-color-icon-subtle'],
    boxShadow: `0 0 0 3px ${colors['--oniva-color-surface-tertiary']}`,
  },
  trigger: {
    appearance: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-14'],
    outline: 'none',
    textAlign: 'start',
    width: '100%',
  },
  triggerValue: {
    alignItems: 'center',
    display: 'flex',
    flexGrow: 1,
    gap: 8,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  placeholder: {
    color: colors['--oniva-color-text-placeholder'],
    fontWeight: font['--oniva-font-weight-regular'],
  },
  chevron: { color: colors['--oniva-color-icon-muted'], flexShrink: 0 },
  iconButton: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: 'transparent', ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-active'] } },
    borderRadius: radius['--oniva-radius-sm'],
    borderWidth: 0,
    color: colors['--oniva-color-icon-muted'],
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    height: 24,
    justifyContent: 'center',
    padding: 0,
    width: 24,
  },
});

export type DotTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';
export const dotKey = {
  success: 'dotSuccess',
  warning: 'dotWarning',
  danger: 'dotDanger',
  info: 'dotInfo',
  neutral: 'dotNeutral',
} as const;
