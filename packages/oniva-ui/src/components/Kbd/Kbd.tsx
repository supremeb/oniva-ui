import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  base: {
    alignItems: 'center',
    backgroundColor: colors.kbdBg,
    borderRadius: radius.xs,
    boxSizing: 'border-box',
    color: colors.textOnTertiary,
    display: 'inline-flex',
    fontFamily: font.sans,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font.weightSemibold,
    justifyContent: 'center',
    lineHeight: 1,
    minWidth: 20,
    paddingInline: 6,
  },
  sm: { fontSize: font.size11, height: 18, minWidth: 18, paddingInline: 4 },
  md: { fontSize: font.size12, height: 20 },
  lg: { fontSize: font.size13, height: 24, minWidth: 24, paddingInline: 8 },
  group: { alignItems: 'center', display: 'inline-flex', gap: 4 },
});

export type KbdSize = 'sm' | 'md' | 'lg';

export interface KbdProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  size?: KbdSize;
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

/** Keyboard key cap, e.g. `<Kbd>⌘</Kbd><Kbd>K</Kbd>`. */
export function Kbd({ size = 'md', children, className, xstyle, ref, ...rest }: KbdProps) {
  const sx = stylex.props(styles.base, styles[size], xstyle);
  return (
    <kbd
      {...rest}
      ref={ref}
      {...sx}
      className={[sx.className, className].filter(Boolean).join(' ')}
    >
      {children}
    </kbd>
  );
}

export interface KbdGroupProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  /** Keys to render as separate caps, e.g. `['⌘', 'K']`. */
  keys?: string[];
  size?: KbdSize;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

export function KbdGroup({ keys, size, children, className, xstyle, ref, ...rest }: KbdGroupProps) {
  const sx = stylex.props(styles.group, xstyle);
  return (
    <span
      {...rest}
      ref={ref}
      {...sx}
      className={[sx.className, className].filter(Boolean).join(' ')}
    >
      {keys?.map((k) => (
        <Kbd key={k} size={size}>
          {k}
        </Kbd>
      ))}
      {children}
    </span>
  );
}
