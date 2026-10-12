import type { PointerEvent, Ref } from 'react';

/** Merge several refs (callback or object) into one callback ref. */
export function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): (node: T | null) => void {
  return (node) => {
    for (const r of refs) {
      if (typeof r === 'function') r(node);
      else if (r) (r as { current: T | null }).current = node;
    }
  };
}

/**
 * Writes `--gx` / `--gy` (pointer position in px, relative to the element) and `--go` (visibility 0|1) straight
 * onto the DOM node: no React re-render per pointermove. Mouse/pen only; touch is ignored.
 */
export function trackPointer(e: PointerEvent<HTMLElement>) {
  if (e.pointerType === 'touch') return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--gx', `${e.clientX - r.left}px`);
  el.style.setProperty('--gy', `${e.clientY - r.top}px`);
  el.style.setProperty('--go', '1');
}

export function releasePointer(e: PointerEvent<HTMLElement>) {
  e.currentTarget.style.setProperty('--go', '0');
}
