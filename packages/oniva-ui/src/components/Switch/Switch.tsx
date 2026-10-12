import * as stylex from '@stylexjs/stylex';
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
    color: colors.text,
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: font.sans,
    fontSize: font.size14,
    fontWeight: font.weightMedium,
    gap: 10,
    lineHeight: font.lh14,
  },
  rootDisabled: { cursor: 'not-allowed', opacity: 0.5 },
  track: {
    backgroundImage: `linear-gradient(180deg, ${colors.surface}, ${colors.surfaceHover})`,
    borderColor: { default: colors.border, '@media (forced-colors: active)': 'ButtonText' },
    borderRadius: radius.full,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow.xs,
    boxSizing: 'border-box',
    flexShrink: 0,
    position: 'relative',
    transitionDuration: { default: motion.durBase, '@media (prefers-reduced-motion: reduce)': '0.01ms' },
    transitionProperty: 'background-image, border-color, box-shadow',
    transitionTimingFunction: motion.easeStandard,
  },
  trackOn: {
    backgroundImage: `linear-gradient(180deg, ${accent.accent500}, ${accent.accent600})`,
    borderColor: { default: 'transparent', '@media (forced-colors: active)': 'Highlight' },
    boxShadow: shadow.accentInset,
  },
  knobOn: { backgroundImage: 'none', backgroundColor: colors.accentFg },
  focus: {
    outlineColor: colors.focusRing,
    outlineOffset: 2,
    outlineStyle: 'solid',
    outlineWidth: 2,
  },
  knob: {
    backgroundImage: `linear-gradient(180deg, ${colors.surface}, ${colors.surfaceHover})`,
    borderColor: { default: 'transparent', '@media (forced-colors: active)': 'ButtonText' },
    borderRadius: radius.full,
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    boxShadow: shadow.sm,
    position: 'absolute',
    transitionDuration: { default: motion.durBase, '@media (prefers-reduced-motion: reduce)': '0.01ms' },
    transitionProperty: 'inset-inline-start',
    transitionTimingFunction: motion.easeStandard,
  },
  // sizes (track w x h, knob d, inset 2px / border 1px)
  trackSm: { height: 20, width: 36 },
  trackMd: { height: 24, width: 44 },
  trackLg: { height: 32, width: 56 },
  knobSm: { height: 14, insetBlockStart: 2, insetInlineStart: 2, width: 14 },
  knobSmOn: { insetInlineStart: 18 },
  knobMd: { height: 18, insetBlockStart: 2, insetInlineStart: 2, width: 18 },
  knobMdOn: { insetInlineStart: 22 },
  knobLg: { height: 24, insetBlockStart: 3, insetInlineStart: 3, width: 24 },
  knobLgOn: { insetInlineStart: 27 },
});

export interface SwitchProps extends Omit<AriaSwitchProps, 'className' | 'style' | 'children'> {
  style?: CSSProperties;
  size?: 'sm' | 'md' | 'lg';
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

export function Switch({ size = 'md', children, className, style, xstyle, ref, ...rest }: SwitchProps) {
  const [trackKey, knobKey, knobOnKey] = sizeMap[size];
  return (
    <AriaSwitch
      {...rest}
      ref={ref}
      className={({ isDisabled }) =>
        mergeSx(stylex.props(styles.root, isDisabled && styles.rootDisabled, xstyle), className).className
      }
      style={({ isDisabled }) =>
        mergeSx(stylex.props(styles.root, isDisabled && styles.rootDisabled, xstyle), className, style).style
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
              {...stylex.props(styles.knob, styles[knobKey], isSelected && styles[knobOnKey], isSelected && styles.knobOn)}
            />
          </span>
          {children}
        </>
      )}
    </AriaSwitch>
  );
}
