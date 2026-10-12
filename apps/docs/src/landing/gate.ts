import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { useTheme } from 'oniva-ui';

/** `?noshader` (before or inside the hash) forces the static poster path, used by CI and for fallback review. */
export function shaderForcedOff(): boolean {
  if (typeof window === 'undefined') return true;
  return /[?&]noshader\b/.test(window.location.search) || /[?&]noshader\b/.test(window.location.hash);
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && !!window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

export function useMedia(query: string, initial = false): boolean {
  const [m, setM] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : initial,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return m;
}

/** Can we even try WebGPU? Cheap synchronous check; the lib's onUnavailable covers adapter failures. */
export function canTryShader(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator && !shaderForcedOff();
}

/** Live in-view flag (not once-only): shader canvases mount in view and unmount when far offscreen. */
export function useLiveInView(ref: RefObject<Element | null>, rootMargin = '160px 0px'): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setInView(!!e?.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

export interface Palette {
  bg: string;
  surface: string;
  text: string;
  a100: string;
  a200: string;
  a300: string;
  a400: string;
  a500: string;
  a600: string;
  a700: string;
  a800: string;
  a900: string;
  isDark: boolean;
}

const VARS: [keyof Omit<Palette, 'isDark'>, string][] = [
  ['bg', '--oniva-color-bg'],
  ['surface', '--oniva-color-surface'],
  ['text', '--oniva-color-text'],
  ['a100', '--oniva-accent-100'],
  ['a200', '--oniva-accent-200'],
  ['a300', '--oniva-accent-300'],
  ['a400', '--oniva-accent-400'],
  ['a500', '--oniva-accent-500'],
  ['a600', '--oniva-accent-600'],
  ['a700', '--oniva-accent-700'],
  ['a800', '--oniva-accent-800'],
  ['a900', '--oniva-accent-900'],
];

const FALLBACK: Palette = {
  bg: '#0a0a0a', surface: '#141414', text: '#fafafa',
  a100: '#dbeafe', a200: '#bedbff', a300: '#8ec5ff', a400: '#3392ff', a500: '#2b7fff',
  a600: '#155dfc', a700: '#1447e6', a800: '#193cb8', a900: '#1c398e', isDark: true,
};

let ctx2d: CanvasRenderingContext2D | null | undefined;
/** Any CSS color the browser understands -> #rrggbb (the shader lib takes hex). */
function toHex(css: string): string {
  if (ctx2d === undefined) ctx2d = document.createElement('canvas').getContext('2d');
  if (!ctx2d) return '#808080';
  ctx2d.fillStyle = '#000';
  ctx2d.fillStyle = css;
  return ctx2d.fillStyle;
}

/**
 * Reads the live design tokens (`--oniva-accent-*`, bg, surface) from the nearest ThemeProvider cascade.
 * Re-reads when the accent or resolved theme changes, so the shaders recolor with the header switcher.
 */
export function usePalette(ref: RefObject<HTMLElement | null>): Palette {
  const { accent, resolvedTheme } = useTheme();
  const [p, setP] = useState<Palette>(FALLBACK);
  const last = useRef('');
  useLayoutEffect(() => {
    const host = ref.current;
    if (!host) return;
    const probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none';
    host.appendChild(probe);
    const next = { isDark: resolvedTheme === 'dark' } as Palette;
    for (const [k, v] of VARS) {
      probe.style.color = `var(${v})`;
      (next as unknown as Record<string, string>)[k] = toHex(getComputedStyle(probe).color);
    }
    host.removeChild(probe);
    const sig = JSON.stringify(next);
    if (sig !== last.current) {
      last.current = sig;
      setP(next);
    }
  }, [ref, accent, resolvedTheme]);
  return p;
}
