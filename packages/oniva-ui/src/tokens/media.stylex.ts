import * as stylex from '@stylexjs/stylex';

/** Shared media-query keys for `stylex.create` conditions: `{ default: x, [media.reducedMotion]: y }`. */
export const media = stylex.defineConsts({
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
  forcedColors: '@media (forced-colors: active)',
  /** Hover styles only on devices that really hover (no sticky hover after a tap): `':hover': { default: null, [media.hover]: x }`. */
  hover: '@media (hover: hover)',
  /** `prefers-contrast: more` */
  contrast: '@media (prefers-contrast: more)',
});
