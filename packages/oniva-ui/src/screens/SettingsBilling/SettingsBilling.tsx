import * as stylex from '@stylexjs/stylex';
import { CreditCard, Download, KeyRound, Plus, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState, type Ref } from 'react';
import { Avatar } from '../../components/Avatar';
import { Badge, type BadgeVariant } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Meter } from '../../components/Meter';
import { SegmentedControl, SegmentedControlItem } from '../../components/SegmentedControl';
import { Tab, TabList, TabPanel, Tabs } from '../../components/Tabs';
import { Cell, Column, Row, Table, TableBody, TableHeader } from '../../components/Table';
import { m8, step } from '../../internal/m8-motion';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { CrossFade } from '../../motion/CrossFade';
import { Presence } from '../../motion/Presence/Presence';
import { useLayoutGlide } from '../../motion/LayoutGlide';
import { CopyButton } from '../../motion/CopyButton';
import { useFormatters } from '../../internal/format';
import { s3, ScreenShell, type ScreenUser } from '../../internal/s3-shell';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { radius } from '../../tokens/radius.stylex';

const NARROW = '@container (max-width: 700px)';
const MID = '@container (max-width: 960px)';

export type SettingsTab = 'General' | 'Members' | 'Billing' | 'API keys';
export interface BillingMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member';
  lastActive: string;
}
export interface BillingInvoice {
  id: string;
  /** ISO date, yyyy-mm-dd. */
  date: string;
  amount: number;
  status: 'Paid' | 'Open' | 'Failed';
}
interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  created: string;
  lastUsed: string;
}

const MEMBERS: BillingMember[] = [
  {
    id: 'm1',
    name: 'Alex Morgan',
    email: 'alex@northwind.example',
    role: 'Owner',
    lastActive: 'Now',
  },
  {
    id: 'm2',
    name: 'Priya Nair',
    email: 'priya@northwind.example',
    role: 'Admin',
    lastActive: '2 hours ago',
  },
  {
    id: 'm3',
    name: 'Tomás Vidal',
    email: 'tomas@northwind.example',
    role: 'Member',
    lastActive: 'Yesterday',
  },
  {
    id: 'm4',
    name: 'Hana Kobayashi',
    email: 'hana@northwind.example',
    role: 'Member',
    lastActive: '3 days ago',
  },
];
const INVOICES: BillingInvoice[] = [
  { id: 'INV-1042', date: '2026-10-01', amount: 480, status: 'Open' },
  { id: 'INV-1031', date: '2026-09-01', amount: 480, status: 'Paid' },
  { id: 'INV-1019', date: '2026-08-01', amount: 480, status: 'Paid' },
  { id: 'INV-1004', date: '2026-07-01', amount: 420, status: 'Paid' },
];
const KEYS: ApiKey[] = [
  {
    id: 'k1',
    name: 'Production',
    prefix: 'nw_live_7f3a',
    created: '2026-03-12',
    lastUsed: 'Today',
  },
  {
    id: 'k2',
    name: 'CI evals',
    prefix: 'nw_test_91c0',
    created: '2026-06-02',
    lastUsed: '3 days ago',
  },
];
const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    monthly: 0,
    blurb: 'For trying things out',
    features: ['2 seats', '5,000 runs a month', 'Community support'],
  },
  {
    id: 'team',
    name: 'Team',
    monthly: 480,
    blurb: 'For teams shipping agents',
    features: ['10 seats', '50,000 runs a month', 'Priority support'],
  },
  {
    id: 'scale',
    name: 'Scale',
    monthly: 1200,
    blurb: 'For production workloads',
    features: ['Unlimited seats', '250,000 runs a month', 'SSO and audit log'],
  },
] as const;
const YEARLY_DISCOUNT = 0.2;

const invTone: Record<BillingInvoice['status'], BadgeVariant> = {
  Paid: 'success',
  Open: 'warning',
  Failed: 'danger',
};

