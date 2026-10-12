import { RingFrame } from '../../internal/n3-ring';
import type { RingFrameProps } from '../../internal/n3-ring';

export type ShineBorderProps = RingFrameProps;

/** A full multi-stop gradient ring slowly rotating around the border. Pauses offscreen, static under reduced motion. */
export function ShineBorder(props: ShineBorderProps) {
  return <RingFrame variant="shine" {...props} />;
}
