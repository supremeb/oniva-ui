import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef } from 'react';
import type { CSSProperties, HTMLAttributes, Ref } from 'react';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { mergeSx } from '../../internal/sx';

const reveal = stylex.keyframes({
  from: { filter: 'blur(2px)', opacity: 0 },
  to: { filter: 'blur(0)', opacity: 1 },
});

const styles = stylex.create({
  word: {
    animationDelay: 'var(--oniva-delay, 0ms)',
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: reveal, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'inline-block',
    whiteSpace: 'pre',
  },
});

export interface TextRevealProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style' | 'children'> {
  text: string;
  /** Delay between words in ms. Default 60. */
  staggerMs?: number;
  /** Cap on the delay of a batch of newly added words, in ms. Default 600. */
  maxDelayMs?: number;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

/**
 * Per-word blur-in (350ms, 60ms stagger) for streamed text. Append-safe: words that already
 * rendered keep their DOM node (keyed by index), only new words animate, staggered from the batch start.
 */
export function TextReveal({ text, staggerMs = 60, maxDelayMs = 600, className, xstyle, ref, ...rest }: TextRevealProps) {
  const tokens = text.split(/(\s+)/).filter((w) => w.length > 0);
  const wordCount = tokens.filter((w) => !/^\s+$/.test(w)).length;
  const seen = useRef(0);
  const base = seen.current;
  useEffect(() => {
    seen.current = wordCount;
  });
  const sx = stylex.props(xstyle);
  const word = stylex.props(styles.word);
  return (
    <span {...rest} ref={ref} {...mergeSx(sx, className)}>
      {tokens.map((w, i) => {
        if (/^\s+$/.test(w)) return <span key={i}>{w}</span>;
        const wi = tokens.slice(0, i).filter((t) => !/^\s+$/.test(t)).length;
        return (
          <span
            key={i}
            className={word.className}
            style={{ '--oniva-delay': `${wi >= base ? Math.min((wi - base) * staggerMs, maxDelayMs) : 0}ms` } as CSSProperties}
          >
            {w}
          </span>
        );
      })}
    </span>
  );
}
