import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { accent } from '../tokens/accent.stylex';
import { colors } from '../tokens/colors.stylex';
import { font } from '../tokens/font.stylex';
import { media } from '../tokens/media.stylex';
import { motion } from '../tokens/motion.stylex';
import { radius } from '../tokens/radius.stylex';
import { loop } from './w7-scene';

/** Building blocks shared by the Illustrations group: neutral tiles, beams, cursor, palette. */

/** A tool, app or integration shown on a tile. Pass your own `icon`; the default is a monogram. */
export interface IllustrationItem {
  name: string;
  /** Icon or logo node. Falls back to the first letter of `name`. */
  icon?: ReactNode;
}

/** Soft background + readable foreground pairs from the status palette (AA-tested pairs). */
export const palette = stylex.create({
  p0: { backgroundColor: colors['--oniva-color-info-bg'], color: colors['--oniva-color-info-fg'] },
  p1: { backgroundColor: colors['--oniva-color-cyan-bg'], color: colors['--oniva-color-cyan-fg'] },
  p2: { backgroundColor: colors['--oniva-color-orange-bg'], color: colors['--oniva-color-orange-fg'] },
  p3: { backgroundColor: colors['--oniva-color-purple-bg'], color: colors['--oniva-color-purple-fg'] },
  p4: { backgroundColor: colors['--oniva-color-success-bg'], color: colors['--oniva-color-success-fg'] },
  p5: { backgroundColor: colors['--oniva-color-accent-soft'], color: colors['--oniva-color-accent-soft-fg'] },
});
const paletteKeys = ['p0', 'p1', 'p2', 'p3', 'p4', 'p5'] as const;
export const paletteAt = (i: number) => palette[paletteKeys[((i % 6) + 6) % 6]!];

const tileStyles = stylex.create({
  tile: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-xl'],
    boxShadow: `0 0 0 1px ${colors['--oniva-color-border']}`,
    boxSizing: 'border-box',
    display: 'inline-flex',
    flexShrink: 0,
    fontFamily: font['--oniva-font-sans'],
    fontWeight: 600,
    justifyContent: 'center',
    lineHeight: 1,
    overflow: 'hidden',
    userSelect: 'none',
  },
  neutral: {
    backgroundColor: colors['--oniva-color-surface'],
    color: colors['--oniva-color-text'],
  },
  round: { borderRadius: radius['--oniva-radius-full'] },
  size: (cqw: number) => ({
    fontSize: `${(cqw * 0.42).toFixed(2)}cqw`,
    height: `${cqw}cqw`,
    width: `${cqw}cqw`,
  }),
});

export interface TileProps {
  item?: IllustrationItem;
  /** Edge length in container-width percent (cqw). */
  size: number;
  /** Index into the soft palette for monograms; omit for a neutral white tile. */
  tone?: number;
  round?: boolean;
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
}

/** Neutral tile: icon/logo if given, otherwise a monogram. Scales with the scene (cqw). */
export function Tile({ item, size, tone, round, children, xstyle }: TileProps) {
  const content =
    children ?? item?.icon ?? (item ? <span aria-hidden="true">{item.name.trim().charAt(0).toUpperCase()}</span> : null);
  return (
    <span
      aria-hidden="true"
      {...stylex.props(
        tileStyles.tile,
        tone == null ? tileStyles.neutral : paletteAt(tone),
        round && tileStyles.round,
        tileStyles.size(size),
        xstyle,
      )}
    >
      {item?.icon && !children ? <span {...stylex.props(iconBox.box)}>{item.icon}</span> : content}
    </span>
  );
}

const iconBox = stylex.create({
  box: {
    alignItems: 'center',
    display: 'inline-flex',
    height: '58%',
    justifyContent: 'center',
    width: '58%',
    '--w7-icon': '100%',
  },
});

/** Makes an svg/lucide child fill an `iconBox`-sized parent. */
export const fillSvg = stylex.create({
  svg: { display: 'block', height: '100%', strokeWidth: 1.7, width: '100%' },
});

/* ------------------------------ beams ------------------------------ */

