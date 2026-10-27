import * as stylex from '@stylexjs/stylex';
import { media } from '../../tokens/media.stylex';
import type { ControlSize } from '../../internal/types';
import {
  useLocale,
  Label as AriaLabel,
  ProgressBar as AriaProgressBar,
  type ProgressBarProps as AriaProgressBarProps,
} from 'react-aria-components';
import { useEffect, useState, type CSSProperties, type ReactNode, type Ref } from 'react';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const slide = stylex.keyframes({
  from: { transform: 'translateX(-100%)' },
  to: { transform: 'translateX(250%)' },
});

export const progressStyles = stylex.create({
  root: { display: 'grid', fontFamily: font['--oniva-font-sans'], gap: 6, width: '100%' },
  header: {
    alignItems: 'baseline',
    color: colors['--oniva-color-text'],
    display: 'flex',
    fontSize: font['--oniva-font-size-13'],
    gap: 12,
    fontWeight: font['--oniva-font-weight-medium'],
    justifyContent: 'space-between',
    lineHeight: font['--oniva-font-lh-13'],
  },
  value: { color: colors['--oniva-color-text-muted'], fontVariantNumeric: 'tabular-nums' },
  track: {
    backgroundColor: colors['--oniva-color-chart-track'],
    borderRadius: radius['--oniva-radius-full'],
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  sm: { height: 6 },
  md: { height: 8 },
  lg: { height: 12 },
  /** Full-width fill scaled from the left (transform only, never width). Value arrives via `--oniva-p` (0-1). */
  fill: {
    height: '100%',
    transform: 'scaleX(var(--oniva-p, 0))',
    position: 'relative',
    transformOrigin: 'left center',
    transitionDuration: motion['--oniva-motion-dur-slower'],
    transitionProperty: 'transform, background-color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '100%',
  },
  accent: {
    backgroundColor: accent['--oniva-accent-500'],
    '::after': { opacity: 1 },
  },
  /** Accent gradient lives on a pseudo layer so tone changes can crossfade. */
  fillGradient: {
    '::after': {
      backgroundImage: `linear-gradient(90deg, ${accent['--oniva-accent-400']}, ${accent['--oniva-accent-600']})`,
      content: '""',
      inset: 0,
      opacity: 0,
      position: 'absolute',
      transitionDuration: motion['--oniva-motion-dur-slower'],
      transitionProperty: 'opacity',
      transitionTimingFunction: motion['--oniva-motion-ease-out'],
    },
  },
  success: { backgroundColor: colors['--oniva-color-success-solid'] },
  warning: { backgroundColor: colors['--oniva-color-warning-solid'] },
  danger: { backgroundColor: colors['--oniva-color-danger-solid'] },
  indeterminate: {
    animationDuration: '1.4s',
    animationIterationCount: 'infinite',
    animationName: { default: slide, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'cubic-bezier(0.65, 0, 0.35, 1)',
    backgroundImage: `linear-gradient(90deg, ${accent['--oniva-accent-400']}, ${accent['--oniva-accent-600']})`,
    borderRadius: radius['--oniva-radius-full'],
    opacity: { default: 1, [media.reducedMotion]: 0.6 },
    transform: 'none',
    width: '40%',
  },
});

/** 0 on first paint, then the real value next frame, so the fill draws in (and later changes transition). */
export function useFillStyle(p: number, indeterminate = false): CSSProperties | undefined {
  const v = useDrawIn(p);
  const { direction } = useLocale();
  if (indeterminate) return undefined;
  return {
    '--oniva-p': v / 100,
    transformOrigin: direction === 'rtl' ? 'right center' : 'left center',
  } as CSSProperties;
}

function useDrawIn(p: number): number {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return ready ? p : 0;
}

export type ProgressTone = 'accent' | 'success' | 'warning' | 'danger';

export interface ProgressBarProps extends Omit<
  AriaProgressBarProps,
  'className' | 'style' | 'children'
> {
  /** Visible label; falls back to `aria-label`. */
  label?: ReactNode;
  /** Show the formatted value (e.g. 64%) beside the label. */
  showValue?: boolean;
  size?: ControlSize;
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
        <ProgressInner
          percentage={percentage}
          valueText={valueText}
          isIndeterminate={isIndeterminate}
          label={label}
          showValue={showValue}
          size={size}
          tone={tone}
        />
      )}
    </AriaProgressBar>
  );
}

function ProgressInner({
  percentage,
  valueText,
  isIndeterminate,
  label,
  showValue,
  size,
  tone,
}: {
  percentage: number;
  valueText?: string;
  isIndeterminate?: boolean;
  label?: ReactNode;
  showValue: boolean;
  size: ControlSize;
  tone: ProgressTone;
}) {
  const fillStyle = useFillStyle(percentage, isIndeterminate);
  return (
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
            progressStyles.fillGradient,
            progressStyles[tone],
            isIndeterminate && progressStyles.indeterminate,
          )}
          style={fillStyle}
        />
      </div>
    </>
  );
}
