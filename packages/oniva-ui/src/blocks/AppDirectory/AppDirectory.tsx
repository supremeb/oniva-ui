import * as stylex from '@stylexjs/stylex';
import { Database, LayoutGrid, Link2, Mail, Megaphone, Star, Wallet } from 'lucide-react';
import { useState } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { Button } from '../../components/Button/Button';
import { SearchField } from '../../components/SearchField/SearchField';
import { Select, SelectItem } from '../../components/Select/Select';
import { focus } from '../../internal/focus';
import { pluralize } from '../../internal/format';
import { mergeSx } from '../../internal/sx';
import { w8 } from '../../internal/w8-styles';
import { Stagger } from '../../motion/Stagger';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const pop = stylex.keyframes({ from: { opacity: 0, transform: 'scale(0.8)', filter: 'blur(2px)' }, to: { opacity: 1, transform: 'scale(1)', filter: 'blur(0)' } });
const fadeUp = stylex.keyframes({ from: { opacity: 0, transform: 'translateY(6px)' }, to: { opacity: 1, transform: 'translateY(0)' } });

const styles = stylex.create({
  pop: { animationDuration: motion['--oniva-motion-dur-enter'], animationName: { default: pop, [media.reducedMotion]: 'none' }, animationTimingFunction: motion['--oniva-motion-ease-spring'], display: 'inline-flex' },
  emptyIn: { animationDuration: motion['--oniva-motion-dur-enter'], animationName: { default: fadeUp, [media.reducedMotion]: 'none' }, animationTimingFunction: motion['--oniva-motion-ease-out'] },
  shell: { backgroundColor: colors['--oniva-color-surface-inset'], borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-card'], borderStyle: 'solid', borderWidth: 1, boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: 6, padding: 6 },
  bar: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'flex', fontSize: font['--oniva-font-size-12'], justifyContent: 'space-between', minHeight: 28, paddingInline: 12 },
  barTitle: { color: colors['--oniva-color-text'], fontWeight: font['--oniva-font-weight-medium'] },
  inner: { backgroundColor: colors['--oniva-color-surface-inner'], borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-xl'], borderStyle: 'solid', borderWidth: 1, display: 'flex', flexDirection: 'column', gap: 16, padding: { default: 28, '@container (max-width: 560px)': 16 } },
  layout: { display: 'grid', gap: 20, gridTemplateColumns: { default: '180px minmax(0, 1fr)', '@container (max-width: 640px)': 'minmax(0, 1fr)' } },
  cats: { display: 'flex', flexDirection: { default: 'column', '@container (max-width: 640px)': 'row' }, flexWrap: { default: 'nowrap', '@container (max-width: 640px)': 'wrap' }, gap: 2, listStyle: 'none', margin: 0, padding: 0 },
  cat: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-md'],
    display: 'flex',
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    gap: 8,
    justifyContent: 'space-between',
    padding: '6px 8px',
    width: '100%',
    backgroundColor: { default: 'transparent', ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-hover'] } },
  },
  catChip: { width: { default: '100%', '@container (max-width: 640px)': 'auto' } },
  catOn: { backgroundColor: colors['--oniva-color-surface-inset'], color: colors['--oniva-color-text'] },
  count: { fontSize: font['--oniva-font-size-11'], fontVariantNumeric: 'tabular-nums', opacity: 0.7 },
  hdr: { display: 'flex', flexDirection: 'column', gap: 4 },
  hdrTitle: { fontSize: font['--oniva-font-size-24'], fontWeight: font['--oniva-font-weight-semibold'], letterSpacing: font['--oniva-font-track-hero'], lineHeight: 1.2, margin: 0 },
  paneHead: { margin: '0 0 12px' },
  pane: { minWidth: 0 },
  tools: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8 },
  search: { flexBasis: 220, flexGrow: 1, minWidth: 0 },
  statusSel: { flexShrink: 0, width: 150 },
  grid: { display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 150px), 1fr))' },
  more: { alignItems: 'flex-start', backgroundColor: 'transparent', borderStyle: 'dashed', gap: 8 },
  moreTop: { alignItems: 'flex-start', display: 'flex', gap: 8, justifyContent: 'space-between' },
  stack: { display: 'inline-flex', flexShrink: 0 },
  stackTile: { marginInlineStart: -8, borderColor: colors['--oniva-color-surface-inner'], borderStyle: 'solid', borderWidth: 2, boxSizing: 'border-box' },
  card: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    height: '100%',
    padding: 10,
    transform: { default: 'translateY(0)', ':hover': { default: null, [media.hover]: 'translateY(-2px)' } },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  top: { alignItems: 'center', display: 'flex', gap: 10, minWidth: 0 },
  tile: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-md'],
    color: colors['--oniva-color-text'],
    display: 'inline-flex',
    flexShrink: 0,
    fontWeight: font['--oniva-font-weight-semibold'],
    fontSize: font['--oniva-font-size-14'],
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  desc: { display: '-webkit-box', flexGrow: 1, fontSize: font['--oniva-font-size-12'], lineHeight: 1.45, overflow: 'hidden', overflowWrap: 'anywhere', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 },
  cardBtn: { alignSelf: 'flex-start' },
  empty: { color: colors['--oniva-color-text-muted'], padding: 24, textAlign: 'center' },
});

