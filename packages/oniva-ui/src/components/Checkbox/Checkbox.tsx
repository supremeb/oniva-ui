import * as stylex from '@stylexjs/stylex';
import {
  Checkbox as AriaCheckbox,
  type CheckboxProps as AriaCheckboxProps,
} from 'react-aria-components';
import { useState, type ReactNode, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { CheckboxBox } from '../../internal/checkbox-box';
import { cx, ff } from '../../internal/forms-field';

const styles = stylex.create({
  root: {
    alignItems: 'flex-start',
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 10,
    lineHeight: font['--oniva-font-lh-14'],
  },
  rootDisabled: { cursor: 'not-allowed', opacity: 0.5 },
  text: { display: 'flex', flexDirection: 'column', gap: 2 },
  desc: { fontWeight: font['--oniva-font-weight-regular'] },
});

export interface CheckboxProps extends Omit<AriaCheckboxProps, 'className' | 'style' | 'children'> {
  children?: ReactNode;
  description?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLLabelElement>;
}

export function Checkbox({
  children,
  description,
  className,
  xstyle,
  ref,
  ...rest
}: CheckboxProps) {
  // pointer-only press (keyboard Space must not scale)
  const [pressed, setPressed] = useState(false);
  return (
    <AriaCheckbox
      {...rest}
      onPressStart={(e) => {
        setPressed(e.pointerType !== 'keyboard' && e.pointerType !== 'virtual');
        rest.onPressStart?.(e);
      }}
      onPressEnd={(e) => {
        setPressed(false);
        rest.onPressEnd?.(e);
      }}
      ref={ref}
      className={({ isDisabled }) =>
        cx(
          stylex.props(styles.root, isDisabled && styles.rootDisabled, xstyle).className,
          className,
        )
      }
    >
      {(state) => (
        <>
          <CheckboxBox {...state} isPressed={pressed && !state.isDisabled} />
          {(children != null || description != null) && (
            <span {...stylex.props(styles.text)}>
              {children}
              {description != null && (
                <span {...stylex.props(ff.description, styles.desc)}>{description}</span>
              )}
            </span>
          )}
        </>
      )}
    </AriaCheckbox>
  );
}
