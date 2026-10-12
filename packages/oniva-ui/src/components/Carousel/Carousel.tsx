import * as stylex from '@stylexjs/stylex';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Children, useCallback, useEffect, useId, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { IconButton } from '../IconButton';
import { dash } from '../../internal/dash-styles';
import { focus } from '../../internal/focus';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  root: { display: 'flex', flexDirection: 'column', gap: 12, position: 'relative' },
  viewport: {
    borderRadius: radius['--oniva-radius-xl'],
    display: 'flex',
    overflowX: 'auto',
    overscrollBehaviorX: 'contain',
    scrollBehavior: { default: 'smooth', [media.reducedMotion]: 'auto' },
    scrollbarWidth: 'none',
    scrollSnapType: 'x mandatory',
  },
  slide: { boxSizing: 'border-box', flex: '0 0 100%', minWidth: 0, scrollSnapAlign: 'start' },
  controls: { alignItems: 'center', display: 'flex', gap: 8, justifyContent: 'center' },
  dots: { alignItems: 'center', display: 'flex', gap: 2 },
  dotHit: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderRadius: radius['--oniva-radius-full'],
    borderWidth: 0,
    cursor: 'pointer',
    display: 'inline-flex',
    height: 24,
    justifyContent: 'center',
    padding: 0,
    width: 24,
  },
  dot: {
    backgroundColor: colors['--oniva-color-icon-subtle'],
    borderRadius: radius['--oniva-radius-full'],
    height: 8,
    transform: 'scale(1)',
    transitionDuration: motion['--oniva-motion-dur-fast'],
    transitionProperty: 'background-color, transform',
    width: 8,
  },
  dotActive: { backgroundColor: colors['--oniva-color-accent-soft-fg'], transform: 'scale(1.25)' },
});

export interface CarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children' | 'onChange'> {
  /** Required accessible name, e.g. "Featured integrations". */
  'aria-label': string;
  children: ReactNode;
  /** Autoplay interval in ms. Off by default and always off with reduced motion. Pauses on hover and focus. */
  autoPlay?: number;
  loop?: boolean;
  onIndexChange?: (index: number) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function Carousel({ children, autoPlay, loop = true, onIndexChange, className, xstyle, ref, ...rest }: CarouselProps) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [hold, setHold] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const viewport = useRef<HTMLDivElement>(null);
  const id = useId();

  const goTo = useCallback(
    (i: number) => {
      const el = viewport.current;
      if (!el || !count) return;
      const next = loop ? (i + count) % count : Math.min(Math.max(i, 0), count - 1);
      el.scrollTo?.({ left: next * el.clientWidth });
      setIndex(next);
      onIndexChange?.(next);
    },
    [count, loop, onIndexChange],
  );

  const onScroll = () => {
    const el = viewport.current;
    if (!el || !el.clientWidth) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) {
      setIndex(i);
      onIndexChange?.(i);
    }
  };

  const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const playing = !!autoPlay && !reduce && !userPaused && !hold;
  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => goTo(index + 1), autoPlay);
    return () => clearInterval(t);
  }, [playing, autoPlay, goTo, index]);

  const sx = stylex.props(dash.root, styles.root, xstyle);
  return (
    <div
      role="region"
      aria-roledescription="carousel"
      {...rest}
      ref={ref}
      {...mergeSx(sx, className)}
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setHold(false);
      }}
    >
      <div
        ref={viewport}
        id={`${id}-vp`}
        role="group"
        aria-label={rest['aria-label'] ? `${rest['aria-label']} slides` : 'Slides'}
        tabIndex={0}
        aria-live={playing ? 'off' : 'polite'}
        onScroll={onScroll}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault();
            goTo(index + 1);
          }
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goTo(index - 1);
          }
        }}
        {...stylex.props(styles.viewport, focus.ring)}
      >
        {slides.map((s, i) => (
          <div key={i} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${count}`} inert={i !== index || undefined} {...stylex.props(styles.slide)}>
            {s}
          </div>
        ))}
      </div>
      <div {...stylex.props(styles.controls)}>
        <IconButton variant="secondary" size="sm" aria-label="Previous slide" aria-controls={`${id}-vp`} isDisabled={!loop && index === 0} onPress={() => goTo(index - 1)}>
          <ChevronLeft size={16} aria-hidden="true" />
        </IconButton>
        <div {...stylex.props(styles.dots)}>
          {slides.map((_, i) => (
            <button key={i} type="button" aria-label={`Go to slide ${i + 1}`} aria-current={i === index ? 'true' : undefined} onClick={() => goTo(i)} {...stylex.props(styles.dotHit, focus.ring)}>
              <span aria-hidden="true" {...stylex.props(styles.dot, i === index && styles.dotActive)} />
            </button>
          ))}
        </div>
        <IconButton variant="secondary" size="sm" aria-label="Next slide" aria-controls={`${id}-vp`} isDisabled={!loop && index === count - 1} onPress={() => goTo(index + 1)}>
          <ChevronRight size={16} aria-hidden="true" />
        </IconButton>
        {!!autoPlay && !reduce && (
          <IconButton variant="ghost" size="sm" aria-label={userPaused ? 'Start autoplay' : 'Pause autoplay'} onPress={() => setUserPaused((p) => !p)}>
            {userPaused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
          </IconButton>
        )}
      </div>
    </div>
  );
}
