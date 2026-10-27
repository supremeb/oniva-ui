import type { DemoModule } from '../../internal/demo';
import { SetupGuide, type SetupGroup } from './SetupGuide';

const groups: SetupGroup[] = [
  {
    id: 'workspace',
    title: 'Set up your workspace',
    tasks: [
      { id: 'name', label: 'Choose a workspace name' },
      { id: 'invite', label: 'Invite your teammates to collaborate' },
      { id: 'calendar', label: 'Connect your calendar' },
    ],
  },
  {
    id: 'billing',
    title: 'Set up billing',
    tasks: [
      { id: 'plan', label: 'Pick a plan' },
      { id: 'card', label: 'Add a payment method' },
    ],
  },
  {
    id: 'verify',
    title: 'Verify your account',
    tasks: [{ id: 'email', label: 'Confirm your email', done: true }],
  },
];

const demo: DemoModule = {
  meta: {
    title: 'Setup guide',
    slug: 'setup-guide',
    category: 'Feedback',
    description: 'Onboarding panel with a progress bar and collapsible task groups. Each task unlocks the next.',
  },
  demos: [
    {
      name: 'Three groups',
      code: `<SetupGuide
  groups={groups}
  onEdit={() => openEditor()}
  onClose={() => hideGuide()}
  onChange={(done) => save(done)}
/>`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 380 }}>
          <SetupGuide groups={groups} onEdit={() => undefined} onClose={() => undefined} />
        </div>
      ),
    },
  ],
};

export default demo;
