import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, Ref } from 'react';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { Spinner } from '../../components/Spinner';
import { mergeSx } from '../../internal/sx';

const swapIn = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(0.8)' },
  to: { opacity: 1, transform: 'scale(1)' },
});
const drawCheck = stylex.keyframes({ from: { strokeDashoffset: 1 }, to: { strokeDashoffset: 0 } });

const styles = stylex.create({
  /** Status icon swap (pending -> running -> done): scale .8 -> 1 + fade, 160ms ease-out. */
  swap: {
    animationDuration: { default: '160ms', [media.reducedMotion]: '0.01ms' },
    animationFillMode: 'backwards',
    animationName: swapIn,
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  check: {
    animationDelay: '80ms',
    animationDuration: { default: '220ms', [media.reducedMotion]: '0.01ms' },
    animationFillMode: 'backwards',
    animationName: drawCheck,
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    strokeDasharray: 1,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  item: {
    alignItems: 'flex-start',
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    gap: 10,
    lineHeight: font['--oniva-font-lh-14'],
  },
  mark: {
    alignItems: 'center',
    display: 'inline-flex',
    flexShrink: 0,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },
  done: {
    backgroundColor: colors['--oniva-color-success-solid'],
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-accent-fg'],
    height: 18,
    width: 18,
  },
  pending: {
    borderColor: colors['--oniva-color-border-active'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'dashed',
    borderWidth: 1.5,
    boxSizing: 'border-box',
    height: 18,
    width: 18,
  },
  // line-through is always on; its colour fades in so completion "strikes" smoothly instead of popping.
  label: {
    textDecorationColor: 'transparent',
    textDecorationLine: 'line-through',
    transitionDuration: '160ms',
    transitionProperty: 'color, text-decoration-color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  textDone: {
    color: colors['--oniva-color-text-muted'],
    textDecorationColor: colors['--oniva-color-text-subtle'],
  },
  textRunning: {
    color: colors['--oniva-color-text'],
    fontWeight: font['--oniva-font-weight-medium'],
  },
  textPending: { color: colors['--oniva-color-text-muted'] },
});

export type TaskStatus = 'done' | 'running' | 'pending';
export interface TaskItem {
  id: string;
  label: string;
  status: TaskStatus;
}

export interface TaskListProps extends Omit<
  HTMLAttributes<HTMLOListElement>,
  'style' | 'children'
> {
  items: TaskItem[];
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLOListElement>;
}

const statusLabel: Record<TaskStatus, string> = {
  done: 'Completed',
  running: 'In progress',
  pending: 'Pending',
};

/** Multi-step checklist: completed items struck through with a check, running with a spinner, pending as dashed circles. */
export function TaskList({ items, className, xstyle, ref, ...rest }: TaskListProps) {
  const sx = stylex.props(styles.list, xstyle);
  return (
    <ol {...rest} ref={ref} {...mergeSx(sx, className)}>
      {items.map((it) => (
        <li key={it.id} {...stylex.props(styles.item)} data-status={it.status}>
          <span {...stylex.props(styles.mark)}>
            {it.status === 'done' && (
              <span key="done" {...stylex.props(styles.mark, styles.done, styles.swap)}>
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12.5l4.5 4.5L19 7.5"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    pathLength={1}
                    {...stylex.props(styles.check)}
                  />
                </svg>
              </span>
            )}
            {it.status === 'running' && (
              <span key="running" {...stylex.props(styles.mark, styles.swap)}>
                <Spinner size="sm" label="In progress" />
              </span>
            )}
            {it.status === 'pending' && (
              <span key="pending" aria-hidden="true" {...stylex.props(styles.pending)} />
            )}
          </span>
          <span
            {...stylex.props(
              styles.label,
              it.status === 'done' && styles.textDone,
              it.status === 'running' && styles.textRunning,
              it.status === 'pending' && styles.textPending,
            )}
          >
            {it.label}
            {it.status !== 'running' && (
              <span
                style={{
                  position: 'absolute',
                  width: 1,
                  height: 1,
                  overflow: 'hidden',
                  clip: 'rect(0 0 0 0)',
                }}
              >{` (${statusLabel[it.status]})`}</span>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}
