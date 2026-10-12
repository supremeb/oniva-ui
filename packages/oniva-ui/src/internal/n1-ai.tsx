import * as stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { media } from '../tokens/media.stylex';
import { motion } from '../tokens/motion.stylex';

/** Copy-to-clipboard with a transient `copied` flag (resets after `resetMs`). */
export function useCopy(text: string, resetMs = 1600) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = useCallback(() => {
    void Promise.resolve(navigator.clipboard?.writeText(text)).catch(() => {});
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), resetMs);
  }, [text, resetMs]);
  return { copied, copy };
}

const swap = stylex.create({
  root: { display: 'inline-grid', placeItems: 'center' },
  layer: {
    display: 'inline-flex',
    filter: { default: 'blur(0)', '[data-hidden]': 'blur(3px)' },
    gridArea: '1 / 1',
    opacity: { default: 1, '[data-hidden]': 0 },
    transform: {
      default: 'scale(1)',
      '[data-hidden]': { default: 'scale(0.25)', [media.reducedMotion]: 'scale(1)' },
    },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'opacity, transform, filter',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
});

/** Cross-swaps two icons (scale .25 to 1 + opacity + blur 3px, 150ms). Decorative: aria-hidden. */
export function IconSwap({ on, a, b }: { on: boolean; a: ReactNode; b: ReactNode }) {
  return (
    <span aria-hidden="true" {...stylex.props(swap.root)}>
      <span data-hidden={on ? '' : undefined} {...stylex.props(swap.layer)}>
        {a}
      </span>
      <span data-hidden={on ? undefined : ''} {...stylex.props(swap.layer)}>
        {b}
      </span>
    </span>
  );
}

/** Seconds elapsed while `running`; keeps the last value once it stops. */
export function useElapsed(running: boolean) {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    if (!running) return;
    const start = Date.now();
    const id = setInterval(() => setSecs(Math.max(1, Math.round((Date.now() - start) / 1000))), 500);
    return () => clearInterval(id);
  }, [running]);
  return secs;
}
