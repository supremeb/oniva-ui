import * as stylex from '@stylexjs/stylex';
import { ArrowRight, Lock, NotebookText, Redo2, Undo2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ReactNode, type Ref } from 'react';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { useFlip } from '../../internal/w1-flip';
import { prefersReducedMotion } from '../../internal/motion-hooks';
import { Button } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { mergeSx, sxClass } from '../../internal/sx';
import {
  LiveRegion,
  Tag,
  formatAgo,
  useAnnouncer,
  useControlled,
  useNow,
  useWidth,
  w1,
} from '../../internal/w1-agent-ui';

export interface LedgerEntry {
  id: string;
  action: string;
  target?: string;
  /** Name of the system that changed, e.g. "Billing". */
  system: string;
  icon?: ReactNode;
  /** Epoch ms. */
  at: number;
  /** `[before, after]`. */
  change?: [string, string];
  detail?: string;
  /** `false` for things that cannot be taken back (a sent email, a payout). */
  reversible?: boolean;
  /** Ids of the changes this one builds on. */
  dependsOn?: string[];
}

export interface UndoPlan {
  /** Entries that will be reverted, in order, including the one asked for. */
  ids: string[];
  /** Reversible dependents that go with it. */
  also: string[];
  /** Irreversible dependents that stay. */
  kept: string[];
}

function dependents(entries: LedgerEntry[], id: string): LedgerEntry[] {
  const out = new Map<string, LedgerEntry>();
  const visit = (x: string) => {
    for (const e of entries) {
      if (e.dependsOn?.includes(x) && !out.has(e.id)) {
        out.set(e.id, e);
        visit(e.id);
      }
    }
  };
  visit(id);
  return [...out.values()];
}

/** What undoing `id` would revert or leave behind. Entries already in `undone` are skipped. */
export function undoPlan(
  entries: LedgerEntry[],
  id: string,
  undone: readonly string[] = [],
): UndoPlan {
  const self = entries.find((e) => e.id === id);
  const deps = dependents(entries, id).filter((e) => !undone.includes(e.id));
  const also = deps.filter((e) => e.reversible !== false).map((e) => e.id);
  const kept = deps.filter((e) => e.reversible === false).map((e) => e.id);
  return { ids: self && self.reversible !== false ? [id, ...also] : [], also, kept };
}

/** Which undone entries a redo of `id` brings back: itself plus its undone reversible dependents. */
export function redoPlan(entries: LedgerEntry[], id: string, undone: readonly string[]): string[] {
  const deps = dependents(entries, id).filter(
    (e) => undone.includes(e.id) && e.reversible !== false,
  );
  return [id, ...deps.map((d) => d.id)];
}

const flagIn = stylex.keyframes({
  from: { filter: 'blur(2px)', opacity: 0, transform: 'scale(0.9)' },
  to: { filter: 'blur(0)', opacity: 1, transform: 'none' },
});

