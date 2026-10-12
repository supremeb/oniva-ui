import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState, type HTMLAttributes, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { mergeSx } from '../../internal/sx';
import { TextShimmer } from '../TextShimmer';

const inK = stylex.keyframes({
  from: { filter: 'blur(2px)', opacity: 0, transform: 'translateY(8px)' },
  to: { filter: 'blur(0)', opacity: 1, transform: 'translateY(0)' },
});
const outK = stylex.keyframes({
  from: { filter: 'blur(0)', opacity: 1, transform: 'translateY(0)' },
  to: { filter: 'blur(2px)', opacity: 0, transform: 'translateY(-8px)' },
});
const fadeIn = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const fadeOut = stylex.keyframes({ from: { opacity: 1 }, to: { opacity: 0 } });

const styles = stylex.create({
  root: {
    color: colors['--oniva-color-text-muted'],
    display: 'inline-grid',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    lineHeight: font['--oniva-font-lh-20'],
    overflow: 'hidden',
  },
  layer: { gridArea: '1 / 1', whiteSpace: 'nowrap' },
  enter: {
    animationDuration: motion['--oniva-motion-dur-base'],
    animationFillMode: 'both',
    animationName: { default: inK, [media.reducedMotion]: fadeIn },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  exit: {
    animationDuration: motion['--oniva-motion-dur-base'],
    animationFillMode: 'both',
    animationName: { default: outK, [media.reducedMotion]: fadeOut },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    pointerEvents: 'none',
  },
});

export interface ThinkingStatesProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  /** Status lines to cycle through. The last one holds. */
  messages: string[];
  /** How long each line is shown before swapping. Default 2000ms. */
  holdMs?: number;
  /** Loop back to the first message after the last. Default false. */
  loop?: boolean;
  /** Pause cycling (e.g. once the answer arrives). */
  paused?: boolean;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Rotating agent status line. Each line holds 2s, then swaps (150ms, 8px rise + 2px blur). */
export function ThinkingStates({ messages, holdMs = 2000, loop = false, paused = false, className, xstyle, ref, ...rest }: ThinkingStatesProps) {
  const [idx, setIdx] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const clear = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (paused || messages.length < 2) return;
    if (!loop && idx >= messages.length - 1) return;
    const id = setTimeout(() => {
      setPrev(idx);
      setIdx((idx + 1) % messages.length);
      clearTimeout(clear.current);
      clear.current = setTimeout(() => setPrev(null), 180);
    }, holdMs);
    return () => clearTimeout(id);
  }, [idx, holdMs, loop, paused, messages.length]);
  useEffect(() => () => clearTimeout(clear.current), []);

  const sx = stylex.props(styles.root, xstyle);
  return (
    <div {...rest} ref={ref} role="status" {...mergeSx(sx, className)}>
      {prev !== null && messages[prev] !== undefined && (
        <span key={`out-${prev}`} aria-hidden="true" {...stylex.props(styles.layer, styles.exit)}>
          {messages[prev]}
        </span>
      )}
      <span key={`in-${idx}`} {...stylex.props(styles.layer, prev !== null && styles.enter)}>
        <TextShimmer>{messages[idx]}</TextShimmer>
      </span>
    </div>
  );
}
