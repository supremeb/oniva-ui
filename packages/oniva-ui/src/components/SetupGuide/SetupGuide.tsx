import * as stylex from '@stylexjs/stylex';
import { ChevronDown, Minimize2, Maximize2 } from 'lucide-react';
import { useMemo, useState, type Ref } from 'react';
import { Button as AriaButton, ToggleButton as AriaToggleButton } from 'react-aria-components';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { mergeSx, sxClass } from '../../internal/sx';
import { w4 } from '../../internal/w4-styles';
import { DrawnCheck, w4Parts } from '../../internal/w4-parts';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { Button } from '../Button';
import { CloseButton } from '../CloseButton';
import { ProgressBar } from '../ProgressBar';
import { AnimatedHeight } from '../../motion/AnimatedHeight';

const styles = stylex.create({
  top: { display: 'flex', flexDirection: 'column', gap: 10, padding: 14, paddingBlockEnd: 10 },
  barRow: { alignItems: 'center', display: 'flex', gap: 12 },
  barGrow: { flexGrow: 1, minWidth: 0 },
  iconBtn: {
    alignItems: 'center',
    backgroundColor: { default: 'transparent', ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-inset-hover'] } },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-icon-muted'],
    cursor: 'pointer',
    display: 'inline-flex',
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  topRow: { alignItems: 'center', display: 'flex', gap: 8, justifyContent: 'space-between' },
  pct: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums' },
  groups: { display: 'flex', flexDirection: 'column', margin: 0, padding: 0, listStyle: 'none' },
  group: { borderRadius: radius['--oniva-radius-lg'], marginInline: 6, marginBlockEnd: 2, overflow: 'hidden' },
  groupOpen: { backgroundColor: colors['--oniva-color-surface-inset'] },
  gHead: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-inset-hover'] },
    },
    borderWidth: 0,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 10,
    minHeight: 40,
    paddingInline: 8,
    textAlign: 'start',
    width: '100%',
  },
  h: { margin: 0 },
  gTitle: { flexGrow: 1, minWidth: 0 },

  gTitleDone: { color: colors['--oniva-color-text-muted'] },
  chevron: {
    color: colors['--oniva-color-icon-muted'],
    transform: 'none',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  chevronOpen: { transform: 'rotate(180deg)' },
  tasks: { display: 'flex', flexDirection: 'column', gap: 2, margin: 0, padding: 4, paddingBlockStart: 0, listStyle: 'none' },
  task: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-inset-hover'] },
    },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-14'],
    gap: 10,
    minHeight: 34,
    paddingInline: 8,
    textAlign: 'start',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '100%',
  },
  taskLocked: { color: colors['--oniva-color-text-disabled'], cursor: 'not-allowed' },
  taskDone: { color: colors['--oniva-color-text-muted'] },
  taskText: { minWidth: 0 },
  dot: {
    alignItems: 'center',
    borderColor: colors['--oniva-color-border-control'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1.5,
    boxSizing: 'border-box',
    color: colors['--oniva-color-on-solid'],
    display: 'inline-flex',
    flexShrink: 0,
    height: 18,
    justifyContent: 'center',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, border-color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: 18,
  },
  dotDone: { backgroundColor: accent['--oniva-accent-500'], borderColor: accent['--oniva-accent-500'], borderStyle: 'solid' },
  dotLocked: { borderColor: colors['--oniva-color-border'], borderStyle: 'dashed' },
});

export interface SetupTask {
  id: string;
  label: string;
  done?: boolean;
}
export interface SetupGroup {
  id: string;
  title: string;
  tasks: SetupTask[];
}

