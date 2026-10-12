import * as stylex from '@stylexjs/stylex';
import { createElement, type CSSProperties, type ElementType, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { mergeSx } from '../../internal/sx';
import { gapStyle, paddingStyle, type PaddingStep, type SpaceStep } from '../../internal/nav-space';

const styles = stylex.create({
  base: { boxSizing: 'border-box', display: 'grid', minWidth: 0 },
  cols: (n: number) => ({ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }),
  fit: (w: number) => ({ gridTemplateColumns: `repeat(auto-fit, minmax(min(${w}px, 100%), 1fr))` }),
  aStart: { alignItems: 'start' },
  aCenter: { alignItems: 'center' },
  aEnd: { alignItems: 'end' },
  aStretch: { alignItems: 'stretch' },
  jStart: { justifyItems: 'start' },
  jCenter: { justifyItems: 'center' },
  jEnd: { justifyItems: 'end' },
  jStretch: { justifyItems: 'stretch' },
});

const al = { start: 'aStart', center: 'aCenter', end: 'aEnd', stretch: 'aStretch' } as const;
const jt = { start: 'jStart', center: 'jCenter', end: 'jEnd', stretch: 'jStretch' } as const;

export interface GridProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'className'> {
  /** Fixed number of equal columns. */
  columns?: number;
  /** Responsive: as many columns as fit, each at least this wide (px). Wins over `columns`. */
  minColumnWidth?: number;
  gap?: SpaceStep;
  padding?: PaddingStep;
  align?: keyof typeof al;
  justify?: keyof typeof jt;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function Grid({
  columns = 1,
  minColumnWidth,
  gap = 16,
  padding,
  align,
  justify,
  as = 'div',
  className,
  style,
  xstyle,
  ref,
  children,
  ...rest
}: GridProps) {
  const sx = stylex.props(
    styles.base,
    minColumnWidth ? styles.fit(minColumnWidth) : styles.cols(columns),
    gapStyle(gap),
    padding !== undefined && paddingStyle(padding),
    align && styles[al[align]],
    justify && styles[jt[justify]],
    xstyle,
  );
  return createElement(as, { ...rest, ref, ...mergeSx(sx, className, style) }, children);
}
