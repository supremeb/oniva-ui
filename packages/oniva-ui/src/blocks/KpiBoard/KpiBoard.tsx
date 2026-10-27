import * as stylex from '@stylexjs/stylex';
import { useState } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { LineChart } from '../../charts/LineChart';
import { Sparkline } from '../../charts/Sparkline';
import { SegmentedControl, SegmentedControlItem } from '../../components/SegmentedControl/SegmentedControl';
import { Button } from '../../components/Button/Button';
import { useFormatters } from '../../internal/format';
import { mergeSx } from '../../internal/sx';
import { w8 } from '../../internal/w8-styles';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { DeltaBadge } from '../../widgets/DeltaBadge';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';

const rise = stylex.keyframes({ from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } });

const styles = stylex.create({
  rise: {
    animationDelay: 'calc(var(--i, 0) * 45ms)',
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: rise, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    transform: { default: 'translateY(0)', ':hover': { default: null, [media.hover]: 'translateY(-2px)' } },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  head: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', marginBottom: 12 },
  boardTitle: { fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-medium'], margin: 0 },
  grid: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: {
      default: 'repeat(3, minmax(0, 1fr))',
      '@container (max-width: 480px)': 'minmax(0, 1fr)',
    },
  },
  stat: { display: 'flex', flexDirection: 'column', gap: 12, padding: 16 },
  statTop: { alignItems: 'flex-start', display: 'flex', gap: 8, justifyContent: 'space-between' },
  statRight: { alignItems: 'flex-end', display: 'flex', flexDirection: 'column', gap: 2 },
  small: { fontSize: font['--oniva-font-size-14'], fontVariantNumeric: 'tabular-nums', fontWeight: font['--oniva-font-weight-medium'] },
  axis: { color: colors['--oniva-color-text-muted'], display: 'flex', fontSize: font['--oniva-font-size-11'], justifyContent: 'space-between' },
  rule: { borderTopColor: colors['--oniva-color-border'], borderTopStyle: 'solid', borderTopWidth: 1, marginBlock: 4 },
  cardHead: { alignItems: 'flex-start', display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between' },
  mid: { fontSize: font['--oniva-font-size-24'], fontVariantNumeric: 'tabular-nums', fontWeight: font['--oniva-font-weight-semibold'], letterSpacing: font['--oniva-font-track-hero'], lineHeight: 1.1 },
  split: { color: colors['--oniva-color-text-muted'], display: 'flex', flexWrap: 'wrap', fontSize: font['--oniva-font-size-12'], gap: 12 },
  fullBtn: { width: '100%' },
  spark: { display: 'block', maxWidth: '100%' },
  legend: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'flex', flexWrap: 'wrap', fontSize: font['--oniva-font-size-12'], gap: 12 },
  swatch: { borderRadius: 4, display: 'inline-block', height: 8, marginInlineEnd: 6, width: 8 },
  sw1: { backgroundColor: colors['--oniva-color-chart-1'] },
  sw2: { backgroundColor: colors['--oniva-color-chart-2'] },
  focus: { display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'space-between' },
  icon: { alignItems: 'center', backgroundColor: colors['--oniva-color-accent-soft'], borderRadius: 10, color: colors['--oniva-color-accent-soft-fg'], display: 'inline-flex', height: 36, justifyContent: 'center', width: 36 },
  o: { gridColumn: { default: 'span 2', '@container (max-width: 640px)': '1 / -1', '@container (max-width: 480px)': 'auto' } },
  f: { gridColumn: { default: 'span 1', '@container (max-width: 640px)': '1 / -1', '@container (max-width: 480px)': 'auto' } },
  chart: { marginTop: 8 },
});

export interface KpiBoardStat {
  id: string;
  label: string;
  value: number;
  /** `money` uses the board's currency, `number` plain grouping, `percent` treats the value as a ratio. */
  kind?: 'money' | 'number' | 'percent';
  /** Signed change in percent (12.4 = +12.4%). */
  delta: number;
  /** When lower is better (refunds, churn). */
  lowerIsBetter?: boolean;
  trend: number[];
}
export interface KpiBoardOverview {
  labels: string[];
  current: number[];
  previous: number[];
}
export interface KpiBoardFocus {
  name: string;
  detail?: string;
  value: number;
  delta: number;
  trend: number[];
}
export interface KpiBoardData {
  stats: KpiBoardStat[];
  /** One overview per segment id (`all` when no segments are given). */
  overview: Record<string, KpiBoardOverview>;
  focus: KpiBoardFocus;
}
export interface KpiBoardOption {
  id: string;
  label: string;
}

export interface KpiBoardProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'title' | 'onChange'> {
  data?: Record<string, KpiBoardData>;
  ranges?: KpiBoardOption[];
  range?: string;
  defaultRange?: string;
  onRangeChange?: (id: string) => void;
  segments?: KpiBoardOption[];
  segment?: string;
  defaultSegment?: string;
  onSegmentChange?: (id: string) => void;
  compareLabel?: string;
  currentLabel?: string;
  previousLabel?: string;
  /** ISO currency for money values. Default `USD`. */
  currency?: string;
  title?: string;
  icon?: ReactNode;
  action?: { label: string; onPress: () => void };
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

const wk = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const mk = (cur: number[], prev: number[]): KpiBoardOverview => ({ labels: wk.slice(0, cur.length), current: cur, previous: prev });

export const defaultRanges: KpiBoardOption[] = [
  { id: '7d', label: '7 days' },
  { id: '30d', label: '30 days' },
];
export const defaultSegments: KpiBoardOption[] = [
  { id: 'all', label: 'All plans' },
  { id: 'team', label: 'Team' },
];
export const defaultData: Record<string, KpiBoardData> = {
  '7d': {
    stats: [
      { id: 'rev', label: 'Revenue', value: 48210, kind: 'money', delta: 12.4, trend: [8, 9, 7, 11, 12, 10, 14] },
      { id: 'runs', label: 'Traced runs', value: 312400, kind: 'number', delta: 8.1, trend: [30, 34, 33, 38, 41, 40, 44] },
      { id: 'err', label: 'Failed runs', value: 0.021, kind: 'percent', delta: -9.2, lowerIsBetter: true, trend: [5, 6, 5, 4, 4, 3, 3] },
    ],
    overview: { all: mk([6200, 6900, 6400, 7800, 8300, 6100, 6500], [5400, 6100, 6000, 6600, 7200, 5600, 5900]), team: mk([3100, 3400, 3300, 4100, 4500, 3000, 3200], [2800, 3000, 3000, 3300, 3800, 2900, 2900]) },
    focus: { name: 'Team plan', detail: '214 active workspaces', value: 21860, delta: 14.8, trend: [4, 5, 5, 7, 8, 8, 10] },
  },
  '30d': {
    stats: [
      { id: 'rev', label: 'Revenue', value: 201940, kind: 'money', delta: 6.3, trend: [30, 32, 31, 36, 35, 40, 42] },
      { id: 'runs', label: 'Traced runs', value: 1304000, kind: 'number', delta: 11.7, trend: [120, 130, 128, 150, 160, 158, 175] },
      { id: 'err', label: 'Failed runs', value: 0.026, kind: 'percent', delta: 3.1, lowerIsBetter: true, trend: [4, 4, 5, 5, 4, 5, 6] },
    ],
    overview: { all: mk([6800, 7100, 6900, 7600, 8000, 7400, 7900], [6300, 6500, 6600, 7000, 7300, 7000, 7200]), team: mk([3400, 3500, 3600, 3900, 4200, 3900, 4100], [3100, 3200, 3300, 3500, 3700, 3600, 3700]) },
    focus: { name: 'Team plan', detail: '214 active workspaces', value: 84300, delta: 9.4, trend: [20, 22, 23, 26, 25, 29, 31] },
  },
};

export function KpiBoard({
  data = defaultData,
  ranges = defaultRanges,
  range: rangeProp,
  defaultRange,
  onRangeChange,
  segments,
  segment: segProp,
  defaultSegment,
  onSegmentChange,
  compareLabel = 'vs. last period',
  currentLabel = 'This period',
  previousLabel = 'Last period',
  currency = 'USD',
  title = 'Overview',
  icon,
  action,
  className,
  xstyle,
  ref,
  ...rest
}: KpiBoardProps) {
  const segs = segments ?? (data === defaultData ? defaultSegments : undefined);
  const [r, setR] = useState(defaultRange ?? ranges[0]!.id);
  const [s, setS] = useState(defaultSegment ?? segs?.[0]?.id ?? 'all');
  const range = rangeProp ?? r;
  const segment = segProp ?? s;
  const d = data[range] ?? data[ranges[0]!.id]!;
  const ov = d.overview[segment] ?? Object.values(d.overview)[0]!;
  const { compact, currency: money } = useFormatters();
  const rows = ov.labels.map((label, i) => ({ label, current: ov.current[i] ?? 0, previous: ov.previous[i] ?? 0 }));
  const fmt = (st: KpiBoardStat): Intl.NumberFormatOptions =>
    st.kind === 'money' ? { style: 'currency', currency, maximumFractionDigits: 0 } : st.kind === 'percent' ? { style: 'percent', maximumFractionDigits: 1 } : { maximumFractionDigits: 0 };
  const sx = stylex.props(w8.root, xstyle);
  return (
    <section ref={ref} aria-label={title} {...rest} {...mergeSx(sx, className)}>
      <div {...stylex.props(w8.panel)}>
        <div {...stylex.props(styles.head)}>
          <h2 {...stylex.props(styles.boardTitle)}>{title}</h2>
          <SegmentedControl
            size="sm"
            aria-label="Date range"
            value={range}
            onChange={(v) => {
              setR(v);
              onRangeChange?.(v);
            }}
          >
            {ranges.map((x) => (
              <SegmentedControlItem key={x.id} value={x.id}>
                {x.label}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
        </div>
        <div {...stylex.props(styles.grid)}>
          {d.stats.slice(0, 3).map((st, i) => (
            <article key={st.id} aria-label={st.label} {...mergeSx(stylex.props(w8.tile, styles.stat, styles.rise), undefined, { '--i': i } as React.CSSProperties)}>
              <div {...stylex.props(styles.statTop)}>
                <div>
                  <AnimatedNumber xstyle={styles.small} value={st.value} format={fmt(st)} />
                  <div {...stylex.props(w8.muted)}>{st.label}</div>
                </div>
                <div {...stylex.props(styles.statRight)}>
                  <DeltaBadge value={st.delta} invert={st.lowerIsBetter} size="sm" />
                  <span {...stylex.props(w8.muted)}>{compareLabel}</span>
                </div>
              </div>
              <Sparkline key={`${range}-${st.id}`} data={st.trend} variant="area" tone={i + 1} width={320} height={64} label={`${st.label} trend`} xstyle={styles.spark} />
              <div aria-hidden="true" {...stylex.props(styles.axis)}>
                <span>{ov.labels[0]}</span>
                <span>{ov.labels[ov.labels.length - 1]}</span>
              </div>
            </article>
          ))}
          <article aria-label="Overview chart" {...mergeSx(stylex.props(w8.tile, styles.stat, styles.o, styles.rise), undefined, { '--i': 3 } as React.CSSProperties)}>
            <div {...stylex.props(styles.head)}>
              <div>
                <h3 {...stylex.props(w8.muted)}>Revenue by day</h3>
                <div {...stylex.props(w8.row)} style={{ alignItems: 'baseline' }}>
                  <span {...stylex.props(styles.mid)}>{money(rows.reduce((n, x) => n + x.current, 0), currency, { maximumFractionDigits: 0 })}</span>
                  <span {...stylex.props(w8.muted)}>{compareLabel}</span>
                </div>
              </div>
              {segs && (
                <SegmentedControl
                  size="sm"
                  aria-label="Plan filter"
                  value={segment}
                  onChange={(v) => {
                    setS(v);
                    onSegmentChange?.(v);
                  }}
                >
                  {segs.map((x) => (
                    <SegmentedControlItem key={x.id} value={x.id}>
                      {x.label}
                    </SegmentedControlItem>
                  ))}
                </SegmentedControl>
              )}
            </div>
            <div {...stylex.props(styles.legend)}>
              <span>
                <i {...stylex.props(styles.swatch, styles.sw1)} />
                {currentLabel}
              </span>
              <span>
                <i {...stylex.props(styles.swatch, styles.sw2)} />
                {previousLabel}
              </span>
            </div>
            <LineChart
              key={`${range}-${segment}`}
              xstyle={styles.chart}
              data={rows}
              index="label"
              series={[
                { key: 'current', label: currentLabel, tone: 1 },
                { key: 'previous', label: previousLabel, tone: 2 },
              ]}
              valueFormat={(n) => compact(n)}
              height={200}
              label={`${currentLabel} compared with ${previousLabel}, ${ov.labels.length} points`}
            />
          </article>
          <article aria-label={`${d.focus.name} focus`} {...mergeSx(stylex.props(w8.tile, styles.stat, styles.focus, styles.f, styles.rise), undefined, { '--i': 4 } as React.CSSProperties)}>
            <div {...stylex.props(styles.cardHead)}>
              <div {...stylex.props(w8.row)}>
                <span {...stylex.props(styles.icon)} aria-hidden="true">
                  {icon ?? d.focus.name.slice(0, 1)}
                </span>
                <div>
                  <h3 {...stylex.props(w8.h3)}>{d.focus.name}</h3>
                  {d.focus.detail && <p {...stylex.props(w8.muted)}>{d.focus.detail}</p>}
                </div>
              </div>
              <DeltaBadge value={d.focus.delta} size="sm" />
            </div>
            <div aria-hidden="true" {...stylex.props(styles.rule)} />
            <AnimatedNumber xstyle={styles.mid} value={d.focus.value} format={{ style: 'currency', currency, maximumFractionDigits: 0 }} />
            <Sparkline key={`${range}-focus`} data={d.focus.trend} variant="area" tone={3} width={320} height={56} label={`${d.focus.name} trend`} xstyle={styles.spark} />
            <div aria-hidden="true" {...stylex.props(styles.rule)} />
            <span {...stylex.props(styles.split)} aria-hidden="true">
              <span>{compareLabel}</span>
              <span>{money(d.focus.value / (1 + d.focus.delta / 100), currency, { maximumFractionDigits: 0 })} {previousLabel.toLowerCase()}</span>
              <span>{money(d.focus.value, currency, { maximumFractionDigits: 0 })} {currentLabel.toLowerCase()}</span>
            </span>
            {action && (
              <Button variant="secondary" xstyle={styles.fullBtn} onPress={action.onPress}>
                {action.label}
              </Button>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}
