import * as stylex from '@stylexjs/stylex';
import { Label as AriaLabel, ProgressBar as AriaProgressBar, type ProgressBarProps as AriaProgressBarProps } from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const stripes = stylex.keyframes({
  from: { backgroundPosition: '0 0' },
  to: { backgroundPosition: '24px 0' },
});

export const progressStyles = stylex.create({
  root: { display: 'grid', fontFamily: font.sans, gap: 6, width: '100%' },
  header: {
    alignItems: 'baseline',
    color: colors.text,
    display: 'flex',
    fontSize: font.size13,
    gap: 12,
    fontWeight: font.weightMedium,
    justifyContent: 'space-between',
    lineHeight: font.lh13,
  },
  value: { color: colors.textMuted, fontVariantNumeric: 'tabular-nums' },
  track: {
    backgroundColor: colors.chartTrack,
    borderRadius: radius.full,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  sm: { height: 6 },
  md: { height: 8 },
  lg: { height: 12 },
  fill: {
    borderRadius: radius.full,
    height: '100%',
    transitionDuration: motion.durSlow,
    transitionProperty: 'width',
    transitionTimingFunction: motion.easeStandard,
  },
  accent: { backgroundImage: `linear-gradient(90deg, ${accent.accent400}, ${accent.accent600})` },
  success: { backgroundColor: colors.successSolid },
  warning: { backgroundColor: colors.warningSolid },
  danger: { backgroundColor: colors.dangerSolid },
  indeterminate: {
    animationDuration: '1.2s',
    animationIterationCount: 'infinite',
    animationName: { default: stripes, '@media (prefers-reduced-motion: reduce)': 'none' },
    animationTimingFunction: 'linear',
    backgroundImage: `repeating-linear-gradient(135deg, ${accent.accent500} 0 6px, ${accent.accent400} 6px 12px)`,
    backgroundSize: '24px 100%',
    width: '40%',
  },
});

export type ProgressTone = 'accent' | 'success' | 'warning' | 'danger';

export interface ProgressBarProps
  extends Omit<AriaProgressBarProps, 'className' | 'style' | 'children'> {
  /** Visible label; falls back to `aria-label`. */
  label?: ReactNode;
  /** Show the formatted value (e.g. 64%) beside the label. */
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  tone?: ProgressTone;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function ProgressBar({
  label,
  showValue = false,
  size = 'md',
  tone = 'accent',
  className,
  xstyle,
  ref,
  ...rest
}: ProgressBarProps) {
  const sx = stylex.props(progressStyles.root, xstyle);
  return (
    <AriaProgressBar
      {...rest}
      ref={ref}
      className={[sx.className, className].filter(Boolean).join(' ')}
      style={sx.style as never}
    >
      {({ percentage = 0, valueText, isIndeterminate }) => (
        <>
          {(label || showValue) && (
            <div {...stylex.props(progressStyles.header)}>
              {label ? <AriaLabel>{label}</AriaLabel> : <span />}
              {showValue && !isIndeterminate && (
                <span {...stylex.props(progressStyles.value)}>{valueText}</span>
              )}
            </div>
          )}
          <div {...stylex.props(progressStyles.track, progressStyles[size])}>
            <div
              {...stylex.props(
                progressStyles.fill,
                progressStyles[tone],
                isIndeterminate && progressStyles.indeterminate,
              )}
              style={isIndeterminate ? undefined : { width: `${percentage}%` }}
            />
          </div>
        </>
      )}
    </AriaProgressBar>
  );
}
