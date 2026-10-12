import * as stylex from '@stylexjs/stylex';
import { Minus, Plus } from 'lucide-react';
import {
  Button,
  FieldError,
  Group,
  Input,
  Label,
  NumberField as AriaNumberField,
  Text,
  type NumberFieldProps as AriaNumberFieldProps,
  type ValidationResult,
} from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { cx, ff, type FieldSize } from '../../internal/forms-field';
import { fp } from '../../internal/forms-popover';

const styles = stylex.create({
  group: { paddingInline: 4 },
  input: { fontVariantNumeric: 'tabular-nums', paddingInline: 4, textAlign: 'center' },
  step: {
    opacity: { default: 1, ':disabled': 0.4 },
    color: colors['--oniva-color-icon-muted'],
  },
});

export interface NumberFieldProps extends Omit<
  AriaNumberFieldProps,
  'className' | 'style' | 'children'
> {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: string | ((v: ValidationResult) => string);
  placeholder?: string;
  size?: FieldSize;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLInputElement>;
}

export function NumberField({
  label,
  description,
  errorMessage,
  placeholder,
  size = 'md',
  className,
  xstyle,
  ref,
  ...rest
}: NumberFieldProps) {
  const root = stylex.props(ff.root, xstyle);
  return (
    <AriaNumberField {...rest} className={cx(root.className, className)}>
      {({ isInvalid, isDisabled }) => (
        <>
          {label != null && <Label {...stylex.props(ff.label)}>{label}</Label>}
          <Group
            {...stylex.props(
              ff.control,
              ff[size],
              styles.group,
              isInvalid && ff.invalid,
              isDisabled && ff.disabled,
            )}
          >
            <Button slot="decrement" {...stylex.props(fp.iconButton, styles.step)}>
              <Minus size={14} aria-hidden="true" />
            </Button>
            <Input ref={ref} placeholder={placeholder} {...stylex.props(ff.bare, styles.input)} />
            <Button slot="increment" {...stylex.props(fp.iconButton, styles.step)}>
              <Plus size={14} aria-hidden="true" />
            </Button>
          </Group>
          {description != null && (
            <Text slot="description" {...stylex.props(ff.description)}>
              {description}
            </Text>
          )}
          <FieldError {...stylex.props(ff.error)}>{errorMessage}</FieldError>
        </>
      )}
    </AriaNumberField>
  );
}
