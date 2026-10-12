import * as stylex from '@stylexjs/stylex';
import { CalendarDays } from 'lucide-react';
import {
  Button,
  DatePicker as AriaDatePicker,
  Dialog,
  FieldError,
  Group,
  Label,
  Text,
  type DatePickerProps as AriaDatePickerProps,
  type DateValue,
  type ValidationResult,
} from 'react-aria-components';
import { Calendar as AriaCalendar } from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { cx, ff, type FieldSize } from '../../internal/forms-field';
import { CalendarBody, fc } from '../../internal/forms-calendar';
import { Segments } from '../../internal/forms-date';
import { FormsPopover } from '../../internal/forms-listbox';
import { fp } from '../../internal/forms-popover';

const styles = stylex.create({
  group: { paddingInlineEnd: 6 },
  dialog: { outline: 'none' },
});

export interface DatePickerProps<T extends DateValue> extends Omit<
  AriaDatePickerProps<T>,
  'className' | 'style' | 'children'
> {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: string | ((v: ValidationResult) => string);
  size?: FieldSize;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function DatePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  size = 'md',
  className,
  xstyle,
  ref,
  ...rest
}: DatePickerProps<T>) {
  const root = stylex.props(ff.root, xstyle);
  return (
    <AriaDatePicker {...rest} ref={ref} className={cx(root.className, className)}>
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
            <Segments />
            <Button aria-label="Open calendar" {...stylex.props(fp.iconButton)}>
              <CalendarDays size={16} aria-hidden="true" />
            </Button>
          </Group>
          {description != null && (
            <Text slot="description" {...stylex.props(ff.description)}>
              {description}
            </Text>
          )}
          <FieldError {...stylex.props(ff.error)}>{errorMessage}</FieldError>
          <FormsPopover auto>
            <Dialog {...stylex.props(styles.dialog)}>
              <AriaCalendar {...stylex.props(fc.root)}>
                <CalendarBody />
              </AriaCalendar>
            </Dialog>
          </FormsPopover>
        </>
      )}
    </AriaDatePicker>
  );
}
