import { ChartCard, EmptyState, Skeleton, StageBars } from 'oniva-ui';
import type { DocPage } from '../types';

const stages = [
  { id: 'awake', label: 'Awake', tone: 10 },
  { id: 'rem', label: 'REM', tone: 6 },
  { id: 'light', label: 'Light', tone: 3 },
  { id: 'deep', label: 'Deep', tone: 5 },
];
const plan: [string, number][] = [
  ['awake', 12], ['light', 38], ['deep', 52], ['light', 24], ['rem', 18], ['light', 36],
  ['deep', 44], ['light', 28], ['rem', 26], ['light', 30], ['awake', 6], ['light', 34], ['rem', 34],
];
let t = 0;
const segments = plan.map(([stage, len]) => {
  const seg = { stage, start: t, end: t + len };
  t += len;
  return seg;
});

const Stage = () => (
  <div style={{ width: 560 }}>
    <ChartCard title="Sleep stages" value="7h 12m" unit="last night">
      <StageBars stages={stages} segments={segments} startClock={{ hour: 23, minute: 10 }} />
    </ChartCard>
  </div>
);

const Shape = () => (
  <div style={{ display: 'grid', gap: 12 }}>
    <pre tabIndex={0} style={{ margin: 0, padding: 12, borderRadius: 10, overflow: 'auto', fontSize: 12.5, lineHeight: '18px', background: 'var(--oniva-color-surface-inset)', color: 'var(--oniva-color-text)' }}>
      <code>{"interface Stage { id: string; label: string; tone?: number }\ninterface StageSegment {\n  stage: string;  // Stage id\n  start: number;  // minutes from the start\n  end: number;\n}\n\nstages = [{ id: 'awake', label: 'Awake' }, { id: 'deep', label: 'Deep' }]\nsegments = [{ stage: 'awake', start: 0, end: 12 }, { stage: 'deep', start: 12, end: 64 }]\n// <StageBars stages={stages} segments={segments} startClock={{ hour: 23, minute: 10 }} />"}</code>
    </pre>
    <ul style={{ margin: 0, paddingInlineStart: 18, display: 'grid', gap: 4, fontSize: 14, lineHeight: '20px' }}>
      <li>{"stages sets the rows, top to bottom. Order them by depth or priority."}</li>
      <li>{"Times are minutes from the start. total defaults to the end of the last segment."}</li>
      <li>{"Segments with an unknown stage id are skipped. Overlapping segments in one stage draw over each other."}</li>
      <li>{"Axis ticks fall every 120 minutes."}</li>
    </ul>
  </div>
);

