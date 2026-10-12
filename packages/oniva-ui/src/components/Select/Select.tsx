import * as stylex from '@stylexjs/stylex';
import { media } from '../../tokens/media.stylex';
import { ChevronDown } from 'lucide-react';
import {
  Button,
  FieldError,
  Label,
  Select as AriaSelect,
  SelectValue,
  Text,
  type SelectProps as AriaSelectProps,
  type ValidationResult,
} from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { cx, ff, type FieldSize } from '../../internal/forms-field';
import {
  FormsItem,
  FormsListBox,
  FormsPopover,
  FormsSection,
  type FormsItemProps,
} from '../../internal/forms-listbox';
import { fp } from '../../internal/forms-popover';

const styles = stylex.create({
  root: { width: '100%' },
  trigger: {
    borderColor: {
      default: colors['--oniva-color-border'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-border-hover'] },
      ':focus-visible': colors['--oniva-color-focus-ring'],
    },
    boxShadow: {
      default: shadow['--oniva-shadow-xs'],
      ':focus-visible': `0 0 0 3px color-mix(in srgb, ${colors['--oniva-color-focus-ring']} 25%, transparent)`,
    },
  },
  open: { borderColor: colors['--oniva-color-focus-ring'] },
  triggerInvalid: {
    borderColor: {
      default: colors['--oniva-color-error-border'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-error-border'] },
      ':focus-visible': colors['--oniva-color-error-border'],
    },
  },
  disabledTrigger: { cursor: 'not-allowed' },
});

export type SelectItemProps = FormsItemProps;
/** Option for `Select`. `dot` renders a colored status dot (shown in the trigger too). */
export const SelectItem = FormsItem;
export const SelectSection = FormsSection;

export interface SelectProps<T extends object> extends Omit<
  AriaSelectProps<T, 'single'>,
  'className' | 'style' | 'children' | 'selectionMode'
> {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: string | ((v: ValidationResult) => string);
  placeholder?: string;
  size?: FieldSize;
  items?: Iterable<T>;
  children: ReactNode | ((item: T) => ReactNode);
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLButtonElement>;
}

export function Select<T extends object>({
  label,
  description,
  errorMessage,
  placeholder = 'Select an option…',
  size = 'md',
  items,
  children,
  className,
  xstyle,
  ref,
  ...rest
}: SelectProps<T>) {
  const root = stylex.props(ff.root, styles.root, xstyle);
  return (
    <AriaSelect {...rest} placeholder={placeholder} className={cx(root.className, className)}>
      {({ isInvalid, isDisabled, isOpen }) => (
        <>
          {label != null && <Label {...stylex.props(ff.label)}>{label}</Label>}
          <Button
            ref={ref}
            className={
              stylex.props(
                ff.control,
                ff[size],
                styles.trigger,
                fp.trigger,
                isOpen && styles.open,
                isInvalid && ff.invalid,
                isInvalid && styles.triggerInvalid,
                isDisabled && ff.disabled,
                isDisabled && styles.disabledTrigger,
              ).className
            }
          >
            <SelectValue
              className={({ isPlaceholder }) =>
                stylex.props(fp.triggerValue, isPlaceholder && fp.placeholder).className ?? ''
              }
            />
            <ChevronDown size={16} aria-hidden="true" {...stylex.props(fp.chevron)} />
          </Button>
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
    </AriaSelect>
  );
}
