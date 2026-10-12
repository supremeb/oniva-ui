import * as stylex from '@stylexjs/stylex';
import {
  createElement,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { mergeSx } from '../../internal/sx';
import { gapStyle, paddingStyle, type PaddingStep, type SpaceStep } from '../../internal/nav-space';

const styles = stylex.create({
  base: { boxSizing: 'border-box', display: 'flex', minWidth: 0 },
  inline: { display: 'inline-flex' },
  row: { flexDirection: 'row' },
  column: { flexDirection: 'column' },
  rowReverse: { flexDirection: 'row-reverse' },
  columnReverse: { flexDirection: 'column-reverse' },
  wrap: { flexWrap: 'wrap' },
  aStart: { alignItems: 'flex-start' },
  aCenter: { alignItems: 'center' },
  aEnd: { alignItems: 'flex-end' },
  aStretch: { alignItems: 'stretch' },
  aBaseline: { alignItems: 'baseline' },
  jStart: { justifyContent: 'flex-start' },
  jCenter: { justifyContent: 'center' },
  jEnd: { justifyContent: 'flex-end' },
  jBetween: { justifyContent: 'space-between' },
  jAround: { justifyContent: 'space-around' },
  jEvenly: { justifyContent: 'space-evenly' },
});

const dir = {
  row: 'row',
  column: 'column',
  'row-reverse': 'rowReverse',
  'column-reverse': 'columnReverse',
} as const;
const al = {
  start: 'aStart',
  center: 'aCenter',
  end: 'aEnd',
  stretch: 'aStretch',
  baseline: 'aBaseline',
} as const;
const jt = {
  start: 'jStart',
  center: 'jCenter',
  end: 'jEnd',
  between: 'jBetween',
  around: 'jAround',
  evenly: 'jEvenly',
} as const;

export interface FlexProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'className'> {
  direction?: keyof typeof dir;
  align?: keyof typeof al;
  justify?: keyof typeof jt;
  /** Gap in px from the space scale (maps to space tokens). */
  gap?: SpaceStep;
  /** Padding in px from the space scale. */
  padding?: PaddingStep;
  wrap?: boolean;
  inline?: boolean;
  /** Element to render. */
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function Flex({
  direction = 'row',
  align,
  justify,
  gap = 8,
  padding,
  wrap = false,
  inline = false,
  as = 'div',
  className,
  style,
  xstyle,
  ref,
  children,
  ...rest
}: FlexProps) {
  const sx = stylex.props(
    styles.base,
    inline && styles.inline,
    styles[dir[direction]],
    align && styles[al[align]],
    justify && styles[jt[justify]],
    wrap && styles.wrap,
    gapStyle(gap),
    padding !== undefined && paddingStyle(padding),
    xstyle,
  );
  return createElement(as, { ...rest, ref, ...mergeSx(sx, className, style) }, children);
}
