import { Description, Field, FieldError, Label } from 'oniva-ui';
import { Input as RacInput, TextField } from 'react-aria-components';
import type { DocPage } from '../types';

type P = { isInvalid?: boolean; withDescription?: boolean; label?: string };

const Basic = (p: P) => (
  <div style={{ width: 320 }}>
    <TextField isInvalid={p.isInvalid} defaultValue={p.isInvalid ? '12-34' : ''}>
      <Field>
        <Label>{p.label ?? 'Tax ID'}</Label>
        <RacInput style={{ height: 38, borderRadius: 10, border: '1px solid var(--oniva-color-border)', padding: '0 10px', background: 'var(--oniva-color-surface)', color: 'inherit', font: 'inherit' }} />
        {p.withDescription && <Description>Nine digits, found on your IRS letter.</Description>}
        <FieldError>Enter a valid EIN (12-3456789).</FieldError>
      </Field>
    </TextField>
  </div>
);

const page: DocPage = {
  slug: 'field',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Field',
  group: ['Components', 'Forms'],
  sourcePath: 'components/Field',
  lede: 'The building blocks around any control: label, help text and error message with consistent type and spacing. Use them to compose a field the ready-made inputs do not cover.',
  anatomy: {
    intro: 'Four parts. Field is the 6px-gap column. Label is required; Description and FieldError are optional and appear in that order below the control.',
    Render: () => <Basic withDescription isInvalid />,
    parts: [
      { name: 'Field', description: 'Flex column with a 6px gap, sans font. Wrap it in a React Aria field (TextField, NumberField) so parts are linked.', selector: 'div:has(> label)' },
      { name: 'Label', description: '14px medium, 20px line height. Linked to the control by the React Aria field context.', selector: 'label' },
      { name: 'Description', description: '13px muted, 18px line height. Registers with aria-describedby.', selector: '[slot="description"]' },
      { name: 'FieldError', description: '13px red text. Renders only when the field is invalid, so it takes no space otherwise.', selector: '[slot="errorMessage"]' },
    ],
  },
  usage: {
    use: ['Wrapping a custom control with a standard label and help.', 'Composing with React Aria fields the library has no wrapper for.', 'Keeping label, description and error typography consistent.', 'Building your own Input variant.'],
    avoid: [
      { text: 'A normal text field.', instead: { slug: 'input', label: 'Input' } },
      { text: 'Grouping several fields under one title.', instead: { slug: 'fieldset', label: 'Fieldset' } },
      { text: 'Laying out a whole form.', instead: { slug: 'form', label: 'Form' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'text', key: 'label', label: 'Label', presets: ['Tax ID', 'Billing email', 'PO number'] },
      { kind: 'toggle', key: 'withDescription', label: 'Description' },
      { kind: 'toggle', key: 'isInvalid', label: 'Invalid' },
    ],
    initial: { label: 'Tax ID', withDescription: true, isInvalid: false },
    render: (p, onEvent) => (
      <div onBlur={() => onEvent('onBlur')}>
        <Basic label={String(p.label)} withDescription={Boolean(p.withDescription)} isInvalid={Boolean(p.isInvalid)} />
      </div>
    ),
    code: (p) => `<TextField${p.isInvalid ? ' isInvalid' : ''}>\n  <Field>\n    <Label>${p.label}</Label>\n    <RacInput />${p.withDescription ? '\n    <Description>Nine digits, found on your IRS letter.</Description>' : ''}\n    <FieldError>Enter a valid EIN (12-3456789).</FieldError>\n  </Field>\n</TextField>`,
  },
  states: [
    { name: 'Label only', description: 'Minimum viable field.', Render: () => <Basic /> },
    { name: 'With description', description: 'Help text under the control.', Render: () => <Basic withDescription /> },
    { name: 'Invalid', description: 'Error appears below the description.', Render: () => <Basic withDescription isInvalid /> },
  ],
  sections: [
    {
      type: 'numbered',
      id: 'validation',
      title: 'Validation and error messaging',
      intro: 'Field renders messages; the React Aria field decides when they show.',
      items: [
        { title: 'Put FieldError last', body: 'Order is label, control, description, error. Screen readers read them in that order.' },
        { title: 'One message at a time', body: 'FieldError shows the first message. Order your validators so the most useful comes first.' },
        { title: 'Describe the rule before it fails', body: 'Use Description for the format. Use FieldError for the fix. Do not say the same thing twice.' },
        { title: 'Write what to do', body: '"Enter a valid EIN (12-3456789)", not "Invalid". Include an example when the format is not obvious.' },
        { title: 'Pass isInvalid or validate', body: 'Set isInvalid, or validate and native rules, on the parent field. FieldError reads that state.' },
      ],
    },
    {
      type: 'rules',
      id: 'recipes',
      title: 'Composition',
      items: [
        { title: 'Parent matters', body: 'Wrap in TextField, NumberField, Select and similar so aria-labelledby and aria-describedby link up.' },
        { title: 'Prefer ready-made inputs', body: 'Input, Select and the rest already include these parts. Reach for Field only for custom controls.' },
        { title: 'Spacing', body: '6px inside a field, 16px between fields (Form), 24px between Fieldsets.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Label', body: 'Noun, sentence case, no colon.' },
      { title: 'Description', body: 'Format or reason, one line, no period needed for fragments.' },
      { title: 'Error', body: 'Imperative fix, under 80 characters, no "Error:" prefix.' },
    ],
  },
  accessibility: {
    keyboard: [{ keys: ['Tab'], action: 'Field is not focusable itself; focus goes to the control inside it.' }],
    notes: [
      'Label is a native label wired through React Aria context, so the control gets its accessible name.',
      'Description and FieldError set aria-describedby on the control.',
      'FieldError renders only when invalid, and is announced when it appears.',
      'Error text meets 4.5:1 contrast on the surface; do not rely on color alone.',
    ],
  },
  props: [
    { name: 'Field: xstyle, ref', type: 'StyleXStyles, Ref<HTMLDivElement>', description: 'Column wrapper. Accepts div attributes.' },
    { name: 'Label', type: 'AriaLabelProps', description: 'Visible label. Accepts htmlFor, xstyle and ref.' },
    { name: 'Description', type: 'TextProps', description: 'Help text. The slot is set for you.' },
    { name: 'FieldError', type: 'AriaFieldErrorProps', description: 'Error text. Children can be a node or a function of ValidationResult.' },
  ],
  related: ['input', 'fieldset', 'form', 'textarea'],
};
export default page;
