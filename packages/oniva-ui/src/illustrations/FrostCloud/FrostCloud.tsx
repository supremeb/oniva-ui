import { CloudScene, type CloudColor } from '../../internal/w7-cloud';
import type { IllustrationProps } from '../../internal/w7-scene';

export interface FrostCloudProps extends IllustrationProps {
  /** Sky: blue-to-cyan or red-to-orange. */
  color?: CloudColor;
  /** Fill the whole box with the sky. `false` leaves the cloud on a transparent background. */
  background?: boolean;
  /** The eyes follow the pointer while it is over the illustration. */
  followPointer?: boolean;
}

/**
 * A frosted white cloud with eyes cut out of it. It floats, glances around, blinks, follows the pointer and
 * bounces with a wink when clicked. Runs only while on screen; under reduced motion it keeps still and only reacts to clicks.
 */
export function FrostCloud({ color = 'orange', ...rest }: FrostCloudProps) {
  return <CloudScene variant="frost" color={color} {...rest} />;
}
