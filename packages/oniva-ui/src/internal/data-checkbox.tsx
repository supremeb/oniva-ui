import * as stylex from '@stylexjs/stylex';
import { Checkbox as AriaCheckbox, type CheckboxProps } from 'react-aria-components';
import { CheckboxBox } from './checkbox-box';
import { tableStyles as s } from './data-table-styles';

/** Compact checkbox for table selection (RAC Checkbox). Pass `slot="selection"` inside Table. */
export function DataCheckbox(props: Omit<CheckboxProps, 'className' | 'style' | 'children'>) {
  return (
    <AriaCheckbox {...props} className={() => stylex.props(s.checkbox).className ?? ''}>
      {(state) => <CheckboxBox {...state} density="compact" />}
    </AriaCheckbox>
  );
}
