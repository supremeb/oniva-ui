import * as stylex from '@stylexjs/stylex';
import {
  Button as AriaButton,
  ListBox,
  ListBoxItem,
  Popover,
  Select as AriaSelect,
} from 'react-aria-components';
import { Check, ChevronDown } from 'lucide-react';
import { colors } from '../tokens/colors.stylex';
import { tableStyles as s } from './data-table-styles';

const dots = stylex.create({
  success: { backgroundColor: colors.successSolid },
  warning: { backgroundColor: colors.warningSolid },
  danger: { backgroundColor: colors.dangerSolid },
  info: { backgroundColor: colors.infoSolid },
  neutral: { backgroundColor: colors.textSubtle },
});

export type StatusTone = keyof typeof dots;

export interface SelectOption {
  value: string;
  label: string;
  /** Leading status dot color. */
  tone?: StatusTone;
}

export interface InlineSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  'aria-label': string;
  size?: 'sm' | 'md';
  xstyle?: stylex.StyleXStyles;
}

/** Small RAC Select used for DataTable filters and the status-select cell. */
export function InlineSelect({
  value,
  onChange,
  options,
  size = 'md',
  xstyle,
  ...rest
}: InlineSelectProps) {
  const current = options.find((o) => o.value === value);
  return (
    <AriaSelect
      aria-label={rest['aria-label']}
      selectedKey={value}
      onSelectionChange={(k) => {
        if (k != null) onChange(String(k));
      }}
    >
      <AriaButton
        className={() =>
          stylex.props(s.selectTrigger, size === 'sm' ? s.selectSm : s.selectMd, xstyle)
            .className ?? ''
        }
      >
        <span {...stylex.props(s.selectValue)}>
          {current?.tone && <span {...stylex.props(s.statusDot, dots[current.tone])} />}
          {current?.label ?? ''}
        </span>
        <ChevronDown size={16} aria-hidden="true" {...stylex.props(s.selectChevron)} />
      </AriaButton>
      <Popover placement="bottom start" className={() => stylex.props(s.popover).className ?? ''}>
        <ListBox>
          {options.map((o) => (
            <ListBoxItem
              key={o.value}
              id={o.value}
              textValue={o.label}
              className={({ isFocused, isSelected }) =>
                stylex.props(s.option, isFocused && s.optionFocus, isSelected && s.optionSelected)
                  .className ?? ''
              }
            >
              {({ isSelected }) => (
                <>
                  {o.tone && <span {...stylex.props(s.statusDot, dots[o.tone])} />}
                  {o.label}
                  {isSelected && (
                    <Check size={14} aria-hidden="true" {...stylex.props(s.optionCheck)} />
                  )}
                </>
              )}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}
