import { BarList, ChartCard, EmptyState, Skeleton } from 'oniva-ui';
import type { DocPage } from '../types';

const pages = [
  { name: '/pricing', value: 12480, href: '#/components/bar-list' },
  { name: '/docs/getting-started', value: 9215 },
  { name: '/blog/agent-design-systems', value: 6730 },
  { name: '/changelog', value: 4102 },
  { name: '/templates/dashboard', value: 3366 },
];

const Stage = () => (
  <div style={{ width: 440 }}>
    <ChartCard title="Top pages" value="35,893" unit="views this week">
      <BarList items={pages} ranked valueFormat="number" />
    </ChartCard>
  </div>
);

const Shape = () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <pre tabIndex={0} style={{ margin: 0, padding: 12, borderRadius: 10, overflow: 'auto', fontSize: 12.5, lineHeight: '18px', background: 'var(--oniva-color-surface-inset)', color: 'var(--oniva-color-text)' }}>
      <code>{"interface BarListItem {\n  name: string;\n  value: number;\n  href?: string;       // turns the name into a link\n  icon?: ReactNode;    // before the name\n  tone?: number;       // overrides the list tone\n}\n\n[\n  { name: '/pricing', value: 12480 },\n  { name: '/docs/getting-started', value: 9215, href: '/docs' },\n]\n// <BarList items={items} ranked valueFormat=\"compact\" />"}</code>
    </pre>
    <ul style={{ margin: 0, paddingInlineStart: 18, display: 'grid', gap: 4, fontSize: 14, lineHeight: '20px' }}>
      <li>{"Prop is items. Names must be unique: they are the React key."}</li>
      <li>{"Bar width is value / largest value. Values should be non-negative."}</li>
      <li>{"sort defaults to descending. Pass sort={false} to keep input order."}</li>
      <li>{"Show 3 to 10 rows. Paginate or add \"View all\" for more."}</li>
    </ul>
  </div>
);

