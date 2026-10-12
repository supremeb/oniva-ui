import { RingProgress } from 'oniva-ui';
import type { DocPage } from '../types';

const Demo = (p: { value?: number; diameter?: number; strokeWidth?: number; tone?: 'accent' | 'success' | 'warning' | 'danger'; center?: string }) => (
  <RingProgress aria-label="Setup progress" value={p.value ?? 60} diameter={p.diameter} strokeWidth={p.strokeWidth} tone={p.tone}>{p.center || undefined}</RingProgress>
);

const page: DocPage = {
  slug: 'ring-progress',
  status: 'Stable',
  version: '0.1.0',
  importName: 'RingProgress',
  group: ['Components', 'Feedback'],
  sourcePath: 'components/RingProgress',
  lede: 'A compact circular progress indicator with a number or short text in the center. For checklists, list rows and small cards.',
  anatomy: {
    intro: 'Four parts. The track, arc and centre are always present; centre content defaults to the percentage.',
    Render: () => <Demo value={72} diameter={72} strokeWidth={6} />,
    parts: [
      { name: 'Container', description: 'role="progressbar", a square of the given diameter. The SVG and centre sit inside it.', selector: '[role="progressbar"]' },
      { name: 'Track', description: 'Full circle in the chart-track color, same stroke width as the arc.', selector: 'svg circle:first-of-type' },
      { name: 'Arc', description: 'Round-capped arc starting at 12 o\'clock and sweeping clockwise. Accent 500 by default, or success, warning, danger.', selector: 'svg circle:last-of-type' },
      { name: 'Centre', description: '11px semibold with tabular numerals. Defaults to the animated percentage; pass children for a count such as "4".', selector: '[role="progressbar"] > span', fallback: { x: 50, y: 50 } },
    ],
  },
  usage: {
    use: ['Setup checklists: "4 steps left".', 'Row-level progress in a list or table.', 'A small summary where a bar will not fit.'],
    avoid: [
      { text: 'Wide spaces or labelled tasks.', instead: { slug: 'progress-bar', label: 'ProgressBar' } },
      { text: 'Usage against a limit.', instead: { slug: 'meter', label: 'Meter' } },
      { text: 'Unknown duration.', instead: { slug: 'spinner', label: 'Spinner' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'number', key: 'value', label: 'Value', min: 0, max: 100, step: 10 },
      { kind: 'number', key: 'diameter', label: 'Diameter', min: 24, max: 120, step: 8 },
      { kind: 'number', key: 'strokeWidth', label: 'Stroke', min: 2, max: 12, step: 1 },
      { kind: 'select', key: 'tone', label: 'Tone', options: ['accent', 'success', 'warning', 'danger'] },
      { kind: 'text', key: 'center', label: 'Centre text', presets: ['', '4', 'Done'] },
    ],
    initial: { value: 60, diameter: 56, strokeWidth: 5, tone: 'accent', center: '' },
    render: (p) => <Demo value={Number(p.value)} diameter={Number(p.diameter)} strokeWidth={Number(p.strokeWidth)} tone={p.tone as 'accent'} center={String(p.center)} />,
    code: (p) => {
      const attrs = `aria-label="Setup progress" value={${p.value}}${Number(p.diameter) !== 36 ? ` diameter={${p.diameter}}` : ''}${Number(p.strokeWidth) !== 4 ? ` strokeWidth={${p.strokeWidth}}` : ''}${p.tone !== 'accent' ? ` tone="${p.tone}"` : ''}`;
      return p.center ? `<RingProgress ${attrs}>${p.center}</RingProgress>` : `<RingProgress ${attrs} />`;
    },
  },
  states: [
    { name: 'Default', description: '36px, 4px stroke.', Render: () => <Demo value={60} /> },
    { name: 'Empty', description: 'Track only.', Render: () => <Demo value={0} diameter={48} /> },
    { name: 'Complete', description: 'Success tone at 100%.', Render: () => <Demo value={100} tone="success" diameter={48} /> },
    { name: 'Custom centre', description: 'Children replace the percentage.', Render: () => <Demo value={60} diameter={48} center="4" /> },
    { name: 'Large', description: 'Scale diameter and stroke together; the label stays 11px, so keep text short.', Render: () => <Demo value={72} diameter={96} strokeWidth={8} /> },
    { name: 'Danger', description: 'Failed or over limit.', Render: () => <Demo value={92} tone="danger" diameter={48} /> },
  ],
  sections: [
    { type: 'rules', id: 'rules', title: 'Rules', items: [
      { title: 'Sweep clockwise from the top', body: 'The arc always starts at 12 o\'clock. Do not rotate it.' },
      { title: 'Keep centre content to three characters', body: 'A number or "OK". At 36px the centre fits roughly three characters at 11px.' },
      { title: 'Pair with text', body: 'In a checklist put "4 steps left" beside the ring; the ring supports it.' },
    ] },
    { type: 'rules', id: 'recipes', title: 'Composition', items: [
      { title: 'In a List row', body: 'Place in trailing for per-item progress.' },
      { title: 'In a Card header', body: 'Next to a title, with a ProgressBar for the details below.' },
    ] },
  ],
  content: { rules: [
    { title: 'Centre', body: 'The number users care about: percentage, or steps remaining.' },
    { title: 'aria-label', body: 'Required unless a visible label is linked: "Setup progress".' },
    { title: 'Tone', body: 'Use success at completion and danger for failure only.' },
  ] },
  accessibility: {
    keyboard: [{ keys: ['None'], action: 'Not interactive.' }],
    notes: ['role="progressbar" with aria-valuenow, min and max.', 'The SVG and the centre text are aria-hidden so the value is read once; provide an aria-label or aria-labelledby.', 'If the centre shows a count that differs from the percentage, add it to the visible text next to the ring.'],
    reducedMotion: 'The number animation is minimal and the arc has no looping motion.',
  },
  props: [
    { name: 'value / minValue / maxValue', type: 'number', default: '0 / 0 / 100', description: 'Progress and range.' },
    { name: 'diameter', type: 'number', default: '36', description: 'Outer size in px.' },
    { name: 'strokeWidth', type: 'number', default: '4', description: 'Ring thickness in px.' },
    { name: 'tone', type: "'accent' | 'success' | 'warning' | 'danger'", default: "'accent'", description: 'Arc color.' },
    { name: 'children', type: 'ReactNode', description: 'Centre content; defaults to the percentage.' },
    { name: 'aria-label', type: 'string', description: 'Accessible name.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Style override.' },
  ],
  related: ['progress-bar', 'meter', 'spinner', 'list'],
};
export default page;