const styles = stylex.create({
  saveBar: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    bottom: 12,
    boxShadow: shadow['--oniva-shadow-lg'],
    boxSizing: 'border-box',
    display: 'flex',
    gap: 12,
    justifyContent: 'space-between',
    marginInline: 'auto',
    maxWidth: 520,
    padding: 10,
    paddingInlineStart: 16,
    position: 'sticky',
    zIndex: 5,
  },
  tabs: { display: 'flex', flexDirection: 'column', gap: 16 },
  panel: { display: 'flex', flexDirection: 'column', gap: 16, outlineStyle: 'none' },
  grid2: {
    display: 'grid',
    gap: 16,
    gridTemplateColumns: { default: 'repeat(2, minmax(0, 1fr))', [NARROW]: 'minmax(0, 1fr)' },
  },
  plans: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: { default: 'repeat(3, minmax(0, 1fr))', [MID]: 'minmax(0, 1fr)' },
  },
  plan: {
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 14,
  },
  planCurrent: {
    borderColor: colors['--oniva-color-border-active'],
    backgroundColor: colors['--oniva-color-accent-tint'],
  },
  price: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-24'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-semibold'],
    lineHeight: font['--oniva-font-lh-32'],
  },
  per: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-regular'],
  },
  features: {
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    flexDirection: 'column',
    fontSize: font['--oniva-font-size-13'],
    gap: 4,
    margin: 0,
    paddingInlineStart: 18,
  },
  meters: { display: 'flex', flexDirection: 'column', gap: 14 },
  scroll: { overflowX: 'auto' },
  person: { alignItems: 'center', display: 'flex', gap: 10, minWidth: 0 },
  personText: { display: 'flex', flexDirection: 'column', minWidth: 0 },
  name: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
  },
  form: { alignItems: 'end', display: 'flex', flexWrap: 'wrap', gap: 8 },
  grow: { flexGrow: 1, minWidth: 180 },
  toast: {
    backgroundColor: colors['--oniva-color-text'],
    borderRadius: radius['--oniva-radius-lg'],
    bottom: 16,
    color: colors['--oniva-color-text-inverse'],
    fontSize: font['--oniva-font-size-13'],
    insetInlineEnd: 16,
    maxWidth: 'calc(100% - 32px)',
    padding: '10px 14px',
    position: 'sticky',
    alignSelf: 'flex-end',
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-standard'],
  },
  toastHidden: { opacity: 0, transform: 'translateY(6px)' },
  key: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  keyMain: { alignItems: 'center', display: 'flex', gap: 10, minWidth: 0 },
  keyIcon: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-md'],
    color: colors['--oniva-color-icon-muted'],
    display: 'inline-flex',
    flexShrink: 0,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  reveal: {
    backgroundColor: colors['--oniva-color-success-bg'],
    borderRadius: radius['--oniva-radius-md'],
    color: colors['--oniva-color-success-fg'],
    fontSize: font['--oniva-font-size-13'],
    padding: '8px 10px',
    overflowWrap: 'anywhere',
  },
});

export interface SettingsBillingProps {
  defaultTab?: SettingsTab;
  /** Controlled tab. */
  tab?: SettingsTab;
  onTabChange?: (tab: SettingsTab) => void;
  members?: BillingMember[];
  invoices?: BillingInvoice[];
  onDownloadInvoice?: (id: string) => void;
  /** Called when the plan buttons are pressed. */
  onChangePlan?: (plan: string, interval: 'monthly' | 'yearly') => void;
  onNavigate?: (label: string) => void;
  workspace?: string;
  user?: ScreenUser;
  headingLevel?: 1 | 2;
  className?: string;
  ref?: Ref<HTMLDivElement>;
}