export interface DirectoryApp {
  id: string;
  name: string;
  vendor: string;
  description: string;
  categories: string[];
  essential?: boolean;
  connected?: boolean;
}
export interface DirectoryCategory {
  id: string;
  label: string;
  icon?: ReactNode;
}

const defaultCategories: DirectoryCategory[] = [
  { id: 'data', label: 'Data', icon: <Database size={16} aria-hidden="true" /> },
  { id: 'comms', label: 'Communication', icon: <Mail size={16} aria-hidden="true" /> },
  { id: 'finance', label: 'Finance', icon: <Wallet size={16} aria-hidden="true" /> },
  { id: 'marketing', label: 'Marketing', icon: <Megaphone size={16} aria-hidden="true" /> },
];
const defaultApps: DirectoryApp[] = [
  { id: 'warehouse', name: 'Warehouse', vendor: 'Oniva', description: 'Sync tables from your data warehouse for agents to query.', categories: ['data'], essential: true, connected: true },
  { id: 'docs', name: 'Docs', vendor: 'Oniva', description: 'Index shared documents so answers cite their source.', categories: ['data'], essential: true },
  { id: 'mail', name: 'Mail', vendor: 'Oniva', description: 'Let agents draft replies and file threads by customer.', categories: ['comms'], essential: true },
  { id: 'chat', name: 'Team chat', vendor: 'Oniva', description: 'Post run summaries and approval requests to channels.', categories: ['comms'], essential: true },
  { id: 'crm', name: 'CRM', vendor: 'Oniva', description: 'Read accounts and update deal stages from a run.', categories: ['data', 'marketing'], essential: true },
  { id: 'ledger', name: 'Ledger', vendor: 'Oniva', description: 'Reconcile payouts and flag mismatched invoices.', categories: ['finance'], essential: true, connected: true },
  { id: 'billing', name: 'Billing', vendor: 'Oniva', description: 'Create credit notes and read subscription events.', categories: ['finance'], essential: true },
  { id: 'campaigns', name: 'Campaigns', vendor: 'Oniva', description: 'Draft segments and schedule sends for approval.', categories: ['marketing'], essential: true },
  { id: 'tickets', name: 'Tickets', vendor: 'Oniva', description: 'Triage new tickets and attach replay links.', categories: ['comms'] },
  { id: 'calendar', name: 'Calendar', vendor: 'Oniva', description: 'Find open slots and book review calls for approvals.', categories: ['comms'] },
  { id: 'storage', name: 'Storage', vendor: 'Oniva', description: 'Attach run outputs and exports to shared folders.', categories: ['data'] },
  { id: 'analytics', name: 'Analytics', vendor: 'Oniva', description: 'Chart run volume and cost next to product metrics.', categories: ['data'] },
];

