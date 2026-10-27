import * as stylex from '@stylexjs/stylex';
import { Folder, MoreHorizontal, PanelLeft, Pin, Plus, Search, Settings } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { Composer } from '../../ai/Composer';
import type { ModelOption } from '../../ai/ModelSelector';
import { Message } from '../../ai/Message';
import { ResponseStream } from '../../ai/ResponseStream';
import { TypingIndicator } from '../../ai/TypingIndicator';
import { Avatar } from '../../components/Avatar/Avatar';
import { Button } from '../../components/Button/Button';
import { focus } from '../../internal/focus';
import { pluralize } from '../../internal/format';
import { mergeRefs } from '../../internal/n3-hooks';
import { mergeSx } from '../../internal/sx';
import { w8 } from '../../internal/w8-styles';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const NARROW = '@container (max-width: 720px)';
const scrimIn = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const fadeIn = stylex.keyframes({ from: { opacity: 0, transform: 'translateY(6px)' }, to: { opacity: 1, transform: 'translateY(0)' } });

const styles = stylex.create({
  shell: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-card'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-card'],
    boxSizing: 'border-box',
    display: 'flex',
    height: 'var(--ws-height, 540px)',
    maxWidth: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  side: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderInlineEndColor: colors['--oniva-color-border'],
    borderInlineEndStyle: 'solid',
    borderInlineEndWidth: 1,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    gap: 2,
    overflowY: 'auto',
    padding: 12,
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'transform, margin-inline-start, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-drawer'],
    width: 220,
  },
  sideOpen: { marginInlineStart: 0, opacity: 1, transform: 'translateX(0)' },
  sideShut: { marginInlineStart: -220, opacity: 0, transform: 'translateX(-24px)' },
  sideNarrow: { bottom: 0, insetInlineStart: 0, position: { default: 'static', [NARROW]: 'absolute' }, top: 0, zIndex: 3 },
  navBtn: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-md'],
    display: 'flex',
    fontSize: font['--oniva-font-size-13'],
    gap: 8,
    minWidth: 0,
    padding: '6px 8px',
    width: '100%',
    backgroundColor: { default: 'transparent', ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-hover'] } },
  },
  navOn: { backgroundColor: colors['--oniva-color-surface-tertiary'] },
  search: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    gap: 8,
    marginBlock: 8,
    paddingBlock: 6,
    paddingInline: 8,
  },
  searchInput: { appearance: 'none', backgroundColor: 'transparent', borderWidth: 0, color: colors['--oniva-color-text'], flex: '1 1 0', font: 'inherit', fontSize: font['--oniva-font-size-13'], minWidth: 0, outlineStyle: 'none', padding: 0 },
  spacer: { flex: '1 1 0', minHeight: 12 },
  user: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'flex', fontSize: font['--oniva-font-size-13'], gap: 8, justifyContent: 'space-between', paddingBlock: 6, paddingInline: 4 },
  crumb: { alignItems: 'center', display: 'flex', fontSize: font['--oniva-font-size-13'], gap: 6, minWidth: 0 },
  disclaimer: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-11'], margin: 0 },
  composerBox: { maxWidth: 560, width: '100%' },
  navLabel: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-11'], margin: '14px 0 4px', padding: '0 8px' },
  main: { display: 'flex', flex: '1 1 0', flexDirection: 'column', minWidth: 0 },
  bar: { alignItems: 'center', borderBottomColor: colors['--oniva-color-border'], borderBottomStyle: 'solid', borderBottomWidth: 1, display: 'flex', gap: 8, padding: '8px 12px', minHeight: 40 },
  scrim: { backgroundColor: colors['--oniva-color-overlay'], bottom: 0, display: { default: 'none', [NARROW]: 'block' }, insetInline: 0, position: 'absolute', top: 0, zIndex: 2, animationDuration: motion['--oniva-motion-dur-slow'], animationName: { default: scrimIn, [media.reducedMotion]: 'none' }, animationTimingFunction: motion['--oniva-motion-ease-out'] },
  scroll: { display: 'flex', flex: '1 1 0', flexDirection: 'column', gap: 16, overflowY: 'auto', padding: 16 },
  welcome: { alignItems: 'center', display: 'flex', flex: '1 1 0', flexDirection: 'column', gap: 8, justifyContent: 'center', textAlign: 'center' },
  hello: { fontSize: font['--oniva-font-size-24'], fontWeight: font['--oniva-font-weight-semibold'], letterSpacing: font['--oniva-font-track-hero'], margin: 0 },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginTop: 8 },
  composer: { padding: 12 },
  view: { animationDuration: motion['--oniva-motion-dur-enter'], animationName: { default: fadeIn, [media.reducedMotion]: 'none' }, animationTimingFunction: motion['--oniva-motion-ease-out'] },
  rise: {
    animationDelay: 'calc(var(--i, 0) * 45ms)',
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: fadeIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  msgNew: { animationDuration: motion['--oniva-motion-dur-enter'], animationName: { default: fadeIn, [media.reducedMotion]: 'none' }, animationTimingFunction: motion['--oniva-motion-ease-out'] },
  projects: { display: 'grid', gap: 12, gridTemplateColumns: { default: 'repeat(auto-fill, minmax(220px, 1fr))', [NARROW]: 'minmax(0, 1fr)' } },
  project: { display: 'flex', flexDirection: 'column', gap: 6, width: '100%' },
});

