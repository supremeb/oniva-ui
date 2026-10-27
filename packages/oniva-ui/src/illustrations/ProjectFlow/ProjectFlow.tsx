import * as stylex from '@stylexjs/stylex';
import { Check, FileText, Users } from 'lucide-react';
import { Avatar } from '../../components/Avatar/Avatar';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { CursorArrow, paletteAt } from '../../internal/w7-parts';
import { Scene, useSteps, type IllustrationProps } from '../../internal/w7-scene';

/* Clean-room implementation from the public Project Flow description (no third-party source). */

const styles = stylex.create({
  svg: { inset: 0, position: 'absolute' },
  line: {
    fill: 'none',
    stroke: colors['--oniva-color-border-control'],
    strokeDasharray: 1,
    strokeDashoffset: 1,
    strokeLinecap: 'round',
    strokeWidth: 0.3,
    transitionDuration: motion['--oniva-motion-dur-deliberate'],
    transitionProperty: 'stroke-dashoffset',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  lineOn: { strokeDashoffset: 0 },
  card: {
    backgroundColor: colors['--oniva-color-surface'],
    borderRadius: radius['--oniva-radius-xl'],
    boxShadow: `${shadow['--oniva-shadow-md']}, 0 0 0 1px ${colors['--oniva-color-border']}`,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-sans'],
    opacity: 0,
    padding: '2cqw 2.4cqw',
    position: 'absolute',
    transform: 'translateY(2cqw) scale(0.96)',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  inverted: { backgroundColor: colors['--oniva-color-text'], color: colors['--oniva-color-bg'] },
  on: { opacity: 1, transform: 'translateY(0) scale(1)' },
  at: (l: number, t: number, w: number) => ({ left: `${l}%`, top: `${t}cqw`, width: `${w}%` }),
  row: { alignItems: 'center', display: 'flex', gap: '1.6cqw' },
  cap: { fontSize: '1.9cqw', fontWeight: 500, opacity: 0.7 },
  title: { fontSize: '2.6cqw', fontWeight: 600, lineHeight: 1.25 },
  bar: { backgroundColor: 'currentColor', borderRadius: radius['--oniva-radius-full'], display: 'block', height: '0.9cqw', opacity: 0.18 },
  stack: { display: 'flex', flexDirection: 'column', gap: '1.1cqw', marginTop: '1.6cqw' },
  sub: {
    opacity: 0,
    transform: 'translateX(26cqw)',
    // leaving (loop reset) is quick and plain; arriving is dragged in with a small bounce
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  subOn: {
    opacity: 1,
    transform: 'translateX(0)',
    transitionDuration: motion['--oniva-motion-dur-sheet'],
    transitionTimingFunction: motion['--oniva-motion-ease-spring'],
  },
  tick: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-accent-soft'],
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-accent-soft-fg'],
    display: 'inline-flex',
    flexShrink: 0,
    height: '4cqw',
    justifyContent: 'center',
    transform: 'scale(0.6)',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-spring'],
    width: '4cqw',
  },
  tickOn: { transform: 'scale(1)', transitionDelay: '280ms' },
  tickIcon: { height: '60%', width: '60%' },
  chip: {
    borderRadius: radius['--oniva-radius-full'],
    fontSize: '2cqw',
    fontWeight: 600,
    padding: '0.7cqw 2cqw',
  },
  chips: { display: 'flex', flexWrap: 'wrap', gap: '1cqw', marginTop: '1.4cqw' },
  hand: {
    height: '6cqw',
    left: 0,
    opacity: 0,
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    transitionDuration: motion['--oniva-motion-dur-sheet'],
    transitionProperty: 'opacity, translate, scale',
    transitionTimingFunction: motion['--oniva-motion-ease-spring'],
    width: '5cqw',
    zIndex: 3,
  },
  handPos: (x: number, y: number) => ({ translate: `${x}cqw ${y}cqw` }),
  handOn: { opacity: 1 },
  handGrab: { scale: 0.86 },
});

export interface ProjectFlowProps extends IllustrationProps {
  /** Client name on the first card. */
  client?: string;
  /** Task title. */
  task?: string;
  /** Subtasks dragged in one by one (three are shown). */
  subtasks?: string[];
  /** Roles assigned to the task. */
  roles?: string[];
  /** Cards on inverted colours (dark cards on a light page and vice versa). */
  isInverted?: boolean;
}

const DEFAULT_SUBTASKS = ['Audit the current flow', 'Draft three wireframes', 'Client review call'];
const DEFAULT_ROLES = ['Designer', 'Project lead', 'Developer'];
const SUB_Y = [27, 38, 49];

function FlowBody({
  client,
  task,
  subtasks,
  roles,
  isInverted,
}: Required<Pick<ProjectFlowProps, 'client' | 'task' | 'subtasks' | 'roles'>> & Pick<ProjectFlowProps, 'isInverted'>) {
  const step = useSteps([700, 800, 800, 800, 800, 1000, 1000, 1000, 3600]);
  const card = (on: boolean) => [styles.card, isInverted && styles.inverted, on && styles.on] as const;
  const subs = subtasks.slice(0, 3);
  const dragging = step >= 5 && step <= 7 ? step - 5 : -1;
  const handX = dragging >= 0 ? 76 : 98;
  const handY = dragging >= 0 ? SUB_Y[dragging]! + 4 : 70;
  return (
    <>
      <svg viewBox="0 0 100 75" preserveAspectRatio="none" aria-hidden="true" {...stylex.props(styles.svg)}>
        <path d="M33 13 H44" pathLength={1} {...stylex.props(styles.line, step >= 2 && styles.lineOn)} />
        <path d="M20 20 V32" pathLength={1} {...stylex.props(styles.line, step >= 3 && styles.lineOn)} />
        <path d="M69 19 V27" pathLength={1} {...stylex.props(styles.line, step >= 5 && styles.lineOn)} />
      </svg>
      <div aria-hidden="true" {...stylex.props(...card(step >= 1), styles.at(5, 5, 28))}>
        <div {...stylex.props(styles.row)}>
          <Avatar name={client} size="md" />
          <div>
            <div {...stylex.props(styles.cap)}>Client</div>
            <div {...stylex.props(styles.title)}>{client}</div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" {...stylex.props(...card(step >= 2), styles.at(44, 5, 51))}>
        <div {...stylex.props(styles.cap)}>Task</div>
        <div {...stylex.props(styles.title)}>{task}</div>
      </div>
      <div aria-hidden="true" {...stylex.props(...card(step >= 3), styles.at(5, 32, 28))}>
        <div {...stylex.props(styles.row)}>
          <FileText size={14} />
          <span {...stylex.props(styles.cap)}>Notes</span>
        </div>
        <div {...stylex.props(styles.stack)}>
          <span {...stylex.props(styles.bar)} />
          <span {...stylex.props(styles.bar)} />
          <span {...stylex.props(styles.bar)} />
        </div>
      </div>
      {subs.map((s, i) => (
        <div
          key={s}
          aria-hidden="true"
          {...stylex.props(styles.card, isInverted && styles.inverted, styles.sub, step >= 5 + i && styles.subOn, styles.at(44, SUB_Y[i]!, 51))}
        >
          <div {...stylex.props(styles.row)}>
            <span {...stylex.props(styles.tick, step >= 5 + i && styles.tickOn)}>
              <Check {...stylex.props(styles.tickIcon)} />
            </span>
            <span {...stylex.props(styles.title)}>{s}</span>
          </div>
        </div>
      ))}
      <div aria-hidden="true" {...stylex.props(...card(step >= 4), styles.at(44, 60, 51))}>
        <div {...stylex.props(styles.row)}>
          <Users size={14} />
          <span {...stylex.props(styles.cap)}>Team</span>
        </div>
        <div {...stylex.props(styles.chips)}>
          {roles.map((r, i) => (
            <span key={r} {...stylex.props(styles.chip, paletteAt(i))}>
              {r}
            </span>
          ))}
        </div>
      </div>
      <span aria-hidden="true" {...stylex.props(styles.hand, styles.handPos(handX, handY), step >= 5 && step <= 7 && styles.handOn, step >= 5 && step <= 7 && styles.handGrab)}>
        <CursorArrow />
      </span>
    </>
  );
}

/**
 * A client task branching into subtasks, notes and assigned roles. Cards build up one after another joined by lines that
 * draw in, and a cursor drags the subtask cards in. Loops while on screen; shows the finished scene under reduced motion.
 */
export function ProjectFlow({
  client = 'Northwind Co.',
  task = 'Redesign the onboarding portal',
  subtasks = DEFAULT_SUBTASKS,
  roles = DEFAULT_ROLES,
  isInverted,
  label,
  ...rest
}: ProjectFlowProps) {
  const subs = subtasks.slice(0, 3);
  return (
    <Scene
      ratio="4 / 3"
      label={label ?? `${client} task "${task}" branching into notes, ${subs.length} subtasks and the roles ${roles.join(', ')}`}
      {...rest}
    >
      <FlowBody client={client} task={task} subtasks={subtasks} roles={roles} isInverted={isInverted} />
    </Scene>
  );
}
