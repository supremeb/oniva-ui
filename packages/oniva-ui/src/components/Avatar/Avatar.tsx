import * as stylex from '@stylexjs/stylex';
import { Children, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { accent } from '../../tokens/accent.stylex';

const styles = stylex.create({
  root: {
    alignItems: 'center',
    borderRadius: radius.full,
    boxSizing: 'border-box',
    display: 'inline-flex',
    flexShrink: 0,
    fontFamily: font.sans,
    fontWeight: font.weightSemibold,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    userSelect: 'none',
  },
  neutral: { backgroundColor: colors.surfaceTertiaryHover, color: colors.textOnTertiary },
  accent: { backgroundColor: accent.accent300, color: accent.accent900 },
  xs: { fontSize: 10, height: 20, lineHeight: '12px', width: 20 },
  sm: { fontSize: 10, height: 24, lineHeight: '12px', width: 24 },
  md: { fontSize: 12, height: 32, lineHeight: '16px', width: 32 },
  lg: { fontSize: 16, height: 36, lineHeight: '18px', width: 36 },
  xl: { fontSize: 18, height: 48, lineHeight: '22px', width: 48 },
  img: { height: '100%', objectFit: 'cover', width: '100%' },
  group: { alignItems: 'center', display: 'inline-flex', flexDirection: 'row' },
  groupItem: {
    boxShadow: `0 0 0 2px ${colors.bg}`,
    marginInlineStart: -8,
  },
  groupFirst: { marginInlineStart: 0 },
});

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style' | 'children'> {
  src?: string;
  /** Alt text for the image. Falls back to `name`. */
  alt?: string;
  /** Used to derive initials and the accessible label. */
  name?: string;
  size?: AvatarSize;
  color?: 'neutral' | 'accent';
  /** Custom fallback content (icon etc.) shown when there is no image/name. */
  fallback?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

export function getInitials(name?: string): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  color = 'neutral',
  fallback,
  className,
  xstyle,
  ref,
  ...rest
}: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = !!src && failedSrc !== src;
  const label = alt ?? name;
  const sx = stylex.props(styles.root, styles[size], styles[color], xstyle);
  return (
    <span
      role="img"
      aria-label={label ?? 'Avatar'}
      {...rest}
      ref={ref}
      {...sx}
      className={[sx.className, className].filter(Boolean).join(' ')}
    >
      {showImage ? (
        <img src={src} alt="" onError={() => setFailedSrc(src)} {...stylex.props(styles.img)} />
      ) : (
        <span aria-hidden="true">{getInitials(name) || fallback}</span>
      )}
    </span>
  );
}

export interface AvatarGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  size?: AvatarSize;
  /** Show at most this many avatars, then a "+N" overflow avatar. */
  max?: number;
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function AvatarGroup({
  size = 'md',
  max,
  children,
  className,
  xstyle,
  ref,
  ...rest
}: AvatarGroupProps) {
  const items = Children.toArray(children);
  const visible = max != null && items.length > max ? items.slice(0, max) : items;
  const overflow = items.length - visible.length;
  const sx = stylex.props(styles.group, xstyle);
  return (
    <div
      role="group"
      {...rest}
      ref={ref}
      {...sx}
      className={[sx.className, className].filter(Boolean).join(' ')}
    >
      {visible.map((child, i) => (
        <span
          key={i}
          {...stylex.props(
            styles.root,
            styles.groupItem,
            i === 0 && styles.groupFirst,
            styles[size],
          )}
        >
          {child}
        </span>
      ))}
      {overflow > 0 && (
        <Avatar
          size={size}
          fallback={`+${overflow}`}
          aria-label={`${overflow} more`}
          xstyle={[styles.groupItem]}
        />
      )}
    </div>
  );
}