export interface WorkspaceConversation {
  id: string;
  title: string;
  messages: { role: 'user' | 'assistant'; text: string }[];
}
export interface WorkspaceProject {
  id: string;
  name: string;
  description: string;
  /** Days since the last update. */
  updatedDaysAgo: number;
}

const demoModels: ModelOption[] = [
  { id: 'atlas-2', name: 'Atlas 2', description: 'Balanced for everyday work', speed: 4, quality: 4, cost: 3 },
  { id: 'lumen-fast', name: 'Lumen Fast', description: 'Quick answers', speed: 5, quality: 3, cost: 1 },
  { id: 'quill-reasoner', name: 'Quill Reasoner', description: 'Deeper reasoning', speed: 2, quality: 5, cost: 5 },
];
const defaultConversations: WorkspaceConversation[] = [
  {
    id: 'c1',
    title: 'October close checklist',
    messages: [
      { role: 'user', text: 'What is still open for the October close?' },
      { role: 'assistant', text: 'Three items remain: reconcile the Savannah warehouse account, approve 6 vendor invoices, and post the accrual for the Q4 insurance premium.' },
    ],
  },
  { id: 'c2', title: 'Refund policy wording', messages: [{ role: 'user', text: 'Tighten our refund policy to one paragraph.' }, { role: 'assistant', text: 'Customers can request a refund within 30 days of delivery. Unused items are refunded in full; opened items receive store credit.' }] },
];
const defaultProjects: WorkspaceProject[] = [
  { id: 'p1', name: 'Q4 planning', description: 'Targets, hiring plan and budget drafts.', updatedDaysAgo: 2 },
  { id: 'p2', name: 'Support macros', description: 'Reusable replies for the top 20 ticket types.', updatedDaysAgo: 9 },
  { id: 'p3', name: 'Vendor reviews', description: 'Contracts and renewal notes by supplier.', updatedDaysAgo: 21 },
];
const demoAnswer = (q: string) => `Here is a quick take on "${q.slice(0, 60)}": start with the facts you already have, list what is missing, and decide the next owner. I can turn this into a checklist if you like.`;

