import * as stylex from '@stylexjs/stylex';
import type { LucideIcon } from 'lucide-react';
import type { SVGAttributes, Ref } from 'react';
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

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'style' | 'children'> {
  /** A lucide-react icon component, e.g. `Bell`. */
  icon: LucideIcon;
  size?: IconSize;
  tone?: IconTone;
  /** Accessible label. Omit for decorative icons (hidden from AT). */
  label?: string;
  strokeWidth?: number;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<SVGSVGElement>;
}

/** Lucide wrapper with size + tone tokens. Decorative unless `label` is set. */
export function Icon({
  icon: Glyph,
  size = 'md',
  tone = 'default',
  label,
  strokeWidth = 2,
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
      strokeWidth={strokeWidth}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      {...sx}
      className={[sx.className, className].filter(Boolean).join(' ')}
    />
  );
}
