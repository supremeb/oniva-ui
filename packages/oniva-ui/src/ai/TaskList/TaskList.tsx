import * as stylex from '@stylexjs/stylex';
import { Check } from 'lucide-react';
import type { HTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { Spinner } from '../../components/Spinner';
import { mergeSx } from '../../internal/sx';

const styles = stylex.create({
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
  textDone: {
    color: colors['--oniva-color-text-muted'],
    textDecorationLine: 'line-through',
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
              <span {...stylex.props(styles.mark, styles.done)}>
                <Check size={12} strokeWidth={3} aria-hidden="true" />
              </span>
            )}
            {it.status === 'running' && <Spinner size="sm" label="In progress" />}
            {it.status === 'pending' && (
              <span aria-hidden="true" {...stylex.props(styles.pending)} />
            )}
          </span>
          <span
            {...stylex.props(
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
