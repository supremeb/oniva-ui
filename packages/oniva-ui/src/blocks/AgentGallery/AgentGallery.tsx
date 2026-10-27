import * as stylex from '@stylexjs/stylex';
import { ChevronLeft, ChevronRight, ChevronsUpDown, Plus, RefreshCw, ShieldCheck, Zap } from 'lucide-react';
import { useState } from 'react';
import type { HTMLAttributes, KeyboardEvent, Ref } from 'react';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { focus } from '../../internal/focus';
import { mergeSx } from '../../internal/sx';
import { w8 } from '../../internal/w8-styles';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const NARROW = '@container (max-width: 760px)';
const inFromRight = stylex.keyframes({ from: { opacity: 0, transform: 'translateX(28px)' }, to: { opacity: 1, transform: 'translateX(0)' } });
const inFromLeft = stylex.keyframes({ from: { opacity: 0, transform: 'translateX(-28px)' }, to: { opacity: 1, transform: 'translateX(0)' } });

const revealR = stylex.keyframes({ from: { clipPath: 'inset(0 0 0 14%)' }, to: { clipPath: 'inset(0 0 0 0)' } });
const revealL = stylex.keyframes({ from: { clipPath: 'inset(0 14% 0 0)' }, to: { clipPath: 'inset(0 0 0 0)' } });
const slimIn = stylex.keyframes({ from: { opacity: 0, transform: 'scaleX(0.7)' } });
const stepIn = stylex.keyframes({ from: { opacity: 0, transform: 'translateY(6px)' }, to: { opacity: 1, transform: 'translateY(0)' } });

