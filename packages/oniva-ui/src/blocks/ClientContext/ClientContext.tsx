import * as stylex from '@stylexjs/stylex';
import { ChevronDown, FileText, MessageSquare, Paperclip, Plug, RefreshCw } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import type { HTMLAttributes, KeyboardEvent, Ref } from 'react';
import { Sparkline } from '../../charts/Sparkline';
import { Avatar } from '../../components/Avatar/Avatar';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { SearchField } from '../../components/SearchField/SearchField';
import { Select, SelectItem } from '../../components/Select/Select';
import { Tab, TabList, TabPanel, Tabs } from '../../components/Tabs/Tabs';
import { focus } from '../../internal/focus';
import { pluralize, useFormatters } from '../../internal/format';
import { mergeSx } from '../../internal/sx';
import { w8 } from '../../internal/w8-styles';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { DeltaBadge } from '../../widgets/DeltaBadge';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const rise = stylex.keyframes({ from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } });
const menuPop = stylex.keyframes({ from: { opacity: 0, transform: 'scale(0.96) translateY(-2px)' }, to: { opacity: 1, transform: 'scale(1) translateY(0)' } });
const slide = stylex.keyframes({ from: { opacity: 0, transform: 'translateY(-8px)' }, to: { opacity: 1, transform: 'translateY(0)' } });

