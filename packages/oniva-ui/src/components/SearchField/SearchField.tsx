import * as stylex from '@stylexjs/stylex';
import { Search, X } from 'lucide-react';
import {
  Button,
  FieldError,
  Input,
  Label,
  SearchField as AriaSearchField,
  Text,
  type SearchFieldProps as AriaSearchFieldProps,
  type ValidationResult,
} from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { cx, ff, type FieldSize } from '../../internal/forms-field';
import { fp } from '../../internal/forms-popover';

const styles = stylex.create({
  kbd: {
    backgroundColor: colors.kbdBg,
    borderRadius: radius.full,
    color: colors.textOnTertiary,
    fontFamily: font.sans,
    fontSize: font.size12,
    fontWeight: font.weightSemibold,
    lineHeight: font.lh12,
    paddingBlock: 2,
    paddingInline: 8,
  },
});

export interface SearchFieldProps extends Omit<AriaSearchFieldProps, 'className' | 'style' | 'children'> {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: string | ((v: ValidationResult) => string);
  placeholder?: string;
  size?: FieldSize;
  /** Keyboard hint badge shown while empty, e.g. "⌘K". Pass `null` to hide. */
  shortcut?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLInputElement>;
}

export function SearchField({
  label,
  description,
  errorMessage,
  placeholder = 'Search…',
  size = 'md',
  shortcut = '⌘K',
  className,
  xstyle,
  ref,
  ...rest
}: SearchFieldProps) {
  const root = stylex.props(ff.root, xstyle);
  return (
    <AriaSearchField {...rest} className={cx(root.className, className)}>
      {({ isEmpty, isInvalid, isDisabled }) => (
        <>
          {label != null && <Label {...stylex.props(ff.label)}>{label}</Label>}
          <div
            {...stylex.props(ff.control, ff[size], isInvalid && ff.invalid, isDisabled && ff.disabled)}
          >
            <Search size={16} aria-hidden="true" {...stylex.props(ff.adornment)} />
            <Input
              ref={ref}
              placeholder={placeholder}
              {...stylex.props(ff.bare)}
              style={{ WebkitAppearance: 'none' }}
            />
            {isEmpty ? (
              shortcut != null && (
                <kbd aria-hidden="true" {...stylex.props(styles.kbd)}>
                  {shortcut}
                </kbd>
              )
            ) : (
              <Button {...stylex.props(fp.iconButton)}>
                <X size={14} aria-hidden="true" />
              </Button>
            )}
          </div>
          {description != null && (
            <Text slot="description" {...stylex.props(ff.description)}>
              {description}
            </Text>
          )}
          <FieldError {...stylex.props(ff.error)}>{errorMessage}</FieldError>
        </>
      )}
    </AriaSearchField>
  );
}
