import type { DemoModule } from '../../internal/demo';
import { TaskBoard, type Task } from './TaskBoard';

const sprintStatuses = [
  { id: 'todo', label: 'Todo' },
  { id: 'review', label: 'In review' },
  { id: 'next', label: 'Up next' },
  { id: 'doing', label: 'In progress' },
  { id: 'done', label: 'Done' },
];
const sprint: Task[] = [
  { id: 'NW-214', title: 'Add the launch banner to the marketing site', status: 'todo', priority: 2, labels: ['agents'], assignee: 'maya', created: '2026-10-02' },
  { id: 'NW-209', title: 'Currency rounding in annual invoices', status: 'todo', priority: 3, labels: ['billing'], assignee: 'jonas', due: '2026-10-28', created: '2026-09-28' },
  { id: 'NW-197', title: 'Follow up with the beta customers about pricing', status: 'todo', priority: 1, assignee: 'priya', created: '2026-09-24' },
  { id: 'NW-221', title: 'Review the onboarding copy for the new plans', status: 'review', priority: 2, labels: ['billing'], assignee: 'maya', created: '2026-10-02' },
  { id: 'NW-205', title: 'Add usage limits to the plan comparison table', status: 'review', priority: 3, labels: ['billing'], assignee: 'jonas', created: '2026-09-27' },
  { id: 'NW-188', title: 'Push notification opt-in on iOS', status: 'review', priority: 1, labels: ['infra'], assignee: 'priya', created: '2026-09-21' },
  { id: 'NW-226', title: 'Record the launch walkthrough video', status: 'next', priority: 4, labels: ['agents'], assignee: 'priya', due: '2026-10-24', created: '2026-10-01' },
  { id: 'NW-217', title: 'Plan the press outreach for launch week', status: 'next', priority: 2, assignee: 'maya', created: '2026-09-30' },
  { id: 'NW-199', title: 'Summarize the beta feedback into one doc', status: 'next', priority: 1, assignee: 'jonas', created: '2026-09-25' },
  { id: 'NW-230', title: 'Export guide for the help center', status: 'doing', priority: 1, labels: ['agents'], assignee: 'maya', created: '2026-09-30' },
  { id: 'NW-201', title: 'Proration when teams add seats mid-month', status: 'doing', priority: 3, labels: ['billing'], assignee: 'jonas', due: '2026-11-04', created: '2026-09-23' },
  { id: 'NW-176', title: 'Offline mode for the task list', status: 'doing', priority: 2, labels: ['infra'], assignee: 'priya', created: '2026-09-16' },
  { id: 'NW-160', title: 'Dark mode for the dashboard', status: 'done', priority: 1, labels: ['agents'], assignee: 'priya', created: '2026-09-12' },
  { id: 'NW-171', title: 'Fix crash when uploading large avatars', status: 'done', priority: 2, labels: ['infra'], assignee: 'jonas', created: '2026-09-15' },
];

const demo: DemoModule = {
  meta: {
    title: 'Task board',
    slug: 'task-board',
    category: 'Blocks',
    description: 'Sprint board with drag and drop, quick add, search, label filters, a compact view and a detail panel whose toggle buttons replace dragging.',
  },
  demos: [
    { name: 'Sprint 12', code: `<TaskBoard title="Sprint 12" breadcrumb={["Oniva", "Launch"]} statuses={statuses} defaultTasks={tasks} />`, Component: () => <TaskBoard title="Sprint 12" breadcrumb={["Oniva", "Launch"]} statuses={sprintStatuses} defaultTasks={sprint} today="2026-10-26" /> },
    { name: 'Default', code: `<TaskBoard />`, Component: () => <TaskBoard /> },
    { name: 'Custom title', code: `<TaskBoard title="Launch checklist" today="2026-11-05" />`, Component: () => <TaskBoard title="Launch checklist" today="2026-11-05" /> },
  ],
};
export default demo;
