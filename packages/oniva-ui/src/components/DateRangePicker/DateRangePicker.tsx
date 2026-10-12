import * as stylex from '@stylexjs/stylex';
import { CalendarDays } from 'lucide-react';
import {
  Button,
  DateRangePicker as AriaDateRangePicker,
  Dialog,
  FieldError,
  Group,
  Label,
  RangeCalendar as AriaRangeCalendar,
  Text,
  type DateRangePickerProps as AriaDateRangePickerProps,
  type DateValue,
  type ValidationResult,
} from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { cx, ff, type FieldSize } from '../../internal/forms-field';
import { CalendarBody, fc } from '../../internal/forms-calendar';
import { fd, Segments } from '../../internal/forms-date';
import { FormsPopover } from '../../internal/forms-listbox';
import { fp } from '../../internal/forms-popover';

const styles = stylex.create({
  group: { paddingInlineEnd: 6 },
  dialog: { outline: 'none' },
  inputs: { alignItems: 'center', display: 'flex', flexGrow: 1, minWidth: 0 },
});

export interface DateRangePickerProps<T extends DateValue>
  extends Omit<AriaDateRangePickerProps<T>, 'className' | 'style' | 'children'> {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: string | ((v: ValidationResult) => string);
  size?: FieldSize;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function DateRangePicker<T extends DateValue>({
  label,
  description,
  errorMessage,
  size = 'md',
  className,
  xstyle,
  ref,
  ...rest
}: DateRangePickerProps<T>) {
  const root = stylex.props(ff.root, xstyle);
  return (
    <AriaDateRangePicker {...rest} ref={ref} className={cx(root.className, className)}>
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
            <div {...stylex.props(styles.inputs)}>
              <Segments slot="start" />
              <span aria-hidden="true" {...stylex.props(fd.sep)}>
                –
              </span>
              <Segments slot="end" />
            </div>
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
              <AriaRangeCalendar visibleDuration={{ months: 2 }} {...stylex.props(fc.root)}>
                <CalendarBody range visibleDuration={2} />
              </AriaRangeCalendar>
            </Dialog>
          </FormsPopover>
        </>
      )}
    </AriaDateRangePicker>
  );
}
