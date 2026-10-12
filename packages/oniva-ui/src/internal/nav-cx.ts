import type * as stylex from '@stylexjs/stylex';

/** Join a `stylex.props(...)` className with a user className (for RAC className render-prop callbacks). */
export function cx(sx: ReturnType<typeof stylex.props>, className?: string): string {
  return [sx.className, className].filter(Boolean).join(' ');
}
