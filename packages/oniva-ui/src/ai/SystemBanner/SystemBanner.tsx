import * as stylex from '@stylexjs/stylex';
import { TriangleAlertIcon, CircleCheckIcon, InfoIcon, OctagonAlertIcon, XIcon } from '../../icons/IconSet';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { motionStyles } from '../../internal/motion-styles';
import { mergeSx, sxClass } from '../../internal/sx';

const styles = stylex.create({
  base: {
    alignItems: 'flex-start',
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
  // Icon, action and dismiss pin to the first line so they stay put when the message wraps.
  icon: { flexShrink: 0, marginTop: 1 },
  msg: { flexGrow: 1, minWidth: 0, overflowWrap: 'anywhere' },
  action: { flexShrink: 0, marginBlock: -3, maxWidth: '50%' },
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
    marginBlock: -2,
    opacity: { default: 0.7, ':hover': { default: null, [media.hover]: 1 } },
    transitionProperty: 'opacity, transform',
    width: 22,
  },
  actionBtn: {
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-overlay-hover'] },
    },
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
    overflow: 'hidden',
    paddingInline: 10,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
});

export type SystemBannerTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';
const icons = {
  info: InfoIcon,
  success: CircleCheckIcon,
  warning: TriangleAlertIcon,
  danger: OctagonAlertIcon,
  neutral: InfoIcon,
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
      <Icon size={16} aria-hidden="true" {...stylex.props(styles.icon)} />
      <span {...stylex.props(styles.msg)}>{children}</span>
      {actionLabel && (
        <AriaButton
          onPress={onAction}
          className={() => sxClass(stylex.props(styles.actionBtn, styles.action, motionStyles.pressScale, focus.ring))}
        >
          {actionLabel}
        </AriaButton>
      )}
      {onDismiss && (
        <AriaButton
          aria-label="Dismiss"
          onPress={onDismiss}
          className={() => sxClass(stylex.props(motionStyles.pressScale, styles.close, focus.ring))}
        >
          <XIcon size={14} aria-hidden="true" />
        </AriaButton>
      )}
    </div>
  );
}
