import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, Ref } from 'react';
import { textStyles, type TextTone, type TypeVariant } from '../Text/Text';

const levelDefault: Record<1 | 2 | 3 | 4 | 5 | 6, TypeVariant> = {
  1: 'display',
  2: 'title',
  3: 'headline',
  4: 'headline',
  5: 'body',
  6: 'caption',
};

export interface HeadingProps extends Omit<HTMLAttributes<HTMLHeadingElement>, 'style'> {
  /** Semantic level (h1-h6). */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Visual size; defaults from the level. */
  variant?: TypeVariant;
  tone?: TextTone;
  tabular?: boolean;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLHeadingElement>;
}

export function Heading({
  level = 2,
  variant,
  tone = 'default',
  tabular = false,
  className,
  xstyle,
  ref,
  ...rest
}: HeadingProps) {
  const Tag = `h${level}` as const;
  const sx = stylex.props(
    textStyles.base,
    textStyles[variant ?? levelDefault[level]],
    textStyles[tone],
    tabular && textStyles.tabular,
    xstyle,
  );
  return (
    <Tag
      {...rest}
      ref={ref}
      {...sx}
      className={[sx.className, className].filter(Boolean).join(' ')}
    />
  );
}
