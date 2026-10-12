import * as stylex from '@stylexjs/stylex';
import { AlertTriangle, CheckCircle2, Info, OctagonAlert, X } from 'lucide-react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { mergeSx } from '../../internal/sx';

const styles = stylex.create({
  base: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-lg'],
    boxSizing: 'border-box',
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 10,
    lineHeight: font['--oniva-font-lh-13'],
    paddingBlock: 8,
    paddingInline: 12,
  },
  info: {
    backgroundColor: colors['--oniva-color-info-bg'],
    color: colors['--oniva-color-info-fg'],
  },
  success: {
    backgroundColor: colors['--oniva-color-success-bg'],
    color: colors['--oniva-color-success-fg'],
  },
  warning: {
    backgroundColor: colors['--oniva-color-warning-bg'],
    color: colors['--oniva-color-warning-fg'],
  },
  danger: {
    backgroundColor: colors['--oniva-color-danger-bg'],
    color: colors['--oniva-color-danger-fg'],
  },
  neutral: {
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    color: colors['--oniva-color-text-on-tertiary'],
  },
  msg: { flexGrow: 1, minWidth: 0 },
  action: { flexShrink: 0 },
  close: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderRadius: radius['--oniva-radius-sm'],
    borderWidth: 0,
    color: 'inherit',
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    height: 22,
    justifyContent: 'center',
    opacity: { default: 0.7, ':hover': 1 },
    outlineColor: 'currentColor',
    outlineOffset: 1,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'opacity',
    width: 22,
  },
  actionBtn: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderColor: 'currentColor',
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: 'inherit',
    cursor: 'pointer',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-semibold'],
    height: 24,
    outlineColor: 'currentColor',
    outlineOffset: 1,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    paddingInline: 10,
  },
});

export type SystemBannerTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';
const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: OctagonAlert,
  neutral: Info,
} as const;

export interface SystemBannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  tone?: SystemBannerTone;
  children?: ReactNode;
  /** Label for the optional action button, e.g. `Upgrade`. */
  actionLabel?: string;
  onAction?: () => void;
  onDismiss?: () => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Inline system notice inside a conversation: rate limit hit, context nearly full, tool offline. */
export function SystemBanner({
  tone = 'info',
  children,
  actionLabel,
  onAction,
  onDismiss,
  className,
  xstyle,
  ref,
  ...rest
}: SystemBannerProps) {
  const Icon = icons[tone];
  const sx = stylex.props(styles.base, styles[tone], xstyle);
  return (
    <div
      role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}
      {...rest}
      ref={ref}
      {...mergeSx(sx, className)}
    >
      <Icon size={16} aria-hidden="true" style={{ flexShrink: 0 }} />
      <span {...stylex.props(styles.msg)}>{children}</span>
      {actionLabel && (
        <AriaButton
          onPress={onAction}
          className={() => stylex.props(styles.actionBtn, styles.action).className ?? ''}
        >
          {actionLabel}
        </AriaButton>
      )}
      {onDismiss && (
        <AriaButton
          aria-label="Dismiss"
          onPress={onDismiss}
          className={() => stylex.props(styles.close).className ?? ''}
        >
          <X size={14} aria-hidden="true" />
        </AriaButton>
      )}
    </div>
  );
}
