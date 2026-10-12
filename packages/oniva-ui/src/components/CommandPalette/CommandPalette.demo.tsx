import {
  BarChart3,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Moon,
  Plus,
  Settings,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '../Button';
import type { DemoModule } from '../../internal/demo';
import { CommandPalette, type CommandGroup } from './CommandPalette';

const groups: CommandGroup[] = [
  {
    id: 'nav',
    title: 'Go to',
    items: [
      { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={16} />, shortcut: 'G O' },
      {
        id: 'revenue',
        label: 'Revenue report',
        icon: <BarChart3 size={16} />,
        keywords: ['sales', 'mrr'],
      },
      { id: 'customers', label: 'Customers', icon: <Users size={16} />, shortcut: 'G C' },
      { id: 'invoices', label: 'Invoices', icon: <FileText size={16} />, keywords: ['billing'] },
    ],
  },
  {
    id: 'actions',
    title: 'Actions',
    items: [
      { id: 'new-invoice', label: 'Create invoice', icon: <Plus size={16} />, shortcut: '⌘N' },
      { id: 'payment', label: 'Add payment method', icon: <CreditCard size={16} /> },
      { id: 'dark', label: 'Toggle dark mode', icon: <Moon size={16} />, keywords: ['theme'] },
    ],
  },
  {
    id: 'account',
    title: 'Account',
    items: [
      { id: 'settings', label: 'Settings', icon: <Settings size={16} />, shortcut: '⌘,' },
      { id: 'signout', label: 'Sign out', icon: <LogOut size={16} />, variant: 'danger' },
    ],
  },
];

const demo: DemoModule = {
  meta: {
    title: 'Command Palette',
    slug: 'command-palette',
    category: 'Overlays',
    description:
      'Searchable command launcher. Opens with ⌘K / Ctrl+K, filters grouped commands with a fuzzy match (also searches hidden keywords), and is fully keyboard driven.',
  },
  demos: [
    {
      name: 'Press ⌘K',
      code: `const [open, setOpen] = useState(false);
<Button variant="secondary" onPress={() => setOpen(true)}>Open palette (⌘K)</Button>
<CommandPalette
  groups={groups}
  isOpen={open}
  onOpenChange={setOpen}
  onSelect={(item) => console.log(item.id)}
/>`,
      Component: function Palette() {
        const [open, setOpen] = useState(false);
        const [picked, setPicked] = useState('nothing yet');
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button variant="secondary" onPress={() => setOpen(true)}>
              Open palette (⌘K)
            </Button>
            <span style={{ fontSize: 13, color: 'var(--textMuted, #6b6b6b)' }}>
              Last command: {picked}
            </span>
            <CommandPalette
              groups={groups}
              isOpen={open}
              onOpenChange={setOpen}
              onSelect={(i) => setPicked(i.label)}
            />
          </div>
        );
      },
    },
  ],
};

export default demo;
