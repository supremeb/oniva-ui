import * as stylex from '@stylexjs/stylex';
import { AlertTriangle, Lock, LockOpen, ShieldAlert, Sparkles } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type Ref } from 'react';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { useFlip } from '../../internal/w1-flip';
import { Radio, RadioGroup, Text, ToggleButton } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { mergeSx, sxClass } from '../../internal/sx';
import { LiveRegion, Tag, useAnnouncer, useControlled, w1 } from '../../internal/w1-agent-ui';

export type AutonomyLevel = 0 | 1 | 2;
export type ActionRisk = 'safe' | 'risky' | 'destructive';

export interface AgentAction {
  id: string;
  label: string;
  detail?: string;
  risk: ActionRisk;
  icon?: ReactNode;
}

/** The single rule for "does this action ask first?". Use the same function when the agent runs. */
export function asksFirst(action: Pick<AgentAction, 'id' | 'risk'>, level: AutonomyLevel, pinned: readonly string[] = []): boolean {
  if (pinned.includes(action.id)) return true;
  if (level === 0) return true;
  if (level === 1) return action.risk !== 'safe';
  return false;
}

const LEVELS: { level: AutonomyLevel; label: string; hint: string }[] = [
  { level: 0, label: 'Always ask', hint: 'Asks before every action.' },
  { level: 1, label: 'If risky', hint: 'Runs safe actions on its own and asks before risky ones.' },
  { level: 2, label: 'Full auto', hint: 'Runs everything on its own except locked actions.' },
];

const styles = stylex.create({
  root: { containerType: 'inline-size', maxWidth: 600, padding: 0, gap: 0 },
  head: { alignItems: 'flex-start', display: 'flex', gap: 10, paddingBlock: '16px 12px', paddingInline: 24 },
  headIcon: { color: colors['--oniva-color-accent-text'], flexShrink: 0, marginBlockStart: 2 },
  top: { display: 'flex', flexDirection: 'column', paddingBlockEnd: 16, paddingInline: 24 },
  lists: { borderColor: colors['--oniva-color-border'], borderStyle: 'solid', borderWidth: 0, borderBlockStartWidth: 1, display: 'flex', flexDirection: 'column', gap: 12, paddingBlock: '12px 16px', paddingInline: 24 },
  hidden: { borderWidth: 0, clipPath: 'inset(50%)', height: 1, margin: -1, overflow: 'hidden', padding: 0, position: 'absolute', whiteSpace: 'nowrap', width: 1 },
  sub: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-14'], margin: 0 },
  dial: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: 'repeat(3, 1fr)',
    padding: 0,
    position: 'relative',
  },
  radio: {
    alignItems: 'center',
    position: 'relative',
    zIndex: 1,
    backgroundColor: { default: colors['--oniva-color-surface-tertiary'], '[data-selected]': 'transparent' },
    borderRadius: radius['--oniva-radius-md'],
    color: { default: colors['--oniva-color-text-muted'], '[data-selected]': colors['--oniva-color-text'] },
    cursor: 'pointer',
    display: 'flex',
    fontWeight: font['--oniva-font-weight-medium'],
    justifyContent: 'center',
    minHeight: 36,
    paddingInline: 6,
    textAlign: 'center',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'color',
    transitionTimingFunction: motion['--oniva-motion-ease-in-out'],
  },
  pill: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border-hover'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'transform, width, height',
    transitionTimingFunction: motion['--oniva-motion-ease-in-out'],
  },
  pillStill: { transitionDuration: '0ms' },
  desc: { margin: 0 },
  group: { display: 'flex', flexDirection: 'column', gap: 4 },
  groupHead: { alignItems: 'center', display: 'flex', gap: 8 },
  count: { backgroundColor: colors['--oniva-color-surface-tertiary'], borderRadius: radius['--oniva-radius-sm'], fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums', minWidth: 20, paddingInline: 6, textAlign: 'center' },
  label: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-14'] },
  name: { fontSize: font['--oniva-font-size-14'] },
  item: {
    alignItems: 'center',
    display: 'flex',
    gap: 10,
    minHeight: 44,
    paddingInline: 0,
  },
  icon: { alignItems: 'center', color: colors['--oniva-color-icon-muted'], display: 'inline-flex', flexShrink: 0, justifyContent: 'center', width: 24 },
  text: { alignItems: 'center', display: 'flex', flexGrow: 1, flexWrap: 'wrap', gap: 4, minWidth: 0 },
  detail: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
  lock: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      '[data-selected]': colors['--oniva-color-accent-soft'],
    },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: { default: colors['--oniva-color-icon-muted'], '[data-selected]': colors['--oniva-color-accent-soft-fg'] },
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    height: 28,
    justifyContent: 'center',
    opacity: { default: 0.45, ':hover': 1, '[data-selected]': 1, ':focus-visible': 1 },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, color, opacity',
    width: 28,
  },
  empty: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
});

