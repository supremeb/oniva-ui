import * as stylex from '@stylexjs/stylex';
import {
  FieldError,
  Label,
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  Text,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps as AriaRadioProps,
  type ValidationResult,
} from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { cx, ff } from '../../internal/forms-field';

const styles = stylex.create({
  items: { display: 'flex', flexDirection: 'column', gap: 12 },
  itemsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
  itemsCards: { gap: 8 },
  radio: {
    alignItems: 'flex-start',
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 10,
    lineHeight: font['--oniva-font-lh-14'],
  },
  disabled: { cursor: 'not-allowed', opacity: 0.5 },
  dot: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border-control'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-xs'],
    boxSizing: 'border-box',
    flexShrink: 0,
    height: 16,
    marginTop: 2,
    position: 'relative',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'border-color, background-color, box-shadow',
    width: 16,
  },
  dotHover: { borderColor: colors['--oniva-color-border-active'] },
  dotOn: {
    backgroundImage: `linear-gradient(180deg, ${accent['--oniva-accent-500']}, ${accent['--oniva-accent-600']})`,
    borderColor: 'transparent',
    boxShadow: shadow['--oniva-shadow-accent-inset'],
  },
  pip: {
    backgroundColor: colors['--oniva-color-accent-fg'],
    borderRadius: radius['--oniva-radius-full'],
    height: 6,
    insetBlockStart: 4,
    insetInlineStart: 4,
    position: 'absolute',
    width: 6,
  },
  text: { display: 'flex', flexDirection: 'column', gap: 2 },
  desc: { fontWeight: font['--oniva-font-weight-regular'] },
  card: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-xs'],
    boxSizing: 'border-box',
    padding: 12,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'border-color, background-color, box-shadow',
  },
  cardHover: { borderColor: colors['--oniva-color-border-hover'] },
  cardOn: {
    backgroundColor: colors['--oniva-color-accent-tint'],
    borderColor: colors['--oniva-color-focus-ring'],
  },
  cardTrail: {
    fontVariantNumeric: 'tabular-nums',
    marginInlineStart: 'auto',
    fontWeight: font['--oniva-font-weight-semibold'],
  },
});

export interface RadioProps extends Omit<AriaRadioProps, 'className' | 'style' | 'children'> {
  children?: ReactNode;
  description?: ReactNode;
  /** Plain radio, or a bordered selectable card. */
  variant?: 'default' | 'card';
  /** Trailing content for card variant (e.g. a price). */
  trailing?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLLabelElement>;
}

export function Radio({
  children,
  description,
  variant = 'default',
  trailing,
  className,
  xstyle,
  ref,
  ...rest
}: RadioProps) {
  const isCard = variant === 'card';
  return (
    <AriaRadio
      {...rest}
      ref={ref}
      className={({ isDisabled, isSelected, isHovered, isFocusVisible }) =>
        cx(
          stylex.props(
            styles.radio,
            isCard && styles.card,
            isCard && isHovered && !isSelected && styles.cardHover,
            isCard && isSelected && styles.cardOn,
            isCard && isFocusVisible && ff.focusRing,
            isDisabled && styles.disabled,
            xstyle,
          ).className,
          className,
        )
      }
    >
      {({ isSelected, isHovered, isFocusVisible }) => (
        <>
          <span
            aria-hidden="true"
            {...stylex.props(
              styles.dot,
              isHovered && !isSelected && styles.dotHover,
              isSelected && styles.dotOn,
              !isCard && isFocusVisible && ff.focusRing,
            )}
          >
            {isSelected && <span {...stylex.props(styles.pip)} />}
          </span>
          <span {...stylex.props(styles.text)}>
            {children}
            {description != null && (
              <span {...stylex.props(ff.description, styles.desc)}>{description}</span>
            )}
          </span>
          {trailing != null && <span {...stylex.props(styles.cardTrail)}>{trailing}</span>}
        </>
      )}
    </AriaRadio>
  );
}

export interface RadioGroupProps extends Omit<
  AriaRadioGroupProps,
  'className' | 'style' | 'children'
> {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: string | ((v: ValidationResult) => string);
  /** Layout hint for card-style radios (adds tighter gap). */
  cards?: boolean;
  children?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function RadioGroup({
  label,
  description,
  errorMessage,
  cards,
  children,
  className,
  xstyle,
  ref,
  ...rest
}: RadioGroupProps) {
  const root = stylex.props(ff.root, xstyle);
  return (
    <AriaRadioGroup {...rest} ref={ref} className={cx(root.className, className)}>
      {label != null && <Label {...stylex.props(ff.label)}>{label}</Label>}
      <div
        {...stylex.props(
          styles.items,
          cards && styles.itemsCards,
          rest.orientation === 'horizontal' && styles.itemsRow,
        )}
      >
        {children}
      </div>
      {description != null && (
        <Text slot="description" {...stylex.props(ff.description)}>
          {description}
        </Text>
      )}
      <FieldError {...stylex.props(ff.error)}>{errorMessage}</FieldError>
    </AriaRadioGroup>
  );
}