const styles = stylex.create({
  head: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', marginBottom: 12 },
  who: { alignItems: 'center', display: 'flex', gap: 12, minWidth: 0 },
  logo: { alignItems: 'center', backgroundColor: colors['--oniva-color-accent-soft'], borderRadius: radius['--oniva-radius-lg'], color: colors['--oniva-color-accent-soft-fg'], display: 'inline-flex', flexShrink: 0, fontSize: font['--oniva-font-size-16'], fontWeight: font['--oniva-font-weight-semibold'], height: 40, justifyContent: 'center', width: 40 },
  name: { fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-semibold'], margin: 0 },
  tools: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8 },
  synced: { alignItems: 'center', borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-md'], borderStyle: 'solid', borderWidth: 1, color: colors['--oniva-color-text-muted'], display: 'inline-flex', fontSize: font['--oniva-font-size-12'], gap: 6, paddingBlock: 5, paddingInline: 8 },
  syncDot: { backgroundColor: colors['--oniva-color-success-solid'], borderRadius: radius['--oniva-radius-full'], height: 6, width: 6 },
  picker: { flexShrink: 0, minWidth: 0, width: 150 },
  kpis: { display: 'grid', gap: 8, gridTemplateColumns: { default: 'repeat(4, minmax(0, 1fr))', '@container (max-width: 680px)': 'repeat(2, minmax(0, 1fr))' }, listStyle: 'none', margin: '12px 0', padding: 0 },
  kpi: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: { default: 'transparent', ':is([aria-pressed="true"])': colors['--oniva-color-border-active'] },
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: 12,
    width: '100%',
  },
  kpiRise: {
    animationDelay: 'calc(var(--i, 0) * 45ms)',
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: rise, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  menuPop: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationName: { default: menuPop, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    transformOrigin: 'top left',
  },
  entryStag: { animationDelay: 'calc(var(--i, 0) * 30ms)', animationFillMode: 'backwards' },
  kpiRow: { alignItems: 'center', display: 'flex', gap: 8, justifyContent: 'space-between' },
  kpiValue: { fontSize: font['--oniva-font-size-20'], fontVariantNumeric: 'tabular-nums', fontWeight: font['--oniva-font-weight-semibold'] },
  report: { display: 'flex', flexDirection: 'column', gap: 6 },
  reportBtn: { alignItems: 'center', display: 'flex', fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-medium'], gap: 8, justifyContent: 'space-between', width: '100%' },
  chev: { transform: 'rotate(0deg)', transitionDuration: motion['--oniva-motion-dur-base'], transitionProperty: 'transform', transitionTimingFunction: motion['--oniva-motion-ease-in-out'] },
  chevOpen: { transform: 'rotate(180deg)' },
  filters: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end', marginBottom: 12 },
  search: { flexBasis: 200, flexGrow: 0, minWidth: 0, width: 220 },
  kindSel: { flexShrink: 0, width: 130 },
  entry: {
    alignItems: 'flex-start',
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationName: { default: slide, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'flex',
    gap: 10,
  },
  entryBody: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0, overflowWrap: 'anywhere' },
  mention: { color: colors['--oniva-color-accent-text'], fontWeight: font['--oniva-font-weight-medium'] },
  composer: { alignItems: 'flex-start', display: 'flex', gap: 12, marginBottom: 16, position: 'relative' },
  box: { backgroundColor: colors['--oniva-color-surface-inner'], borderColor: colors['--oniva-color-border-control'], borderRadius: radius['--oniva-radius-xl'], borderStyle: 'solid', borderWidth: 1, display: 'flex', flex: '1 1 0', flexDirection: 'column', gap: 4, minWidth: 0, padding: 8 },
  hint: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-11'], marginInlineEnd: 4 },
  line: { alignItems: 'stretch', display: 'flex', flexDirection: 'column', gap: 2, listStyle: 'none', margin: 0, padding: 0 },
  node: { alignItems: 'center', backgroundColor: colors['--oniva-color-surface-inner'], borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-full'], borderStyle: 'solid', borderWidth: 1, color: colors['--oniva-color-text-muted'], display: 'inline-flex', flexShrink: 0, height: 28, justifyContent: 'center', width: 28 },
  rail: { backgroundColor: colors['--oniva-color-border'], flex: '1 1 0', marginBlock: 2, width: 1 },
  gutter: { alignItems: 'center', display: 'flex', flexDirection: 'column' },
  item: { display: 'flex', gap: 12, paddingBottom: 12 },
  who2: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', fontSize: font['--oniva-font-size-13'], gap: 6, minHeight: 28 },
  bubble: { borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-lg'], borderStyle: 'solid', borderWidth: 1, fontSize: font['--oniva-font-size-13'], padding: '8px 12px' },
  textarea: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    boxSizing: 'border-box',
    color: 'inherit',
    font: 'inherit',
    fontSize: font['--oniva-font-size-13'],
    outlineStyle: 'none',
    minHeight: 56,
    padding: 6,
    resize: 'none',
    width: '100%',
  },
  suggest: { backgroundColor: colors['--oniva-color-surface-inner'], borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-lg'], borderStyle: 'solid', borderWidth: 1, listStyle: 'none', margin: 0, padding: 4 },
  suggestItem: { borderRadius: radius['--oniva-radius-md'], fontSize: font['--oniva-font-size-13'], padding: '6px 8px' },
  suggestOn: { backgroundColor: colors['--oniva-color-accent-soft'], color: colors['--oniva-color-accent-soft-fg'] },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  when: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums' },
});

export interface ContextKpi {
  id: string;
  label: string;
  value: number;
  format?: Intl.NumberFormatOptions;
  /** Signed percent change. */
  delta: number;
  trend: number[];
}
export interface ContextReport {
  id: string;
  name: string;
  summary: string;
}
export interface ContextFile {
  name: string;
  type: 'pdf' | 'xlsx' | 'csv' | 'doc';
}
export type ContextEntry =
  | { id: string; kind: 'note'; author: string; at: string; text: string }
  | { id: string; kind: 'report'; at: string; reportId: string }
  | { id: string; kind: 'files'; author: string; at: string; files: ContextFile[]; text?: string }
  | { id: string; kind: 'integration'; at: string; app: string; connected: boolean };
export interface ContextClient {
  id: string;
  name: string;
  meta: string;
  kpis: ContextKpi[];
  reports: ContextReport[];
  context: ContextEntry[];
}

export interface ClientContextProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  clients?: ContextClient[];
  /** Author of new context. */
  me?: { name: string };
  /** Called when context is added. */
  onAddContext?: (clientId: string, text: string, files: ContextFile[]) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export const defaultClients: ContextClient[] = [
  {
    id: 'harbor',
    name: 'Harbor Goods',
    meta: 'Retail, 42 staff',
    kpis: [
      { id: 'rev', label: 'Revenue', value: 182400, format: { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }, delta: 7.8, trend: [4, 5, 5, 7, 6, 8, 9] },
      { id: 'ord', label: 'Orders', value: 4210, delta: 3.2, trend: [6, 6, 7, 7, 8, 7, 9] },
      { id: 'cac', label: 'Acquisition cost', value: 18.4, format: { style: 'currency', currency: 'USD' }, delta: -4.1, trend: [9, 8, 8, 7, 7, 6, 6] },
      { id: 'ret', label: 'Return rate', value: 0.052, format: { style: 'percent', maximumFractionDigits: 1 }, delta: 1.4, trend: [3, 4, 3, 4, 4, 5, 5] },
    ],
    reports: [
      { id: 'q3', name: 'Q3 margin review', summary: 'Gross margin rose to 41% after the supplier change; shipping is the largest remaining cost.' },
      { id: 'churn', name: 'Repeat-buyer analysis', summary: '38% of buyers return within 60 days; email drives most repeat orders.' },
    ],
    context: [
      { id: 'e1', kind: 'note', author: 'Maya Ortiz', at: '2026-10-22', text: 'Goal for Q4: lift repeat buyers to 42%. Revisit the @Repeat-buyer analysis before the call.' },
      { id: 'e2', kind: 'files', author: 'Jonas Weber', at: '2026-10-19', files: [{ name: 'Q3-P&L.xlsx', type: 'xlsx' }, { name: 'Supplier-terms.pdf', type: 'pdf' }] },
      { id: 'e3', kind: 'integration', at: '2026-10-12', app: 'Warehouse feed', connected: true },
      { id: 'e4', kind: 'report', at: '2026-10-08', reportId: 'q3' },
    ],
  },
  {
    id: 'tessel',
    name: 'Tessel Studio',
    meta: 'Agency, 12 staff',
    kpis: [
      { id: 'rev', label: 'Retainer revenue', value: 64000, format: { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }, delta: 2.5, trend: [5, 5, 5, 6, 6, 6, 7] },
      { id: 'util', label: 'Utilization', value: 0.78, format: { style: 'percent', maximumFractionDigits: 0 }, delta: 4.0, trend: [5, 6, 6, 7, 7, 8, 8] },
      { id: 'inv', label: 'Open invoices', value: 9, delta: -12, trend: [9, 8, 8, 7, 6, 6, 5] },
      { id: 'nps', label: 'Client score', value: 46, delta: 6.0, trend: [3, 4, 4, 5, 5, 6, 6] },
    ],
    reports: [{ id: 'util', name: 'Utilization by team', summary: 'Design is at 84%; engineering has room for one more project in November.' }],
    context: [{ id: 't1', kind: 'note', author: 'Priya Nair', at: '2026-10-21', text: 'Prefers weekly summaries on Monday morning.' }],
  },
];

const ICON = { note: MessageSquare, report: FileText, files: Paperclip, integration: Plug } as const;

export function ClientContext({ clients = defaultClients, me = { name: 'You' }, onAddContext, className, xstyle, ref, ...rest }: ClientContextProps) {
  const [clientId, setClientId] = useState(clients[0]?.id ?? '');
  const [added, setAdded] = useState<Record<string, ContextEntry[]>>({});
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<'all' | ContextEntry['kind']>('all');
  const [pressed, setPressed] = useState<string | null>(null);
  const [openReport, setOpenReport] = useState<string | null>(null);
  const [text, setText] = useState('');
  const [files, setFiles] = useState<ContextFile[]>([]);
  const [hi, setHi] = useState(0);
  const uid = useId();
  const { date } = useFormatters();
  const client = clients.find((c) => c.id === clientId) ?? clients[0];
  const entries = useMemo(() => [...(added[clientId] ?? []), ...(client?.context ?? [])], [added, client, clientId]);
  if (!client) return null;

  const mentionMatch = /(?:^|\s)@([\w-]*)$/.exec(text);
  const suggestions = mentionMatch ? client.reports.filter((r) => r.name.toLowerCase().replace(/\s+/g, '-').includes(mentionMatch[1]!.toLowerCase()) || r.name.toLowerCase().includes(mentionMatch[1]!.toLowerCase())) : [];
  const insertMention = (name: string) => setText((t) => t.replace(/@([\w-]*)$/, `@${name.replace(/\s+/g, '-')} `));
  const submit = () => {
    const t = text.trim();
    if (!t && files.length === 0) return;
    const e: ContextEntry = files.length ? { id: `n${Date.now()}`, kind: 'files', author: me.name, at: new Date().toISOString().slice(0, 10), files, text: t || undefined } : { id: `n${Date.now()}`, kind: 'note', author: me.name, at: new Date().toISOString().slice(0, 10), text: t };
    setAdded((a) => ({ ...a, [clientId]: [e, ...(a[clientId] ?? [])] }));
    onAddContext?.(clientId, t, files);
    setText('');
    setFiles([]);
  };
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (suggestions.length) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHi((h) => (h + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHi((h) => (h - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if ((e.key === 'Enter' || e.key === 'Tab') && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        insertMention((suggestions[hi] ?? suggestions[0]!).name);
        setHi(0);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setText((t) => t.replace(/@[\w-]*$/, ''));
        return;
      }
    }
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      submit();
    }
  };
  const shown = entries.filter((e) => {
    if (kind !== 'all' && e.kind !== kind) return false;
    if (!query) return true;
    const hay = e.kind === 'note' ? e.text : e.kind === 'files' ? e.files.map((f) => f.name).join(' ') + (e.text ?? '') : e.kind === 'integration' ? e.app : client.reports.find((r) => r.id === e.reportId)?.name ?? '';
    return hay.toLowerCase().includes(query.toLowerCase());
  });
  const fmtDate = (iso: string) => date(new Date(`${iso}T00:00:00`), { month: 'short', day: 'numeric' });
  const renderText = (t: string) => t.split(/(@[\w-]+)/g).map((p, i) => (p.startsWith('@') ? <span key={i} {...stylex.props(styles.mention)}>{p}</span> : p));
  const sx = stylex.props(w8.root, xstyle);

  return (
    <section ref={ref} aria-label="Client workspace" {...rest} {...mergeSx(sx, className)}>
      <div {...stylex.props(w8.panel)}>
        <div {...stylex.props(styles.head)}>
          <div {...stylex.props(styles.who)}>
            <span aria-hidden="true" {...stylex.props(styles.logo)}>
              {client.name.slice(0, 1)}
            </span>
            <div {...stylex.props(w8.ellipsis)}>
              <h2 {...stylex.props(styles.name)}>{client.name}</h2>
              <span {...stylex.props(w8.muted)}>{client.meta}</span>
            </div>
          </div>
          <div {...stylex.props(styles.tools)}>
            <span {...stylex.props(styles.synced)}>
              <span aria-hidden="true" {...stylex.props(styles.syncDot)} />
              Synced 3m ago
              <RefreshCw size={12} aria-hidden="true" />
            </span>
            <Select aria-label="Client" selectedKey={clientId} onSelectionChange={(k) => k && (setClientId(String(k)), setPressed(null))} xstyle={styles.picker}>
              {clients.map((c) => (
                <SelectItem key={c.id} id={c.id} textValue={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <ul {...stylex.props(styles.kpis)}>
          {client.kpis.map((k, ki) => (
            <li key={`${client.id}-${k.id}`} style={{ '--i': ki } as React.CSSProperties} {...stylex.props(styles.kpiRise)}>
              <button type="button" aria-pressed={pressed === k.id} onClick={() => setPressed((p) => (p === k.id ? null : k.id))} {...stylex.props(w8.press, styles.kpi, focus.ring)}>
                <span {...stylex.props(styles.kpiRow)}>
                  <span {...stylex.props(w8.muted)}>{k.label}</span>
                  <DeltaBadge value={k.delta} size="sm" invert={k.id === 'cac' || k.id === 'ret' || k.id === 'inv'} />
                </span>
                <span {...stylex.props(styles.kpiRow)}>
                  <span {...stylex.props(styles.kpiValue)}>{new Intl.NumberFormat(undefined, k.format).format(k.value)}</span>
                  <Sparkline key={client.id} data={k.trend} variant="line" width={64} height={24} label={`${k.label} trend`} />
                </span>
              </button>
            </li>
          ))}
        </ul>
        <Tabs>
          <TabList aria-label="Client sections">
            <Tab id="context">Context</Tab>
            <Tab id="reports" count={client.reports.length}>Reports</Tab>
          </TabList>
          <TabPanel id="context">
            <div {...stylex.props(styles.filters)}>
              <SearchField aria-label="Search context" value={query} onChange={setQuery} shortcut={null} xstyle={styles.search} />
              <Select aria-label="Filter by type" selectedKey={kind} onSelectionChange={(k) => setKind(String(k) as typeof kind)} xstyle={styles.kindSel}>
                <SelectItem id="all">All types</SelectItem>
                <SelectItem id="note">Notes</SelectItem>
                <SelectItem id="files">Files</SelectItem>
                <SelectItem id="report">Reports</SelectItem>
                <SelectItem id="integration">Integrations</SelectItem>
              </Select>
            </div>
            <div {...stylex.props(styles.composer)}>
              <Avatar size="sm" name={me.name} />
              <div {...stylex.props(styles.box)}>
                <textarea
                  aria-label="Add context"
                  placeholder="Add a goal, request or decision. Type @ to mention a report."
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setHi(0);
                  }}
                  onKeyDown={onKey}
                  aria-controls={suggestions.length ? `${uid}-sg` : undefined}
                  {...stylex.props(styles.textarea, focus.ring)}
                />
                {suggestions.length > 0 && (
                  <ul id={`${uid}-sg`} role="listbox" aria-label="Reports" {...stylex.props(styles.suggest, styles.menuPop)}>
                    {suggestions.map((r, i) => (
                      <li key={r.id} role="option" aria-selected={i === hi} onMouseDown={(e) => (e.preventDefault(), insertMention(r.name))} {...stylex.props(styles.suggestItem, i === hi && styles.suggestOn)}>
                        {r.name}
                      </li>
                    ))}
                  </ul>
                )}
                {files.length > 0 && (
                  <div {...stylex.props(styles.chips)}>
                    {files.map((f) => (
                      <Badge key={f.name} variant="neutral">{f.name}</Badge>
                    ))}
                  </div>
                )}
                <div {...stylex.props(w8.row, w8.between)}>
                  <Button size="sm" variant="ghost" startIcon={<Paperclip size={14} aria-hidden="true" />} onPress={() => setFiles((f) => [...f, { name: `Attachment-${f.length + 1}.pdf`, type: 'pdf' }])}>
                    Attach file
                  </Button>
                  <span {...stylex.props(w8.row)}>
                    <span aria-hidden="true" {...stylex.props(styles.hint)}>Ctrl Enter</span>
                    <Button size="sm" onPress={submit} isDisabled={!text.trim() && files.length === 0}>
                      Add context
                    </Button>
                  </span>
                </div>
              </div>
            </div>
            <ul {...stylex.props(styles.line)} aria-label={pluralize(shown.length, { one: '# context entry', other: '# context entries' })}>
              {shown.map((e, ei) => {
                const Icon = ICON[e.kind];
                const person = e.kind === 'note' || e.kind === 'files';
                return (
                  <li key={e.id} style={{ '--i': Math.min(ei, 5) } as React.CSSProperties} {...stylex.props(styles.item, styles.entry, styles.entryStag)}>
                    <div aria-hidden="true" {...stylex.props(styles.gutter)}>
                      <span {...stylex.props(styles.node)}>
                        <Icon size={14} />
                      </span>
                      {ei < shown.length - 1 && <span {...stylex.props(styles.rail)} />}
                    </div>
                    <div {...stylex.props(styles.entryBody)}>
                      <span {...stylex.props(styles.who2)}>
                        {person && <Avatar size="xs" name={e.author} />}
                        <strong {...stylex.props(w8.h3)} style={{ fontWeight: 500 }}>{person ? e.author : e.kind === 'report' ? 'Report' : 'Integration'}</strong>
                        <span {...stylex.props(styles.when)}>{e.kind === 'note' ? 'added context' : e.kind === 'files' ? 'added files' : e.kind === 'report' ? 'generated' : 'synced'} · {fmtDate(e.at)}</span>
                      </span>
                      {e.kind === 'note' && <span {...stylex.props(styles.bubble)}>{renderText(e.text)}</span>}
                      {e.kind === 'files' && (
                        <>
                          {e.text && <span {...stylex.props(styles.bubble)}>{renderText(e.text)}</span>}
                          <span {...stylex.props(styles.chips)}>
                            {e.files.map((f) => (
                              <Badge key={f.name} variant="neutral">{f.name}</Badge>
                            ))}
                          </span>
                        </>
                      )}
                      {e.kind === 'report' && <span {...stylex.props(styles.bubble)}>{client.reports.find((r) => r.id === e.reportId)?.name}</span>}
                      {e.kind === 'integration' && (
                        <span {...stylex.props(w8.row)}>
                          {e.app} <Badge variant={e.connected ? 'success' : 'neutral'} size="sm">{e.connected ? 'Connected' : 'Disconnected'}</Badge>
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
              {shown.length === 0 && <li {...stylex.props(w8.muted)}>No context matches.</li>}
            </ul>
          </TabPanel>
          <TabPanel id="reports">
            <ul {...stylex.props(w8.list)}>
              {client.reports.map((r) => {
                const open = openReport === r.id;
                return (
                  <li key={r.id} {...stylex.props(w8.tile, styles.report)}>
                    <button type="button" aria-expanded={open} aria-controls={`${uid}-${r.id}`} onClick={() => setOpenReport(open ? null : r.id)} {...stylex.props(w8.press, styles.reportBtn, focus.ring)}>
                      {r.name}
                      <ChevronDown size={16} aria-hidden="true" {...stylex.props(styles.chev, open && styles.chevOpen)} />
                    </button>
                    <AnimatedHeight isOpen={open}>
                      <p id={`${uid}-${r.id}`} {...stylex.props(w8.muted)}>{r.summary}</p>
                    </AnimatedHeight>
                  </li>
                );
              })}
            </ul>
          </TabPanel>
        </Tabs>
      </div>
    </section>
  );
}
