import * as stylex from '@stylexjs/stylex';

const RM = '@media (prefers-reduced-motion: reduce)';
const dur = (ms: string) => ({ default: ms, [RM]: '0.01ms' });

/**
 * Motion tokens (public `--oniva-motion-*` names). Durations collapse to ~0 under reduced motion,
 * so anything driven by a duration token is automatically reduced-motion safe. Distances and scales
 * collapse too (travel -> 0, pop-scale -> 1), which leaves a pure opacity fade.
 * Rules of thumb live in AGENTS.md "Motion rules".
 */
export const motion = stylex.defineVars({
  // --- durations ---
  '--oniva-motion-dur-instant': dur('40ms'), // hover bg, highlight
  '--oniva-motion-dur-micro': dur('80ms'), // tiny popup exits, tooltips out
  '--oniva-motion-dur-fast': dur('100ms'),
  '--oniva-motion-dur-press': dur('120ms'), // press scale
  '--oniva-motion-dur-base': dur('150ms'),
  '--oniva-motion-dur-enter': dur('200ms'), // popover / menu / dialog enter
  '--oniva-motion-dur-slow': dur('250ms'),
  '--oniva-motion-dur-height': dur('250ms'), // AnimatedHeight
  '--oniva-motion-dur-deliberate': dur('350ms'), // text reveal, number roll
  '--oniva-motion-dur-sheet': dur('400ms'), // drawer / sheet
  '--oniva-motion-dur-slower': dur('500ms'),
  // --- easings ---
  '--oniva-motion-ease-out': 'cubic-bezier(0.23, 1, 0.32, 1)', // default for enter / exit / press
  '--oniva-motion-ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)', // big moves, number roll
  '--oniva-motion-ease-in-out': 'cubic-bezier(0.77, 0, 0.175, 1)', // on-screen movement, indicators
  '--oniva-motion-ease-drawer': 'cubic-bezier(0.32, 0.72, 0, 1)', // sheets, drawers
  '--oniva-motion-ease-spring': 'cubic-bezier(0.34, 1.45, 0.64, 1)', // small overshoot (badges, digits)
  '--oniva-motion-ease-emphasized': 'cubic-bezier(0.05, 0.7, 0.1, 1)', // hero entrances
  '--oniva-motion-ease-standard': 'cubic-bezier(0.4, 0, 0.2, 1)', // legacy alias
  '--oniva-motion-ease-in': 'cubic-bezier(0.4, 0, 1, 1)', // DEPRECATED: never use for UI exits
  // --- distances / scales ---
  '--oniva-motion-pop-scale': { default: '0.96', [RM]: '1' },
  '--oniva-motion-press-scale': { default: '0.97', [RM]: '1' },
  '--oniva-motion-travel': { default: '8px', [RM]: '0px' },
  '--oniva-motion-stagger': dur('35ms'),
});
