import * as stylex from '@stylexjs/stylex';
import { Check, FileText, MessageSquare, MousePointer2, X } from 'lucide-react';
import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode, type Ref } from 'react';
import { Button, Dialog, DialogTrigger, Popover, ToggleButton } from 'react-aria-components';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { prefersReducedMotion } from '../../internal/motion-hooks';
import { mergeSx, sxClass } from '../../internal/sx';
import { AgentAvatar } from '../AgentAvatar';
import { LiveRegion, useAnnouncer, useControlled, useWidth, w1 } from '../../internal/w1-agent-ui';

export interface CursorAgent {
  id: string;
  name: string;
  /** Without a color every agent shares one ink and the faces tell them apart. */
  color?: string;
  avatar?: ReactNode;
  cost?: number;
}
export interface DocBlock {
  id: string;
  kind?: 'title' | 'heading' | 'paragraph' | 'item' | 'code' | 'image';
  text?: string;
  /** Image only: source, alt text, aspect ratio (width / height) and loading state. `text` is the caption. */
  src?: string;
  alt?: string;
  ratio?: number;
  loading?: boolean;
}
export interface AgentCursor {
  block: string;
  /** Character offset into the block's current text. */
  at?: number;
  /** Length of the selected passage starting at `at`. */
  select?: number;
  /** What it is doing, shown on its flag. */
  doing?: string;
  typing?: boolean;
}
export interface DocSuggestion {
  id: string;
  agent: string;
  block: string;
  at: number;
  /** Number of characters to remove, starting at `at`. */
  remove?: number;
  insert?: string;
  note?: string;
}
export interface DocComment {
  id: string;
  agent: string;
  block: string;
  at?: number;
  text: string;
}

/** Writes one suggestion into the text and moves the other suggestions of that block along. */
export function acceptSuggestion(
  blocks: DocBlock[],
  suggestions: DocSuggestion[],
  id: string,
): { blocks: DocBlock[]; suggestions: DocSuggestion[] } {
  const s = suggestions.find((x) => x.id === id);
  if (!s) return { blocks, suggestions };
  const remove = s.remove ?? 0;
  const insert = s.insert ?? '';
  const delta = insert.length - remove;
  return {
    blocks: blocks.map((b) => (b.id === s.block ? { ...b, text: (b.text ?? '').slice(0, s.at) + insert + (b.text ?? '').slice(s.at + remove) } : b)),
    suggestions: suggestions.filter((x) => x.id !== id).map((x) => (x.block === s.block && x.at >= s.at + remove ? { ...x, at: x.at + delta } : x)),
  };
}

