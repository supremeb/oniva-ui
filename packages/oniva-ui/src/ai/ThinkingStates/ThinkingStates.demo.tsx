import type { DemoModule } from '../../internal/demo';
import { ThinkingStates } from './ThinkingStates';

const demo: DemoModule = {
  meta: {
    title: 'Thinking states',
    slug: 'thinking-states',
    category: 'AI & Agent',
    description: 'Rotating status line that swaps with a blur-rise every two seconds.',
  },
  demos: [
    {
      name: 'Data analyst agent',
      code: `<ThinkingStates loop messages={['Reading the sales export…', 'Joining with the CRM accounts…', 'Computing cohort retention…', 'Drafting the summary…']} />`,
      Component: () => (
        <ThinkingStates
          loop
          messages={[
            'Reading the sales export…',
            'Joining with the CRM accounts…',
            'Computing cohort retention…',
            'Drafting the summary…',
          ]}
        />
      ),
    },
    {
      name: 'Fast cadence',
      code: `<ThinkingStates holdMs={1200} messages={['Cloning repo…', 'Running tests…', 'Writing review…']} />`,
      Component: () => <ThinkingStates holdMs={1200} loop messages={['Cloning repo…', 'Running tests…', 'Writing review…']} />,
    },
  ],
};

export default demo;
