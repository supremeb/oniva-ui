import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  base: {
    alignItems: 'center',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    gap: 4,
    padding: 32,
    textAlign: 'center',
    width: '100%',
  },
  bordered: {
    borderColor: colors['--oniva-color-border-control'],
    borderRadius: radius['--oniva-radius-card'],
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  media: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: 'none',
    color: colors['--oniva-color-icon-muted'],
    display: 'inline-flex',
    height: 48,
    justifyContent: 'center',
    marginBlockEnd: 12,
    width: 48,
  },
  title: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-16'],
    fontWeight: font['--oniva-font-weight-semibold'],
    lineHeight: font['--oniva-font-lh-16'],
    margin: 0,
  },
  description: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-14'],
    lineHeight: font['--oniva-font-lh-14'],
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
    <div
      {...rest}
      ref={ref}
      {...sx}
      className={[sx.className, className].filter(Boolean).join(' ')}
    >
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
