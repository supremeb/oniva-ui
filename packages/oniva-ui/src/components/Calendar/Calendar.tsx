import * as stylex from '@stylexjs/stylex';
import {
  Calendar as AriaCalendar,
  type CalendarProps as AriaCalendarProps,
  type DateValue,
} from 'react-aria-components';
import type { Ref } from 'react';
import { cx } from '../../internal/forms-field';
import { CalendarBody, fc } from '../../internal/forms-calendar';

export interface CalendarProps<T extends DateValue> extends Omit<
  AriaCalendarProps<T>,
  'className' | 'style' | 'children'
> {
  /** Draw the surface card (border + shadow). Default true. */
  bordered?: boolean;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function Calendar<T extends DateValue>({
  bordered = true,
  className,
  xstyle,
  ref,
  ...rest
}: CalendarProps<T>) {
  const sx = stylex.props(fc.root, bordered && fc.card, xstyle);
  return (
    <AriaCalendar {...rest} ref={ref} className={cx(sx.className, className)}>
      <CalendarBody />
    </AriaCalendar>
  );
}
