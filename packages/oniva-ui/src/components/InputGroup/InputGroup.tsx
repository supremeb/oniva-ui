import * as stylex from '@stylexjs/stylex';
import {
  FieldError,
  Input,
  Label,
  Text,
  TextField,
  type TextFieldProps,
  type ValidationResult,
} from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { cx, ff, type FieldSize } from '../../internal/forms-field';

const styles = stylex.create({
  group: { overflow: 'hidden', paddingInline: 0 },
  addon: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors['--oniva-color-surface-hover'],
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    flexShrink: 0,
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 6,
    paddingInline: 10,
  },
  start: {
    borderInlineEndColor: colors['--oniva-color-border'],
    borderInlineEndStyle: 'solid',
    borderInlineEndWidth: 1,
  },
  end: {
    borderInlineStartColor: colors['--oniva-color-border'],
    borderInlineStartStyle: 'solid',
    borderInlineStartWidth: 1,
  },
  input: { paddingInline: 10 },
});

export interface InputGroupProps extends Omit<TextFieldProps, 'className' | 'style' | 'children'> {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: string | ((v: ValidationResult) => string);
  placeholder?: string;
  size?: FieldSize;
  /** Attached segment before the input (text, icon, or a select/button). */
  startAddon?: ReactNode;
  /** Attached segment after the input. */
  endAddon?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLInputElement>;
}

export function InputGroup({
  label,
  description,
  errorMessage,
  placeholder,
  size = 'md',
  startAddon,
  endAddon,
  className,
  xstyle,
  ref,
  ...rest
}: InputGroupProps) {
  const root = stylex.props(ff.root, xstyle);
  return (
    <TextField {...rest} className={cx(root.className, className)}>
      {({ isInvalid, isDisabled }) => (
        <>
          {label != null && <Label {...stylex.props(ff.label)}>{label}</Label>}
          <div
            {...stylex.props(
              ff.control,
              ff[size],
              styles.group,
              isInvalid && ff.invalid,
              isDisabled && ff.disabled,
            )}
          >
            {startAddon != null && (
              <div {...stylex.props(styles.addon, styles.start)}>{startAddon}</div>
            )}
            <Input ref={ref} placeholder={placeholder} {...stylex.props(ff.bare, styles.input)} />
            {endAddon != null && <div {...stylex.props(styles.addon, styles.end)}>{endAddon}</div>}
          </div>
          {description != null && (
            <Text slot="description" {...stylex.props(ff.description)}>
              {description}
            </Text>
          )}
          <FieldError {...stylex.props(ff.error)}>{errorMessage}</FieldError>
        </>
      )}
    </TextField>
  );
}
