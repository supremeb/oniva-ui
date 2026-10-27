import * as stylex from '@stylexjs/stylex';

/**
 * Depth is semantic: one token per level, each meaning exactly one thing (docs/research/depth-system.md).
 *  flat       no shadow, hairline border only (cards, trays, tiles)
 *  recessed   a channel that holds something (switch/slider/progress track, inputs)
 *  raised     an object you grab or press that sits ON a surface (knob, thumb, pill)
 *  floating   a separate layer (menu, popover, tooltip, toast)
 *  overlay    the modal layer (dialog, sheet), paired with a scrim
 * One light source from the top. Dark values live in themes/themes.ts (`darkShadowTheme`).
 */
export const shadow = stylex.defineVars({
  // ---- semantic elevation (use these in new code) ----
  /** Hairline + tight contact + soft ambient. Never grows on press. */
  '--oniva-elevation-raised': '0 0 0 1px #0000000f, 0 1px 1px #00000014, 0 2px 5px -1px #0000001f',
  /** Hover lift: a touch more ambient, same contact. */
  '--oniva-elevation-raised-hover':
    '0 0 0 1px #00000014, 0 1px 1px #00000014, 0 3px 7px -1px #00000029',
  /** Press flattens: contact only, ambient gone. */
  '--oniva-elevation-pressed': '0 0 0 1px #0000000f, 0 0 1px #00000014',
  /** Very subtle inner top shadow. No outer shadow. */
  '--oniva-elevation-recessed': 'inset 0 1px 2px #00000014',
  /** Ambient + key shadow + hairline. */
  '--oniva-elevation-floating':
    '0 0 0 1px #0000000f, 0 1px 2px #0000000a, 0 4px 8px -2px #00000014, 0 12px 24px -6px #0000001f',
  /** Largest shadow; always with a scrim. */
  '--oniva-elevation-overlay':
    '0 0 0 1px #0000000f, 0 2px 4px #0000000a, 0 12px 24px -4px #00000024, 0 32px 64px -16px #00000040',

  // ---- legacy scale (kept for compatibility; prefer the semantic tokens) ----
  /** Legacy hairline lift under flat cards. New code: no shadow (flat). */
  '--oniva-shadow-card': '0 1px 1px #0000000d',
  '--oniva-shadow-xs': '0 1px 2px #0000000d',
  /** Alias of elevation-raised. */
  '--oniva-shadow-sm': '0 0 0 1px #0000000f, 0 1px 1px #00000014, 0 2px 5px -1px #0000001f',
  '--oniva-shadow-md': '0 2px 4px -1px #0000000f, 0 4px 6px -1px #0000001a',
  '--oniva-shadow-lg': '0 4px 6px -2px #0000000d, 0 10px 15px -3px #0000001a',
  /** Alias of elevation-overlay. */
  '--oniva-shadow-xl':
    '0 0 0 1px #0000000f, 0 2px 4px #0000000a, 0 12px 24px -4px #00000024, 0 32px 64px -16px #00000040',
  /** Alias of elevation-floating. */
  '--oniva-shadow-dropdown':
    '0 0 0 1px #0000000f, 0 1px 2px #0000000a, 0 4px 8px -2px #00000014, 0 12px 24px -6px #0000001f',
  '--oniva-shadow-float': '0 1px 0 #00000005, 0 1px 12px #0000000f, 0 0 1px #00000052',
  /** Legacy inner highlight on solid accent surfaces. Switch, checkbox, radio no longer use it (flat fill). */
  // Edge is translucent black so it always reads as a slightly darker rim of whatever fill sits under it
  // (was accent-500, which showed as a lighter outline once solid fills moved to 600/700 for contrast).
  '--oniva-shadow-accent-inset':
    'inset 0 1.75px 0 0 rgb(255 255 255 / 0.25), inset 0 0 0 0.875px rgb(0 0 0 / 0.14)',
  '--oniva-shadow-danger-inset':
    'inset 0 1.75px 0 0 rgb(255 255 255 / 0.25), inset 0 0 0 0.875px rgb(0 0 0 / 0.14)',
});
