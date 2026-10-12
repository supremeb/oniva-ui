import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';

export const textStyles = stylex.create({
  base: { fontFamily: font.sans, margin: 0 },
  caption: {
    fontSize: font.size12,
    fontWeight: font.weightMedium,
    letterSpacing: font.trackCaption,
    lineHeight: font.lh12,
  },
  body: { fontSize: font.size14, fontWeight: font.weightRegular, lineHeight: font.lh14 },
  headline: { fontSize: font.size16, fontWeight: font.weightSemibold, lineHeight: font.lh16 },
  title: {
    fontSize: font.size24,
    fontWeight: font.weightSemibold,
    letterSpacing: font.trackHero,
    lineHeight: font.lh24,
  },
  display: {
    fontSize: font.size40,
    fontWeight: font.weightSemibold,
    letterSpacing: font.trackHero,
    lineHeight: font.lh40,
  },
  default: { color: colors.text },
  muted: { color: colors.textMuted },
  accent: { color: colors.accentSoftFg },
  error: { color: colors.textError },
  tabular: { fontVariantNumeric: 'tabular-nums' },
  truncate: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
});

export type TypeVariant = 'caption' | 'body' | 'headline' | 'title' | 'display';
export type TextTone = 'default' | 'muted' | 'accent' | 'error';

export interface TextProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  variant?: TypeVariant;
  tone?: TextTone;
  /** Tabular numerals, for amounts and counts. */
  tabular?: boolean;
  truncate?: boolean;
  /** Rendered element. Default `span`. */
  as?: 'span' | 'p' | 'div' | 'label' | 'small' | 'strong' | 'em' | 'time';
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function Text({
  variant = 'body',
  tone = 'default',
  tabular = false,
  truncate = false,
  as: Tag = 'span',
  className,
  xstyle,
  ref,
  ...rest
}: TextProps) {
  const sx = stylex.props(
    textStyles.base,
    textStyles[variant],
    textStyles[tone],
    tabular && textStyles.tabular,
    truncate && textStyles.truncate,
    xstyle,
  );
  return (
    <Tag
      {...rest}
      ref={ref as Ref<never>}
      {...sx}
      className={[sx.className, className].filter(Boolean).join(' ')}
    />
  );
}
