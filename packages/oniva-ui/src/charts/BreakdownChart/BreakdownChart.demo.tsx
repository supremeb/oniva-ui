import type { DemoModule } from '../../internal/demo';
import { BreakdownChart } from './BreakdownChart';
import { sprintDimensions, sprintMeasures, sprintTasks } from './BreakdownChart.data';

const wrap = { maxWidth: 780, width: '100%' } as const;

const demo: DemoModule = {
  meta: {
    title: 'Breakdown chart',
    slug: 'breakdown-chart',
    category: 'Charts',
    description:
      'Stacked bars with measure, slice and segment pickers, a hover breakdown and a linked table that repeats every number.',
  },
  demos: [
    {
      name: 'Sprint workload',
      code: `<BreakdownChart
  title="Sprint 24"
  records={tasks}
  dimensions={[
    { key: 'status', label: 'Status', values: ['Backlog', 'Todo', 'In progress', 'In review', 'Done', 'Canceled'] },
    { key: 'priority', label: 'Priority', values: ['Urgent', 'High', 'Medium', 'Low', 'None'] },
    { key: 'owner', label: 'Owner', values: ['Priya', 'Marcus', 'Elena', 'Tomás'] },
  ]}
  measures={[
    { key: 'count', label: 'Task count', unit: 'tasks' },
    { key: 'points', label: 'Story points', unit: 'points', field: 'points' },
  ]}
/>`,
      Component: () => (
        <div style={wrap}>
          <BreakdownChart title="Sprint 24" records={sprintTasks} dimensions={sprintDimensions} measures={sprintMeasures} />
        </div>
      ),
    },
    {
      name: 'By owner, story points',
      code: `<BreakdownChart records={tasks} dimensions={dimensions} measures={measures}
  defaultMeasure="points" defaultSlice="owner" defaultSegment="status" />`,
      Component: () => (
        <div style={wrap}>
          <BreakdownChart
            title="Load by owner"
            records={sprintTasks}
            dimensions={sprintDimensions}
            measures={sprintMeasures}
            defaultMeasure="points"
            defaultSlice="owner"
            defaultSegment="status"
          />
        </div>
      ),
    },
  ],
};
export default demo;