export interface AppDirectoryProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'title' | 'onToggle'> {
  apps?: DirectoryApp[];
  categories?: DirectoryCategory[];
  title?: string;
  subtitle?: string;
  /** Category shown first: `all`, `essentials` or a category id. Default `all`. */
  defaultCategory?: string;
  /** Called after an app was connected or disconnected. */
  onToggle?: (app: DirectoryApp, connected: boolean) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function AppDirectory({ apps: appsProp = defaultApps, categories = defaultCategories, title = 'Integrations', subtitle = 'Connect the tools your agents work with.', defaultCategory = 'all', onToggle, className, xstyle, ref, ...rest }: AppDirectoryProps) {
  const [apps, setApps] = useState(appsProp);
  const [cat, setCat] = useState(defaultCategory);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [busy, setBusy] = useState<string | null>(null);
  const [live, setLive] = useState('');
  const cats: DirectoryCategory[] = [{ id: 'all', label: 'All apps', icon: <LayoutGrid size={16} aria-hidden="true" /> }, { id: 'essentials', label: 'Essentials', icon: <Star size={16} aria-hidden="true" /> }, ...categories];
  const inCat = (a: DirectoryApp, id: string) => (id === 'all' ? true : id === 'essentials' ? !!a.essential : a.categories.includes(id));
  const shown = apps.filter((a) => inCat(a, cat) && (status === 'all' || (status === 'connected') === !!a.connected) && (!query || `${a.name} ${a.description}`.toLowerCase().includes(query.toLowerCase())));
  const toggle = (a: DirectoryApp) => {
    setBusy(a.id);
    setTimeout(() => {
      const next = !a.connected;
      setApps((list) => list.map((x) => (x.id === a.id ? { ...x, connected: next } : x)));
      setBusy(null);
      setLive(`${a.name} ${next ? 'connected' : 'disconnected'}`);
      onToggle?.(a, next);
    }, 700);
  };
  const sx = stylex.props(w8.root, xstyle);
  const heading = pluralize(shown.length, { one: '# app', other: '# apps' });
  return (
    <section ref={ref} aria-label={title} {...rest} {...mergeSx(sx, className)}>
      <div {...stylex.props(styles.shell)}>
        <div {...stylex.props(styles.bar)}>
          <span {...stylex.props(styles.barTitle)}>Apps</span>
          <span {...stylex.props(w8.num)}>{apps.filter((a) => a.connected).length} connected</span>
        </div>
        <div {...stylex.props(styles.inner)}>
          <header {...stylex.props(styles.hdr)}>
            <h2 {...stylex.props(styles.hdrTitle)}>{title}</h2>
            <p {...stylex.props(w8.muted)}>{subtitle}</p>
          </header>
          <div {...stylex.props(styles.tools)}>
            <SearchField aria-label="Search apps" value={query} onChange={setQuery} shortcut={null} placeholder="Search apps" xstyle={styles.search} />
            <Select aria-label="Connection status" selectedKey={status} onSelectionChange={(k) => setStatus(String(k))} xstyle={styles.statusSel}>
              <SelectItem id="all">Any status</SelectItem>
              <SelectItem id="connected">Connected</SelectItem>
              <SelectItem id="available">Not connected</SelectItem>
            </Select>
          </div>
          <div {...stylex.props(styles.layout)}>
            <nav aria-label="Categories">
              <ul {...stylex.props(styles.cats)}>
                {cats.map((c) => {
                  const n = apps.filter((a) => inCat(a, c.id)).length;
                  return (
                    <li key={c.id}>
                      <button type="button" aria-current={cat === c.id ? 'true' : undefined} onClick={() => setCat(c.id)} {...stylex.props(w8.press, styles.cat, styles.catChip, cat === c.id && styles.catOn, focus.ring)}>
                        <span {...stylex.props(w8.row)}>
                          {c.icon}
                          {c.label}
                        </span>
                        <span {...stylex.props(styles.count)}>{n}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div {...stylex.props(styles.pane)}>
              <h3 {...stylex.props(w8.h3, styles.paneHead)} aria-live="polite">
                {heading}
              </h3>
              <p role="status" {...stylex.props(w8.srOnly)}>{live}</p>
              {shown.length === 0 ? (
                <p {...stylex.props(styles.empty, styles.emptyIn)}>No apps match your search.</p>
              ) : (
                <Stagger key={`${cat}-${status}`} xstyle={styles.grid}>
                  {shown.map((a) => (
                    <article key={a.id} aria-label={a.name} {...stylex.props(w8.tile, styles.card)}>
                      <div {...stylex.props(styles.top)}>
                        <span {...stylex.props(styles.tile)} aria-hidden="true">
                          {a.name.slice(0, 1)}
                        </span>
                        <div {...stylex.props(w8.ellipsis)}>
                          <h4 {...stylex.props(w8.h3, w8.ellipsis)}>{a.name}</h4>
                          <span {...stylex.props(w8.muted)}>By {a.vendor}</span>
                        </div>
                      </div>
                      <p {...stylex.props(w8.muted, styles.desc)}>{a.description}</p>
                      <span key={String(a.connected)} {...stylex.props(styles.pop, styles.cardBtn)}>
                        <Button
                          size="sm"
                          variant="secondary"
                          isLoading={busy === a.id}
                          startIcon={a.connected && busy !== a.id ? <Link2 size={14} aria-hidden="true" /> : undefined}
                          aria-label={`${a.connected ? 'Disconnect' : 'Connect'} ${a.name}`}
                          onPress={() => toggle(a)}
                        >
                          {a.connected ? 'Connected' : 'Connect'}
                        </Button>
                      </span>
                    </article>
                  ))}
                  {cat === 'essentials' && !query && status === 'all' && apps.length > shown.length && (
                    <article aria-label="Discover more" {...stylex.props(w8.tile, styles.card, styles.more)}>
                      <div {...stylex.props(styles.moreTop)}>
                        <h4 {...stylex.props(w8.h3)}>Discover more</h4>
                        <span {...stylex.props(styles.stack)} aria-hidden="true">
                          {apps.filter((a) => !shown.includes(a)).slice(0, 3).map((a) => (
                            <span key={a.id} {...stylex.props(styles.tile, styles.stackTile)}>
                              {a.name.slice(0, 1)}
                            </span>
                          ))}
                        </span>
                      </div>
                      <span {...stylex.props(w8.muted, styles.desc)}>+{apps.length - shown.length} apps</span>
                      <span {...stylex.props(styles.cardBtn)}>
                        <Button size="sm" variant="secondary" onPress={() => setCat('all')}>
                          View all
                        </Button>
                      </span>
                    </article>
                  )}
                </Stagger>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