const styles = stylex.create({
  head: { alignItems: 'center', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28, textAlign: 'center' },
  lead: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-14'], lineHeight: 1.5, margin: 0, maxWidth: 520 },
  heading: { fontSize: font['--oniva-font-size-24'], fontWeight: font['--oniva-font-weight-semibold'], letterSpacing: font['--oniva-font-track-hero'], lineHeight: 1.2, margin: 0 },
  stage: { alignItems: 'stretch', display: 'flex', gap: 10, height: 'var(--ag-height, 420px)', minWidth: 0, overflow: 'hidden' },
  far: { marginInline: -24 },
  slim: {
    appearance: 'none',
    borderWidth: 0,
    borderRadius: radius['--oniva-radius-xl'],
    boxSizing: 'border-box',
    cursor: 'pointer',
    flex: { default: '0 0 clamp(36px, 8cqi, 76px)', [NARROW]: '0 0 clamp(14px, 4cqi, 24px)' },
    opacity: { default: 0.85, ':hover': { default: null, [media.hover]: 1 } },
    overflow: 'hidden',
    padding: 0,
    position: 'relative',
    transitionDuration: motion['--oniva-motion-dur-base'],
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationName: { default: slimIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    transform: { default: 'scale(1)', ':active': 'scale(0.98)' },
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  revealR: { animationDuration: motion['--oniva-motion-dur-sheet'], animationName: { default: revealR, [media.reducedMotion]: 'none' }, animationTimingFunction: motion['--oniva-motion-ease-drawer'] },
  revealL: { animationDuration: motion['--oniva-motion-dur-sheet'], animationName: { default: revealL, [media.reducedMotion]: 'none' }, animationTimingFunction: motion['--oniva-motion-ease-drawer'] },
  stepRise: {
    animationDelay: 'calc(120ms + var(--i, 0) * 40ms)',
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: stepIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  slimLabel: {
    alignItems: 'center',
    display: { default: 'flex', [NARROW]: 'none' },
    fontSize: font['--oniva-font-size-16'],
    fontWeight: font['--oniva-font-weight-medium'],
    inset: 0,
    justifyContent: 'flex-start',
    paddingBlock: 16,
    position: 'absolute',
    transform: 'rotate(180deg)',
    whiteSpace: 'nowrap',
    writingMode: 'vertical-rl',
  },
  lc1: { color: colors['--oniva-color-chart-3'] },
  lc2: { color: colors['--oniva-color-chart-1'] },
  lc3: { color: colors['--oniva-color-chart-5'] },
  lc4: { color: colors['--oniva-color-chart-6'] },
  open: {
    borderRadius: radius['--oniva-radius-xl'],
    boxSizing: 'border-box',
    display: 'flex',
    flex: '1 1 0',
    flexDirection: 'column',
    minWidth: 0,
    overflow: 'hidden',
    paddingBlockStart: { default: 40, [NARROW]: 12 },
    paddingInline: { default: 40, [NARROW]: 12 },
    position: 'relative',
  },
  window: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderStartEndRadius: radius['--oniva-radius-xl'],
    borderStartStartRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    borderBottomWidth: 0,
    boxSizing: 'border-box',
    display: 'flex',
    flex: '1 1 0',
    flexDirection: 'column',
    minHeight: 0,
    minWidth: 0,
    overflow: 'hidden',
  },
  bar: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderBottomColor: colors['--oniva-color-border'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    display: 'flex',
    gap: 8,
    padding: 8,
  },
  logo: { backgroundColor: colors['--oniva-color-text'], borderRadius: radius['--oniva-radius-sm'], height: 14, width: 14 },
  pick: {
    alignItems: 'center',
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-11'],
    gap: 6,
    paddingBlock: 3,
    paddingInline: 6,
  },
  dotTile: { borderRadius: radius['--oniva-radius-sm'], height: 12, width: 12 },
  spacer: { flex: '1 1 0' },
  ghostBtn: {
    alignItems: 'center',
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    display: { default: 'inline-flex', [NARROW]: 'none' },
    fontSize: font['--oniva-font-size-11'],
    gap: 4,
    paddingBlock: 3,
    paddingInline: 8,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-full'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-11'],
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  body: { display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto', scrollbarWidth: 'none', padding: { default: '20px 28px 24px', [NARROW]: 14 } },
  agentHead: { alignItems: 'flex-start', display: 'flex', flexDirection: 'column', gap: 4 },
  tileLg: { borderRadius: radius['--oniva-radius-lg'], height: 32, width: 32, marginBottom: 4 },
  metaTop: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'flex', fontSize: font['--oniva-font-size-11'], gap: 4, justifyContent: 'flex-end', marginBottom: -28 },
  name: { fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-semibold'], margin: 0 },
  small: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], lineHeight: 1.45, margin: 0 },
  stats: { display: 'grid', gap: 16, gridTemplateColumns: { default: 'repeat(4, minmax(0, 1fr))', [NARROW]: 'repeat(2, minmax(0, 1fr))' }, margin: 0, paddingBlock: 4 },
  stat: { display: 'flex', flexDirection: 'column', gap: 2, margin: 0, minWidth: 0 },
  statLabel: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-11'] },
  statValue: { alignItems: 'center', display: 'flex', fontSize: font['--oniva-font-size-14'], fontVariantNumeric: 'tabular-nums', fontWeight: font['--oniva-font-weight-medium'], gap: 8, justifyContent: 'space-between' },
  spark: { color: colors['--oniva-color-chart-1'], flexShrink: 0, height: 14, width: 44 },
  sec: { borderTopColor: colors['--oniva-color-border'], borderTopStyle: 'solid', borderTopWidth: 1, display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 14 },
  secTitle: { fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-semibold'], margin: 0 },
  enterR: { animationDuration: motion['--oniva-motion-dur-slow'], animationName: { default: inFromRight, [media.reducedMotion]: 'none' }, animationTimingFunction: motion['--oniva-motion-ease-out'] },
  enterL: { animationDuration: motion['--oniva-motion-dur-slow'], animationName: { default: inFromLeft, [media.reducedMotion]: 'none' }, animationTimingFunction: motion['--oniva-motion-ease-out'] },
  steps: { counterReset: 'step', display: 'flex', flexDirection: 'column', gap: 6, listStyle: 'none', margin: 0, padding: 0 },
  step: { alignItems: 'center', display: 'flex', fontSize: font['--oniva-font-size-13'], gap: 10 },
  num: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-accent-soft'],
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-accent-soft-fg'],
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  trigger: { alignItems: 'center', display: 'inline-flex', gap: 6 },
  guard: { alignItems: 'center', borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-lg'], borderStyle: 'solid', borderWidth: 1, display: 'flex', fontSize: font['--oniva-font-size-12'], gap: 8, padding: 10 },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  nav: { alignItems: 'center', display: 'flex', gap: 8, justifyContent: 'space-between', marginTop: 12 },
  g1: { backgroundImage: `linear-gradient(180deg, ${colors['--oniva-color-chart-3']}, ${colors['--oniva-color-chart-6']})` },
  g2: { backgroundImage: `linear-gradient(180deg, ${colors['--oniva-color-chart-8']}, ${colors['--oniva-color-chart-5']})` },
  g3: { backgroundImage: `linear-gradient(180deg, ${colors['--oniva-color-chart-1']}, ${colors['--oniva-color-chart-4']})` },
  g4: { backgroundImage: `linear-gradient(180deg, ${colors['--oniva-color-chart-9']}, ${colors['--oniva-color-chart-5']})` },
  // Soft wash behind the open window and fading slim panels: tone fades into the page surface.
  w1: { backgroundImage: `linear-gradient(135deg, color-mix(in srgb, ${colors['--oniva-color-chart-3']} 34%, transparent), transparent 70%)` },
  w2: { backgroundImage: `linear-gradient(135deg, color-mix(in srgb, ${colors['--oniva-color-chart-8']} 38%, transparent), transparent 70%)` },
  w3: { backgroundImage: `linear-gradient(135deg, color-mix(in srgb, ${colors['--oniva-color-chart-1']} 34%, transparent), transparent 70%)` },
  w4: { backgroundImage: `linear-gradient(135deg, color-mix(in srgb, ${colors['--oniva-color-chart-9']} 34%, transparent), transparent 70%)` },
  f1: { backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${colors['--oniva-color-chart-3']} 36%, transparent), ${colors['--oniva-color-surface-inset']} 85%)` },
  f2: { backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${colors['--oniva-color-chart-8']} 40%, transparent), ${colors['--oniva-color-surface-inset']} 85%)` },
  f3: { backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${colors['--oniva-color-chart-1']} 36%, transparent), ${colors['--oniva-color-surface-inset']} 85%)` },
  f4: { backgroundImage: `linear-gradient(180deg, color-mix(in srgb, ${colors['--oniva-color-chart-9']} 36%, transparent), ${colors['--oniva-color-surface-inset']} 85%)` },
});
const GRADS = [styles.g1, styles.g2, styles.g3, styles.g4];
const WASH = [styles.w1, styles.w2, styles.w3, styles.w4];
const FADE = [styles.f1, styles.f2, styles.f3, styles.f4];
const LABEL = [styles.lc1, styles.lc2, styles.lc3, styles.lc4];
const STATS = [
  { label: 'Runs', value: '183', pts: '0,10 8,7 16,9 24,4 32,6 44,2' },
  { label: 'Success', value: '97%', pts: '0,9 8,6 16,7 24,3 32,5 44,2' },
  { label: 'Time saved', value: '3.3h', pts: '0,8 8,9 16,5 24,6 32,3 44,4' },
  { label: 'Escalated', value: '7', pts: '0,3 8,6 16,4 24,8 32,6 44,10' },
];

export interface GalleryItem {
  id: string;
  name: string;
  description: string;
  /** Gradient preset 0-3. Defaults to the item position. */
  tone?: 0 | 1 | 2 | 3;
  trigger: string;
  steps: string[];
  skills: string[];
  guardrail: string;
}

export const defaultGalleryItems: GalleryItem[] = [
  { id: 'recon', name: 'Reconciler', description: 'Matches payouts to invoices and flags the ones that do not add up.', trigger: 'Every weekday at 07:00', steps: ['Pull yesterday\'s payouts', 'Match against open invoices', 'Flag differences over $50', 'Post a summary for approval'], skills: ['Ledger', 'Warehouse'], guardrail: 'Never edits an invoice; proposes a credit note for a person to approve.' },
  { id: 'triage', name: 'Ticket triage', description: 'Reads new tickets, sets priority and attaches the run that failed.', trigger: 'When a ticket is created', steps: ['Classify the issue', 'Find the failing run', 'Attach a replay link', 'Assign by workload'], skills: ['Tickets', 'Docs'], guardrail: 'Replies stay in draft until an agent approves them.' },
  { id: 'brief', name: 'Weekly brief', description: 'Collects the week into a one-page summary for the leadership channel.', trigger: 'Fridays at 15:00', steps: ['Gather metrics', 'Summarize incidents', 'Draft highlights', 'Post to the channel'], skills: ['Docs', 'Team chat'], guardrail: 'Numbers are quoted from the warehouse only; no estimates.' },
  { id: 'renew', name: 'Renewal watch', description: 'Spots accounts nearing renewal and prepares the outreach.', trigger: '60 days before renewal', steps: ['List expiring accounts', 'Score health', 'Draft a check-in', 'Queue for review'], skills: ['CRM', 'Mail'], guardrail: 'Nothing is sent without a named owner approving it.' },
];

export interface AgentGalleryProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'title'> {
  title?: string;
  subtitle?: string;
  items?: GalleryItem[];
  /** Panel that starts open. Defaults to the middle item. */
  defaultIndex?: number;
  /** Height of the stage in px. Default `420`. */
  height?: number;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function AgentGallery({ title = 'Agents that fit your workflow', subtitle = 'Pick one to see what it does, when it runs and where it stops.', items = defaultGalleryItems, defaultIndex, height = 420, className, xstyle, ref, ...rest }: AgentGalleryProps) {
  const [index, setIndex] = useState(Math.min(items.length - 1, defaultIndex ?? Math.floor((items.length - 1) / 2)));
  const [dir, setDir] = useState<1 | -1>(1);
  const go = (i: number) => {
    const n = (i + items.length) % items.length;
    if (n === index) return;
    setDir(n > index ? 1 : -1);
    setIndex(n);
  };
  const item = items[index];
  if (!item) return null;
  const onKey = (e: KeyboardEvent) => {
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    if (e.key === 'ArrowRight') go(index + (rtl ? -1 : 1));
    else if (e.key === 'ArrowLeft') go(index + (rtl ? 1 : -1));
    else return;
    e.preventDefault();
  };
  const vars = { '--ag-height': `${height}px` } as React.CSSProperties;
  const sx = stylex.props(w8.root, xstyle);
  const slim = (i: number, far: boolean) => (
    <button key={items[i]!.id} type="button" aria-label={`Show ${items[i]!.name}`} onClick={() => go(i)} {...stylex.props(styles.slim, FADE[(items[i]!.tone ?? i % 4)], far && styles.far, focus.ring)}>
      <span aria-hidden="true" {...stylex.props(styles.slimLabel, LABEL[(items[i]!.tone ?? i % 4)])}>
        {items[i]!.name}
      </span>
    </button>
  );
  const tone = item.tone ?? index % 4;
  const left = items.slice(Math.max(0, index - 2), index);
  const right = items.slice(index + 1, index + 3);
  return (
    <section ref={ref} aria-roledescription="carousel" aria-label={title} {...rest} {...mergeSx(sx, className)}>
      <div {...stylex.props(styles.head)}>
        <h2 {...stylex.props(styles.heading)}>{title}</h2>
        <p {...stylex.props(styles.lead)}>{subtitle}</p>
      </div>
      <div role="group" aria-label="Agents" onKeyDown={onKey} {...mergeSx(stylex.props(styles.stage), undefined, vars)}>
        {left.map((_, k) => slim(Math.max(0, index - 2) + k, left.length === 2 && k === 0))}
        <article key={item.id} aria-roledescription="slide" aria-label={`${index + 1} of ${items.length}: ${item.name}`} {...stylex.props(styles.open, WASH[tone], dir > 0 ? styles.revealR : styles.revealL)}>
          <div {...stylex.props(styles.window)}>
            <div aria-hidden="true" {...stylex.props(styles.bar)}>
              <span {...stylex.props(styles.logo)} />
              <span {...stylex.props(styles.pick)}>
                <span {...stylex.props(styles.dotTile, GRADS[tone])} />
                {item.name}
                <ChevronsUpDown size={10} />
              </span>
              <span {...stylex.props(styles.spacer)} />
              <span {...stylex.props(styles.ghostBtn)}>
                <Plus size={10} />
                New agent
              </span>
              <span {...stylex.props(styles.avatar)}>LH</span>
            </div>
            <div {...stylex.props(styles.body, dir > 0 ? styles.enterR : styles.enterL)}>
              <div aria-hidden="true" {...stylex.props(styles.metaTop)}>
                3m ago
                <RefreshCw size={10} />
              </div>
              <div {...stylex.props(styles.agentHead)}>
                <span aria-hidden="true" {...stylex.props(styles.tileLg, GRADS[tone])} />
                <h3 {...stylex.props(styles.name)}>{item.name}</h3>
                <p {...stylex.props(styles.small)}>{item.description}</p>
              </div>
              <dl {...stylex.props(styles.stats)}>
                {STATS.map((st) => (
                  <div key={st.label} {...stylex.props(styles.stat)}>
                    <dt {...stylex.props(styles.statLabel)}>{st.label}</dt>
                    <dd {...stylex.props(styles.statValue)} style={{ margin: 0 }}>
                      {st.value}
                      <svg aria-hidden="true" viewBox="0 0 44 12" {...stylex.props(styles.spark)}>
                        <polyline points={st.pts} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </dd>
                  </div>
                ))}
              </dl>
              <div {...stylex.props(styles.sec)}>
                <h4 {...stylex.props(styles.secTitle)}>How it runs</h4>
                <span {...stylex.props(styles.trigger, styles.small)}>
                  <Zap size={13} aria-hidden="true" />
                  {item.trigger}
                </span>
                <ol {...stylex.props(styles.steps)}>
                  {item.steps.map((st, i) => (
                    <li key={st} style={{ '--i': Math.min(i, 5) } as React.CSSProperties} {...stylex.props(styles.step, styles.stepRise)}>
                      <span {...stylex.props(styles.num)} aria-hidden="true">{i + 1}</span>
                      {st}
                    </li>
                  ))}
                </ol>
                <div {...stylex.props(styles.chips)}>
                  {item.skills.map((sk) => (
                    <Badge key={sk} variant="neutral">{sk}</Badge>
                  ))}
                </div>
                <div {...stylex.props(styles.guard)}>
                  <ShieldCheck size={14} aria-hidden="true" />
                  <span>{item.guardrail}</span>
                </div>
              </div>
            </div>
          </div>
        </article>
        {right.map((_, k) => slim(index + 1 + k, right.length === 2 && k === 1))}
      </div>
      <div {...stylex.props(styles.nav)}>
        <Button size="sm" variant="secondary" isIconOnly aria-label="Previous agent" onPress={() => go(index - 1)}>
          <ChevronLeft size={16} aria-hidden="true" />
        </Button>
        <p role="status" aria-live="polite" {...stylex.props(w8.muted, w8.num)}>
          {item.name}, {index + 1} of {items.length}
        </p>
        <Button size="sm" variant="secondary" isIconOnly aria-label="Next agent" onPress={() => go(index + 1)}>
          <ChevronRight size={16} aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}
