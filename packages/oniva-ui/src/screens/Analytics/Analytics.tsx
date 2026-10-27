import * as stylex from '@stylexjs/stylex';
import { CreditCard, RefreshCw, TrendingUp, Users } from 'lucide-react';
import { useState, type CSSProperties, type Ref } from 'react';
import { AreaChart } from '../../charts/AreaChart';
import { BarList } from '../../charts/BarList';
import { BreakdownChart } from '../../charts/BreakdownChart';
import { KpiChart } from '../../charts/KpiChart';
import { Heading } from '../../components/Heading';
import { Button } from '../../components/Button';
import { StatCard } from '../../widgets/StatCard';
import { ScreenFrame, type ScreenUser } from '../../internal/s2-screen-frame';
import { m8, step } from '../../internal/m8-motion';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { colors } from '../../tokens/colors.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const NARROW = '@container (max-width: 760px)';
const MID = '@container (max-width: 1040px)';

const styles = stylex.create({
  cell: { display: 'grid', minWidth: 0 },
  spin: { transform: 'rotate(var(--oniva-spin, 0deg))', transitionDuration: motion['--oniva-motion-dur-slower'], transitionProperty: 'transform', transitionTimingFunction: motion['--oniva-motion-ease-out-expo'] },
  wrap: { containerType: 'inline-size', display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 },
  stats: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: {
      default: 'repeat(4, minmax(0, 1fr))',
      [MID]: 'repeat(2, minmax(0, 1fr))',
      [NARROW]: 'minmax(0, 1fr)',
    },
  },
  row: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: { default: 'minmax(0, 3fr) minmax(0, 2fr)', [MID]: 'minmax(0, 1fr)' },
  },
  panel: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    minWidth: 0,
    padding: 16,
  },
  panelTitle: { margin: 0 },
});

const DAYS = Array.from({ length: 14 }, (_, i) => `Oct ${6 + i}`);
const LONG_DAYS = Array.from({ length: 14 }, (_, i) => `${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i % 7]}, Oct ${6 + i}`);
const wave = (base: number, amp: number, phase: number) =>
  DAYS.map((_, i) => Math.round(base + Math.sin(i * 0.7 + phase) * amp + i * (amp / 5)));
const ORGANIC = wave(3400, 600, 0);
const PAID = wave(2300, 500, 1.2);
const REFERRAL = wave(1100, 300, 2.4);

const usdK = (n: number) => `$${(n / 1000).toFixed(1)}k`;

const WEEKS = ['W36', 'W37', 'W38', 'W39', 'W40', 'W41', 'W42', 'W43'];
const WEEKLY = WEEKS.map((w, i) => ({
  week: w,
  signups: 420 + i * 38 + (i % 3) * 25,
  activations: 210 + i * 24 + (i % 2) * 18,
}));

const CHANNELS = ['Organic', 'Paid ads', 'Referral', 'Partners'];
const REGIONS = ['North America', 'Europe', 'Asia Pacific'];
const BREAKDOWN_RECORDS = CHANNELS.flatMap((channel, ci) =>
  REGIONS.map((region, ri) => ({ channel, region, revenue: 9000 + ((ci * 7 + ri * 5) % 6) * 3200 + ci * 1500, orders: 120 + ((ci * 3 + ri * 4) % 7) * 35 })),
);

const TOP_PRODUCTS = [
  { name: 'Agent Studio Team', value: 48200 },
  { name: 'Workflow Runner', value: 36800 },
  { name: 'Insights Add-on', value: 24100 },
  { name: 'Priority Support', value: 15400 },
  { name: 'Data Connectors', value: 11900 },
];

