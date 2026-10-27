import * as stylex from '@stylexjs/stylex';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { colors } from '../tokens/colors.stylex';
import { font } from '../tokens/font.stylex';
import { motion } from '../tokens/motion.stylex';
import { radius } from '../tokens/radius.stylex';

export const wstyles = stylex.create({
  /** Big number: "31,600" + muted unit. */
  valueRow: { alignItems: 'baseline', display: 'flex', gap: 6 },
  value: {
    color: colors['--oniva-color-text'],
    fontFeatureSettings: "'tnum'",
    fontSize: font['--oniva-font-size-24'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-medium'],
    letterSpacing: font['--oniva-font-track-hero'],
    lineHeight: font['--oniva-font-lh-24'],
    margin: 0,
  },
  unit: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-13'],
  },
  muted: { color: colors['--oniva-color-text-muted'] },
  num: { fontFeatureSettings: "'tnum'", fontVariantNumeric: 'tabular-nums' },
  col: { display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 },
  hairline: {
    backgroundColor: colors['--oniva-color-separator'],
    borderWidth: 0,
    height: 1,
    margin: 0,
    width: '100%',
  },
  dot: {
    borderRadius: radius['--oniva-radius-xs'],
    display: 'inline-block',
    flexShrink: 0,
    height: 10,
    width: 10,
  },
  srOnly: {
    borderWidth: 0,
    clip: 'rect(0,0,0,0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
  },
  // range switcher
  range: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: 'none',
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 2,
    height: 36,
    padding: 3,
  },
  rangeLabel: {
    fontFeatureSettings: "'tnum'",
    minWidth: 96,
    paddingInline: 6,
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  rangeBtn: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors['--oniva-color-surface-inset-hover'],
    },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-text-muted'],
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    display: 'inline-flex',
    height: 28,
    justifyContent: 'center',
    opacity: { default: 1, ':disabled': 0.4 },
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colors['--oniva-color-focus-ring']}`,
    },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color',
    width: 28,
  },
});

export interface RangeSwitcherProps {
  label: ReactNode;
  onPrev?: () => void;
  onNext?: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  prevLabel?: string;
  nextLabel?: string;
  minLabelWidth?: number;
  xstyle?: stylex.StyleXStyles;
}

/** "‹ 29 Jun – 5 Jul ›" pill used by widget headers. */
export function RangeSwitcher({
  label,
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
  prevLabel = 'Previous',
  nextLabel = 'Next',
  minLabelWidth,
  xstyle,
}: RangeSwitcherProps) {
  return (
    <div {...stylex.props(wstyles.range, xstyle)}>
      <AriaButton
        aria-label={prevLabel}
        isDisabled={prevDisabled}
        onPress={onPrev}
        {...stylex.props(wstyles.rangeBtn)}
      >
        <ChevronLeft size={16} aria-hidden="true" />
      </AriaButton>
      <span
        aria-live="polite"
        {...stylex.props(wstyles.rangeLabel)}
        style={minLabelWidth ? { minWidth: minLabelWidth } : undefined}
      >
        {label}
      </span>
      <AriaButton
        aria-label={nextLabel}
        isDisabled={nextDisabled}
        onPress={onNext}
        {...stylex.props(wstyles.rangeBtn)}
      >
        <ChevronRight size={16} aria-hidden="true" />
      </AriaButton>
    </div>
  );
}

export const fmtInt = (n: number) => new Intl.NumberFormat('en-US').format(Math.round(n));
export const fmtUsd = (n: number, digits = 0) =>
  new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
    style: 'currency',
  }).format(n);

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const MONTHS_SHORT = MONTHS.map((m) => m.slice(0, 3));
export const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const pad2 = (n: number) => String(n).padStart(2, '0');
export const isoDate = (y: number, m0: number, d: number) => `${y}-${pad2(m0 + 1)}-${pad2(d)}`;
