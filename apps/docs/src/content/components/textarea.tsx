import { Textarea } from 'oniva-ui';
import type { DocPage } from '../types';

type P = {
  label?: string;
  description?: string;
  error?: string;
  rows?: number;
  resize?: 'none' | 'vertical';
  maxLength?: number;
  showCount?: boolean;
  isInvalid?: boolean;
  isDisabled?: boolean;
  value?: string;
  placeholder?: string;
  onChange?: (v: string) => void;
};

const Basic = (p: P) => (
  <div style={{ width: 320 }}>
    <Textarea
      label={p.label ?? 'Description'}
      description={p.description}
      errorMessage={p.error}
      rows={p.rows}
      resize={p.resize}
      maxLength={p.maxLength}
      showCount={p.showCount}
      isInvalid={p.isInvalid}
      isDisabled={p.isDisabled}
      defaultValue={p.value}
      placeholder={p.placeholder ?? 'What changed in this invoice?'}
      onChange={p.onChange}
    />
  </div>
);

const page: DocPage = {
  slug: 'textarea',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Textarea',
  group: ['Components', 'Forms'],
  sourcePath: 'components/Textarea',
  lede: 'A multi-line text field for notes, reasons and descriptions. It handles empty, typing with a character budget, invalid, and locked.',
  anatomy: {
    intro: 'Six parts. The label and text area are always present. Description, error and counter are optional.',
    Render: () => <Basic maxLength={200} showCount value="Net 30 terms apply. Late fees start after Nov 30." description="Visible to approvers." />,
    parts: [
      { name: 'Label', description: '14px medium, linked to the text area.', selector: 'label' },
      { name: 'Field', description: 'Same chrome as Input: 1px border, 10px radius, 10px padding, focus ring. Minimum height 72px (3 rows).', selector: 'div:has(> textarea)' },
      { name: 'Text area', description: '14px regular, 20px line height, vertical resize handle at the bottom corner unless resize is none.', selector: 'textarea' },
      { name: 'Description', description: '13px muted. Sits under the field, left aligned.', selector: '[slot="description"]', fallback: { x: 30, y: 88 } },
      { name: 'Counter', description: 'Right-aligned "used / max" in 13px muted. Shown only with showCount and maxLength.', selector: 'div:has(> div > [slot="description"]) > span', fallback: { x: 92, y: 92 } },
      { name: 'Error', description: '13px red text. Stacks under the description and replaces no other part.', selector: '[slot="errorMessage"]', fallback: { x: 40, y: 96 } },
    ],
  },
  usage: {
    use: ['Notes, comments and reasons longer than a line.', 'A description that may run to a paragraph.', 'Free text with a character limit and counter.', 'Messages the user composes before sending.'],
    avoid: [
      { text: 'Names, emails, IDs and anything on one line.', instead: { slug: 'input', label: 'Input' } },
      { text: 'Rich text with formatting. Use a dedicated editor.' },
      { text: 'Picking from known values.', instead: { slug: 'select', label: 'Select' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'text', key: 'label', label: 'Label', presets: ['Description', 'Internal note', 'Reason for void'] },
      { kind: 'number', key: 'rows', label: 'Rows', min: 2, max: 8, step: 1 },
      { kind: 'segmented', key: 'resize', label: 'Resize', options: ['vertical', 'none'] },
      { kind: 'toggle', key: 'showCount', label: 'Character count' },
      { kind: 'toggle', key: 'isInvalid', label: 'Invalid' },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { label: 'Description', rows: 3, resize: 'vertical', showCount: true, isInvalid: false, isDisabled: false },
    render: (p, onEvent) => (
      <Basic
        label={String(p.label)}
        rows={Number(p.rows)}
        resize={p.resize as 'none' | 'vertical'}
        maxLength={p.showCount ? 200 : undefined}
        showCount={Boolean(p.showCount)}
        isInvalid={Boolean(p.isInvalid)}
        isDisabled={Boolean(p.isDisabled)}
        error="Add a reason of at least 10 characters."
        onChange={(v) => onEvent(`onChange(${v.length} chars)`)}
      />
    ),
    code: (p) => `<Textarea label="${p.label}"${p.rows !== 3 ? ` rows={${p.rows}}` : ''}${p.resize === 'none' ? ' resize="none"' : ''}${p.showCount ? ' maxLength={200} showCount' : ''}${p.isInvalid ? ' isInvalid errorMessage="Add a reason of at least 10 characters."' : ''}${p.isDisabled ? ' isDisabled' : ''} value={note} onChange={setNote} />`,
  },
  states: [
    { name: 'Empty', description: 'Placeholder shows an example.', Render: () => <Basic /> },
    { name: 'With count', description: 'Counter updates on every keystroke.', Render: () => <Basic maxLength={200} showCount value="Net 30 terms apply." /> },
    { name: 'At limit', description: 'Native maxLength stops input at the limit; the counter reads 200 / 200.', Render: () => <Basic maxLength={30} showCount value="Net 30 terms apply to this one" /> },
    { name: 'Invalid', description: 'Red border and a fix-it message.', Render: () => <Basic label="Reason" isInvalid error="A reason is required to void an invoice." /> },
    { name: 'Disabled', description: 'Muted surface, text is not selectable by focus.', Render: () => <Basic isDisabled value="Closed on Sep 30." /> },
    { name: 'Long content', description: 'Scrolls inside the field once past the visible rows.', Render: () => <Basic rows={3} value={'Line 1: vendor confirmed amount.\nLine 2: PO matches.\nLine 3: approved by finance.\nLine 4: scheduled for Nov 1.\nLine 5: receipt attached.'} /> },
  ],
  sections: [
    {
      type: 'numbered',
      id: 'validation',
      title: 'Validation',
      intro: 'Five rules for text that can run long.',
      items: [
        { title: 'Set a limit when one exists', body: 'Use maxLength with showCount so the budget is visible before it is hit.' },
        { title: 'Stop at the limit, do not truncate', body: 'The native maxLength blocks extra input. Never silently cut pasted text; show the counter instead.' },
        { title: 'Require only when needed', body: 'Use isRequired for reasons that must be recorded, such as voiding an invoice.' },
        { title: 'Set a minimum when quality matters', body: 'minLength={10} with "Add a reason of at least 10 characters."' },
        { title: 'Keep what the user wrote', body: 'On a server error, keep the text. Never clear a textarea on failed submit.' },
      ],
    },
    {
      type: 'rules',
      id: 'sizing',
      title: 'Sizing',
      items: [
        { title: 'Rows match expected length', body: '3 rows (72px) for a sentence or two, 5 to 6 for paragraphs. More rows invite essays.' },
        { title: 'Resize', body: 'Vertical by default. Use none inside tight layouts such as sidebars and dialogs.' },
        { title: 'Width', body: 'Fills its container. Keep line length under about 70 characters for readability.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Label', body: 'A noun: Description, Internal note. Not a command.' },
      { title: 'Placeholder', body: 'An example sentence. It disappears on type.' },
      { title: 'Description', body: 'Who sees it: "Visible to approvers."' },
      { title: 'Limits', body: 'Say the limit only in the counter; do not repeat it in the label.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['Tab', 'Shift+Tab'], action: 'Moves focus in and out. Tab does not insert a tab character.' },
      { keys: ['Enter'], action: 'Inserts a new line. Does not submit the form.' },
      { keys: ['Ctrl+Enter'], action: 'Not handled. Wire it yourself for send actions.' },
    ],
    notes: [
      'Built on React Aria TextField with a native textarea.',
      'aria-describedby links description and error. aria-invalid is set when invalid.',
      'The counter is plain text. It is not a live region, so it does not interrupt typing.',
      'Focus shows the same 2px ring as Input.',
      'The resize handle is pointer only. Keyboard users get the scroll inside the field.',
    ],
    reducedMotion: 'The invalid shake is skipped and border changes are instant.',
  },
  props: [
    { name: 'label', type: 'ReactNode', description: 'Visible label.' },
    { name: 'description', type: 'ReactNode', description: 'Help text under the field.' },
    { name: 'errorMessage', type: 'string | (v) => string', description: 'Shown when invalid.' },
    { name: 'placeholder', type: 'string', description: 'Example text when empty.' },
    { name: 'rows', type: 'number', default: '3', description: 'Visible rows. Minimum height 72px.' },
    { name: 'resize', type: "'none' | 'vertical'", default: "'vertical'", description: 'Resize handle behaviour.' },
    { name: 'showCount', type: 'boolean', default: 'false', description: 'Show a counter when maxLength is set.' },
    { name: 'maxLength / minLength', type: 'number', description: 'Native length limits.' },
    { name: 'value / defaultValue', type: 'string', description: 'Controlled or initial value.' },
    { name: 'onChange', type: '(value: string) => void', description: 'Fires on every edit.' },
    { name: 'isRequired / isInvalid / isDisabled / isReadOnly', type: 'boolean', default: 'false', description: 'States.' },
    { name: 'ref', type: 'Ref<HTMLTextAreaElement>', description: 'Forwarded to the textarea.' },
  ],
  related: ['input', 'field', 'form', 'input-group'],
};
export default page;
