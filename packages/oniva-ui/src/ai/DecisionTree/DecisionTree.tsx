import * as stylex from '@stylexjs/stylex';
import { ChevronLeft, ChevronRight, GitBranch, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { focus } from '../../internal/focus';
import { mergeSx } from '../../internal/sx';
import { Announcer, FlaggedSpans, flagIds, useAnnouncer, type FlaggedText, w2s } from '../../internal/w2-parts';
import { IconButton } from '../../components/IconButton';
import { Kbd } from '../../components/Kbd';

const WIDE = '@container (min-width: 640px)';

const grow = stylex.keyframes({
  from: { opacity: 0, transform: `translateY(${motion['--oniva-motion-travel']})` },
  to: { opacity: 1, transform: 'translateY(0)' },
});
const draw = stylex.keyframes({ from: { transform: 'scaleX(0)' }, to: { transform: 'scaleX(1)' } });

const styles = stylex.create({
  root: { containerType: 'inline-size', fontFamily: font['--oniva-font-sans'], overflow: 'hidden', width: '100%' },
  bar: { alignItems: 'center', borderBottomColor: colors['--oniva-color-border'], borderBottomStyle: 'solid', borderBottomWidth: 1, display: 'flex', gap: 8, paddingBlock: 8, paddingInline: 14 },
  title: { alignItems: 'center', color: colors['--oniva-color-text'], display: 'inline-flex', fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-semibold'], gap: 6, margin: 0 },
  count: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums' },
  waiting: { color: colors['--oniva-color-text-muted'], flexGrow: 1, fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-regular'] },
  dots: { alignItems: 'center', display: 'inline-flex', gap: 3 },
  dot: { backgroundColor: colors['--oniva-color-border-control'], borderRadius: radius['--oniva-radius-full'], height: 5, transitionDuration: motion['--oniva-motion-dur-base'], transitionProperty: 'width, background-color', width: 5 },
  dotOn: { backgroundColor: colors['--oniva-color-text'], width: 10 },
  qcard: { backgroundColor: colors['--oniva-color-surface-inner'], borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-lg'], borderStyle: 'solid', borderWidth: 1, display: 'flex', flexDirection: 'column', gap: 8, padding: 12 },
  agentTile: { alignItems: 'center', backgroundColor: colors['--oniva-color-surface-inset'], borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-md'], borderStyle: 'solid', borderWidth: 1, color: colors['--oniva-color-text-muted'], display: 'flex', flexShrink: 0, height: 32, justifyContent: 'center', width: 32 },
  agentRow: { alignItems: 'center', display: 'flex', gap: 8 },
  agentNames: { display: 'flex', flexDirection: 'column', minWidth: 0 },
  agentName: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-medium'] },
  agentModel: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
  riskRow: { display: 'flex' },
  labelCol: { display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 2, minWidth: 0 },
  pickLine: { alignItems: 'center', color: colors['--oniva-color-accent-text'], display: 'inline-flex', fontSize: font['--oniva-font-size-12'], fontWeight: font['--oniva-font-weight-regular'], gap: 4 },
  footer: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'flex', flexWrap: 'wrap', fontSize: font['--oniva-font-size-12'], gap: 6, paddingBlockEnd: 12, paddingInline: 14 },
  body: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: grow, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    columnGap: 0,
    display: 'grid',
    gridTemplateColumns: { default: 'minmax(0, 1fr)', [WIDE]: 'minmax(0, 0.9fr) minmax(0, 2.1fr)' },
    padding: 14,
    rowGap: 12,
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: 'opacity, transform, filter',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  bodyLeaving: { filter: 'blur(2px)', opacity: 0, transform: 'translateY(-4px)' },
  stage: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: grow, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  q: { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0, paddingInlineEnd: { default: 0, [WIDE]: 16 } },
  question: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-16'], fontWeight: font['--oniva-font-weight-semibold'], lineHeight: font['--oniva-font-lh-20'], margin: 0 },
  context: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], lineHeight: font['--oniva-font-lh-18'], margin: 0 },
  branches: {
    borderInlineStartColor: colors['--oniva-color-border-control'],
    borderInlineStartStyle: 'solid',
    borderInlineStartWidth: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    listStyle: 'none',
    margin: 0,
    paddingBlock: 0,
    paddingInline: 0,
  },
  branch: {
    alignItems: 'start',
    columnGap: 12,
    display: 'grid',
    gridTemplateColumns: { default: 'minmax(0, 1fr)', [WIDE]: 'minmax(0, 1fr) minmax(0, 1.2fr)' },
    opacity: 1,
    paddingInlineStart: 14,
    position: 'relative',
    rowGap: 6,
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  branchFaded: { opacity: 0.35 },
  branchHot: { transform: 'translateX(2px)' },
  tick: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: draw, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundColor: colors['--oniva-color-border-control'],
    height: 2,
    insetInlineStart: 0,
    position: 'absolute',
    top: 18,
    transformOrigin: 'left center',
    width: 12,
  },
  tickHot: { backgroundColor: colors['--oniva-color-accent-text'] },
  btn: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: colors['--oniva-color-surface-inner'], ':hover': colors['--oniva-color-surface-hover'] },
    borderColor: { default: colors['--oniva-color-border'], ':hover': colors['--oniva-color-border-hover'] },
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 8,
    minHeight: { default: 36, '@media (pointer: coarse)': 44 },
    paddingBlock: 6,
    paddingInline: 10,
    textAlign: 'start',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, border-color, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '100%',
  },
  btnPick: { backgroundColor: colors['--oniva-color-accent-soft'], borderColor: colors['--oniva-color-border-active'] },
  btnChosen: { backgroundColor: colors['--oniva-color-accent-soft'], borderColor: colors['--oniva-color-border-active'] },
  key: { display: { default: 'inline-flex', '@media (pointer: coarse)': 'none' }, flexShrink: 0 },
  label: { flexGrow: 1, minWidth: 0 },
  effects: { color: colors['--oniva-color-text-muted'], display: 'flex', flexDirection: 'column', fontSize: font['--oniva-font-size-12'], gap: 3, lineHeight: font['--oniva-font-lh-16'], listStyle: 'none', margin: 0, minWidth: 0, padding: 0 },
  effect: { alignItems: 'flex-start', display: 'flex', gap: 6 },
  bullet: { backgroundColor: colors['--oniva-color-border-control'], borderRadius: radius['--oniva-radius-full'], flexShrink: 0, height: 4, marginBlockStart: 6, width: 4 },
  other: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: { default: colors['--oniva-color-border-control'], ':focus': colors['--oniva-color-text'] },
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-13'],
    minHeight: 56,
    outlineStyle: 'none',
    overflowY: 'auto',
    padding: 8,
    resize: 'none',
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: 'height, border-color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '100%',
  },
  outcome: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: grow, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    alignItems: 'center', color: colors['--oniva-color-text'], display: 'flex', fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-medium'], gap: 6, paddingInlineStart: 14 },
  answer: {
    animationDelay: '120ms',
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: grow, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], lineHeight: font['--oniva-font-lh-18'], margin: 0, paddingInlineStart: 14 },
  empty: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], padding: 24, textAlign: 'center' },
});

