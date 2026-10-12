import { Stepper } from 'oniva-ui';
import type { DocPage } from '../types';

const steps = [
  { id: 'account', title: 'Account', description: 'Business details' },
  { id: 'bank', title: 'Bank', description: 'Link payout account' },
  { id: 'verify', title: 'Verify', description: 'Confirm identity' },
  { id: 'launch', title: 'Launch', description: 'Go live' },
];

const page: DocPage = {
  slug: 'stepper',
  status: 'Stable',
  version: '0.1.0',
  importName: 'Stepper',
  group: ['Components', 'Navigation'],
  sourcePath: 'components/Stepper',
  lede: 'A numbered progress trail for multi-step flows. Earlier steps are complete, one is current, the rest are ahead.',
  anatomy: {
    intro: 'Five parts. Every step has a marker and title; descriptions, icons and the connector line are optional.',
    Render: () => <Stepper steps={steps} currentStep={1} onStepPress={() => undefined} />,
    parts: [
      { name: 'List', description: 'An ordered list, 12px gap between steps. Horizontal fills the width; vertical stacks.', selector: 'ol[aria-label="Progress"]' },
      { name: 'Marker', description: '32px circle, 13px number. Complete shows a check, current is filled, upcoming is outlined.', selector: 'li[aria-current="step"] button > span:first-child > span:first-child' },
      { name: 'Title', description: '14px medium. The current step is full color; the rest muted.', selector: 'li[aria-current="step"] button > span:first-child > span:last-child > span:first-child' },
      { name: 'Description', description: '13px muted line under the title. Optional.', selector: 'li[aria-current="step"] button > span:first-child > span:last-child > span:nth-child(2)' },
      { name: 'Connector', description: '2px line, 16px minimum, between markers; filled up to the current step.', selector: 'li[aria-current="step"] button > span[aria-hidden="true"]' },
    ],
  },
  usage: {
    use: ['Onboarding, checkout and setup flows with 3 to 6 known steps.', 'Showing what is done and what is left.', 'Letting users return to a completed step.'],
    avoid: [
      { text: 'Switching between peer views.', instead: { slug: 'tabs', label: 'Tabs' } },
      { text: 'Showing a percentage of a task.', instead: { slug: 'progress-bar', label: 'ProgressBar' } },
      { text: 'Paths through a hierarchy.', instead: { slug: 'breadcrumbs', label: 'Breadcrumbs' } },
    ],
  },
  playground: {
    controls: [
      { kind: 'segmented', key: 'orientation', label: 'Orientation', options: ['horizontal', 'vertical'] },
      { kind: 'select', key: 'currentStep', label: 'Current step', options: ['0', '1', '2', '3'] },
      { kind: 'toggle', key: 'interactive', label: 'Completed steps pressable' },
      { kind: 'toggle', key: 'descriptions', label: 'Descriptions' },
    ],
    initial: { orientation: 'horizontal', currentStep: '1', interactive: true, descriptions: true },
    render: (p, ev) => (
      <div style={{ width: p.orientation === 'vertical' ? 260 : 640 }}>
        <Stepper steps={steps.map((s) => (p.descriptions ? s : { id: s.id, title: s.title }))} currentStep={Number(p.currentStep)} orientation={p.orientation as 'horizontal' | 'vertical'} onStepPress={p.interactive ? (i) => ev(`onStepPress(${i})`) : undefined} />
      </div>
    ),
    code: (p) => `<Stepper\n  steps={steps}\n  currentStep={${p.currentStep}}${p.orientation === 'vertical' ? '\n  orientation="vertical"' : ''}${p.interactive ? '\n  onStepPress={setStep}' : ''}\n/>`,
  },
  states: [
    { name: 'First step', description: 'Nothing complete yet.', Render: () => <div style={{ width: 560 }}><Stepper steps={steps} currentStep={0} /></div> },
    { name: 'Middle', description: 'One complete, one current, two ahead.', Render: () => <div style={{ width: 560 }}><Stepper steps={steps} currentStep={2} onStepPress={() => undefined} /></div> },
    { name: 'All complete', description: 'currentStep past the last index.', Render: () => <div style={{ width: 560 }}><Stepper steps={steps} currentStep={4} /></div> },
    { name: 'Vertical', description: 'For narrow columns and long descriptions.', Render: () => <div style={{ width: 240 }}><Stepper steps={steps} currentStep={1} orientation="vertical" /></div> },
    { name: 'Titles only', description: 'Compact version without descriptions.', Render: () => <div style={{ width: 460 }}><Stepper steps={steps.map((s) => ({ id: s.id, title: s.title }))} currentStep={1} /></div> },
  ],
  sections: [
    { type: 'numbered', id: 'stepper-rules', title: 'Rules for steps', items: [{ title: '3 to 6 steps', body: 'Fewer is a single form; more needs grouping.' }, { title: 'Allow going back', body: 'Pass onStepPress so completed steps become buttons. Upcoming steps stay inert.' }, { title: 'Save on Continue', body: 'Persist each step so going back never loses data.' }] },
    { type: 'rules', id: 'stepper-recipes', title: 'Composition recipes', items: [{ title: 'Wizard in a Dialog', body: 'Horizontal Stepper above the DialogBody, Back and Continue in the footer.' }, { title: 'Settings flow', body: 'Vertical Stepper in a left column with the form to its right.' }] },
  ],
  content: { rules: [{ title: 'Titles are nouns', body: 'Account, Bank, Verify. One word if possible.' }, { title: 'Descriptions are the task', body: 'Link payout account. Under 30 characters.' }, { title: 'Buttons name the next step', body: 'Continue to bank, not Next.' }] },
  accessibility: {
    keyboard: [{ keys: ['Tab'], action: 'Moves to pressable completed steps.' }, { keys: ['Enter', 'Space'], action: 'Goes to that step.' }],
    notes: ['An ordered list labelled by aria-label (default Progress).', 'The current step has aria-current="step"; completion is also announced in text.', 'Upcoming steps are not focusable.'],
    reducedMotion: 'The connector fill changes without animation.',
  },
  props: [
    { name: 'steps', type: 'StepperStep[]', description: 'Required. { id, title, description?, icon? }.' },
    { name: 'currentStep', type: 'number', description: 'Required. 0-based index. Lower steps are complete.' },
    { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Layout.' },
    { name: 'onStepPress', type: '(index: number) => void', description: 'Makes completed and current steps pressable.' },
    { name: 'aria-label', type: 'string', default: "'Progress'", description: 'List label.' },
    { name: 'className / style / xstyle', type: 'string / CSSProperties / StyleXStyles', description: 'Overrides.' },
  ],
  related: ['tabs', 'progress-bar', 'breadcrumbs', 'dialog'],
};
export default page;