const fadeIn = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const fadeOut = stylex.keyframes({ from: { opacity: 1 }, to: { opacity: 0 } });
const pointerIn = stylex.keyframes({ from: { opacity: 0, transform: 'scale(0.7)' }, to: { opacity: 1, transform: 'scale(1)' } });
const pointerOut = stylex.keyframes({ from: { opacity: 1, transform: 'scale(1)' }, to: { opacity: 0, transform: 'scale(0.9)' } });
const slideOut = stylex.keyframes({ from: { opacity: 0, transform: 'translateX(-6px)' }, to: { opacity: 1, transform: 'translateX(0)' } });
const arrow = stylex.keyframes({ '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.2 } });

const styles = stylex.create({
  root: { containerType: 'inline-size', maxWidth: 760 },
  faces: { alignItems: 'center', display: 'flex', gap: 4 },
  face: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: 'transparent', '[data-selected]': colors['--oniva-color-accent-soft'] },
    borderColor: { default: 'transparent', '[data-selected]': colors['--oniva-color-border-active'] },
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    cursor: 'pointer',
    display: 'inline-flex',
    padding: 2,
  },
  page: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    lineHeight: 1.6,
    maxHeight: 'var(--ph, none)',
    overflow: 'hidden',
    paddingBlock: 20,
    paddingInline: 'var(--pad, 28px)',
    position: 'relative',
  },
  block: { margin: 0, marginBlockEnd: 10, position: 'relative' },
  title: { fontSize: font['--oniva-font-size-24'], fontWeight: font['--oniva-font-weight-semibold'], lineHeight: 1.25 },
  heading: { fontSize: font['--oniva-font-size-16'], fontWeight: font['--oniva-font-weight-semibold'], marginBlockStart: 14 },
  ul: { margin: 0, marginBlockEnd: 10, paddingInlineStart: 20 },
  code: { backgroundColor: colors['--oniva-color-surface-inset'], borderRadius: radius['--oniva-radius-md'], fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-12'], overflowX: 'auto', padding: 10, whiteSpace: 'pre' },
  figure: { margin: 0, marginBlockEnd: 10 },
  img: { aspectRatio: 'var(--ratio, 1.6)', maxWidth: 360, backgroundColor: colors['--oniva-color-surface-tertiary'], borderRadius: radius['--oniva-radius-md'], objectFit: 'cover', position: 'relative', width: '100%' },
  caption: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], marginBlockStart: 4 },
  sugg: {
    appearance: 'none',
    backgroundColor: 'color-mix(in srgb, var(--ink, currentColor) 14%, transparent)',
    borderRadius: radius['--oniva-radius-xs'],
    borderWidth: 0,
    color: 'inherit',
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: fadeIn,
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    cursor: 'pointer',
    font: 'inherit',
    padding: 0,
    paddingInline: 1,
  },
  del: { color: colors['--oniva-color-text-muted'], textDecorationLine: 'line-through', textDecorationColor: 'var(--ink, currentColor)' },
  ins: { textDecorationColor: 'var(--ink, currentColor)', textDecorationLine: 'underline', textDecorationThickness: 2, textUnderlineOffset: 3 },
  sel: { backgroundColor: 'color-mix(in srgb, var(--ink, currentColor) 20%, transparent)', borderRadius: 2, position: 'absolute', transitionDuration: motion['--oniva-motion-dur-slow'], transitionProperty: 'opacity', animationName: { default: fadeIn, [media.reducedMotion]: 'none' }, animationDuration: motion['--oniva-motion-dur-slow'] },
  layer: { inset: 0, pointerEvents: 'none', position: 'absolute' },
  pointer: {
    left: 0,
    position: 'absolute',
    top: 0,
    transform: 'translate(calc(var(--x) * 1px), calc(var(--y) * 1px))',
    transitionDuration: { default: motion['--oniva-motion-dur-slower'], '[data-typing]': motion['--oniva-motion-dur-fast'] },
    transitionProperty: 'transform, opacity',
    transitionTimingFunction: { default: motion['--oniva-motion-ease-out'], '[data-typing]': 'linear' },
    opacity: { default: 1, '[data-dim]': 0.25 },
  },
  pointerInner: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationFillMode: 'backwards',
    animationName: { default: pointerIn, [media.reducedMotion]: fadeIn },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    transformOrigin: 'top left',
  },
  pointerGone: {
    animationDuration: motion['--oniva-motion-dur-fast'],
    animationFillMode: 'forwards',
    animationName: { default: pointerOut, [media.reducedMotion]: fadeOut },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    transformOrigin: 'top left',
  },
  doing: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: slideOut, [media.reducedMotion]: fadeIn },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'inline-block',
  },
  caret: {
    animationDuration: '1.1s',
    animationIterationCount: 'infinite',
    animationName: { default: arrow, [media.reducedMotion]: 'none' },
    backgroundColor: 'var(--ink, currentColor)',
    height: 'var(--h, 18px)',
    width: 2,
  },
  caretTyping: { animationName: 'none' },
  flag: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: 'color-mix(in srgb, var(--ink, currentColor) 45%, transparent)',
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: '0 2px 10px color-mix(in srgb, var(--ink, currentColor) 22%, transparent)',
    color: colors['--oniva-color-text'],
    display: 'flex',
    flexDirection: 'column',
    fontSize: font['--oniva-font-size-12'],
    gap: 2,
    insetInlineStart: 10,
    lineHeight: '16px',
    paddingBlock: 6,
    paddingInline: 10,
    position: 'absolute',
    top: 'calc(var(--h, 18px) + 4px)',
    whiteSpace: 'nowrap',
  },
  flagHead: { alignItems: 'center', display: 'flex', gap: 10, justifyContent: 'space-between' },
  flagName: { fontWeight: font['--oniva-font-weight-semibold'] },
  flagCost: { backgroundColor: colors['--oniva-color-surface-tertiary'], borderRadius: radius['--oniva-radius-sm'], color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-11'], fontVariantNumeric: 'tabular-nums', paddingInline: 5 },
  flagDoing: { color: colors['--oniva-color-text-muted'] },
  arrow: { color: 'var(--ink, currentColor)', fill: 'currentColor', left: -4, position: 'absolute', top: 'calc(var(--h, 18px) - 6px)' },
  crumb: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'inline-flex', gap: 8 },
  pin: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-text'],
    borderRadius: radius['--oniva-radius-full'],
    borderWidth: 0,
    color: colors['--oniva-color-bg'],
    cursor: 'pointer',
    display: 'inline-flex',
    height: 22,
    justifyContent: 'center',
    marginInlineStart: 6,
    transform: { default: 'scale(1)', ':active': 'scale(0.94)', ':hover': { default: null, [media.hover]: 'scale(1.18)' } },
    transitionDuration: motion['--oniva-motion-dur-press'],
    transitionProperty: 'transform, box-shadow',
    transitionTimingFunction: motion['--oniva-motion-ease-spring'],
    boxShadow: { default: 'none', ':hover': { default: null, [media.hover]: '0 2px 8px color-mix(in srgb, currentColor 30%, transparent)' } },
    verticalAlign: 'middle',
    width: 22,
  },
  pop: { display: 'flex', flexDirection: 'column', gap: 8 },
  btns: { display: 'flex', gap: 6 },
  btn: { alignItems: 'center', backgroundColor: colors['--oniva-color-surface-tertiary'], borderRadius: radius['--oniva-radius-md'], borderWidth: 0, color: colors['--oniva-color-text'], cursor: 'pointer', display: 'inline-flex', fontWeight: font['--oniva-font-weight-medium'], gap: 4, height: 28, paddingInline: 10 },
  btnPrimary: { backgroundColor: accent['--oniva-accent-solid'], color: colors['--oniva-color-accent-fg'] },
  who: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
});

