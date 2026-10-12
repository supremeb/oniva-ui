import * as stylex from '@stylexjs/stylex';
import {
  Separator as AriaSeparator,
  type SeparatorProps as AriaSeparatorProps,
} from 'react-aria-components';
import type { CSSProperties, Ref } from 'react';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';

const styles = stylex.create({
  base: {
    backgroundColor: colors['--oniva-color-separator'],
    borderWidth: 0,
    flexShrink: 0,
    margin: 0,
  },
  horizontal: { alignSelf: 'stretch', height: 1, width: 'auto' },
  vertical: { alignSelf: 'stretch', height: 'auto', width: 1 },
  strong: { backgroundColor: colors['--oniva-color-border-hover'] },
});

export interface SeparatorProps extends Omit<AriaSeparatorProps, 'className' | 'style'> {
  /** Stronger line color. */
  strong?: boolean;
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function Separator({
  orientation = 'horizontal',
  strong = false,
  className,
  style,
  xstyle,
  ref,
  ...rest
}: SeparatorProps) {
  const sx = stylex.props(styles.base, styles[orientation], strong && styles.strong, xstyle);
  return (
    <AriaSeparator
      {...rest}
      ref={ref}
      orientation={orientation}
      {...mergeSx(sx, className, style)}
    />
  );
}
