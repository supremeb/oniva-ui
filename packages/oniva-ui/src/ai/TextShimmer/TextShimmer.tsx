import type { HTMLAttributes, ReactNode, Ref } from 'react';
import type * as stylex from '@stylexjs/stylex';
import { Shimmer } from '../../motion/Shimmer/Shimmer';

export interface TextShimmerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

/** Text with a light sweep, for "Thinking…" style loading labels. Pauses offscreen, static under reduced motion. */
export function TextShimmer({ children, className, xstyle, ref, ...rest }: TextShimmerProps) {
  return (
    <Shimmer {...rest} ref={ref} className={className} xstyle={xstyle}>
      {children}
    </Shimmer>
  );
}
