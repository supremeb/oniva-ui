import * as stylex from '@stylexjs/stylex';
import { media } from '../tokens/media.stylex';
import { colors } from '../tokens/colors.stylex';
import { font } from '../tokens/font.stylex';

const grow = stylex.keyframes({ from: { transform: 'scaleY(0)' }, to: { transform: 'scaleY(1)' } });
const growX = stylex.keyframes({
  from: { transform: 'scaleX(0)' },
  to: { transform: 'scaleX(1)' },
});
const fade = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const draw = stylex.keyframes({ from: { strokeDashoffset: 1 }, to: { strokeDashoffset: 0 } });
const wipe = stylex.keyframes({
  from: { clipPath: 'inset(0 100% 0 0)' },
  to: { clipPath: 'inset(0 0 0 0)' },
});
const pop = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(0.6)' },
  to: { opacity: 1, transform: 'scale(1)' },
});

/** Entrances start paused and are released by ChartFrame (`--oniva-chart-play: running`) on first in-view, so they play once. */

/** Entrance animations (ease-out, <=450ms; collapse to 0ms for reduced motion). Stagger with `staggerDelay()`. */
export const chartMotion = stylex.create({
  grow: {
    animationDuration: { default: '450ms', [media.reducedMotion]: '0ms' },
    animationFillMode: 'backwards',
    animationName: grow,
    // eslint-disable-next-line @stylexjs/valid-styles -- var() lets ChartFrame release the entrance on first in-view
    animationPlayState: 'var(--oniva-chart-play, running)',
    animationTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
    transformBox: 'fill-box',
    transformOrigin: '50% 100%',
  },
  growX: {
    animationDuration: { default: '450ms', [media.reducedMotion]: '0ms' },
    animationFillMode: 'backwards',
    animationName: growX,
    // eslint-disable-next-line @stylexjs/valid-styles -- var() lets ChartFrame release the entrance on first in-view
    animationPlayState: 'var(--oniva-chart-play, running)',
    animationTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
    transformBox: 'fill-box',
    transformOrigin: '0% 50%',
  },
  fade: {
    animationDuration: { default: '400ms', [media.reducedMotion]: '0ms' },
    animationFillMode: 'backwards',
    animationName: fade,
    // eslint-disable-next-line @stylexjs/valid-styles -- var() lets ChartFrame release the entrance on first in-view
    animationPlayState: 'var(--oniva-chart-play, running)',
    animationTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
  },
  draw: {
    animationDuration: { default: '800ms', [media.reducedMotion]: '0ms' },
    animationFillMode: 'backwards',
    animationName: draw,
    // eslint-disable-next-line @stylexjs/valid-styles -- var() lets ChartFrame release the entrance on first in-view
    animationPlayState: 'var(--oniva-chart-play, running)',
    animationTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
    strokeDasharray: 1,
  },
  /** Left-to-right clip reveal (area fills). */
  wipe: {
    animationDuration: { default: '800ms', [media.reducedMotion]: '0ms' },
    animationFillMode: 'backwards',
    animationName: wipe,
    // eslint-disable-next-line @stylexjs/valid-styles -- var() lets ChartFrame release the entrance on first in-view
    animationPlayState: 'var(--oniva-chart-play, running)',
    animationTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
  },
  pop: {
    animationDuration: { default: '350ms', [media.reducedMotion]: '0ms' },
    animationFillMode: 'backwards',
    animationName: pop,
    // eslint-disable-next-line @stylexjs/valid-styles -- var() lets ChartFrame release the entrance on first in-view
    animationPlayState: 'var(--oniva-chart-play, running)',
    animationTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
    transformBox: 'fill-box',
    transformOrigin: '50% 50%',
  },
});

/** Series colour via `color`; SVG shapes then use `fill/stroke="currentColor"`. */
export const tones = stylex.create({
  c1: { color: colors['--oniva-color-chart-1'] },
  c2: { color: colors['--oniva-color-chart-2'] },
  c3: { color: colors['--oniva-color-chart-3'] },
  c4: { color: colors['--oniva-color-chart-4'] },
  c5: { color: colors['--oniva-color-chart-5'] },
  c6: { color: colors['--oniva-color-chart-6'] },
  c7: { color: colors['--oniva-color-chart-7'] },
  c8: { color: colors['--oniva-color-chart-8'] },
  c9: { color: colors['--oniva-color-chart-9'] },
  c10: { color: colors['--oniva-color-chart-10'] },
  track: { color: colors['--oniva-color-chart-track'] },
  cursor: { color: colors['--oniva-color-chart-cursor'] },
  text: { color: colors['--oniva-color-text'] },
  muted: { color: colors['--oniva-color-text-muted'] },
});

export const svgText = stylex.create({
  axis: {
    fill: colors['--oniva-color-text-muted'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: 11,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-medium'],
  },
  strong: {
    fill: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-sans'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-semibold'],
  },
  inverse: {
    fill: colors['--oniva-color-accent-fg'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: 12,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-semibold'],
  },
  grid: { stroke: colors['--oniva-color-chart-track'] },
  /** Invisible hover/focus column; shows a soft band. Pair with `tones.cursor`. */
  band: {
    cursor: 'default',
    fill: 'currentColor',
    fillOpacity: { default: 0, ':hover': 0.45, ':focus-visible': 0.45 },
    outline: 'none',
    transitionDuration: '150ms',
    transitionProperty: 'fill-opacity',
  },
  noEvents: { pointerEvents: 'none' },
  dotRing: { stroke: colors['--oniva-color-surface-inner'] },
  cursorLine: { stroke: colors['--oniva-color-chart-cursor'] },
  hit: {
    cursor: 'default',
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colors['--oniva-color-focus-ring']}`,
    },
    outlineOffset: 2,
  },
});

export type ToneKey = 'c1' | 'c2' | 'c3' | 'c4' | 'c5' | 'c6' | 'c7' | 'c8' | 'c9' | 'c10';
/** 1-based palette index, wraps after 10. */
export function toneKey(i: number): ToneKey {
  return `c${((((Math.round(i) - 1) % 10) + 10) % 10) + 1}` as ToneKey;
}
export function toneStyle(i: number) {
  return tones[toneKey(i)];
}
