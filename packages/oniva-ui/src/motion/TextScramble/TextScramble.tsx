import { VisuallyHidden } from '../../components/VisuallyHidden/VisuallyHidden';
import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, Ref } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../internal/motion-hooks';
import { mergeRefs } from '../../internal/n3-hooks';
import { mergeSx } from '../../internal/sx';
import { font } from '../../tokens/font.stylex';
import { useInView } from '../InView/useInView';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>';

const styles = stylex.create({
  root: { display: 'inline-block', fontFamily: font['--oniva-font-mono'], whiteSpace: 'pre' },
});

export interface TextScrambleProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style' | 'children'> {
  text: string;
  /** `'inView'` plays once on scroll-in, `'hover'` replays on pointer enter, `'mount'` plays immediately. Default `'inView'`. */
  trigger?: 'inView' | 'hover' | 'mount';
  /** Total ms until fully settled. Default `800`. */
  duration?: number;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

/** Random glyph cycle that settles left to right (40ms ticks). Screen readers get the final text; reduced motion shows it immediately. */
export function TextScramble({ text, trigger = 'inView', duration = 800, className, xstyle, ref, onPointerEnter, ...rest }: TextScrambleProps) {
  const reduced = useReducedMotion();
  const { ref: viewRef, inView } = useInView<HTMLSpanElement>();
  const [out, setOut] = useState(text);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const play = useCallback(() => {
    clearInterval(timer.current);
    if (reduced) return setOut(text);
    const start = performance.now();
    const tick = () => {
      const p = Math.min(1, (performance.now() - start) / duration);
      const settled = Math.floor(p * text.length);
      setOut(
        Array.from(text, (c, i) => (c === ' ' || i < settled ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join(''),
      );
      if (p >= 1) clearInterval(timer.current);
    };
    tick();
    timer.current = setInterval(tick, 40);
  }, [text, duration, reduced]);

  useEffect(() => {
    if (trigger === 'mount' || (trigger === 'inView' && inView)) play();
    else if (trigger === 'hover') setOut(text);
    return () => clearInterval(timer.current);
  }, [trigger, inView, play, text]);

  return (
    <span
      {...rest}
      ref={mergeRefs(viewRef, ref)}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        if (trigger === 'hover') play();
      }}
      {...mergeSx(stylex.props(styles.root, xstyle), className)}
    >
      <VisuallyHidden>{text}</VisuallyHidden>
      <span aria-hidden="true">{out}</span>
    </span>
  );
}
