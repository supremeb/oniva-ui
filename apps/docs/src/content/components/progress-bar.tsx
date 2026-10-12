import { ProgressBar, ProgressSegments } from 'oniva-ui';
import type { DocPage } from '../types';

const Demo = (p: { value?: number; size?: 'sm' | 'md' | 'lg'; tone?: 'accent' | 'success' | 'warning' | 'danger'; label?: string; showValue?: boolean; indeterminate?: boolean }) => (
  <div style={{ width: 320 }}>
    <ProgressBar label={p.label ?? 'Uploading invoices'} value={p.value ?? 64} isIndeterminate={p.indeterminate} size={p.size} tone={p.tone} showValue={p.showValue} />
  </div>
);

const page: DocPage = {
  slug: 'progress-bar',
  status: 'Stable',
  version: '0.1.0',
  importName: 'ProgressBar',
  group: ['Components', 'Feedback'],
  sourcePath: 'components/ProgressBar',
  lede: 'Shows how far a task has come, or that it is working when the end is unknown. Determinate or indeterminate, with a segmented variant for breakdowns.',
  anatomy: {
    intro: 'Four parts. The track and fill are always present; the label and value are optional.',
    Render: () => <Demo showValue />,
    parts: [
      { name: 'Label', description: '13px medium above the track. Falls back to aria-label if omitted.', selector: '[role="progressbar"] label, [role="progressbar"] > div:first-child > span:first-child' },
      { name: 'Value', description: '13px muted, tabular numerals, right-aligned. Hidden while indeterminate.', selector: '[role="progressbar"] > div:first-child > span:last-child' },
      { name: 'Track', description: 'Full radius, chart-track color; 6px (sm), 8px (md), 12px (lg).', selector: '[role="progressbar"] > div:last-child' },
      { name: 'Fill', description: 'Accent gradient by default, or success, warning, danger. Scales from the left with a slow ease-out. Indeterminate is a 40% bar sliding every 1.4s.', selector: '[role="progressbar"] > div:last-child > div' },
    ],
  },
  usage: {
    use: ['Uploads, imports and exports with a known total.', 'Multi-step setup completion.', 'An unknown wait longer than a second, as indeterminate.'],
    avoid: [
      { text: 'A level against a limit, such as storage.', instead: { slug: 'meter', label: 'Meter' } },
      { text: 'A short wait inside a button or card.', instead: { slug: 'spinner', label: 'Spinner' } },
      { text: 'Placeholders for content that is loading.', instead: { slug: 'skeleton', label: 'Skeleton' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'number', key: 'value', label: 'Value', min: 0, max: 100, step: 10 },
      { kind: 'segmented', key: 'size', label: 'Size', options: ['sm', 'md', 'lg'] },
      { kind: 'select', key: 'tone', label: 'Tone', options: ['accent', 'success', 'warning', 'danger'] },
      { kind: 'toggle', key: 'showValue', label: 'Show value' },
      { kind: 'toggle', key: 'indeterminate', label: 'Indeterminate' },
    ],
    initial: { value: 64, size: 'md', tone: 'accent', showValue: true, indeterminate: false },
    render: (p) => <Demo value={Number(p.value)} size={p.size as 'sm' | 'md' | 'lg'} tone={p.tone as 'accent'} showValue={Boolean(p.showValue)} indeterminate={Boolean(p.indeterminate)} />,
    code: (p) => `<ProgressBar label="Uploading invoices" ${p.indeterminate ? 'isIndeterminate' : `value={${p.value}}`}${p.size !== 'md' ? ` size="${p.size}"` : ''}${p.tone !== 'accent' ? ` tone="${p.tone}"` : ''}${p.showValue ? ' showValue' : ''} />`,
  },
  states: [
    { name: 'Determinate', description: 'Known progress with a percentage.', Render: () => <Demo showValue /> },
    { name: 'Indeterminate', description: 'Unknown duration. Static 40% bar under reduced motion.', Render: () => <Demo indeterminate /> },
    { name: 'Complete', description: 'Switch to success at 100%.', Render: () => <Demo value={100} tone="success" showValue label="Upload complete" /> },
    { name: 'Failed', description: 'Danger tone with an explanation next to it.', Render: () => <Demo value={42} tone="danger" showValue label="Upload failed at 42%" /> },
    { name: 'Segments', description: 'ProgressSegments splits one bar into labelled parts with a legend.', Render: () => (<div style={{ width: 360 }}><ProgressSegments title="Storage by type" segments={[{ id: 'docs', label: 'Documents', value: 40 }, { id: 'img', label: 'Images', value: 25, color: 'success' }, { id: 'vid', label: 'Video', value: 15, color: 'warning' }]} max={100} /></div>) },
  ],
  sections: [
    { type: 'rules', id: 'rules', title: 'Rules', items: [
      { title: 'Prefer determinate', body: 'If you know the total, show it. Indeterminate means "working", not "almost done".' },
      { title: 'Never go backwards', body: 'Progress that jumps down erodes trust. Smooth estimates or switch to indeterminate.' },
      { title: 'Say what is happening', body: 'The label names the task, and the value updates with it.' },
    ] },
    { type: 'rules', id: 'recipes', title: 'Composition', items: [
      { title: 'With Alert', body: 'On failure replace the bar with an Alert and a Retry action.' },
      { title: 'With Button', body: 'Offer Cancel next to a long task.' },
      { title: 'With RingProgress', body: 'Use the ring for compact spots such as a list row.' },
    ] },
  ],
  content: { rules: [
    { title: 'Label', body: 'Present participle for the task: "Uploading invoices", "Importing 240 contacts".' },
    { title: 'Value', body: 'Percent, or "12 of 240" when counts matter more.' },
    { title: 'Completion', body: 'Replace the label with the result: "Upload complete".' },
  ] },
  accessibility: {
    keyboard: [{ keys: ['None'], action: 'Not interactive.' }],
    notes: ['role="progressbar" with aria-valuenow, min and max; indeterminate omits the value.', 'The label is linked with aria-labelledby; provide aria-label when no label is shown.', 'Screen readers do not announce every change. Announce start and end in a live region.', 'The color of the tone is not the only cue; state failure in text.'],
    reducedMotion: 'The indeterminate slide stops and the bar shows at 60% opacity.',
  },
  props: [
    { name: 'label', type: 'ReactNode', description: 'Visible label.' },
    { name: 'value / minValue / maxValue', type: 'number', default: '0 / 0 / 100', description: 'Progress and range.' },
    { name: 'isIndeterminate', type: 'boolean', default: 'false', description: 'Unknown duration.' },
    { name: 'showValue', type: 'boolean', default: 'false', description: 'Show the formatted value.' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', default: 'percent', description: 'Value text.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Track thickness.' },
    { name: 'tone', type: "'accent' | 'success' | 'warning' | 'danger'", default: "'accent'", description: 'Fill color.' },
    { name: 'ProgressSegments.segments', type: 'ProgressSegment[]', description: 'id, label, value, color?, display?.' },
    { name: 'ProgressSegments.max / title', type: 'number / ReactNode', description: 'Total and heading.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Style override.' },
  ],
  related: ['ring-progress', 'meter', 'spinner', 'skeleton'],
};
export default page;