export type DecisionRisk = 'high' | 'medium' | 'low';

export interface DecisionOption {
  label: string;
  /** What the branch leads to, one line each. Parts can be flagged with a note. */
  effects?: FlaggedText[];
  /** The agent's own preference. Mark at most one. */
  pick?: boolean;
}

export interface Decision {
  id: string;
  question: string;
  context?: string;
  agent: string;
  model?: string;
  icon?: ReactNode;
  risk?: DecisionRisk;
  /** Two to four options. */
  options: DecisionOption[];
}

export type DecisionChoice = { index: number; option: DecisionOption } | { other: string };

export interface DecisionTreeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children' | 'title'> {
  decisions: Decision[];
  /** A branch was picked, or an instruction written (`{ other }`). For an instruction, return the agent's short answer. */
  onChoose?: (decision: Decision, choice: DecisionChoice) => string | void | Promise<string | void>;
  /** Show the "Other…" branch for your own instruction. */
  allowOther?: boolean;
  title?: string;
  /** How long a picked path stays on screen before the next decision grows. */
  settleMs?: number;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

type Picked = { id: string; label: string; answer?: string };

/** An agent stuck on a decision lays out its options as a tree with consequences, marks the risky parts and its own pick; you choose a path or write your own. */
export function DecisionTree({ decisions, onChoose, allowOther = true, title = 'Decisions', settleMs = 1200, className, xstyle, ref, onKeyDown, ...rest }: DecisionTreeProps) {
  const [done, setDone] = useState<string[]>([]);
  const [view, setView] = useState(0);
  const [picked, setPicked] = useState<Picked | null>(null);
  const [hot, setHot] = useState<number | null>(null);
  const [otherOpen, setOtherOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [flag, setFlag] = useState<string | null>(null);
  const [leaving, setLeaving] = useState(false);
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const { message, announce } = useAnnouncer();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const pending = decisions.filter((d) => !done.includes(d.id));
  const idx = Math.min(view, Math.max(0, pending.length - 1));
  const d = pending[idx];

  const settle = (dec: Decision, label: string, answer?: string) => {
    setPicked({ id: dec.id, label, answer });
    announce(answer ? `Instruction sent. Agent: ${answer}` : `Chosen: ${label}`);
    const finish = () => {
      setDone((x) => [...x, dec.id]);
      setPicked(null);
      setOtherOpen(false);
      setDraft('');
      setHot(null);
      setLeaving(false);
    };
    const quiet = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    timer.current = window.setTimeout(() => {
      if (quiet) return finish();
      setLeaving(true);
      timer.current = window.setTimeout(finish, 200);
    }, settleMs);
  };
  const choose = async (dec: Decision, i: number) => {
    if (picked) return;
    const option = dec.options[i]!;
    setPicked({ id: dec.id, label: option.label });
    window.clearTimeout(timer.current);
    await onChoose?.(dec, { index: i, option });
    settle(dec, option.label);
  };
  const send = async (dec: Decision) => {
    const text = draft.trim();
    if (!text || picked) return;
    setPicked({ id: dec.id, label: 'Instruction' });
    const answer = await onChoose?.(dec, { other: text });
    settle(dec, 'Your instruction', typeof answer === 'string' ? answer : undefined);
  };
  const move = (delta: number) => {
    if (picked || !pending.length) return;
    setView((idx + delta + pending.length) % pending.length);
    setOtherOpen(false);
    setFlag(null);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || !d) return;
    const t = e.target as HTMLElement;
    if (t.tagName === 'TEXTAREA') return;
    if (e.key === 'Escape') {
      if (flag) setFlag(null);
      else setOtherOpen(false);
    } else if (/^[1-4]$/.test(e.key) && !e.metaKey && !e.ctrlKey) {
      const n = Number(e.key) - 1;
      if (n < d.options.length) void choose(d, n);
      else if (allowOther && n === d.options.length) setOtherOpen(true);
    } else if (e.key === 'ArrowRight' || e.key === 'j' || e.key === 'J') move(1);
    else if (e.key === 'ArrowLeft' || e.key === 'k' || e.key === 'K') move(-1);
    else if (e.key === 'f' || e.key === 'F') {
      const ids = flagIds(rootRef.current);
      if (ids.length) setFlag(ids[(flag ? ids.indexOf(flag) + 1 : 0) % ids.length] ?? null);
    }
  };

  const sx = stylex.props(aiStyles.panel, styles.root, xstyle);
  const setRefs = (el: HTMLDivElement | null) => {
    rootRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) (ref as { current: HTMLDivElement | null }).current = el;
  };

  return (
    <div {...rest} ref={setRefs} onKeyDown={onKey} {...mergeSx(sx, className)}>
      <div {...stylex.props(styles.bar)}>
        <h4 {...stylex.props(styles.title)}>
          <GitBranch size={14} aria-hidden="true" /> {title}
        </h4>
        {pending.length > 0 && <span {...stylex.props(styles.waiting)}>{pending.length} waiting for you</span>}
        {pending.length > 1 && (
          <>
            <span aria-hidden="true" {...stylex.props(styles.dots)}>
              {pending.map((p, k) => <span key={p.id} {...stylex.props(styles.dot, k === idx && styles.dotOn)} />)}
            </span>
            <IconButton size="sm" variant="ghost" aria-label="Previous decision" aria-keyshortcuts="ArrowLeft K" onPress={() => move(-1)}>
              <ChevronLeft size={14} aria-hidden="true" />
            </IconButton>
            <span {...stylex.props(styles.count)}>{idx + 1} of {pending.length}</span>
            <IconButton size="sm" variant="ghost" aria-label="Next decision" aria-keyshortcuts="ArrowRight J" onPress={() => move(1)}>
              <ChevronRight size={14} aria-hidden="true" />
            </IconButton>
          </>
        )}
      </div>
      {!d ? (
        <p {...stylex.props(styles.empty)}>No decisions waiting.</p>
      ) : (
        <div key={d.id} {...stylex.props(styles.body, leaving && styles.bodyLeaving)}>
          <div {...stylex.props(styles.q, styles.stage)}>
            {(d.risk === 'high' || d.risk === 'medium') && (
              <div {...stylex.props(styles.riskRow)}>
                <span {...stylex.props(w2s.tag, d.risk === 'high' ? w2s.tagDanger : w2s.tagWarning)}>{d.risk === 'high' ? 'High risk' : 'Medium risk'}</span>
              </div>
            )}
            <div {...stylex.props(styles.qcard)}>
              <div {...stylex.props(styles.agentRow)}>
                <span aria-hidden="true" {...stylex.props(styles.agentTile)}>{d.icon ?? <Sparkles size={14} />}</span>
                <span {...stylex.props(styles.agentNames)}>
                  <span {...stylex.props(styles.agentName)}>{d.agent}</span>
                  {d.model && <span {...stylex.props(styles.agentModel)}>{d.model}</span>}
                </span>
              </div>
              <h5 {...stylex.props(styles.question)}>{d.question}</h5>
              {d.context && <p {...stylex.props(styles.context)}>{d.context}</p>}
            </div>
          </div>
          <ul aria-label={`Ways to proceed: ${d.question}`} {...stylex.props(styles.branches)}>
            {d.options.map((o, i) => {
              const chosen = picked?.label === o.label && !picked.answer;
              const fade = (picked && !chosen) || (hot !== null && hot !== i && !picked);
              return (
                <li key={o.label} data-hot={hot === i ? '' : undefined} style={{ animationDelay: `${100 + i * 70}ms` }} {...stylex.props(styles.branch, styles.stage, fade && styles.branchFaded, hot === i && !picked && styles.branchHot)} onMouseEnter={() => setHot(i)} onMouseLeave={() => setHot(null)}>
                  <span aria-hidden="true" style={{ animationDelay: `${160 + i * 70}ms` }} {...stylex.props(styles.tick, (hot === i || chosen) && styles.tickHot)} />
                  <div>
                    <button
                      type="button"
                      disabled={!!picked}
                      aria-keyshortcuts={String(i + 1)}
                      aria-label={`${o.label}${o.pick ? ", the agent's pick" : ''}`}
                      onClick={() => void choose(d, i)}
                      {...stylex.props(styles.btn, focus.ring, o.pick && styles.btnPick, chosen && styles.btnChosen)}
                    >
                      <Kbd size="sm" aria-hidden="true" xstyle={styles.key}>{i + 1}</Kbd>
                      <span aria-hidden="true" {...stylex.props(styles.labelCol)}>
                        <span>{o.label}</span>
                        {o.pick && <span {...stylex.props(styles.pickLine)}>Agent's pick</span>}
                      </span>
                    </button>
                  </div>
                  {o.effects && o.effects.length > 0 && (
                    <ul {...stylex.props(styles.effects)}>
                      {o.effects.map((e, k) => (
                        <li key={k} style={{ animationDelay: `${240 + i * 70 + k * 60}ms` }} {...stylex.props(styles.effect, styles.stage)}>
                          <span aria-hidden="true" {...stylex.props(styles.bullet)} />
                          <span>
                            <FlaggedSpans value={e} idBase={`${d.id}-${i}-${k}`} openId={flag} onOpenChange={setFlag} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
            {allowOther && (
              <li style={{ animationDelay: `${100 + d.options.length * 70}ms` }} {...stylex.props(styles.branch, styles.stage, picked && picked.label !== 'Your instruction' && picked.label !== 'Instruction' && styles.branchFaded)}>
                <span aria-hidden="true" {...stylex.props(styles.tick)} />
                <div>
                  {otherOpen ? (
                    <textarea
                      autoFocus
                      ref={taRef}
                      aria-label="Your instruction"
                      rows={2}
                      value={draft}
                      placeholder="Tell the agent what to do instead"
                      disabled={!!picked}
                      onChange={(e) => {
                        const t = e.target;
                        setDraft(t.value);
                        // glide taller up to three lines (height eased by transition; scrollHeight measured from a collapsed box)
                        const before = t.offsetHeight;
                        t.style.height = '0px';
                        const next = Math.min(Math.max(56, t.scrollHeight + 2), 76);
                        t.style.height = `${before}px`;
                        void t.offsetHeight;
                        t.style.height = `${next}px`;
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          e.stopPropagation();
                          setOtherOpen(false);
                        } else if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          void send(d);
                        }
                      }}
                      {...stylex.props(styles.other)}
                    />
                  ) : (
                    <button type="button" disabled={!!picked} aria-keyshortcuts={String(d.options.length + 1)} onClick={() => setOtherOpen(true)} {...stylex.props(styles.btn, focus.ring)}>
                      <Kbd size="sm" aria-hidden="true" xstyle={styles.key}>{d.options.length + 1}</Kbd>
                      <span {...stylex.props(styles.label)}>Other…</span>
                    </button>
                  )}
                </div>
                {picked?.answer && <p {...stylex.props(styles.answer)}>{picked.answer}</p>}
              </li>
            )}
          </ul>
          {picked && (
            <p role="presentation" {...stylex.props(styles.outcome)}>
              {picked.answer ? picked.answer : `${picked.label} · running`}
            </p>
          )}
        </div>
      )}
      {d && (
        <p aria-hidden="true" {...stylex.props(styles.footer)}>
          Pick a branch <Kbd size="sm">1</Kbd>–<Kbd size="sm">{d.options.length + (allowOther ? 1 : 0)}</Kbd>
          {pending.length > 1 && <> · next <Kbd size="sm">→</Kbd></>}
        </p>
      )}
      <Announcer message={message} />
    </div>
  );
}
