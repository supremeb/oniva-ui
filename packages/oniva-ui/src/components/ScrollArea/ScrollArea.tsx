import * as stylex from '@stylexjs/stylex';
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  root: {
    boxSizing: 'border-box',
    outlineColor: colors.focusRing,
    outlineOffset: -2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    scrollbarColor: `${colors.borderHover} transparent`,
    scrollbarWidth: 'thin',
    '::-webkit-scrollbar': { height: 10, width: 10 },
    '::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
    '::-webkit-scrollbar-thumb': {
      backgroundClip: 'content-box',
      backgroundColor: { default: colors.borderHover, ':hover': colors.borderActive },
      borderColor: 'transparent',
      borderRadius: radius.full,
      borderStyle: 'solid',
      borderWidth: 2,
    },
    '::-webkit-scrollbar-corner': { backgroundColor: 'transparent' },
  },
  vertical: { overflowX: 'hidden', overflowY: 'auto' },
  horizontal: { overflowX: 'auto', overflowY: 'hidden' },
  both: { overflow: 'auto' },
});

export interface ScrollAreaProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'className'> {
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** Max height / width in px or CSS length; scrolls beyond this. */
  maxHeight?: number | string;
  maxWidth?: number | string;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Scroll container with slim themed scrollbars. Focusable so keyboard users can scroll. */
export function ScrollArea({
  orientation = 'vertical',
  maxHeight,
  maxWidth,
  className,
  style,
  xstyle,
  ref,
  children,
  ...rest
}: ScrollAreaProps) {
  const sx = stylex.props(styles.root, styles[orientation], xstyle);
  const merged = mergeSx(sx, className, { maxHeight, maxWidth, ...style });
  return (
    <div role="region" tabIndex={0} {...rest} ref={ref} {...merged}>
      {children}
    </div>
  );
}