const page: DocPage = {
  slug: "bar-list",
  status: 'Stable',
  version: '0.1.0',
  importName: "BarList",
  group: ['Components', 'Charts'],
  sourcePath: "charts/BarList",
  lede: "A ranked list of names with a bar behind each row. It handles leaderboards: which items lead, by how much, with the exact value beside the name.",
  anatomy: {
    intro: "Five parts. The name, value and bar are always present. The rank number and link are optional.",
    Render: Stage,
    parts: [
      { name: "Row", description: "36px tall, 8px radius, 10px horizontal padding, 12px gap, 6px between rows.", selector: "li" },
      { name: "Bar", description: "Fill behind the row at 20% opacity of the tone, width relative to the largest value. Grows from the left.", selector: "li > span[aria-hidden=\"true\"]" },
      { name: "Name", description: "14px medium. Truncates with an ellipsis. Becomes a link when href is set.", selector: "li > span:nth-of-type(2)" },
      { name: "Rank", description: "Muted tabular number, 8px before the name. Only with ranked.", selector: "li > span:nth-of-type(2) > span" },
      { name: "Value", description: "14px semibold, tabular, right-aligned, in valueFormat.", selector: "li > span:last-of-type" },
    ],
  },
  usage: {
    use: ["Top-N lists: pages, sources, customers, countries.","Rankings where the value beside the name matters.","Narrow columns where a vertical bar chart will not fit labels."],
    avoid: [
      { text: "Comparing values across a time axis.", instead: { slug: "bar-chart", label: "BarChart" } },
      { text: "Parts of a whole.", instead: { slug: "donut-chart", label: "DonutChart" } },
      { text: "Rows with several columns of data.", instead: { slug: "data-table", label: "DataTable" } },
      { text: "Rank change and live scores.", instead: { slug: "leaderboard", label: "Leaderboard" } },
    ],
  },
  playground: {
    controls: [
      { kind: 'toggle', key: 'ranked', label: 'Rank numbers' },
      { kind: 'toggle', key: 'sort', label: 'Sort descending' },
      { kind: 'number', key: 'tone', label: 'Tone (1 to 10)', min: 1, max: 10, step: 1 },
      { kind: 'segmented', key: 'valueFormat', label: 'Format', options: ['number', 'compact'] },
      { kind: 'number', key: 'count', label: 'Rows', min: 2, max: 5, step: 1 },
    ],
    initial: { ranked: true, sort: true, tone: 6, valueFormat: 'number', count: 5 },
    render: (p) => (
      <div style={{ width: 'min(440px, 100%)' }}><BarList items={pages.slice(0, Number(p.count))} ranked={Boolean(p.ranked)} sort={Boolean(p.sort)} tone={Number(p.tone)} valueFormat={p.valueFormat as 'number'} aria-label="Top pages" /></div>
    ),
    code: (p) => {
      const attrs = [p.ranked && 'ranked', !p.sort && 'sort={false}', p.tone !== 6 && `tone={${p.tone}}`, p.valueFormat !== 'number' && `valueFormat="${p.valueFormat}"`].filter(Boolean).join(' ');
      return `<BarList items={pages}${attrs ? ' ' + attrs : ''} />`;
    },
  },
  states: [
    { name: "Default", description: "Sorted descending, no ranks.", Render: () => (
      <div style={{ width: 420 }}><BarList items={pages} aria-label="Top pages" /></div>
    ) },
    { name: "Ranked", description: "1 to n numbers before each name.", Render: () => (
      <div style={{ width: 420 }}><BarList items={pages} ranked aria-label="Top pages" /></div>
    ) },
    { name: "With links", description: "Rows with href render the name as a link with hover underline and a 2px focus ring.", Render: () => (
      <div style={{ width: 420 }}><BarList items={pages.map((x) => ({ ...x, href: '#/components/bar-list' }))} aria-label="Top pages" /></div>
    ) },
    { name: "Per-row tone", description: "tone on an item overrides the list tone. Use it to flag one row.", Render: () => (
      <div style={{ width: 420 }}><BarList items={pages.map((x, i) => (i === 0 ? { ...x, tone: 1 } : x))} aria-label="Top pages" /></div>
    ) },
    { name: "Long names", description: "Names truncate with an ellipsis inside the row.", Render: () => (
      <div style={{ width: 280 }}><BarList items={pages} aria-label="Top pages" /></div>
    ) },
    { name: "Unsorted", description: "sort={false} keeps your order, such as alphabetical.", Render: () => (
      <div style={{ width: 420 }}><BarList items={pages.slice().reverse()} sort={false} aria-label="Top pages" /></div>
    ) },
    { name: "Loading", description: "Skeleton at the chart height. The chart is not mounted until data exists.", Render: () => (
<ChartCard title="Top pages"><Skeleton variant="rect" width="100%" height={240} /></ChartCard>
    ) },
    { name: "Empty", description: "No data in range. Say why and offer a way out. The chart is not mounted.", Render: () => (
<ChartCard title="Top pages"><EmptyState title="No data for this range" description="Pick a longer period or check that the source is connected." /></ChartCard>
    ) },
    { name: "Single point", description: "One row is a full-width bar. It has nothing to rank against.", Render: () => (
      <div style={{ width: 420 }}><BarList items={pages.slice(0, 1)} aria-label="Top pages" /></div>
    ) },
  ],
  sections: [
    {
      type: 'text', id: 'choosing-a-chart', title: 'Choosing a chart',
      body: (<p style={{ margin: 0 }}>Use a bar list to rank named items when exact values matter. See the full decision table on <a href="#/components/bar-chart">Bar chart</a>.</p>),
    },
    { type: 'custom', id: 'data-shape', title: 'Data shape', Render: Shape },
    {
      type: 'rules', id: 'formatting', title: 'Axes, labels and numbers',
      items: [
        { title: "Tabular numerals", body: "Axis labels (11px, medium, muted), tooltip values and legend values use tabular-nums, so digits stay in place when values change." },
        { title: "Value in valueFormat, never in the name", body: "The value is right-aligned and tabular so a column of numbers lines up." },
        { title: "Names are data, not prose", body: "Paths, customer names, countries. Truncate with an ellipsis; the full text sits in the title attribute if you add one." },
        { title: "No axis, no gridlines", body: "The bar is relative to the largest row, so there is no scale. Do not compare bars across two lists." },
        { title: "Units belong in the format", body: "Use valueFormat=\"currency\", \"percent\" or a function such as (n) => `${n} ms`. Never concatenate units into category labels." },
      ],
    },
    {
      type: 'rules', id: 'color-and-palette', title: 'Color and palette',
      items: [
        { title: "Ten chart tokens", body: "--oniva-color-chart-1 to --oniva-color-chart-10 are fixed hues, independent of the accent. Pick by position or pass tone (1-based). Tone wraps after 10." },
        { title: "One tone for the list", body: "Default tone is 6 (blue). Per-row tone is for a highlight, such as the row the user owns." },
        { title: "Contrast is on the text", body: "The bar is a 20% tint behind dark text, so text contrast stays above 4.5:1 for any tone." },
        { title: "Color-blind safe", body: "Every mark is at least 3:1 on white. In the light palette, series 1 to 10 stay at least 3.3 delta E apart under protanopia, deuteranopia and tritanopia simulation. Do not rely on that alone: label series in the legend or tooltip." },
        { title: "Track and grid", body: "Empty tracks and gridlines use --oniva-color-chart-track. The hover band uses --oniva-color-chart-cursor." },
      ],
    },
    {
      type: 'rules', id: 'keyboard-exploration', title: 'Keyboard exploration',
      intro: "BarList is a plain list. The only tab stops are the links.",
      items: [
        { title: 'List semantics', body: 'A ul with li rows. Screen readers announce "list, 5 items" and then each name and value in order.' },
        { title: 'Tab visits links only', body: 'Rows with href have one tab stop each, with a 2px focus ring. Rows without href are not focusable.' },
        { title: 'No arrow keys', body: 'There is no roving focus. Use a link or button in each row for actions.' },
      ],
    },
    {
      type: 'rules', id: 'empty-loading-single', title: 'Empty, loading and single-point states',
      intro: "The chart does not draw its own placeholder. Decide before you mount it.",
      items: [
        { title: "Loading", body: "Render a Skeleton at the same height (240px here) so the card does not jump. Mount the chart when data arrives so the entrance animation plays once." },
        { title: "Empty", body: "Use EmptyState inside the ChartCard. Name the cause (No orders in this range) and give one action. Do not render an empty plot with axes." },
        { title: "One point", body: "One item fills the row at 100%. Show it as a number. The list reads best at 3 to 10 rows." },
      ],
    },
    {
      type: 'rules', id: 'motion', title: 'Motion',
      items: [
        { title: "Entrance", body: "Each bar grows from the left over 450ms (ease-out), delayed 50ms per row. The animation starts when the list is built." },
        { title: "Data updates", body: "BarList does not tween. Changing values updates widths immediately and re-sorts if sort is on." },
        { title: "Reduced motion", body: "With prefers-reduced-motion the entrance animation is removed (animation-name none) and value tweens jump straight to the final value. Tooltip movement drops to 0.01ms." },
      ],
    },

  ],
  content: { rules: [
    { title: "Name the thing, not the metric", body: "The title says what the values mean: Top pages, views this week." },
    { title: "Real labels", body: "Use the path, name or country exactly as users know it." },
    { title: "Show the unit once", body: "Say it in the card (\"views this week\"), not in every row." },
  ] },
  accessibility: {
    keyboard: [
      { keys: ["Tab"], action: "Moves to the next link in the list. Rows without href are skipped." },
      { keys: ["Enter"], action: "Follows the focused link." },
    ],
    notes: ["Rendered as a ul with li rows, so screen readers announce the item count.","The bar is aria-hidden: the value is real text in the row.","Give the list an aria-label such as \"Top pages\" when it has no visible heading.","Bar length is not announced; the values are, in sorted order."],
    reducedMotion: "The grow entrance is removed (animation-name none) and bars render at full width.",
  },
  props: [
    { name: "items", type: "BarListItem[]", description: "Rows: name, value, href, icon, tone." },
    { name: "tone", type: "number", default: "6", description: "1-based palette index for the list." },
    { name: "valueFormat", type: "ValueFormat", default: "'number'", description: "'number', 'compact', 'currency' (USD, no decimals), 'percent' or a function." },
    { name: "sort", type: "boolean", default: "true", description: "Sort descending by value." },
    { name: "ranked", type: "boolean", default: "false", description: "Show 1 to n rank numbers." },
    { name: "aria-label", type: "string", description: "Accessible name for the list." },
    { name: "xstyle", type: "StyleXStyles", description: "StyleX overrides for the wrapper." },
  ],
  related: ["bar-chart","leaderboard","data-table","donut-chart","chart-card"],
};
export default page;
