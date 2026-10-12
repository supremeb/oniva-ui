import * as stylex from '@stylexjs/stylex';
import {
  Header as AriaHeader,
  Keyboard as AriaKeyboard,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  MenuTrigger as AriaMenuTrigger,
  Popover as AriaPopover,
  Separator as AriaSeparator,
  SubmenuTrigger as AriaSubmenuTrigger,
  Text as AriaText,
  type MenuItemProps as AriaMenuItemProps,
  type MenuProps as AriaMenuProps,
  type MenuSectionProps as AriaMenuSectionProps,
  type MenuTriggerProps as AriaMenuTriggerProps,
  type PopoverProps as AriaPopoverProps,
} from 'react-aria-components';
import { Check, ChevronRight, Circle } from 'lucide-react';
import type { ReactNode, Ref } from 'react';
import { menuStyles as m } from '../../internal/overlays-menu';
import { mergeSx } from '../../internal/sx';

export interface DropdownMenuProps extends AriaMenuTriggerProps {
  /** Trigger (pressable) followed by a `DropdownMenuContent`. */
  children: ReactNode;
}

/** Menu trigger wrapper: `<DropdownMenu><Button/><DropdownMenuContent>…</DropdownMenuContent></DropdownMenu>` */
export function DropdownMenu(props: DropdownMenuProps) {
  return <AriaMenuTrigger {...props} />;
}

export interface DropdownMenuContentProps<T extends object> extends Omit<
  AriaMenuProps<T>,
  'className' | 'style'
> {
  placement?: AriaPopoverProps['placement'];
  offset?: number;
  /** Anchor element override (used by ContextMenu to anchor at the pointer). */
  triggerRef?: AriaPopoverProps['triggerRef'];
  className?: string;
  /** StyleX overrides for the popover surface. */
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Popover + Menu. Use as the second child of `DropdownMenu`, or of `DropdownMenuSubmenu` for nested menus. */
export function DropdownMenuContent<T extends object>({
  placement,
  offset = 6,
  triggerRef,
  className,
  xstyle,
  ref,
  ...menuProps
}: DropdownMenuContentProps<T>) {
  return (
    <AriaPopover
      placement={placement}
      offset={offset}
      triggerRef={triggerRef}
      ref={ref}
      className={({ isEntering, isExiting }) =>
        mergeSx(
          stylex.props(m.popup, isEntering && m.popupEntering, isExiting && m.popupExiting, xstyle),
          className,
        ).className
      }
    >
      <AriaMenu<T> {...menuProps} {...stylex.props(m.menu)} />
    </AriaPopover>
  );
}

export interface DropdownMenuItemProps extends Omit<
  AriaMenuItemProps,
  'className' | 'style' | 'children'
> {
  children?: ReactNode;
  /** Leading icon (e.g. a lucide icon at 16px). */
  icon?: ReactNode;
  /** Keyboard shortcut hint, e.g. "⌘K". Display only. */
  shortcut?: string;
  variant?: 'default' | 'danger';
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function DropdownMenuItem({
  children,
  icon,
  shortcut,
  variant = 'default',
  className,
  xstyle,
  ref,
  textValue,
  ...rest
}: DropdownMenuItemProps) {
  const danger = variant === 'danger';
  return (
    <AriaMenuItem
      {...rest}
      ref={ref}
      textValue={textValue ?? (typeof children === 'string' ? children : undefined)}
      className={({ isFocused, isDisabled, isOpen }) =>
        mergeSx(
          stylex.props(
            m.item,
            danger && m.itemDanger,
            (isFocused || isOpen) && (danger ? m.itemDangerFocused : m.itemFocused),
            isDisabled && m.itemDisabled,
            xstyle,
          ),
          className,
        ).className
      }
    >
      {({ selectionMode, isSelected, hasSubmenu }) => (
        <>
          {selectionMode !== 'none' && (
            <span {...stylex.props(m.check)} aria-hidden="true">
              {isSelected &&
                (selectionMode === 'multiple' ? (
                  <Check size={14} />
                ) : (
                  <Circle size={6} fill="currentColor" />
                ))}
            </span>
          )}
          {icon && (
            <span {...stylex.props(m.itemIcon, danger && m.itemIconDanger)} aria-hidden="true">
              {icon}
            </span>
          )}
          <AriaText slot="label" {...stylex.props(m.itemLabel)}>
            {children}
          </AriaText>
          {shortcut && <AriaKeyboard {...stylex.props(m.shortcut)}>{shortcut}</AriaKeyboard>}
          {hasSubmenu && (
            <span {...stylex.props(m.chevron)} aria-hidden="true">
              <ChevronRight size={14} />
            </span>
          )}
        </>
      )}
    </AriaMenuItem>
  );
}

export interface DropdownMenuSectionProps<T extends object> extends Omit<
  AriaMenuSectionProps<T>,
  'className' | 'style'
> {
  /** Heading text for the section. */
  title?: ReactNode;
  className?: string;
}

export function DropdownMenuSection<T extends object>({
  title,
  className,
  children,
  ...rest
}: DropdownMenuSectionProps<T>) {
  return (
    <AriaMenuSection<T> {...rest} {...mergeSx(stylex.props(m.section), className)}>
      {title != null && <AriaHeader {...stylex.props(m.sectionHeader)}>{title}</AriaHeader>}
      {children as ReactNode}
    </AriaMenuSection>
  );
}

export function DropdownMenuSeparator() {
  return <AriaSeparator {...stylex.props(m.separator)} />;
}

export interface DropdownMenuSubmenuProps {
  /** A `DropdownMenuItem` (trigger) followed by a `DropdownMenuContent` (submenu). */
  children: [ReactNode, ReactNode];
  delay?: number;
}

export function DropdownMenuSubmenu({ children, delay }: DropdownMenuSubmenuProps) {
  return (
    <AriaSubmenuTrigger delay={delay}>
      {children as unknown as React.ReactElement[]}
    </AriaSubmenuTrigger>
  );
}
