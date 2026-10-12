import * as stylex from '@stylexjs/stylex';
import { ChevronDown } from 'lucide-react';
import {
  Button,
  ComboBox as AriaComboBox,
  FieldError,
  Input,
  Label,
  Text,
  type ComboBoxProps as AriaComboBoxProps,
  type ValidationResult,
} from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { cx, ff, type FieldSize } from '../../internal/forms-field';
import {
  FormsItem,
  FormsListBox,
  FormsPopover,
  FormsSection,
  type FormsItemProps,
} from '../../internal/forms-listbox';
import { fp } from '../../internal/forms-popover';

const styles = stylex.create({ root: { width: '100%' } });

export type ComboboxItemProps = FormsItemProps;
export const ComboboxItem = FormsItem;
export const ComboboxSection = FormsSection;

export interface ComboboxProps<T extends object> extends Omit<
  AriaComboBoxProps<T>,
  'className' | 'style' | 'children'
> {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: string | ((v: ValidationResult) => string);
  placeholder?: string;
  size?: FieldSize;
  children: ReactNode | ((item: T) => ReactNode);
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLInputElement>;
}

export function Combobox<T extends object>({
  label,
  description,
  errorMessage,
  placeholder = 'Search…',
  size = 'md',
  children,
  items,
  className,
  xstyle,
  ref,
  ...rest
}: ComboboxProps<T>) {
  const root = stylex.props(ff.root, styles.root, xstyle);
  return (
    <AriaComboBox {...rest} className={cx(root.className, className)}>
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
            <Input ref={ref} placeholder={placeholder} {...stylex.props(ff.bare)} />
            <Button {...stylex.props(fp.iconButton)}>
              <ChevronDown size={16} aria-hidden="true" />
            </Button>
          </div>
          {description != null && (
            <Text slot="description" {...stylex.props(ff.description)}>
              {description}
            </Text>
          )}
          <FieldError {...stylex.props(ff.error)}>{errorMessage}</FieldError>
          <FormsPopover>
            <FormsListBox items={items}>{children}</FormsListBox>
          </FormsPopover>
        </>
      )}
    </AriaComboBox>
  );
}