const page: DocPage = {
  slug: "stage-bars",
  status: 'Stable',
  version: '0.1.0',
  importName: "StageBars",
  group: ['Components', 'Charts'],
  sourcePath: "charts/StageBars",
  lede: "One row per stage with rounded time blocks across a shared timeline. It handles sleep, shifts and pipelines: what state something was in, and for how long.",
  anatomy: {
    intro: "Five parts. Stage rows, blocks and time axis are always present. The clock labels need startClock.",
    Render: Stage,
    parts: [
      { name: "Row track", description: "A 28px tall lane per stage (34px row pitch), 8px radius, in the track color at 50% opacity.", selector: "svg[role=\"group\"] > g > rect" },
      { name: "Stage label", description: "11px muted, right-aligned to the left of each lane. Margin is 6.6px per character of the longest label.", selector: "svg[role=\"group\"] > g > text" },
      { name: "Time block", description: "Rounded segment in the stage tone. Minimum width 3px, 1px gap between neighbours.", selector: "svg[role=\"group\"] > path" },
      { name: "Time axis", description: "Labels every 2 hours, as clock times with startClock (11:10 PM) or hours (2h) without.", selector: "svg[role=\"group\"] > text" },
      { name: "Plot", description: "Height is stages x 34px + 30px unless you pass height.", selector: "svg[role=\"group\"]" },
    ],
  },
  usage: {
    use: ["Sleep stages, work shifts, state machines over time.","Pipeline or build stages with durations.","Anything where each moment has exactly one of 3 to 6 states."],
    avoid: [
      { text: "Daily status history.", instead: { slug: "tracker", label: "Tracker" } },
      { text: "Totals per category.", instead: { slug: "bar-chart", label: "BarChart" } },
      { text: "Parts of a whole.", instead: { slug: "donut-chart", label: "DonutChart" } },
    ],
  },
  playground: {
    controls: [
      { kind: 'toggle', key: 'clock', label: 'Clock labels' },
      { kind: 'number', key: 'stagesCount', label: 'Stages', min: 2, max: 4, step: 1 },
      { kind: 'number', key: 'height', label: 'Height (px, 0 = auto)', min: 0, max: 240, step: 20 },
    ],
    initial: { clock: true, stagesCount: 4, height: 0 },
    render: (p) => (
      <div style={{ width: 'min(560px, 100%)' }}><StageBars key={String(p.stagesCount)} stages={stages.slice(0, Number(p.stagesCount))} segments={segments.filter((s) => stages.slice(0, Number(p.stagesCount)).some((x) => x.id === s.stage))} total={t} startClock={p.clock ? { hour: 23, minute: 10 } : undefined} height={Number(p.height) || undefined} /></div>
    ),
    code: (p) => {
      const attrs = [p.clock && 'startClock={{ hour: 23, minute: 10 }}', Number(p.height) > 0 && `height={${p.height}}`].filter(Boolean).join(' ');
      return `<StageBars stages={stages.slice(0, ${p.stagesCount})} segments={segments}${attrs ? ' ' + attrs : ''} />`;
    },
  },
  states: [
    { name: "With clock", description: "startClock turns minutes into clock times.", Render: () => (
      <div style={{ width: 500 }}><StageBars stages={stages} segments={segments} startClock={{ hour: 23, minute: 10 }} /></div>
    ) },
    { name: "Hours only", description: "Without startClock the axis shows elapsed hours.", Render: () => (
      <div style={{ width: 500 }}><StageBars stages={stages} segments={segments} /></div>
    ) },
    { name: "Two stages", description: "Two rows is a simple on and off timeline.", Render: () => (
      <div style={{ width: 500 }}><StageBars stages={[{ id: 'on', label: 'Online', tone: 1 }, { id: 'off', label: 'Offline', tone: 10 }]} segments={[{ stage: 'on', start: 0, end: 200 }, { stage: 'off', start: 200, end: 240 }, { stage: 'on', start: 240, end: 480 }]} /></div>
    ) },
    { name: "Loading", description: "Skeleton at the chart height. The chart is not mounted until data exists.", Render: () => (
<ChartCard title="Sleep stages"><Skeleton variant="rect" width="100%" height={160} /></ChartCard>
    ) },
    { name: "Empty", description: "No data in range. Say why and offer a way out. The chart is not mounted.", Render: () => (
<ChartCard title="Sleep stages"><EmptyState title="No data for this range" description="Pick a longer period or check that the source is connected." /></ChartCard>
    ) },
    { name: "Single point", description: "One stage and one block is a bar on a lane. Show the duration as text.", Render: () => (
      <div style={{ width: 500 }}><StageBars stages={[{ id: 'deep', label: 'Deep', tone: 5 }]} segments={[{ stage: 'deep', start: 0, end: 90 }]} /></div>
    ) },
  ],
  sections: [
    {
      type: 'text', id: 'choosing-a-chart', title: 'Choosing a chart',
      body: (<p style={{ margin: 0 }}>Use stage bars when something moves between a few states over time. See the full decision table on <a href="#/components/bar-chart">Bar chart</a>.</p>),
    },
    { type: 'custom', id: 'data-shape', title: 'Data shape', Render: Shape },
    {
      type: 'rules', id: 'formatting', title: 'Axes, labels and numbers',
      items: [
        { title: "Tabular numerals", body: "Axis labels (11px, medium, muted), tooltip values and legend values use tabular-nums, so digits stay in place when values change." },
        { title: "Durations as hours and minutes", body: "Tooltips read \"1h 36m\", never decimal hours. The summary label totals each stage the same way." },
        { title: "Clock times for the day, hours for the span", body: "With startClock the axis uses 12-hour clock (11:10 PM). Without it, elapsed hours (0h, 2h, 4h)." },
        { title: "Short stage labels", body: "The label column is 6.6px per character. Keep labels under 10 characters." },
        { title: "Units belong in the format", body: "Use valueFormat=\"currency\", \"percent\" or a function such as (n) => `${n} ms`. Never concatenate units into category labels." },
      ],
    },
    {
      type: 'rules', id: 'color-and-palette', title: 'Color and palette',
      items: [
        { title: "Ten chart tokens", body: "--oniva-color-chart-1 to --oniva-color-chart-10 are fixed hues, independent of the accent. Pick by position or pass tone (1-based). Tone wraps after 10." },
        { title: "One tone per stage", body: "Pass tone per stage so a stage keeps its color across screens. Awake is tone 10 (neutral) so it recedes." },
        { title: "Rows label the color", body: "Each stage already has a text label at the row, so color is redundant. This makes the chart safe for color-blind readers." },
        { title: "Color-blind safe", body: "Every mark is at least 3:1 on white. In the light palette, series 1 to 10 stay at least 3.3 delta E apart under protanopia, deuteranopia and tritanopia simulation. Do not rely on that alone: label series in the legend or tooltip." },
        { title: "Track and grid", body: "Empty tracks and gridlines use --oniva-color-chart-track. The hover band uses --oniva-color-chart-cursor." },
      ],
    },
    {
      type: 'rules', id: 'keyboard-exploration', title: 'Keyboard exploration',
      intro: "Tab to the chart, then use the arrow keys to step through each block. Each stop opens its tooltip.",
      items: [
        { title: 'One tab stop', body: 'The chart is a single focusable group (tabindex 0). Tab enters it once and the next Tab leaves it, so a page with six charts costs six tab stops, not hundreds.' },
        { title: 'Arrows move between blocks', body: "Right and Down move to the next block in segment order, Left and Up to the previous. Home and End jump to the first and last. Each stop reads \"Deep: 0h 52m\"." },
        { title: 'Focus shows the tooltip', body: 'Moving focus opens the same tooltip as hover, anchored to the focused mark. Esc closes it without moving focus. The focused mark gets a 2px focus ring, 2px offset.' },
      ],
    },
    {
      type: 'rules', id: 'empty-loading-single', title: 'Empty, loading and single-point states',
      intro: "The chart does not draw its own placeholder. Decide before you mount it.",
      items: [
        { title: "Loading", body: "Render a Skeleton at the same height (160px here) so the card does not jump. Mount the chart when data arrives so the entrance animation plays once." },
        { title: "Empty", body: "Use EmptyState inside the ChartCard. Name the cause (No orders in this range) and give one action. Do not render an empty plot with axes." },
        { title: "One point", body: "A single block shows one duration. Use it only as a placeholder before more data arrives." },
      ],
    },
    {
      type: 'rules', id: 'motion', title: 'Motion',
      items: [
        { title: "Entrance", body: "Blocks fade in over 400ms, each delayed by 25ms in segment order, so the night fills in left to right." },
        { title: "Data updates", body: "Stage bars do not tween. Changing segments redraws immediately." },
        { title: "Reduced motion", body: "With prefers-reduced-motion the entrance animation is removed (animation-name none) and value tweens jump straight to the final value. Tooltip movement drops to 0.01ms." },
      ],
    },

  ],
  content: { rules: [
    { title: "Stage labels are single words", body: "Awake, REM, Light, Deep." },
    { title: "Order rows from most to least active", body: "Awake at the top, deep sleep at the bottom." },
    { title: "Headline in the card", body: "Total time in the card: 7h 12m last night." },
  ] },
  accessibility: {
    keyboard: [
      { keys: ["Tab"], action: "Moves focus into the chart, then out to the next control. The chart is one tab stop." },
      { keys: ["→","↓"], action: "Moves focus to the next block. In right-to-left layouts → and ← swap." },
      { keys: ["←","↑"], action: "Moves focus to the previous block." },
      { keys: ["Home","End"], action: "Jumps to the first or last block." },
      { keys: ["Esc"], action: "Closes the tooltip. Focus stays where it is." },
    ],
    notes: ["The timeline is an svg with role=\"group\" and a label like \"Stage timeline over 7h 12m: Awake 0h 24m, REM 1h 18m\".","Each block is a role=\"graphics-symbol\" stop with the stage and duration.","A visually hidden table lists Stage, Start and End in minutes.","Row labels are SVG text and are aria-hidden with the lane; blocks carry the stage name."],
    reducedMotion: "Entrance animation is removed and value tweens jump to the final value. Tooltip movement drops to 0.01ms.",
  },
  props: [
    { name: "stages", type: "Stage[]", description: "Rows, top to bottom: id, label, tone." },
    { name: "segments", type: "StageSegment[]", description: "Blocks: stage id, start and end in minutes." },
    { name: "startClock", type: "{ hour: number; minute: number }", description: "Clock time at minute 0, for axis labels." },
    { name: "total", type: "number", description: "Total minutes. Default: end of the last segment." },
    { name: "height", type: "number", description: "Plot height. Default stages x 34 + 30." },
    { name: "label", type: "string", description: "Accessible summary of the chart." },
    { name: "xstyle", type: "StyleXStyles", description: "StyleX overrides for the wrapper." },
  ],
  related: ["tracker","bar-chart","funnel-chart","chart-card","timeline"],
};
export default page;
