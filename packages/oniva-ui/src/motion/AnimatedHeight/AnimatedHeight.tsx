import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { motion } from '../../tokens/motion.stylex';
import { mergeSx } from '../../internal/sx';

const styles = stylex.create({
  root: {
    display: 'grid',
    gridTemplateRows: { default: '0fr', '[data-open]': '1fr' },
    // visibility interpolates discretely: stays visible for the whole close, hidden at the end.
    transitionDuration: motion['--oniva-motion-dur-height'],
    transitionProperty: 'grid-template-rows, visibility',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    visibility: { default: 'hidden', '[data-open]': 'visible' },
  },
  inner: {
    minHeight: 0,
    opacity: { default: 0, '[data-open]': 1 },
    overflow: 'hidden',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
});

/**
 * Props for a disclosure body that animates 0 -> auto height via `grid-template-rows: 0fr -> 1fr`.
 * Put `rootProps` on the outer wrapper and `innerProps` on its single child (which clips content).
 * Closed content is `inert` so it can't be focused. Interruptible (pure CSS transition).
 */
export function useAnimatedHeight(isOpen: boolean) {
  return {
    rootProps: { ...stylex.props(styles.root), 'data-open': isOpen ? '' : undefined },
    innerProps: { ...stylex.props(styles.inner), 'data-open': isOpen ? '' : undefined, inert: !isOpen },
  };
}

export interface AnimatedHeightProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  isOpen: boolean;
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Animates height between 0 and content height. Use for Accordion / Collapsible / expandable rows. */
export function AnimatedHeight({ isOpen, children, className, xstyle, ref, ...rest }: AnimatedHeightProps) {
  const sx = stylex.props(styles.root, xstyle);
  const inner = stylex.props(styles.inner);
  return (
    <div {...rest} ref={ref} data-open={isOpen ? '' : undefined} {...mergeSx(sx, className)}>
      <div {...inner} data-open={isOpen ? '' : undefined} inert={!isOpen}>
        {children}
      </div>
    </div>
  );
}
