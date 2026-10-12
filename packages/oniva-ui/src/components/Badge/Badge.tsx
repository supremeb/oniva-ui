import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  base: {
    alignItems: 'center',
    boxSizing: 'border-box',
    display: 'inline-flex',
    fontFamily: font.sans,
    fontSize: font.size12,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font.weightSemibold,
    gap: 4,
    lineHeight: font.lh12,
    whiteSpace: 'nowrap',
  },
  md: { height: 24, paddingInline: 8 },
  sm: { height: 20, paddingInline: 6 },
  pill: { borderRadius: radius.full },
  square: { borderRadius: radius.xs, paddingInline: 4 },
  withDot: { paddingInlineStart: 4 },
  neutral: { backgroundColor: colors.surfaceTertiary, color: colors.textOnTertiary },
  accent: { backgroundColor: colors.accentSoft, color: colors.accentSoftFg },
  success: { backgroundColor: colors.successBg, color: colors.successFg },
  warning: { backgroundColor: colors.warningBg, color: colors.warningFg },
  danger: { backgroundColor: colors.dangerBg, color: colors.dangerFg },
  info: { backgroundColor: colors.infoBg, color: colors.infoFg },
  dotBase: {
    borderRadius: radius.full,
    flexShrink: 0,
    height: 6,
    width: 6,
  },
  dotNeutral: { backgroundColor: colors.textSubtle },
  dotAccent: { backgroundColor: colors.accentSoftFg },
  dotSuccess: { backgroundColor: colors.successSolid },
  dotWarning: { backgroundColor: colors.warningSolid },
  dotDanger: { backgroundColor: colors.dangerSolid },
  dotInfo: { backgroundColor: colors.infoSolid },
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
  size?: 'sm' | 'md';
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
