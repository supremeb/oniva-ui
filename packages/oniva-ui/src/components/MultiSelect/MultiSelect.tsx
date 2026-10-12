import * as stylex from '@stylexjs/stylex';
import { ChevronDown, X } from 'lucide-react';
import { useRef, type ReactNode, type Ref } from 'react';
import {
  Button,
  FieldError,
  Label,
  Select as AriaSelect,
  SelectValue,
  Text,
  type Key,
  type SelectProps as AriaSelectProps,
  type ValidationResult,
} from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { cx, ff } from '../../internal/forms-field';
import { FormsItem, FormsListBox, FormsPopover } from '../../internal/forms-listbox';
import { fp } from '../../internal/forms-popover';

const styles = stylex.create({
  root: { width: '100%' },
  control: { height: 'auto', minHeight: 38, paddingBlock: 4, position: 'relative' },
  hit: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderRadius: radius['--oniva-radius-lg'],
    borderWidth: 0,
    cursor: 'pointer',
    insetBlock: 0,
    insetInline: 0,
    outline: 'none',
    position: 'absolute',
  },
  chips: {
    alignItems: 'center',
    display: 'flex',
    flexGrow: 1,
    flexWrap: 'wrap',
    gap: 4,
    minWidth: 0,
    paddingInlineEnd: 24,
    pointerEvents: 'none',
    position: 'relative',
  },
  chip: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-text-on-tertiary'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-semibold'],
    gap: 2,
    lineHeight: font['--oniva-font-lh-12'],
    paddingBlock: 2,
    paddingInlineEnd: 4,
    paddingInlineStart: 8,
  },
  chipX: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors['--oniva-color-surface-tertiary-hover'],
    },
    borderRadius: radius['--oniva-radius-full'],
    borderWidth: 0,
    color: 'inherit',
    cursor: 'pointer',
    display: 'inline-flex',
    height: 16,
    justifyContent: 'center',
    padding: 0,
    pointerEvents: 'auto',
    position: 'relative',
    width: 16,
    zIndex: 1,
  },
  chevron: { insetInlineEnd: 10, pointerEvents: 'none', position: 'absolute' },
  placeholder: {
    color: colors['--oniva-color-text-placeholder'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-regular'],
  },
});

export interface MultiSelectOption {
  id: string;
  label: string;
}

export interface MultiSelectProps extends Omit<
  AriaSelectProps<MultiSelectOption, 'multiple'>,
  | 'className'
  | 'style'
  | 'children'
  | 'selectionMode'
  | 'items'
  | 'value'
  | 'defaultValue'
  | 'onChange'
> {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: string | ((v: ValidationResult) => string);
  placeholder?: string;
  options: MultiSelectOption[];
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLButtonElement>;
}

/** Select with multiple selection; chosen options render as removable tag chips. */
export function MultiSelect({
  label,
  description,
  errorMessage,
  placeholder = 'Select…',
  options,
  value,
  defaultValue,
  onChange,
  className,
  xstyle,
  ref,
  ...rest
}: MultiSelectProps) {
  const root = stylex.props(ff.root, styles.root, xstyle);
  const anchor = useRef<HTMLDivElement>(null);
  return (
    <AriaSelect<MultiSelectOption, 'multiple'>
      {...rest}
      selectionMode="multiple"
      value={value}
      defaultValue={defaultValue}
      onChange={(v) => onChange?.((v ?? []).map(String))}
      className={cx(root.className, className)}
    >
      {({ isInvalid, isDisabled }) => (
        <>
          {label != null && <Label {...stylex.props(ff.label)}>{label}</Label>}
          <div
            ref={anchor}
            {...stylex.props(
              ff.control,
              ff.md,
              styles.control,
              isInvalid && ff.invalid,
              isDisabled && ff.disabled,
            )}
          >
            <Button ref={ref} className={stylex.props(styles.hit).className}>
              <span
                style={{
                  position: 'absolute',
                  width: 1,
                  height: 1,
                  overflow: 'hidden',
                  clip: 'rect(0 0 0 0)',
                }}
              >
                {placeholder}
              </span>
            </Button>
            <SelectValue<MultiSelectOption> className={stylex.props(styles.chips).className ?? ''}>
              {({ selectedItems, state }) =>
                selectedItems.length === 0 || selectedItems.every((i) => i == null) ? (
                  <span {...stylex.props(styles.placeholder)}>{placeholder}</span>
                ) : (
                  selectedItems.map((item) =>
                    item ? (
                      <span key={item.id} {...stylex.props(styles.chip)}>
                        {item.label}
                        {!isDisabled && (
                          <button
                            type="button"
                            tabIndex={-1}
                            aria-label={`Remove ${item.label}`}
                            onClick={() => {
                              const cur = (state.value ?? []) as readonly Key[];
                              state.setValue(cur.filter((k) => k !== item.id));
                            }}
                            {...stylex.props(styles.chipX)}
                          >
                            <X size={12} aria-hidden="true" />
                          </button>
                        )}
                      </span>
                    ) : null,
                  )
                )
              }
            </SelectValue>
            <ChevronDown
              size={16}
              aria-hidden="true"
              {...stylex.props(fp.chevron, styles.chevron)}
            />
          </div>
          {description != null && (
            <Text slot="description" {...stylex.props(ff.description)}>
              {description}
            </Text>
          )}
          <FieldError {...stylex.props(ff.error)}>{errorMessage}</FieldError>
          <FormsPopover triggerRef={anchor}>
            <FormsListBox items={options}>
              {(o: MultiSelectOption) => <FormsItem id={o.id}>{o.label}</FormsItem>}
            </FormsListBox>
          </FormsPopover>
        </>
      )}
    </AriaSelect>
  );
}
