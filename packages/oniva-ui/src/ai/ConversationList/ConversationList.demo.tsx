import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { ConversationList, type Thread } from './ConversationList';

const initial: Thread[] = [
  { id: '1', title: 'Q3 board deck review', preview: 'Revenue slide needs the NRR footnote', time: '2h', pinned: true },
  { id: '2', title: 'Vendor onboarding checklist', preview: 'W-9 and bank verification are done', time: '5h', pinned: true },
  { id: '3', title: 'Refund policy edge cases', preview: 'What if the charge is older than 90 days?', time: '1d' },
  { id: '4', title: 'Draft: Series A data room index', preview: 'Folder structure proposal', time: '2d' },
  { id: '5', title: 'Churn cohort analysis', preview: 'SQL for monthly retention', time: '4d' },
];

function Live() {
  const [threads, setThreads] = useState(initial);
  const [active, setActive] = useState('1');
  return (
    <div style={{ maxWidth: 320, width: '100%' }}>
      <ConversationList
        threads={threads}
        activeId={active}
        onSelect={setActive}
        onPin={(id, pinned) => setThreads((l) => l.map((t) => (t.id === id ? { ...t, pinned } : t)))}
        onRename={(id, title) => setThreads((l) => l.map((t) => (t.id === id ? { ...t, title } : t)))}
      />
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Conversation list',
    slug: 'conversation-list',
    category: 'AI & Agent',
    description: 'Threads sidebar with search, pinned group, pin toggle and inline rename.',
  },
  demos: [
    {
      name: 'Threads',
      code: `<ConversationList threads={threads} activeId={active} onSelect={setActive} onPin={pin} onRename={rename} />`,
      Component: Live,
    },
  ],
};

export default demo;