/** New changes open their slot (the panel grows) and the row fades in after. Rows present at first render appear at once. */
function OpenRow({ fresh, children }: { fresh: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(!fresh || prefersReducedMotion());
  useEffect(() => {
    if (open) return;
    const id = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(id);
  }, [open]);
  return <AnimatedHeight isOpen={open}>{children}</AnimatedHeight>;
}

const styles = stylex.create({
  root: { backgroundColor: 'transparent', borderWidth: 0, containerType: 'inline-size', maxWidth: 640, padding: 0 },
  titleRow: { alignItems: 'center', display: 'inline-flex', gap: 6 },
  titleIcon: { color: colors['--oniva-color-accent-text'], display: 'inline-flex' },
  card: { overflow: 'hidden' },
  agent: {
    color: colors['--oniva-color-text-muted'],
    fontWeight: font['--oniva-font-weight-regular'],
  },
  list: { display: 'flex', flexDirection: 'column', marginBottom: -1 },
  pad: { borderBottomColor: colors['--oniva-color-border'], borderBottomStyle: 'solid', borderBottomWidth: 1 },
  row: {
    alignItems: 'center',
    display: 'grid',
    gap: 12,
    gridTemplateColumns: 'auto minmax(0, 1fr) auto',
    minHeight: 58,
    paddingBlock: 10,
    paddingInline: 12,
    position: 'relative',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, border-color, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  narrow: { gridTemplateColumns: 'auto minmax(0, 1fr) auto' },
  self: { borderColor: colors['--oniva-color-border-active'] },
  also: { backgroundColor: colors['--oniva-color-info-bg'] },
  kept: { backgroundColor: colors['--oniva-color-warning-bg'] },
  undone: { backgroundColor: colors['--oniva-color-surface-inset'] },
  tile: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'opacity, filter',
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    display: 'inline-flex',
    fontWeight: font['--oniva-font-weight-semibold'],
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  main: { display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 },
  action: { fontWeight: font['--oniva-font-weight-medium'] },
  tileGone: { filter: 'grayscale(1)', opacity: 0.55 },
  struck: {
    backgroundImage: 'linear-gradient(currentColor, currentColor)',
    backgroundPosition: '0 55%',
    backgroundRepeat: 'no-repeat',
    backgroundSize: { default: '0% 1px', '[data-struck]': '100% 1px' },
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'background-size',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  target: { color: colors['--oniva-color-text-muted'] },
  change: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: font['--oniva-font-size-13'],
    gap: 6,
  },
  before: { textDecoration: 'line-through' },
  after: { color: colors['--oniva-color-text'] },
  slot: { alignItems: 'center', display: 'grid', justifyItems: 'end', minWidth: 76 },
  stack: { gridArea: '1 / 1' },
  time: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    opacity: { default: 1, ':is([data-row]:hover *)': 0, ':is([data-row]:focus-within *)': 0 },
  },
  actions: {
    alignItems: 'center',
    display: 'inline-flex',
    gap: 4,
    opacity: {
      default: 0,
      ':is([data-row]:hover *)': 1,
      ':is([data-row]:focus-within *)': 1,
      '@media (hover: none)': 1,
    },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'opacity',
  },
  hideTime: {
    opacity: {
      default: 1,
      ':is([data-row]:hover *)': 0,
      ':is([data-row]:focus-within *)': 0,
      '@media (hover: none)': 0,
    },
  },
  btn: {
    alignItems: 'center',
    backgroundColor: {
      default: colors['--oniva-color-surface-tertiary'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-tertiary-hover'] },
    },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 4,
    height: 26,
    justifyContent: 'center',
    paddingInline: 8,
  },
  btnIcon: { paddingInline: 0, width: 26 },
  flag: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationName: { default: flagIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    gridArea: '1 / 1',
  },
  empty: { color: colors['--oniva-color-text-muted'], padding: 12, textAlign: 'center' },
});

export interface AgentLedgerProps {
  entries: LedgerEntry[];
  /** Who made the changes. */
  agent?: string;
  /** Clock for "2m ago" (epoch ms). */
  now?: number;
  undone?: string[];
  defaultUndone?: string[];
  /** Ids to revert: the change and its reversible dependents. */
  onUndo?: (ids: string[]) => void;
  onRedo?: (ids: string[]) => void;
  /** Lights up a change and what builds on it, as if its Undo were pointed at. */
  pointAt?: string | null;
  title?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Everything an agent changed, with before/after, per-change undo and honest consequences. */
export function AgentLedger({
  entries,
  agent,
  now,
  undone,
  defaultUndone = [],
  onUndo,
  onRedo,
  pointAt,
  title = 'Ledger',
  className,
  xstyle,
  ref,
}: AgentLedgerProps) {
  const f = useFormatters();
  const t = useNow(now, true, 15000);
  const [gone, setGone] = useControlled<string[]>(undone, defaultUndone, undefined);
  const [hot, setHot] = useState<string | null>(null);
  const [msg, say] = useAnnouncer();
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  useFlip(listRef, 260);
  const initial = useRef<Set<string> | null>(null);
  if (initial.current === null) initial.current = new Set(entries.map((x) => x.id));
  const w = useWidth(rootRef);
  const narrow = w > 0 && w < 480;
  const sorted = useMemo(() => [...entries].sort((a, b) => b.at - a.at), [entries]);
  const point = pointAt ?? hot;
  const plan = point ? undoPlan(entries, point, gone) : null;

  const doUndo = (e: LedgerEntry) => {
    const p = undoPlan(entries, e.id, gone);
    if (!p.ids.length) return;
    setGone([...gone, ...p.ids]);
    onUndo?.(p.ids);
    say(
      `Undid ${e.action}${p.also.length ? ` and ${f.plural(p.also.length, { one: '# dependent change', other: '# dependent changes' })}` : ''}.`,
    );
  };
  const doRedo = (e: LedgerEntry) => {
    const ids = redoPlan(entries, e.id, gone);
    setGone(gone.filter((g) => !ids.includes(g)));
    onRedo?.(ids);
    say(`Redid ${e.action}.`);
  };

  return (
    <div
      {...mergeSx(stylex.props(w1.root, styles.root, xstyle), className)}
      ref={(el) => {
        rootRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) ref.current = el;
      }}
    >
      <div {...stylex.props(w1.bar)}>
        <h3 {...stylex.props(w1.title, styles.titleRow)}>
          <span aria-hidden="true" {...stylex.props(styles.titleIcon)}><NotebookText size={16} /></span>{' '}{title} {agent && <span {...stylex.props(styles.agent)}>· {agent}</span>}
        </h3>
        <span {...stylex.props(w1.grow)} />
        <span {...stylex.props(w1.muted, w1.num)}>
          {f.plural(entries.length, { one: '# change', other: '# changes' })}
        </span>
      </div>
      {sorted.length === 0 && <div {...stylex.props(styles.empty)}>No changes yet.</div>}
      <div {...stylex.props(w1.tile, styles.card)}>
      <ol ref={listRef} aria-label={title} {...stylex.props(w1.list, styles.list)}>
        {sorted.map((e) => {
          const isGone = gone.includes(e.id);
          const reversible = e.reversible !== false;
          const role = plan
            ? plan.ids[0] === e.id || point === e.id
              ? 'self'
              : plan.also.includes(e.id)
                ? 'also'
                : plan.kept.includes(e.id)
                  ? 'kept'
                  : null
            : null;
          const own = undoPlan(entries, e.id, gone);
          const label = `Undo ${e.action}${e.target ? ` ${e.target}` : ''}${own.also.length ? `, also undoes ${f.plural(own.also.length, { one: '# change', other: '# changes' })}` : ''}${own.kept.length ? `, ${own.kept.length} can't be undone` : ''}`;
          return (
            <li key={e.id} data-flip-id={e.id} data-state={isGone ? 'undone' : undefined}>
              <OpenRow fresh={!initial.current!.has(e.id)}>
                <div {...stylex.props(styles.pad)}>
                  <div
                    data-row=""
                    data-state={isGone ? 'undone' : undefined}
                    {...stylex.props(
                      styles.row,
                      narrow && styles.narrow,
                      role === 'self' && styles.self,
                      role === 'also' && styles.also,
                      role === 'kept' && styles.kept,
                      isGone && styles.undone,
                    )}
                  >
                    <span
                      aria-hidden="true"
                      {...stylex.props(styles.tile, isGone && styles.tileGone)}
                    >
                      {e.icon ?? e.system.slice(0, 1).toUpperCase()}
                    </span>
                    <div {...stylex.props(styles.main)}>
                      <div {...stylex.props(w1.ellipsis)}>
                        <span
                          data-struck={isGone ? '' : undefined}
                          style={{
                            transitionDelay: `${Math.min(Math.max(gone.indexOf(e.id), 0), 5) * 90}ms`,
                          }}
                          {...stylex.props(styles.action, styles.struck)}
                        >
                          {e.action}
                        </span>{' '}
                        {e.target && <span {...stylex.props(styles.target)}>{e.target}</span>}
                      </div>
                      {e.change ? (
                        <div {...stylex.props(styles.change, w1.num)}>
                          <span {...stylex.props(styles.before)}>{e.change[0]}</span>
                          <ArrowRight size={12} aria-hidden="true" />
                          <span className="sr-only" {...stylex.props(w1.srOnly)}>
                            to
                          </span>
                          <span {...stylex.props(styles.after)}>{e.change[1]}</span>
                        </div>
                      ) : (
                        e.detail && <div {...stylex.props(styles.change)}>{e.detail}</div>
                      )}
                    </div>
                    <div {...stylex.props(styles.slot)}>
                      {role === 'also' || role === 'kept' ? (
                        <span {...stylex.props(styles.flag)}>
                          {role === 'also' ? (
                            <Tag tone="info">Also undone</Tag>
                          ) : (
                            <Tag tone="warning" icon={<Lock size={10} aria-hidden="true" />}>
                              Can't undo
                            </Tag>
                          )}
                        </span>
                      ) : (
                        <>
                          <span
                            {...stylex.props(styles.stack, styles.time, w1.num, styles.hideTime)}
                          >
                            {formatAgo(t - e.at, f.locale)}
                            {narrow ? '' : ` · ${e.system}`}
                          </span>
                          <span {...stylex.props(styles.stack, styles.actions)}>
                            {isGone ? (
                              <Button
                                aria-label={`Redo ${e.action}`}
                                onPress={() => doRedo(e)}
                                className={() =>
                                  sxClass(
                                    stylex.props(styles.btn, narrow && styles.btnIcon, focus.ring),
                                  )
                                }
                              >
                                <Redo2 size={13} aria-hidden="true" />
                                {!narrow && 'Redo'}
                              </Button>
                            ) : reversible ? (
                              <Button
                                aria-label={label}
                                onPress={() => doUndo(e)}
                                onHoverStart={() => setHot(e.id)}
                                onHoverEnd={() => setHot(null)}
                                onFocusChange={(v) => setHot(v ? e.id : null)}
                                className={() =>
                                  sxClass(
                                    stylex.props(styles.btn, narrow && styles.btnIcon, focus.ring),
                                  )
                                }
                              >
                                <Undo2 size={13} aria-hidden="true" />
                                {!narrow && 'Undo'}
                              </Button>
                            ) : (
                              <Tag icon={<Lock size={10} aria-hidden="true" />}>Permanent</Tag>
                            )}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </OpenRow>
            </li>
          );
        })}
      </ol>
      </div>
      <LiveRegion message={msg} />
    </div>
  );
}
