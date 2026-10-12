import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { enterExit } from '../../internal/motion-styles';
import { mergeSx } from '../../internal/sx';
import { TextShimmer } from '../TextShimmer';

const pulse = stylex.keyframes({
  '0%': { opacity: 0.45, transform: 'scale(1)' },
  '100%': { opacity: 0, transform: 'scale(2.6)' },
});

const styles = stylex.create({
  root: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 8,
    height: 26,
    paddingInline: 10,
  },
  dot: {
    backgroundColor: colors['--oniva-color-icon-subtle'],
    borderRadius: radius['--oniva-radius-full'],
    flexShrink: 0,
    height: 8,
    position: 'relative',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color',
    width: 8,
  },
  working: { backgroundColor: colors['--oniva-color-accent-soft-fg'] },
  waiting: { backgroundColor: colors['--oniva-color-warning-solid'] },
  error: { backgroundColor: colors['--oniva-color-danger-solid'] },
  halo: {
    animationDuration: '1400ms',
    animationIterationCount: 'infinite',
    animationName: { default: pulse, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundColor: 'inherit',
    borderRadius: radius['--oniva-radius-full'],
    inset: 0,
    position: 'absolute',
  },
  text: { display: 'inline-block' },
  muted: { color: colors['--oniva-color-text-muted'] },
  errText: { color: colors['--oniva-color-danger-fg'] },
});

export type AgentStatus = 'idle' | 'working' | 'waiting' | 'error';
const DEFAULT_LABEL: Record<AgentStatus, string> = {
  idle: 'Idle',
  working: 'Working…',
  waiting: 'Waiting for approval',
  error: 'Failed',
};

export interface AgentStatusPillProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style' | 'children'> {
  status: AgentStatus;
  /** Override the default label for the status (e.g. "Reviewing PR #482…"). */
  label?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

/** Compact agent state: colored dot (pulsing while working), label that blur-swaps on change, shimmer while working. */
export function AgentStatusPill({ status, label, className, xstyle, ref, ...rest }: AgentStatusPillProps) {
  const text = label ?? DEFAULT_LABEL[status];
  const sx = stylex.props(styles.root, xstyle);
  return (
    <span {...rest} ref={ref} role="status" {...mergeSx(sx, className)}>
      <span aria-hidden="true" {...stylex.props(styles.dot, status === 'working' && styles.working, status === 'waiting' && styles.waiting, status === 'error' && styles.error)}>
        {status === 'working' && <span {...stylex.props(styles.halo)} />}
      </span>
      <span key={`${status}-${text}`} data-state="entering" {...stylex.props(styles.text, enterExit.blur, status === 'idle' && styles.muted, status === 'error' && styles.errText)}>
        {status === 'working' ? <TextShimmer>{text}</TextShimmer> : text}
      </span>
    </span>
  );
}
