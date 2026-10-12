import * as stylex from '@stylexjs/stylex';
import {
  CheckboxGroup as AriaCheckboxGroup,
  FieldError,
  Label,
  Text,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
  type ValidationResult,
} from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { cx, ff } from '../../internal/forms-field';

const styles = stylex.create({
  items: { display: 'flex', flexDirection: 'column', gap: 12 },
  itemsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
});

export interface CheckboxGroupProps
  extends Omit<AriaCheckboxGroupProps, 'className' | 'style' | 'children'> {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: string | ((v: ValidationResult) => string);
  orientation?: 'vertical' | 'horizontal';
  children?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function CheckboxGroup({
  label,
  description,
  errorMessage,
  orientation,
  children,
  className,
  xstyle,
  ref,
  ...rest
}: CheckboxGroupProps) {
  const root = stylex.props(ff.root, xstyle);
  return (
    <AriaCheckboxGroup {...rest} ref={ref} className={cx(root.className, className)}>
      {label != null && <Label {...stylex.props(ff.label)}>{label}</Label>}
      <div {...stylex.props(styles.items, orientation === 'horizontal' && styles.itemsRow)}>
        {children}
      </div>
      {description != null && (
        <Text slot="description" {...stylex.props(ff.description)}>
          {description}
        </Text>
      )}
      <FieldError {...stylex.props(ff.error)}>{errorMessage}</FieldError>
    </AriaCheckboxGroup>
  );
}
