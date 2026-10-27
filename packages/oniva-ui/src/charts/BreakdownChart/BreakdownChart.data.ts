import type { BreakdownDimension, BreakdownMeasure, BreakdownRecord } from './BreakdownChart';

const people = ['Priya', 'Marcus', 'Elena', 'Tomás'];
const status = ['Backlog', 'Todo', 'In progress', 'In review', 'Done', 'Canceled'];
const priority = ['Urgent', 'High', 'Medium', 'Low', 'None'];
// Weighted so Done dominates and Canceled stays small, like a real sprint board.
const statusWheel = ['Backlog', 'Todo', 'In progress', 'Done', 'Todo', 'In review', 'Done', 'Backlog', 'In progress', 'Done', 'Todo', 'Canceled', 'Done', 'In review', 'Done', 'In progress', 'Done'];

/** Deterministic sprint tasks for demos and tests (212 tasks). */
export const sprintTasks: BreakdownRecord[] = Array.from({ length: 212 }, (_, i) => ({
  id: `T-${100 + i}`,
  status: statusWheel[(i * 5 + (i % 7)) % statusWheel.length],
  priority: priority[(i * 7 + (i % 5) * 3 + (i % 11)) % 5],
  owner: people[(i * 3) % 4],
  points: 1 + ((i * 3) % 5),
}));

export const sprintDimensions: BreakdownDimension[] = [
  { key: 'status', label: 'Status', values: status },
  { key: 'priority', label: 'Priority', values: priority, tones: { Urgent: 3, High: 8, Medium: 1, Low: 6, None: 10 } },
  { key: 'owner', label: 'Owner', values: people },
];

export const sprintMeasures: BreakdownMeasure[] = [
  { key: 'count', label: 'Task count', unit: 'tasks' },
  { key: 'points', label: 'Story points', unit: 'points', field: 'points' },
];
