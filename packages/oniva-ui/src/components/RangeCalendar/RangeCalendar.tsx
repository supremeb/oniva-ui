import * as stylex from '@stylexjs/stylex';
import {
  RangeCalendar as AriaRangeCalendar,
  type DateValue,
  type RangeCalendarProps as AriaRangeCalendarProps,
} from 'react-aria-components';
import type { Ref } from 'react';
import { cx } from '../../internal/forms-field';
import { CalendarBody, fc } from '../../internal/forms-calendar';

export interface RangeCalendarProps<T extends DateValue>
  extends Omit<AriaRangeCalendarProps<T>, 'className' | 'style' | 'children'> {
  bordered?: boolean;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function RangeCalendar<T extends DateValue>({
  bordered = true,
  className,
  xstyle,
  ref,
  visibleDuration,
  ...rest
}: RangeCalendarProps<T>) {
  const sx = stylex.props(fc.root, bordered && fc.card, xstyle);
  return (
    <AriaRangeCalendar
      {...rest}
      visibleDuration={visibleDuration}
      ref={ref}
      className={cx(sx.className, className)}
    >
      <CalendarBody range visibleDuration={visibleDuration?.months} />
    </AriaRangeCalendar>
  );
}
