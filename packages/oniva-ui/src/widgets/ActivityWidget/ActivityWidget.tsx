import * as stylex from '@stylexjs/stylex';
import type { Ref } from 'react';
import { ActivityRings } from '../../charts/ActivityRings';
import { Card, CardHeader, CardHeaderText, CardTitle, Tile } from '../../components/Card';
import { fmtInt } from '../../internal/widgets-parts';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  ringWrap: { display: 'flex', justifyContent: 'center', paddingBlock: 8 },
  tiles: { display: 'grid', gap: 8, gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
  tile: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: {
    alignItems: 'center',
    color: colors.textMuted,
    display: 'flex',
    fontSize: font.size13,
    gap: 6,
    lineHeight: font.lh13,
  },
  dot: { borderRadius: radius.full, flexShrink: 0, height: 8, width: 8 },
  move: { backgroundColor: colors.chart3 },
  exercise: { backgroundColor: colors.chart2 },
  running: { backgroundColor: colors.chart4 },
  big: {
    color: colors.text,
    fontFeatureSettings: "'tnum'",
    fontSize: font.size18,
    fontWeight: font.weightMedium,
    lineHeight: font.lh18,
  },
  goal: { color: colors.textMuted, fontSize: font.size12, fontWeight: font.weightRegular },
});

export interface ActivityMetric {
  value: number;
  goal: number;
}

export interface ActivityWidgetProps {
  title?: string;
  /** Calories burned. */
  move: ActivityMetric;
  /** Minutes of exercise. */
  exercise: ActivityMetric;
  /** Kilometres run. */
  running: ActivityMetric;
  /** Ring diameter in px. */
  ringSize?: number;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Fitness summary: concentric Move / Exercise / Running rings with a stat tile per ring. */
export function ActivityWidget({
  title = 'Activity',
  move,
  exercise,
  running,
  ringSize = 148,
  className,
  xstyle,
  ref,
}: ActivityWidgetProps) {
  const km = (n: number) => n.toFixed(1);
  const rows = [
    { key: 'Move', unit: 'kcal', m: move, dot: styles.move, fmt: fmtInt },
    { key: 'Exercise', unit: 'min', m: exercise, dot: styles.exercise, fmt: fmtInt },
    { key: 'Running', unit: 'km', m: running, dot: styles.running, fmt: km },
  ];
  return (
    <Card ref={ref} className={className} xstyle={xstyle}>
      <CardHeader>
        <CardHeaderText>
          <CardTitle>{title}</CardTitle>
        </CardHeaderText>
      </CardHeader>
      <div {...stylex.props(styles.ringWrap)}>
        <ActivityRings
          size={ringSize}
          thickness={14}
          rings={[
            { label: 'Move', value: move.value, goal: move.goal, unit: 'kcal', tone: 3 },
            { label: 'Exercise', value: exercise.value, goal: exercise.goal, unit: 'min', tone: 2 },
            { label: 'Running', value: running.value, goal: running.goal, unit: 'km', tone: 4 },
          ]}
        />
      </div>
      <div {...stylex.props(styles.tiles)}>
        {rows.map((r) => (
          <Tile key={r.key} padding="sm">
            <div {...stylex.props(styles.tile)}>
              <span {...stylex.props(styles.label)}>
                <span aria-hidden="true" {...stylex.props(styles.dot, r.dot)} />
                {r.key}
              </span>
              <span {...stylex.props(styles.big)}>
                {r.fmt(r.m.value)}
                <span {...stylex.props(styles.goal)}>
                  {' '}
                  / {r.fmt(r.m.goal)} {r.unit}
                </span>
              </span>
            </div>
          </Tile>
        ))}
      </div>
    </Card>
  );
}
