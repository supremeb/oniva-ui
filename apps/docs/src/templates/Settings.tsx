import * as stylex from '@stylexjs/stylex';
import { Bell, CreditCard, Shield, User } from 'lucide-react';
import {
  Alert,
  Avatar,
  Button,
  Card,
  DescriptionItem,
  DescriptionList,
  Input,
  LayoutShell,
  Select,
  SelectItem,
  Switch,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Textarea,
} from 'oniva-ui';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import { PageTitle, TemplateSidebar } from './shared';

const styles = stylex.create({
  wrap: { marginInline: 'auto', maxWidth: 760 },
  panel: { display: 'flex', flexDirection: 'column', gap: 16, paddingBlockStart: 20 },
  form: {
    display: 'grid',
    gap: 16,
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 700px)': 'repeat(2, minmax(0, 1fr))',
    },
  },
  full: { gridColumn: { default: 'auto', '@media (min-width: 700px)': '1 / -1' } },
  who: { alignItems: 'center', display: 'flex', gap: 16 },
  h3: {
    fontSize: font['--oniva-font-size-16'],
    fontWeight: font['--oniva-font-weight-semibold'],
    margin: 0,
  },
  hint: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    margin: 0,
  },
  actions: { display: 'flex', gap: 8, justifyContent: 'flex-end' },
  switches: { display: 'flex', flexDirection: 'column', gap: 14 },
  card: { padding: 20 },
});

export function Settings() {
  return (
    <LayoutShell
      sidebar={
        <TemplateSidebar
          active="settings"
          workspace="Acme Inc."
          account={{ name: 'Aylin Demir', email: 'aylin@acme.co' }}
        />
      }
      header={<PageTitle title="Settings" sub="Manage your account and workspace" />}
    >
      <div {...stylex.props(styles.wrap)}>
        <Tabs>
          <TabList aria-label="Settings sections">
            <Tab id="profile" icon={<User size={16} />}>
              Profile
            </Tab>
            <Tab id="notifications" icon={<Bell size={16} />}>
              Notifications
            </Tab>
            <Tab id="security" icon={<Shield size={16} />}>
              Security
            </Tab>
            <Tab id="billing" icon={<CreditCard size={16} />}>
              Billing
            </Tab>
          </TabList>
          <TabPanel id="profile">
            <div {...stylex.props(styles.panel)}>
              <div {...stylex.props(styles.who)}>
                <Avatar name="Aylin Demir" size="lg" />
                <div>
                  <h3 {...stylex.props(styles.h3)}>Aylin Demir</h3>
                  <p {...stylex.props(styles.hint)}>Owner · aylin@acme.co</p>
                </div>
                <Button variant="secondary" size="sm">
                  Change photo
                </Button>
              </div>
              <div {...stylex.props(styles.form)}>
                <Input label="First name" defaultValue="Aylin" />
                <Input label="Last name" defaultValue="Demir" />
                <Input label="Email" type="email" defaultValue="aylin@acme.co" />
                <Select label="Timezone" defaultSelectedKey="et">
                  <SelectItem id="et">Eastern Time (ET)</SelectItem>
                  <SelectItem id="pt">Pacific Time (PT)</SelectItem>
                  <SelectItem id="cet">Central European (CET)</SelectItem>
                </Select>
                <Textarea
                  label="Bio"
                  defaultValue="Finance lead at Acme. Likes tidy ledgers and strong coffee."
                  xstyle={styles.full}
                />
              </div>
              <div {...stylex.props(styles.actions)}>
                <Button variant="secondary">Cancel</Button>
                <Button>Save changes</Button>
              </div>
            </div>
          </TabPanel>
          <TabPanel id="notifications">
            <div {...stylex.props(styles.panel)}>
              <Card variant="outline" xstyle={styles.card}>
                <div {...stylex.props(styles.switches)}>
                  <Switch defaultSelected>Email me about invoices and payments</Switch>
                  <Switch defaultSelected>Weekly digest every Monday</Switch>
                  <Switch>Push notifications on mobile</Switch>
                  <Switch defaultSelected>Security alerts</Switch>
                </div>
              </Card>
            </div>
          </TabPanel>
          <TabPanel id="security">
            <div {...stylex.props(styles.panel)}>
              <Alert
                variant="warning"
                title="Two-factor authentication is off"
                description="Add a second step to protect payouts and exports."
              />
              <div {...stylex.props(styles.form)}>
                <Input label="Current password" type="password" />
                <Input label="New password" type="password" description="At least 12 characters." />
              </div>
              <Card variant="outline" xstyle={styles.card}>
                <div {...stylex.props(styles.switches)}>
                  <Switch>Require 2FA for all members</Switch>
                  <Switch defaultSelected>Sign out other sessions on password change</Switch>
                </div>
              </Card>
              <div {...stylex.props(styles.actions)}>
                <Button variant="danger">Delete account</Button>
                <Button>Update password</Button>
              </div>
            </div>
          </TabPanel>
          <TabPanel id="billing">
            <div {...stylex.props(styles.panel)}>
              <DescriptionList title="Plan" columns={2}>
                <DescriptionItem label="Current plan">Team · $48 / month</DescriptionItem>
                <DescriptionItem label="Seats">12 of 15 used</DescriptionItem>
                <DescriptionItem label="Next invoice">Nov 1, 2026</DescriptionItem>
                <DescriptionItem label="Payment method">Visa ending 4242</DescriptionItem>
              </DescriptionList>
              <div {...stylex.props(styles.actions)}>
                <Button variant="secondary">Download invoices</Button>
                <Button>Upgrade plan</Button>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
    </LayoutShell>
  );
}
