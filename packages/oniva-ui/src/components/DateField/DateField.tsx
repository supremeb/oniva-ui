import * as stylex from '@stylexjs/stylex';
import {
  DateField as AriaDateField,
  FieldError,
  Label,
  Text,
  type DateFieldProps as AriaDateFieldProps,
  type DateValue,
  type ValidationResult,
} from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { cx, ff, type FieldSize } from '../../internal/forms-field';
import { Segments } from '../../internal/forms-date';

export interface DateFieldProps<T extends DateValue> extends Omit<
  AriaDateFieldProps<T>,
  'className' | 'style' | 'children'
> {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: string | ((v: ValidationResult) => string);
  size?: FieldSize;
  /** Trailing adornment (icon). */
  suffix?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function DateField<T extends DateValue>({
  label,
  description,
  errorMessage,
  size = 'md',
  suffix,
  className,
  xstyle,
  ref,
  ...rest
}: DateFieldProps<T>) {
  const root = stylex.props(ff.root, xstyle);
  return (
    <AriaDateField {...rest} ref={ref} className={cx(root.className, className)}>
      {({ isInvalid, isDisabled }) => (
        <>
          {label != null && <Label {...stylex.props(ff.label)}>{label}</Label>}
          <div
            {...stylex.props(
              ff.control,
              ff[size],
              isInvalid && ff.invalid,
              isDisabled && ff.disabled,
            )}
          >
            <Segments />
            {suffix != null && <span {...stylex.props(ff.adornment)}>{suffix}</span>}
          </div>
          {description != null && (
            <Text slot="description" {...stylex.props(ff.description)}>
              {description}
            </Text>
          )}
          <FieldError {...stylex.props(ff.error)}>{errorMessage}</FieldError>
        </>
      )}
    </AriaDateField>
  );
}
