import { RingFrame } from '../../internal/n3-ring';
import type { RingFrameProps } from '../../internal/n3-ring';

export type BorderBeamProps = RingFrameProps;

/** A single light beam orbiting the border (masked conic gradient, transform-only). Pauses offscreen, static under reduced motion. */
export function BorderBeam(props: BorderBeamProps) {
  return <RingFrame variant="beam" {...props} />;
}
