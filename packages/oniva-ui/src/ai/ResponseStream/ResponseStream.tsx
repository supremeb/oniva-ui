import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import * as stylex from '@stylexjs/stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { mergeSx } from '../../internal/sx';
import { TextReveal } from '../../motion/TextReveal/TextReveal';

const srOnlyStyle = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: 1,
  margin: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
} as const;

const styles = stylex.create({
  root: {
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    lineHeight: font['--oniva-font-lh-16'],
    whiteSpace: 'pre-wrap',
  },
});

/** Progressively reveals `text`. Returns the visible prefix and whether it is complete. */
export function useResponseStream(
  text: string,
  { speed = 3, intervalMs = 24, instant = false, onComplete }: UseResponseStreamOptions = {},
) {
  const reduced =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const skip = instant || reduced;
  const [count, setCount] = useState(skip ? text.length : 0);
  const done = useRef(onComplete);
  useEffect(() => {
    done.current = onComplete;
  });
  const finished = skip || count >= text.length;

  useEffect(() => {
    if (skip) return;
    if (count >= text.length) return;
    const id = setTimeout(() => setCount((c) => Math.min(text.length, c + speed)), intervalMs);
    return () => clearTimeout(id);
  }, [count, text, speed, intervalMs, skip]);

  useEffect(() => {
    if (finished) done.current?.();
  }, [finished]);

  const visible = skip ? text : text.slice(0, count);
  return { visible, isComplete: finished };
}

export interface UseResponseStreamOptions {
  /** Characters revealed per tick. */
  speed?: number;
  intervalMs?: number;
  /** Show everything immediately. */
  instant?: boolean;
  onComplete?: () => void;
}

export interface ResponseStreamProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children'>, UseResponseStreamOptions {
  text: string;
  /** Custom renderer for the visible text, e.g. `(t) => <Markdown>{t}</Markdown>`. */
  render?: (visible: string, isComplete: boolean) => ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Token-by-token streaming text effect. Respects reduced motion by showing the full text. */
export function ResponseStream({
  text,
  speed,
  intervalMs,
  instant,
  onComplete,
  render,
  className,
  xstyle,
  ref,
  ...rest
}: ResponseStreamProps) {
  const { visible, isComplete } = useResponseStream(text, {
    speed,
    intervalMs,
    instant,
    onComplete,
  });
  const sx = stylex.props(styles.root, xstyle);
  return (
    <div {...rest} ref={ref} aria-busy={!isComplete} {...mergeSx(sx, className)}>
      <div aria-hidden={isComplete ? undefined : true}>
        {render ? render(visible, isComplete) : <TextReveal text={visible} staggerMs={30} maxDelayMs={240} />}
      </div>
      <span role="status" style={srOnlyStyle}>
        {isComplete ? 'Response complete' : 'Generating response…'}
      </span>
    </div>
  );
}
