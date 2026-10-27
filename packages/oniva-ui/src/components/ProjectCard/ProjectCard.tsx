import * as stylex from '@stylexjs/stylex';
import { ArrowRight, ChevronDown, Circle } from 'lucide-react';
import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode, type Ref } from 'react';
import {
  Button as AriaButton,
  Checkbox as AriaCheckbox,
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  ToggleButton as AriaToggleButton,
} from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { mergeSx, sxClass } from '../../internal/sx';
import { useControllable } from '../../internal/w4-hooks';
import { w4 } from '../../internal/w4-styles';
import { DrawnCheck, usePopOnChange, w4Parts } from '../../internal/w4-parts';
import { toneColor, type CardTone } from '../../internal/w4-tone';
import { Avatar } from '../Avatar';
import { Button } from '../Button';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { AnimatedNumber } from '../../motion/AnimatedNumber';

const SIZE = 40;
const R = 16;
const C = SIZE / 2;

/** SVG arc path for segment `i` of `n` (with a small gap). */
function arc(i: number, n: number) {
  const gap = n > 1 ? 0.28 : 0;
  const step = (Math.PI * 2) / n;
  const a0 = -Math.PI / 2 + i * step + gap / 2;
  const a1 = -Math.PI / 2 + (i + 1) * step - gap / 2;
  const p = (a: number) => `${(C + R * Math.cos(a)).toFixed(2)} ${(C + R * Math.sin(a)).toFixed(2)}`;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return n === 1 ? `M ${p(a0)} A ${R} ${R} 0 1 1 ${p(a0 + Math.PI * 1.999)}` : `M ${p(a0)} A ${R} ${R} 0 ${large} 1 ${p(a1)}`;
}

const styles = stylex.create({
  root: {
    containerType: 'inline-size',
    fontFamily: font['--oniva-font-sans'],
    maxWidth: 320,
    overflow: 'hidden',
    width: '100%',
  },
  head: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-inset-hover'] },
    },
    borderWidth: 0,
    boxSizing: 'border-box',
    color: 'inherit',
    cursor: 'pointer',
    display: 'flex',
    fontFamily: 'inherit',
    gap: 12,
    padding: 12,
    textAlign: 'start',
    width: '100%',
  },
  ringWrap: { flexShrink: 0, height: SIZE, position: 'relative', width: SIZE },
  ringNum: {
    alignItems: 'center',
    display: 'flex',
    fontSize: font['--oniva-font-size-13'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-semibold'],
    inset: 0,
    justifyContent: 'center',
    position: 'absolute',
  },
  seg: {
    fill: 'none',
    stroke: colors['--oniva-color-chart-track'],
    strokeLinecap: 'round',
    strokeWidth: 3,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'stroke, stroke-width, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  segDone: { stroke: colors['--oniva-color-accent-text'] },
  segHot: { strokeWidth: 5 },
  segDim: { opacity: 0.25 },
  main: { display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 2, minWidth: 0 },
  title: { fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-semibold'], lineHeight: font['--oniva-font-lh-18'] },
  sub: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'flex', fontSize: font['--oniva-font-size-12'], gap: 6 },
  due: { fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' },
  dueWord: { display: { default: 'inline', '@container (max-width: 289px)': 'none' } },
  stack: { display: 'flex', flexShrink: 0, marginInlineStart: 4 },
  stackItem: { marginInlineStart: { default: -6, '@container (max-width: 289px)': -10 } },
  body: {
    borderBlockStartColor: colors['--oniva-color-separator'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 10,
  },
  row: { alignItems: 'center', display: 'flex', gap: 8, justifyContent: 'space-between' },
  statusBtn: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 6,
    minHeight: { default: 28, '@media (pointer: coarse)': 36 },
    paddingInline: 8,
  },
  chevron: {
    color: colors['--oniva-color-icon-muted'],
    transform: 'none',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  chevronOpen: { transform: 'rotate(180deg)' },
  options: { display: 'flex', flexDirection: 'column', gap: 2, paddingBlockStart: 4 },
  option: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-md'],
    cursor: 'pointer',
    display: 'flex',
    fontSize: font['--oniva-font-size-13'],
    gap: 8,
    minHeight: { default: 28, '@media (pointer: coarse)': 36 },
    paddingInline: 8,
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-inset-hover'] },
    },
  },
  optionIn: {
    opacity: { default: 0, '[data-picking]': 1 },
    transform: { default: 'translateY(-4px)', '[data-picking]': 'translateY(0)' },
    transitionDelay: 'calc(var(--oniva-i, 0) * 30ms)',
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: 'opacity, transform, background-color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  optionOn: { fontWeight: font['--oniva-font-weight-semibold'] },
  person: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderRadius: radius['--oniva-radius-full'],
    borderWidth: 0,
    cursor: 'pointer',
    display: 'inline-flex',
    padding: 1,
    marginInlineStart: -4,
  },
  personOn: { boxShadow: `0 0 0 2px ${colors['--oniva-color-accent-text']}` },
  tasks: { display: 'flex', flexDirection: 'column', gap: 2, listStyle: 'none', margin: 0, padding: 0 },
  task: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-inset-hover'] },
    },
    borderRadius: radius['--oniva-radius-md'],
    cursor: 'pointer',
    display: 'flex',
    fontSize: font['--oniva-font-size-13'],
    gap: 8,
    minHeight: { default: 32, '@media (pointer: coarse)': 40 },
    paddingInline: 6,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'opacity, background-color',
  },
  taskDim: { opacity: 0.3 },
  taskDone: { color: colors['--oniva-color-text-muted'] },
  taskLabel: { flexGrow: 1, minWidth: 0 },
  box: {
    alignItems: 'center',
    borderColor: colors['--oniva-color-border-control'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1.5,
    boxSizing: 'border-box',
    color: colors['--oniva-color-accent-fg'],
    display: 'inline-flex',
    flexShrink: 0,
    height: 18,
    justifyContent: 'center',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, border-color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: 18,
  },
  boxOn: { backgroundColor: colors['--oniva-color-accent-text'], borderColor: colors['--oniva-color-accent-text'], color: colors['--oniva-color-text-inverse'] },
  assignee: {
    opacity: { default: 0, '@media (pointer: coarse)': 1 },
    transform: 'translateX(4px)',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'opacity, transform',
  },
  assigneeOn: { opacity: 1, transform: 'translateX(0)' },
  tray: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderBlockStartColor: colors['--oniva-color-separator'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
    gap: 8,
    justifyContent: 'space-between',
    minHeight: 48,
    paddingInline: 12,
  },
  pill: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-sm'],
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 4,
    paddingBlock: 1,
    paddingInline: 6,
  },
  hintLine: { display: 'inline-block', maxWidth: '100%', verticalAlign: 'top' },
  hint: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums', minWidth: 0 },
});

