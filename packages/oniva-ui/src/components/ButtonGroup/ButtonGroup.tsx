import * as stylex from '@stylexjs/stylex';
import {
  Children,
  cloneElement,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type Ref,
} from 'react';

const styles = stylex.create({
  base: { alignItems: 'center', display: 'inline-flex' },
  vertical: { alignItems: 'stretch', flexDirection: 'column' },
  hFirst: { borderEndEndRadius: 0, borderStartEndRadius: 0 },
  hMid: { borderRadius: 0, marginInlineStart: -1 },
  hLast: { borderEndStartRadius: 0, borderStartStartRadius: 0, marginInlineStart: -1 },
  vFirst: { borderEndEndRadius: 0, borderEndStartRadius: 0 },
  vMid: { borderRadius: 0, marginBlockStart: -1 },
  vLast: { borderStartEndRadius: 0, borderStartStartRadius: 0, marginBlockStart: -1 },
  // keep the focused/hovered button above its neighbours
  raise: { zIndex: { default: 'auto', ':hover': 1, ':focus-visible': 2 } },
});

export interface ButtonGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  orientation?: 'horizontal' | 'vertical';
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Joins Buttons / IconButtons / LinkButtons into one attached cluster. */
export function ButtonGroup({
  orientation = 'horizontal',
  children,
  className,
  xstyle,
  ref,
  ...rest
}: ButtonGroupProps) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement<{
    xstyle?: stylex.StyleXStyles;
  }>[];
  const v = orientation === 'vertical';
  const sx = stylex.props(styles.base, v && styles.vertical, xstyle);
  return (
    <div
      role="group"
      {...rest}
      ref={ref}
      {...sx}
      className={[sx.className, className].filter(Boolean).join(' ')}
    >
      {items.map((child, i) => {
        const pos =
          items.length === 1 ? null : i === 0 ? 'First' : i === items.length - 1 ? 'Last' : 'Mid';
        const key = pos ? (`${v ? 'v' : 'h'}${pos}` as keyof typeof styles) : null;
        return cloneElement(child, {
          xstyle: [
            styles.raise,
            key && styles[key],
            child.props.xstyle,
          ] as unknown as stylex.StyleXStyles,
        });
      })}
    </div>
  );
}
