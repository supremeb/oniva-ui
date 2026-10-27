import { FileText, LayoutGrid, LogOut, Settings } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { ProfileMenu } from './ProfileMenu';

const items = [
  { id: 'settings', label: 'Settings', icon: <Settings size={16} /> },
  { id: 'docs', label: 'Docs', icon: <FileText size={16} /> },
  { id: 'apps', label: 'Apps', icon: <LayoutGrid size={16} />, badge: 'New' },
  { id: 'logout', label: 'Log out', icon: <LogOut size={16} /> },
];

const demo: DemoModule = {
  meta: {
    title: 'Profile menu',
    slug: 'profile-menu',
    category: 'Navigation',
    description: 'Account card with the signed-in user, a keyboard-navigable menu and profile setup progress.',
  },
  demos: [
    {
      name: 'With setup progress',
      code: `<ProfileMenu
  name="Lena Hartmann"
  email="lena.hartmann@fastmail.example"
  items={[
    { id: 'settings', label: 'Settings', icon: <Settings size={16} />, onSelect: openSettings },
    { id: 'logout', label: 'Log out', icon: <LogOut size={16} />, danger: true, onSelect: signOut },
  ]}
  setup={{ done: 3, total: 5, next: 'Add a profile photo', onContinue: openProfile }}
/>`,
      Component: () => (
        <ProfileMenu
          name="Lena Hartmann"
          email="lena.hartmann@fastmail.example"
          items={items}
          setup={{ done: 3, total: 5, next: 'Add a profile photo', onContinue: () => undefined }}
        />
      ),
    },
    {
      name: 'Menu only',
      code: `<ProfileMenu name="Omar Haddad" email="omar@studio-north.example" items={items} />`,
      Component: () => <ProfileMenu name="Omar Haddad" email="omar@studio-north.example" items={items} />,
    },
  ],
};

export default demo;
