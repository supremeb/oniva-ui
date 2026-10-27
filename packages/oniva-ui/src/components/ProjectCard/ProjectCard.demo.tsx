import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { ProjectCard, type ProjectTask } from './ProjectCard';

const members = [{ name: 'Mara Lindqvist' }, { name: 'Jonas Weber' }, { name: 'Priya Nair' }];
const tasks: ProjectTask[] = [
  { id: 'welcome', label: 'Welcome screen', done: true, assignee: 'Mara Lindqvist' },
  { id: 'workspace', label: 'Workspace setup', done: true, assignee: 'Jonas Weber' },
  { id: 'invite', label: 'Invite teammates', done: true, assignee: 'Mara Lindqvist' },
  { id: 'tour', label: 'First-run checklist', assignee: 'Priya Nair' },
  { id: 'emails', label: 'Lifecycle emails' },
];

const demo: DemoModule = {
  meta: {
    title: 'Project card',
    slug: 'project-card',
    category: 'Data display',
    description: 'Two-line project summary that unfolds on hover: segmented progress ring, people filter and status picker.',
  },
  demos: [
    {
      name: 'Hover to open',
      code: `<ProjectCard
  title="Onboarding flow"
  tasks={tasks}
  status="progress"
  due="Oct 24"
  members={members}
  defaultOpen
  action={{ label: 'Open', onClick: () => router.push('/projects/onboarding') }}
/>`,
      Component: () => (
        <div style={{ minHeight: 420, width: '100%', maxWidth: 340 }}>
          <ProjectCard title="Onboarding flow" tasks={tasks} status="progress" due="Oct 24" members={members} defaultOpen action={{ label: 'Open', onClick: () => undefined }} />
        </div>
      ),
    },
    {
      name: 'Click, controlled tasks',
      code: `const [list, setList] = useState(tasks);
<ProjectCard title="Billing revamp" tasks={list} onTasksChange={setList} trigger="click" defaultOpen />`,
      Component: function Controlled() {
        const [list, setList] = useState(tasks.slice(0, 3));
        return (
          <div style={{ minHeight: 380, width: '100%', maxWidth: 340 }}>
            <ProjectCard title="Billing revamp" tasks={list} onTasksChange={setList} trigger="click" defaultOpen members={members} />
          </div>
        );
      },
    },
  ],
};

export default demo;
