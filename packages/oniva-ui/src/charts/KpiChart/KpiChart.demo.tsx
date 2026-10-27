import type { DemoModule } from '../../internal/demo';
import { KpiChart } from './KpiChart';

const days = Array.from({ length: 7 }, (_, i) => `Mar ${3 + i}`);
const long = Array.from({ length: 7 }, (_, i) => `${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i % 7]} ${3 + i} Mar`);
const wave = (base: number, amp: number, phase: number) =>
  days.map((_, i) => Math.round(base + Math.sin(i * 0.7 + phase) * amp + i * (amp / 6)));

const usd = (n: number) => `$${(n / 1000).toFixed(1)}k`;
const wrap = { maxWidth: 460, width: '100%' } as const;

const demo: DemoModule = {
  meta: {
    title: 'KPI chart',
    slug: 'kpi-chart',
    category: 'Charts',
    description:
      'Metric card with a multi-line chart. The tooltip follows the pointer and lists every series; arrow keys step through the points.',
  },
  demos: [
    {
      name: 'Revenue by channel',
      code: `<KpiChart
  title="Revenue"
  value="$96.4k"
  delta={7900}
  format={(n) => \`$\${(n / 1000).toFixed(1)}k\`}
  labels={days}
  tooltipLabels={longDays}
  series={[
    { label: 'Organic', values: organic },
    { label: 'Paid ads', values: paid },
    { label: 'Referral', values: referral },
    { label: 'Email', values: email },
    { label: 'Direct', values: direct },
  ]}
  footer="Top channels"
/>`,
      Component: () => (
        <div style={wrap}>
          <KpiChart
            title="Revenue"
            value="$96.4k"
            delta={7900}
            format={usd}
            labels={days}
            tooltipLabels={long}
            series={[
              { label: 'Organic', values: wave(4200, 500, 0) },
              { label: 'Paid ads', values: wave(3500, 380, 1.4) },
              { label: 'Referral', values: wave(1800, 260, 2.6) },
              { label: 'Email', values: wave(1500, 200, 3.4) },
              { label: 'Direct', values: wave(800, 120, 4.4) },
            ]}
            footer="Top channels"
          />
        </div>
      ),
    },
    {
      name: 'Falling metric, two lines',
      code: `<KpiChart title="Median response time" value="212 ms" delta={-18} labels={days} series={[…]} defaultIndex={4} format={(n) => \`\${n} ms\`} />`,
      Component: () => (
        <div style={wrap}>
          <KpiChart
            title="Median response time"
            value="212 ms"
            delta={-18}
            format={(n) => `${Math.round(n)} ms`}
            labels={days}
            defaultIndex={4}
            series={[
              { label: 'API', values: days.map((_, i) => 260 - i * 3 + (i % 3) * 8) },
              { label: 'Search', values: days.map((_, i) => 340 - i * 6 + (i % 4) * 10) },
            ]}
          />
        </div>
      ),
    },
  ],
};
export default demo;
