import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, Ref } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../internal/motion-hooks';
import { mergeRefs } from '../../internal/n3-hooks';
import { mergeSx } from '../../internal/sx';
import { media } from '../../tokens/media.stylex';
import { useInView } from '../InView/useInView';

const EASE = 'cubic-bezier(0.77, 0, 0.175, 1)';

const styles = stylex.create({
  // All words share one grid cell so the box is always as wide as the longest word (no layout shift).
  root: { display: 'inline-grid', verticalAlign: 'bottom' },
  word: {
    filter: { default: 'blur(2px)', '[data-state="current"]': 'blur(0)' },
    gridArea: '1 / 1',
    opacity: { default: 0, '[data-state="current"]': 1 },
    transform: {
      default: 'translateY(0.4em)',
      '[data-state="current"]': 'translateY(0)',
      '[data-state="leaving"]': 'translateY(-0.4em)',
      [media.reducedMotion]: 'none',
    },
    transitionDuration: '250ms',
    transitionProperty: 'opacity, transform, filter',
    transitionTimingFunction: EASE,
    whiteSpace: 'nowrap',
  },
});

export interface WordRotateProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style' | 'children'> {
  words: string[];
  /** Ms each word stays. Default `2400`. */
  interval?: number;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

/** Vertical word swap (translateY + blur 2px + fade, 250ms). Rotation pauses offscreen and when hovered; reduced motion shows the first word. */
export function WordRotate({ words, interval = 2400, className, xstyle, ref, onPointerEnter, onPointerLeave, ...rest }: WordRotateProps) {
  const reduced = useReducedMotion();
  const { ref: viewRef, inView } = useInView<HTMLSpanElement>({ once: false });
  const [idx, setIdx] = useState(0);
  const [prev, setPrev] = useState(-1);
  const [held, setHeld] = useState(false);
  const cur = useRef(0);
  cur.current = idx;

  useEffect(() => {
    if (reduced || !inView || held || words.length < 2) return;
    const id = setInterval(() => {
      setPrev(cur.current);
      setIdx((cur.current + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [reduced, inView, held, words.length, interval]);

  const shown = reduced ? 0 : idx;
  return (
    <span
      {...rest}
      ref={mergeRefs(viewRef, ref)}
      onPointerEnter={(e) => {
        setHeld(true);
        onPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        setHeld(false);
        onPointerLeave?.(e);
      }}
      {...mergeSx(stylex.props(styles.root, xstyle), className)}
    >
      {words.map((w, i) => (
        <span key={w + i} aria-hidden={i === shown ? undefined : true} data-state={i === shown ? 'current' : i === prev ? 'leaving' : 'idle'} {...stylex.props(styles.word)}>
          {w}
        </span>
      ))}
    </span>
  );
}