interface Place { x: number; y: number; h: number; rects: { x: number; y: number; w: number; h: number }[] }

export interface AgentCursorsProps {
  /** Everyone who can be in the document. */
  agents: CursorAgent[];
  blocks: DocBlock[];
  suggestions?: DocSuggestion[];
  /** Where each agent is; `null` or missing means it left. */
  cursors?: Record<string, AgentCursor | null>;
  comments?: DocComment[];
  onResolveComment?: (comment: DocComment) => void;
  onAccept?: (suggestion: DocSuggestion) => void;
  onReject?: (suggestion: DocSuggestion) => void;
  /** Shows "Accept all" in the header when there is more than one suggestion. */
  onAcceptAll?: () => void;
  /** The agent you follow: the other pointers fade back. */
  following?: string | null;
  defaultFollowing?: string | null;
  onFollowingChange?: (id: string | null) => void;
  /** Fixed page height in px; the rest fades out. */
  height?: number;
  formatCost?: (amount: number) => string;
  title?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Agents working in a document like teammates in a multiplayer editor: live pointers, suggestions you accept or reject. */
export function AgentCursors({
  agents,
  blocks,
  suggestions = [],
  cursors = {},
  comments = [],
  onResolveComment,
  onAccept,
  onReject,
  onAcceptAll,
  following,
  defaultFollowing = null,
  onFollowingChange,
  height,
  formatCost,
  title = 'Untitled',
  className,
  xstyle,
  ref,
}: AgentCursorsProps) {
  const f = useFormatters();
  const pageRef = useRef<HTMLDivElement>(null);
  const width = useWidth(pageRef);
  const [follow, setFollow] = useControlled<string | null>(following, defaultFollowing, onFollowingChange);
  const [places, setPlaces] = useState<Record<string, Place>>({});
  const [msg, say] = useAnnouncer();
  const [ghosts, setGhosts] = useState<Record<string, { place: Place; ink?: string }>>({});
  const lastPlaces = useRef<Record<string, Place>>({});
  useEffect(() => {
    const prev = lastPlaces.current;
    lastPlaces.current = places;
    const gone = Object.keys(prev).filter((id) => !places[id]);
    if (!gone.length || prefersReducedMotion()) return;
    setGhosts((g) => ({ ...g, ...Object.fromEntries(gone.map((id) => [id, { place: prev[id]!, ink: agents.find((a) => a.id === id)?.color }])) }));
    const t = window.setTimeout(() => setGhosts((g) => Object.fromEntries(Object.entries(g).filter(([id]) => !gone.includes(id)))), 160);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places]);
  const agentOf = (id: string) => agents.find((a) => a.id === id);
  const cost = formatCost ?? ((n: number) => f.currency(n, 'USD', { minimumFractionDigits: 2 }));
  const total = agents.reduce((s, a) => s + (a.cost ?? 0), 0);
  const initialIds = useRef(new Set(suggestions.map((s) => s.id)));
  const seen = useRef<Set<string> | null>(null);
  const sugKey = suggestions.map((s) => s.id).join(',');
  useLayoutEffect(() => {
    if (seen.current === null) {
      seen.current = new Set(suggestions.map((s) => s.id));
      return;
    }
    for (const s of suggestions) {
      if (!seen.current.has(s.id)) {
        seen.current.add(s.id);
        say(`${agentOf(s.agent)?.name ?? 'An agent'} suggests ${describe(s)}${s.note ? `. ${s.note}` : ''}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sugKey]);

  const bySugg = useMemo(() => {
    const m = new Map<string, DocSuggestion[]>();
    for (const s of suggestions) (m.get(s.block) ?? m.set(s.block, []).get(s.block)!).push(s);
    m.forEach((l) => l.sort((a, b) => a.at - b.at));
    return m;
  }, [suggestions]);

  // Measure caret and selection geometry from the real text, so pointers stay on their letters while text wraps.
  const cursorKey = JSON.stringify(cursors);
  useLayoutEffect(() => {
    const page = pageRef.current;
    if (!page) return;
    const pr = page.getBoundingClientRect();
    const next: Record<string, Place> = {};
    for (const [id, c] of Object.entries(cursors)) {
      if (!c) continue;
      const host = page.querySelector<HTMLElement>(`[data-block="${CSS.escape(c.block)}"]`);
      if (!host) continue;
      const locate = (off: number): { node: Text; o: number } | null => {
        const spans = [...host.querySelectorAll<HTMLElement>('[data-start]')];
        for (const sp of spans) {
          const start = Number(sp.dataset.start);
          const len = sp.textContent?.length ?? 0;
          if (off >= start && off <= start + len && sp.firstChild?.nodeType === 3) return { node: sp.firstChild as Text, o: off - start };
        }
        const last = spans[spans.length - 1];
        return last?.firstChild ? { node: last.firstChild as Text, o: last.textContent?.length ?? 0 } : null;
      };
      const a = locate(c.at ?? 0);
      if (!a) continue;
      const r = document.createRange();
      r.setStart(a.node, a.o);
      r.setEnd(a.node, a.o);
      if (typeof r.getClientRects !== 'function') continue;
      const rect = r.getClientRects()[0] ?? host.getBoundingClientRect();
      const place: Place = { x: rect.left - pr.left, y: rect.top - pr.top, h: rect.height || 18, rects: [] };
      if (c.select) {
        const b = locate((c.at ?? 0) + c.select);
        if (b) {
          const r2 = document.createRange();
          r2.setStart(a.node, a.o);
          r2.setEnd(b.node, b.o);
          place.rects = [...r2.getClientRects()].map((q) => ({ x: q.left - pr.left, y: q.top - pr.top, w: q.width, h: q.height }));
        }
      }
      next[id] = place;
    }
    setPlaces((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursorKey, blocks, suggestions, width]);

  const renderText = (b: DocBlock): ReactNode => {
    const text = b.text ?? '';
    const list = bySugg.get(b.id) ?? [];
    const out: ReactNode[] = [];
    let pos = 0;
    for (const s of list) {
      if (s.at < pos) continue;
      if (s.at > pos) out.push(<span key={`t${pos}`} data-start={pos}>{text.slice(pos, s.at)}</span>);
      const ink = agentOf(s.agent)?.color;
      out.push(
        <DialogTrigger key={s.id}>
          <Button
            aria-label={`${agentOf(s.agent)?.name ?? 'Agent'} suggests ${describe(s)}`}
            style={ink ? { ['--ink' as string]: ink } : undefined}
            className={() => sxClass(stylex.props(styles.sugg, focus.ring))}
          >
            {s.remove ? <span {...stylex.props(styles.del)}>{text.slice(s.at, s.at + s.remove)}</span> : null}
            {s.insert ? <span {...stylex.props(styles.ins)}><TypedInsert text={s.insert} animate={!initialIds.current.has(s.id)} /></span> : null}
          </Button>
          <Popover placement="bottom start">
            <Dialog aria-label={`Suggestion from ${agentOf(s.agent)?.name ?? 'agent'}`} className={sxClass(stylex.props(w1.popover))}>
              {({ close }) => (
                <div {...stylex.props(styles.pop)}>
                  <span {...stylex.props(styles.who)}>{agentOf(s.agent)?.name} suggests {describe(s)}</span>
                  {s.note && <span>{s.note}</span>}
                  <div {...stylex.props(styles.btns)}>
                    <Button autoFocus onPress={() => { onAccept?.(s); close(); }} className={() => sxClass(stylex.props(styles.btn, styles.btnPrimary, focus.ring))}><Check size={13} aria-hidden="true" />Accept</Button>
                    <Button onPress={() => { onReject?.(s); close(); }} className={() => sxClass(stylex.props(styles.btn, focus.ring))}><X size={13} aria-hidden="true" />Reject</Button>
                  </div>
                </div>
              )}
            </Dialog>
          </Popover>
        </DialogTrigger>,
      );
      pos = s.at + (s.remove ?? 0);
    }
    if (pos < text.length || out.length === 0) out.push(<span key={`t${pos}`} data-start={pos}>{text.slice(pos)}</span>);
    return out;
  };

  const pins = (blockId: string) =>
    comments.filter((c) => c.block === blockId).map((c) => (
      <DialogTrigger key={c.id}>
        <Button aria-label={`Comment from ${agentOf(c.agent)?.name ?? 'agent'}`} className={() => sxClass(stylex.props(styles.pin, focus.ring))}>
          <MessageSquare size={11} aria-hidden="true" />
        </Button>
        <Popover placement="bottom start">
          <Dialog aria-label={`Comment from ${agentOf(c.agent)?.name ?? 'agent'}`} className={sxClass(stylex.props(w1.popover))}>
            {({ close }) => (
              <div {...stylex.props(styles.pop)}>
                <span {...stylex.props(styles.who)}>{agentOf(c.agent)?.name}</span>
                <span>{c.text}</span>
                {onResolveComment && (
                  <div {...stylex.props(styles.btns)}>
                    <Button autoFocus onPress={() => { onResolveComment(c); close(); }} className={() => sxClass(stylex.props(styles.btn, focus.ring))}><Check size={13} aria-hidden="true" />Resolve</Button>
                  </div>
                )}
              </div>
            )}
          </Dialog>
        </Popover>
      </DialogTrigger>
    ));

  const items = blocks.map((b) => b);
  const rendered: ReactNode[] = [];
  for (let i = 0; i < items.length; i++) {
    const b = items[i]!;
    const kind = b.kind ?? 'paragraph';
    if (kind === 'item') {
      const run: DocBlock[] = [];
      while (i < items.length && (items[i]!.kind ?? 'paragraph') === 'item') run.push(items[i++]!);
      i--;
      rendered.push(
        <ul key={`ul${run[0]!.id}`} {...stylex.props(styles.ul)}>
          {run.map((r) => <li key={r.id} data-block={r.id}>{renderText(r)}{pins(r.id)}</li>)}
        </ul>,
      );
    } else if (kind === 'image') {
      rendered.push(
        <figure key={b.id} data-block={b.id} {...stylex.props(styles.figure)}>
          {b.src && !b.loading ? (
            <img src={b.src} alt={b.alt ?? ''} style={{ ['--ratio' as string]: b.ratio ?? 1.6 }} {...stylex.props(styles.img, w1.fade)} />
          ) : (
            <div role="img" aria-label={b.alt ? `${b.alt} (loading)` : 'Image loading'} style={{ ['--ratio' as string]: b.ratio ?? 1.6 }} {...stylex.props(styles.img)}>
              <span aria-hidden="true" {...stylex.props(w1.sheen)} />
            </div>
          )}
          {b.text && <figcaption {...stylex.props(styles.caption)}>{b.text}</figcaption>}
        </figure>,
      );
    } else if (kind === 'code') {
      rendered.push(<pre key={b.id} data-block={b.id} {...stylex.props(styles.block, styles.code)}><code>{renderText(b)}</code></pre>);
    } else if (kind === 'title') {
      rendered.push(<h2 key={b.id} data-block={b.id} {...stylex.props(styles.block, styles.title)}>{renderText(b)}{pins(b.id)}</h2>);
    } else if (kind === 'heading') {
      rendered.push(<h3 key={b.id} data-block={b.id} {...stylex.props(styles.block, styles.heading)}>{renderText(b)}{pins(b.id)}</h3>);
    } else {
      rendered.push(<p key={b.id} data-block={b.id} {...stylex.props(styles.block)}>{renderText(b)}{pins(b.id)}</p>);
    }
  }

  const narrow = width > 0 && width < 520;
  return (
    <div
      {...mergeSx(stylex.props(w1.root, styles.root, xstyle), className)}
      ref={ref}
    >
      <div {...stylex.props(w1.bar)}>
        <h3 {...stylex.props(w1.title)}><span {...stylex.props(styles.crumb)}><FileText size={15} aria-hidden="true" />{title}</span></h3>
        <span {...stylex.props(w1.grow)} />
        <div role="group" aria-label="Agents in the document" {...stylex.props(styles.faces)}>
          {agents.map((a) => {
            const c = cursors[a.id];
            return (
              <ToggleButton
                key={a.id}
                aria-label={`${a.name}${c?.doing ? `, ${c.doing}` : c ? '' : ', away'}`}
                isSelected={follow === a.id}
                onChange={(sel) => setFollow(sel ? a.id : null)}
                className={() => sxClass(stylex.props(styles.face, focus.ring))}
              >
                {a.avatar ?? <AgentAvatar name={a.name} size={24} status={c ? 'working' : undefined} />}
              </ToggleButton>
            );
          })}
        </div>
        {!narrow && suggestions.length > 0 && <span {...stylex.props(w1.muted, w1.num)}>{f.plural(suggestions.length, { one: '# suggestion', other: '# suggestions' })}</span>}
        {onAcceptAll && suggestions.length > 1 && (
          <Button onPress={onAcceptAll} className={() => sxClass(stylex.props(styles.btn, styles.btnPrimary, focus.ring))}>Accept all</Button>
        )}
        {total > 0 && <span {...stylex.props(w1.muted, w1.num)}>{cost(total)}</span>}
      </div>
      <div
        ref={pageRef}
        {...mergeSx(stylex.props(styles.page), undefined, {
          ['--pad' as string]: narrow ? '14px' : '28px',
          ...(height ? { ['--ph' as string]: `${height}px` } : {}),
        })}
      >
        {rendered}
        <div aria-hidden="true" {...stylex.props(styles.layer)}>
          {Object.entries(ghosts).map(([id, g]) =>
            places[id] ? null : (
              <div key={`gone-${id}`} style={{ ...(g.ink ? { ['--ink' as string]: g.ink } : {}), ['--x' as string]: Math.round(g.place.x), ['--y' as string]: Math.round(g.place.y), ['--h' as string]: `${Math.round(g.place.h)}px` }} {...stylex.props(styles.pointer)}>
                <div {...stylex.props(styles.pointerGone)}>
                  <span {...stylex.props(styles.caret, styles.caretTyping)} style={{ display: 'block' }} />
                </div>
              </div>
            ),
          )}
          {Object.entries(places).map(([id, p]) => {
            const a = agentOf(id);
            const c = cursors[id];
            if (!a || !c) return null;
            const dim = follow && follow !== id ? '' : undefined;
            const ink = a.color ? { ['--ink' as string]: a.color } : {};
            return (
              <Fragment key={id}>
                {p.rects.map((r, i) => (
                  <span key={i} style={{ ...ink, left: r.x, top: r.y, width: r.w, height: r.h }} data-dim={dim} {...stylex.props(styles.sel)} />
                ))}
                <div data-dim={dim} data-typing={c.typing ? '' : undefined} style={{ ...ink, ['--x' as string]: Math.round(p.x), ['--y' as string]: Math.round(p.y), ['--h' as string]: `${Math.round(p.h)}px` }} {...stylex.props(styles.pointer)}>
                  <div {...stylex.props(styles.pointerInner)}>
                    <span {...stylex.props(styles.caret, c.typing && styles.caretTyping)} style={{ display: 'block' }} />
                    {dim === undefined && (
                      <>
                        <MousePointer2 size={16} aria-hidden="true" {...stylex.props(styles.arrow)} />
                        <span {...stylex.props(styles.flag)}>
                          <span {...stylex.props(styles.flagHead)}>
                            <span {...stylex.props(styles.flagName)}>{a.name}</span>
                            {a.cost != null && <span {...stylex.props(styles.flagCost)}>{cost(a.cost)}</span>}
                          </span>
                          {c.doing ? <span key={c.doing} {...stylex.props(styles.doing, styles.flagDoing)}>{c.doing}</span> : null}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </Fragment>
            );
          })}
        </div>
      </div>
      <LiveRegion message={msg} />
    </div>
  );
}

function describe(s: DocSuggestion): string {
  if (s.remove && s.insert) return `replacing text with: ${s.insert}`;
  if (s.insert) return `adding: ${s.insert}`;
  return 'removing text';
}

/** Writes a fresh suggestion in letter by letter (about a second at most); suggestions that were already there appear whole. */
function TypedInsert({ text, animate }: { text: string; animate: boolean }) {
  const [n, setN] = useState(() => (animate && !prefersReducedMotion() ? 0 : text.length));
  useEffect(() => {
    if (n >= text.length) return;
    const id = window.setTimeout(() => setN((v) => v + 1), Math.min(28, 1400 / Math.max(1, text.length)));
    return () => window.clearTimeout(id);
  }, [n, text]);
  return <>{text.slice(0, n)}</>;
}
