import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { useState } from 'react';
import { useReducedMotion } from '../../internal/motion-hooks';
import { mergeSx } from '../../internal/sx';
import { accent } from '../../tokens/accent.stylex';

const grow = stylex.keyframes({
  from: { opacity: 0.4, transform: 'translate(-50%, -50%) scale(0.2)' },
  to: { opacity: 0, transform: 'translate(-50%, -50%) scale(1)' },
});

const styles = stylex.create({
  root: { overflow: 'hidden', position: 'relative' },
  wave: {
    animationDuration: '600ms',
    animationFillMode: 'forwards',
    animationName: grow,
    animationTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
    backgroundColor: accent['--oniva-accent-500'],
    borderRadius: '50%',
    pointerEvents: 'none',
    position: 'absolute',
  },
});

interface Wave {
  id: number;
  x: number;
  y: number;
  size: number;
}

export interface RippleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

let seq = 0;

/** Click ripple (radial scale 600ms from the pointer). Wrap a card/button surface; skipped under reduced motion. */
export function Ripple({ className, xstyle, ref, children, onPointerDown, ...rest }: RippleProps) {
  const [waves, setWaves] = useState<Wave[]>([]);
  const reduced = useReducedMotion();
  return (
    <div
      {...rest}
      ref={ref}
      onPointerDown={(e) => {
        onPointerDown?.(e);
        if (reduced) return;
        const r = e.currentTarget.getBoundingClientRect();
        const size = Math.hypot(Math.max(e.clientX - r.left, r.right - e.clientX), Math.max(e.clientY - r.top, r.bottom - e.clientY)) * 2;
        setWaves((w) => [...w, { id: ++seq, x: e.clientX - r.left, y: e.clientY - r.top, size }]);
      }}
      {...mergeSx(stylex.props(styles.root, xstyle), className)}
    >
      {children}
      {waves.map((w) => (
        <span
          key={w.id}
          aria-hidden="true"
          data-ripple=""
          onAnimationEnd={() => setWaves((all) => all.filter((x) => x.id !== w.id))}
          {...stylex.props(styles.wave)}
          style={{ height: w.size, left: w.x, top: w.y, width: w.size }}
        />
      ))}
    </div>
  );
}
