import { useEffect, useRef } from 'react';

export interface LoopOptions {
  axis?: 'x' | 'y';
  /** Pixels per second. */
  speed: number;
  /** `1` moves content towards the start (left/up); `-1` the other way. */
  direction?: 1 | -1;
  pauseOnHover?: boolean;
  /** Static content: no loop, no listeners. */
  disabled?: boolean;
  /** Starting offset as a fraction (0-1) of one copy. */
  startAt?: number;
}

/**
 * One rAF loop that eases a velocity towards the cruise speed (or zero while hovered / focused / held),
 * wraps the offset by exactly one copy (seamless), and scrubs with inertia on pointer drag.
 * The root is the clipping viewport; the track holds two identical copies, the first is `[data-loop-copy]`.
 * Only `transform` is written. Touch drags scrub only on the x axis (vertical swipes keep scrolling the page).
 */
export function useLoopScroller<R extends HTMLElement, T extends HTMLElement>({
  axis = 'x',
  speed,
  direction = 1,
  pauseOnHover = true,
  disabled = false,
  startAt = 0,
}: LoopOptions) {
  const rootRef = useRef<R>(null);
  const trackRef = useRef<T>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || disabled) return;
    const x = axis === 'x';
    let len = 0;
    let pos = 0;
    let vel = 0;
    let hover = false;
    let focus = false;
    let held = false;
    let visible = typeof IntersectionObserver === 'undefined';
    let drag: { id: number; last: number; t: number; moved: number } | null = null;
    let raf = 0;
    let prev = 0;
    let started = false;

    const measure = () => {
      const copy = track.querySelector<HTMLElement>('[data-loop-copy]');
      if (!copy) return;
      len = x ? copy.offsetWidth : copy.offsetHeight;
      if (!started && len > 0) {
        pos = len * startAt;
        started = true;
      }
    };
    const paint = () => {
      const p = len > 0 ? ((pos % len) + len) % len : 0;
      pos = p;
      track.style.transform = x ? `translate3d(${-p}px,0,0)` : `translate3d(0,${-p}px,0)`;
    };
    const frame = (now: number) => {
      raf = 0;
      if (!visible) return;
      const dt = Math.min(0.05, (now - prev) / 1000 || 0);
      prev = now;
      if (!drag && len > 0) {
        const stop = (pauseOnHover && (hover || focus)) || held;
        const target = stop ? 0 : direction * speed;
        const tau = stop ? 0.12 : Math.abs(vel) > speed * 1.2 ? 0.6 : 0.3;
        vel += (target - vel) * (1 - Math.exp(-dt / tau));
        pos += vel * dt;
        paint();
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && visible) {
        prev = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    const ro = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => {
      measure();
      paint();
    });
    ro?.observe(root);
    const firstCopy = track.querySelector('[data-loop-copy]');
    if (firstCopy) ro?.observe(firstCopy);
    measure();
    paint();
    const io =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([e]) => {
            visible = !!e?.isIntersecting;
            if (visible) start();
            else stop();
          });
    io?.observe(root);

    const onEnter = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') hover = true;
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && !drag) hover = false;
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === 'touch') {
        // Press-and-hold pauses; horizontal swipes scrub on the x axis.
        held = true;
        if (!x) return;
      }
      if (e.button !== 0) return;
      drag = { id: e.pointerId, last: x ? e.clientX : e.clientY, t: e.timeStamp, moved: 0 };
      vel = 0;
      root.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!drag || e.pointerId !== drag.id) return;
      const cur = x ? e.clientX : e.clientY;
      const d = cur - drag.last;
      const dtm = Math.max(1, e.timeStamp - drag.t) / 1000;
      drag.moved += Math.abs(d);
      pos -= d;
      vel = vel * 0.6 + (-d / dtm) * 0.4;
      drag.last = cur;
      drag.t = e.timeStamp;
      paint();
    };
    const onUp = (e: PointerEvent) => {
      held = false;
      if (drag && e.pointerId === drag.id) {
        drag = null;
        root.releasePointerCapture?.(e.pointerId);
        if (e.pointerType !== 'mouse') hover = false;
      }
    };
    const onClick = (e: MouseEvent) => {
      if (suppress) {
        e.preventDefault();
        e.stopPropagation();
      }
      suppress = false;
    };
    let suppress = false;
    const onUpCapture = () => {
      suppress = !!drag && drag.moved > 4;
    };
    const onFocusIn = (e: FocusEvent) => {
      focus = true;
      vel = 0;
      const t = e.target as HTMLElement | null;
      if (!t || !len) return;
      const r = t.getBoundingClientRect();
      const b = root.getBoundingClientRect();
      const pad = 16;
      if (x) {
        if (r.left < b.left + pad) pos -= b.left + pad - r.left;
        else if (r.right > b.right - pad) pos += r.right - (b.right - pad);
      } else if (r.top < b.top + pad) pos -= b.top + pad - r.top;
      else if (r.bottom > b.bottom - pad) pos += r.bottom - (b.bottom - pad);
      paint();
    };
    const onFocusOut = (e: FocusEvent) => {
      if (!root.contains(e.relatedTarget as Node | null)) focus = false;
    };

    root.addEventListener('pointerenter', onEnter);
    root.addEventListener('pointerleave', onLeave);
    root.addEventListener('pointerdown', onDown);
    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerup', onUpCapture, true);
    root.addEventListener('pointerup', onUp);
    root.addEventListener('pointercancel', onUp);
    root.addEventListener('click', onClick, true);
    root.addEventListener('focusin', onFocusIn);
    root.addEventListener('focusout', onFocusOut);
    start();
    return () => {
      stop();
      ro?.disconnect();
      io?.disconnect();
      root.removeEventListener('pointerenter', onEnter);
      root.removeEventListener('pointerleave', onLeave);
      root.removeEventListener('pointerdown', onDown);
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerup', onUpCapture, true);
      root.removeEventListener('pointerup', onUp);
      root.removeEventListener('pointercancel', onUp);
      root.removeEventListener('click', onClick, true);
      root.removeEventListener('focusin', onFocusIn);
      root.removeEventListener('focusout', onFocusOut);
      track.style.transform = '';
    };
  }, [axis, speed, direction, pauseOnHover, disabled, startAt]);

  return { rootRef, trackRef };
}
