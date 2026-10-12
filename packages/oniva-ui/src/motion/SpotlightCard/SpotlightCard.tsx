import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { releasePointer, trackPointer } from '../../internal/n3-hooks';
import { mergeSx } from '../../internal/sx';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const fade = {
  opacity: 'var(--go, 0)',
  transitionDuration: motion['--oniva-motion-dur-slow'],
  transitionProperty: 'opacity',
  transitionTimingFunction: motion['--oniva-motion-ease-out'],
} as const;

const styles = stylex.create({
  root: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-card'],
    borderStyle: 'solid',
    borderWidth: 1,
    isolation: 'isolate',
    overflow: 'hidden',
    position: 'relative',
  },
  layer: { inset: 0, pointerEvents: 'none', position: 'absolute', display: { default: null, [media.reducedMotion]: 'none' } },
  // The border ring: only the 1px edge shows the spotlight.
  ring: {
    ...fade,
    maskComposite: 'exclude',
    padding: 1,
    maskImage: 'linear-gradient(#000 0 0), linear-gradient(#000 0 0)',
    maskClip: 'content-box, border-box',
    WebkitMaskImage: 'linear-gradient(#000 0 0), linear-gradient(#000 0 0)',
    borderRadius: 'inherit',
    overflow: 'hidden',
  },
  wash: { ...fade, overflow: 'hidden' },
  orb: {
    height: 320,
    left: 0,
    marginLeft: -160,
    marginTop: -160,
    position: 'absolute',
    top: 0,
    transform: 'translate(var(--gx, 50%), var(--gy, 50%))',
    width: 320,
    willChange: 'transform',
  },
  ringOrb: {
    backgroundImage: `radial-gradient(circle closest-side, ${accent['--oniva-accent-500']}, transparent)`,
  },
  washOrb: {
    backgroundImage: `radial-gradient(circle closest-side, color-mix(in srgb, ${colors['--oniva-color-text']} 7%, transparent), transparent)`,
  },
  content: { position: 'relative' },
});

export interface SpotlightCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Card whose border edge and surface light up under the pointer (a spotlight, not a glow). Mouse/pen only. */
export function SpotlightCard({ className, xstyle, ref, children, onPointerMove, onPointerLeave, ...rest }: SpotlightCardProps) {
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
      <span aria-hidden="true" {...stylex.props(styles.layer, styles.wash)}>
        <span {...stylex.props(styles.orb, styles.washOrb)} />
      </span>
      <span aria-hidden="true" {...stylex.props(styles.layer, styles.ring)}>
        <span {...stylex.props(styles.orb, styles.ringOrb)} />
      </span>
      <div {...stylex.props(styles.content)}>{children}</div>
    </div>
  );
}
