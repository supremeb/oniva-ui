import * as stylex from '@stylexjs/stylex';
import {
  Cell as AriaCell,
  Collection,
  Column as AriaColumn,
  Row as AriaRow,
  Table as AriaTable,
  TableBody as AriaTableBody,
  TableHeader as AriaTableHeader,
  useTableOptions,
  type CellProps as AriaCellProps,
  type ColumnProps as AriaColumnProps,
  type RowProps as AriaRowProps,
  type TableBodyProps as AriaTableBodyProps,
  type TableProps as AriaTableProps,
} from 'react-aria-components';
import { ChevronUp } from 'lucide-react';
import { createContext, useContext, type ReactNode, type Ref } from 'react';
import { DataCheckbox } from '../../internal/data-checkbox';
import { tableStyles as s } from '../../internal/data-table-styles';

export type TableDensity = 'sm' | 'md';

const TableCtx = createContext<{ density: TableDensity; sticky: boolean }>({
  density: 'md',
  sticky: false,
});

export interface TableProps extends Omit<AriaTableProps, 'className' | 'style' | 'children'> {
  /** Row/header height. `sm` = 44px rows, `md` = 56px rows. */
  density?: TableDensity;
  /** Keep the header visible while the body scrolls (container gets a max-height). */
  stickyHeader?: boolean;
  children?: ReactNode;
  className?: string;
  /** Overrides for the scroll container. */
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLTableElement>;
}

export function Table({
  density = 'md',
  stickyHeader = false,
  className,
  xstyle,
  ref,
  children,
  ...rest
}: TableProps) {
  const sx = stylex.props(s.scroll, stickyHeader && s.scrollSticky, xstyle);
  return (
    <TableCtx value={{ density, sticky: stickyHeader }}>
      <div {...sx} className={[sx.className, className].filter(Boolean).join(' ')}>
        <AriaTable {...rest} ref={ref} {...stylex.props(s.table)}>
          {children}
        </AriaTable>
      </div>
    </TableCtx>
  );
}

export interface TableHeaderProps<T extends object> {
  columns?: Iterable<T>;
  children?: ReactNode | ((item: T) => ReactNode);
}

/** Header row. Adds the selection checkbox column automatically when selection is enabled. */
export function TableHeader<T extends object>({ columns, children }: TableHeaderProps<T>) {
  const { selectionBehavior, selectionMode } = useTableOptions();
  const { density, sticky } = useContext(TableCtx);
  return (
    <AriaTableHeader {...stylex.props(s.head)}>
      {selectionBehavior === 'toggle' && (
        <AriaColumn
          width={48}
          minWidth={48}
          {...{
            className: () =>
              stylex.props(s.column, s[density], s.checkCell, sticky && s.columnSticky).className ??
              '',
          }}
        >
          {selectionMode === 'multiple' ? (
            <DataCheckbox slot="selection" aria-label="Select all" />
          ) : null}
        </AriaColumn>
      )}
      {columns ? (
        <Collection items={columns}>{children as (item: T) => ReactNode}</Collection>
      ) : (
        (children as ReactNode)
      )}
    </AriaTableHeader>
  );
}

export interface ColumnProps extends Omit<AriaColumnProps, 'className' | 'style' | 'children'> {
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
}

/** Column header. Set `allowsSorting` for a sort caret that shows direction. */
export function Column({ children, xstyle, ...rest }: ColumnProps) {
  const { density, sticky } = useContext(TableCtx);
  return (
    <AriaColumn
      {...rest}
      className={({ allowsSorting, isFocusVisible }) =>
        stylex.props(
          s.column,
          s[density],
          sticky && s.columnSticky,
          allowsSorting && s.columnSortable,
          isFocusVisible && s.columnFocus,
          xstyle,
        ).className ?? ''
      }
    >
      {({ allowsSorting, sortDirection }) => (
        <span {...stylex.props(s.columnInner)}>
          {children}
          {allowsSorting && (
            <ChevronUp
              size={14}
              aria-hidden="true"
              {...stylex.props(
                s.caret,
                sortDirection && s.caretVisible,
                sortDirection === 'descending' && s.caretDesc,
              )}
            />
          )}
        </span>
      )}
    </AriaColumn>
  );
}

export type TableBodyProps<T extends object> = Omit<AriaTableBodyProps<T>, 'className' | 'style'>;

export function TableBody<T extends object>(props: TableBodyProps<T>) {
  return <AriaTableBody {...props} />;
}

export interface RowProps<T extends object> extends Omit<
  AriaRowProps<T>,
  'className' | 'style' | 'children'
> {
  /** Optional column list; then `children` is a render function per column. */
  children?: ReactNode | ((column: T) => ReactNode);
  xstyle?: stylex.StyleXStyles;
}

/** Body row. Adds the selection checkbox cell automatically when selection is enabled. */
export function Row<T extends object>({ children, columns, xstyle, ...rest }: RowProps<T>) {
  const { selectionBehavior } = useTableOptions();
  const { density } = useContext(TableCtx);
  return (
    <AriaRow
      {...rest}
      columns={columns}
      className={({ isSelected, isFocusVisible, isPressed }) =>
        stylex.props(
          s.row,
          isSelected && s.rowSelected,
          isFocusVisible && s.rowFocus,
          (rest.onAction || isPressed) && s.rowPressable,
          xstyle,
        ).className ?? ''
      }
    >
      {selectionBehavior === 'toggle' && (
        <AriaCell
          {...{
            className: () =>
              stylex.props(s.cell, density === 'sm' ? s.cellSm : s.cellMd, s.checkCell).className ??
              '',
          }}
        >
          <DataCheckbox slot="selection" />
        </AriaCell>
      )}
      {columns ? (
        <Collection items={columns}>{children as (item: T) => ReactNode}</Collection>
      ) : (
        (children as ReactNode)
      )}
    </AriaRow>
  );
}

export interface CellProps extends Omit<AriaCellProps, 'className' | 'style' | 'children'> {
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
}

export function Cell({ children, xstyle, ...rest }: CellProps) {
  const { density } = useContext(TableCtx);
  return (
    <AriaCell
      {...rest}
      className={({ isFocusVisible }) =>
        stylex.props(
          s.cell,
          density === 'sm' ? s.cellSm : s.cellMd,
          isFocusVisible && s.cellFocus,
          xstyle,
        ).className ?? ''
      }
    >
      {children}
    </AriaCell>
  );
}
