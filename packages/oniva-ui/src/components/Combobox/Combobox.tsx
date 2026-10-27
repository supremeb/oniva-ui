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
  type Key,
  type ValidationResult,
} from 'react-aria-components';
import { useState, type ReactNode, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { cx, ff, type FieldSize } from '../../internal/forms-field';
import {
  FormsItem,
  FormsListBox,
  FormsPopover,
  FormsSection,
  type FormsItemProps,
} from '../../internal/forms-listbox';
import { fp } from '../../internal/forms-popover';
import { GlideSurface } from '../../internal/m5-glide';

const styles = stylex.create({
  root: { width: '100%' },
  empty: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-14'],
    paddingBlock: 12,
    paddingInline: 12,
    textAlign: 'center',
  },
});

const CREATE_ID = '__oniva-create__';

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
  /** Shown when nothing matches the typed text. Default `No results`. */
  emptyMessage?: ReactNode;
  /**
   * Adds a trailing create row for the typed text. Called with the text when it is chosen; add the new
   * item to your collection (and set `selectedKey` if you want it selected). Needs static (non-function) `children`.
   */
  onCreate?: (text: string) => void;
  /** Label of the create row. Default `Create “text”`. */
  createLabel?: (text: string) => string;
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
  emptyMessage = 'No results',
  onCreate,
  createLabel = (t) => `Create “${t}”`,
  className,
  xstyle,
  ref,
  ...rest
}: ComboboxProps<T>) {
  const root = stylex.props(ff.root, styles.root, xstyle);
  const [text, setText] = useState('');
  const [innerKey, setInnerKey] = useState<Key | null>(rest.defaultSelectedKey ?? null);
  const creatable = onCreate != null && typeof children !== 'function';
  const showCreate = creatable && text.trim() !== '';
  const creatableProps = creatable
    ? {
        selectedKey: rest.selectedKey !== undefined ? rest.selectedKey : innerKey,
        defaultSelectedKey: undefined,
        onSelectionChange: (k: Key | null) => {
          if (k === CREATE_ID) {
            onCreate(text.trim());
            return;
          }
          setInnerKey(k);
          rest.onSelectionChange?.(k);
        },
      }
    : {};
  return (
    <AriaComboBox
      {...rest}
      allowsEmptyCollection
      {...creatableProps}
      onInputChange={(v) => {
        setText(v);
        rest.onInputChange?.(v);
      }}
      className={cx(root.className, className)}>
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
            <GlideSurface>
            <FormsListBox
              items={items}
              renderEmptyState={() => <div {...stylex.props(styles.empty)}>{emptyMessage}</div>}
            >
              {children as ReactNode}
              {showCreate && (
                <FormsItem id={CREATE_ID} textValue={`${createLabel(text.trim())} ${text}`} hideCheck>
                  {createLabel(text.trim())}
                </FormsItem>
              )}
            </FormsListBox>
            </GlideSurface>
          </FormsPopover>
        </>
      )}
    </AriaComboBox>
  );
}
