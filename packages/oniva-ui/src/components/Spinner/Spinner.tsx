import * as stylex from '@stylexjs/stylex';
import { media } from '../../tokens/media.stylex';
import type { HTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';

const spin = stylex.keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

const styles = stylex.create({
  base: {
    animationDuration: {
      default: '700ms',
      [media.reducedMotion]: '2400ms',
    },
    animationIterationCount: 'infinite',
    animationName: spin,
    animationTimingFunction: 'linear',
    display: 'inline-block',
    flexShrink: 0,
  },
  current: { color: 'inherit' },
  accent: { color: colors['--oniva-color-accent-soft-fg'] },
  muted: { color: colors['--oniva-color-icon-muted'] },
});

const px = { xs: 12, sm: 16, md: 20, lg: 28, xl: 40 } as const;

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style' | 'children'> {
  size?: keyof typeof px;
  tone?: 'current' | 'accent' | 'muted';
  /** Accessible label. */
  label?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

export function Spinner({
  size = 'md',
  tone = 'accent',
  label = 'Loading',
  className,
  xstyle,
  ref,
  ...rest
}: SpinnerProps) {
  const sx = stylex.props(styles.base, styles[tone], xstyle);
  const d = px[size];
  return (
    <span
      role="status"
      aria-label={label}
      {...rest}
      ref={ref}
      {...sx}
      className={[sx.className, className].filter(Boolean).join(' ')}
    >
      <svg width={d} height={d} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
