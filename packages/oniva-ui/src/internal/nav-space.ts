import * as stylex from '@stylexjs/stylex';
import { space } from '../tokens/space.stylex';

/** Names are the pixel values of the space scale. */
export type SpaceStep = 0 | 1 | 2 | 4 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 64 | 96;

export const gapStyles = stylex.create({
  g0: { gap: space.s0 },
  g1: { gap: space.s1 },
  g2: { gap: space.s2 },
  g4: { gap: space.s4 },
  g6: { gap: space.s6 },
  g8: { gap: space.s8 },
  g10: { gap: space.s10 },
  g12: { gap: space.s12 },
  g16: { gap: space.s16 },
  g20: { gap: space.s20 },
  g24: { gap: space.s24 },
  g32: { gap: space.s32 },
  g40: { gap: space.s40 },
  g48: { gap: space.s48 },
  g64: { gap: space.s64 },
  g96: { gap: space.s96 },
});

export const paddingStyles = stylex.create({
  p0: { padding: space.s0 },
  p4: { padding: space.s4 },
  p8: { padding: space.s8 },
  p12: { padding: space.s12 },
  p16: { padding: space.s16 },
  p20: { padding: space.s20 },
  p24: { padding: space.s24 },
  p32: { padding: space.s32 },
});

export type PaddingStep = 0 | 4 | 8 | 12 | 16 | 20 | 24 | 32;

export function gapStyle(gap: SpaceStep) {
  return gapStyles[`g${gap}` as const];
}
export function paddingStyle(p: PaddingStep) {
  return paddingStyles[`p${p}` as const];
}
