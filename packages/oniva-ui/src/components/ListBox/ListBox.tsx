import * as stylex from '@stylexjs/stylex';
import {
  Collection,
  Header,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  ListBoxSection as AriaListBoxSection,
  Text,
  type ListBoxItemProps as AriaListBoxItemProps,
  type ListBoxProps as AriaListBoxProps,
  type ListBoxSectionProps as AriaListBoxSectionProps,
} from 'react-aria-components';
import { Check } from 'lucide-react';
import type { ReactElement, ReactNode, Ref } from 'react';
import { listStyles as s } from '../../internal/data-list-styles';

export interface ListBoxProps<T extends object> extends Omit<
  AriaListBoxProps<T>,
  'className' | 'style'
> {
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Selectable list of options (single or multiple) on React Aria ListBox. */
export function ListBox<T extends object>({ className, xstyle, ref, ...rest }: ListBoxProps<T>) {
  return (
    <AriaListBox
      {...rest}
      ref={ref}
      className={({ isFocusVisible }) => {
        const sx = stylex.props(s.root, isFocusVisible && s.rootFocus, xstyle);
        return [sx.className, className].filter(Boolean).join(' ');
      }}
    />
  );
}

export interface ListBoxItemProps extends Omit<
  AriaListBoxItemProps,
  'className' | 'style' | 'children'
> {
  /** Leading icon. */
  icon?: ReactNode;
  /** Secondary text below the label. */
  description?: ReactNode;
  /** Trailing text (count, shortcut...). */
  trailing?: ReactNode;
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
}

export function ListBoxItem({
  icon,
  description,
  trailing,
  children,
  xstyle,
  ...rest
}: ListBoxItemProps) {
  return (
    <AriaListBoxItem
      textValue={rest.textValue ?? (typeof children === 'string' ? children : undefined)}
      {...rest}
      className={({ isFocused, isFocusVisible, isSelected, isDisabled }) =>
        stylex.props(
          s.item,
          isFocused && s.itemFocus,
          isFocusVisible && s.itemFocusRing,
          isSelected && s.itemSelected,
          isDisabled && s.itemDisabled,
          xstyle,
        ).className ?? ''
      }
    >
      {({ isSelected, selectionMode }) => (
        <>
          {icon && (
            <span aria-hidden="true" {...stylex.props(s.icon, isSelected && s.iconSelected)}>
              {icon}
            </span>
          )}
          <span {...stylex.props(s.text)}>
            <Text slot="label" {...stylex.props(s.label)}>
              {children}
            </Text>
            {description && (
              <Text slot="description" {...stylex.props(s.description)}>
                {description}
              </Text>
            )}
          </span>
          {trailing && <span {...stylex.props(s.trail)}>{trailing}</span>}
          {isSelected && selectionMode === 'multiple' && (
            <Check size={16} aria-hidden="true" {...stylex.props(s.iconSelected)} />
          )}
        </>
      )}
    </AriaListBoxItem>
  );
}

export interface ListBoxSectionProps<T extends object> extends Omit<
  AriaListBoxSectionProps<T>,
  'className' | 'style'
> {
  title?: ReactNode;
}

export function ListBoxSection<T extends object>({
  title,
  children,
  ...rest
}: ListBoxSectionProps<T>) {
  return (
    <AriaListBoxSection {...rest} {...stylex.props(s.section)}>
      {title && <Header {...stylex.props(s.sectionHeader)}>{title}</Header>}
      {rest.items ? (
        <Collection items={rest.items}>{children as (item: T) => ReactElement}</Collection>
      ) : (
        (children as ReactNode)
      )}
    </AriaListBoxSection>
  );
}
