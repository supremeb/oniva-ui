import { useEffect, useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { AgentProgress } from './AgentProgress';
import type { TaskItem } from '../TaskList';

const base: TaskItem[] = [
  { id: '1', label: 'Load q3_revenue.csv', status: 'done' },
  { id: '2', label: 'Group deals by segment', status: 'done' },
  { id: '3', label: 'Compare against Q2 and plan', status: 'running' },
  { id: '4', label: 'Search for industry benchmarks', status: 'pending' },
  { id: '5', label: 'Write the summary', status: 'pending' },
];

const demo: DemoModule = {
  meta: {
    title: 'Agent progress',
    slug: 'agent-progress',
    category: 'AI & Agent',
    description:
      'Collapsible plan card with a progress ring, "steps left" count and the live task list.',
  },
  demos: [
    {
      name: 'Plan in progress',
      code: `<AgentProgress items={items} />`,
      Component: () => (
        <div style={{ maxWidth: 420 }}>
          <AgentProgress items={base} />
        </div>
      ),
    },
    {
      name: 'Live advance',
      code: `const [items, setItems] = useState(base); // advance one step every 1.8s
<AgentProgress items={items} />`,
      Component: function Live() {
        const [step, setStep] = useState(2);
        useEffect(() => {
          if (step > 5) return;
          const id = setTimeout(() => setStep((s) => s + 1), 1800);
          return () => clearTimeout(id);
        }, [step]);
        const items = base.map((it, i) => ({
          ...it,
          status:
            i < step ? ('done' as const) : i === step ? ('running' as const) : ('pending' as const),
        }));
        return (
          <div style={{ maxWidth: 420 }}>
            <AgentProgress items={items} />
          </div>
        );
      },
    },
  ],
};

export default demo;
