import { KpiStrip, type KpiItem } from 'oniva-ui';
import type { DocPage } from '../types';

const items: KpiItem[] = [
  { id: 'mrr', label: 'MRR', value: 48210, format: { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }, delta: 0.124, spark: [32, 34, 33, 38, 41, 44, 48] },
  { id: 'users', label: 'Active users', value: 12840, delta: 0.056, spark: [10, 11, 11, 12, 12, 13, 13] },
  { id: 'churn', label: 'Churn', value: 0.021, format: { style: 'percent', maximumFractionDigits: 1 }, delta: -0.18, invertDelta: true, spark: [3, 3, 2.8, 2.6, 2.4, 2.2, 2.1] },
  { id: 'p95', label: 'p95 latency (ms)', value: 412, delta: 0.09, invertDelta: true, spark: [350, 360, 370, 380, 390, 400, 412] },
];

const Demo = (p: { count?: number; spark?: boolean; delta?: boolean; drill?: boolean; onEvent?: (n: string) => void }) => (
  <div style={{ width: p.count === 1 ? 240 : 760 }}>
    <KpiStrip
      aria-label="Key metrics"
      items={items.slice(0, p.count ?? 4).map((i) => ({ ...i, spark: p.spark === false ? undefined : i.spark, delta: p.delta === false ? undefined : i.delta }))}
      onDrilldown={p.drill ? () => p.onEvent?.('onDrilldown') : undefined}
    />
  </div>
);

