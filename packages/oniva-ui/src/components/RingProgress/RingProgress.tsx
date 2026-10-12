import * as stylex from '@stylexjs/stylex';
import { ProgressBar as AriaProgressBar, type ProgressBarProps as AriaProgressBarProps } from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { accent } from '../../tokens/accent.stylex';

const styles = stylex.create({
  root: {
    alignItems: 'center',
    display: 'inline-flex',
    fontFamily: font.sans,
    justifyContent: 'center',
    position: 'relative',
  },
  track: { stroke: colors.chartTrack },
  bar: {
    stroke: accent.accent500,
    transitionDuration: motion.durSlow,
    transitionProperty: 'stroke-dashoffset',
    transitionTimingFunction: motion.easeStandard,
  },
  success: { stroke: colors.successSolid },
  warning: { stroke: colors.warningSolid },
  danger: { stroke: colors.dangerSolid },
  center: {
    alignItems: 'center',
    color: colors.text,
    display: 'flex',
    fontSize: font.size11,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font.weightSemibold,
    inset: 0,
    justifyContent: 'center',
    lineHeight: font.lh11,
    position: 'absolute',
  },
});

export interface RingProgressProps
  extends Omit<AriaProgressBarProps, 'className' | 'style' | 'children'> {
  /** Diameter in px. */
  size?: number;
  strokeWidth?: number;
  tone?: 'accent' | 'success' | 'warning' | 'danger';
  /** Centre content, e.g. `4` for a "4 steps left" loader. Defaults to the percentage. */
  children?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Circular determinate progress (partial ring), e.g. "4 steps left". */
export function RingProgress({
  size = 36,
  strokeWidth = 4,
  tone = 'accent',
  children,
  className,
  xstyle,
  ref,
  ...rest
}: RingProgressProps) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const sx = stylex.props(styles.root, xstyle);
  return (
    <AriaProgressBar
      {...rest}
      ref={ref}
      className={[sx.className, className].filter(Boolean).join(' ')}
      style={{ ...(sx.style as object), height: size, width: size }}
    >
      {({ percentage = 0, valueText }) => (
        <>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              strokeWidth={strokeWidth}
              {...stylex.props(styles.track)}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - percentage / 100)}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              {...stylex.props(styles.bar, tone !== 'accent' && styles[tone])}
            />
          </svg>
          <span {...stylex.props(styles.center)} aria-hidden="true">
            {children ?? valueText}
          </span>
        </>
      )}
    </AriaProgressBar>
  );
}
