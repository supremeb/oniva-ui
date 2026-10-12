import * as stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import type { CSSProperties, HTMLAttributes, RefObject } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { mergeSx } from '../../internal/sx';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export const ACTIVE_SELECTOR =
  '[aria-selected="true"], [aria-current="page"], [aria-current="true"], [data-selected="true"], [data-selected]:not([data-selected="false"]), [data-active]';

export interface IndicatorRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface UseSlidingIndicatorOptions {
  /** Changes whenever the active item changes (key, index, value). Triggers a re-measure. */
  activeKey?: unknown;
  /** CSS selector for the active item inside the container. Default matches aria-selected/current/data-selected/data-active. */
  selector?: string;
}

/**
 * Measures the active item inside `containerRef` (must be `position: relative`) and returns its box
 * relative to the container. Re-measures on `activeKey` change and on container/item resize.
 * `isReady` flips after the first paint so the very first placement is not animated.
 */
export function useSlidingIndicator(
  containerRef: RefObject<HTMLElement | null>,
  { activeKey, selector = ACTIVE_SELECTOR }: UseSlidingIndicatorOptions = {},
) {
  const [rect, setRect] = useState<IndicatorRect | null>(null);
  const [isReady, setReady] = useState(false);

  const measure = useCallback(() => {
    const root = containerRef.current;
    const el = root?.querySelector<HTMLElement>(selector);
    if (!root || !el) return setRect(null);
    const next = { x: el.offsetLeft, y: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight };
    setRect((p) =>
      p && p.x === next.x && p.y === next.y && p.width === next.width && p.height === next.height ? p : next,
    );
  }, [containerRef, selector]);

  useIsoLayoutEffect(measure, [measure, activeKey]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    measure(); // refs attach after child layout effects on first mount
    const id = requestAnimationFrame(() => setReady(true));
    if (typeof ResizeObserver === 'undefined') return () => cancelAnimationFrame(id);
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    root.querySelectorAll<HTMLElement>('[role="tab"], [role="radio"], a, button').forEach((c) => ro.observe(c));
    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
    };
  }, [containerRef, measure]);

  return { rect, isReady };
}

const styles = stylex.create({
  base: {
    backgroundColor: colors['--oniva-color-surface-active'],
    borderRadius: radius['--oniva-radius-lg'],
    height: 'var(--oniva-indicator-h, 0px)',
    insetBlockStart: 0,
    insetInlineStart: 0,
    pointerEvents: 'none',
    position: 'absolute',
    transform: 'translate(var(--oniva-indicator-x, 0px), var(--oniva-indicator-y, 0px))',
    // Position uses transform; size transitions on an out-of-flow box (no sibling reflow).
    transitionDuration: { default: 0, '[data-ready]': motion['--oniva-motion-dur-slow'] },
    transitionProperty: 'transform, width, height, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-in-out'],
    width: 'var(--oniva-indicator-w, 0px)',
    zIndex: 0,
  },
});

export interface SlidingIndicatorProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'>,
    UseSlidingIndicatorOptions {
  /** The positioned (`position: relative`) element containing the items. */
  containerRef: RefObject<HTMLElement | null>;
  xstyle?: stylex.StyleXStyles;
}

/**
 * A single pill that glides to the active item (Tabs / Segmented / Sidebar). Render it as the first
 * child of the container; give items `position: relative; z-index: 1` so they sit above it.
 */
export function SlidingIndicator({ containerRef, activeKey, selector, className, xstyle, ...rest }: SlidingIndicatorProps) {
  const { rect, isReady } = useSlidingIndicator(containerRef, { activeKey, selector });
  const sx = stylex.props(styles.base, xstyle);
  // Measured offsets are physical (offsetLeft), so anchor physically: `inset-inline-start` would flip to the right in RTL.
  const anchor = { left: 0, right: 'auto' } as const;
  const vars = rect
    ? ({
        ...anchor,
        '--oniva-indicator-x': `${rect.x}px`,
        '--oniva-indicator-y': `${rect.y}px`,
        '--oniva-indicator-w': `${rect.width}px`,
        '--oniva-indicator-h': `${rect.height}px`,
      } as CSSProperties)
    : { ...anchor, opacity: 0 };
  const m = mergeSx(sx, className, vars);
  return <span aria-hidden="true" {...rest} data-ready={isReady && rect ? '' : undefined} {...m} />;
}
