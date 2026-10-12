import {
  Archive,
  Copy,
  CreditCard,
  LogOut,
  Pencil,
  Settings,
  Trash2,
  User,
  UserPlus,
} from 'lucide-react';
import { useState } from 'react';
import type { Selection } from 'react-aria-components';
import { Button } from '../Button';
import type { DemoModule } from '../../internal/demo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSection,
  DropdownMenuSeparator,
  DropdownMenuSubmenu,
} from './DropdownMenu';

const demo: DemoModule = {
  meta: {
    title: 'Dropdown menu',
    slug: 'dropdown-menu',
    category: 'Overlays',
    description:
      'Menu of actions opened from a button. Sections, icons, keyboard shortcut hints, checkable and radio items, and submenus, with full arrow-key navigation and typeahead.',
  },
  demos: [
    {
      name: 'Account menu',
      code: `<DropdownMenu>
  <Button variant="secondary">Priya Nair</Button>
  <DropdownMenuContent placement="bottom start" onAction={(k) => …}>
    <DropdownMenuSection title="Account">
      <DropdownMenuItem id="profile" icon={<User size={16} />} shortcut="⌘P">Profile</DropdownMenuItem>
      <DropdownMenuItem id="billing" icon={<CreditCard size={16} />}>Billing</DropdownMenuItem>
    </DropdownMenuSection>
    <DropdownMenuSeparator />
    <DropdownMenuItem id="out" icon={<LogOut size={16} />} variant="danger">Sign out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
      Component: function Account() {
        const [last, setLast] = useState('none');
        return (
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <DropdownMenu>
              <Button variant="secondary">Priya Nair</Button>
              <DropdownMenuContent placement="bottom start" onAction={(k) => setLast(String(k))}>
                <DropdownMenuSection title="Account">
                  <DropdownMenuItem id="profile" icon={<User size={16} />} shortcut="⌘P">
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem id="billing" icon={<CreditCard size={16} />}>
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem id="settings" icon={<Settings size={16} />} shortcut="⌘,">
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuSection>
                <DropdownMenuSeparator />
                <DropdownMenuItem id="invite" icon={<UserPlus size={16} />} isDisabled>
                  Invite teammates (Pro)
                </DropdownMenuItem>
                <DropdownMenuItem id="signout" icon={<LogOut size={16} />} variant="danger">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <span style={{ fontSize: 13, color: 'var(--oniva-color-text-muted)' }}>
              Last action: {last}
            </span>
          </div>
        );
      },
    },
    {
      name: 'Checkable, radio and submenu',
      code: `<DropdownMenuContent>
  <DropdownMenuSection title="Columns" selectionMode="multiple" selectedKeys={cols} onSelectionChange={setCols}>
    <DropdownMenuItem id="amount">Amount</DropdownMenuItem> …
  </DropdownMenuSection>
  <DropdownMenuSeparator />
  <DropdownMenuSection title="Density" selectionMode="single" selectedKeys={density} onSelectionChange={setDensity}>…</DropdownMenuSection>
  <DropdownMenuSubmenu>
    <DropdownMenuItem id="export">Export as…</DropdownMenuItem>
    <DropdownMenuContent><DropdownMenuItem id="csv">CSV</DropdownMenuItem>…</DropdownMenuContent>
  </DropdownMenuSubmenu>
</DropdownMenuContent>`,
      Component: function View() {
        const [cols, setCols] = useState<Selection>(new Set(['amount', 'status']));
        const [density, setDensity] = useState<Selection>(new Set(['comfortable']));
        return (
          <DropdownMenu>
            <Button variant="secondary">View options</Button>
            <DropdownMenuContent placement="bottom start">
              <DropdownMenuSection
                title="Columns"
                selectionMode="multiple"
                selectedKeys={cols}
                onSelectionChange={setCols}
              >
                <DropdownMenuItem id="amount">Amount</DropdownMenuItem>
                <DropdownMenuItem id="status">Status</DropdownMenuItem>
                <DropdownMenuItem id="customer">Customer</DropdownMenuItem>
              </DropdownMenuSection>
              <DropdownMenuSeparator />
              <DropdownMenuSection
                title="Density"
                selectionMode="single"
                selectedKeys={density}
                onSelectionChange={setDensity}
              >
                <DropdownMenuItem id="comfortable">Comfortable</DropdownMenuItem>
                <DropdownMenuItem id="compact">Compact</DropdownMenuItem>
              </DropdownMenuSection>
              <DropdownMenuSeparator />
              <DropdownMenuSubmenu>
                <DropdownMenuItem id="export">Export as…</DropdownMenuItem>
                <DropdownMenuContent>
                  <DropdownMenuItem id="csv">CSV</DropdownMenuItem>
                  <DropdownMenuItem id="xlsx">Excel (.xlsx)</DropdownMenuItem>
                  <DropdownMenuItem id="pdf">PDF</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenuSubmenu>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      name: 'Row actions',
      code: `<DropdownMenu>
  <Button isIconOnly variant="ghost" aria-label="Row actions">…</Button>
  <DropdownMenuContent placement="bottom end">…</DropdownMenuContent>
</DropdownMenu>`,
      Component: () => (
        <DropdownMenu>
          <Button variant="secondary">Invoice INV-2041</Button>
          <DropdownMenuContent placement="bottom start">
            <DropdownMenuItem id="edit" icon={<Pencil size={16} />} shortcut="E">
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem id="dup" icon={<Copy size={16} />} shortcut="⌘D">
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem id="archive" icon={<Archive size={16} />}>
              Archive
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem id="delete" icon={<Trash2 size={16} />} variant="danger">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ],
};

export default demo;
