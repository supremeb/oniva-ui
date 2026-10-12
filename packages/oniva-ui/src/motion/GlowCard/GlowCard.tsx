import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { releasePointer, trackPointer } from '../../internal/n3-hooks';
import { mergeSx } from '../../internal/sx';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  root: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-card'],
    borderStyle: 'solid',
    borderWidth: 1,
    isolation: 'isolate',
    overflow: 'hidden',
    position: 'relative',
  },
  glow: {
    backgroundImage: `radial-gradient(circle closest-side, color-mix(in srgb, ${accent['--oniva-accent-500']} 28%, transparent), transparent)`,
    height: 360,
    left: 0,
    marginLeft: -180,
    marginTop: -180,
    opacity: 'var(--go, 0)',
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    transform: 'translate(var(--gx, 50%), var(--gy, 50%))',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: 360,
    willChange: { default: 'auto', ':hover': 'transform', ':focus-within': 'transform' },
    zIndex: -1,
    display: { default: null, [media.reducedMotion]: 'none' },
  },
});

export interface GlowCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Card with a soft accent glow that follows the pointer (CSS vars `--gx/--gy`, updated without re-rendering). Mouse/pen only. */
export function GlowCard({ className, xstyle, ref, children, onPointerMove, onPointerLeave, ...rest }: GlowCardProps) {
  return (
    <div
      {...rest}
      ref={ref}
      onPointerMove={(e) => {
        trackPointer(e);
        onPointerMove?.(e);
      }}
      onPointerLeave={(e) => {
        releasePointer(e);
        onPointerLeave?.(e);
      }}
      {...mergeSx(stylex.props(styles.root, xstyle), className)}
    >
      <span aria-hidden="true" {...stylex.props(styles.glow)} />
      {children}
    </div>
  );
}
