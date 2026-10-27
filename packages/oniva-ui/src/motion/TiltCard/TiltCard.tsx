import * as stylex from '@stylexjs/stylex';
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import { useEffect, useRef } from 'react';
import { mergeRefs } from '../../internal/n3-hooks';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const styles = stylex.create({
  // Flat OUTER wrapper owns the pointer events and perspective: it never moves, so the hit area can't flicker at the edges.
  outer: {
    display: 'block',
    perspective: 'var(--oniva-tilt-persp, 1000px)',
  },
  inner: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-card'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: {
      default: 'none',
      ':hover': { default: null, [media.hover]: shadow['--oniva-shadow-lg'] },
      ':focus-within': shadow['--oniva-shadow-md'],
    },
    overflow: 'hidden',
    position: 'relative',
    // Focus inside the card lifts it, so focus is visible in the motion too (the ring on the control itself stays).
    translate: { default: 'none', ':focus-within': '0 -2px' },
    transform: {
      default: 'rotateX(var(--tx, 0deg)) rotateY(var(--ty, 0deg)) scale(var(--ts, 1))',
      [media.reducedMotion]: 'none',
    },
    transitionDuration: 'var(--tilt-dur, 1000ms), 200ms, 200ms',
    transitionProperty: 'transform, translate, box-shadow',
    transitionTimingFunction: `var(--tilt-ease, ${motion['--oniva-motion-ease-out']}), ${motion['--oniva-motion-ease-out']}, ${motion['--oniva-motion-ease-out']}`,
    willChange: { default: 'auto', ':hover': 'transform', ':focus-within': 'transform' },
  },
  glare: {
    backgroundImage: `radial-gradient(circle closest-side at var(--gx, 50%) var(--gy, 50%), color-mix(in srgb, ${colors['--oniva-color-bg']} 55%, transparent), transparent)`,
    borderRadius: 'inherit',
    inset: 0,
    opacity: 'var(--go, 0)',
    pointerEvents: 'none',
    position: 'absolute',
    transitionDuration: '300ms',
    transitionProperty: 'opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    display: { default: null, [media.reducedMotion]: 'none' },
  },
});

export interface TiltCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Max rotation in degrees. Default `8`. */
  maxTilt?: number;
  /** Show a pointer-following sheen. Default `true`. */
  glare?: boolean;
  /** Scale while the pointer is over the card. Default `1`. */
  scale?: number;
  /** Perspective distance in px, smaller is more dramatic. Default `1000`. */
  perspective?: number;
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/**
 * 3D hover tilt: follows the pointer in 400ms (writes batched with requestAnimationFrame), springs back with a small
 * overshoot in 1000ms. Touch pointers don't tilt; focus inside lifts the card; reduced motion keeps only the shadow change.
 */
export function TiltCard({
  maxTilt = 8,
  glare = true,
  scale = 1,
  perspective = 1000,
  className,
  xstyle,
  ref,
  children,
  onPointerMove,
  onPointerLeave,
  ...rest
}: TiltCardProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const pending = useRef<Record<string, string> | null>(null);
  const flush = () => {
    raf.current = 0;
    const el = innerRef.current;
    const vars = pending.current;
    pending.current = null;
    if (el && vars) for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v);
  };
  const set = (vars: Record<string, string>) => {
    pending.current = vars;
    if (!raf.current) raf.current = requestAnimationFrame(flush);
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const outerVars = perspective !== 1000 ? ({ '--oniva-tilt-persp': `${perspective}px` } as CSSProperties) : undefined;
  return (
    <div
      {...rest}
      ref={mergeRefs(ref)}
      onPointerMove={(e) => {
        onPointerMove?.(e);
        if (e.pointerType === 'touch') return;
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / (r.width || 1);
        const py = (e.clientY - r.top) / (r.height || 1);
        set({
          '--tx': `${((0.5 - py) * 2 * maxTilt).toFixed(2)}deg`,
          '--ty': `${((px - 0.5) * 2 * maxTilt).toFixed(2)}deg`,
          '--ts': String(scale),
          '--gx': `${(px * 100).toFixed(1)}%`,
          '--gy': `${(py * 100).toFixed(1)}%`,
          '--go': '1',
          '--tilt-dur': '400ms',
          '--tilt-ease': motion['--oniva-motion-ease-out'],
        });
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        set({
          '--tx': '0deg',
          '--ty': '0deg',
          '--ts': '1',
          '--go': '0',
          '--tilt-dur': '1000ms',
          '--tilt-ease': motion['--oniva-motion-ease-spring'],
        });
      }}
      {...mergeSx(stylex.props(styles.outer), className, outerVars)}
    >
      <div ref={innerRef} {...stylex.props(styles.inner, xstyle)}>
        {children}
        {glare ? <span aria-hidden="true" {...stylex.props(styles.glare)} /> : null}
      </div>
    </div>
  );
}
