import * as stylex from '@stylexjs/stylex';
import {
  FieldError as AriaFieldError,
  Label as AriaLabel,
  Text,
  type FieldErrorProps as AriaFieldErrorProps,
  type LabelProps as AriaLabelProps,
  type TextProps,
} from 'react-aria-components';
import type { HTMLAttributes, Ref } from 'react';
import { cx, ff } from '../../internal/forms-field';

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Vertical layout wrapper for a label, control, description and error. */
export function Field({ className, xstyle, ref, ...rest }: FieldProps) {
  const sx = stylex.props(ff.root, xstyle);
  return <div {...rest} ref={ref} className={cx(sx.className, className)} />;
}

export interface LabelProps extends Omit<AriaLabelProps, 'className'> {
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLLabelElement>;
}

export function Label({ className, xstyle, ref, ...rest }: LabelProps) {
  const sx = stylex.props(ff.label, xstyle);
  return <AriaLabel {...rest} ref={ref} className={cx(sx.className, className)} />;
}

export interface DescriptionProps extends Omit<TextProps, 'className' | 'slot'> {
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function Description({ className, xstyle, ref, ...rest }: DescriptionProps) {
  const sx = stylex.props(ff.description, xstyle);
  return <Text {...rest} ref={ref} slot="description" className={cx(sx.className, className)} />;
}

export interface FieldErrorProps extends Omit<AriaFieldErrorProps, 'className'> {
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function FieldError({ className, xstyle, ref, ...rest }: FieldErrorProps) {
  const sx = stylex.props(ff.error, xstyle);
  return <AriaFieldError {...rest} ref={ref} className={cx(sx.className, className)} />;
}
