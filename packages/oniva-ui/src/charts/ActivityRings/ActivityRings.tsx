import * as stylex from '@stylexjs/stylex';
import { arc } from 'd3-shape';
import type { ReactNode, Ref } from 'react';
import { chartMotion, svgText, toneStyle, tones } from '../../internal/charts-styles';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { ChartFrame } from '../_shared/ChartFrame';

const styles = stylex.create({
  wrap: { display: 'inline-block', position: 'relative' },
  center: {
    alignItems: 'center',
    color: colors['--oniva-color-text'],
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    inset: 0,
    justifyContent: 'center',
    pointerEvents: 'none',
    position: 'absolute',
  },
});

export interface ActivityRing {
  label: string;
  value: number;
  /** Goal (ring completes at this value). */
  goal: number;
  /** Unit appended to the tooltip value, e.g. "kcal". */
  unit?: string;
  tone?: number;
}

export interface ActivityRingsProps {
  rings: ActivityRing[];
  size?: number;
  thickness?: number;
  /** Optional centre content. */
  children?: ReactNode;
  label?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const DEFAULT_TONES = [3, 2, 4, 5];

/** Fitness-style concentric progress rings (goal-based; pink / lime / sky by default). */
export function ActivityRings({
  rings,
  size = 120,
  thickness = 12,
  children,
  label,
  className,
  xstyle,
  ref,
}: ActivityRingsProps) {
  const gap = Math.max(2, thickness * 0.2);
  return (
    <div {...stylex.props(styles.wrap, xstyle)} style={{ height: size, width: size }}>
      <ChartFrame
        label={
          label ??
          `Activity rings: ${rings.map((r) => `${r.label} ${r.value}${r.unit ? ` ${r.unit}` : ''} of ${r.goal}`).join(', ')}`
        }
        height={size}
        width={size}
        className={className}
        ref={ref}
        dataTable={{
          columns: ['Ring', 'Value', 'Goal'],
          rows: rings.map((r) => [r.label, r.value, r.goal]),
        }}
      >
        {({ bind }) => (
          <g transform={`translate(${size / 2},${size / 2})`}>
            {rings.map((r, i) => {
              const outer = size / 2 - 1 - i * (thickness + gap);
              const gen = arc()
                .innerRadius(outer - thickness)
                .outerRadius(outer)
                .cornerRadius(thickness / 2);
              const f = Math.min(1, r.value / (r.goal || 1));
              const tone = r.tone ?? DEFAULT_TONES[i % DEFAULT_TONES.length]!;
              return (
                <g key={r.label}>
                  <path
                    d={
                      gen({
                        startAngle: 0,
                        endAngle: Math.PI * 2 - 0.001,
                        innerRadius: 0,
                        outerRadius: 0,
                      }) ?? ''
                    }
                    fill="currentColor"
                    fillOpacity={0.55}
                    {...stylex.props(tones.track)}
                  />
                  {f > 0 && (
                    <path
                      d={
                        gen({
                          startAngle: 0,
                          endAngle: Math.max(0.12, Math.PI * 2 * f - 0.001),
                          innerRadius: 0,
                          outerRadius: 0,
                        }) ?? ''
                      }
                      fill="currentColor"
                      {...stylex.props(toneStyle(tone), svgText.hit, chartMotion.fade)}
                      style={{ animationDelay: `${i * 120}ms` }}
                      {...bind(
                        {
                          title: r.label,
                          rows: [
                            {
                              label: 'Progress',
                              value: `${r.value}${r.unit ? ` ${r.unit}` : ''}`,
                              tone,
                            },
                            { label: 'Goal', value: `${r.goal}${r.unit ? ` ${r.unit}` : ''}` },
                            {
                              label: 'Complete',
                              value: `${Math.round((r.value / (r.goal || 1)) * 100)}%`,
                            },
                          ],
                        },
                        `${r.label}: ${r.value} of ${r.goal}${r.unit ? ` ${r.unit}` : ''}`,
                      )}
                    />
                  )}
                </g>
              );
            })}
          </g>
        )}
      </ChartFrame>
      {children != null && <div {...stylex.props(styles.center)}>{children}</div>}
    </div>
  );
}
