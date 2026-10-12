import * as stylex from '@stylexjs/stylex';
import {
  GridList as AriaGridList,
  GridListItem as AriaGridListItem,
  Text,
  type GridListItemProps as AriaGridListItemProps,
  type GridListProps as AriaGridListProps,
} from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { DataCheckbox } from '../../internal/data-checkbox';
import { listStyles as s } from '../../internal/data-list-styles';

export interface ListProps<T extends object> extends Omit<
  AriaGridListProps<T>,
  'className' | 'style'
> {
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Interactive list with rows that can hold actions, checkboxes and rich content (React Aria GridList). */
export function List<T extends object>({ className, xstyle, ref, ...rest }: ListProps<T>) {
  return (
    <AriaGridList
      {...rest}
      ref={ref}
      className={({ isFocusVisible }) => {
        const sx = stylex.props(s.root, isFocusVisible && s.rootFocus, xstyle);
        return [sx.className, className].filter(Boolean).join(' ');
      }}
    />
  );
}

export interface ListItemProps extends Omit<
  AriaGridListItemProps,
  'className' | 'style' | 'children'
> {
  icon?: ReactNode;
  description?: ReactNode;
  /** Trailing content (badge, action buttons...). */
  trailing?: ReactNode;
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
}

export function ListItem({
  icon,
  description,
  trailing,
  children,
  xstyle,
  ...rest
}: ListItemProps) {
  return (
    <AriaGridListItem
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
      {({ selectionMode, selectionBehavior, isSelected }) => (
        <>
          {selectionMode === 'multiple' && selectionBehavior === 'toggle' && (
            <DataCheckbox slot="selection" />
          )}
          {icon && (
            <span aria-hidden="true" {...stylex.props(s.icon, isSelected && s.iconSelected)}>
              {icon}
            </span>
          )}
          <span {...stylex.props(s.text)}>
            <Text {...stylex.props(s.label)}>{children}</Text>
            {description && (
              <Text slot="description" {...stylex.props(s.description)}>
                {description}
              </Text>
            )}
          </span>
          {trailing && <span {...stylex.props(s.trail)}>{trailing}</span>}
        </>
      )}
    </AriaGridListItem>
  );
}
