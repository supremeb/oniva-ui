import * as stylex from '@stylexjs/stylex';
import { useState, type Ref } from 'react';
import { BarChart } from '../../charts/BarChart';
import { Card, CardHeader, CardHeaderText, CardTitle } from '../../components/Card';
import { fmtInt, RangeSwitcher, wstyles } from '../../internal/widgets-parts';

const styles = stylex.create({ chart: { paddingInline: 4 } });

export interface StepsWeek {
  /** Label such as "29 Jun – 5 Jul". */
  label: string;
  /** Seven entries Mon..Sun. */
  data: { day: string; steps: number }[];
}

export interface StepsWidgetProps {
  weeks: StepsWeek[];
  /** Initially selected week index (default last). */
  defaultIndex?: number;
  index?: number;
  onIndexChange?: (index: number) => void;
  height?: number;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Weekly step totals as rounded teal bars on a gray track, with a week switcher. */
export function StepsWidget({
  weeks,
  defaultIndex,
  index,
  onIndexChange,
  height = 240,
  className,
  xstyle,
  ref,
}: StepsWidgetProps) {
  const [inner, setInner] = useState(defaultIndex ?? Math.max(0, weeks.length - 1));
  const i = Math.min(Math.max(index ?? inner, 0), Math.max(0, weeks.length - 1));
  const go = (n: number) => {
    setInner(n);
    onIndexChange?.(n);
  };
  const week = weeks[i];
  const total = week ? week.data.reduce((s, d) => s + d.steps, 0) : 0;
  return (
    <Card ref={ref} className={className} xstyle={xstyle}>
      <CardHeader>
        <CardHeaderText>
          <CardTitle>Steps</CardTitle>
          <div {...stylex.props(wstyles.valueRow)}>
            <p {...stylex.props(wstyles.value)}>{fmtInt(total)}</p>
            <span {...stylex.props(wstyles.unit)}>total steps</span>
          </div>
        </CardHeaderText>
        <RangeSwitcher
          label={week?.label ?? ''}
          prevLabel="Previous week"
          nextLabel="Next week"
          prevDisabled={i <= 0}
          nextDisabled={i >= weeks.length - 1}
          onPrev={() => go(i - 1)}
          onNext={() => go(i + 1)}
          minLabelWidth={112}
        />
      </CardHeader>
      {week && (
        <div {...stylex.props(styles.chart)}>
          <BarChart
            data={week.data}
            index="day"
            series={[{ key: 'steps', label: 'Steps', tone: 1 }]}
            track
            barRadius={12}
            padding={0.12}
            height={height}
            showGrid={false}
            showYAxis={false}
            valueFormat="number"
            label={`Steps per day, ${week.label}`}
          />
        </div>
      )}
    </Card>
  );
}
