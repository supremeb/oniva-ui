import { Leaderboard, type LeaderboardEntry } from 'oniva-ui';
import type { DocPage } from '../types';

const entries: LeaderboardEntry[] = [
  { id: 'a', name: 'Priya Nair', score: 12840, previousRank: 2, subtitle: 'EMEA' },
  { id: 'b', name: 'Marcus Okafor', score: 11920, previousRank: 1, subtitle: 'NA East' },
  { id: 'c', name: 'Lena Schmidt', score: 9875, previousRank: 3, subtitle: 'DACH' },
  { id: 'd', name: 'Daniel Kim', score: 7410, previousRank: 6, subtitle: 'APAC' },
  { id: 'e', name: 'Aisha Rahman', score: 6020, previousRank: 4, subtitle: 'NA West' },
];

const Demo = (p: { count?: number; subtitle?: boolean; label?: string; items?: LeaderboardEntry[] }) => (
  <div style={{ width: 380 }}>
    <Leaderboard
      aria-label="Top sellers"
      scoreLabel={p.label ?? 'points'}
      scoreFormat={p.label === 'USD' ? { style: 'currency', currency: 'USD', maximumFractionDigits: 0 } : undefined}
      entries={(p.items ?? entries).slice(0, p.count ?? 5).map((e) => ({ ...e, subtitle: p.subtitle === false ? undefined : e.subtitle }))}
    />
  </div>
);

const page: DocPage = {
  slug: 'leaderboard',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Leaderboard',
  group: ['Components', 'Data display'],
  sourcePath: 'components/Leaderboard',
  lede: 'A ranked list sorted by score, with movement since the last period. Reorders animate so changes are easy to follow.',
  anatomy: {
    intro: 'Six parts. Rank, avatar, name, change and score are always present; the subtitle is optional.',
    Render: () => <Demo count={4} />,
    parts: [
      { name: 'Row', description: 'Surface tile, 10px radius, 1px border, 10px padding, 12px gap, 4px between rows.', selector: 'ol > li:first-child' },
      { name: 'Rank', description: '24px wide, semibold, muted; rank 1 uses the warning tone. Tabular numerals. Read as "Rank 1".', selector: 'ol > li:first-child > span:first-child' },
      { name: 'Avatar', description: 'sm (24px) with initials or avatarSrc.', selector: 'ol > li:first-child [role="img"]' },
      { name: 'Name and subtitle', description: 'Name in the title style, truncated; optional 12px muted subtitle beneath.', selector: 'ol > li:first-child > span:nth-child(3)' },
      { name: 'Change', description: '12px arrow plus places moved (previousRank minus rank). Green up, red down, dash for no change. Screen readers hear "Up", "Down" or "No change".', selector: 'ol > li:first-child > span:nth-child(4)' },
      { name: 'Score', description: 'Semibold with tabular numerals and an animated count. A hidden unit follows (scoreLabel).', selector: 'ol > li:first-child > span:last-child' },
    ],
  },
  usage: {
    use: ['Ranking people or teams by one metric.', 'Gamified or competitive views with a clear period.', 'Top-N lists in dashboards.'],
    avoid: [
      { text: 'Comparing many attributes per item.', instead: { slug: 'table', label: 'Table' } },
      { text: 'Sequences of events in time.', instead: { slug: 'timeline', label: 'Timeline' } },
      { text: 'Progress toward a goal.', instead: { slug: 'progress-bar', label: 'ProgressBar' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'number', key: 'count', label: 'Entries', min: 1, max: 5, step: 1 },
      { kind: 'toggle', key: 'subtitle', label: 'Subtitles' },
      { kind: 'segmented', key: 'label', label: 'Score unit', options: ['points', 'USD'] },
    ],
    initial: { count: 5, subtitle: true, label: 'points' },
    render: (p) => <Demo count={Number(p.count)} subtitle={Boolean(p.subtitle)} label={String(p.label)} />,
    code: (p) => `<Leaderboard\n  aria-label="Top sellers"\n  scoreLabel="${p.label}"${p.label === 'USD' ? "\n  scoreFormat={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}" : ''}\n  entries={entries}\n/>`,
  },
  states: [
    { name: 'Movement', description: 'Up, down and unchanged arrows from previousRank.', Render: () => <Demo /> },
    { name: 'No subtitles', description: 'Single-line rows.', Render: () => <Demo subtitle={false} count={3} /> },
    { name: 'Currency scores', description: 'scoreFormat uses Intl.NumberFormat.', Render: () => <Demo label="USD" count={3} /> },
    { name: 'New entries', description: 'Without previousRank, the change shows a dash.', Render: () => <Demo count={3} items={entries.map(({ previousRank: _p, ...e }) => e)} /> },
    { name: 'Ties', description: 'Equal scores keep input order; consider showing the tiebreaker in the subtitle.', Render: () => <Demo count={3} items={entries.map((e) => ({ ...e, score: 9000 }))} /> },
  ],
  sections: [
    { type: 'rules', id: 'rules', title: 'Rules', items: [
      { title: 'Define the period', body: 'Say what the score covers in a heading: "Top sellers, October". previousRank must come from the prior period.' },
      { title: 'Top 5 to 10', body: 'Show the leaders and the current user\'s own row; do not render hundreds.' },
      { title: 'Sorting is automatic', body: 'Entries sort by score descending; pass them in any order.' },
    ] },
    { type: 'rules', id: 'recipes', title: 'Composition', items: [
      { title: 'With Tabs', body: 'Switch periods (Week, Month, All time) and pass new entries to animate the reorder.' },
      { title: 'With KpiStrip', body: 'Show the team total above the board.' },
    ] },
  ],
  content: { rules: [
    { title: 'Names', body: 'Full display names. The first and last words give the initials.' },
    { title: 'Subtitle', body: 'One short qualifier: team or region.' },
    { title: 'scoreLabel', body: 'Plural unit read after the number: points, orders, USD.' },
  ] },
  accessibility: {
    keyboard: [{ keys: ['None'], action: 'Static ordered list, not focusable.' }],
    notes: ['An ol, so screen readers announce position and total.', 'Rank, direction and unit are visually hidden text: "Rank 1", "Up 1", "12,840 points".', 'Arrows carry text equivalents; color is not the only signal.'],
    reducedMotion: 'The 250ms reorder animation is skipped.',
  },
  props: [
    { name: 'entries', type: 'LeaderboardEntry[]', description: 'id, name, score, previousRank?, subtitle?, avatarSrc?.' },
    { name: 'scoreLabel', type: 'string', default: "'points'", description: 'Unit read after the score.' },
    { name: 'scoreFormat', type: 'Intl.NumberFormatOptions', description: 'Score formatting.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Style override.' },
  ],
  related: ['kpi-strip', 'table', 'avatar', 'list'],
};
export default page;
