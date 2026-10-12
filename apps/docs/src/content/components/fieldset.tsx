import { Fieldset, Input } from 'oniva-ui';
import type { DocPage } from '../types';

type P = { legend?: string; withDescription?: boolean; disabled?: boolean };

const Basic = (p: P) => (
  <div style={{ width: 340 }}>
    <Fieldset legend={p.legend ?? 'Billing address'} description={p.withDescription ? 'Appears on invoices and receipts.' : undefined} disabled={p.disabled}>
      <Input label="Street" defaultValue="2032 Westshore Dr" />
      <Input label="City" defaultValue="Cumming" />
    </Fieldset>
  </div>
);

const page: DocPage = {
  slug: 'fieldset',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Fieldset',
  group: ['Components', 'Forms'],
  sourcePath: 'components/Fieldset',
  lede: 'A native fieldset with a legend and optional description that groups related fields. It handles long forms and disabling a whole group at once.',
  anatomy: {
    intro: 'Three parts. The fieldset and its fields are always present. Legend is strongly recommended; description is optional.',
    Render: () => <Basic withDescription />,
    parts: [
      { name: 'Legend', description: '16px, names the group. Read by screen readers before each field inside.', selector: 'legend' },
      { name: 'Description', description: '13px muted help text under the legend.', selector: '[slot="description"], legend ~ span, legend + *', fallback: { x: 40, y: 22 } },
      { name: 'Fields', description: 'Stacked with a 16px gap. No border or padding, so a Fieldset sits flush in a card.', selector: 'fieldset', fallback: { x: 50, y: 60 } },
    ],
  },
  usage: {
    use: ['Grouping an address, contact or billing block.', 'Disabling several fields together.', 'Giving screen reader users group context for radios and checkboxes.', 'Splitting a long form into scannable sections.'],
    avoid: [
      { text: 'A single field.', instead: { slug: 'field', label: 'Field' } },
      { text: 'A whole form layout.', instead: { slug: 'form', label: 'Form' } },
      { text: 'Visual grouping with no semantic meaning.', instead: { slug: 'card', label: 'Card' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'text', key: 'legend', label: 'Legend', presets: ['Billing address', 'Contact', 'Workspace'] },
      { kind: 'toggle', key: 'withDescription', label: 'Description' },
      { kind: 'toggle', key: 'disabled', label: 'Disabled' },
    ],
    initial: { legend: 'Billing address', withDescription: true, disabled: false },
    render: (p) => <Basic legend={String(p.legend)} withDescription={Boolean(p.withDescription)} disabled={Boolean(p.disabled)} />,
    code: (p) => `<Fieldset legend="${p.legend}"${p.withDescription ? ' description="Appears on invoices and receipts."' : ''}${p.disabled ? ' disabled' : ''}>\n  <Input label="Street" />\n  <Input label="City" />\n</Fieldset>`,
  },
  states: [
    { name: 'Legend only', description: 'Minimum group.', Render: () => <Basic /> },
    { name: 'With description', description: 'Adds context under the legend.', Render: () => <Basic withDescription /> },
    { name: 'Disabled', description: 'Every field inside is disabled by the native fieldset.', Render: () => <Basic legend="Workspace" disabled /> },
  ],
  sections: [
    {
      type: 'numbered',
      id: 'validation',
      title: 'Validation',
      intro: 'Errors stay on fields, but the group helps people find them.',
      items: [
        { title: 'Keep errors on fields', body: 'Each Input shows its own message. Do not add a summary inside the Fieldset.' },
        { title: 'Use the legend for context', body: 'Screen readers say "Billing address, Street" so errors need no repetition of the group name.' },
        { title: 'Group rules need a group message', body: 'For a rule across fields ("Enter phone or email"), show one Description line in the Fieldset and mark both fields invalid.' },
        { title: 'Disable together', body: 'Use disabled on the Fieldset rather than on each field, so the state cannot drift.' },
      ],
    },
    {
      type: 'rules',
      id: 'spacing',
      title: 'Spacing',
      items: [
        { title: '16px between fields', body: 'Built in.' },
        { title: '24px between Fieldsets', body: 'Put them in a Form or a Stack with a 24px gap.' },
        { title: 'Radios and checkboxes', body: 'Use their own group components, which already render a group role.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Legend', body: 'A noun phrase: Billing address. No colon.' },
      { title: 'Description', body: 'Why we ask or where it shows: "Appears on invoices."' },
      { title: 'Length', body: 'Legend under 30 characters, description one line.' },
    ],
  },
  accessibility: {
    keyboard: [{ keys: ['Tab'], action: 'Moves through fields inside. The fieldset itself is not a tab stop.' }],
    notes: [
      'A native fieldset with a legend gives role="group" and an accessible name for free.',
      'Screen readers announce the legend when focus first enters the group.',
      'The disabled attribute on the fieldset disables every descendant control natively.',
      'Do not nest more than one level; screen readers repeat both legends.',
    ],
  },
  props: [
    { name: 'legend', type: 'ReactNode', description: 'Group name.' },
    { name: 'description', type: 'ReactNode', description: 'Help text under the legend.' },
    { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable all descendant controls.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Root style override.' },
    { name: 'ref', type: 'Ref<HTMLFieldSetElement>', description: 'Forwarded to the fieldset.' },
  ],
  related: ['form', 'field', 'radio-group', 'checkbox-group'],
};
export default page;
