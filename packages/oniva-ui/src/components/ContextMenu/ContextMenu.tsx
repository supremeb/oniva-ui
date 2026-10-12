import * as stylex from '@stylexjs/stylex';
import {
  Button as AriaButton,
  MenuTrigger as AriaMenuTrigger,
  type MenuProps as AriaMenuProps,
} from 'react-aria-components';
import { useRef, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { mergeSx } from '../../internal/sx';
import { DropdownMenuContent } from '../DropdownMenu';

const styles = stylex.create({
  area: { display: 'block' },
  anchor: {
    height: 0,
    pointerEvents: 'none',
    position: 'fixed',
    opacity: 0,
    padding: 0,
    borderWidth: 0,
    width: 0,
  },
});

export interface ContextMenuProps<T extends object = object> extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'className' | 'style' | 'children'
> {
  /** Menu contents: `DropdownMenuItem`, `DropdownMenuSection`, `DropdownMenuSeparator`, `DropdownMenuSubmenu`… */
  menu: ReactNode;
  /** Region that responds to right-click / long-press / the context-menu key. */
  children: ReactNode;
  onAction?: AriaMenuProps<T>['onAction'];
  /** Accessible name of the menu. */
  menuLabel?: string;
  isDisabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  xstyle?: stylex.StyleXStyles;
  /** StyleX overrides for the menu popover. */
  menuXstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Right-click menu. Wraps a region; the menu opens at the pointer on `contextmenu`
 * (also Shift+F10 / the Menu key on the focused region).
 */
export function ContextMenu<T extends object = object>({
  menu,
  children,
  onAction,
  menuLabel = 'Context menu',
  isDisabled,
  className,
  style,
  xstyle,
  menuXstyle,
  ref,
  onContextMenu,
  ...rest
}: ContextMenuProps<T>) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <div
        {...rest}
        ref={ref}
        {...mergeSx(stylex.props(styles.area, xstyle), className, style)}
        onContextMenu={(e) => {
          onContextMenu?.(e);
          if (isDisabled || e.defaultPrevented) return;
          e.preventDefault();
          const a = anchorRef.current;
          if (a) {
            a.style.left = `${e.clientX}px`;
            a.style.top = `${e.clientY}px`;
          }
          setOpen(true);
        }}
      >
        {children}
      </div>
      <AriaMenuTrigger isOpen={open} onOpenChange={setOpen}>
        <AriaButton
          ref={anchorRef}
          aria-hidden="true"
          aria-label={menuLabel}
          excludeFromTabOrder
          {...stylex.props(styles.anchor)}
        />
        <DropdownMenuContent<T>
          aria-label={menuLabel}
          placement="bottom start"
          offset={2}
          triggerRef={anchorRef}
          onAction={onAction}
          autoFocus
          xstyle={menuXstyle}
        >
          {menu}
        </DropdownMenuContent>
      </AriaMenuTrigger>
    </>
  );
}
