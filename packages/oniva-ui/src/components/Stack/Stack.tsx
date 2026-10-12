import type * as stylex from '@stylexjs/stylex';
import type { Ref } from 'react';
import { Flex, type FlexProps } from '../Flex';

export interface StackProps extends Omit<FlexProps, 'direction' | 'wrap' | 'inline'> {
  /** Lay children out horizontally instead. */
  horizontal?: boolean;
  /** StyleX overrides, applied last. */
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

/** Vertical flex stack (use `horizontal` for a row). Defaults to a 12px gap. */
export function Stack({ horizontal = false, gap = 12, ref, ...rest }: StackProps) {
  return <Flex {...rest} ref={ref} gap={gap} direction={horizontal ? 'row' : 'column'} />;
}
