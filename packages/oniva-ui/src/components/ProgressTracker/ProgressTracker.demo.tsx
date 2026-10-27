import type { DemoModule } from '../../internal/demo';
import { ProgressTracker, type ProgressStep } from './ProgressTracker';

const steps: ProgressStep[] = [
  { id: 'tools', label: 'Connect your tools', done: true },
  { id: 'notify', label: 'Turn on notifications' },
  { id: 'blockers', label: 'Catch up on blockers' },
  { id: 'priorities', label: 'Summarize priorities' },
  { id: 'project', label: 'Create a project', done: true },
];

const demo: DemoModule = {
  meta: {
    title: 'Progress tracker',
    slug: 'progress-tracker',
    category: 'Feedback',
    description: 'Onboarding checklist with an animated bar, self-drawing ticks and optional auto play.',
  },
  demos: [
    {
      name: 'Checklist',
      code: `<ProgressTracker
  title="Getting started"
  steps={[
    { id: 'tools', label: 'Connect your warehouse' },
    { id: 'notify', label: 'Turn on weekly digests' },
    { id: 'project', label: 'Create your first project', done: true },
  ]}
  onChange={(steps) => save(steps)}
/>`,
      Component: () => <ProgressTracker steps={steps} />,
    },
    {
      name: 'Auto play',
      code: `<ProgressTracker title="Launch checklist" steps={steps} autoPlay interval={1800} />`,
      Component: () => <ProgressTracker title="Launch checklist" steps={steps} autoPlay interval={1800} />,
    },
  ],
};

export default demo;
