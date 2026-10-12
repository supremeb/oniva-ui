import { Button, Form, Input } from 'oniva-ui';
import type { DocPage } from '../types';

type P = { compact?: boolean; serverError?: boolean; onSubmit?: () => void };

const Basic = (p: P) => (
  <div style={{ width: 320 }}>
    <Form
      compact={p.compact}
      validationErrors={p.serverError ? { email: 'This email already belongs to a workspace member.' } : undefined}
      onSubmit={(e) => {
        e.preventDefault();
        p.onSubmit?.();
      }}
    >
      <Input label="Full name" name="name" isRequired defaultValue="Priya Raman" />
      <Input label="Work email" name="email" type="email" isRequired defaultValue={p.serverError ? 'marcus@acme.co' : undefined} placeholder="you@company.com" />
      <Button type="submit">Send invite</Button>
    </Form>
  </div>
);

const page: DocPage = {
  slug: 'form',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Form',
  group: ['Components', 'Forms'],
  sourcePath: 'components/Form',
  lede: 'A layout and validation wrapper around the native form. It handles field spacing, native validation on submit, and server errors routed to the right field.',
  anatomy: {
    intro: 'Three parts. The form element and its fields are always present. The submit button is yours; server errors attach to fields by name.',
    Render: () => <Basic serverError />,
    parts: [
      { name: 'Form', description: 'A native form with a 16px vertical gap (tighter with compact). Fields stretch to the form width.', selector: 'form' },
      { name: 'Field', description: 'Any Input, Select, Checkbox and similar. The name prop ties it to validationErrors.', selector: 'form > div:first-child' },
      { name: 'Server error', description: '13px red text under the field it names, replaced on the next edit.', selector: '[slot="errorMessage"]', fallback: { x: 40, y: 70 } },
      { name: 'Submit button', description: 'type="submit" Button at the end. Keep it enabled; show errors instead of blocking.', selector: 'button[type="submit"]' },
    ],
  },
  usage: {
    use: ['Any group of fields submitted together.', 'Native validation: required, type, pattern, min and max.', 'Showing errors returned by the server on the right fields.', 'Dense layouts with compact.'],
    avoid: [
      { text: 'Grouping related fields under one heading.', instead: { slug: 'fieldset', label: 'Fieldset' } },
      { text: 'A single field outside any submit flow.', instead: { slug: 'input', label: 'Input' } },
      { text: 'Setting that applies immediately.', instead: { slug: 'switch', label: 'Switch' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'toggle', key: 'compact', label: 'Compact' },
      { kind: 'toggle', key: 'serverError', label: 'Server error on email' },
    ],
    initial: { compact: false, serverError: false },
    render: (p, onEvent) => <Basic key={String(p.serverError)} compact={Boolean(p.compact)} serverError={Boolean(p.serverError)} onSubmit={() => onEvent('onSubmit')} />,
    code: (p) => `<Form${p.compact ? ' compact' : ''}${p.serverError ? " validationErrors={{ email: 'This email already belongs to a workspace member.' }}" : ''} onSubmit={handleSubmit}>\n  <Input label="Full name" name="name" isRequired />\n  <Input label="Work email" name="email" type="email" isRequired />\n  <Button type="submit">Send invite</Button>\n</Form>`,
  },
  states: [
    { name: 'Default', description: '16px between fields.', Render: () => <Basic /> },
    { name: 'Compact', description: 'Tighter rhythm for dialogs and sidebars.', Render: () => <Basic compact /> },
    { name: 'Server error', description: 'Error from the server shown on the named field.', Render: () => <Basic serverError /> },
  ],
  sections: [
    {
      type: 'numbered',
      id: 'validation',
      title: 'Validation and error messaging',
      intro: 'The Form decides when errors appear. Follow this order.',
      items: [
        { title: 'Native first', body: 'isRequired, type="email", minLength and pattern block submit and focus the first invalid field. No custom code.' },
        { title: 'Show every error at once on submit', body: 'Do not stop at the first. The user fixes all fields in one pass; focus lands on the first.' },
        { title: 'Server errors by name', body: 'Return { email: "…" } and pass it to validationErrors. Give each field a name.' },
        { title: 'Form-level errors', body: 'For failures not tied to one field ("Payment declined"), show an Alert above the submit button, not a field error.' },
        { title: 'Keep submit enabled', body: 'A disabled button gives no reason. Let submit run and show the errors.' },
        { title: 'Clear on edit', body: 'A field error clears when the user edits that field, not when they submit again.' },
      ],
    },
    {
      type: 'rules',
      id: 'recipes',
      title: 'Composition',
      items: [
        { title: 'Group with Fieldset', body: 'Address, billing and contact blocks each get a Fieldset legend.' },
        { title: 'One primary action', body: 'A single submit Button. Cancel is a secondary or quiet Button beside it.' },
        { title: 'Long forms', body: 'Split by Fieldset with 24px between groups; do not paginate without a reason.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Submit label', body: 'Verb and object: Send invite, Save changes. Not Submit.' },
      { title: 'Required marking', body: 'Mark the exception, "(optional)", when most fields are required.' },
      { title: 'Error tone', body: 'Say how to fix it in under 80 characters. No exclamation marks.' },
      { title: 'Success', body: 'Confirm with a Toast naming what happened: "Invite sent to marcus@acme.co".' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['Tab', 'Shift+Tab'], action: 'Moves between fields and buttons in source order.' },
      { keys: ['Enter'], action: 'In a single-line field, submits the form.' },
    ],
    notes: [
      'Built on React Aria Form: a native form with validationBehavior="native" by default.',
      'On a failed submit, focus moves to the first invalid field and its message is read.',
      'Errors are linked with aria-describedby on each field.',
      'Keep the DOM order the same as the visual order.',
    ],
  },
  props: [
    { name: 'compact', type: 'boolean', default: 'false', description: 'Tighter vertical rhythm.' },
    { name: 'onSubmit', type: '(e: FormEvent) => void', description: 'Called when native validation passes.' },
    { name: 'validationErrors', type: 'Record<string, string | string[]>', description: 'Server errors keyed by field name.' },
    { name: 'validationBehavior', type: "'native' | 'aria'", default: "'native'", description: 'Block submit natively or validate live.' },
    { name: 'onInvalid', type: '(e: FormEvent) => void', description: 'Called when submit fails validation.' },
    { name: 'action / method', type: 'string', description: 'Native form submission.' },
    { name: 'xstyle', type: 'StyleXStyles', description: 'Root style override.' },
    { name: 'ref', type: 'Ref<HTMLFormElement>', description: 'Forwarded to the form.' },
  ],
  related: ['field', 'fieldset', 'input', 'button', 'file-upload'],
};
export default page;
