import * as stylex from '@stylexjs/stylex';
import { media } from '../../tokens/media.stylex';
import type { HTMLAttributes, Ref } from 'react';
import { useInView } from '../../motion/InView/useInView';
import { colors } from '../../tokens/colors.stylex';

const spin = stylex.keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

/** Reduced motion: no rotation, a slow opacity pulse instead (still reads as "busy"). */
const pulse = stylex.keyframes({ '0%, 100%': { opacity: 0.4 }, '50%': { opacity: 1 } });

const styles = stylex.create({
  base: {
    animationDuration: {
      default: '700ms',
      [media.reducedMotion]: '1200ms',
    },
    animationIterationCount: 'infinite',
    animationName: { default: spin, [media.reducedMotion]: pulse },
    animationPlayState: { default: 'running', '[data-paused]': 'paused' },
    animationTimingFunction: { default: 'linear', [media.reducedMotion]: 'ease-in-out' },
    // Square, line-height-free box so rotation pivots on the icon's true centre.
    alignItems: 'center',
    display: 'inline-flex',
    flexShrink: 0,
    justifyContent: 'center',
    lineHeight: 0,
    transformOrigin: '50% 50%',
    verticalAlign: 'middle',
  },
  box: (d: number) => ({ height: d, minHeight: d, minWidth: d, width: d }),
  svg: { display: 'block', flexShrink: 0 },
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
  const d = px[size];
  const sx = stylex.props(styles.base, styles.box(d), styles[tone], xstyle);
  const { ref: viewRef, inView } = useInView<HTMLSpanElement>({ once: false });
  return (
    <span
      role="status"
      aria-label={label}
      {...rest}
      data-paused={inView ? undefined : ''}
      ref={(n) => {
        viewRef(n);
        if (typeof ref === 'function') ref(n);
        else if (ref) ref.current = n;
      }}
      {...sx}
      className={[sx.className, className].filter(Boolean).join(' ')}
    >
      <svg {...stylex.props(styles.svg)} width={d} height={d} viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
