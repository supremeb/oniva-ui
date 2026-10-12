import * as stylex from '@stylexjs/stylex';
import type { CSSProperties, HTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { mergeSx } from '../../internal/sx';

const wave = stylex.keyframes({
  '0%, 60%, 100%': { opacity: 0.4, transform: 'translateY(0)' },
  '30%': { opacity: 1, transform: 'translateY(-4px)' },
});
const pulse = stylex.keyframes({
  '0%, 100%': { opacity: 0.35 },
  '50%': { opacity: 1 },
});

const styles = stylex.create({
  root: { alignItems: 'center', display: 'inline-flex', gap: 4, height: 16 },
  dot: {
    animationDelay: 'calc(var(--oniva-i, 0) * 140ms)',
    animationDuration: '1200ms',
    animationIterationCount: 'infinite',
    animationName: { default: wave, [media.reducedMotion]: pulse },
    animationTimingFunction: motion['--oniva-motion-ease-in-out'],
    backgroundColor: colors['--oniva-color-icon-muted'],
    borderRadius: radius['--oniva-radius-full'],
    height: 6,
    width: 6,
  },
});

export interface TypingIndicatorProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style' | 'children'> {
  /** Accessible label. Default "Assistant is typing". */
  label?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

/** Three-dot wave shown while the assistant is typing. Transform + opacity only; pulses under reduced motion. */
export function TypingIndicator({ label = 'Assistant is typing', className, xstyle, ref, ...rest }: TypingIndicatorProps) {
  const sx = stylex.props(styles.root, xstyle);
  return (
    <span {...rest} ref={ref} role="status" aria-label={label} {...mergeSx(sx, className)}>
      {[0, 1, 2].map((i) => (
        <span key={i} aria-hidden="true" style={{ '--oniva-i': i } as CSSProperties} {...stylex.props(styles.dot)} />
      ))}
    </span>
  );
}
