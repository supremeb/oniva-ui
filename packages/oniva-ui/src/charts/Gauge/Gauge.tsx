import * as stylex from '@stylexjs/stylex';
import { arc } from 'd3-shape';
import type { ReactNode, Ref } from 'react';
import { clamp, makeFormatter, type ValueFormat } from '../../internal/charts-math';
import { chartMotion, svgText, toneStyle, tones } from '../../internal/charts-styles';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { ChartFrame } from '../_shared/ChartFrame';

const styles = stylex.create({
  wrap: { position: 'relative' },
  center: {
    alignItems: 'center',
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
  },
  value: {
    color: colors.text,
    fontFamily: font.sans,
    fontSize: font.size32,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font.weightMedium,
    letterSpacing: font.trackHero,
    lineHeight: font.lh32,
  },
  caption: {
    color: colors.textMuted,
    fontFamily: font.sans,
    fontSize: font.size12,
    fontWeight: font.weightMedium,
  },
  needle: { fill: colors.text },
  hub: { fill: colors.surface, stroke: colors.text },
});

export interface GaugeProps {
  value: number;
  min?: number;
  max?: number;
  /** 1-based palette index of the filled arc. */
  tone?: number;
  width?: number;
  thickness?: number;
  valueFormat?: ValueFormat;
  caption?: ReactNode;
  label?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Half-circle progress gauge with the value in the centre. */
export function Gauge({
  value,
  min = 0,
  max = 100,
  tone = 1,
  width = 240,
  thickness = 18,
  valueFormat = 'number',
  caption,
  label,
  className,
  xstyle,
  ref,
}: GaugeProps) {
  const fmt = makeFormatter(valueFormat);
  const f = clamp((value - min) / (max - min || 1), 0, 1);
  const R = width / 2 - 2;
  const height = R + 6;
  const gen = arc()
    .innerRadius(R - thickness)
    .outerRadius(R)
    .cornerRadius(thickness / 2);
  return (
    <div {...stylex.props(styles.wrap, xstyle)} style={{ height, width }}>
      <ChartFrame
        label={label ?? `Gauge: ${fmt(value)} on a scale of ${fmt(min)} to ${fmt(max)}`}
        height={height}
        width={width}
        className={className}
        ref={ref}
      >
        {() => (
          <g transform={`translate(${width / 2},${R + 2})`}>
            <path
              d={
                gen({
                  startAngle: -Math.PI / 2,
                  endAngle: Math.PI / 2,
                  innerRadius: 0,
                  outerRadius: 0,
                }) ?? ''
              }
              fill="currentColor"
              {...stylex.props(tones.track)}
            />
            {f > 0 && (
              <path
                d={
                  gen({
                    startAngle: -Math.PI / 2,
                    endAngle: -Math.PI / 2 + Math.PI * f,
                    innerRadius: 0,
                    outerRadius: 0,
                  }) ?? ''
                }
                fill="currentColor"
                {...stylex.props(toneStyle(tone), chartMotion.fade)}
              />
            )}
            <text
              x={-(R - thickness / 2)}
              y={16}
              textAnchor="middle"
              {...stylex.props(svgText.axis)}
            >
              {fmt(min)}
            </text>
            <text x={R - thickness / 2} y={16} textAnchor="middle" {...stylex.props(svgText.axis)}>
              {fmt(max)}
            </text>
          </g>
        )}
      </ChartFrame>
      <div {...stylex.props(styles.center)} style={{ bottom: 22 }}>
        <span {...stylex.props(styles.value)}>{fmt(value)}</span>
        {caption != null && <span {...stylex.props(styles.caption)}>{caption}</span>}
      </div>
    </div>
  );
}

export interface SpeedometerZone {
  /** Upper bound (inclusive) of the zone. */
  to: number;
  tone: number;
  label?: string;
}

export interface SpeedometerProps {
  value: number;
  min?: number;
  max?: number;
  /** Coloured bands from min up; the last should end at `max`. */
  zones?: SpeedometerZone[];
  width?: number;
  valueFormat?: ValueFormat;
  caption?: ReactNode;
  label?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const DEFAULT_ZONES: SpeedometerZone[] = [
  { to: 40, tone: 3, label: 'Low' },
  { to: 70, tone: 8, label: 'Fair' },
  { to: 100, tone: 7, label: 'Good' },
];

/** 240° dial with coloured zones, tick marks and a needle. */
export function Speedometer({
  value,
  min = 0,
  max = 100,
  zones = DEFAULT_ZONES,
  width = 260,
  valueFormat = 'number',
  caption,
  label,
  className,
  xstyle,
  ref,
}: SpeedometerProps) {
  const fmt = makeFormatter(valueFormat);
  const sweep = (240 * Math.PI) / 180;
  const a0 = -sweep / 2;
  const R = width / 2 - 8;
  const height = R + R * Math.cos(Math.PI / 6) + 24;
  const cy = R + 8;
  const toA = (v: number) => a0 + clamp((v - min) / (max - min || 1), 0, 1) * sweep;
  const zoneLabel = zones.find((z) => value <= z.to)?.label;
  const gen = arc()
    .innerRadius(R - 16)
    .outerRadius(R)
    .cornerRadius(3);
  return (
    <div {...stylex.props(styles.wrap, xstyle)} style={{ height, width }}>
      <ChartFrame
        label={label ?? `Speedometer: ${fmt(value)}${zoneLabel ? `, ${zoneLabel}` : ''}`}
        height={height}
        width={width}
        className={className}
        ref={ref}
      >
        {({ bind }) => {
          let prev = min;
          const needleA = toA(value);
          return (
            <g transform={`translate(${width / 2},${cy})`}>
              {zones.map((z, i) => {
                const s = toA(prev) + (i === 0 ? 0 : 0.03);
                const e = toA(z.to) - (i === zones.length - 1 ? 0 : 0.03);
                prev = z.to;
                return (
                  <path
                    key={i}
                    d={gen({ startAngle: s, endAngle: e, innerRadius: 0, outerRadius: 0 }) ?? ''}
                    fill="currentColor"
                    {...stylex.props(toneStyle(z.tone), svgText.hit, chartMotion.fade)}
                    {...bind(
                      {
                        title: z.label ?? `Zone ${i + 1}`,
                        rows: [{ label: 'Up to', value: fmt(z.to), tone: z.tone }],
                      },
                      `${z.label ?? `Zone ${i + 1}`}, up to ${fmt(z.to)}`,
                    )}
                  />
                );
              })}
              {Array.from({ length: 11 }, (_, i) => {
                const a = a0 + (sweep * i) / 10;
                const r1 = R - 24;
                const r2 = R - (i % 5 === 0 ? 34 : 30);
                return (
                  <line
                    key={i}
                    x1={Math.sin(a) * r1}
                    y1={-Math.cos(a) * r1}
                    x2={Math.sin(a) * r2}
                    y2={-Math.cos(a) * r2}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    {...stylex.props(svgText.cursorLine)}
                  />
                );
              })}
              <g
                transform={`rotate(${(needleA * 180) / Math.PI})`}
                {...stylex.props(chartMotion.fade)}
              >
                <path d={`M-4,0L0,${-(R - 40)}L4,0Z`} {...stylex.props(styles.needle)} />
              </g>
              <circle r={8} strokeWidth={3} {...stylex.props(styles.hub)} />
            </g>
          );
        }}
      </ChartFrame>
      <div {...stylex.props(styles.center)} style={{ bottom: 4 }}>
        <span {...stylex.props(styles.value)}>{fmt(value)}</span>
        {(caption ?? zoneLabel) != null && (
          <span {...stylex.props(styles.caption)}>{caption ?? zoneLabel}</span>
        )}
      </div>
    </div>
  );
}
