import * as stylex from '@stylexjs/stylex';
import {
  Button as AriaButton,
  Tree as AriaTree,
  TreeItem as AriaTreeItem,
  TreeItemContent,
  type TreeItemProps as AriaTreeItemProps,
  type TreeProps as AriaTreeProps,
} from 'react-aria-components';
import { ChevronRight } from 'lucide-react';
import type { ReactNode, Ref } from 'react';
import { listStyles as s } from '../../internal/data-list-styles';
import { motion } from '../../tokens/motion.stylex';

const styles = stylex.create({
  indent: { paddingInlineStart: 'calc(8px + (var(--tree-item-level, 1) - 1) * 18px)' },
  chevron: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: 'inherit',
    display: 'inline-flex',
    flexShrink: 0,
    height: 16,
    justifyContent: 'center',
    padding: 0,
    width: 16,
  },
  chevronIcon: {
    transitionDuration: motion.durBase,
    transitionProperty: 'transform',
    transitionTimingFunction: motion.easeStandard,
  },
  chevronOpen: { transform: 'rotate(90deg)' },
  spacer: { display: 'inline-block', flexShrink: 0, width: 16 },
});

export interface TreeViewProps<T extends object> extends Omit<
  AriaTreeProps<T>,
  'className' | 'style'
> {
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Hierarchical, keyboard-navigable tree (React Aria Tree) with expand/collapse and selection. */
export function TreeView<T extends object>({ className, xstyle, ref, ...rest }: TreeViewProps<T>) {
  return (
    <AriaTree
      {...rest}
      ref={ref}
      className={({ isFocusVisible }) => {
        const sx = stylex.props(s.root, isFocusVisible && s.rootFocus, xstyle);
        return [sx.className, className].filter(Boolean).join(' ');
      }}
    />
  );
}

export interface TreeViewItemProps extends Omit<
  AriaTreeItemProps,
  'className' | 'style' | 'children' | 'textValue'
> {
  /** Label text (also used as `textValue` for typeahead). */
  title: string;
  icon?: ReactNode;
  /** Nested `TreeViewItem`s. */
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
}

export function TreeViewItem({ title, icon, children, xstyle, ...rest }: TreeViewItemProps) {
  return (
    <AriaTreeItem
      textValue={title}
      {...rest}
      className={({ isFocused, isFocusVisible, isSelected, isDisabled }) =>
        stylex.props(
          s.item,
          styles.indent,
          isFocused && s.itemFocus,
          isFocusVisible && s.itemFocusRing,
          isSelected && s.itemSelected,
          isDisabled && s.itemDisabled,
          xstyle,
        ).className ?? ''
      }
    >
      <TreeItemContent>
        {({ hasChildItems, isExpanded, isSelected }) => (
          <>
            {hasChildItems ? (
              <AriaButton slot="chevron" {...stylex.props(styles.chevron)}>
                <ChevronRight
                  size={14}
                  aria-hidden="true"
                  {...stylex.props(styles.chevronIcon, isExpanded && styles.chevronOpen)}
                />
              </AriaButton>
            ) : (
              <span aria-hidden="true" {...stylex.props(styles.spacer)} />
            )}
            {icon && (
              <span aria-hidden="true" {...stylex.props(s.icon, isSelected && s.iconSelected)}>
                {icon}
              </span>
            )}
            <span {...stylex.props(s.label)}>{title}</span>
          </>
        )}
      </TreeItemContent>
      {children}
    </AriaTreeItem>
  );
}
