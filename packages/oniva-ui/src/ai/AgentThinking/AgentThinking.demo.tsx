import type { DemoModule } from '../../internal/demo';
import { AgentThinking } from './AgentThinking';

const reasoning = `The user wants Q3 revenue by segment.
1. Load q3_revenue.csv and group by segment.
2. Compare against Q2 and plan ($4.55M).
3. Flag self-serve churn as the one soft spot.`;

const demo: DemoModule = {
  meta: {
    title: 'Agent Thinking',
    slug: 'agent-thinking',
    category: 'AI & Agent',
    description: 'Collapsible reasoning block with a shimmering label and elapsed time.',
  },
  demos: [
    {
      name: 'Live',
      code: `<AgentThinking isThinking defaultExpanded>{reasoning}</AgentThinking>`,
      Component: () => (
        <div style={{ maxWidth: 480 }}>
          <AgentThinking isThinking defaultExpanded>
            {reasoning}
          </AgentThinking>
        </div>
      ),
    },
    {
      name: 'Finished',
      code: `<AgentThinking seconds={14}>{reasoning}</AgentThinking>`,
      Component: () => (
        <div style={{ maxWidth: 480 }}>
          <AgentThinking seconds={14}>{reasoning}</AgentThinking>
        </div>
      ),
    },
  ],
};

export default demo;
