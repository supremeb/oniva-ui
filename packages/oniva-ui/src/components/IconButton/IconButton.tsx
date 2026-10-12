import type * as stylex from '@stylexjs/stylex';
import type { Ref } from 'react';
import { Button, type ButtonProps } from '../Button';

export interface IconButtonProps extends Omit<
  ButtonProps,
  'isIconOnly' | 'startIcon' | 'endIcon' | 'ref'
> {
  /** Required: icon-only buttons have no visible text. */
  'aria-label': string;
  /** StyleX overrides, applied last. */
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLButtonElement>;
}

/** Square icon button. Reuses Button's size + variant tokens (xs 24 / sm 32 / md 36 / lg 40). */
export function IconButton({ variant = 'secondary', ...props }: IconButtonProps) {
  return <Button variant={variant} {...props} isIconOnly />;
}
