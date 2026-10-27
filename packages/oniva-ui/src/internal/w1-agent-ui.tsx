import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { colors } from '../tokens/colors.stylex';
import { font } from '../tokens/font.stylex';
import { media } from '../tokens/media.stylex';
import { motion } from '../tokens/motion.stylex';
import { radius } from '../tokens/radius.stylex';
import { shadow } from '../tokens/shadow.stylex';
import type { Tone } from './types';

/** Shared helpers for the loop-7 agent-ops components (worker w1). */

/** Re-renders every `ms` while `enabled`; returns `Date.now()` (or the controlled `now`). */
export function useNow(now: number | undefined, enabled = true, ms = 1000): number {
  const [t, setT] = useState(() => Date.now());
  useEffect(() => {
    if (now !== undefined || !enabled) return;
    setT(Date.now());
    const id = window.setInterval(() => setT(Date.now()), ms);
    return () => window.clearInterval(id);
  }, [now, enabled, ms]);
  return now ?? t;
}

/** Measured inline size of an element (0 until measured / in jsdom). */
export function useWidth<T extends HTMLElement>(ref: RefObject<T | null>): number {
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e?.contentRect.width ?? 0)));
    ro.observe(el);
    setW(Math.round(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, [ref]);
  return w;
}

/** `1m 20s`, `45s`, `2h 05m`. */
export function formatDuration(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ${String(s % 60).padStart(2, '0')}s`;
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`;
}

/** `2m ago` style label via Intl.RelativeTimeFormat. */
export function formatAgo(ms: number, locale: string): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto', style: 'narrow' });
  const s = Math.round(ms / 1000);
  if (s < 5) return rtf.format(0, 'second');
  if (s < 60) return rtf.format(-s, 'second');
  const m = Math.round(s / 60);
  if (m < 60) return rtf.format(-m, 'minute');
  const h = Math.round(m / 60);
  if (h < 24) return rtf.format(-h, 'hour');
  return rtf.format(-Math.round(h / 24), 'day');
}

const w1Spin = stylex.keyframes({ from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } });
const w1Pulse = stylex.keyframes({
  '0%': { opacity: 0.55, transform: 'scale(1)' },
  '100%': { opacity: 0, transform: 'scale(1.8)' },
});
const w1Rise = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(6px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});
const w1Fade = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const w1Sheen = stylex.keyframes({
  from: { transform: 'translateX(-100%)' },
  to: { transform: 'translateX(100%)' },
});

/** Surfaces and type shared by every w1 component. */
export const w1 = stylex.create({
  root: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-13'],
    gap: 10,
    minWidth: 0,
    padding: 12,
    width: '100%',
  },
  bar: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    minHeight: 28,
  },
  title: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-semibold'],
    margin: 0,
  },
  muted: { color: colors['--oniva-color-text-muted'] },
  grow: { flexGrow: 1, minWidth: 0 },
  tile: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: 'none',
    boxSizing: 'border-box',
  },
  num: { fontVariantNumeric: 'tabular-nums' },
  mono: { fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-12'] },
  ellipsis: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  label: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-11'],
    fontWeight: font['--oniva-font-weight-medium'],
    letterSpacing: font['--oniva-font-track-label'],
    textTransform: 'uppercase',
  },
  reset: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: 'inherit',
    cursor: 'pointer',
    font: 'inherit',
    margin: 0,
    padding: 0,
    textAlign: 'start',
  },
  list: { listStyle: 'none', margin: 0, padding: 0 },
  srOnly: {
    borderWidth: 0,
    clip: 'rect(0,0,0,0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
  },
  iconBtn: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-hover'] },
    },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-text-muted'],
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    height: 28,
    justifyContent: 'center',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, color, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: 28,
  },
  spin: {
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    animationName: { default: w1Spin, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
  },
  rise: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationFillMode: 'backwards',
    animationName: { default: w1Rise, [media.reducedMotion]: w1Fade },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  fade: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationFillMode: 'backwards',
    animationName: w1Fade,
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  sheen: {
    animationDuration: '2.2s',
    animationIterationCount: 'infinite',
    animationName: { default: w1Sheen, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
    backgroundImage: 'linear-gradient(90deg, transparent, color-mix(in srgb, currentColor 18%, transparent), transparent)',
    inset: 0,
    pointerEvents: 'none',
    position: 'absolute',
  },
  pulseRing: {
    animationDuration: '1.6s',
    animationIterationCount: 'infinite',
    animationName: { default: w1Pulse, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-out',
    borderColor: 'currentColor',
    borderRadius: 'inherit',
    borderStyle: 'solid',
    borderWidth: 1,
    inset: -1,
    pointerEvents: 'none',
    position: 'absolute',
  },
  popover: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-elevation-floating'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-13'],
    maxWidth: 300,
    minWidth: 200,
    outlineStyle: 'none',
    padding: 12,
  },
});

/** Soft tone chips (text on soft fill; AA in light and dark). */
export const w1Tone = stylex.create({
  neutral: { backgroundColor: colors['--oniva-color-surface-tertiary'], color: colors['--oniva-color-text-muted'] },
  info: { backgroundColor: colors['--oniva-color-info-bg'], color: colors['--oniva-color-info-fg'] },
  success: { backgroundColor: colors['--oniva-color-success-bg'], color: colors['--oniva-color-success-fg'] },
  warning: { backgroundColor: colors['--oniva-color-warning-bg'], color: colors['--oniva-color-warning-fg'] },
  danger: { backgroundColor: colors['--oniva-color-danger-bg'], color: colors['--oniva-color-danger-fg'] },
});
export const w1Solid = stylex.create({
  neutral: { backgroundColor: colors['--oniva-color-icon-subtle'] },
  info: { backgroundColor: colors['--oniva-color-info-solid'] },
  success: { backgroundColor: colors['--oniva-color-success-solid'] },
  warning: { backgroundColor: colors['--oniva-color-warning-solid'] },
  danger: { backgroundColor: colors['--oniva-color-danger-solid'] },
});

const pill = stylex.create({
  base: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-full'],
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: font['--oniva-font-size-11'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 4,
    lineHeight: '18px',
    paddingInline: 7,
    whiteSpace: 'nowrap',
  },
});

/** Small soft tag with an optional icon. */
export function Tag({ tone = 'neutral', icon, children }: { tone?: Tone; icon?: ReactNode; children: ReactNode }) {
  return (
    <span {...stylex.props(pill.base, w1Tone[tone], w1.num)}>
      {icon}
      {children}
    </span>
  );
}

/** Polite live region (visually hidden). */
export function LiveRegion({ message }: { message: string }) {
  return (
    <div role="status" aria-live="polite" {...stylex.props(w1.srOnly)}>
      {message}
    </div>
  );
}

/** Keeps the last non-empty announcement so a live region re-announces on change. */
export function useAnnouncer(): [string, (m: string) => void] {
  const [msg, setMsg] = useState('');
  const t = useRef(0);
  const say = (m: string) => {
    window.clearTimeout(t.current);
    setMsg(m);
    t.current = window.setTimeout(() => setMsg(''), 4000);
  };
  useEffect(() => () => window.clearTimeout(t.current), []);
  return [msg, say];
}

/** Controlled/uncontrolled helper. */
export function useControlled<T>(value: T | undefined, def: T, onChange?: (v: T) => void): [T, (v: T) => void] {
  const [inner, setInner] = useState(def);
  const isCtl = value !== undefined;
  const cur = isCtl ? value : inner;
  return [
    cur,
    (v: T) => {
      if (!isCtl) setInner(v);
      onChange?.(v);
    },
  ];
}
