import * as stylex from '@stylexjs/stylex';
import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react';
import { media } from '../tokens/media.stylex';
import { motion } from '../tokens/motion.stylex';
import { mergeSx } from './sx';

/**
 * Loop 5 / M2 shared control-motion helpers (error shake, attribute watcher, hover pill).
 * Dynamic geometry goes through CSS custom properties consumed by static StyleX rules.
 */

/** Bumps a counter whenever `attr` changes anywhere under `ref` (used to re-measure sliding pills). */
export function useAttrKey(ref: RefObject<HTMLElement | null>, attr: string): number {
  const [key, setKey] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof MutationObserver === 'undefined') return;
    const mo = new MutationObserver(() => setKey((k) => k + 1));
    mo.observe(el, { attributes: true, attributeFilter: [attr], subtree: true, childList: true });
    return () => mo.disconnect();
  }, [ref, attr]);
  return key;
}

const shake = stylex.keyframes({
  '0%': { transform: 'translateX(0)' },
  '25%': { transform: 'translateX(-6px)' },
  '50%': { transform: 'translateX(5px)' },
  '75%': { transform: 'translateX(-3px)' },
  '100%': { transform: 'translateX(0)' },
});

export const shakeStyles = stylex.create({
  /** One-shot 300ms horizontal shake; reduced motion: no movement (border colour carries the error). */
  shake: {
    animationDuration: '300ms',
    animationFillMode: 'none',
    animationName: { default: shake, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
});

/**
 * Returns a `shakeKey` that increments each time `isInvalid` flips true (or the invalid message
 * changes while invalid). Apply `data-shake` + a keyed remount-free restart via `useShake`.
 */
export function useShake(isInvalid: boolean | undefined): { shaking: boolean; onAnimationEnd: () => void } {
  const [shaking, setShaking] = useState(false);
  useEffect(() => {
    if (!isInvalid) return;
    setShaking(false);
    const id = requestAnimationFrame(() => setShaking(true)); // restart the animation if already running
    return () => cancelAnimationFrame(id);
  }, [isInvalid]);
  return { shaking: shaking && !!isInvalid, onAnimationEnd: () => setShaking(false) };
}

const hover = stylex.create({
  pill: {
    height: 'var(--oniva-hp-h, 0px)',
    insetBlockStart: 0,
    insetInlineStart: 0,
    opacity: { default: 0, '[data-visible]': 1 },
    pointerEvents: 'none',
    position: 'absolute',
    transform: 'translate(var(--oniva-hp-x, 0px), var(--oniva-hp-y, 0px))',
    transitionDuration: { default: 0, '[data-ready]': motion['--oniva-motion-dur-press'] },
    transitionProperty: 'transform, width, height, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: 'var(--oniva-hp-w, 0px)',
    zIndex: 0,
  },
});

export interface HoverPillProps {
  containerRef: RefObject<HTMLElement | null>;
  /** CSS selector for hoverable items inside the container. */
  itemSelector: string;
  /** Items matching this selector (e.g. the active page) do not get the hover pill. */
  skipSelector?: string;
  xstyle?: stylex.StyleXStyles;
}

/** A single pill that follows the pointer between items (mouse/pen only; hidden on leave). */
export function HoverPill({ containerRef, itemSelector, skipSelector, xstyle }: HoverPillProps) {
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const over = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const item = (e.target as HTMLElement | null)?.closest<HTMLElement>(itemSelector);
      if (!item || !root.contains(item) || (skipSelector && item.matches(skipSelector))) {
        setReady(false);
        return setRect(null);
      }
      setRect({ x: item.offsetLeft, y: item.offsetTop, w: item.offsetWidth, h: item.offsetHeight });
    };
    const leave = () => {
      setReady(false); // next entry fades in place instead of sliding from the old spot
      setRect(null);
    };
    root.addEventListener('pointermove', over);
    root.addEventListener('pointerleave', leave);
    return () => {
      root.removeEventListener('pointermove', over);
      root.removeEventListener('pointerleave', leave);
    };
  }, [containerRef, itemSelector, skipSelector]);
  // Arm slide transitions one frame after the pill first appears.
  useEffect(() => {
    if (!rect || ready) return;
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, [rect, ready]);
  const sx = stylex.props(hover.pill, xstyle);
  const vars = rect
    ? ({
        '--oniva-hp-x': `${rect.x}px`,
        '--oniva-hp-y': `${rect.y}px`,
        '--oniva-hp-w': `${rect.w}px`,
        '--oniva-hp-h': `${rect.h}px`,
      } as CSSProperties)
    : undefined;
  return (
    <span
      aria-hidden="true"
      data-visible={rect ? '' : undefined}
      data-ready={ready ? '' : undefined}
      {...mergeSx(sx, undefined, vars)}
    />
  );
}

type StyleArg = false | null | undefined | Readonly<Record<string, unknown>>;

/**
 * A div that plays the error shake once (300ms) when `isInvalid` flips true. Pass the StyleX styles
 * as an array; reduced motion removes the movement (the red border still shows the error).
 */
export function ShakeDiv({
  isInvalid,
  styles,
  children,
}: {
  isInvalid: boolean;
  styles: StyleArg[];
  children?: ReactNode;
}) {
  const { shaking, onAnimationEnd } = useShake(isInvalid);
  return (
    <div
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) onAnimationEnd();
      }}
      {...(stylex.props as (...a: unknown[]) => ReturnType<typeof stylex.props>)(...styles, shaking && shakeStyles.shake)}
    >
      {children}
    </div>
  );
}
