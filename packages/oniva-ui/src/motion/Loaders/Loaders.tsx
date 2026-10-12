import * as stylex from '@stylexjs/stylex';
import type { CSSProperties, HTMLAttributes, Ref } from 'react';
import { mergeRefs } from '../../internal/n3-hooks';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { media } from '../../tokens/media.stylex';
import { useInView } from '../InView/useInView';

const pulse = stylex.keyframes({
  '0%, 100%': { opacity: 0.35, transform: 'scale(0.7)' },
  '50%': { opacity: 1, transform: 'scale(1)' },
});
const bars = stylex.keyframes({
  '0%, 100%': { transform: 'scaleY(0.3)' },
  '50%': { transform: 'scaleY(1)' },
});
const wave = stylex.keyframes({
  '0%, 100%': { opacity: 0.15 },
  '50%': { opacity: 1 },
});
const orbit = stylex.keyframes({ from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } });
const hop = stylex.keyframes({
  '0%, 60%, 100%': { opacity: 0.4, transform: 'translateY(0)' },
  '30%': { opacity: 1, transform: 'translateY(-4px)' },
});

const loop = {
  animationIterationCount: 'infinite',
  animationPlayState: { default: 'running', '[data-paused]': 'paused' },
} as const;

const styles = stylex.create({
  root: { alignItems: 'center', color: colors['--oniva-color-text'], display: 'inline-flex', justifyContent: 'center' },
  // dots
  dots: { gap: '0.25em' },
  dot: {
    ...loop,
    animationDuration: '1000ms',
    animationName: { default: pulse, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
    backgroundColor: 'currentColor',
    borderRadius: '50%',
    height: '0.4em',
    width: '0.4em',
  },
  // bars
  bars: { alignItems: 'center', gap: '0.15em', height: '1em' },
  bar: {
    ...loop,
    animationDuration: '900ms',
    animationName: { default: bars, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
    backgroundColor: 'currentColor',
    borderRadius: '0.1em',
    height: '1em',
    transformOrigin: 'center',
    width: '0.2em',
  },
  // matrix
  matrix: { display: 'inline-grid', gap: '0.15em', gridTemplateColumns: 'repeat(3, 0.3em)' },
  cell: {
    ...loop,
    animationDuration: '1200ms',
    animationName: { default: wave, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
    backgroundColor: 'currentColor',
    borderRadius: '0.06em',
    height: '0.3em',
    opacity: { default: null, [media.reducedMotion]: 0.6 },
    width: '0.3em',
  },
  // comet
  comet: {
    ...loop,
    animationDuration: '900ms',
    animationName: { default: orbit, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
    backgroundImage: 'conic-gradient(from 0deg, transparent 0deg, currentColor 330deg, transparent 360deg)',
    borderRadius: '50%',
    height: '1.25em',
    maskImage: 'radial-gradient(farthest-side, transparent calc(100% - 0.16em), #000 calc(100% - 0.16em))',
    WebkitMaskImage: 'radial-gradient(farthest-side, transparent calc(100% - 0.16em), #000 calc(100% - 0.16em))',
    width: '1.25em',
  },
  // typing
  typing: { gap: '0.2em' },
  key: {
    ...loop,
    animationDuration: '1200ms',
    animationName: { default: hop, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
    backgroundColor: colors['--oniva-color-text-muted'],
    borderRadius: '50%',
    height: '0.4em',
    width: '0.4em',
  },
});

export type LoaderVariant = 'dots' | 'bars' | 'matrix' | 'comet' | 'typing';

export interface LoaderProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  variant?: LoaderVariant;
  /** Font-size based scale (em units inside). Default `16`. */
  size?: number;
  /** Accessible label. Default `Loading`. */
  label?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

const COUNT: Record<LoaderVariant, number> = { dots: 3, bars: 4, matrix: 9, comet: 0, typing: 3 };
const STEP: Record<LoaderVariant, number> = { dots: 150, bars: 120, matrix: 110, comet: 0, typing: 160 };

/** Pure-CSS loaders (dots, bars, matrix, comet, typing). Transform/opacity only; pause offscreen; static under reduced motion. */
export function Loader({ variant = 'dots', size = 16, label = 'Loading', className, xstyle, ref, ...rest }: LoaderProps) {
  const { ref: viewRef, inView } = useInView<HTMLSpanElement>({ once: false });
  const paused = inView ? undefined : '';
  const sx = stylex.props(styles.root, variant === 'dots' && styles.dots, variant === 'bars' && styles.bars, variant === 'matrix' && styles.matrix, variant === 'typing' && styles.typing, xstyle);
  const part = variant === 'dots' ? styles.dot : variant === 'bars' ? styles.bar : variant === 'matrix' ? styles.cell : styles.key;
  return (
    <span role="status" aria-label={label} {...rest} ref={mergeRefs(viewRef, ref)} data-variant={variant} {...mergeSx(sx, className, { fontSize: size } as CSSProperties)}>
      {variant === 'comet' ? (
        <span aria-hidden="true" data-paused={paused} {...stylex.props(styles.comet)} />
      ) : (
        Array.from({ length: COUNT[variant] }, (_, i) => (
          <span key={i} aria-hidden="true" data-paused={paused} {...stylex.props(part)} style={{ animationDelay: variant === 'matrix' ? `${((i % 3) + Math.floor(i / 3)) * STEP.matrix}ms` : `${i * STEP[variant]}ms` }} />
        ))
      )}
    </span>
  );
}
