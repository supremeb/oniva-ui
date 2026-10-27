import { useState } from 'react';
import { Database, FileText, Mail, Send, Trash2, Wallet } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { AutonomyDial, type AgentAction, type AutonomyLevel } from './AutonomyDial';

const actions: AgentAction[] = [
  { id: 'read', label: 'Read files and docs', risk: 'safe', icon: <FileText size={18} /> },
  { id: 'draft', label: 'Draft emails', risk: 'safe', icon: <Mail size={18} /> },
  { id: 'crm', label: 'Update CRM records', risk: 'risky', icon: <Database size={18} /> },
  { id: 'send', label: 'Send emails', risk: 'risky', icon: <Send size={18} /> },
  { id: 'delete', label: 'Delete files', risk: 'destructive', icon: <Trash2 size={18} /> },
  { id: 'spend', label: 'Spend money', risk: 'destructive', icon: <Wallet size={18} /> },
];

function Controlled() {
  const [level, setLevel] = useState<AutonomyLevel>(2);
  const [pinned, setPinned] = useState<string[]>(['spend']);
  return (
    <AutonomyDial
      title="Sales agent"
      actions={actions}
      level={level}
      onLevelChange={setLevel}
      pinned={pinned}
      onPinnedChange={setPinned}
    />
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Autonomy dial',
    slug: 'autonomy-dial',
    category: 'AI & Agent',
    description: 'Three-stop permission level that shows which real actions run on their own and which ask first.',
  },
  demos: [
    {
      name: 'Uncontrolled',
      code: `<AutonomyDial title="Sales agent" actions={actions} defaultPinned={['spend']} />`,
      Component: () => <AutonomyDial title="Sales agent" defaultLevel={2} actions={actions} defaultPinned={['spend']} />,
    },
    {
      name: 'Controlled',
      code: `const [level, setLevel] = useState<AutonomyLevel>(1);
const [pinned, setPinned] = useState(['spend']);
<AutonomyDial actions={actions} level={level} onLevelChange={setLevel} pinned={pinned} onPinnedChange={setPinned} />`,
      Component: Controlled,
    },
  ],
};

export default demo;