export interface ProjectTask {
  id: string;
  label: string;
  done?: boolean;
  /** Name of a member; links the row, the avatar and the people filter. */
  assignee?: string;
}
export interface ProjectOption {
  id: string;
  label: string;
  tone?: CardTone;
  icon?: ReactNode;
}
export interface ProjectMember {
  name: string;
  avatar?: string;
}

const DEFAULT_STATUSES: ProjectOption[] = [
  { id: 'todo', label: 'To do', tone: 'gray' },
  { id: 'progress', label: 'In progress', tone: 'blue' },
  { id: 'review', label: 'In review', tone: 'amber' },
  { id: 'done', label: 'Done', tone: 'green' },
];

export interface ProjectCardProps {
  title: string;
  tasks: ProjectTask[];
  /** Called with the full list after a tick. With it the card shows exactly what you pass; without it ticks live in the card. */
  onTasksChange?: (tasks: ProjectTask[]) => void;
  /** Id of the chosen status (controlled). */
  status?: string;
  statuses?: ProjectOption[];
  onStatusChange?: (id: string) => void;
  /** Ready-to-show due date, e.g. "Oct 24". */
  due?: string;
  members?: ProjectMember[];
  /** Button on the tray of the open card. */
  action?: { label: string; onClick: () => void };
  /** Line on the tray while nothing is hovered. */
  hint?: ReactNode;
  /** `hover` opens under the mouse; taps and the keyboard always toggle. */
  trigger?: 'hover' | 'click';
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

function Dot({ option }: { option: ProjectOption }) {
  return (
    <span aria-hidden="true" {...stylex.props(toneColor[option.tone ?? 'gray'])}>
      {option.icon ?? <Circle size={10} fill="currentColor" />}
    </span>
  );
}

/** Two-line project summary that unfolds on hover: segmented progress ring, people filter and status picker. */
export function ProjectCard({
  title,
  tasks: tasksProp,
  onTasksChange,
  status,
  statuses = DEFAULT_STATUSES,
  onStatusChange,
  due,
  members = [],
  action,
  hint,
  trigger = 'hover',
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  xstyle,
  ref,
}: ProjectCardProps) {
  const fmt = useFormatters();
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
  const [local, setLocal] = useState(tasksProp);
  const tasks = onTasksChange ? tasksProp : local;
  const [statusLocal, setStatusLocal] = useState(status ?? statuses[0]?.id ?? '');
  const statusId = status ?? statusLocal;
  const current = statuses.find((s) => s.id === statusId) ?? statuses[0];
  const [pickingStatus, setPickingStatus] = useState(false);
  const [person, setPerson] = useState<string | null>(null);
  const [hot, setHot] = useState<string | null>(null);

  const doneCount = tasks.filter((t) => t.done).length;
  const left = tasks.length - doneCount;
  const visible = (t: ProjectTask) => !person || t.assignee === person;

  useEffect(() => {
    if (!open) {
      setPickingStatus(false);
      setPerson(null);
      setHot(null);
    }
  }, [open]);

  // Tap outside closes (touch / click trigger)
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node) && (trigger === 'click' || e.pointerType !== 'mouse')) setOpen(false);
    };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, trigger]);

  const setTasks = (next: ProjectTask[]) => {
    if (!onTasksChange) setLocal(next);
    onTasksChange?.(next);
  };

  const numRef = useRef<HTMLSpanElement | null>(null);
  usePopOnChange(numRef, doneCount);
  const hotTask = tasks.find((t) => t.id === hot);
  const trayLine = hotTask
    ? `${hotTask.label}${hotTask.assignee ? ` · ${hotTask.assignee}` : ''}`
    : person
      ? `${person}: ${fmt.plural(tasks.filter((t) => t.assignee === person).length, { one: '# task', other: '# tasks' })}`
      : (hint ?? (left === 0 ? 'All done' : `${fmt.number(left)} left`));

  const summary = [
    title,
    `${doneCount} of ${tasks.length} done`,
    current?.label,
    due ? `due ${due}` : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div
      ref={(el) => {
        rootRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) (ref as { current: HTMLDivElement | null }).current = el;
      }}
      onPointerEnter={(e) => {
        if (trigger === 'hover' && e.pointerType === 'mouse') setOpen(true);
      }}
      onPointerLeave={(e) => {
        if (trigger === 'hover' && e.pointerType === 'mouse' && !rootRef.current?.contains(document.activeElement)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key !== 'Escape') return;
        if (pickingStatus) setPickingStatus(false);
        else if (open) {
          setOpen(false);
          rootRef.current?.querySelector<HTMLElement>('[data-card-head]')?.focus();
        }
      }}
      {...mergeSx(stylex.props(w4.card, styles.root, xstyle), className)}
    >
      <AriaButton
        data-card-head=""
        aria-expanded={open}
        aria-controls={`${uid}-body`}
        aria-label={summary}
        onPress={(e) => setOpen(trigger === 'hover' && e.pointerType === 'mouse' ? true : !open)}
        className={() => sxClass(stylex.props(styles.head, focus.inset))}
      >
        <span aria-hidden="true" {...stylex.props(styles.ringWrap)}>
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            {tasks.map((t, i) => (
              <path
                key={t.id}
                d={arc(i, Math.max(tasks.length, 1))}
                {...stylex.props(styles.seg, t.done && styles.segDone, hot === t.id && styles.segHot, !visible(t) && styles.segDim)}
              />
            ))}
          </svg>
          <span ref={numRef} {...stylex.props(styles.ringNum)}>
            <AnimatedNumber value={doneCount} />
          </span>
        </span>
        <span {...stylex.props(styles.main)}>
          <span title={title} {...stylex.props(styles.title, w4.clamp1)}>
            {title}
          </span>
          <span {...stylex.props(styles.sub)}>
            {current && (
              <span {...stylex.props(styles.pill)}>
                <Dot option={current} />
                <span {...stylex.props(w4.clamp1)}>{current.label}</span>
              </span>
            )}
            {due && (
              <span {...stylex.props(styles.due)}>
                <span {...stylex.props(styles.dueWord)}>Due </span>
                {due}
              </span>
            )}
          </span>
        </span>
        {members.length > 0 && (
          <span aria-hidden="true" {...stylex.props(styles.stack)}>
            {members.slice(0, 4).map((m) => (
              <span key={m.name} {...stylex.props(styles.stackItem)}>
                <Avatar size="xs" name={m.name} src={m.avatar} />
              </span>
            ))}
          </span>
        )}
      </AriaButton>

      <AnimatedHeight isOpen={open} id={`${uid}-body`}>
        <div {...stylex.props(styles.body)}>
          <div {...stylex.props(styles.row)}>
            <AriaButton
              aria-expanded={pickingStatus}
              onPress={() => setPickingStatus((v) => !v)}
              className={() => sxClass(stylex.props(styles.statusBtn, focus.ring))}
            >
              {current && <Dot option={current} />}
              {current?.label}
              <ChevronDown size={14} aria-hidden="true" {...stylex.props(styles.chevron, pickingStatus && styles.chevronOpen)} />
            </AriaButton>
            {members.length > 0 && (
              <span role="group" aria-label="Filter by person" {...stylex.props(styles.stack)}>
                {members.map((m) => (
                  <AriaToggleButton
                    key={m.name}
                    aria-label={m.name}
                    isSelected={person === m.name}
                    onChange={(v) => setPerson(v ? m.name : null)}
                    className={({ isSelected }) => sxClass(stylex.props(styles.person, focus.ring, isSelected && styles.personOn))}
                  >
                    <Avatar size="xs" name={m.name} src={m.avatar} />
                  </AriaToggleButton>
                ))}
              </span>
            )}
          </div>
          <AnimatedHeight isOpen={pickingStatus}>
            <AriaRadioGroup
              aria-label="Status"
              value={statusId}
              onChange={(v) => {
                setStatusLocal(v);
                onStatusChange?.(v);
                setPickingStatus(false);
              }}
              {...stylex.props(styles.options)}
            >
              {statuses.map((s, si) => (
                <AriaRadio
                  key={s.id}
                  value={s.id}
                  data-picking={pickingStatus ? '' : undefined}
                  style={{ '--oniva-i': Math.min(si, 6) } as CSSProperties}
                  className={({ isSelected }) => sxClass(stylex.props(styles.option, styles.optionIn, focus.ring, isSelected && styles.optionOn))}
                >
                  <Dot option={s} />
                  {s.label}
                </AriaRadio>
              ))}
            </AriaRadioGroup>
          </AnimatedHeight>
          <ul {...stylex.props(styles.tasks)}>
            {tasks.map((t) => (
              <li key={t.id}>
                <AriaCheckbox
                  isSelected={!!t.done}
                  onChange={(v) => setTasks(tasks.map((x) => (x.id === t.id ? { ...x, done: v } : x)))}
                  onHoverChange={(h) => setHot(h ? t.id : null)}
                  onFocusChange={(f) => setHot(f ? t.id : null)}
                  className={() => sxClass(stylex.props(styles.task, focus.ring, !visible(t) && styles.taskDim, t.done && styles.taskDone))}
                >
                  {({ isSelected }) => (
                    <>
                      <span aria-hidden="true" {...stylex.props(styles.box, isSelected && styles.boxOn, isSelected && w4Parts.pop)}>
                        {isSelected && <DrawnCheck size={12} strokeWidth={2.6} />}
                      </span>
                      <span {...stylex.props(styles.taskLabel, w4.clamp1)}>
                        <span {...stylex.props(w4Parts.strike, isSelected && w4Parts.strikeOn)}>{t.label}</span>
                      </span>
                      {t.assignee && (
                        <span aria-hidden="true" {...stylex.props(styles.assignee, hot === t.id && styles.assigneeOn)}>
                          <Avatar size="xs" name={t.assignee} />
                        </span>
                      )}
                    </>
                  )}
                </AriaCheckbox>
              </li>
            ))}
          </ul>
        </div>
        <div {...stylex.props(styles.tray)}>
          <span aria-live="polite" title={typeof trayLine === 'string' ? trayLine : undefined} {...stylex.props(styles.hint, w4.clamp1)}>
            <span key={String(trayLine)} {...stylex.props(w4Parts.rise, styles.hintLine)}>
              {trayLine}
            </span>
          </span>
          {action && (
            <Button size="sm" variant="primary" onPress={action.onClick}>
              {action.label}
              <ArrowRight size={14} aria-hidden="true" />
            </Button>
          )}
        </div>
      </AnimatedHeight>
    </div>
  );
}
