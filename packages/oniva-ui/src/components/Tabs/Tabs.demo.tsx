import { CreditCard, LayoutGrid, Users } from 'lucide-react';
import * as stylex from '@stylexjs/stylex';
import type { DemoModule } from '../../internal/demo';
import { demoStyles } from '../../internal/nav-demo';
import { Tab, TabList, TabPanel, Tabs } from './Tabs';

const demo: DemoModule = {
  meta: {
    title: 'Tabs',
    slug: 'tabs',
    category: 'Navigation',
    description:
      'Switch between related views. Line and pill (segmented) styles on React Aria Tabs; keyboard and ARIA built in.',
  },
  demos: [
    {
      name: 'Line',
      code: `<Tabs>
  <TabList aria-label="Workspace">
    <Tab id="overview">Overview</Tab>
    <Tab id="invoices" count={12}>Invoices</Tab>
    <Tab id="members">Members</Tab>
  </TabList>
  <TabPanel id="overview">Revenue is up 8.2% vs. last month.</TabPanel>
  …
</Tabs>`,
      Component: () => (
        <Tabs>
          <TabList aria-label="Workspace">
            <Tab id="overview">Overview</Tab>
            <Tab id="invoices" count={12}>
              Invoices
            </Tab>
            <Tab id="members">Members</Tab>
          </TabList>
          <TabPanel id="overview">
            <div {...stylex.props(demoStyles.panel)}>
              Revenue is up 8.2% vs. last month ($48,210).
            </div>
          </TabPanel>
          <TabPanel id="invoices">
            <div {...stylex.props(demoStyles.panel)}>12 invoices awaiting payment.</div>
          </TabPanel>
          <TabPanel id="members">
            <div {...stylex.props(demoStyles.panel)}>8 members, 2 pending invites.</div>
          </TabPanel>
        </Tabs>
      ),
    },
    {
      name: 'Pill / segmented with icons',
      code: `<Tabs variant="pill">
  <TabList aria-label="View">
    <Tab id="board" icon={<LayoutGrid size={16} />}>Board</Tab>
    <Tab id="billing" icon={<CreditCard size={16} />}>Billing</Tab>
    <Tab id="team" icon={<Users size={16} />}>Team</Tab>
  </TabList>
</Tabs>`,
      Component: () => (
        <Tabs variant="pill">
          <TabList aria-label="View">
            <Tab id="board" icon={<LayoutGrid size={16} />}>
              Board
            </Tab>
            <Tab id="billing" icon={<CreditCard size={16} />}>
              Billing
            </Tab>
            <Tab id="team" icon={<Users size={16} />}>
              Team
            </Tab>
          </TabList>
          <TabPanel id="board">
            <div {...stylex.props(demoStyles.panel)}>Board view: 24 tasks across 4 columns.</div>
          </TabPanel>
          <TabPanel id="billing">
            <div {...stylex.props(demoStyles.panel)}>Next invoice: $249.00 on Nov 1.</div>
          </TabPanel>
          <TabPanel id="team">
            <div {...stylex.props(demoStyles.panel)}>Aylin, Marcus, Priya and 5 others.</div>
          </TabPanel>
        </Tabs>
      ),
    },
    {
      name: 'Vertical and disabled',
      code: `<Tabs orientation="vertical"><TabList>…<Tab id="sso" isDisabled>SSO</Tab></TabList></Tabs>`,
      Component: () => (
        <Tabs orientation="vertical">
          <TabList aria-label="Settings">
            <Tab id="general">General</Tab>
            <Tab id="security">Security</Tab>
            <Tab id="sso" isDisabled>
              SSO (Enterprise)
            </Tab>
          </TabList>
          <TabPanel id="general">
            <div {...stylex.props(demoStyles.panel)}>Workspace name, timezone and locale.</div>
          </TabPanel>
          <TabPanel id="security">
            <div {...stylex.props(demoStyles.panel)}>Two-factor authentication is on.</div>
          </TabPanel>
          <TabPanel id="sso">
            <div {...stylex.props(demoStyles.panel)}>Upgrade to enable SSO.</div>
          </TabPanel>
        </Tabs>
      ),
    },
  ],
};
export default demo;
