import * as stylex from '@stylexjs/stylex';
import type { SVGAttributes, Ref } from 'react';
import type { IconGlyph, IconVariant } from '../../icons/IconSet';
import { colors } from '../../tokens/colors.stylex';

const styles = stylex.create({
  base: { display: 'inline-block', flexShrink: 0 },
  default: { color: 'inherit' },
  muted: { color: colors['--oniva-color-icon-muted'] },
  subtle: { color: colors['--oniva-color-icon-subtle'] },
  accent: { color: colors['--oniva-color-accent-soft-fg'] },
  success: { color: colors['--oniva-color-success-solid'] },
  warning: { color: colors['--oniva-color-warning-solid'] },
  danger: { color: colors['--oniva-color-danger-solid'] },
  info: { color: colors['--oniva-color-info-solid'] },
});

export const iconSizes = { xs: 12, sm: 14, md: 16, lg: 20, xl: 24 } as const;
export type IconSize = keyof typeof iconSizes;
export type IconTone =
  'default' | 'muted' | 'subtle' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'style' | 'children' | 'strokeWidth'> {
  /** An oniva glyph component, e.g. `BellIcon`. */
  icon: IconGlyph;
  size?: IconSize;
  tone?: IconTone;
  /** Drawing style: outline (default), duo, fill or fill-duo. */
  variant?: IconVariant;
  /** Accessible label. Omit for decorative icons (hidden from AT). */
  label?: string;
  /** Stroke width in grid units (the grid is 18). */
  strokeWidth?: number;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<SVGSVGElement>;
}

/** Glyph wrapper with size and tone tokens. Decorative unless `label` is set. */
export function Icon({
  icon: Glyph,
  size = 'md',
  tone = 'default',
  variant = 'outline',
  label,
  strokeWidth = 1.5,
  className,
  xstyle,
  ref,
  ...rest
}: IconProps) {
  const sx = stylex.props(styles.base, styles[tone], xstyle);
  return (
    <Glyph
      {...rest}
      ref={ref}
      size={iconSizes[size]}
      variant={variant}
      strokeWidth={strokeWidth}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      className={[sx.className, className].filter(Boolean).join(' ')}
      style={sx.style}
    />
  );
}
