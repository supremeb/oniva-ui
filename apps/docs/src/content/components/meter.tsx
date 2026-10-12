import { Meter } from 'oniva-ui';
import type { DocPage } from '../types';

const Demo = (p: { value?: number; size?: 'sm' | 'md' | 'lg'; showValue?: boolean; label?: string; tone?: string; warnAt?: number; dangerAt?: number }) => (
  <div style={{ width: 320 }}>
    <Meter
      label={p.label ?? 'Storage used'}
      value={p.value ?? 62}
      size={p.size}
      showValue={p.showValue}
      tone={p.tone && p.tone !== 'auto' ? (p.tone as 'accent') : undefined}
      warnAt={p.warnAt}
      dangerAt={p.dangerAt}
    />
  </div>
);

const page: DocPage = {
  slug: 'meter',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Meter',
  group: ['Components', 'Feedback'],
  sourcePath: 'components/Meter',
  lede: 'A gauge for a quantity within a known range: storage, seats, quota. The color shifts as it nears the limit.',
  anatomy: {
    intro: 'Four parts. The track and fill are always present; the label and value sit above them and are optional.',
    Render: () => <Demo value={78} />,
    parts: [
      { name: 'Label', description: '13px medium text above the track. Required for an accessible name unless aria-label is set.', selector: '[role="meter"] label, [role="meter"] > div:first-child > span:first-child' },
      { name: 'Value', description: '13px muted with tabular numerals, right-aligned: "78%".', selector: '[role="meter"] > div:first-child > span:last-child' },
      { name: 'Track', description: 'Full radius, chart-track color. 6px at sm, 8px at md, 12px at lg.', selector: '[role="meter"] > div:last-child' },
      { name: 'Fill', description: 'Scaled from the left in 400ms-class ease-out. Success below 70%, warning from 70%, danger from 90% (warnAt, dangerAt).', selector: '[role="meter"] > div:last-child > div' },
    ],
  },
  usage: {
    use: ['Usage against a limit: storage, seats, API quota.', 'Scores in a fixed range, such as password strength.', 'Anything where "nearly full" should look different.'],
    avoid: [
      { text: 'Progress of a task toward completion.', instead: { slug: 'progress-bar', label: 'ProgressBar' } },
      { text: 'A circular summary in a small space.', instead: { slug: 'ring-progress', label: 'RingProgress' } },
      { text: 'A trend over time.', instead: { slug: 'kpi-strip', label: 'KpiStrip' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'number', key: 'value', label: 'Value', min: 0, max: 100, step: 5 },
      { kind: 'segmented', key: 'size', label: 'Size', options: ['sm', 'md', 'lg'] },
      { kind: 'select', key: 'tone', label: 'Tone', options: ['auto', 'accent', 'success', 'warning', 'danger'] },
      { kind: 'toggle', key: 'showValue', label: 'Show value' },
      { kind: 'text', key: 'label', label: 'Label', presets: ['Storage used', 'Seats in use', 'API calls'] },
    ],
    initial: { value: 62, size: 'md', tone: 'auto', showValue: true, label: 'Storage used' },
    render: (p) => <Demo value={Number(p.value)} size={p.size as 'sm' | 'md' | 'lg'} tone={String(p.tone)} showValue={Boolean(p.showValue)} label={String(p.label)} />,
    code: (p) => `<Meter label="${p.label}" value={${p.value}}${p.size !== 'md' ? ` size="${p.size}"` : ''}${p.tone !== 'auto' ? ` tone="${p.tone}"` : ''}${p.showValue ? '' : ' showValue={false}'} />`,
  },
  states: [
    { name: 'Healthy', description: 'Below 70%: success.', Render: () => <Demo value={40} /> },
    { name: 'Warning', description: '70% to 89%: warning.', Render: () => <Demo value={78} /> },
    { name: 'Critical', description: '90% and above: danger.', Render: () => <Demo value={96} /> },
    { name: 'Custom range', description: 'minValue, maxValue and formatOptions work as in ProgressBar.', Render: () => (<div style={{ width: 320 }}><Meter label="Seats in use" value={18} minValue={0} maxValue={20} formatOptions={{ style: 'decimal' }} /></div>) },
    { name: 'Sizes', description: 'sm 6px, md 8px, lg 12px.', Render: () => (<div style={{ width: 320, display: 'grid', gap: 10 }}><Demo size="sm" value={50} label="Small" /><Demo size="md" value={50} label="Medium" /><Demo size="lg" value={50} label="Large" /></div>) },
    { name: 'Empty', description: 'Zero shows only the track.', Render: () => <Demo value={0} /> },
  ],
  sections: [
    { type: 'rules', id: 'rules', title: 'Rules', items: [
      { title: 'Meter, not progress', body: 'A meter shows a level that can go up and down. A progress bar shows work moving to done.' },
      { title: 'Tune thresholds to the risk', body: 'Storage warns at 70, but seats may warn at 90. Set warnAt and dangerAt to match what users must do.' },
      { title: 'Say the number', body: 'Always show the value or the raw quantities nearby. Color alone is not enough.' },
    ] },
    { type: 'rules', id: 'recipes', title: 'Composition', items: [
      { title: 'With Alert', body: 'At danger level show an Alert with the upgrade action under the meter.' },
      { title: 'In DescriptionList', body: 'Pair the meter with "18 of 20 seats" in the value.' },
    ] },
  ],
  content: { rules: [
    { title: 'Label', body: 'What is measured, not the state: "Storage used", not "Storage almost full".' },
    { title: 'Value text', body: 'Percent by default. For counts add the unit next to the meter: "18 of 20 seats".' },
    { title: 'Warnings', body: 'Put actionable text next to the meter once it passes warnAt.' },
  ] },
  accessibility: {
    keyboard: [{ keys: ['None'], action: 'Not interactive or focusable.' }],
    notes: ['role="meter" with aria-valuenow, aria-valuemin and aria-valuemax; the value text is read.', 'Threshold color is not announced; state the level in text if it matters.', 'Give it a visible label or aria-label.'],
    reducedMotion: 'The fill transition is short and uses transform only; there is no looping motion.',
  },
  props: [
    { name: 'label', type: 'ReactNode', description: 'Visible label.' },
    { name: 'value / minValue / maxValue', type: 'number', default: '0 / 0 / 100', description: 'Current value and range.' },
    { name: 'formatOptions', type: 'Intl.NumberFormatOptions', default: 'percent', description: 'Value text formatting.' },
    { name: 'showValue', type: 'boolean', default: 'true', description: 'Show the value text.' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Track thickness.' },
    { name: 'warnAt', type: 'number', default: '70', description: 'Percent where the fill turns warning.' },
    { name: 'dangerAt', type: 'number', default: '90', description: 'Percent where it turns danger.' },
    { name: 'tone', type: "'accent' | 'success' | 'warning' | 'danger'", description: 'Force a tone and ignore thresholds.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Style override.' },
  ],
  related: ['progress-bar', 'ring-progress', 'alert', 'kpi-strip'],
};
export default page;
