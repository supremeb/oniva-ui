import * as stylex from '@stylexjs/stylex';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { CloseButton } from '../CloseButton';

const styles = stylex.create({
  base: {
    alignItems: 'flex-start',
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-card'],
    boxSizing: 'border-box',
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    gap: 12,
    padding: 12,
    width: '100%',
  },
  info: { backgroundColor: colors['--oniva-color-surface-inset'] },
  success: { backgroundColor: colors['--oniva-color-surface-inset'] },
  warning: { backgroundColor: colors['--oniva-color-surface-inset'] },
  danger: { backgroundColor: colors['--oniva-color-surface-inset'] },
  // solid banner: fills with status colours
  bannerInfo: {
    backgroundColor: colors['--oniva-color-info-bg'],
    borderColor: 'transparent',
    color: colors['--oniva-color-info-fg'],
  },
  bannerSuccess: {
    backgroundColor: colors['--oniva-color-success-bg'],
    borderColor: 'transparent',
    color: colors['--oniva-color-success-fg'],
  },
  bannerWarning: {
    backgroundColor: colors['--oniva-color-warning-bg'],
    borderColor: 'transparent',
    color: colors['--oniva-color-warning-fg'],
  },
  bannerDanger: {
    backgroundColor: colors['--oniva-color-danger-bg'],
    borderColor: 'transparent',
    color: colors['--oniva-color-danger-fg'],
  },
  banner: { borderRadius: radius['--oniva-radius-lg'], boxShadow: 'none' },
  iconWrap: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-full'],
    display: 'inline-flex',
    flexShrink: 0,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  iconInfo: {
    backgroundColor: colors['--oniva-color-info-halo'],
    color: colors['--oniva-color-info-solid'],
  },
  iconSuccess: {
    backgroundColor: colors['--oniva-color-success-halo'],
    color: colors['--oniva-color-success-solid'],
  },
  iconWarning: {
    backgroundColor: colors['--oniva-color-warning-halo'],
    color: colors['--oniva-color-warning-solid'],
  },
  iconDanger: {
    backgroundColor: colors['--oniva-color-danger-halo'],
    color: colors['--oniva-color-danger-solid'],
  },
  iconBanner: { backgroundColor: 'transparent', color: 'inherit' },
  body: { display: 'grid', flex: '1 1 0%', gap: 2, minWidth: 0 },
  title: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-semibold'],
    lineHeight: font['--oniva-font-lh-14'],
  },
  description: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-13'],
  },
  inherit: { color: 'inherit' },
  actions: { alignItems: 'center', display: 'flex', gap: 8, marginBlockStart: 8 },
  dismiss: { color: 'inherit', flexShrink: 0, marginBlock: -2, marginInlineEnd: -4 },
});

const icons = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleAlert,
} as const;
const bannerStyle = {
  info: 'bannerInfo',
  success: 'bannerSuccess',
  warning: 'bannerWarning',
  danger: 'bannerDanger',
} as const;
const iconStyle = {
  info: 'iconInfo',
  success: 'iconSuccess',
  warning: 'iconWarning',
  danger: 'iconDanger',
} as const;

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'title'> {
  variant?: AlertVariant;
  /** `callout` = inset card; `banner` = solid status fill. */
  appearance?: 'callout' | 'banner';
  title?: ReactNode;
  description?: ReactNode;
  /** Custom icon; pass `null` to hide. */
  icon?: ReactNode;
  /** Action buttons rendered under the text. */
  actions?: ReactNode;
  /** Shows a dismiss button and calls this on press. */
  onDismiss?: () => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function Alert({
  variant = 'info',
  appearance = 'callout',
  title,
  description,
  icon,
  actions,
  onDismiss,
  children,
  className,
  xstyle,
  ref,
  ...rest
}: AlertProps) {
  const Glyph = icons[variant];
  const isBanner = appearance === 'banner';
  const sx = stylex.props(
    styles.base,
    styles[variant],
    isBanner && styles.banner,
    isBanner && styles[bannerStyle[variant]],
    xstyle,
  );
  return (
    <div
      role={variant === 'danger' || variant === 'warning' ? 'alert' : 'status'}
      {...rest}
      ref={ref}
      {...sx}
      className={[sx.className, className].filter(Boolean).join(' ')}
    >
      {icon !== null && (
        <span
          aria-hidden="true"
          {...stylex.props(
            styles.iconWrap,
            isBanner ? styles.iconBanner : styles[iconStyle[variant]],
          )}
        >
          {icon ?? <Glyph size={isBanner ? 18 : 14} />}
        </span>
      )}
      <div {...stylex.props(styles.body)}>
        {title && <div {...stylex.props(styles.title, isBanner && styles.inherit)}>{title}</div>}
        {(description || children) && (
          <div {...stylex.props(styles.description, isBanner && styles.inherit)}>
            {description ?? children}
          </div>
        )}
        {actions && <div {...stylex.props(styles.actions)}>{actions}</div>}
      </div>
      {onDismiss && (
        <CloseButton aria-label="Dismiss" onPress={onDismiss} xstyle={styles.dismiss} />
      )}
    </div>
  );
}
