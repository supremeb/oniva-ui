import { Bell, Shield, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Switch } from '../../components/Switch';
import type { DemoModule } from '../../internal/demo';
import { SettingsModal, type SettingsPage } from './SettingsModal';

const col = { display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 420 } as const;

const pages: SettingsPage[] = [
  {
    id: 'profile',
    label: 'Profile',
    icon: <User size={16} />,
    content: (
      <div style={col}>
        <Input label="Display name" defaultValue="Ana Lindqvist" />
        <Input label="Email" type="email" defaultValue="ana@northwind.io" />
        <div>
          <Button size="sm">Save changes</Button>
        </div>
      </div>
    ),
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <Bell size={16} />,
    content: (
      <div style={col}>
        <Switch defaultSelected>Weekly digest email</Switch>
        <Switch defaultSelected>Mentions and replies</Switch>
        <Switch>Product announcements</Switch>
      </div>
    ),
  },
  {
    id: 'security',
    label: 'Security',
    icon: <Shield size={16} />,
    heading: 'Sign-in & security',
    content: (
      <div style={col}>
        <Switch defaultSelected>Two-factor authentication</Switch>
        <Switch>Require re-login every 30 days</Switch>
      </div>
    ),
  },
];

function Controlled() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>Open settings</Button>
      <SettingsModal pages={pages} isOpen={open} onOpenChange={setOpen} />
    </>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Settings modal',
    slug: 'settings-modal',
    category: 'Widgets',
    description: 'Multi-page settings dialog with a vertical sidebar nav and per-page content.',
  },
  demos: [
    {
      name: 'Controlled dialog',
      code: `const [open, setOpen] = useState(false);
<Button onPress={() => setOpen(true)}>Open settings</Button>
<SettingsModal pages={pages} isOpen={open} onOpenChange={setOpen} />`,
      Component: Controlled,
    },
    {
      name: 'Start on Security',
      code: `<SettingsModal pages={pages} defaultPage="security" isOpen={open} onOpenChange={setOpen} />`,
      Component: function StartOnSecurity() {
        const [open, setOpen] = useState(false);
        return (
          <>
            <Button variant="secondary" onPress={() => setOpen(true)}>
              Security settings
            </Button>
            <SettingsModal
              pages={pages}
              defaultPage="security"
              isOpen={open}
              onOpenChange={setOpen}
            />
          </>
        );
      },
    },
  ],
};

export default demo;
