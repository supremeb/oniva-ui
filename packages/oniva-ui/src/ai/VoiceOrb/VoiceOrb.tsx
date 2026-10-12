import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, Ref } from 'react';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { mergeSx } from '../../internal/sx';

const breathe = stylex.keyframes({
  '0%, 100%': { transform: 'scale(1)' },
  '50%': { transform: 'scale(1.06)' },
});
const listen = stylex.keyframes({
  '0%': { opacity: 0.5, transform: 'scale(1)' },
  '100%': { opacity: 0, transform: 'scale(1.5)' },
});
const think = stylex.keyframes({ to: { transform: 'rotate(360deg)' } });
const speak = stylex.keyframes({
  '0%, 100%': { transform: 'scale(1)' },
  '30%': { transform: 'scale(1.1)' },
  '60%': { transform: 'scale(0.97)' },
});

const styles = stylex.create({
  root: {
    alignItems: 'center',
    display: 'inline-flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    gap: 10,
  },
  stage: { height: 'var(--orb, 96px)', position: 'relative', width: 'var(--orb, 96px)' },
  orb: {
    backgroundImage: `radial-gradient(circle at 30% 28%, ${accent['--oniva-accent-200']}, ${accent['--oniva-accent-500']} 55%, ${accent['--oniva-accent-800']})`,
    borderRadius: radius['--oniva-radius-full'],
    boxShadow: `inset 0 -6px 14px ${accent['--oniva-accent-900']}, inset 0 4px 10px ${accent['--oniva-accent-100']}`,
    inset: 0,
    overflow: 'hidden',
    position: 'absolute',
  },
  swirl: {
    backgroundImage: `conic-gradient(from 0deg, transparent 0 55%, ${accent['--oniva-accent-100']} 75%, transparent 100%)`,
    inset: 0,
    mixBlendMode: 'soft-light',
    opacity: 0.8,
    position: 'absolute',
  },
  idle: {
    animationDuration: '4s',
    animationIterationCount: 'infinite',
    animationName: { default: breathe, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-in-out'],
  },
  speaking: {
    animationDuration: '1.1s',
    animationIterationCount: 'infinite',
    animationName: { default: speak, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-in-out'],
  },
  thinking: {
    animationDuration: '1.6s',
    animationIterationCount: 'infinite',
    animationName: { default: think, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
  },
  halo: {
    animationDuration: '1.8s',
    animationIterationCount: 'infinite',
    animationName: { default: listen, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    borderColor: accent['--oniva-accent-400'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 2,
    inset: 0,
    pointerEvents: 'none',
    position: 'absolute',
  },
  halo2: { animationDelay: '0.9s' },
  label: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
  },
});

export type VoiceOrbState = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface VoiceOrbProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  state?: VoiceOrbState;
  /** Diameter in px. Default 96. */
  size?: number;
  /** Agent name; shown with the state as the caption. */
  name?: string;
  hideLabel?: boolean;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const captions: Record<VoiceOrbState, string> = {
  idle: 'Ready',
  listening: 'Listening…',
  thinking: 'Thinking…',
  speaking: 'Speaking…',
};

/** Agent persona orb. Gradient sphere with state-specific motion; static under reduced motion. */
export function VoiceOrb({
  state = 'idle',
  size = 96,
  name,
  hideLabel,
  className,
  xstyle,
  ref,
  ...rest
}: VoiceOrbProps) {
  const sx = stylex.props(styles.root, xstyle);
  const m = mergeSx(sx, className, { ['--orb' as string]: `${size}px` });
  return (
    <div {...rest} ref={ref} role="status" aria-label={`${name ?? 'Agent'}: ${captions[state]}`} {...m}>
      <div {...stylex.props(styles.stage)}>
        {state === 'listening' && (
          <>
            <span aria-hidden="true" {...stylex.props(styles.halo)} />
            <span aria-hidden="true" {...stylex.props(styles.halo, styles.halo2)} />
          </>
        )}
        <div
          aria-hidden="true"
          {...stylex.props(
            styles.orb,
            state === 'idle' && styles.idle,
            state === 'listening' && styles.idle,
            state === 'speaking' && styles.speaking,
          )}
        >
          {state === 'thinking' && <span {...stylex.props(styles.swirl, styles.thinking)} />}
        </div>
      </div>
      {!hideLabel && (
        <span {...stylex.props(styles.label)}>
          {name ? `${name} · ` : ''}
          {captions[state]}
        </span>
      )}
    </div>
  );
}
