import { VisuallyHidden as AriaVisuallyHidden } from 'react-aria';
import type { ComponentProps } from 'react';

export type VisuallyHiddenProps = ComponentProps<typeof AriaVisuallyHidden>;

/** Hides content visually but keeps it available to assistive tech. Defaults to a `span`. */
export function VisuallyHidden({ elementType = 'span', ...props }: VisuallyHiddenProps) {
  return <AriaVisuallyHidden {...props} elementType={elementType} />;
}
