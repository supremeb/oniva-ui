import * as stylex from '@stylexjs/stylex';
import { useId } from 'react';
import { RegionSwitcher } from './r6-switcher';
import { accent } from '../tokens/accent.stylex';
import { colors } from '../tokens/colors.stylex';
import { media } from '../tokens/media.stylex';
import { motion } from '../tokens/motion.stylex';
import { loop } from './w7-scene';

/** Shared by RegionMap and WorldMap: the pastel band that travels along a coastline, and the region switcher. */

const travel = stylex.keyframes({
  from: { strokeDashoffset: 0 },
  to: { strokeDashoffset: -1000 },
});
const enter = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(0.94)' },
  to: { opacity: 1, transform: 'scale(1)' },
});
const leave = stylex.keyframes({
  from: { opacity: 1, transform: 'scale(1)' },
  to: { opacity: 0, transform: 'scale(1.04)' },
});

export const mapStyles = stylex.create({
  band: {
    animationDuration: '14s',
    animationName: { default: travel, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
    fill: 'none',
    strokeDasharray: '200 800',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  },
  glow: { filter: 'blur(4px)', opacity: 0.45, stroke: accent['--oniva-accent-400'], strokeDasharray: '180 820', strokeWidth: 6 },
  l0: { opacity: 0.32, stroke: accent['--oniva-accent-500'], strokeWidth: 1.4 },
  l1: { stroke: colors['--oniva-color-info-solid'], strokeDasharray: '140 860', strokeWidth: 1.4, opacity: 0.55 },
  l2: { stroke: colors['--oniva-color-cyan-fg'], strokeDasharray: '80 920', strokeWidth: 1.4 },
  land: { filter: 'drop-shadow(0 3px 3.5px rgba(31, 33, 40, 0.07))' },
  enter: {
    animationDuration: motion['--oniva-motion-dur-slower'],
    animationName: { default: enter, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    animationFillMode: 'both',
    transformOrigin: '50% 50%',
  },
  leave: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationName: { default: leave, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    animationFillMode: 'both',
    transformOrigin: '50% 50%',
  },
  layer: { display: 'block', height: '100%', inset: 0, position: 'absolute', width: '100%' },
  fill: {
    fill: colors['--oniva-color-accent-soft'],
    stroke: accent['--oniva-accent-solid'],
    strokeLinejoin: 'round',
    strokeWidth: 1,
    vectorEffect: 'non-scaling-stroke',
  },
  outline: {
    fill: 'none',
    stroke: colors['--oniva-color-border-control'],
    strokeLinejoin: 'round',
    strokeWidth: 1,
    vectorEffect: 'non-scaling-stroke',
  },
});

/**
 * Three sharp strokes plus a blurred glow chasing around `d`, 14 s per lap. The glow is masked to spread only
 * outwards from `land` (when given). Frozen under reduced motion, paused off-screen.
 */
export function Band({ d, land }: { d: string; land?: string[] }) {
  const id = 'r6b' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  return (
    <g aria-hidden="true">
      {land && (
        <mask id={id} maskUnits="userSpaceOnUse" x="-50" y="-50" width="700" height="600">
          <rect x="-50" y="-50" width="700" height="600" fill="#fff" />
          {land.map((l, i) => (
            <path key={i} d={l} fill="#000" />
          ))}
        </mask>
      )}
      <path d={d} pathLength={1000} mask={land ? `url(#${id})` : undefined} {...stylex.props(mapStyles.band, mapStyles.glow, loop.run)} />
      <path d={d} pathLength={1000} {...stylex.props(mapStyles.band, mapStyles.l0, loop.run)} />
      <path d={d} pathLength={1000} {...stylex.props(mapStyles.band, mapStyles.l1, loop.run, loop.delay(-0.42))} />
      <path d={d} pathLength={1000} {...stylex.props(mapStyles.band, mapStyles.l2, loop.run, loop.delay(-0.84))} />
    </g>
  );
}

export interface MapOption {
  id: string;
  name: string;
}

export function MapSwitcher({
  options,
  value,
  onChange,
  label,
}: {
  options: MapOption[];
  value: string;
  onChange: (id: string) => void;
  label: string;
}) {
  return <RegionSwitcher label={label} options={options} value={value} onChange={onChange} />;
}
