import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { prefersReducedMotion } from './motion-hooks';
import { colors } from '../tokens/colors.stylex';
import { motion } from '../tokens/motion.stylex';
import { radius } from '../tokens/radius.stylex';

const styles = stylex.create({
  surface: { overflow: 'hidden', position: 'relative' },
  pill: {
    backgroundColor: colors['--oniva-color-surface-inset-hover'],
    borderRadius: radius['--oniva-radius-md'],
    height: 'var(--oniva-glide-h, 0px)',
    left: 0,
    opacity: { default: 0, '[data-on]': 1 },
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    transform: 'translate(var(--oniva-glide-x, 0px), var(--oniva-glide-y, 0px))',
    transitionDuration: {
      default: motion['--oniva-motion-dur-base'],
      '[data-instant]': '0s',
    },
    transitionProperty: 'transform, height, width, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-in-out'],
    width: 'var(--oniva-glide-w, 0px)',
    zIndex: 0,
  },
});

// The glide pill replaces the item's own focus/hover fill (items stay above it).
const OVERRIDE =
  '[data-oniva-glide] [data-focused="true"],[data-oniva-glide] [data-hovered="true"]{background-color:transparent !important}[data-oniva-glide] [role="option"],[data-oniva-glide] [role="menuitem"]{position:relative;z-index:1}';

const OVERRIDE_SEL =
  '[data-oniva-glide] [role="option"][data-selected="true"]{background-color:transparent !important}[data-oniva-glide] [role="option"]{position:relative;z-index:1}';

/**
 * Wraps a RAC ListBox / Menu. A single gray pill glides to the focused (else hovered) row, also across
 * groups. The pill is clipped to the surface and follows scrolling instantly.
 */
export function GlideSurface({
  children,
  className,
  track = 'focus',
}: {
  children: ReactNode;
  className?: string;
  track?: 'focus' | 'selected';
}) {
  const root = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const r = root.current;
    const p = pill.current;
    if (!r || !p) return;
    let raf = 0;
    let had = false;
    // Input modality: keyboard highlight moves are instant (high-frequency), pointer moves glide.
    let keyboard = false;
    const onKey = () => (keyboard = true);
    const onPtr = () => (keyboard = false);
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('pointermove', onPtr, true);
    document.addEventListener('pointerdown', onPtr, true);
    const place = (instant: boolean) => {
      const t =
        track === 'selected'
          ? r.querySelector<HTMLElement>('[role="option"][data-selected="true"]')
          : (r.querySelector<HTMLElement>('[data-focused="true"]') ??
            r.querySelector<HTMLElement>('[data-hovered="true"]'));
      if (!t) {
        had = false;
        p.removeAttribute('data-on');
        return;
      }
      const rr = r.getBoundingClientRect();
      const tr = t.getBoundingClientRect();
      const snap = instant || !had || keyboard;
      if (snap) p.setAttribute('data-instant', '');
      p.style.setProperty('--oniva-glide-x', `${tr.left - rr.left}px`);
      p.style.setProperty('--oniva-glide-y', `${tr.top - rr.top}px`);
      p.style.setProperty('--oniva-glide-w', `${tr.width}px`);
      p.style.setProperty('--oniva-glide-h', `${tr.height}px`);
      p.setAttribute('data-on', '');
      if (snap) {
        void p.offsetWidth;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => p.removeAttribute('data-instant'));
      }
      had = true;
    };
    const mo = new MutationObserver(() => place(false));
    mo.observe(r, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['data-focused', 'data-hovered', 'data-selected'],
    });
    const onScroll = () => place(true);
    r.addEventListener('scroll', onScroll, true);
    place(true);
    return () => {
      mo.disconnect();
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('pointermove', onPtr, true);
      document.removeEventListener('pointerdown', onPtr, true);
      r.removeEventListener('scroll', onScroll, true);
      cancelAnimationFrame(raf);
    };
  }, [track]);
  const sx = stylex.props(styles.surface);
  return (
    <div
      ref={root}
      data-oniva-glide=""
      className={[sx.className, className].filter(Boolean).join(' ')}
      style={sx.style as CSSProperties}
    >
      <style>{track === 'selected' ? OVERRIDE_SEL : OVERRIDE}</style>
      <span ref={pill} aria-hidden="true" {...stylex.props(styles.pill)} />
      {children}
    </div>
  );
}

/**
 * Glides the clipped wrapper (`ref`) to the height of its first child whenever that child resizes
 * (rows added / removed, chips wrap). WAAPI on a clipped wrapper, interruptible, no-op under reduced motion.
 */
export function useGlideHeight(ref: RefObject<HTMLElement | null>, duration = 260) {
  useEffect(() => {
    const wrap = ref.current;
    const inner = wrap?.firstElementChild as HTMLElement | null | undefined;
    if (!wrap || !inner || typeof ResizeObserver === 'undefined') return;
    let last = inner.offsetHeight;
    let anim: Animation | undefined;
    const ro = new ResizeObserver(() => {
      const next = inner.offsetHeight;
      if (next === last) return;
      const from = anim ? wrap.getBoundingClientRect().height : last;
      last = next;
      anim?.cancel();
      if (prefersReducedMotion() || typeof wrap.animate !== 'function' || Math.abs(from - next) < 2)
        return;
      anim = wrap.animate([{ height: `${from}px` }, { height: `${next}px` }], {
        duration,
        easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
      });
      anim.onfinish = () => (anim = undefined);
    });
    ro.observe(inner);
    return () => {
      ro.disconnect();
      anim?.cancel();
    };
  }, [ref, duration]);
}
