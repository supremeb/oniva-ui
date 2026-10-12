import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { enterExit } from '../../internal/motion-styles';
import { mergeSx } from '../../internal/sx';
import { useInView } from './useInView';

export interface InViewProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Entry animation played once the element scrolls into view. Default `'slide'`. */
  preset?: 'fade' | 'scale' | 'slide' | 'blur';
  rootMargin?: string;
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const hidden = stylex.create({ pre: { opacity: 0 } });

/** Plays an enter preset once when scrolled into view (hidden until then). */
export function InView({ preset = 'slide', rootMargin = '0px 0px -10% 0px', className, xstyle, ref, children, ...rest }: InViewProps) {
  const { ref: viewRef, inView } = useInView<HTMLDivElement>({ rootMargin });
  const sx = stylex.props(enterExit[preset], !inView && hidden.pre, xstyle);
  return (
    <div
      {...rest}
      ref={(n) => {
        viewRef(n);
        if (typeof ref === 'function') ref(n);
        else if (ref) ref.current = n;
      }}
      data-state={inView ? 'entering' : undefined}
      {...mergeSx(sx, className)}
    >
      {children}
    </div>
  );
}
