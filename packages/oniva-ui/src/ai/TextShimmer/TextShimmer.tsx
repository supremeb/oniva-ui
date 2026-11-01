import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { Shimmer } from '../../motion/Shimmer/Shimmer';

const styles = stylex.create({
  // Shimmer is inline-block, so its box is only as tall as the inherited line-height. A tight parent line-height
  // (20px on a 24px label) then clips descenders: the gradient that paints the glyphs ends at the box edge.
  // Inline boxes are as tall as the font's content area, so the highlight always covers the full glyphs, and a
  // label that wraps keeps sweeping across its lines.
  inline: { display: 'inline' },
});

export interface TextShimmerProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

/** Text with a light sweep, for "Thinking…" style loading labels. Pauses offscreen, static under reduced motion. */
export function TextShimmer({ children, className, xstyle, ref, ...rest }: TextShimmerProps) {
  return (
    <Shimmer {...rest} ref={ref} className={className} xstyle={[styles.inline, xstyle]}>
      {children}
    </Shimmer>
  );
}