export interface AnalyticsScreenProps {
  workspace?: string;
  user?: ScreenUser;
  /** Called with the label of a sidebar item. */
  onNavigate?: (label: string) => void;
  /** Called when Refresh is pressed. */
  onRefresh?: () => void;
  /** Render the title as h2 when the screen sits inside a page that already has an h1. */
  headingLevel?: 1 | 2;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Revenue dashboard: key figures, revenue by channel, breakdown, top products and weekly trends. */
export function AnalyticsScreen({
  workspace = 'Northwind Labs',
  user = { name: 'Alex Morgan' },
  onNavigate,
  onRefresh,
  headingLevel = 1,
  className,
  xstyle,
  ref,
}: AnalyticsScreenProps) {
  const sub = (headingLevel + 1) as 2 | 3;
  // Refresh replays the dashboard: figures count in again, charts redraw, and the icon turns a full circle.
  const [run, setRun] = useState(0);
  const money = { style: 'currency', currency: 'USD', maximumFractionDigits: 0 } as const;
  const count = (v: number, format?: Intl.NumberFormatOptions) => <AnimatedNumber key={run} value={v} format={format} countIn duration={800} digitStagger={40} locale="en-US" />;
  return (
    <ScreenFrame
      ref={ref}
      className={className}
      xstyle={xstyle}
      workspace={workspace}
      user={user}
      active="Analytics"
      title="Revenue"
      headingLevel={headingLevel}
      onNavigate={onNavigate}
      actions={
        <Button size="sm" variant="secondary" startIcon={<RefreshCw size={14} aria-hidden="true" {...stylex.props(styles.spin)} style={{ '--oniva-spin': `${run * 360}deg` } as CSSProperties} />} onPress={() => {
            setRun((n) => n + 1);
            onRefresh?.();
          }}>
          Refresh
        </Button>
      }
    >
      <div {...stylex.props(styles.wrap)}>
        <section aria-label="Key figures" {...stylex.props(styles.stats)}>
          <div {...stylex.props(styles.cell, m8.rise)} style={step(0)}><StatCard key={run} label="Revenue" value={count(96400, money)} delta={8.4} deltaLabel="vs last period" icon={<TrendingUp size={16} />} trend={ORGANIC} /></div>
          <div {...stylex.props(styles.cell, m8.rise)} style={step(1)}><StatCard key={run} label="Orders" value={count(2184)} delta={3.1} deltaLabel="vs last period" icon={<CreditCard size={16} />} trend={PAID} tone={2} /></div>
          <div {...stylex.props(styles.cell, m8.rise)} style={step(2)}><StatCard key={run} label="New customers" value={count(612)} delta={12.7} deltaLabel="vs last period" icon={<Users size={16} />} trend={REFERRAL} tone={3} /></div>
          <div {...stylex.props(styles.cell, m8.rise)} style={step(3)}><StatCard key={run} label="Refund rate" value={count(0.018, { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 })} delta={-0.4} invertDelta deltaLabel="vs last period" icon={<RefreshCw size={16} />} trend={PAID.map((n) => 5000 - n)} tone={4} /></div>
        </section>
        <div key={`a${run}`} {...stylex.props(styles.row, m8.rise)} style={step(4)}>
          <KpiChart
            title="Revenue by channel"
            value="$96.4k"
            delta={7900}
            format={usdK}
            labels={DAYS}
            tooltipLabels={LONG_DAYS}
            series={[
              { label: 'Organic', values: ORGANIC },
              { label: 'Paid ads', values: PAID },
              { label: 'Referral', values: REFERRAL },
            ]}
            footer="Last 14 days"
          />
          <BreakdownChart
            title="Revenue breakdown"
            records={BREAKDOWN_RECORDS}
            dimensions={[
              { key: 'channel', label: 'Channel', values: CHANNELS },
              { key: 'region', label: 'Region', values: REGIONS },
            ]}
            measures={[
              { key: 'revenue', label: 'Revenue', field: 'revenue' },
              { key: 'orders', label: 'Orders', field: 'orders', unit: 'orders' },
            ]}
            defaultMeasure="revenue"
            defaultSlice="channel"
            defaultSegment="region"
            height={200}
          />
        </div>
        <div key={`b${run}`} {...stylex.props(styles.row, m8.rise)} style={step(5)}>
          <section aria-labelledby="s2-trends" {...stylex.props(styles.panel)}>
            <Heading id="s2-trends" level={sub} variant="headline" xstyle={styles.panelTitle}>
              Weekly trends
            </Heading>
            <AreaChart
              label="Weekly signups and activations"
              data={WEEKLY}
              index="week"
              series={[
                { key: 'signups', label: 'Signups' },
                { key: 'activations', label: 'Activations' },
              ]}
              height={200}
            />
          </section>
          <section aria-labelledby="s2-products" {...stylex.props(styles.panel)}>
            <Heading id="s2-products" level={sub} variant="headline" xstyle={styles.panelTitle}>
              Top products
            </Heading>
            <BarList aria-label="Top products by revenue" items={TOP_PRODUCTS} valueFormat="currency" ranked />
          </section>
        </div>
      </div>
    </ScreenFrame>
  );
}
