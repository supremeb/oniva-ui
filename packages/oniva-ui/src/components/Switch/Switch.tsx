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
  track: {
    backgroundImage: `linear-gradient(180deg, ${colors['--oniva-color-surface']}, ${colors['--oniva-color-surface-hover']})`,
    borderColor: {
      default: colors['--oniva-color-border'],
      '@media (forced-colors: active)': 'ButtonText',
    },
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-xs'],
    boxSizing: 'border-box',
    flexShrink: 0,
    position: 'relative',
    transitionDuration: {
      default: motion['--oniva-motion-dur-base'],
      [media.reducedMotion]: '0.01ms',
    },
    transitionProperty: 'background-image, border-color, box-shadow',
    transitionTimingFunction: motion['--oniva-motion-ease-standard'],
  },
  trackOn: {
    backgroundImage: `linear-gradient(180deg, ${accent['--oniva-accent-500']}, ${accent['--oniva-accent-600']})`,
    borderColor: { default: 'transparent', '@media (forced-colors: active)': 'Highlight' },
    boxShadow: shadow['--oniva-shadow-accent-inset'],
  },
  knobOn: { backgroundImage: 'none', backgroundColor: colors['--oniva-color-accent-fg'] },
  focus: {
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 2,
    outlineStyle: 'solid',
    outlineWidth: 2,
  },
  knob: {
    backgroundImage: `linear-gradient(180deg, ${colors['--oniva-color-surface']}, ${colors['--oniva-color-surface-hover']})`,
    borderColor: { default: 'transparent', '@media (forced-colors: active)': 'ButtonText' },
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    boxShadow: shadow['--oniva-shadow-sm'],
    position: 'absolute',
    transitionDuration: {
      default: motion['--oniva-motion-dur-slow'],
      [media.reducedMotion]: '0.01ms',
    },
    // transform only (no layout props); small overshoot via ease-spring
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-spring'],
  },
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
      {({ isSelected, isFocusVisible }) => (
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
                isSelected && styles.knobOn,
              )}
            />
          </span>
          {children}
        </>
      )}
    </AriaSwitch>
  );
}
