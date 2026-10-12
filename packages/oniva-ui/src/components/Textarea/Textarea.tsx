import * as stylex from '@stylexjs/stylex';
import {
  FieldError,
  Label,
  Text,
  TextArea as AriaTextArea,
  TextField as AriaTextField,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult,
} from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { cx, ff } from '../../internal/forms-field';

const styles = stylex.create({
  footer: { display: 'flex', gap: 8, justifyContent: 'space-between' },
  footerText: { display: 'flex', flexDirection: 'column', gap: 6 },
  area: {
    alignItems: 'stretch',
    height: 'auto',
    paddingBlock: 8,
  },
  text: { height: 'auto', lineHeight: '20px', minHeight: 72, paddingBlock: 0 },
  resizeNone: { resize: 'none' },
  resizeY: { resize: 'vertical' },
  counter: { alignSelf: 'flex-end' },
});

export interface TextareaProps extends Omit<
  AriaTextFieldProps,
  'className' | 'style' | 'children'
> {
  label?: ReactNode;
  description?: ReactNode;
  errorMessage?: string | ((v: ValidationResult) => string);
  placeholder?: string;
  rows?: number;
  resize?: 'none' | 'vertical';
  /** Show a character counter when `maxLength` is set. */
  showCount?: boolean;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLTextAreaElement>;
}

export function Textarea({
  label,
  description,
  errorMessage,
  placeholder,
  rows = 3,
  resize = 'vertical',
  showCount,
  className,
  xstyle,
  ref,
  ...rest
}: TextareaProps) {
  const root = stylex.props(ff.root, xstyle);
  return (
    <AriaTextField {...rest} className={cx(root.className, className)}>
      {({ isInvalid, isDisabled }) => (
        <>
          {label != null && <Label {...stylex.props(ff.label)}>{label}</Label>}
          <div
            {...stylex.props(
              ff.control,
              styles.area,
              isInvalid && ff.invalid,
              isDisabled && ff.disabled,
            )}
          >
            <AriaTextArea
              ref={ref}
              rows={rows}
              placeholder={placeholder}
              {...stylex.props(
                ff.bare,
                styles.text,
                resize === 'none' ? styles.resizeNone : styles.resizeY,
              )}
            />
          </div>
          <div {...stylex.props(styles.footer)}>
            <div {...stylex.props(styles.footerText)}>
              {description != null && (
                <Text slot="description" {...stylex.props(ff.description)}>
                  {description}
                </Text>
              )}
              <FieldError {...stylex.props(ff.error)}>{errorMessage}</FieldError>
            </div>
            {showCount && rest.maxLength != null && (
              <span {...stylex.props(ff.description, ff.tabular, styles.counter)}>
                {(rest.value ?? rest.defaultValue ?? '').length}/{rest.maxLength}
              </span>
            )}
          </div>
        </>
      )}
    </AriaTextField>
  );
}
