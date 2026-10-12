import {
  Bot,
  Calendar,
  Columns3,
  Home,
  Landmark,
  Megaphone,
  Settings,
  LifeBuoy,
  UserRound,
} from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import type { DemoModule } from '../../internal/demo';
import { colors } from '../../tokens/colors.stylex';
import { radius } from '../../tokens/radius.stylex';
import {
  Sidebar,
  SidebarAccount,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarMenu,
  SidebarSearch,
  SidebarSection,
} from './Sidebar';

const frame = stylex.create({
  box: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-card'],
    display: 'flex',
    height: 640,
    justifyContent: 'center',
    padding: 24,
  },
});

const demo: DemoModule = {
  meta: {
    title: 'Sidebar',
    slug: 'sidebar',
    category: 'Navigation',
    description:
      'Floating navigation panel: workspace switcher, quick search, sectioned nav items with a solid accent active pill and count badge, account card. Collapses to an icon rail.',
  },
  demos: [
    {
      name: 'Default',
      code: `<Sidebar>
  <SidebarHeader name="Mertcan Esmergul" />
  <SidebarSearch hint="⌘L" />
  <SidebarContent>
    <SidebarSection>
      <SidebarItem href="#" icon={<Home size={18} />} isActive badge="152">Home</SidebarItem>
      <SidebarItem href="#" icon={<Columns3 size={18} />}>Project board</SidebarItem>
      …
    </SidebarSection>
  </SidebarContent>
  <SidebarFooter>
    <SidebarMenu>
      <SidebarItem href="#" icon={<LifeBuoy size={18} />}>Support</SidebarItem>
      <SidebarItem href="#" icon={<Settings size={18} />}>Settings</SidebarItem>
    </SidebarMenu>
    <SidebarAccount name="Aylin Demir" email="aylin@acme.co" />
  </SidebarFooter>
</Sidebar>`,
      Component: () => (
        <div {...stylex.props(frame.box)}>
          <Sidebar aria-label="Application">
            <SidebarHeader name="Mertcan Esmergul" />
            <SidebarSearch hint="⌘L" />
            <SidebarContent>
              <SidebarSection>
                <SidebarItem href="#" icon={<Home size={18} />} isActive badge="152">
                  Home
                </SidebarItem>
                <SidebarItem href="#" icon={<Columns3 size={18} />}>
                  Project board
                </SidebarItem>
                <SidebarItem href="#" icon={<Megaphone size={18} />}>
                  Marketing
                </SidebarItem>
                <SidebarItem href="#" icon={<Calendar size={18} />}>
                  Calendar
                </SidebarItem>
                <SidebarItem href="#" icon={<Landmark size={18} />}>
                  Finance
                </SidebarItem>
                <SidebarItem href="#" icon={<Bot size={18} />} badge="NEW">
                  AI Chat
                </SidebarItem>
                <SidebarItem href="#" icon={<UserRound size={18} />}>
                  Profile
                </SidebarItem>
              </SidebarSection>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarItem href="#" icon={<LifeBuoy size={18} />}>
                  Support
                </SidebarItem>
                <SidebarItem href="#" icon={<Settings size={18} />}>
                  Settings
                </SidebarItem>
              </SidebarMenu>
              <SidebarAccount name="Aylin Demir" email="aylin@acme.co" />
            </SidebarFooter>
          </Sidebar>
        </div>
      ),
    },
    {
      name: 'Collapsible sections and collapsed rail',
      code: `<Sidebar defaultCollapsed>…</Sidebar>
<SidebarSection title="Getting started" collapsible>…</SidebarSection>`,
      Component: () => (
        <div {...stylex.props(frame.box)} style={{ gap: 24 }}>
          <Sidebar aria-label="Sections">
            <SidebarHeader name="Acme Finance" />
            <SidebarContent>
              <SidebarSection title="Getting started" collapsible>
                <SidebarItem href="#" icon={<Home size={18} />} isActive>
                  Overview
                </SidebarItem>
                <SidebarItem href="#" icon={<Landmark size={18} />}>
                  Accounts
                </SidebarItem>
              </SidebarSection>
              <SidebarSection title="Team" collapsible>
                <SidebarItem href="#" icon={<UserRound size={18} />} badge="8">
                  Members
                </SidebarItem>
                <SidebarItem href="#" icon={<Calendar size={18} />}>
                  Schedule
                </SidebarItem>
              </SidebarSection>
            </SidebarContent>
          </Sidebar>
          <Sidebar aria-label="Collapsed" defaultCollapsed>
            <SidebarHeader name="Acme Finance" />
            <SidebarSearch />
            <SidebarContent>
              <SidebarSection>
                <SidebarItem href="#" icon={<Home size={18} />} isActive badge="152">
                  Home
                </SidebarItem>
                <SidebarItem href="#" icon={<Columns3 size={18} />}>
                  Project board
                </SidebarItem>
                <SidebarItem href="#" icon={<Calendar size={18} />}>
                  Calendar
                </SidebarItem>
              </SidebarSection>
            </SidebarContent>
            <SidebarFooter>
              <SidebarAccount name="Aylin Demir" email="aylin@acme.co" />
            </SidebarFooter>
          </Sidebar>
        </div>
      ),
    },
  ],
};
export default demo;
