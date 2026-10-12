import * as stylex from '@stylexjs/stylex';
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import { accent } from '../tokens/accent.stylex';
import { media } from '../tokens/media.stylex';
import { radius } from '../tokens/radius.stylex';
import { mergeRefs } from './n3-hooks';
import { mergeSx } from './sx';
import { useInView } from '../motion/InView/useInView';

const spin = stylex.keyframes({
  from: { transform: 'translate(-50%, -50%) rotate(0deg)' },
  to: { transform: 'translate(-50%, -50%) rotate(360deg)' },
});

const styles = stylex.create({
  root: { borderRadius: radius['--oniva-radius-card'], position: 'relative' },
  ring: {
    borderRadius: 'inherit',
    inset: 0,
    maskComposite: 'exclude',
    overflow: 'hidden',
    padding: 'var(--ring-w, 1px)',
    pointerEvents: 'none',
    position: 'absolute',
    maskImage: 'linear-gradient(#000 0 0), linear-gradient(#000 0 0)',
    maskClip: 'content-box, border-box',
    WebkitMaskImage: 'linear-gradient(#000 0 0), linear-gradient(#000 0 0)',
  },
  spinner: {
    animationDuration: 'var(--ring-dur, 8s)',
    animationIterationCount: 'infinite',
    animationName: { default: spin, [media.reducedMotion]: 'none' },
    animationPlayState: { default: 'running', '[data-paused]': 'paused' },
    animationTimingFunction: 'linear',
    aspectRatio: '1',
    left: '50%',
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    width: '400%',
    willChange: { default: 'auto', ':hover': 'transform', ':focus-within': 'transform' },
  },
  beam: {
    backgroundImage: `conic-gradient(from 0deg, transparent 0deg, transparent 300deg, ${accent['--oniva-accent-400']} 335deg, ${accent['--oniva-accent-600']} 355deg, transparent 360deg)`,
  },
  shine: {
    backgroundImage: `conic-gradient(from 0deg, ${accent['--oniva-accent-400']}, ${accent['--oniva-accent-200']}, ${accent['--oniva-accent-600']}, ${accent['--oniva-accent-300']}, ${accent['--oniva-accent-400']})`,
  },
  content: { position: 'relative' },
});

export interface RingFrameProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Ring thickness in px. Default `1`. */
  borderWidth?: number;
  /** Seconds per revolution. */
  duration?: number;
  /** Turn the animation off (static ring). Default `true`. */
  isActive?: boolean;
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Shared by BorderBeam / ShineBorder: a masked ring with a rotating conic gradient (transform only). */
export function RingFrame({
  variant,
  borderWidth = 1,
  duration,
  isActive = true,
  className,
  xstyle,
  ref,
  children,
  ...rest
}: RingFrameProps & { variant: 'beam' | 'shine' }) {
  const { ref: viewRef, inView } = useInView<HTMLDivElement>({ once: false });
  const sx = stylex.props(styles.root, xstyle);
  const ringStyle = {
    '--ring-w': `${borderWidth}px`,
    '--ring-dur': `${duration ?? (variant === 'beam' ? 6 : 10)}s`,
  } as CSSProperties;
  return (
    <div {...rest} ref={mergeRefs(viewRef, ref)} {...mergeSx(sx, className)}>
      <span aria-hidden="true" {...stylex.props(styles.ring)} style={ringStyle}>
        <span
          data-paused={!inView || !isActive ? '' : undefined}
          {...stylex.props(styles.spinner, variant === 'beam' ? styles.beam : styles.shine)}
          style={{ animationName: isActive ? undefined : 'none' }}
        />
      </span>
      <div {...stylex.props(styles.content)}>{children}</div>
    </div>
  );
}
