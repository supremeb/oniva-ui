import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const styles = stylex.create({
  base: {
    alignItems: 'center',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    gap: 4,
    padding: 32,
    textAlign: 'center',
    width: '100%',
  },
  bordered: {
    borderColor: colors.borderControl,
    borderRadius: radius.card,
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  media: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow.sm,
    color: colors.iconMuted,
    display: 'inline-flex',
    height: 48,
    justifyContent: 'center',
    marginBlockEnd: 12,
    width: 48,
  },
  title: {
    color: colors.text,
    fontSize: font.size16,
    fontWeight: font.weightSemibold,
    lineHeight: font.lh16,
    margin: 0,
  },
  description: {
    color: colors.textMuted,
    fontSize: font.size14,
    lineHeight: font.lh14,
    margin: 0,
    maxWidth: 360,
  },
  actions: { alignItems: 'center', display: 'flex', gap: 8, marginBlockStart: 16 },
});

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'title'> {
  /** Icon or illustration; wrapped in a raised tile. */
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** Primary/secondary buttons. */
  actions?: ReactNode;
  /** Dashed outline, for empty table/list areas. */
  bordered?: boolean;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function EmptyState({
  icon,
  title,
  description,
  actions,
  bordered = false,
  className,
  xstyle,
  ref,
  children,
  ...rest
}: EmptyStateProps) {
  const sx = stylex.props(styles.base, bordered && styles.bordered, xstyle);
  return (
    <div {...rest} ref={ref} {...sx} className={[sx.className, className].filter(Boolean).join(' ')}>
      {icon && (
        <span aria-hidden="true" {...stylex.props(styles.media)}>
          {icon}
        </span>
      )}
      <h3 {...stylex.props(styles.title)}>{title}</h3>
      {description && <p {...stylex.props(styles.description)}>{description}</p>}
      {children}
      {actions && <div {...stylex.props(styles.actions)}>{actions}</div>}
    </div>
  );
}
