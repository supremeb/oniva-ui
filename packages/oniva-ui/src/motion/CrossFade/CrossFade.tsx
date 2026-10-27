import * as stylex from '@stylexjs/stylex';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { AnimationEvent, CSSProperties, ElementType, HTMLAttributes, ReactNode, Ref } from 'react';
import { mergeRefs } from '../../internal/n3-hooks';
import { mergeSx } from '../../internal/sx';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { Presence } from '../Presence/Presence';

const swapIn = stylex.keyframes({
  from: { filter: 'blur(var(--oniva-cf-blur, 4px))', opacity: 0, transform: 'scale(0.98)' },
  to: { filter: 'blur(0)', opacity: 1, transform: 'scale(1)' },
});
const swapOut = stylex.keyframes({
  from: { filter: 'blur(0)', opacity: 1, transform: 'scale(1)' },
  to: { filter: 'blur(var(--oniva-cf-blur, 4px))', opacity: 0, transform: 'scale(1.02)' },
});

const styles = stylex.create({
  root: { display: 'grid' },
  layer: { gridArea: '1 / 1', minWidth: 0 },
  // keyed swap
  swap: { display: 'grid', position: 'relative' },
  swapMorph: {
    // Deliberate exception to "never animate size": the box itself glides so siblings follow. Opt-in via `morph`.
    overflow: 'clip',
    overflowClipMargin: 0,
    transitionDuration: 'var(--oniva-cf-dur, 250ms)',
    transitionProperty: { default: 'height, width', [media.reducedMotion]: 'none' },
    transitionTimingFunction: motion['--oniva-motion-ease-in-out'],
  },
  swapLayer: { display: 'block', gridArea: '1 / 1', minWidth: 0 },
  swapLayerMorph: { insetBlockStart: 0, insetInlineStart: 0, position: 'absolute' },
  swapFull: { width: '100%' },
  swapFit: { width: 'max-content' },
  entering: {
    animationDuration: 'var(--oniva-cf-dur, 250ms)',
    animationFillMode: 'backwards',
    animationName: { default: swapIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  leaving: {
    animationDuration: 'var(--oniva-cf-dur, 250ms)',
    animationFillMode: 'forwards',
    animationName: { default: swapOut, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: { default: null, [media.reducedMotion]: 'none' },
    pointerEvents: 'none',
    position: 'absolute',
    insetBlockStart: 0,
    insetInlineStart: 0,
    userSelect: 'none',
  },
});

export interface CrossFadeProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** Skeleton mode: while `true` the skeleton shows; flipping to `false` blur-fades content in and the skeleton out. */
  isLoading?: boolean;
  skeleton?: ReactNode;
  children?: ReactNode;
  /**
   * Swap mode: key of the current content. Changing it blur-fades the old content out and the new content in
   * (button labels, status text, tips). Takes precedence over `isLoading`. (Not `id`, which stays the DOM attribute.)
   */
  contentKey?: string | number;
  /** Swap mode: length of the swap and the size morph in ms. Default 250. */
  duration?: number;
  /** Swap mode: blur in px at the outer ends of the fade, capped at 4. Default 4. */
  blur?: number;
  /** Swap mode: which sides glide to the new content size. `both` makes the box as wide as its content. Default `none`. */
  morph?: 'none' | 'height' | 'both';
  /** Swap mode: root element, use `span` inside buttons and other inline content. Default `div`. */
  as?: 'div' | 'span';
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

/**
 * Skeleton → content handoff (both layers overlap in one grid cell during the 250ms/100ms crossfade), or with `contentKey`
 * a keyed content swap (`contentKey`) with a blur crossfade and an optional box-size glide. Reduced motion swaps instantly.
 */
export function CrossFade({
  isLoading = false,
  skeleton,
  children,
  contentKey,
  duration = 250,
  blur = 4,
  morph = 'none',
  as = 'div',
  className,
  xstyle,
  ref,
  ...rest
}: CrossFadeProps) {
  if (contentKey !== undefined) {
    return (
      <KeyedSwap contentKey={contentKey} duration={duration} blur={blur} morph={morph} as={as} className={className} xstyle={xstyle} ref={ref} {...rest}>
        {children}
      </KeyedSwap>
    );
  }
  const sx = stylex.props(styles.root, xstyle);
  return (
    <div {...rest} ref={ref as Ref<HTMLDivElement>} aria-busy={isLoading || undefined} {...mergeSx(sx, className)}>
      <Presence isPresent={isLoading} preset="fade" initial={false} xstyle={styles.layer}>
        {skeleton}
      </Presence>
      <Presence isPresent={!isLoading} preset="blur" initial={false} xstyle={styles.layer}>
        {children}
      </Presence>
    </div>
  );
}

type SwapProps = Required<Pick<CrossFadeProps, 'contentKey' | 'duration' | 'blur' | 'morph' | 'as'>> &
  Omit<CrossFadeProps, 'isLoading' | 'skeleton' | 'contentKey' | 'duration' | 'blur' | 'morph' | 'as'>;

function KeyedSwap({ contentKey: id, duration, blur, morph, as, children, className, xstyle, ref, ...rest }: SwapProps) {
  const Tag = as as ElementType;
  const [last, setLast] = useState<{ id: string | number; node: ReactNode }>({ id, node: children });
  const [leaving, setLeaving] = useState<{ id: string | number; node: ReactNode } | null>(null);
  const [swaps, setSwaps] = useState(0);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const curRef = useRef<HTMLElement>(null);

  // Derived state: when the id changes keep the previous content around as the single leaving layer.
  if (last.id !== id) {
    setLeaving(last);
    setLast({ id, node: children });
    setSwaps((n) => n + 1);
  } else if (last.node !== children) {
    setLast({ id, node: children });
  }

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => setLeaving(null), duration + 60);
    return () => clearTimeout(t);
  }, [leaving, duration]);

  useLayoutEffect(() => {
    if (morph === 'none') return;
    const el = curRef.current;
    if (!el) return;
    const measure = () => setSize((p) => (p && p.w === el.offsetWidth && p.h === el.offsetHeight ? p : { w: el.offsetWidth, h: el.offsetHeight }));
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [morph, id]);

  const morphing = morph !== 'none';
  const vars = { '--oniva-cf-dur': `${duration}ms`, '--oniva-cf-blur': `${Math.min(4, Math.max(0, blur))}px` } as CSSProperties;
  const box = morphing && size ? ({ height: size.h, ...(morph === 'both' && { width: size.w }) } as CSSProperties) : undefined;
  const sx = stylex.props(styles.swap, morphing && styles.swapMorph, xstyle);
  const layer = (extra: unknown[]) => stylex.props(styles.swapLayer, morphing && styles.swapLayerMorph, morphing && (morph === 'both' ? styles.swapFit : styles.swapFull), ...(extra as stylex.StyleXStyles[]));
  const cur = layer([swaps > 0 && styles.entering]);
  const out = layer([styles.leaving]);
  return (
    <Tag {...rest} ref={mergeRefs(ref)} data-swap="" {...mergeSx(sx, className, { ...vars, ...box })}>
      <span key={`c${id}`} ref={curRef} {...cur} style={{ display: 'block' }}>
        {children}
      </span>
      {leaving ? (
        <span
          key={`l${leaving.id}`}
          aria-hidden="true"
          inert
          {...out}
         
          onAnimationEnd={(e: AnimationEvent<HTMLElement>) => {
            if (e.target === e.currentTarget) setLeaving(null);
          }}
        >
          {leaving.node}
        </span>
      ) : null}
    </Tag>
  );
}
