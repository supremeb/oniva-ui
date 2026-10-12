import * as stylex from '@stylexjs/stylex';
import { arc } from 'd3-shape';
import { useMemo, type ReactNode, type Ref } from 'react';
import { canObserve, useTween } from '../../internal/charts-motion';
import { useInView } from '../../motion/InView/useInView';
import { makeFormatter, type ValueFormat } from '../../internal/charts-math';
import { svgText, toneStyle, tones } from '../../internal/charts-styles';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { ChartFrame } from '../_shared/ChartFrame';

const styles = stylex.create({
  wrap: { position: 'relative' },
  center: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    inset: 0,
    justifyContent: 'center',
    pointerEvents: 'none',
    position: 'absolute',
  },
  value: {
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-32'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-medium'],
    letterSpacing: font['--oniva-font-track-hero'],
    lineHeight: font['--oniva-font-lh-32'],
  },
  caption: {
    color: colors['--oniva-color-text-muted'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
  },
});

export interface RadialItem {
  label: string;
  value: number;
  /** Full-scale value for this ring (default 100). */
  max?: number;
  tone?: number;
}

export interface RadialChartProps {
  items: RadialItem[];
  size?: number;
  /** Ring thickness in px. */
  thickness?: number;
  /** Total sweep in degrees (270 gives the classic open radial bar). */
  sweep?: number;
  valueFormat?: ValueFormat;
  centerValue?: ReactNode;
  centerLabel?: ReactNode;
  label?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Concentric radial bars, outermost first. */
export function RadialChart({
  items,
  size = 220,
  thickness = 14,
  sweep = 270,
  valueFormat = 'number',
  centerValue,
  centerLabel,
  label,
  className,
  xstyle,
  ref,
}: RadialChartProps) {
  const fmt = makeFormatter(valueFormat);
  const gap = 6;
  const { ref: viewRef, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  const targets = useMemo(() => items.map((it) => Math.min(1, Math.max(0, it.value / (it.max ?? 100)))), [items]);
  /** Sweep from 0 on first in-view, then tween on value changes. */
  const fr = useTween(targets, { fromZero: canObserve(), active: inView, duration: 700 });
  const start = (-sweep / 2) * (Math.PI / 180);
  const span = sweep * (Math.PI / 180);
  return (
    <div ref={viewRef} {...stylex.props(styles.wrap, xstyle)} style={{ height: size, width: size }}>
      <ChartFrame
        label={
          label ?? `Radial chart: ${items.map((i) => `${i.label} ${fmt(i.value)}`).join(', ')}`
        }
        height={size}
        width={size}
        className={className}
        ref={ref}
        dataTable={{
          columns: ['Item', 'Value', 'Max'],
          rows: items.map((i) => [i.label, fmt(i.value), i.max ?? 100]),
        }}
      >
        {({ bind }) => (
          <g transform={`translate(${size / 2},${size / 2})`}>
            {items.map((it, i) => {
              const outer = size / 2 - 2 - i * (thickness + gap);
              const gen = arc()
                .innerRadius(outer - thickness)
                .outerRadius(outer)
                .cornerRadius(thickness / 2);
              const target = targets[i]!;
              const f = fr[i] ?? target;
              return (
                <g key={it.label}>
                  <path
                    d={
                      gen({
                        startAngle: start,
                        endAngle: start + span,
                        innerRadius: 0,
                        outerRadius: 0,
                      }) ?? ''
                    }
                    fill="currentColor"
                    {...stylex.props(tones.track)}
                  />
                  {target > 0 && (
                    <path
                      d={
                        gen({
                          startAngle: start,
                          endAngle: start + span * Math.max(f, 0.0001),
                          innerRadius: 0,
                          outerRadius: 0,
                        }) ?? ''
                      }
                      fill="currentColor"
                      {...stylex.props(toneStyle(it.tone ?? i + 1), svgText.hit)}
                      {...bind(
                        {
                          title: it.label,
                          rows: [
                            { label: 'Value', value: fmt(it.value), tone: it.tone ?? i + 1 },
                            { label: 'Of', value: fmt(it.max ?? 100) },
                          ],
                        },
                        `${it.label}: ${fmt(it.value)} of ${fmt(it.max ?? 100)}`,
                      )}
                    />
                  )}
                </g>
              );
            })}
          </g>
        )}
      </ChartFrame>
      {(centerValue != null || centerLabel != null) && (
        <div {...stylex.props(styles.center)}>
          {centerValue != null && <span {...stylex.props(styles.value)}>{centerValue}</span>}
          {centerLabel != null && <span {...stylex.props(styles.caption)}>{centerLabel}</span>}
        </div>
      )}
    </div>
  );
}