export function SettingsBilling({
  defaultTab = 'Billing',
  tab: tabProp,
  onTabChange,
  members: membersProp = MEMBERS,
  invoices = INVOICES,
  onDownloadInvoice,
  onChangePlan,
  onNavigate,
  workspace = 'Northwind Labs',
  user = { name: 'Alex Morgan' },
  headingLevel = 1,
  className,
  ref,
}: SettingsBillingProps) {
  const fmt = useFormatters();
  const [tabInner, setTabInner] = useState<SettingsTab>(defaultTab);
  const tab = tabProp ?? tabInner;
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [plan, setPlan] = useState<string>('team');
  const [members, setMembers] = useState(membersProp);
  const [invite, setInvite] = useState('');
  const [keys, setKeys] = useState(KEYS);
  const [fresh, setFresh] = useState<string | null>(null);
  const [name, setName] = useState(workspace);
  const [slug, setSlug] = useState('northwind-labs');
  const [toast, setToast] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const say = (m: string) => {
    setToast(m);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), 3000);
  };
  const date = (iso: string) =>
    fmt.date(new Date(iso), { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  const keysRef = useRef<HTMLUListElement | null>(null);
  useLayoutGlide(keysRef);
  const [base, setBase] = useState({ name: workspace, slug: 'northwind-labs' });
  const dirty = name !== base.name || slug !== base.slug;
  const priceOf = (monthly: number) => (interval === 'yearly' ? Math.round(monthly * (1 - YEARLY_DISCOUNT)) : monthly);

  const addMember = () => {
    const email = invite.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) return say('Enter a valid email address.');
    setMembers((m) => [
      ...m,
      {
        id: `m${Date.now()}`,
        name: email.split('@')[0]!,
        email,
        role: 'Member',
        lastActive: 'Invited',
      },
    ]);
    setInvite('');
    say(`Invite sent to ${email}.`);
  };
  const createKey = () => {
    const id = `k${Date.now()}`;
    const secret = `nw_live_${id.slice(-6)}a91f3c`;
    setKeys((k) => [
      ...k,
      {
        id,
        name: `Key ${k.length + 1}`,
        prefix: secret.slice(0, 12),
        created: new Date().toISOString().slice(0, 10),
        lastUsed: 'Never',
      },
    ]);
    setFresh(secret);
    say('API key created. Copy it now.');
  };

  return (
    <ScreenShell
      ref={ref}
      className={className}
      workspace={workspace}
      user={user}
      active="Settings"
      title="Settings"
      headingLevel={headingLevel}
      onNavigate={onNavigate}
    >
      <Tabs
        selectedKey={tab}
        onSelectionChange={(k) => {
          setTabInner(k as SettingsTab);
          onTabChange?.(k as SettingsTab);
        }}
        xstyle={styles.tabs}
      >
        <TabList aria-label="Settings sections">
          <Tab id="General">General</Tab>
          <Tab id="Members" count={members.length}>
            Members
          </Tab>
          <Tab id="Billing">Billing</Tab>
          <Tab id="API keys">API keys</Tab>
        </TabList>

        <TabPanel id="General" xstyle={[styles.panel, m8.view]}>
          <section aria-label="Workspace" {...stylex.props(s3.card)}>
            <h2 {...stylex.props(s3.h)}>Workspace</h2>
            <div {...stylex.props(styles.grid2)}>
              <Input label="Workspace name" value={name} onChange={setName} />
              <Input
                label="URL slug"
                value={slug}
                onChange={setSlug}
                prefix="app/"
                description="Used in links to your workspace."
              />
            </div>
            <div {...stylex.props(s3.row)}>
              <Button
                onPress={() => {
                  setBase({ name, slug });
                  say('Workspace saved.');
                }}
              >
                Save changes
              </Button>
            </div>
          </section>
        </TabPanel>

        <TabPanel id="Members" xstyle={[styles.panel, m8.view]}>
          <section aria-label="Invite" {...stylex.props(s3.card)}>
            <h2 {...stylex.props(s3.h)}>Invite a teammate</h2>
            <form
              {...stylex.props(styles.form)}
              onSubmit={(e) => {
                e.preventDefault();
                addMember();
              }}
            >
              <Input
                label="Email"
                type="email"
                value={invite}
                onChange={setInvite}
                xstyle={styles.grow}
                placeholder="name@company.com"
              />
              <Button type="submit" startIcon={<Plus size={14} />}>
                Send invite
              </Button>
            </form>
          </section>
          <section aria-label="Members" {...stylex.props(s3.card)}>
            <h2 {...stylex.props(s3.h)}>Members</h2>
            <div {...stylex.props(styles.scroll)}>
              <Table aria-label="Members" density="sm">
                <TableHeader>
                  <Column isRowHeader>Name</Column>
                  <Column>Role</Column>
                  <Column>Last active</Column>
                  <Column>Actions</Column>
                </TableHeader>
                <TableBody>
                  {members.map((m) => (
                    <Row key={m.id} id={m.id}>
                      <Cell>
                        <span {...stylex.props(styles.person)}>
                          <Avatar name={m.name} size="sm" />
                          <span {...stylex.props(styles.personText)}>
                            <span {...stylex.props(styles.name)}>{m.name}</span>
                            <span {...stylex.props(s3.muted)}>{m.email}</span>
                          </span>
                        </span>
                      </Cell>
                      <Cell>
                        <Badge variant={m.role === 'Owner' ? 'accent' : 'neutral'}>{m.role}</Badge>
                      </Cell>
                      <Cell>{m.lastActive}</Cell>
                      <Cell>
                        <Button
                          size="xs"
                          variant="ghost"
                          isIconOnly
                          aria-label={`Remove ${m.name}`}
                          isDisabled={m.role === 'Owner'}
                          onPress={() => {
                            setMembers((x) => x.filter((y) => y.id !== m.id));
                            say(`${m.name} removed.`);
                          }}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </Cell>
                    </Row>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        </TabPanel>

        <TabPanel id="Billing" xstyle={[styles.panel, m8.view]}>
          <div {...stylex.props(styles.grid2)}>
            <section aria-label="Plan and usage" {...stylex.props(s3.card)}>
              <div {...stylex.props(s3.between)}>
                <h2 {...stylex.props(s3.h)}>Usage this month</h2>
                <Badge variant="accent">Team plan</Badge>
              </div>
              <div {...stylex.props(styles.meters)}>
                <Meter
                  label="Seats"
                  value={members.length}
                  minValue={0}
                  maxValue={10}
                  valueLabel={`${members.length} of 10`}
                />
                <Meter
                  label="Agent runs"
                  value={41200}
                  minValue={0}
                  maxValue={50000}
                  valueLabel={`${fmt.number(41200)} of ${fmt.number(50000)}`}
                />
                <Meter
                  label="Storage"
                  value={38}
                  minValue={0}
                  maxValue={100}
                  valueLabel="38 of 100 GB"
                />
              </div>
              <p {...stylex.props(s3.muted)}>Renews on {date('2026-11-01')}.</p>
            </section>
            <section aria-label="Payment method" {...stylex.props(s3.card)}>
              <h2 {...stylex.props(s3.h)}>Payment method</h2>
              <div {...stylex.props(styles.key)}>
                <span {...stylex.props(styles.keyMain)}>
                  <span aria-hidden="true" {...stylex.props(styles.keyIcon)}>
                    <CreditCard size={16} />
                  </span>
                  <span {...stylex.props(styles.personText)}>
                    <span {...stylex.props(styles.name, s3.num)}>Card ending 4242</span>
                    <span {...stylex.props(s3.muted, s3.num)}>Expires 08/2028</span>
                  </span>
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  onPress={() => say('Opening your payment provider.')}
                >
                  Update
                </Button>
              </div>
              <p {...stylex.props(s3.muted)}>Billing contact: billing@northwind.example</p>
            </section>
          </div>

          <section aria-label="Plans" {...stylex.props(s3.card)}>
            <div {...stylex.props(s3.between)}>
              <h2 {...stylex.props(s3.h)}>Compare plans</h2>
              <SegmentedControl
                aria-label="Billing interval"
                size="sm"
                value={interval}
                onChange={(v) => setInterval(v as 'monthly' | 'yearly')}
              >
                <SegmentedControlItem value="monthly">Monthly</SegmentedControlItem>
                <SegmentedControlItem value="yearly">Yearly (save 20%)</SegmentedControlItem>
              </SegmentedControl>
            </div>
            <div {...stylex.props(styles.plans)}>
              {PLANS.map((p, pi) => (
                <article
                  key={p.id}
                  style={step(pi)}
                  aria-label={`${p.name} plan`}
                  {...stylex.props(styles.plan, plan === p.id && styles.planCurrent, m8.rise)}
                >
                  <h3 {...stylex.props(s3.h)}>{p.name}</h3>
                  <p {...stylex.props(s3.muted)}>{p.blurb}</p>
                  <div {...stylex.props(styles.price)}>
                    <AnimatedNumber value={priceOf(p.monthly)} format={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }} locale="en-US" /> <span {...stylex.props(styles.per)}>/ month</span>
                  </div>
                  <ul {...stylex.props(styles.features)}>
                    {p.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <Button
                    size="sm"
                    variant={plan === p.id ? 'secondary' : 'primary'}
                    isDisabled={plan === p.id}
                    onPress={() => {
                      setPlan(p.id);
                      onChangePlan?.(p.id, interval);
                      say(`Switched to ${p.name}.`);
                    }}
                  >
                    <CrossFade as="span" contentKey={plan === p.id ? 'cur' : 'choose'} duration={200} blur={2} morph="both">
                      {plan === p.id ? 'Current plan' : `Choose ${p.name}`}
                    </CrossFade>
                  </Button>
                </article>
              ))}
            </div>
          </section>

          <section aria-label="Invoices" {...stylex.props(s3.card)}>
            <h2 {...stylex.props(s3.h)}>Invoices</h2>
            <div {...stylex.props(styles.scroll)}>
              <Table aria-label="Invoices" density="sm">
                <TableHeader>
                  <Column isRowHeader>Invoice</Column>
                  <Column>Date</Column>
                  <Column>Amount</Column>
                  <Column>Status</Column>
                  <Column>Download</Column>
                </TableHeader>
                <TableBody>
                  {invoices.map((i) => (
                    <Row key={i.id} id={i.id}>
                      <Cell>{i.id}</Cell>
                      <Cell>{date(i.date)}</Cell>
                      <Cell>
                        <span {...stylex.props(s3.num)}>{fmt.currency(i.amount)}</span>
                      </Cell>
                      <Cell>
                        <Badge variant={invTone[i.status]}>{i.status}</Badge>
                      </Cell>
                      <Cell>
                        <Button
                          size="xs"
                          variant="ghost"
                          isIconOnly
                          aria-label={`Download invoice ${i.id}`}
                          onPress={() => {
                            onDownloadInvoice?.(i.id);
                            say(`Downloading ${i.id}.`);
                          }}
                        >
                          <Download size={14} />
                        </Button>
                      </Cell>
                    </Row>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>
        </TabPanel>

        <TabPanel id="API keys" xstyle={[styles.panel, m8.view]}>
          <section aria-label="API keys" {...stylex.props(s3.card)}>
            <div {...stylex.props(s3.between)}>
              <h2 {...stylex.props(s3.h)}>API keys</h2>
              <Button size="sm" startIcon={<Plus size={14} />} onPress={createKey}>
                Create key
              </Button>
            </div>
            {fresh && (
              <div {...stylex.props(styles.reveal, m8.pop)} role="note">
                <span>New key (shown once): </span>
                <code {...stylex.props(s3.mono)}>{fresh}</code>
              </div>
            )}
            <ul ref={keysRef} {...stylex.props(s3.list)}>
              {keys.map((k) => (
                <li key={k.id} data-glide-id={k.id} {...stylex.props(styles.key)}>
                  <span {...stylex.props(styles.keyMain)}>
                    <span aria-hidden="true" {...stylex.props(styles.keyIcon)}>
                      <KeyRound size={16} />
                    </span>
                    <span {...stylex.props(styles.personText)}>
                      <span {...stylex.props(styles.name)}>{k.name}</span>
                      <span {...stylex.props(s3.muted, s3.mono)}>
                        {k.prefix}… · Created {date(k.created)} · Last used {k.lastUsed}
                      </span>
                    </span>
                  </span>
                  <span {...stylex.props(s3.row)}>
                    <CopyButton size="xs" value={k.prefix} aria-label={`Copy key ${k.name}`} />
                    <Button
                      size="xs"
                      variant="ghost"
                      isIconOnly
                      aria-label={`Revoke ${k.name}`}
                      onPress={() => {
                        setKeys((x) => x.filter((y) => y.id !== k.id));
                        say(`${k.name} revoked.`);
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </TabPanel>
      </Tabs>
      <Presence isPresent={dirty} preset="slide" initial={false} xstyle={styles.saveBar}>
        <span>You have unsaved changes</span>
        <span {...stylex.props(s3.row)}>
          <Button
            size="sm"
            variant="ghost"
            onPress={() => {
              setName(base.name);
              setSlug(base.slug);
            }}
          >
            Discard
          </Button>
          <Button
            size="sm"
            onPress={() => {
              setBase({ name, slug });
              say('Workspace saved.');
            }}
          >
            Save
          </Button>
        </span>
      </Presence>
      <div
        role="status"
        aria-live="polite"
        {...stylex.props(styles.toast, !toast && styles.toastHidden)}
      >
        {toast}
      </div>
    </ScreenShell>
  );
}
