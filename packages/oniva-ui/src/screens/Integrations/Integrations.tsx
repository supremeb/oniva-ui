import * as stylex from '@stylexjs/stylex';
import { useState, type Ref } from 'react';
import { BadgeCheck, Check, Plus } from 'lucide-react';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { SearchField } from '../../components/SearchField';
import { Tab, TabList, TabPanel, Tabs } from '../../components/Tabs';
import { Text } from '../../components/Text';
import { ScreenFrame, type ScreenUser } from '../../internal/s2-screen-frame';
import { Heading } from '../../components/Heading';
import { m8, step } from '../../internal/m8-motion';
import { CrossFade } from '../../motion/CrossFade';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';

const NARROW = '@container (max-width: 520px)';

const styles = stylex.create({
  wrap: {
    containerType: 'inline-size',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    minWidth: 0,
  },
  intro: { margin: 0 },
  bar: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  tools: { alignItems: 'center', display: 'flex', flexGrow: 1, gap: 8, justifyContent: 'flex-end', minWidth: 0 },
  search: { maxWidth: 240, minWidth: 0, width: '100%' },
  tabList: { maxWidth: '100%', overflowX: 'auto' },
  sections: { display: 'flex', flexDirection: 'column', gap: 28, paddingTop: 20 },
  section: { display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 },
  sectionTitle: { fontWeight: font['--oniva-font-weight-medium'], margin: 0 },
  grid: {
    columnGap: 40,
    display: 'grid',
    gridTemplateColumns: { default: 'repeat(2, minmax(0, 1fr))', [NARROW]: 'minmax(0, 1fr)' },
    listStyle: 'none',
    margin: 0,
    padding: 0,
    rowGap: 4,
  },
  row: {
    alignItems: 'center',
    display: 'flex',
    gap: 12,
    minWidth: 0,
    paddingBlock: 8,
  },
  tile: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-accent-soft'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-accent-soft-fg'],
    display: 'inline-flex',
    flexShrink: 0,
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: 600,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  names: { display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 2, minWidth: 0 },
  nameLine: { alignItems: 'center', display: 'flex', gap: 4, minWidth: 0 },
  appName: { fontWeight: font['--oniva-font-weight-medium'], margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  verified: { color: colors['--oniva-color-text-muted'], flexShrink: 0 },
  desc: { margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  more: {
    alignItems: 'center',
    display: 'inline-flex',
    gap: 8,
    marginTop: 4,
    width: 'fit-content',
  },
  stack: { display: 'inline-flex' },
  mini: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-accent-soft'],
    borderColor: colors['--oniva-color-surface'],
    borderRadius: radius['--oniva-radius-sm'],
    borderStyle: 'solid',
    borderWidth: 2,
    boxSizing: 'border-box',
    color: colors['--oniva-color-accent-soft-fg'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-12'],
    fontWeight: 600,
    height: 20,
    justifyContent: 'center',
    marginInlineStart: -6,
    width: 20,
  },
  miniFirst: { marginInlineStart: 0 },
  empty: { display: 'block', padding: 32, textAlign: 'center' },
});

export interface IntegrationApp {
  id: string;
  name: string;
  category: string;
  description: string;
  connected?: boolean;
  /** Lists the app in the Popular group at the top. */
  popular?: boolean;
}

export const NORTHWIND_APPS: IntegrationApp[] = [
  {
    id: 'relay',
    popular: true,
    name: 'Relay Mail',
    category: 'Communication',
    description: 'Send transactional and campaign email from agent runs.',
    connected: true,
  },
  {
    id: 'huddle',
    popular: true,
    name: 'Huddle',
    category: 'Communication',
    description: 'Post run summaries and approvals to team channels.',
    connected: true,
  },
  {
    id: 'signalbox',
    name: 'Signalbox',
    category: 'Communication',
    description: 'Send SMS and push reminders to customers.',
  },
  {
    id: 'ledgerline',
    name: 'Ledgerline',
    category: 'Finance',
    description: 'Sync invoices, payouts and revenue into your workspace.',
  },
  {
    id: 'paystream',
    popular: true,
    name: 'Paystream',
    category: 'Finance',
    description: 'Read subscriptions and refunds to report on revenue.',
    connected: true,
  },
  {
    id: 'tasklane',
    popular: true,
    name: 'Tasklane',
    category: 'Productivity',
    description: 'Turn agent findings into tracked tasks with owners.',
  },
  {
    id: 'notebook',
    popular: true,
    name: 'Notebook',
    category: 'Productivity',
    description: 'Save briefs and research notes as shared pages.',
  },
  {
    id: 'meetbridge',
    name: 'Meetbridge',
    category: 'Productivity',
    description: 'Find open slots and book meetings with customers.',
  },
  {
    id: 'gitforge',
    popular: true,
    name: 'Gitforge',
    category: 'Developer',
    description: 'Open pull requests and review diffs from chat.',
  },
  {
    id: 'pulsewire',
    name: 'Pulsewire',
    category: 'Developer',
    description: 'Stream logs and alerts into run traces.',
  },
  {
    id: 'clearbase',
    name: 'Clearbase',
    category: 'Data',
    description: 'Query your warehouse with read-only credentials.',
  },
  {
    id: 'sheetwise',
    name: 'Sheetwise',
    category: 'Data',
    description: 'Read and write spreadsheet ranges for reports.',
    connected: true,
  },
  { id: 'docuvault', name: 'Docuvault', category: 'Productivity', description: 'Pick files and preview them without downloading.' },
  { id: 'metricly', name: 'Metricly', category: 'Data', description: 'Attribute signups to the campaigns that brought them.' },
  { id: 'chatloop', name: 'Chatloop', category: 'Communication', description: 'Answer customer conversations next to their record.' },
  { id: 'formspark', name: 'Formspark', category: 'Data', description: 'Pull form answers into runs as they arrive.' },
];

export interface IntegrationsScreenProps {
  /** Apps to list. Defaults to the Northwind Labs sample set. */
  apps?: IntegrationApp[];
  workspace?: string;
  user?: ScreenUser;
  /** Called with the label of a sidebar item. */
  onNavigate?: (label: string) => void;
  /** Called when an app is connected or disconnected. */
  onConnectionChange?: (id: string, connected: boolean) => void;
  /** Render the title as h2 when the screen sits inside a page that already has an h1. */
  headingLevel?: 1 | 2;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** App directory: sticky search and category tabs over a grid of apps with connect states. */
export function IntegrationsScreen({
  apps = NORTHWIND_APPS,
  workspace = 'Northwind Labs',
  user = { name: 'Alex Morgan' },
  onNavigate,
  onConnectionChange,
  headingLevel = 1,
  className,
  xstyle,
  ref,
}: IntegrationsScreenProps) {
  const [connected, setConnected] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(apps.map((a) => [a.id, !!a.connected])),
  );
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'all' | 'connected' | 'available'>('all');
  const [showAll, setShowAll] = useState(false);
  const visible = apps.filter(
    (a) =>
      (tab === 'all' || (tab === 'connected') === !!connected[a.id]) &&
      `${a.name} ${a.description}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const connectedCount = apps.filter((a) => connected[a.id]).length;
  const toggle = (id: string) => {
    const next = !connected[id];
    setConnected((c) => ({ ...c, [id]: next }));
    onConnectionChange?.(id, next);
  };
  const sub = (headingLevel + 1) as 2 | 3;
  const popular = visible.filter((a) => a.popular);
  const PREVIEW = 6;
  const shownPopular = showAll ? popular : popular.slice(0, PREVIEW);
  const hiddenPopular = popular.slice(PREVIEW);
  const groups: { title: string; items: IntegrationApp[] }[] = [
    ...(shownPopular.length ? [{ title: 'Popular', items: shownPopular }] : []),
    ...Array.from(new Set(visible.filter((a) => !a.popular).map((a) => a.category))).map((cat) => ({
      title: cat,
      items: visible.filter((a) => !a.popular && a.category === cat),
    })),
  ];

  return (
    <ScreenFrame
      ref={ref}
      className={className}
      xstyle={xstyle}
      workspace={workspace}
      user={user}
      active="Integrations"
      title="Integrations"
      headingLevel={headingLevel}
      onNavigate={onNavigate}
      actions={
        <Badge variant="success" dot>
          <AnimatedNumber value={connectedCount} />{' '}
          {connectedCount === 1 ? 'app connected' : 'apps connected'}
        </Badge>
      }
    >
      <div {...stylex.props(styles.wrap)}>
        <Text as="p" tone="muted" xstyle={styles.intro}>
          Connect the tools your team already uses and work with them right in the chat.
        </Text>
        <Tabs selectedKey={tab} onSelectionChange={(k) => setTab(k as typeof tab)} variant="pill" size="sm">
          <div {...stylex.props(styles.bar)}>
            <TabList aria-label="Show" xstyle={styles.tabList}>
              <Tab id="all">All</Tab>
              <Tab id="connected">Connected</Tab>
              <Tab id="available">Available</Tab>
            </TabList>
            <div {...stylex.props(styles.tools)}>
              <SearchField
                aria-label="Search integrations"
                placeholder="Search integrations"
                shortcut={null}
                value={query}
                onChange={setQuery}
                xstyle={styles.search}
              />
              <Button size="sm" variant="secondary" startIcon={<Plus size={14} />}>
                Request
              </Button>
            </div>
          </div>
          <TabPanel id={tab}>
            {visible.length === 0 ? (
              <Text as="p" tone="muted" xstyle={[styles.empty, m8.view]}>
                No apps match “{query}”.
              </Text>
            ) : (
              <div {...stylex.props(styles.sections)}>
                {groups.map((g) => (
                  <section key={g.title} aria-label={g.title} {...stylex.props(styles.section)}>
                    <Heading level={sub} variant="body" xstyle={styles.sectionTitle}>
                      {g.title}
                    </Heading>
                    <ul aria-label={g.title + ' apps'} {...stylex.props(styles.grid)}>
                      {g.items.map((a, ai) => (
                        <li key={a.id} style={step(ai)} {...stylex.props(styles.row, m8.rise)}>
                          <span aria-hidden="true" {...stylex.props(styles.tile)}>
                            {a.name.slice(0, 1)}
                          </span>
                          <div {...stylex.props(styles.names)}>
                            <span {...stylex.props(styles.nameLine)}>
                              <Text xstyle={styles.appName}>
                                {a.name}
                              </Text>
                              <BadgeCheck size={13} aria-hidden="true" {...stylex.props(styles.verified)} />
                            </span>
                            <Text tone="muted" variant="caption" xstyle={styles.desc}>
                              {a.description}
                            </Text>
                          </div>
                          <Button
                            size="sm"
                            isIconOnly
                            variant={connected[a.id] ? 'primary' : 'secondary'}
                            aria-label={`${connected[a.id] ? 'Disconnect' : 'Connect'} ${a.name}`}
                            onPress={() => toggle(a.id)}
                          >
                            <CrossFade
                              as="span"
                              contentKey={connected[a.id] ? 'off' : 'on'}
                              duration={200}
                              blur={2}
                              morph="both"
                            >
                              {connected[a.id] ? <Check size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
                            </CrossFade>
                          </Button>
                        </li>
                      ))}
                    </ul>
                    {g.title === 'Popular' && hiddenPopular.length > 0 && !showAll && (
                      <Button variant="ghost" size="sm" xstyle={styles.more} onPress={() => setShowAll(true)}>
                        <span aria-hidden="true" {...stylex.props(styles.stack)}>
                          {hiddenPopular.slice(0, 3).map((h, i) => (
                            <span key={h.id} {...stylex.props(styles.mini, i === 0 && styles.miniFirst)}>
                              {h.name.slice(0, 1)}
                            </span>
                          ))}
                        </span>
                        {hiddenPopular.slice(0, 2).map((h) => h.name).join(', ')}
                        {hiddenPopular.length > 2 ? ` and ${hiddenPopular.length - 2} more` : ''}
                      </Button>
                    )}
                  </section>
                ))}
              </div>
            )}
          </TabPanel>
        </Tabs>
      </div>
    </ScreenFrame>
  );
}
