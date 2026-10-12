import * as stylex from '@stylexjs/stylex';
import { Checkbox as AriaCheckbox, type CheckboxProps } from 'react-aria-components';
import { Check, Minus } from 'lucide-react';
import { tableStyles as s } from './data-table-styles';

/** Compact checkbox for table selection (RAC Checkbox). Pass `slot="selection"` inside Table. */
export function DataCheckbox(props: Omit<CheckboxProps, 'className' | 'style' | 'children'>) {
  return (
    <AriaCheckbox {...props} className={() => stylex.props(s.checkbox).className ?? ''}>
      {({ isSelected, isIndeterminate, isFocusVisible }) => (
        <span
          {...stylex.props(
            s.checkBox,
            (isSelected || isIndeterminate) && s.checkBoxOn,
            isFocusVisible && s.checkBoxFocus,
          )}
        >
          {isIndeterminate ? (
            <Minus size={12} strokeWidth={3} aria-hidden="true" />
          ) : isSelected ? (
            <Check size={12} strokeWidth={3} aria-hidden="true" />
          ) : null}
        </span>
      )}
    </AriaCheckbox>
  );
}
