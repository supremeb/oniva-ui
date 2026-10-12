import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { seriesTone, type ChartSeries } from '../../internal/charts-math';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { svgText, toneStyle } from '../../internal/charts-styles';
import type { TipBind } from './ChartFrame';

const styles = stylex.create({
  group: {
    opacity: 0,
    pointerEvents: 'none',
    transitionDuration: motion['--oniva-motion-dur-fast'],
    transitionProperty: 'opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  live: {
    transitionDuration: { default: '90ms', [media.reducedMotion]: '0.01ms' },
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  shown: { opacity: 1 },
  dot: {
    transitionDuration: { default: '90ms', [media.reducedMotion]: '0.01ms' },
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
});

/** Tracks the scrubbed category index and wraps a chart `bind()` so pointer/focus also update it. */
export function useScrub() {
  const [hi, setHi] = useState<number | null>(null);
  const wrap = (b: TipBind, i: number): TipBind => ({
    ...b,
    onPointerMove: (e) => {
      b.onPointerMove(e);
      setHi(i);
    },
    onFocus: (e) => {
      b.onFocus(e);
      setHi(i);
    },
    onPointerLeave: () => {
      b.onPointerLeave();
      setHi(null);
    },
    onBlur: () => {
      b.onBlur();
      setHi(null);
    },
    onKeyDown: (e) => {
      b.onKeyDown(e);
      if (e.key === 'Escape') setHi(null);
    },
  });
  return { hi, wrap };
}

interface CrosshairProps {
  /** Pixel x of the scrubbed category, or null when idle. */
  x: number | null;
  top: number;
  bottom: number;
  series: ChartSeries[];
  /** y pixel per series for the scrubbed category. */
  ys: number[];
}

/**
 * Vertical scrub line + per-series dots. Glides between categories via transform (90ms ease-out);
 * the first appearance snaps into place and only fades in, so it never slides in from the edge.
 */
export function Crosshair({ x, top, bottom, series, ys }: CrosshairProps) {
  const [last, setLast] = useState(x ?? 0);
  const [live, setLive] = useState(false);
  const active = x != null;
  if (x != null && x !== last) setLast(x);
  useEffect(() => {
    setLive(active);
  }, [active]);
  return (
    <g
      aria-hidden="true"
      {...stylex.props(styles.group, live && styles.live, active && styles.shown)}
      style={{ transform: `translateX(${x ?? last}px)` }}
    >
      <line y1={top} y2={bottom} strokeDasharray="3 3" {...stylex.props(svgText.cursorLine)} />
      {active &&
        series.map((s, i) => (
          <circle
            key={s.key}
            r={4}
            fill="currentColor"
            strokeWidth={2}
            style={{ transform: `translateY(${ys[i] ?? 0}px)` }}
            {...stylex.props(toneStyle(seriesTone(s, i)), svgText.dotRing, live && styles.dot)}
          />
        ))}
    </g>
  );
}
