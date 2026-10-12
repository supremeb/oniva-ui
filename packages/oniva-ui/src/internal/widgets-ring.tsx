import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { colors } from '../tokens/colors.stylex';
import { font } from '../tokens/font.stylex';
import { tones } from './charts-styles';

const styles = stylex.create({
  wrap: { display: 'inline-block', position: 'relative' },
  center: {
    alignItems: 'center',
    color: colors.text,
    display: 'flex',
    fontFamily: font.sans,
    fontFeatureSettings: "'tnum'",
    fontSize: font.size32,
    fontWeight: font.weightMedium,
    inset: 0,
    justifyContent: 'center',
    pointerEvents: 'none',
    position: 'absolute',
  },
});

export interface RingSegment {
  label: string;
  value: number;
  /** 1-based chart tone. */
  tone: number;
}

const TONE_KEYS = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'c10'] as const;

/**
 * Minimal internal segmented ring (used by SleepScoreWidget). Segments are sized by `value`
 * relative to the sum, separated by small gaps. Swap for a charts/ equivalent later if one lands.
 */
export function SegmentRing({
  segments,
  size = 148,
  thickness = 14,
  gapDeg = 14,
  children,
  label,
}: {
  segments: RingSegment[];
  size?: number;
  thickness?: number;
  gapDeg?: number;
  children?: ReactNode;
  label?: string;
}) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const usable = 360 - gapDeg * segments.length;
  let angle = -90 + gapDeg / 2;
  return (
    <div {...stylex.props(styles.wrap)} style={{ height: size, width: size }}>
      <svg width={size} height={size} role="img" aria-label={label}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={thickness}
          {...stylex.props(tones.track)}
          opacity={0.5}
        />
        {segments.map((s) => {
          const sweep = (s.value / total) * usable;
          const len = (sweep / 360) * c;
          const rot = angle;
          angle += sweep + gapDeg;
          return (
            <circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth={thickness}
              strokeLinecap="round"
              strokeDasharray={`${Math.max(0, len - thickness)} ${c}`}
              transform={`rotate(${rot + (thickness / 2 / c) * 360} ${size / 2} ${size / 2})`}
              {...stylex.props(tones[TONE_KEYS[(s.tone - 1) % 10] ?? 'c1'])}
            />
          );
        })}
      </svg>
      <div {...stylex.props(styles.center)}>{children}</div>
    </div>
  );
}