const page: DocPage = {
  slug: 'kpi-strip',
  status: 'Stable',
  version: '0.1.0',
  importName: 'KpiStrip',
  group: ['Components', 'Data display'],
  sourcePath: 'components/KpiStrip',
  lede: 'A row of headline metrics with change since the last period and an optional trend sparkline. Tiles can drill down.',
  anatomy: {
    intro: 'Five parts. Label and value are always present; delta, sparkline and drilldown are optional.',
    Render: () => <Demo count={3} drill />,
    parts: [
      { name: 'Tile', description: '10px radius, 1px border, xs shadow, 14px padding, 6px gap. Tiles fill the row with a 190px minimum and 8px gaps. With onDrilldown a tile is a button that presses to 0.98.', selector: 'ul > li:first-child > *' },
      { name: 'Label', description: 'Metric name in the shared label style (muted, small).', selector: 'ul > li:first-child > * > span:first-child' },
      { name: 'Value', description: '24px semibold with tabular numerals. Animates between values; format uses Intl.NumberFormat options.', selector: 'ul > li:first-child > * > span:nth-child(2)' },
      { name: 'Delta', description: '12px medium with a 14px arrow. Green for good, red for bad; invertDelta flips it for churn and latency. Reads "Up 12.4%" to screen readers.', selector: 'ul > li:first-child > * > span:last-child > span:first-child' },
      { name: 'Sparkline', description: '72 by 28px area chart in the delta tone. Labelled "<Metric> trend".', selector: 'ul > li:first-child [role="img"]', fallback: { x: 12, y: 80 } },
    ],
  },
  usage: {
    use: ['Dashboard headers with 3 to 5 top metrics.', 'Metrics with a period-over-period comparison.', 'Entry points that drill into a detailed report.'],
    avoid: [
      { text: 'Key and value pairs without trend.', instead: { slug: 'description-list', label: 'DescriptionList' } },
      { text: 'A value against a limit.', instead: { slug: 'meter', label: 'Meter' } },
      { text: 'Comparing many items by size.', instead: { slug: 'leaderboard', label: 'Leaderboard' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'number', key: 'count', label: 'Metrics', min: 1, max: 4, step: 1 },
      { kind: 'toggle', key: 'delta', label: 'Delta' },
      { kind: 'toggle', key: 'spark', label: 'Sparkline' },
      { kind: 'toggle', key: 'drill', label: 'Drilldown' },
    ],
    initial: { count: 4, delta: true, spark: true, drill: false },
    render: (p, onEvent) => <Demo count={Number(p.count)} delta={Boolean(p.delta)} spark={Boolean(p.spark)} drill={Boolean(p.drill)} onEvent={onEvent} />,
    code: (p) => `<KpiStrip\n  items={[\n    { id: 'mrr', label: 'MRR', value: 48210, format: { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }${p.delta ? ', delta: 0.124' : ''}${p.spark ? ', spark: [32, 34, 38, 44, 48]' : ''} },\n    { id: 'churn', label: 'Churn', value: 0.021, format: { style: 'percent' }, delta: -0.18, invertDelta: true },\n  ]}${p.drill ? '\n  onDrilldown={(id) => openReport(id)}' : ''}\n/>`,
  },
  states: [
    { name: 'Trends', description: 'Delta and sparkline on each tile.', Render: () => <Demo /> },
    { name: 'Drilldown', description: 'Tiles are buttons with focus rings and hover tint.', Render: () => <Demo drill count={3} /> },
    { name: 'Value only', description: 'No delta, no sparkline.', Render: () => <Demo delta={false} spark={false} count={3} /> },
    { name: 'Single metric', description: 'One tile; avoid a strip for one number.', Render: () => <Demo count={1} /> },
    { name: 'Inverted delta', description: 'Churn down 18% is good, so green; latency up 9% is bad, so red.', Render: () => <Demo count={4} spark={false} /> },
  ],
  sections: [
    { type: 'rules', id: 'rules', title: 'Rules', items: [
      { title: 'Three to five', body: 'More tiles wrap and lose the headline effect.' },
      { title: 'One period', body: 'Every delta compares to the same previous period. Say which in the page header, for example "vs last 30 days".' },
      { title: 'Invert deliberately', body: 'Use invertDelta whenever lower is better: churn, latency, errors, cost.' },
      { title: 'Format at the source', body: 'Currency, percent and compact notation come from format; do not pre-format strings.' },
    ] },
    { type: 'rules', id: 'recipes', title: 'Composition', items: [
      { title: 'Above a table', body: 'Put the strip over a DataTable for the same filters; update both from one range control.' },
      { title: 'Loading and empty', body: 'Show Skeleton tiles of the same size while loading; for no data show a dash value and no delta.' },
    ] },
  ],
  content: { rules: [
    { title: 'Labels', body: 'Plain metric names, 1 to 3 words. Put units in the label when the format cannot: "p95 latency (ms)".' },
    { title: 'Deltas', body: 'Percent with one decimal. Do not show a delta without a baseline.' },
    { title: 'No data', body: 'Use "No data", not zero, when nothing was measured.' },
  ] },
  accessibility: {
    keyboard: [
      { keys: ['Tab'], action: 'Moves between tiles when onDrilldown is set.' },
      { keys: ['Enter', 'Space'], action: 'Opens the drilldown for the focused tile.' },
    ],
    notes: ['A list of tiles. Without drilldown the tiles are static and not focusable.', 'The delta reads "Up 12.4%" or "Down 18%" with a visually hidden direction; color is never the only cue.', 'The sparkline has an accessible label such as "MRR trend". Provide the data elsewhere for full detail.', 'Animated number changes are not announced.'],
    reducedMotion: 'Number animation and the press scale are removed.',
  },
  props: [
    { name: 'items', type: 'KpiItem[]', description: 'id, label, value, format?, delta?, invertDelta?, spark?.' },
    { name: 'onDrilldown', type: '(id: string) => void', description: 'Turns tiles into buttons.' },
    { name: 'KpiItem.format', type: 'Intl.NumberFormatOptions', description: 'Value formatting.' },
    { name: 'KpiItem.delta', type: 'number', description: 'Fractional change: 0.124 = +12.4%.' },
    { name: 'KpiItem.invertDelta', type: 'boolean', default: 'false', description: 'Lower is better.' },
    { name: 'KpiItem.spark', type: 'number[]', description: 'Trend points.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Style override.' },
  ],
  related: ['description-list', 'meter', 'leaderboard', 'skeleton'],
};
export default page;
