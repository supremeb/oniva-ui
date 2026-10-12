import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { mergeSx } from '../../internal/sx';

const pulse = stylex.keyframes({
  '0%': { opacity: 0.6, transform: 'scale(1)' },
  '100%': { opacity: 0, transform: 'scale(1.9)' },
});

const styles = stylex.create({
  root: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-on-solid'],
    display: 'inline-flex',
    flexShrink: 0,
    fontFamily: font['--oniva-font-sans'],
    fontWeight: font['--oniva-font-weight-semibold'],
    height: 'var(--av, 36px)',
    justifyContent: 'center',
    position: 'relative',
    width: 'var(--av, 36px)',
  },
  face: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-full'],
    display: 'flex',
    inset: 0,
    justifyContent: 'center',
    position: 'absolute',
  },
  c1: { backgroundImage: `linear-gradient(135deg, ${colors['--oniva-color-chart-1']}, ${colors['--oniva-color-chart-4']})` },
  c2: { backgroundImage: `linear-gradient(135deg, ${colors['--oniva-color-chart-2']}, ${colors['--oniva-color-chart-5']})` },
  c3: { backgroundImage: `linear-gradient(135deg, ${colors['--oniva-color-chart-3']}, ${colors['--oniva-color-chart-6']})` },
  c4: { backgroundImage: `linear-gradient(135deg, ${colors['--oniva-color-chart-7']}, ${colors['--oniva-color-chart-8']})` },
  dot: {
    borderColor: colors['--oniva-color-surface-inner'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 2,
    bottom: -1,
    height: 10,
    position: 'absolute',
    right: -1,
    width: 10,
  },
  idle: { backgroundColor: colors['--oniva-color-icon-subtle'] },
  working: { backgroundColor: colors['--oniva-color-success-solid'] },
  waiting: { backgroundColor: colors['--oniva-color-warning-solid'] },
  error: { backgroundColor: colors['--oniva-color-danger-solid'] },
  ripple: {
    animationDuration: '1.6s',
    animationIterationCount: 'infinite',
    animationName: { default: pulse, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundColor: colors['--oniva-color-success-solid'],
    borderRadius: radius['--oniva-radius-full'],
    inset: 0,
    position: 'absolute',
  },
});

export type AgentAvatarStatus = 'idle' | 'working' | 'waiting' | 'error';

export interface AgentAvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  /** Agent name. Initials are derived; also used as the accessible label. */
  name: string;
  status?: AgentAvatarStatus;
  /** Diameter in px. Default 36. */
  size?: number;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

const tints = [styles.c1, styles.c2, styles.c3, styles.c4];
const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('');

/** Gradient initials avatar for an agent with an optional live status dot. */
export function AgentAvatar({ name, status, size = 36, className, xstyle, ref, ...rest }: AgentAvatarProps) {
  const m = mergeSx(stylex.props(styles.root, xstyle), className, { ['--av' as string]: `${size}px` });
  return (
    <span {...rest} ref={ref} role="img" aria-label={status ? `${name}, ${status}` : name} {...m}>
      <span aria-hidden="true" {...stylex.props(styles.face, tints[hash(name) % tints.length])} style={{ fontSize: Math.round(size * 0.38) }}>
        {initials(name)}
      </span>
      {status === 'working' && <span aria-hidden="true" {...stylex.props(styles.ripple)} style={{ bottom: -1, height: 10, right: -1, width: 10, inset: 'auto -1px -1px auto' }} />}
      {status && <span aria-hidden="true" {...stylex.props(styles.dot, styles[status])} />}
    </span>
  );
}
