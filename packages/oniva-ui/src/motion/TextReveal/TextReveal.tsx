import * as stylex from '@stylexjs/stylex';
import { createElement, useRef } from 'react';
import type { CSSProperties, HTMLAttributes, Ref } from 'react';
import { mergeRefs } from '../../internal/n3-hooks';
import { mergeSx } from '../../internal/sx';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { useInView } from '../InView/useInView';

const reveal = stylex.keyframes({
  from: { filter: 'blur(var(--oniva-reveal-blur, 2px))', opacity: 0, transform: 'translateY(var(--oniva-reveal-rise, 0px))' },
  to: { filter: 'blur(0)', opacity: 1, transform: 'translateY(0)' },
});

const styles = stylex.create({
  word: {
    animationDelay: 'var(--oniva-delay, 0ms)',
    animationDuration: `var(--oniva-reveal-dur, ${motion['--oniva-motion-dur-deliberate']})`,
    animationFillMode: 'backwards',
    animationName: { default: reveal, [media.reducedMotion]: 'none' },
    // eslint-disable-next-line @stylexjs/valid-styles -- paused until the text scrolls into view when `onView` is set
    animationPlayState: 'var(--oniva-reveal-play, running)',
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'inline-block',
    whiteSpace: 'pre',
  },
  // Letters of one word stay glued together so lines only ever wrap between words.
  group: { display: 'inline-block', whiteSpace: 'nowrap' },
  sr: {
    borderWidth: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
  },
  rel: { position: 'relative' },
});

export interface TextRevealProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style' | 'children'> {
  text: string;
  /** Delay between pieces in ms. Default 60. */
  staggerMs?: number;
  /** Cap on the delay of a batch of newly added pieces, in ms. Default 600. */
  maxDelayMs?: number;
  /** Reveal word by word or letter by letter. Default `word`. */
  by?: 'word' | 'char';
  /** How long each piece takes to arrive, in ms. Default is the `dur-deliberate` token (350ms). */
  durationMs?: number;
  /** Wait before the first piece, in ms. Default 0. */
  delayMs?: number;
  /** Each piece also rises a little (in `em`) as it leaves the blur. Default `0.3`; `0` is blur and fade only. */
  rise?: number;
  /** Hold the reveal until the text is 30% in view instead of playing on mount. Default `false`. */
  onView?: boolean;
  /** With `onView`: replay each time the text re-enters the view. Default `true` (play once). */
  once?: boolean;
  /** Element to render. Default `span`. */
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3';
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

const isSpace = (t: string) => /^\s+$/.test(t);

/**
 * Per-word (or per-letter) blur-in. Append-safe: pieces that already rendered keep their DOM node (keyed by index),
 * only new pieces animate, staggered from the batch start. `onView` holds the reveal until the text scrolls in;
 * letter mode exposes one visually-hidden copy of the sentence and hides the animated letters from assistive tech.
 * Reduced motion shows the text at once.
 */
export function TextReveal({
  text,
  staggerMs = 60,
  maxDelayMs = 600,
  by = 'word',
  durationMs,
  delayMs = 0,
  rise = 0.3,
  onView = false,
  once = true,
  as = 'span',
  className,
  xstyle,
  ref,
  ...rest
}: TextRevealProps) {
  const tokens = text.split(/(\s+)/).filter((w) => w.length > 0);
  const pieceCount = tokens.reduce((n, t) => n + (isSpace(t) ? 0 : by === 'char' ? [...t].length : 1), 0);
  // `base` = how many pieces the PREVIOUS text had. It only moves when the text length changes, so unrelated
  // re-renders (the in-view observer) never reset the delays of pieces that are mid-animation.
  const seen = useRef({ count: 0, base: 0 });
  if (seen.current.count !== pieceCount) seen.current = { count: pieceCount, base: seen.current.count };
  const base = seen.current.base;
  const { ref: viewRef, inView } = useInView<HTMLSpanElement>({ once, threshold: 0.3 });
  const held = onView && !inView;

  const word = stylex.props(styles.word);
  const group = stylex.props(styles.group);
  const sr = stylex.props(styles.sr);
  const delayFor = (pi: number) => `${delayMs + (pi >= base ? Math.min((pi - base) * staggerMs, maxDelayMs) : 0)}ms`;
  const pieceStyle = (pi: number) => ({ '--oniva-delay': delayFor(pi) }) as CSSProperties;

  let pi = 0;
  const kids = tokens.map((t, i) => {
    if (isSpace(t)) return <span key={i}>{t}</span>;
    if (by === 'word') {
      const n = pi++;
      return (
        <span key={i} className={word.className} style={pieceStyle(n)}>
          {t}
        </span>
      );
    }
    return (
      <span key={i} className={group.className}>
        {[...t].map((c, k) => (
          <span key={k} className={word.className} style={pieceStyle(pi++)}>
            {c}
          </span>
        ))}
      </span>
    );
  });

  const vars = {
    ...(durationMs != null && { '--oniva-reveal-dur': `${durationMs}ms` }),
    ...(rise ? { '--oniva-reveal-rise': `${rise}em` } : null),
    ...(held && { '--oniva-reveal-play': 'paused' }),
  } as CSSProperties;
  const sx = stylex.props(by === 'char' && styles.rel, xstyle);
  return createElement(
    as,
    {
      ...rest,
      ref: mergeRefs(viewRef, ref),
      'data-reveal': held ? 'held' : 'playing',
      ...mergeSx(sx, className, vars),
    } as Record<string, unknown>,
    by === 'char' ? (
      <>
        <span {...sr}>{text}</span>
        <span aria-hidden="true">{kids}</span>
      </>
    ) : (
      kids
    ),
  );
}
