import * as stylex from '@stylexjs/stylex';
import { Children } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { mergeSx } from '../../internal/sx';

const rise = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(var(--oniva-motion-travel))' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

const styles = stylex.create({
  root: { display: 'contents' },
  item: {
    animationDelay: `calc(var(--oniva-i, 0) * ${motion['--oniva-motion-stagger']})`,
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: rise, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
});

export interface StaggerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Max steps that add delay (later children share the last delay). Default 6 (~210ms). */
  max?: number;
  /** Class for each wrapper (e.g. to forward grid-item layout). */
  itemClassName?: string;
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Children rise in (8px, 250ms ease-out) one after another on mount, with a capped total delay.
 * Each child is wrapped in a `display: block` element; the root is `display: contents` unless you
 * style it via `xstyle`. Animation is CSS-only, so re-renders never replay it.
 */
export function Stagger({ max = 6, itemClassName, className, xstyle, ref, children, ...rest }: StaggerProps) {
  const root = stylex.props(styles.root, xstyle);
  const item = stylex.props(styles.item);
  return (
    <div {...rest} ref={ref} {...mergeSx(root, className)}>
      {Children.toArray(children).map((child, i) => (
        <div
          key={(child as { key?: string }).key ?? i}
          className={[item.className, itemClassName].filter(Boolean).join(' ')}
          style={{ '--oniva-i': Math.min(i, max) } as CSSProperties}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
