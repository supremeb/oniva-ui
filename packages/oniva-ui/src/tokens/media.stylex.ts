import * as stylex from '@stylexjs/stylex';

/** Shared media-query keys for `stylex.create` conditions: `{ default: x, [media.reducedMotion]: y }`. */
export const media = stylex.defineConsts({
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
  forcedColors: '@media (forced-colors: active)',
});
