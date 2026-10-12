import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { mergeSx } from '../../internal/sx';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';

const styles = stylex.create({
  // Padded hit zone so the attraction starts before the pointer reaches the control.
  zone: { display: 'inline-block', padding: 'var(--mag-pad, 24px)', margin: 'calc(var(--mag-pad, 24px) * -1)' },
  mover: {
    display: 'inline-block',
    transform: {
      default: 'translate(var(--mx, 0px), var(--my, 0px))',
      [media.reducedMotion]: 'none',
    },
    transitionDuration: motion['--oniva-motion-dur-sheet'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out-expo'],
    willChange: 'transform',
  },
});

export interface MagneticButtonProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  /** Fraction of pointer offset the child follows (0-1). Default `0.35`. */
  strength?: number;
  /** Attraction zone padding around the child, px. Default `24`. */
  radius?: number;
  /** Pass any button (e.g. `<Button>`) as the child. */
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

/** Wraps a control so it drifts toward the pointer within a padded zone, easing back on leave. Mouse/pen only. */
export function MagneticButton({ strength = 0.35, radius = 24, className, xstyle, ref, children, onPointerMove, onPointerLeave, ...rest }: MagneticButtonProps) {
  return (
    <span
      {...rest}
      ref={ref}
      onPointerMove={(e) => {
        onPointerMove?.(e);
        if (e.pointerType === 'touch') return;
        const mover = e.currentTarget.firstElementChild as HTMLElement | null;
        if (!mover) return;
        const r = e.currentTarget.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        mover.style.setProperty('--mx', `${(dx * strength).toFixed(1)}px`);
        mover.style.setProperty('--my', `${(dy * strength).toFixed(1)}px`);
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        const mover = e.currentTarget.firstElementChild as HTMLElement | null;
        mover?.style.setProperty('--mx', '0px');
        mover?.style.setProperty('--my', '0px');
      }}
      {...mergeSx(stylex.props(styles.zone, xstyle), className, { ['--mag-pad' as string]: `${radius}px` })}
    >
      <span {...stylex.props(styles.mover)}>{children}</span>
    </span>
  );
}