const pulse = stylex.keyframes({
  '0%': { opacity: 0, strokeDashoffset: 0.16 },
  '12%': { opacity: 1 },
  '72%': { opacity: 1, strokeDashoffset: -1 },
  '100%': { opacity: 0, strokeDashoffset: -1 },
});
const glowPulse = stylex.keyframes({
  '0%, 100%': { opacity: 0.55 },
  '50%': { opacity: 1 },
});

export const beam = stylex.create({
  base: {
    fill: 'none',
    stroke: colors['--oniva-color-border-hover'],
    strokeWidth: 0.32,
  },
  dashed: { strokeDasharray: '0.9 1.1' },
  group: { opacity: 1, transitionDuration: motion['--oniva-motion-dur-base'], transitionProperty: 'opacity' },
  dim: { opacity: 0.35 },
  pulse: {
    animationName: { default: pulse, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'cubic-bezier(0.45, 0, 0.25, 1)',
    fill: 'none',
    stroke: accent['--oniva-accent-solid'],
    strokeDasharray: '0.16 2',
    strokeLinecap: 'round',
    strokeWidth: 0.55,
  },
  pulseGlow: {
    filter: 'blur(3px)',
    strokeWidth: 1.4,
  },
  duration: (s: number) => ({ animationDuration: `${s}s` }),
  breathe: {
    animationDuration: '3.2s',
    animationName: { default: glowPulse, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
  },
});

export interface BeamPathProps {
  d: string;
  /** Seconds before the first pulse (and the loop offset). */
  delay?: number;
  /** Seconds per loop. */
  duration?: number;
  dashed?: boolean;
  /** Hide the travelling pulse (static line only). */
  isStatic?: boolean;
  dim?: boolean;
  /** Play the pulse once (re-key the element to replay) instead of looping. */
  once?: boolean;
}

/** A static line with a pulse travelling along it (loop paused off-screen, frozen under reduced motion). */
export function BeamPath({ d, delay = 0, duration = 3, dashed, isStatic, dim, once }: BeamPathProps) {
  const run = once ? loop.once : loop.run;
  return (
    <g {...stylex.props(beam.group, dim && beam.dim)}>
      <path d={d} {...stylex.props(beam.base, dashed && beam.dashed)} />
      {!isStatic && (
        <>
          <path
            d={d}
            pathLength={1}
            {...stylex.props(beam.pulse, beam.pulseGlow, beam.duration(duration), run, loop.delay(delay))}
          />
          <path
            d={d}
            pathLength={1}
            {...stylex.props(beam.pulse, beam.duration(duration), run, loop.delay(delay))}
          />
        </>
      )}
    </g>
  );
}

/* ------------------------------ cursor ------------------------------ */

const cursorStyles = stylex.create({
  cursor: {
    fill: colors['--oniva-color-on-solid-light'],
    filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.25))',
    stroke: colors['--oniva-color-on-solid'],
    strokeLinejoin: 'round',
    strokeWidth: 1.5,
  },
});

/** Pointer arrow. Size it by wrapping in an absolutely positioned element. */
export function CursorArrow({ xstyle }: { xstyle?: stylex.StyleXStyles }) {
  return (
    <svg viewBox="0 0 20 24" aria-hidden="true" {...stylex.props(fillSvg.svg, xstyle)}>
      <path d="M3 2 L3 19 L7.6 14.8 L10.6 21.4 L13.6 20 L10.7 13.5 L16.8 13.2 Z" {...stylex.props(cursorStyles.cursor)} />
    </svg>
  );
}

/* ---------------------------- surfaces ---------------------------- */

export const surface = stylex.create({
  card: {
    backgroundColor: colors['--oniva-color-surface'],
    borderRadius: radius['--oniva-radius-xl'],
    boxShadow: `0 0 0 1px ${colors['--oniva-color-border']}`,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-sans'],
  },
  pill: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderRadius: radius['--oniva-radius-full'],
    boxShadow: `0 0 0 1px ${colors['--oniva-color-border']}`,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontWeight: 500,
    gap: '1.2cqw',
    whiteSpace: 'nowrap',
  },
  /** Skeleton bar that shimmers while the scene is live. */
  bar: {
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-full'],
    display: 'block',
    height: '1.1cqw',
  },
  pos: (l: string, t: string) => ({ left: l, position: 'absolute', top: t }),
  abs: { position: 'absolute' },
});

/** Percent helper for absolute positioning. */
export const pct = (n: number) => `${n}%`;
