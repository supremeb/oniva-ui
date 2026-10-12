import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';

export const textStyles = stylex.create({
  base: { fontFamily: font['--oniva-font-sans'], margin: 0 },
  caption: {
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    letterSpacing: font['--oniva-font-track-caption'],
    lineHeight: font['--oniva-font-lh-12'],
  },
  body: {
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-regular'],
    lineHeight: font['--oniva-font-lh-14'],
  },
  headline: {
    fontSize: font['--oniva-font-size-16'],
    fontWeight: font['--oniva-font-weight-semibold'],
    lineHeight: font['--oniva-font-lh-16'],
  },
  title: {
    fontSize: font['--oniva-font-size-24'],
    fontWeight: font['--oniva-font-weight-semibold'],
    letterSpacing: font['--oniva-font-track-hero'],
    lineHeight: font['--oniva-font-lh-24'],
  },
  display: {
    fontSize: font['--oniva-font-size-40'],
    fontWeight: font['--oniva-font-weight-semibold'],
    letterSpacing: font['--oniva-font-track-hero'],
    lineHeight: font['--oniva-font-lh-40'],
  },
  default: { color: colors['--oniva-color-text'] },
  muted: { color: colors['--oniva-color-text-muted'] },
  accent: { color: colors['--oniva-color-accent-soft-fg'] },
  error: { color: colors['--oniva-color-text-error'] },
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
