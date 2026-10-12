import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { useRef } from 'react';
import { mergeRefs } from '../../internal/n3-hooks';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { media } from '../../tokens/media.stylex';
import { radius } from '../../tokens/radius.stylex';

const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const styles = stylex.create({
  // Flat OUTER wrapper owns the pointer events and perspective: it never moves, so the hit area can't flicker at the edges.
  outer: { display: 'block', perspective: '1000px' },
  inner: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-card'],
    borderStyle: 'solid',
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
    transform: {
      default: 'rotateX(var(--tx, 0deg)) rotateY(var(--ty, 0deg))',
      [media.reducedMotion]: 'none',
    },
    transitionDuration: 'var(--tilt-dur, 1000ms)',
    transitionProperty: 'transform',
    transitionTimingFunction: EASE,
    willChange: 'transform',
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
    transitionTimingFunction: EASE,
    display: { default: null, [media.reducedMotion]: 'none' },
  },
});

export interface TiltCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Max rotation in degrees. Default `8`. */
  maxTilt?: number;
  /** Show a pointer-following sheen. Default `true`. */
  glare?: boolean;
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** 3D hover tilt: perspective 1000px, follows in 400ms, returns in 1000ms. Pointer tracked on a flat outer wrapper. */
export function TiltCard({ maxTilt = 8, glare = true, className, xstyle, ref, children, onPointerMove, onPointerLeave, ...rest }: TiltCardProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const set = (vars: Record<string, string>) => {
    const el = innerRef.current;
    if (el) for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v);
  };
  return (
    <div
      {...rest}
      ref={mergeRefs(ref)}
      onPointerMove={(e) => {
        onPointerMove?.(e);
        if (e.pointerType === 'touch') return;
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        set({
          '--tx': `${((0.5 - py) * 2 * maxTilt).toFixed(2)}deg`,
          '--ty': `${((px - 0.5) * 2 * maxTilt).toFixed(2)}deg`,
          '--gx': `${(px * 100).toFixed(1)}%`,
          '--gy': `${(py * 100).toFixed(1)}%`,
          '--go': '1',
          '--tilt-dur': '400ms',
        });
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        set({ '--tx': '0deg', '--ty': '0deg', '--go': '0', '--tilt-dur': '1000ms' });
      }}
      {...mergeSx(stylex.props(styles.outer), className)}
    >
      <div ref={innerRef} {...stylex.props(styles.inner, xstyle)}>
        {children}
        {glare ? <span aria-hidden="true" {...stylex.props(styles.glare)} /> : null}
      </div>
    </div>
  );
}