export interface AutonomyDialProps {
  actions: AgentAction[];
  level?: AutonomyLevel;
  defaultLevel?: AutonomyLevel;
  onLevelChange?: (level: AutonomyLevel) => void;
  /** Ids of actions that always ask, whatever the level. */
  pinned?: string[];
  defaultPinned?: string[];
  onPinnedChange?: (pinned: string[]) => void;
  title?: string;
  subtitle?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Three-stop autonomy setting that shows which real actions run on their own and which ask first. */
export function AutonomyDial({
  actions,
  level,
  defaultLevel = 1,
  onLevelChange,
  pinned,
  defaultPinned = [],
  onPinnedChange,
  title = 'Agent permissions',
  subtitle = 'What it may do without asking you',
  className,
  xstyle,
  ref,
}: AutonomyDialProps) {
  const f = useFormatters();
  const [lvl, setLvl] = useControlled<AutonomyLevel>(level, defaultLevel, onLevelChange);
  const [pins, setPins] = useControlled<string[]>(pinned, defaultPinned, onPinnedChange);
  const [msg, say] = useAnnouncer();
  const boxRef = useRef<HTMLDivElement>(null);
  useFlip(boxRef, 380, 40);
  const dialRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const placed = useRef(false);
  useLayoutEffect(() => {
    const el = dialRef.current;
    if (!el) return;
    const measure = () => {
      const sel = el.querySelector<HTMLElement>('[data-selected]');
      if (sel) setPill({ x: sel.offsetLeft, y: sel.offsetTop, w: sel.offsetWidth, h: sel.offsetHeight });
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [lvl]);
  useEffect(() => {
    if (pill) placed.current = true;
  }, [pill]);
  const intro = useRef(true);
  useEffect(() => {
    intro.current = false;
  }, []);
  const auto = actions.filter((a) => !asksFirst(a, lvl, pins));
  const ask = actions.filter((a) => asksFirst(a, lvl, pins));
  const summary = (l: AutonomyLevel, p: string[]) => {
    const n = actions.filter((a) => !asksFirst(a, l, p)).length;
    return `${f.plural(n, { one: '# action runs', other: '# actions run' })} on its own, ${actions.length - n} ask first.`;
  };
  const current = LEVELS[lvl]!;

  const renderGroup = (heading: string, list: AgentAction[], _key: string) => (
    <section aria-label={heading} {...stylex.props(styles.group)}>
      <div {...stylex.props(styles.groupHead)}>
        <span {...stylex.props(styles.label)}>{heading}</span>
        <span {...stylex.props(styles.count)}><AnimatedNumber value={list.length} /></span>
      </div>
      {list.length === 0 && <span {...stylex.props(styles.empty)}>Nothing here.</span>}
      <ul {...stylex.props(w1.list)}>
        {list.map((a, i) => {
          const locked = pins.includes(a.id);
          return (
            <li
              key={a.id}
              data-flip-id={a.id}
              {...stylex.props(styles.item, intro.current && w1.rise)}
              style={{ animationDelay: `${Math.min(i, 6) * 30}ms` }}
            >
              {a.icon && <span aria-hidden="true" {...stylex.props(styles.icon)}>{a.icon}</span>}
              <span {...stylex.props(styles.text)}>
                <span {...stylex.props(styles.name, w1.ellipsis)}>{a.label}</span>
                {a.risk !== 'safe' && (
                <Tag
                  tone={a.risk === 'risky' ? 'warning' : 'danger'}
                  icon={a.risk === 'risky' ? <AlertTriangle size={11} aria-hidden="true" /> : <ShieldAlert size={11} aria-hidden="true" />}
                >
                  {a.risk === 'risky' ? 'Risky' : 'Destructive'}
                </Tag>
              )}
                {a.detail && <span {...stylex.props(styles.detail, w1.ellipsis)}>{a.detail}</span>}
              </span>
              <ToggleButton
                aria-label={`Always ask before: ${a.label}`}
                isSelected={locked}
                onChange={(sel) => {
                  const next = sel ? [...pins, a.id] : pins.filter((p) => p !== a.id);
                  setPins(next);
                  say(`${a.label} ${sel ? 'locked: always asks' : 'unlocked'}. ${summary(lvl, next)}`);
                }}
                className={() => sxClass(stylex.props(styles.lock, focus.ring))}
              >
                {locked ? <Lock size={14} aria-hidden="true" /> : <LockOpen size={14} aria-hidden="true" />}
              </ToggleButton>
            </li>
          );
        })}
      </ul>
    </section>
  );

  return (
    <div {...mergeSx(stylex.props(w1.root, styles.root, xstyle), className)} ref={(el) => { boxRef.current = el; if (typeof ref === 'function') ref(el); else if (ref) ref.current = el; }}>
      <div {...stylex.props(styles.head)}>
        <Sparkles size={16} aria-hidden="true" {...stylex.props(styles.headIcon)} />
        <div>
          <h3 {...stylex.props(w1.title)}>{title}</h3>
          <p {...stylex.props(styles.sub)}>{subtitle}</p>
        </div>
      </div>
      <div {...stylex.props(styles.top)}>
      <RadioGroup
        aria-label="Autonomy"
        orientation="horizontal"
        value={String(lvl)}
        onChange={(v) => {
          const n = Number(v) as AutonomyLevel;
          setLvl(n);
          say(`${LEVELS[n]!.label}. ${summary(n, pins)}`);
        }}
      >
        <div ref={dialRef} {...stylex.props(styles.dial)}>
          {pill && pill.w > 0 && (
            <span
              aria-hidden="true"
              {...stylex.props(styles.pill, !placed.current && styles.pillStill)}
              style={{ height: pill.h, transform: `translate(${pill.x}px, ${pill.y}px)`, width: pill.w }}
            />
          )}
          {LEVELS.map((l) => (
            <Radio key={l.level} value={String(l.level)} className={() => sxClass(stylex.props(styles.radio, focus.ring))}>
              {l.label}
            </Radio>
          ))}
        </div>
        <Text slot="description" {...stylex.props(styles.desc, styles.hidden)}>
          {current.hint}
        </Text>
      </RadioGroup>
      </div>
      <div {...stylex.props(styles.lists)}>
      {renderGroup('Runs on its own', auto, `a${lvl}`)}
      {renderGroup('Asks you first', ask, `b${lvl}`)}
      </div>
      <LiveRegion message={msg} />
    </div>
  );
}
