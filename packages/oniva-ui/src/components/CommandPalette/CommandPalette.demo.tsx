import { BarChartIcon, CalendarPlusIcon, SquareCheckIcon, HashIcon, MailIcon, SparklesIcon, UserPlusIcon, BookOpenIcon, CreditCardIcon, FileTextIcon, DashboardIcon, LogOutIcon, MoonIcon, PlusIcon, SettingsIcon, UsersIcon } from '../../icons/IconSet';
import { useState, type ReactNode } from 'react';
import { Button } from '../Button';
import type { DemoModule } from '../../internal/demo';
import { CommandPalette, type CommandGroup } from './CommandPalette';

const groups: CommandGroup[] = [
  {
    id: 'nav',
    title: 'Go to',
    items: [
      { id: 'overview', label: 'Overview', icon: <DashboardIcon size={16} />, shortcut: 'G O' },
      {
        id: 'revenue',
        label: 'Revenue report',
        icon: <BarChartIcon size={16} />,
        keywords: ['sales', 'mrr'],
      },
      { id: 'customers', label: 'Customers', icon: <UsersIcon size={16} />, shortcut: 'G C' },
      { id: 'invoices', label: 'Invoices', icon: <FileTextIcon size={16} />, keywords: ['billing'] },
    ],
  },
  {
    id: 'actions',
    title: 'Actions',
    items: [
      { id: 'new-invoice', label: 'Create invoice', icon: <PlusIcon size={16} />, shortcut: '⌘N' },
      { id: 'payment', label: 'Add payment method', icon: <CreditCardIcon size={16} /> },
      { id: 'dark', label: 'Toggle dark mode', icon: <MoonIcon size={16} />, keywords: ['theme'] },
    ],
  },
  {
    id: 'account',
    title: 'Account',
    items: [
      { id: 'settings', label: 'Settings', icon: <SettingsIcon size={16} />, shortcut: '⌘,' },
      { id: 'signout', label: 'Sign out', icon: <LogOutIcon size={16} />, variant: 'danger' },
    ],
  },
];

const tool = (icon: ReactNode) => icon;

const composed: CommandGroup[] = [
  {
    id: 'suggestions',
    title: 'Suggestions',
    items: [
      { id: 'email', label: 'Write an email', detail: 'Mail', icon: tool(<MailIcon size={16} />) },
      { id: 'assistant', label: 'Ask assistant', detail: 'Summaries, drafts, answers', icon: tool(<SparklesIcon size={16} />) },
      { id: 'task', label: 'Create a task', detail: 'Tasks', icon: tool(<SquareCheckIcon size={16} />) },
      { id: 'contact', label: 'Add contact to CRM', detail: 'CRM', icon: tool(<UserPlusIcon size={16} />) },
      { id: 'meeting', label: 'Schedule a meeting', detail: 'Calendar', icon: tool(<CalendarPlusIcon size={16} />) },
    ],
  },
  {
    id: 'share',
    title: 'Share',
    items: [
      { id: 'update', label: 'Post an update', detail: '#team-updates', icon: tool(<HashIcon size={16} />) },
      { id: 'page', label: 'Save as page', detail: 'Notes · Meeting notes', icon: tool(<BookOpenIcon size={16} />) },
    ],
  },
  {
    id: 'general',
    title: 'General',
    items: [{ id: 'doc', label: 'New document', icon: tool(<FileTextIcon size={16} />), shortcut: 'N' }],
  },
];

const demo: DemoModule = {
  meta: {
    title: 'Command palette',
    slug: 'command-palette',
    category: 'Overlays',
    description:
      'Searchable command launcher. Opens with ⌘K / Ctrl+K, filters grouped commands with a fuzzy match (also searches hidden keywords), and is fully keyboard driven.',
  },
  demos: [
    {
      name: 'Composed menu (inline)',
      code: `<CommandPalette
  inline
  quickRun
  groups={groups} // items: { label, detail, icon, shortcut }
  placeholder="Type a command or search…"
/>`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 560 }}>
          <CommandPalette inline quickRun groups={composed} placeholder="Type a command or search…" />
        </div>
      ),
    },
    {
      name: 'Press ⌘K, then ⌘1–9 to quick-run',
      code: `const [open, setOpen] = useState(false);
<Button variant="secondary" onPress={() => setOpen(true)}>Open palette (⌘K)</Button>
<CommandPalette
  groups={groups}
  isOpen={open}
  onOpenChange={setOpen}
  quickRun
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
            <span style={{ fontSize: 13, color: 'var(--oniva-color-text-muted)' }}>
              Last command: {picked}
            </span>
            <CommandPalette
              groups={groups}
              isOpen={open}
              onOpenChange={setOpen}
              quickRun
              onSelect={(i) => setPicked(i.label)}
            />
          </div>
        );
      },
    },
  ],
};

export default demo;
