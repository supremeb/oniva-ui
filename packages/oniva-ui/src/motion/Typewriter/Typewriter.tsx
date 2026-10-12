import { VisuallyHidden } from '../../components/VisuallyHidden/VisuallyHidden';
import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, Ref } from 'react';
import { useEffect, useState } from 'react';
import { useReducedMotion } from '../../internal/motion-hooks';
import { mergeRefs } from '../../internal/n3-hooks';
import { mergeSx } from '../../internal/sx';
import { media } from '../../tokens/media.stylex';
import { useInView } from '../InView/useInView';

const blink = stylex.keyframes({ '0%, 49%': { opacity: 1 }, '50%, 100%': { opacity: 0 } });

const styles = stylex.create({
  root: { display: 'inline-block' },
  caret: {
    animationDuration: '1000ms',
    animationIterationCount: 'infinite',
    animationName: { default: blink, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'steps(1)',
    display: 'inline-block',
    marginInlineStart: 1,
    width: '0.08em',
    height: '1em',
    backgroundColor: 'currentColor',
    verticalAlign: 'text-bottom',
  },
});

export interface TypewriterProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style' | 'children'> {
  text: string;
  /** Ms per character. Default `40`. */
  speed?: number;
  /** Show a blinking caret. Default `true`. */
  cursor?: boolean;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

/** Types text in once when scrolled into view. Screen readers get the full text immediately; reduced motion shows it all. */
export function Typewriter({ text, speed = 40, cursor = true, className, xstyle, ref, ...rest }: TypewriterProps) {
  const reduced = useReducedMotion();
  const { ref: viewRef, inView } = useInView<HTMLSpanElement>();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reduced || !inView) return;
    setN(0);
    const id = setInterval(() => setN((v) => (v >= text.length ? (clearInterval(id), v) : v + 1)), speed);
    return () => clearInterval(id);
  }, [reduced, inView, text, speed]);
  const shown = reduced ? text : text.slice(0, n);
  return (
    <span {...rest} ref={mergeRefs(viewRef, ref)} {...mergeSx(stylex.props(styles.root, xstyle), className)}>
      <VisuallyHidden>{text}</VisuallyHidden>
      <span aria-hidden="true">{shown}</span>
      {cursor ? <span aria-hidden="true" {...stylex.props(styles.caret)} /> : null}
    </span>
  );
}
