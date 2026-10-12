import type { DemoModule } from '../../internal/demo';
import { TaskList } from './TaskList';

const demo: DemoModule = {
  meta: {
    title: 'Task List',
    slug: 'task-list',
    category: 'AI & Agent',
    description: 'Step checklist for agent plans: done, running and pending states.',
  },
  demos: [
    {
      name: 'Plan',
      code: `<TaskList items={[{ id: '1', label: 'Load q3_revenue.csv', status: 'done' }, …]} />`,
      Component: () => (
        <TaskList
          items={[
            { id: '1', label: 'Load q3_revenue.csv', status: 'done' },
            { id: '2', label: 'Group deals by segment', status: 'done' },
            { id: '3', label: 'Compare against Q2 and plan', status: 'running' },
            { id: '4', label: 'Search for industry benchmarks', status: 'pending' },
            { id: '5', label: 'Write the summary', status: 'pending' },
          ]}
        />
      ),
    },
  ],
};

export default demo;