export interface AiWorkspaceProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  /** Your model call; the answer streams in word by word. Without it a demo answer is used. */
  respond?: (message: string, history: { role: 'user' | 'assistant'; text: string }[]) => Promise<string>;
  userName?: string;
  /** Project shown in the top-bar breadcrumb. */
  projectName?: string;
  /** Pinned assistants listed in the sidebar. */
  pinned?: string[];
  /** Initial or logo in the top-left tile. */
  workspace?: ReactNode;
  conversations?: WorkspaceConversation[];
  projects?: WorkspaceProject[];
  models?: ModelOption[];
  /** Height in px. Default `540`. */
  height?: number;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function AiWorkspace({
  respond,
  userName = 'Lena',
  projectName = 'Brand refresh',
  pinned = ['Writing assistant', 'Data analyst', 'Knowledge base'],
  workspace = 'N',
  conversations: convProp = defaultConversations,
  projects = defaultProjects,
  models = demoModels,
  height = 540,
  className,
  xstyle,
  ref,
  ...rest
}: AiWorkspaceProps) {
  const [convs, setConvs] = useState(convProp);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [view, setView] = useState<'chat' | 'projects'>('chat');
  const [open, setOpen] = useState(true);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState('');
  const [streamId, setStreamId] = useState<string | null>(null);
  const root = useRef<HTMLElement>(null);
  const decided = useRef(false);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(([e]) => {
      if (!decided.current && e && e.contentRect.width > 0) {
        decided.current = true;
        setOpen(e.contentRect.width >= 720);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const active = convs.find((c) => c.id === activeId) ?? null;
  useEffect(() => {
    end.current?.scrollIntoView?.({ block: 'end' });
  }, [active?.messages.length, busy]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    let id = active?.id;
    const history = active?.messages ?? [];
    if (!id) {
      id = `c${Date.now()}`;
      const created = { id, title: t.slice(0, 40), messages: [{ role: 'user' as const, text: t }] };
      setConvs((c) => [created, ...c]);
      setActiveId(id);
    } else {
      setConvs((c) => c.map((x) => (x.id === id ? { ...x, messages: [...x.messages, { role: 'user', text: t }] } : x)));
    }
    setBusy(true);
    const answer = await (respond ? respond(t, history) : Promise.resolve(demoAnswer(t)));
    setConvs((c) => c.map((x) => (x.id === id ? { ...x, messages: [...x.messages, { role: 'assistant', text: answer }] } : x)));
    setStreamId(id);
    setBusy(false);
  };
  const sx = stylex.props(w8.root, xstyle);
  const vars = { '--ws-height': `${height}px` } as React.CSSProperties;

  return (
    <section ref={mergeRefs(root, ref)} aria-label="AI workspace" {...rest} {...mergeSx(sx, className)}>
      <div {...mergeSx(stylex.props(styles.shell), undefined, vars)}>
        {open && <div aria-hidden="true" onClick={() => setOpen(false)} {...stylex.props(styles.scrim)} />}
        <nav aria-label="Workspace" inert={!open} {...stylex.props(styles.side, styles.sideNarrow, open ? styles.sideOpen : styles.sideShut)}>
          <div {...stylex.props(w8.row)}>
            <Avatar size="sm" name={typeof workspace === 'string' ? workspace : 'Workspace'} fallback={typeof workspace === 'string' ? undefined : workspace} />
            <strong {...stylex.props(w8.h3)}>Workspace</strong>
          </div>
          <label {...stylex.props(styles.search)}>
            <Search size={14} aria-hidden="true" />
            <input type="search" aria-label="Search chats" placeholder="Search chats…" value={query} onChange={(e) => setQuery(e.target.value)} {...stylex.props(styles.searchInput)} />
          </label>
          <button
            type="button"
            onClick={() => {
              setActiveId(null);
              setView('chat');
            }}
            {...stylex.props(w8.press, styles.navBtn, view === 'chat' && activeId === null && styles.navOn, focus.ring)}
          >
            <Plus size={14} aria-hidden="true" />
            <span>New chat</span>
          </button>
          <button type="button" aria-current={view === 'projects' ? 'page' : undefined} onClick={() => setView('projects')} {...stylex.props(w8.press, styles.navBtn, view === 'projects' && styles.navOn, focus.ring)}>
            <Folder size={14} aria-hidden="true" />
            <span {...stylex.props(w8.ellipsis)}>Projects</span>
          </button>
          {pinned.length > 0 && <p {...stylex.props(styles.navLabel)}>Pinned</p>}
          <ul {...stylex.props(w8.list)} style={{ gap: 2 }}>
            {pinned.map((name) => (
              <li key={name}>
                <button
                  type="button"
                  onClick={() => {
                    setActiveId(null);
                    setView('chat');
                  }}
                  {...stylex.props(w8.press, styles.navBtn, focus.ring)}
                >
                  <Pin size={14} aria-hidden="true" />
                  <span {...stylex.props(w8.ellipsis)}>{name}</span>
                </button>
              </li>
            ))}
          </ul>
          <p {...stylex.props(styles.navLabel)}>Recents</p>
          <ul {...stylex.props(w8.list)} style={{ gap: 2 }}>
            {convs
              .filter((c) => c.title.toLowerCase().includes(query.trim().toLowerCase()))
              .map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    aria-current={view === 'chat' && activeId === c.id ? 'page' : undefined}
                    onClick={() => {
                      setActiveId(c.id);
                      setView('chat');
                    }}
                    {...stylex.props(w8.press, styles.navBtn, view === 'chat' && activeId === c.id && styles.navOn, focus.ring)}
                  >
                    <span {...stylex.props(w8.ellipsis)}>{c.title}</span>
                  </button>
                </li>
              ))}
          </ul>
          <div {...stylex.props(styles.spacer)} />
          <div {...stylex.props(styles.user)}>
            <span {...stylex.props(w8.row)}>
              <Avatar size="sm" name={userName} />
              {userName}
            </span>
            <Settings size={14} aria-hidden="true" />
          </div>
        </nav>
        <div {...stylex.props(styles.main)}>
          <div {...stylex.props(styles.bar)}>
            <Button size="sm" variant="ghost" isIconOnly aria-label={open ? 'Collapse sidebar' : 'Expand sidebar'} aria-expanded={open} onPress={() => setOpen((o) => !o)}>
              <PanelLeft size={16} aria-hidden="true" />
            </Button>
            <div {...stylex.props(styles.crumb)}>
              {view === 'chat' && <span {...stylex.props(w8.muted)}>{projectName} /</span>}
              <h2 {...stylex.props(w8.h3, w8.ellipsis)} style={{ fontWeight: 500 }}>{view === 'projects' ? 'Projects' : active?.title ?? 'New chat'}</h2>
            </div>
            <span {...stylex.props(styles.spacer)} />
            <MoreHorizontal size={16} aria-hidden="true" />
          </div>
          {view === 'projects' ? (
            <div key="projects" {...stylex.props(styles.scroll, styles.view)}>
              <ul {...stylex.props(styles.projects, w8.list)}>
                {projects.map((p) => (
                  <li key={p.id} style={{ '--i': Math.min(projects.indexOf(p), 6) } as React.CSSProperties} {...stylex.props(w8.tile, styles.project, styles.rise)}>
                    <h3 {...stylex.props(w8.h3)}>{p.name}</h3>
                    <p {...stylex.props(w8.muted)}>{p.description}</p>
                    <span {...stylex.props(w8.muted)}>Updated {pluralize(p.updatedDaysAgo, { one: '# day ago', other: '# days ago' })}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div key="chat" role="log" aria-live="polite" aria-label="Conversation" {...stylex.props(styles.scroll, styles.view)}>
              {!active ? (
                <div {...stylex.props(styles.welcome)}>
                  <h3 style={{ '--i': 0 } as React.CSSProperties} {...stylex.props(styles.hello, styles.rise)}>Good to see you, {userName}</h3>
                  <p style={{ '--i': 1 } as React.CSSProperties} {...stylex.props(w8.muted, styles.rise)}>Ask a question, or start from a suggestion.</p>
                  <div style={{ '--i': 2 } as React.CSSProperties} {...stylex.props(styles.composerBox, styles.rise)}>
                    <Composer models={models} hidePermissions hideEffort isStreaming={busy} onSubmit={(v) => void send(v)} placeholder="Ask anything…" />
                  </div>
                  <div style={{ '--i': 3 } as React.CSSProperties} {...stylex.props(styles.chips, styles.rise)}>
                    {['Summarize open invoices', 'Draft a vendor reply', 'Plan next week'].map((s) => (
                      <Button key={s} size="sm" variant="secondary" onPress={() => void send(s)}>
                        {s}
                      </Button>
                    ))}
                  </div>
                  <p {...stylex.props(styles.disclaimer)}>Responses can contain mistakes. Check anything important.</p>
                </div>
              ) : (
                active.messages.map((m, i) => {
                  const last = i === active.messages.length - 1 && m.role === 'assistant' && streamId === active.id;
                  return (
                    <div key={i} {...stylex.props(i === active.messages.length - 1 && styles.msgNew)}>
                      <Message role={m.role} name={m.role === 'user' ? userName : 'Assistant'} copyText={m.role === 'assistant' ? m.text : undefined}>
                        {last ? <ResponseStream text={m.text} /> : m.text}
                      </Message>
                    </div>
                  );
                })
              )}
              {busy && <TypingIndicator />}
              <div ref={end} />
            </div>
          )}
          {view === 'chat' && active && (
            <div {...stylex.props(styles.composer)}>
              <Composer models={models} hidePermissions hideEffort isStreaming={busy} onSubmit={(v) => void send(v)} placeholder="Ask anything…" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
