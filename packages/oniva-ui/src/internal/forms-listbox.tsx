import * as stylex from '@stylexjs/stylex';
import { Check } from 'lucide-react';
import {
  ListBox,
  ListBoxItem,
  ListBoxSection,
  Header,
  Popover,
  Text,
  type ListBoxItemProps,
  type ListBoxProps,
  type PopoverProps,
} from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { type DotTone, dotKey, fp } from './forms-popover';
import { cx } from './forms-field';

/** Popover surface shared by Select / Combobox / MultiSelect / DatePicker. */
export function FormsPopover({
  className,
  xstyle,
  auto,
  ...rest
}: Omit<PopoverProps, 'className'> & {
  className?: string;
  xstyle?: stylex.StyleXStyles;
  auto?: boolean;
}) {
  return (
    <Popover
      offset={6}
      {...rest}
      className={() => {
        const sx = stylex.props(fp.popover, auto && fp.popoverAuto, xstyle);
        return cx(sx.className, className);
      }}
    />
  );
}

export function FormsListBox<T extends object>(
  props: Omit<ListBoxProps<T>, 'className'> & { className?: string; ref?: Ref<HTMLDivElement> },
) {
  const { className, ...rest } = props;
  return <ListBox {...rest} className={() => cx(stylex.props(fp.listbox).className, className)} />;
}

export interface FormsItemProps extends Omit<ListBoxItemProps, 'className' | 'children'> {
  children?: ReactNode;
  /** Colored status dot (BoardUI-style status select). */
  dot?: DotTone;
  /** Leading icon node. */
  icon?: ReactNode;
  description?: ReactNode;
  className?: string;
  /** Hide the trailing check when selected. */
  hideCheck?: boolean;
}

export function StatusDot({ tone }: { tone: DotTone }) {
  return <span aria-hidden="true" {...stylex.props(fp.dot, fp[dotKey[tone]])} />;
}

export function FormsItem({
  children,
  dot,
  icon,
  description,
  className,
  hideCheck,
  ...rest
}: FormsItemProps) {
  const textValue = rest.textValue ?? (typeof children === 'string' ? children : undefined);
  return (
    <ListBoxItem
      {...rest}
      textValue={textValue}
      className={({ isFocused, isSelected, isDisabled }) =>
        cx(
          stylex.props(
            fp.item,
            isFocused && fp.itemFocused,
            isSelected && fp.itemSelected,
            isDisabled && fp.itemDisabled,
          ).className,
          className,
        )
      }
    >
      {({ isSelected }) => (
        <>
          {dot && <StatusDot tone={dot} />}
          {icon != null && (
            <span aria-hidden="true" {...stylex.props(fp.check)}>
              {icon}
            </span>
          )}
          <span {...stylex.props(fp.itemLabel)}>
            <Text slot="label">{children}</Text>
            {description != null && (
              <Text slot="description" {...stylex.props(fp.itemDescription)}>
                {description}
              </Text>
            )}
          </span>
          {isSelected && !hideCheck && (
            <Check size={16} aria-hidden="true" {...stylex.props(fp.check)} />
          )}
        </>
      )}
    </ListBoxItem>
  );
}

export function FormsSection({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <ListBoxSection>
      <Header {...stylex.props(fp.sectionHeader)}>{title}</Header>
      {children}
    </ListBoxSection>
  );
}
