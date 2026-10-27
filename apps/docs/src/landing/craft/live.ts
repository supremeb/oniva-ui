import { useLayoutEffect, useState, type RefObject } from 'react';
import craft from 'virtual:oniva-craft';

/** Names of every token the Craft sheets read. Lists come from the token source at build, values from the page at runtime. */
const names = (): string[] => {
  const t = craft.tokens;
  return [
    ...t.fontSize, ...t.lineHeight, ...t.space, ...t.radius, ...t.dur, ...t.ease, ...t.ramp, ...t.weight,
    '--oniva-accent-solid', '--oniva-color-accent-text', '--oniva-color-accent-fg', '--oniva-color-surface', '--oniva-motion-press-scale', '--oniva-color-accent-soft', '--oniva-color-accent-soft-fg',
  ];
};

export type Vars = Record<string, string>;

const read = (el: Element): Vars => {
  const cs = getComputedStyle(el);
  const out: Vars = {};
  for (const n of names()) out[n] = cs.getPropertyValue(n).trim();
  return out;
};

/**
 * Reads the Craft tokens from the themed root. Re-reads when `key` changes (theme, accent), once on the next two frames
 * as well, because the theme class can land after this layout effect.
 */
export function useVars(ref: RefObject<Element | null>, key: string): Vars | null {
  const [vars, setVars] = useState<Vars | null>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = () => {
      const next = read(el);
      setVars((prev) => (prev && names().every((n) => prev[n] === next[n]) ? prev : next));
    };
    sync();
    let id2 = 0;
    const id1 = requestAnimationFrame(() => {
      sync();
      id2 = requestAnimationFrame(sync);
    });
    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
    };
  }, [ref, key]);
  return vars;
}

export const num = (v: string | undefined): number => parseFloat(v ?? '') || 0;

/** Duration in ms from a computed `--oniva-motion-dur-*` value; falls back to the token source under reduced motion (0.01ms). */
export function durMs(vars: Vars, name: string): number {
  const v = vars[name] ?? '';
  const ms = v.endsWith('ms') ? parseFloat(v) : v.endsWith('s') ? parseFloat(v) * 1000 : NaN;
  return ms >= 1 ? ms : (craft.durSource[name] ?? 0);
}

/** Token name tail: `--oniva-radius-card` -> `card`. */
export const tail = (n: string, prefix: string) => n.replace(`--oniva-${prefix}-`, '');

// ---- colour ----
let ctx: CanvasRenderingContext2D | null = null;
/** Any computed CSS colour to [r, g, b] 0..255 (the canvas resolves rgb(), color(), color-mix() and oklch alike). */
export function rgbOf(css: string): [number, number, number] {
  ctx ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  if (!ctx) return [0, 0, 0];
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = '#000';
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  return [d[0]!, d[1]!, d[2]!];
}
const lum = ([r, g, b]: [number, number, number]) => {
  const f = (c: number) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
/** WCAG 2.x contrast ratio between two CSS colours. */
export function ratio(a: string, b: string): number {
  const x = lum(rgbOf(a));
  const y = lum(rgbOf(b));
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
export const sameColour = (a: string, b: string) => rgbOf(a).join() === rgbOf(b).join();

// ---- easing ----
export type Bezier = [number, number, number, number];
export function parseBezier(v: string | undefined): Bezier | null {
  const m = /cubic-bezier\(([^)]+)\)/.exec(v ?? '');
  if (!m) return null;
  const p = m[1]!.split(',').map(Number);
  return p.length === 4 && p.every(Number.isFinite) ? (p as Bezier) : null;
}
/** y at time x for a CSS cubic-bezier (bisection on the x polynomial). */
export function bezierAt([x1, y1, x2, y2]: Bezier, x: number): number {
  const at = (t: number, a: number, b: number) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 28; i++) {
    const mid = (lo + hi) / 2;
    if (at(mid, x1, x2) < x) lo = mid;
    else hi = mid;
  }
  return at((lo + hi) / 2, y1, y2);
}
