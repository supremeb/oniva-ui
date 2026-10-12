import * as stylex from '@stylexjs/stylex';
import { mergeSx } from '../../internal/sx';
import {
  ProgressBar as AriaProgressBar,
  type ProgressBarProps as AriaProgressBarProps,
} from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { accent } from '../../tokens/accent.stylex';

const styles = stylex.create({
  root: {
    alignItems: 'center',
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    justifyContent: 'center',
    position: 'relative',
  },
  track: { stroke: colors['--oniva-color-chart-track'] },
  bar: {
    stroke: accent['--oniva-accent-500'],
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'stroke-dashoffset',
    transitionTimingFunction: motion['--oniva-motion-ease-standard'],
  },
  success: { stroke: colors['--oniva-color-success-solid'] },
  warning: { stroke: colors['--oniva-color-warning-solid'] },
  danger: { stroke: colors['--oniva-color-danger-solid'] },
  center: {
    alignItems: 'center',
    color: colors['--oniva-color-text'],
    display: 'flex',
    fontSize: font['--oniva-font-size-11'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-semibold'],
    inset: 0,
    justifyContent: 'center',
    lineHeight: font['--oniva-font-lh-11'],
    position: 'absolute',
  },
});

export interface RingProgressProps extends Omit<
  AriaProgressBarProps,
  'className' | 'style' | 'children'
> {
  /** Diameter in px. */
  diameter?: number;
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
  diameter = 36,
  strokeWidth = 4,
  tone = 'accent',
  children,
  className,
  xstyle,
  ref,
  ...rest
}: RingProgressProps) {
  const r = (diameter - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const sx = stylex.props(styles.root, xstyle);
  return (
    <AriaProgressBar
      {...rest}
      ref={ref}
      {...mergeSx(sx, className, { height: diameter, width: diameter })}
    >
      {({ percentage = 0, valueText }) => (
        <>
          <svg
            width={diameter}
            height={diameter}
            viewBox={`0 0 ${diameter} ${diameter}`}
            aria-hidden="true"
          >
            <circle
              cx={diameter / 2}
              cy={diameter / 2}
              r={r}
              fill="none"
              strokeWidth={strokeWidth}
              {...stylex.props(styles.track)}
            />
            <circle
              cx={diameter / 2}
              cy={diameter / 2}
              r={r}
              fill="none"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - percentage / 100)}
              transform={`rotate(-90 ${diameter / 2} ${diameter / 2})`}
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
