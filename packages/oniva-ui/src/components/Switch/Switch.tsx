import * as stylex from '@stylexjs/stylex';
import { media } from '../../tokens/media.stylex';
import type { ControlSize } from '../../internal/types';
import { Switch as AriaSwitch, type SwitchProps as AriaSwitchProps } from 'react-aria-components';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { mergeSx } from '../../internal/sx';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const styles = stylex.create({
  root: {
    alignItems: 'center',
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 10,
    lineHeight: font['--oniva-font-lh-14'],
  },
  rootDisabled: { cursor: 'not-allowed', opacity: 0.5 },
  // Off: recessed channel (neutral fill, inner top shadow, control border for >=3:1).
  // On: flat accent fill. Both animate background-color + border-color, never a gradient (it can't ease).
  track: {
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderColor: {
      default: colors['--oniva-color-border-control'],
      '@media (forced-colors: active)': 'ButtonText',
    },
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-elevation-recessed'],
    boxSizing: 'border-box',
    flexShrink: 0,
    position: 'relative',
    transitionDuration: {
      default: motion['--oniva-motion-dur-base'],
      [media.reducedMotion]: '0.01ms',
    },
    transitionProperty: 'background-color, border-color, box-shadow',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  trackOn: {
    backgroundColor: accent['--oniva-accent-solid'],
    borderColor: { default: accent['--oniva-accent-solid'], '@media (forced-colors: active)': 'Highlight' },
    boxShadow: 'none',
  },
  focus: {
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 2,
    outlineStyle: 'solid',
    outlineWidth: 2,
  },
  // Raised: the thing you grab. White, hairline + contact + ambient (hairline rim in dark via the token).
  // Concentric with the track: knob radius = track inner radius - gap (full radius, so it holds at any size).
  knob: {
    backgroundColor: colors['--oniva-color-on-solid'],
    borderColor: { default: 'transparent', '@media (forced-colors: active)': 'ButtonText' },
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: { default: 0, '@media (forced-colors: active)': 1 },
    boxShadow: shadow['--oniva-elevation-raised'],
    boxSizing: 'border-box',
    position: 'absolute',
    transitionDuration: {
      default: motion['--oniva-motion-dur-slow'],
      [media.reducedMotion]: '0.01ms',
    },
    // transform drives the spring slide; shadow eases hover lift / press flatten
    transitionProperty: 'transform, box-shadow',
    transitionTimingFunction: motion['--oniva-motion-ease-spring'],
  },
  knobHover: { boxShadow: shadow['--oniva-elevation-raised-hover'] },
  knobPressed: { boxShadow: shadow['--oniva-elevation-pressed'] },
  // sizes (track w x h, knob d, inset 2px / border 1px)
  trackSm: { height: 20, width: 36 },
  trackMd: { height: 24, width: 44 },
  trackLg: { height: 32, width: 56 },
  knobSm: { height: 14, insetBlockStart: 2, insetInlineStart: 2, width: 14 },
  knobSmOn: { transform: { default: 'translateX(16px)', ':dir(rtl)': 'translateX(-16px)' } },
  knobMd: { height: 18, insetBlockStart: 2, insetInlineStart: 2, width: 18 },
  knobMdOn: { transform: { default: 'translateX(20px)', ':dir(rtl)': 'translateX(-20px)' } },
  knobLg: { height: 24, insetBlockStart: 3, insetInlineStart: 3, width: 24 },
  knobLgOn: { transform: { default: 'translateX(24px)', ':dir(rtl)': 'translateX(-24px)' } },
});

export interface SwitchProps extends Omit<AriaSwitchProps, 'className' | 'style' | 'children'> {
  style?: CSSProperties;
  size?: ControlSize;
  children?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLLabelElement>;
}

const sizeMap = {
  sm: ['trackSm', 'knobSm', 'knobSmOn'],
  md: ['trackMd', 'knobMd', 'knobMdOn'],
  lg: ['trackLg', 'knobLg', 'knobLgOn'],
} as const;

export function Switch({
  size = 'md',
  children,
  className,
  style,
  xstyle,
  ref,
  ...rest
}: SwitchProps) {
  const [trackKey, knobKey, knobOnKey] = sizeMap[size];
  return (
    <AriaSwitch
      {...rest}
      ref={ref}
      className={({ isDisabled }) =>
        mergeSx(stylex.props(styles.root, isDisabled && styles.rootDisabled, xstyle), className)
          .className
      }
      style={({ isDisabled }) =>
        mergeSx(
          stylex.props(styles.root, isDisabled && styles.rootDisabled, xstyle),
          className,
          style,
        ).style
      }
    >
      {({ isSelected, isFocusVisible, isHovered, isPressed }) => (
        <>
          <span
            aria-hidden="true"
            {...stylex.props(
              styles.track,
              styles[trackKey],
              isSelected && styles.trackOn,
              isFocusVisible && styles.focus,
            )}
          >
            <span
              {...stylex.props(
                styles.knob,
                styles[knobKey],
                isSelected && styles[knobOnKey],
                isHovered && !isPressed && styles.knobHover,
                isPressed && styles.knobPressed,
              )}
            />
          </span>
          {children}
        </>
      )}
    </AriaSwitch>
  );
}