export interface SetupGuideProps {
  groups: SetupGroup[];
  title?: string;
  /** Shows an Edit button in the header. */
  onEdit?: () => void;
  /** Shows a close button in the header. */
  onClose?: () => void;
  /** Called with the ids of all finished tasks. */
  onChange?: (done: string[]) => void;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

/** Onboarding panel: progress bar plus collapsible task groups. Within a group each task unlocks the next. */
export function SetupGuide({ groups, title = 'Setup guide', onEdit, onClose, onChange, className, xstyle, ref }: SetupGuideProps) {
  const fmt = useFormatters();
  const [done, setDone] = useState(() => new Set(groups.flatMap((g) => g.tasks.filter((t) => t.done).map((t) => t.id))));
  const complete = (g: SetupGroup, d: Set<string>) => g.tasks.every((t) => d.has(t.id));
  const [open, setOpen] = useState<Set<string>>(() => {
    const first = groups.find((g) => !complete(g, done));
    return new Set(first ? [first.id] : []);
  });

  const [collapsed, setCollapsed] = useState(false);
  const total = useMemo(() => groups.reduce((n, g) => n + g.tasks.length, 0), [groups]);

  const toggle = (g: SetupGroup, id: string, on: boolean) => {
    const next = new Set(done);
    if (on) next.add(id);
    else next.delete(id);
    setDone(next);
    onChange?.([...next]);
    if (on && complete(g, next)) {
      // fold the finished group and open the next unfinished one
      setOpen((o) => {
        const n = new Set(o);
        n.delete(g.id);
        const nxt = groups.find((x) => x.id !== g.id && !complete(x, next));
        if (nxt) n.add(nxt.id);
        return n;
      });
    }
  };

  return (
    <section ref={ref} aria-label={title} {...mergeSx(stylex.props(w4.card, xstyle), className)}>
      <div {...stylex.props(styles.top)}>
        <div {...stylex.props(styles.topRow)}>
          <h3 {...stylex.props(w4.trayTitle)}>{title}</h3>
          <span {...stylex.props(styles.topRow)}>
            {onEdit && (
              <Button size="xs" variant="ghost" onPress={onEdit}>
                Edit
              </Button>
            )}
            <AriaButton
              aria-label={collapsed ? 'Expand setup guide' : 'Collapse setup guide'}
              aria-expanded={!collapsed}
              onPress={() => setCollapsed((c) => !c)}
              className={() => sxClass(stylex.props(styles.iconBtn, focus.ring))}
            >
              {collapsed ? <Maximize2 size={14} aria-hidden="true" /> : <Minimize2 size={14} aria-hidden="true" />}
            </AriaButton>
            {onClose && <CloseButton size="sm" aria-label="Close setup guide" onPress={onClose} />}
          </span>
        </div>
        <div {...stylex.props(styles.barRow)}>
          <div {...stylex.props(styles.barGrow)}>
            <ProgressBar
              aria-label={title}
              value={done.size}
              minValue={0}
              maxValue={Math.max(total, 1)}
              valueLabel={fmt.percent(total ? done.size / total : 0)}
              size="sm"
              tone="accent"
            />
          </div>
          <span aria-hidden="true" {...stylex.props(styles.pct)}>
            <AnimatedNumber value={done.size} />/{fmt.number(total)}
          </span>
        </div>
      </div>
      <ul hidden={collapsed} {...stylex.props(styles.groups)}>
        {groups.map((g) => {
          const isOpen = open.has(g.id);
          const finished = complete(g, done);
          return (
            <li key={g.id} {...stylex.props(styles.group, isOpen && styles.groupOpen)}>
              <h4 {...stylex.props(styles.h)}>
                <AriaButton
                  aria-expanded={isOpen}
                  aria-controls={`${g.id}-panel`}
                  onPress={() =>
                    setOpen((o) => {
                      const nx = new Set(o);
                      if (nx.has(g.id)) nx.delete(g.id);
                      else nx.add(g.id);
                      return nx;
                    })
                  }
                  className={() => sxClass(stylex.props(styles.gHead, focus.inset))}
                >
                  <span {...stylex.props(styles.gTitle)}>
                    <span {...stylex.props(w4Parts.strike, finished && w4Parts.strikeOn, finished && styles.gTitleDone)}>{g.title}</span>
                  </span>
                  <ChevronDown size={16} aria-hidden="true" {...stylex.props(styles.chevron, isOpen && styles.chevronOpen)} />
                </AriaButton>
              </h4>
              <AnimatedHeight isOpen={isOpen} id={`${g.id}-panel`}>
                <ul {...stylex.props(styles.tasks)}>
                  {g.tasks.map((t, i) => {
                    const isDone = done.has(t.id);
                    const locked = !isDone && g.tasks.slice(0, i).some((p) => !done.has(p.id));
                    return (
                      <li key={t.id} data-task-i={i}>
                        <AriaToggleButton
                          isSelected={isDone}
                          isDisabled={locked}
                          onChange={(on) => toggle(g, t.id, on)}
                          className={() =>
                            sxClass(stylex.props(styles.task, focus.ring, locked && styles.taskLocked, isDone && styles.taskDone))
                          }
                        >
                          <span aria-hidden="true" {...stylex.props(styles.dot, isDone && styles.dotDone, locked && styles.dotLocked, isDone && w4Parts.pop)}>
                            {isDone ? <DrawnCheck size={11} strokeWidth={3} /> : null}
                          </span>
                          <span {...stylex.props(styles.taskText, w4Parts.strike, isDone && w4Parts.strikeOn)}>{t.label}</span>
                        </AriaToggleButton>
                      </li>
                    );
                  })}
                </ul>
              </AnimatedHeight>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
