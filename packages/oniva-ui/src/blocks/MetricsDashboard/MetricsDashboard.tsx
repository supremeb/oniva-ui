import * as stylex from '@stylexjs/stylex';
import { BarChart3, Check, Download, LineChart as LineIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-aria-components';
import { BarChart } from '../../charts/BarChart';
import { LineChart } from '../../charts/LineChart';
import { Button } from '../../components/Button/Button';
import { SegmentedControl, SegmentedControlItem } from '../../components/SegmentedControl/SegmentedControl';
import { ToggleButton } from '../../components/ToggleButton/ToggleButton';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { mergeSx } from '../../internal/sx';
import { w8 } from '../../internal/w8-styles';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { DeltaBadge } from '../../widgets/DeltaBadge';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const panelIn = stylex.keyframes({ from: { opacity: 0, transform: 'translateY(6px)' }, to: { opacity: 1, transform: 'translateY(0)' } });
const fillIn = stylex.keyframes({ from: { transform: 'scaleX(0)' } });

const styles = stylex.create({
  head: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', marginBottom: 16 },
  kpis: {
    display: 'grid',
    gap: 8,
    gridTemplateColumns: { default: 'repeat(4, minmax(0, 1fr))', '@container (max-width: 640px)': 'repeat(2, minmax(0, 1fr))' },
    marginBottom: 12,
  },
  kpi: {
    alignItems: 'flex-start',
    backgroundColor: { default: colors['--oniva-color-surface-inset'], ':is([data-selected])': colors['--oniva-color-surface-inner'] },
    borderColor: { default: colors['--oniva-color-border'], ':is([data-selected])': colors['--oniva-color-border-active'] },
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    minWidth: 0,
    padding: 12,
    transitionDuration: motion['--oniva-motion-dur-base'],
    opacity: { default: 0.62, ':is([data-selected])': 1, ':hover': { default: null, [media.hover]: 1 } },
    transitionProperty: 'background-color, border-color, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  kpiValue: { fontSize: { default: font['--oniva-font-size-24'], '@container (max-width: 460px)': font['--oniva-font-size-18'] }, fontVariantNumeric: 'tabular-nums', fontWeight: font['--oniva-font-weight-semibold'], letterSpacing: font['--oniva-font-track-hero'] },
  tools: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between', marginBottom: 8 },
  lists: { display: 'grid', gap: 24, gridTemplateColumns: { default: 'repeat(2, minmax(0, 1fr))', '@container (max-width: 640px)': 'minmax(0, 1fr)' }, marginTop: 12 },
  item: { alignItems: 'center', display: 'flex', fontSize: font['--oniva-font-size-13'], gap: 8, justifyContent: 'space-between', minHeight: 32, paddingInline: 8, position: 'relative' },
  itemText: { position: 'relative' },
  bar: { backgroundColor: colors['--oniva-color-accent-soft'], borderRadius: radius['--oniva-radius-md'], inset: 0, overflow: 'hidden', position: 'absolute', transformOrigin: 'left' },
  listHead: { color: colors['--oniva-color-text-muted'], display: 'flex', fontSize: font['--oniva-font-size-12'], justifyContent: 'space-between', paddingInline: 8 },
  listTitle: { color: colors['--oniva-color-text'], fontWeight: font['--oniva-font-weight-medium'] },
  group: { display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 },
  split: { borderTopColor: colors['--oniva-color-border'], borderTopStyle: 'solid', borderTopWidth: 1, marginTop: 12, paddingTop: 16 },
  legend: { alignItems: 'center', display: 'inline-flex', fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-medium'], gap: 8 },
  legendLine: { backgroundColor: colors['--oniva-color-chart-1'], borderRadius: 2, height: 2, width: 12 },
  fill: {
    display: 'block',
    animationDelay: 'calc(var(--i, 0) * 50ms)',
    animationDuration: motion['--oniva-motion-dur-sheet'],
    animationFillMode: 'backwards',
    animationName: { default: fillIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    transformOrigin: 'left',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  panelBox: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationName: { default: panelIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'block',
    minWidth: 0,
  },
  chartWrap: { minWidth: 0 },
});

type MetricId = 'revenue' | 'orders' | 'aov' | 'refunds';
type RangeId = '7d' | '30d' | '90d';
const RANGES: { id: RangeId; label: string; n: number; scale: number }[] = [
  { id: '7d', label: 'Week', n: 7, scale: 1 },
  { id: '30d', label: 'Month', n: 30, scale: 4.2 },
  { id: '90d', label: 'Quarter', n: 30, scale: 12.5 },
];
const METRICS: { id: MetricId; label: string; base: number; kind: 'money' | 'number' | 'percent'; delta: number; lowerIsBetter?: boolean; sum: boolean }[] = [
  { id: 'revenue', label: 'Revenue', base: 4200, kind: 'money', delta: 8.6, sum: true },
  { id: 'orders', label: 'Orders', base: 96, kind: 'number', delta: 4.2, sum: true },
  { id: 'aov', label: 'Avg. order', base: 43.5, kind: 'money', delta: 2.1, sum: false },
  { id: 'refunds', label: 'Refund rate', base: 0.031, kind: 'percent', delta: -5.4, lowerIsBetter: true, sum: false },
];
const PRODUCTS = [
  { name: 'Canvas tote', value: 0.34 },
  { name: 'Ceramic mug set', value: 0.27 },
  { name: 'Linen throw', value: 0.21 },
  { name: 'Brass desk lamp', value: 0.18 },
];
const CHANNELS = [
  { name: 'Organic search', value: 0.41 },
  { name: 'Email', value: 0.29 },
  { name: 'Paid social', value: 0.18 },
  { name: 'Direct', value: 0.12 },
];

/** Deterministic pseudo-series so the demo is stable between renders. */
function series(metric: (typeof METRICS)[number], range: (typeof RANGES)[number]) {
  const seed = metric.id.length * 3 + range.n;
  return Array.from({ length: range.n }, (_, i) => {
    const wave = 1 + 0.18 * Math.sin((i + seed) / 2.1) + 0.08 * Math.cos((i * seed) / 5);
    const v = metric.base * wave * (metric.sum ? range.scale / Math.max(1, range.n / 7) : 1);
    return Math.round(v * 1000) / 1000;
  });
}

export interface MetricsDashboardProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'title'> {
  title?: string;
  /** Workspace / store name under the title. */
  site?: string;
  defaultRange?: RangeId;
  defaultMetric?: MetricId;
  /** ISO currency. Default `USD`. */
  currency?: string;
  onExport?: (range: RangeId, metric: MetricId) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function MetricsDashboard({ title = 'Sales', site = 'Northwind Store', defaultRange = '30d', defaultMetric = 'revenue', currency = 'USD', onExport, className, xstyle, ref, ...rest }: MetricsDashboardProps) {
  const [range, setRange] = useState<RangeId>(defaultRange);
  const [metric, setMetric] = useState<MetricId>(defaultMetric);
  const [kind, setKind] = useState<'line' | 'bar'>('line');
  const [done, setDone] = useState(false);
  const { compact, percent, currency: money, number } = useFormatters();
  const rg = RANGES.find((r) => r.id === range)!;
  const mt = METRICS.find((m) => m.id === metric)!;
  const all = useMemo(() => Object.fromEntries(METRICS.map((m) => [m.id, series(m, rg)])) as Record<MetricId, number[]>, [rg]);
  const total = (m: (typeof METRICS)[number]) => {
    const s = all[m.id];
    return m.sum ? s.reduce((a, b) => a + b, 0) : s.reduce((a, b) => a + b, 0) / s.length;
  };
  const fmtOpts = (m: (typeof METRICS)[number]): Intl.NumberFormatOptions =>
    m.kind === 'money' ? { style: 'currency', currency, maximumFractionDigits: m.id === 'aov' ? 2 : 0 } : m.kind === 'percent' ? { style: 'percent', maximumFractionDigits: 1 } : { maximumFractionDigits: 0 };
  const fmtVal = (n: number) => (mt.kind === 'money' ? money(n, currency, { maximumFractionDigits: 0 }) : mt.kind === 'percent' ? percent(n, 1) : number(Math.round(n)));
  const rows = all[metric].map((v, i) => ({ day: `${i + 1}`, value: v }));
  const sx = stylex.props(w8.root, xstyle);
  return (
    <section ref={ref} aria-label={title} {...rest} {...mergeSx(sx, className)}>
      <div {...stylex.props(w8.panel)}>
        <div {...stylex.props(styles.head)}>
          <div>
            <h2 {...stylex.props(w8.title)}>{title}</h2>
            <p {...stylex.props(w8.muted)}>{site} · Last {rg.n === 7 ? '7' : range === '90d' ? '90' : '30'} days</p>
          </div>
          <div {...stylex.props(w8.row)}>
            <SegmentedControl size="sm" aria-label="Period" value={range} onChange={(v) => setRange(v as RangeId)}>
              {RANGES.map((r) => (
                <SegmentedControlItem key={r.id} value={r.id}>
                  {r.label}
                </SegmentedControlItem>
              ))}
            </SegmentedControl>
            <Button
              size="sm"
              variant="secondary"
              startIcon={done ? <Check size={14} aria-hidden="true" /> : <Download size={14} aria-hidden="true" />}
              onPress={() => {
                onExport?.(range, metric);
                setDone(true);
                setTimeout(() => setDone(false), 1800);
              }}
            >
              {done ? 'Exported' : 'Export'}
            </Button>
          </div>
        </div>
        <Tabs selectedKey={metric} onSelectionChange={(k) => setMetric(k as MetricId)}>
          <TabList aria-label="Metric" {...stylex.props(styles.kpis)}>
            {METRICS.map((m) => (
              <Tab key={m.id} id={m.id} {...stylex.props(styles.kpi, focus.ring)}>
                <span {...stylex.props(w8.muted)}>{m.label}</span>
                <AnimatedNumber xstyle={styles.kpiValue} value={total(m)} format={fmtOpts(m)} />
                <DeltaBadge value={m.delta} invert={m.lowerIsBetter} size="sm" />
              </Tab>
            ))}
          </TabList>
          <TabPanel id={metric} {...stylex.props(styles.panelBox)}>
        <div {...stylex.props(w8.tile)}>
          <div {...stylex.props(styles.tools)}>
            <h3 {...stylex.props(styles.legend)}>
              <span aria-hidden="true" {...stylex.props(styles.legendLine)} />
              {mt.label} over time
            </h3>
            <div role="group" aria-label="Chart type" {...stylex.props(w8.row)}>
              <ToggleButton size="xs" variant="secondary" isSelected={kind === 'line'} onChange={() => setKind('line')} startIcon={<LineIcon size={14} aria-hidden="true" />}>
                Line
              </ToggleButton>
              <ToggleButton size="xs" variant="secondary" isSelected={kind === 'bar'} onChange={() => setKind('bar')} startIcon={<BarChart3 size={14} aria-hidden="true" />}>
                Bars
              </ToggleButton>
            </div>
          </div>
          <div {...stylex.props(styles.chartWrap)}>
            {kind === 'line' ? (
              <LineChart data={rows} index="day" series={[{ key: 'value', label: mt.label }]} dots valueFormat={(n) => (mt.kind === 'money' ? compact(n) : mt.kind === 'percent' ? percent(n, 1) : compact(n))} height={200} label={`${mt.label}, ${rg.label.toLowerCase()}, ${rows.length} points, total ${fmtVal(total(mt))}`} />
            ) : (
              <BarChart data={rows} index="day" series={[{ key: 'value', label: mt.label }]} valueFormat={(n) => (mt.kind === 'percent' ? percent(n, 1) : compact(n))} height={200} label={`${mt.label}, ${rg.label.toLowerCase()}, ${rows.length} bars, total ${fmtVal(total(mt))}`} />
            )}
          </div>
        </div>
          </TabPanel>
        </Tabs>
        <div {...stylex.props(styles.lists, styles.split)}>
          <Breakdown title="Top products" rows={PRODUCTS} total={total(METRICS[0]!)} currency={currency} />
          <Breakdown title="Channels" rows={CHANNELS} total={total(METRICS[0]!)} currency={currency} />
        </div>
      </div>
    </section>
  );
}

function Breakdown({ title, rows, total, currency }: { title: string; rows: { name: string; value: number }[]; total: number; currency: string }) {
  const { currency: money, percent } = useFormatters();
  return (
    <div {...stylex.props(styles.group)}>
      <div {...stylex.props(styles.listHead)}>
        <h3 {...stylex.props(w8.h3, styles.listTitle)}>{title}</h3>
        <span>Revenue</span>
      </div>
      <ul {...stylex.props(w8.list)} style={{ gap: 4 }}>
        {rows.map((r, i) => (
          <li key={r.name} {...stylex.props(styles.item)} title={percent(r.value)}>
            <span role="presentation" aria-hidden="true" {...mergeSx(stylex.props(styles.bar, styles.fill), undefined, { transform: `scaleX(${r.value})`, '--i': i } as React.CSSProperties)} />
            <span {...stylex.props(w8.ellipsis, styles.itemText)}>{r.name}</span>
            <span {...stylex.props(w8.num, styles.itemText)}>{money(total * r.value, currency, { maximumFractionDigits: 0 })}</span>
            <span {...stylex.props(w8.srOnly)}>{percent(r.value)} share</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
