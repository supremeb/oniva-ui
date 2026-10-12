import * as stylex from '@stylexjs/stylex';
import type { ControlSize } from '../../internal/types';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  base: {
    alignItems: 'center',
    boxSizing: 'border-box',
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-semibold'],
    gap: 4,
    lineHeight: font['--oniva-font-lh-12'],
    whiteSpace: 'nowrap',
  },
  md: { height: 24, paddingInline: 8 },
  sm: { height: 20, paddingInline: 6 },
  pill: { borderRadius: radius['--oniva-radius-full'] },
  square: { borderRadius: radius['--oniva-radius-xs'], paddingInline: 4 },
  withDot: { paddingInlineStart: 4 },
  neutral: {
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    color: colors['--oniva-color-text-on-tertiary'],
  },
  accent: {
    backgroundColor: colors['--oniva-color-accent-soft'],
    color: colors['--oniva-color-accent-soft-fg'],
  },
  success: {
    backgroundColor: colors['--oniva-color-success-bg'],
    color: colors['--oniva-color-success-fg'],
  },
  warning: {
    backgroundColor: colors['--oniva-color-warning-bg'],
    color: colors['--oniva-color-warning-fg'],
  },
  danger: {
    backgroundColor: colors['--oniva-color-danger-bg'],
    color: colors['--oniva-color-danger-fg'],
  },
  info: {
    backgroundColor: colors['--oniva-color-info-bg'],
    color: colors['--oniva-color-info-fg'],
  },
  dotBase: {
    borderRadius: radius['--oniva-radius-full'],
    flexShrink: 0,
    height: 6,
    width: 6,
  },
  dotNeutral: { backgroundColor: colors['--oniva-color-text-subtle'] },
  dotAccent: { backgroundColor: colors['--oniva-color-accent-soft-fg'] },
  dotSuccess: { backgroundColor: colors['--oniva-color-success-solid'] },
  dotWarning: { backgroundColor: colors['--oniva-color-warning-solid'] },
  dotDanger: { backgroundColor: colors['--oniva-color-danger-solid'] },
  dotInfo: { backgroundColor: colors['--oniva-color-info-solid'] },
});

const dotColor = {
  neutral: 'dotNeutral',
  accent: 'dotAccent',
  success: 'dotSuccess',
  warning: 'dotWarning',
  danger: 'dotDanger',
  info: 'dotInfo',
} as const;

export type BadgeVariant = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  variant?: BadgeVariant;
  size?: Extract<ControlSize, 'sm' | 'md'>;
  /** `pill` for status chips, `square` for compact counts. */
  shape?: 'pill' | 'square';
  /** Leading status dot. */
  dot?: boolean;
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

export function Badge({
  variant = 'neutral',
  size = 'md',
  shape = 'pill',
  dot = false,
  children,
  className,
  xstyle,
  ref,
  ...rest
}: BadgeProps) {
  const sx = stylex.props(
    styles.base,
    styles[size],
    styles[shape],
    styles[variant],
    dot && styles.withDot,
    xstyle,
  );
  return (
    <span
      {...rest}
      ref={ref}
      {...sx}
      className={[sx.className, className].filter(Boolean).join(' ')}
    >
      {dot && (
        <span aria-hidden="true" {...stylex.props(styles.dotBase, styles[dotColor[variant]])} />
      )}
      {children}
    </span>
  );
}
