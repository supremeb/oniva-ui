import * as stylex from '@stylexjs/stylex';
import { Form as AriaForm, type FormProps as AriaFormProps } from 'react-aria-components';
import type { Ref } from 'react';
import { cx } from '../../internal/forms-field';

const styles = stylex.create({
  root: { display: 'flex', flexDirection: 'column', gap: 20 },
  compact: { gap: 12 },
});

export interface FormProps extends Omit<AriaFormProps, 'className'> {
  /** Tighter vertical rhythm. */
  compact?: boolean;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLFormElement>;
}

export function Form({ compact, className, xstyle, ref, ...rest }: FormProps) {
  const sx = stylex.props(styles.root, compact && styles.compact, xstyle);
  return <AriaForm {...rest} ref={ref} className={cx(sx.className, className)} />;
}
