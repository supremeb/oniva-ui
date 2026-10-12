import * as stylex from '@stylexjs/stylex';
import { space } from '../tokens/space.stylex';

/** Names are the pixel values of the space scale. */
export type SpaceStep = 0 | 1 | 2 | 4 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 64 | 96;

export const gapStyles = stylex.create({
  g0: { gap: space['--oniva-space-0'] },
  g1: { gap: space['--oniva-space-1'] },
  g2: { gap: space['--oniva-space-2'] },
  g4: { gap: space['--oniva-space-4'] },
  g6: { gap: space['--oniva-space-6'] },
  g8: { gap: space['--oniva-space-8'] },
  g10: { gap: space['--oniva-space-10'] },
  g12: { gap: space['--oniva-space-12'] },
  g16: { gap: space['--oniva-space-16'] },
  g20: { gap: space['--oniva-space-20'] },
  g24: { gap: space['--oniva-space-24'] },
  g32: { gap: space['--oniva-space-32'] },
  g40: { gap: space['--oniva-space-40'] },
  g48: { gap: space['--oniva-space-48'] },
  g64: { gap: space['--oniva-space-64'] },
  g96: { gap: space['--oniva-space-96'] },
});

export const paddingStyles = stylex.create({
  p0: { padding: space['--oniva-space-0'] },
  p4: { padding: space['--oniva-space-4'] },
  p8: { padding: space['--oniva-space-8'] },
  p12: { padding: space['--oniva-space-12'] },
  p16: { padding: space['--oniva-space-16'] },
  p20: { padding: space['--oniva-space-20'] },
  p24: { padding: space['--oniva-space-24'] },
  p32: { padding: space['--oniva-space-32'] },
});

export type PaddingStep = 0 | 4 | 8 | 12 | 16 | 20 | 24 | 32;

export function gapStyle(gap: SpaceStep) {
  return gapStyles[`g${gap}` as const];
}
export function paddingStyle(p: PaddingStep) {
  return paddingStyles[`p${p}` as const];
}
