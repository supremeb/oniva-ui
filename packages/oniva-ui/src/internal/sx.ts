import type * as stylex from '@stylexjs/stylex';
import type { CSSProperties } from 'react';

type StyleXProps = ReturnType<typeof stylex.props>;

/**
 * Turns `stylex.props(...)` output into `{ className, style }`, appending a user `className`
 * and merging a user `style` object. Spread the result onto the element.
 */
export function mergeSx(
  sx: StyleXProps,
  className?: string,
  style?: CSSProperties,
): { className: string; style?: CSSProperties } {
  const merged = { className: [sx.className, className].filter(Boolean).join(' ') } as {
    className: string;
    style?: CSSProperties;
  };
  const s = sx.style || style ? { ...(sx.style as CSSProperties), ...style } : undefined;
  if (s) merged.style = s;
  return merged;
}
