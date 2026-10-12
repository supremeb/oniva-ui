import * as stylex from '@stylexjs/stylex';
import { useState, type Ref } from 'react';
import { Card, CardHeader, CardHeaderText, CardTitle, Tile } from '../../components/Card';
import { SegmentRing } from '../../internal/widgets-ring';
import { RangeSwitcher } from '../../internal/widgets-parts';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  verdict: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-24'],
    fontWeight: font['--oniva-font-weight-medium'],
    letterSpacing: font['--oniva-font-track-hero'],
    lineHeight: font['--oniva-font-lh-24'],
    margin: 0,
  },
  ring: { display: 'flex', justifyContent: 'center', paddingBlock: 8 },
  rows: { display: 'flex', flexDirection: 'column' },
  row: {
    alignItems: 'center',
    borderBottomColor: colors['--oniva-color-separator'],
    borderBottomStyle: 'solid',
    borderBottomWidth: { default: 1, ':last-child': 0 },
    color: colors['--oniva-color-text'],
    display: 'flex',
    fontSize: font['--oniva-font-size-14'],
    gap: 10,
    lineHeight: font['--oniva-font-lh-14'],
    paddingBlock: 10,
  },
  label: { flexGrow: 1, minWidth: 0 },
  detail: { color: colors['--oniva-color-text-muted'] },
  score: { fontFeatureSettings: "'tnum'", fontWeight: font['--oniva-font-weight-medium'] },
  dot: { borderRadius: radius['--oniva-radius-xs'], flexShrink: 0, height: 10, width: 10 },
  t5: { backgroundColor: colors['--oniva-color-chart-5'] },
  t3: { backgroundColor: colors['--oniva-color-chart-3'] },
  t6: { backgroundColor: colors['--oniva-color-chart-6'] },
  t1: { backgroundColor: colors['--oniva-color-chart-1'] },
  t2: { backgroundColor: colors['--oniva-color-chart-2'] },
  t4: { backgroundColor: colors['--oniva-color-chart-4'] },
});

const DOTS = [styles.t5, styles.t3, styles.t6, styles.t1, styles.t2, styles.t4];

export interface SleepFactor {
  /** e.g. "Duration". */
  label: string;
  /** e.g. "7h 50m". */
  detail: string;
  score: number;
  max: number;
}

export interface SleepNight {
  label: string;
  score: number;
  factors: SleepFactor[];
}

export interface SleepScoreWidgetProps {
  nights: SleepNight[];
  defaultIndex?: number;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const verdict = (s: number) =>
  s >= 90 ? 'Excellent' : s >= 75 ? 'Good' : s >= 60 ? 'Fair' : 'Poor';

/** Sleep score ring with verdict and a per-factor breakdown (colored dot, detail, n/max). */
export function SleepScoreWidget({
  nights,
  defaultIndex,
  className,
  xstyle,
  ref,
}: SleepScoreWidgetProps) {
  const [i, setI] = useState(defaultIndex ?? Math.max(0, nights.length - 1));
  const night = nights[Math.min(i, nights.length - 1)];
  if (!night) return null;
  return (
    <Card ref={ref} className={className} xstyle={xstyle}>
      <CardHeader>
        <CardHeaderText>
          <CardTitle>Sleep score</CardTitle>
          <p {...stylex.props(styles.verdict)}>{verdict(night.score)}</p>
        </CardHeaderText>
        <RangeSwitcher
          label={night.label}
          prevLabel="Previous night"
          nextLabel="Next night"
          prevDisabled={i <= 0}
          nextDisabled={i >= nights.length - 1}
          onPrev={() => setI(i - 1)}
          onNext={() => setI(i + 1)}
          minLabelWidth={104}
        />
      </CardHeader>
      <div {...stylex.props(styles.ring)}>
        <SegmentRing
          label={`Sleep score ${night.score} out of 100`}
          segments={night.factors.map((f, k) => ({
            label: f.label,
            value: f.score,
            tone: [5, 3, 6, 1, 2, 4][k % 6] ?? 5,
          }))}
        >
          {night.score}
        </SegmentRing>
      </div>
      <Tile padding="sm">
        <div {...stylex.props(styles.rows)}>
          {night.factors.map((f, k) => (
            <div key={f.label} {...stylex.props(styles.row)}>
              <span aria-hidden="true" {...stylex.props(styles.dot, DOTS[k % 6])} />
              <span {...stylex.props(styles.label)}>
                {f.label}: <span {...stylex.props(styles.detail)}>{f.detail}</span>
              </span>
              <span {...stylex.props(styles.score)}>
                {f.score}/{f.max}
              </span>
            </div>
          ))}
        </div>
      </Tile>
    </Card>
  );
}
