import { InputOTP } from 'oniva-ui';
import type { DocPage } from '../types';

type P = { length?: number; separatorAt?: number; value?: string; isInvalid?: boolean; isDisabled?: boolean; label?: string; onComplete?: (v: string) => void; onChange?: (v: string) => void };

const Basic = (p: P) => (
  <div style={{ width: 360 }}>
    <InputOTP
      label={p.label ?? 'Verification code'}
      length={p.length}
      separatorAt={p.separatorAt}
      defaultValue={p.value}
      isInvalid={p.isInvalid}
      errorMessage={p.isInvalid ? 'That code has expired. Request a new one.' : undefined}
      isDisabled={p.isDisabled}
      onComplete={p.onComplete}
      onChange={p.onChange}
    />
  </div>
);

const page: DocPage = {
  slug: 'input-otp',
  status: 'Stable',
  version: '0.1.0',
  importName: 'InputOTP',
  group: ['Components', 'Forms'],
  sourcePath: 'components/InputOTP',
  lede: 'A row of single-character slots for one-time codes and PINs. It handles typing, pasting a whole code, and autofill from SMS.',
  anatomy: {
    intro: 'Four parts. The label and slots are always present. The separator is optional and the error appears when the code is rejected.',
    Render: () => <Basic separatorAt={3} value="482" />,
    parts: [
      { name: 'Label', description: '14px medium. Say what the code is for.', selector: 'label' },
      { name: 'Slot', description: '40×48px, 10px radius, 20px text, 8px gap. The active slot shows the focus ring.', selector: '[data-slot="0"]' },
      { name: 'Separator', description: '8×2px dash after separatorAt slots, for example 123-456.', selector: '[data-slot="2"] + span' },
      { name: 'Hidden input', description: 'One real input holds the full value, so paste and SMS autofill work.', selector: 'input' },
    ],
  },
  usage: {
    use: ['Two-factor and email verification codes.', 'Card PINs and short access codes.', 'Fixed-length numeric entry of 4 to 8 characters.', 'Codes sent by SMS, where autofill matters.'],
    avoid: [
      { text: 'Variable-length or alphanumeric free text.', instead: { slug: 'input', label: 'Input' } },
      { text: 'Quantities and amounts.', instead: { slug: 'number-field', label: 'NumberField' } },
      { text: 'Passwords.', instead: { slug: 'input', label: 'Input with type="password"' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'number', key: 'length', label: 'Length', min: 4, max: 8, step: 1 },
      { kind: 'number', key: 'separatorAt', label: 'Separator after', min: 0, max: 7, step: 1 },
      { kind: 'text', key: 'label', label: 'Label', presets: ['Verification code', 'Card PIN', 'Access code'] },
      { kind: 'toggle', key: 'isInvalid', label: 'Invalid' },
      { kind: 'toggle', key: 'isDisabled', label: 'Disabled' },
    ],
    initial: { length: 6, separatorAt: 3, label: 'Verification code', isInvalid: false, isDisabled: false },
    render: (p, onEvent) => (
      <Basic key={`${p.length}-${p.separatorAt}`} length={Number(p.length)} separatorAt={Number(p.separatorAt) || undefined} label={String(p.label)} isInvalid={Boolean(p.isInvalid)} isDisabled={Boolean(p.isDisabled)} onChange={(v) => onEvent(`onChange("${v}")`)} onComplete={(v) => onEvent(`onComplete("${v}")`)} />
    ),
    code: (p) => `<InputOTP label="${p.label}"${p.length !== 6 ? ` length={${p.length}}` : ''}${Number(p.separatorAt) ? ` separatorAt={${p.separatorAt}}` : ''}${p.isInvalid ? ' isInvalid errorMessage="That code has expired. Request a new one."' : ''}${p.isDisabled ? ' isDisabled' : ''} onComplete={(code) => verify(code)} />`,
  },
  states: [
    { name: 'Empty', description: 'Six empty slots; first is focused on tab.', Render: () => <Basic separatorAt={3} /> },
    { name: 'Partially filled', description: 'Filled slots show digits; the next is active.', Render: () => <Basic separatorAt={3} value="482" /> },
    { name: 'Complete', description: 'Fires onComplete once, when the last slot fills.', Render: () => <Basic separatorAt={3} value="482913" /> },
    { name: 'Four digit PIN', description: 'length 4, no separator.', Render: () => <Basic length={4} label="Card PIN" /> },
    { name: 'Invalid', description: 'Slots turn red with a message about what to do.', Render: () => <Basic length={4} value="1234" isInvalid /> },
    { name: 'Disabled', description: 'Muted slots.', Render: () => <Basic isDisabled /> },
  ],
  sections: [
    {
      type: 'numbered',
      id: 'validation',
      title: 'Validation',
      intro: 'A code is right or wrong only after the server checks it.',
      items: [
        { title: 'Verify on complete', body: 'Run the check in onComplete. Do not add a Submit button for a code the user just finished.' },
        { title: 'Restrict characters', body: 'Digits only by default. Pass allowedChars for alphanumeric codes; other characters are ignored while typing.' },
        { title: 'Say what happened', body: '"That code has expired. Request a new one." Distinguish wrong, expired and locked out.' },
        { title: 'Clear and refocus on failure', body: 'Reset the value and focus the first slot so the user retypes at once.' },
        { title: 'Limit attempts and say so', body: 'After 5 failures show "Too many tries. Try again in 10 minutes." and disable the field.' },
      ],
    },
    {
      type: 'rules',
      id: 'autofill',
      title: 'Paste and autofill',
      items: [
        { title: 'Paste fills all slots', body: 'The hidden input receives the whole code; extra characters are dropped.' },
        { title: 'SMS autofill', body: 'The input uses autoComplete="one-time-code", so iOS and Android suggest the code.' },
        { title: 'Offer resend', body: 'Place a "Send a new code" link below with a 30 second cooldown note.' },
      ],
    },
  ],
  content: {
    rules: [
      { title: 'Label', body: 'What the code is: Verification code, Card PIN.' },
      { title: 'Description', body: 'Where it came from: "We sent a 6-digit code to p***@acme.co".' },
      { title: 'Errors', body: 'Wrong, expired, locked: three different messages.' },
    ],
  },
  accessibility: {
    keyboard: [
      { keys: ['0–9'], action: 'Types into the active slot and advances.' },
      { keys: ['Backspace'], action: 'Clears the active slot and moves back.' },
      { keys: ['←', '→'], action: 'Moves between slots.' },
      { keys: ['Ctrl+V', '⌘V'], action: 'Pastes a full code across all slots.' },
      { keys: ['Tab'], action: 'Leaves the field; slots are one tab stop.' },
    ],
    notes: [
      'One real input holds the value, so screen readers hear a single text field with the label.',
      'Slots are visual. Their digits are not announced individually; the input value is.',
      'Errors are linked with aria-describedby and announced when they appear.',
      'inputMode is numeric by default, which opens the number pad on touch.',
      'Slots are 40×48px, close to the 44px touch target recommendation.',
    ],
    reducedMotion: 'The caret blink and slot transitions are removed.',
  },
  props: [
    { name: 'label / description / errorMessage', type: 'ReactNode', description: 'Standard field text.' },
    { name: 'length', type: 'number', default: '6', description: 'Number of slots.' },
    { name: 'separatorAt', type: 'number', description: 'Dash after this many slots.' },
    { name: 'allowedChars', type: 'RegExp', default: '/\\d/', description: 'Characters accepted per slot.' },
    { name: 'value / defaultValue', type: 'string', description: 'Controlled or initial code.' },
    { name: 'onChange', type: '(value: string) => void', description: 'Fires on every edit.' },
    { name: 'onComplete', type: '(value: string) => void', description: 'Fires when all slots are filled.' },
    { name: 'isDisabled / isInvalid / isReadOnly', type: 'boolean', default: 'false', description: 'States.' },
    { name: 'autoFocus', type: 'boolean', default: 'false', description: 'Focus on mount.' },
  ],
  related: ['input', 'number-field', 'form', 'button'],
};
export default page;
