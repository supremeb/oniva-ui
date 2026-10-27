import type { DemoModule } from '../../internal/demo';
import { ScreenFrame } from '../../internal/s1-frame';
import { AgentRun } from './AgentRun';
import { defaultRunSteps } from './AgentRun.data';

const manual = defaultRunSteps.map((s, i) => ({
  ...s,
  status: (i < 3 ? 'done' : 'waiting') as 'done' | 'waiting',
}));

const demo: DemoModule = {
  meta: {
    title: 'Agent run screen',
    slug: 'agent-run',
    category: 'Screens',
    description:
      'Detail view of one autonomous run: the plan ticking through its steps, tool calls, an approval the run waits on and the draft the agent wrote as a reviewable diff.',
  },
  demos: [
    {
      name: 'Live simulation',
      code: `<ScreenFrame>
  <AgentRun title="Prepare the Q3 board update" workspace="Northwind Labs" onApprove={(id) => api.approve(id)} />
</ScreenFrame>`,
      Component: () => (
        <ScreenFrame>
          <AgentRun workspace="Northwind Labs" />
        </ScreenFrame>
      ),
    },
    {
      name: 'Driven by your events',
      code: `<AgentRun autoRun={false} steps={steps /* each step carries its own status */} />`,
      Component: () => (
        <ScreenFrame>
          <AgentRun autoRun={false} steps={manual} workspace="Northwind Labs" />
        </ScreenFrame>
      ),
    },
  ],
};
export default demo;
