import type { Part } from '../shapes';
import { arrows } from './arrows';
import { marks } from './marks';
import { media } from './media';
import { misc } from './misc';
import { objects } from './objects';
import { objects2 } from './objects2';
import { layout } from './layout';
import { tech } from './tech';

// Compact (12-unit grid) drawings, keyed by glyph name (without the `Icon` suffix). `createIcon` uses them at 14px and
// below. Generated base + modifier variants inherit them from their base (see modifiers.ts).
export const COMPACT: Readonly<Record<string, () => Part[]>> = {
  ...arrows,
  ...marks,
  ...objects,
  ...objects2,
  ...tech,
  ...media,
  ...layout,
  ...misc,
};
