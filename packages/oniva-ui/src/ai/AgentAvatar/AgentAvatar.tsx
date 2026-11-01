import * as stylex from '@stylexjs/stylex';
import { BotIcon } from '../../icons/IconSet';
import type { CSSProperties, HTMLAttributes, Ref } from 'react';
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
    color: colors['--oniva-color-on-chart'],
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
    fontSize: 'var(--av-fs)',
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
    borderWidth: 'max(1px, calc(var(--av-dot) * 0.2))',
    boxSizing: 'border-box',
    // Centre the dot on the circle at 45 degrees: (1 - cos 45deg) / 2 of the diameter, minus half the dot.
    bottom: 'calc(var(--av) * 0.146 - var(--av-dot) / 2)',
    height: 'var(--av-dot)',
    position: 'absolute',
    right: 'calc(var(--av) * 0.146 - var(--av-dot) / 2)',
    width: 'var(--av-dot)',
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
    bottom: 'calc(var(--av) * 0.146 - var(--av-dot) / 2)',
    height: 'var(--av-dot)',
    position: 'absolute',
    right: 'calc(var(--av) * 0.146 - var(--av-dot) / 2)',
    width: 'var(--av-dot)',
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
    // Array.from keeps surrogate pairs (emoji, rare CJK) whole instead of cutting them in half.
    .map((w) => Array.from(w)[0]!.toUpperCase())
    .join('');

/** Gradient initials avatar for an agent with an optional live status dot. */
export function AgentAvatar({ name, status, size = 36, className, xstyle, ref, ...rest }: AgentAvatarProps) {
  const label = name.trim() || 'Agent';
  const text = initials(name);
  const vars = {
    '--av': `${size}px`,
    '--av-dot': `${Math.min(16, Math.max(6, Math.round(size * 0.28)))}px`,
    '--av-fs': `${Math.max(9, Math.round(size * 0.38))}px`,
  } as CSSProperties;
  const m = mergeSx(stylex.props(styles.root, xstyle), className, vars);
  return (
    <span {...rest} ref={ref} role="img" aria-label={status ? `${label}, ${status}` : label} {...m}>
      <span aria-hidden="true" {...stylex.props(styles.face, tints[hash(name) % tints.length])}>
        {text || <BotIcon size="55%" strokeWidth={1.5} />}
      </span>
      {status === 'working' && <span aria-hidden="true" {...stylex.props(styles.ripple)} />}
      {status && <span aria-hidden="true" {...stylex.props(styles.dot, styles[status])} />}
    </span>
  );
}
