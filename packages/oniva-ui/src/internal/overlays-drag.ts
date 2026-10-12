import { prefersReducedMotion } from './motion-hooks';

/** Pointer velocity (px/ms) over the last few moves. */
export class VelocityTracker {
  private samples: Array<{ p: number; t: number }> = [];
  reset() {
    this.samples = [];
  }
  push(p: number, t: number) {
    this.samples.push({ p, t });
    if (this.samples.length > 6) this.samples.shift();
  }
  get velocity(): number {
    const s = this.samples;
    if (s.length < 2) return 0;
    const a = s[0]!;
    const b = s[s.length - 1]!;
    const dt = b.t - a.t;
    return dt > 0 ? (b.p - a.p) / dt : 0;
  }
}

/** Logarithmic resistance for dragging against the dismiss direction (Vaul-style rubber band). */
export function rubberBand(distance: number, limit = 56): number {
  const d = Math.abs(distance);
  return Math.sign(distance) * limit * (1 - Math.exp(-d / (limit * 2.2)));
}

/** True if the event target sits inside a scrollable region that is not at its start edge. */
export function isScrolledInside(target: EventTarget | null, root: HTMLElement, axis: 'x' | 'y') {
  let el = target as HTMLElement | null;
  while (el && el !== root.parentElement) {
    if (el instanceof HTMLElement) {
      const style = getComputedStyle(el);
      const o = axis === 'y' ? style.overflowY : style.overflowX;
      if (/(auto|scroll)/.test(o)) {
        const scrolled = axis === 'y' ? el.scrollTop : el.scrollLeft;
        const scrollable =
          axis === 'y' ? el.scrollHeight > el.clientHeight : el.scrollWidth > el.clientWidth;
        if (scrollable && scrolled > 0) return true;
      }
    }
    if (el === root) break;
    el = el.parentElement;
  }
  return false;
}

export function isInteractiveTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    !!target.closest('input, textarea, select, [contenteditable="true"], [data-no-drag]')
  );
}

export const SHEET_EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';
export const SHEET_OUT_MS = 300;
export const SHEET_SETTLE_MS = 400;

/** Duration helper that respects reduced motion for inline (JS-driven) transitions. */
export function sheetMs(ms: number) {
  return prefersReducedMotion() ? 0 : ms;
}

export const DISMISS_VELOCITY = 0.11; // px/ms
