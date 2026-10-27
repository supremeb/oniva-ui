import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ColumnDef } from '@tanstack/react-table';
import { describe, expect, it, vi } from 'vitest';
import { PriceCell, StatusBadgeCell } from './cells';
import { DataTable, type DataTableMeta } from './DataTable';

interface Row {
  id: string;
  name: string;
  status: string;
  total: number;
}
const data: Row[] = Array.from({ length: 12 }, (_, i) => ({
  id: `r${i}`,
  name: `Person ${String.fromCharCode(65 + i)}`,
  status: i % 2 ? 'Shipped' : 'Waiting',
  total: 100 + i,
}));
const columns: ColumnDef<Row>[] = [
  { accessorKey: 'name', header: 'Name' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ getValue }) => <StatusBadgeCell label={getValue<string>()} variant="success" />,
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ getValue }) => <PriceCell value={getValue<number>()} />,
  },
];

function setup(extra = {}) {
  return render(
    <DataTable
      aria-label="People"
      data={data}
      columns={columns}
      itemLabel="people"
      pageSize={5}
      getRowId={(r) => r.id}
      filters={[
        {
          columnId: 'status',
          allLabel: 'All statuses',
          options: [{ value: 'Shipped', label: 'Shipped' }],
        },
      ]}
      {...extra}
    />,
  );
}

describe('DataTable', () => {
  it('shows total, one page of rows and pagination', () => {
    setup();
    expect(screen.getByText('12 people')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(6);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });

  it('goes to the next page', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: /Next/ }));
    expect(screen.getByText('6–10 of 12')).toBeInTheDocument();
  });

  it('filters with the global search', async () => {
    setup();
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search' }), 'Person C');
    expect(screen.getByText('1 people')).toBeInTheDocument();
  });

  it('selects rows with an indeterminate header checkbox', async () => {
    setup();
    const boxes = screen.getAllByRole('checkbox');
    await userEvent.click(boxes[1]!);
    expect((boxes[0] as HTMLInputElement).indeterminate).toBe(true);
    await userEvent.click(boxes[0]!);
    expect(boxes[3]).toBeChecked();
  });

  it('sorts a column descending on second press', async () => {
    setup();
    const header = screen.getByRole('columnheader', { name: /Name/ });
    await userEvent.click(header);
    await userEvent.click(header);
    const firstRow = screen.getAllByRole('row')[1]!;
    expect(within(firstRow).getByText('Person L')).toBeInTheDocument();
  });

  it('copies the selected rows as TSV with a header line', async () => {
    setup();
    await userEvent.click(screen.getAllByRole('checkbox')[1]!);
    await userEvent.click(screen.getAllByRole('checkbox')[2]!);
    expect(screen.getByText('2 selected')).toBeInTheDocument();
    const setData = vi.fn();
    fireEvent.copy(screen.getByRole('grid'), { clipboardData: { setData } });
    expect(setData).toHaveBeenCalledWith('text/plain', 'Name\tStatus\tTotal\nPerson A\tWaiting\t100\nPerson B\tShipped\t101');
    expect(screen.getByRole('status')).toHaveTextContent('Copied 2 rows');
  });

  it('does not hijack copy when nothing is selected or copyable is off', async () => {
    setup({ copyable: false });
    await userEvent.click(screen.getAllByRole('checkbox')[1]!);
    const setData = vi.fn();
    fireEvent.copy(screen.getByRole('grid'), { clipboardData: { setData } });
    expect(setData).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'Copy' })).toBeNull();
  });

  it('clears the selection from the selection bar', async () => {
    setup();
    await userEvent.click(screen.getAllByRole('checkbox')[1]!);
    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(screen.queryByText(/^\d+ selected$/)).toBeNull();
  });

  it('undoes and redoes cell edits with the keyboard', async () => {
    const onDataChange = vi.fn();
    const editable: ColumnDef<Row>[] = [
      { accessorKey: 'name', header: 'Name' },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row, table, getValue }) => (
          <button
            type="button"
            onClick={() => (table.options.meta as DataTableMeta<Row>).updateRow(row.id, { status: 'Done' })}
          >
            {getValue<string>()} {row.id}
          </button>
        ),
      },
    ];
    render(<DataTable aria-label="Edits" data={data} columns={editable} pageSize={3} getRowId={(r) => r.id} onDataChange={onDataChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Waiting r0' }));
    expect(screen.getByRole('button', { name: 'Done r0' })).toBeInTheDocument();
    const root = screen.getByRole('grid');
    fireEvent.keyDown(root, { key: 'z', ctrlKey: true });
    expect(screen.getByRole('button', { name: 'Waiting r0' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Undid last edit');
    fireEvent.keyDown(root, { key: 'z', ctrlKey: true, shiftKey: true });
    expect(screen.getByRole('button', { name: 'Done r0' })).toBeInTheDocument();
    expect(onDataChange).toHaveBeenCalledTimes(3);
  });

  it('shows an add row button that calls back', async () => {
    const onAddRow = vi.fn(() => ({ id: 'r99', name: 'Person Z', status: 'Waiting', total: 1 }));
    setup({ onAddRow, addRowLabel: 'New customer' });
    await userEvent.click(screen.getByRole('button', { name: 'New customer' }));
    expect(onAddRow).toHaveBeenCalled();
    expect(screen.getByText('13 people')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Added a row');
  });

  it('sheet layout renders a grid and edits a cell by typing and Enter', () => {
    const onDataChange = vi.fn();
    const sheetCols: ColumnDef<Row>[] = [
      { accessorKey: 'name', header: 'Name', meta: { sheet: { type: 'title' } } },
      { accessorKey: 'total', header: 'Total', meta: { sheet: { type: 'number' } } },
    ];
    render(
      <DataTable layout="sheet" title="People" aria-label="People" data={data.slice(0, 3)} columns={sheetCols} getRowId={(r) => r.id} onDataChange={onDataChange} />,
    );
    const grid = screen.getByRole('grid', { name: 'People' });
    expect(screen.getAllByRole('columnheader').length).toBeGreaterThan(1);
    fireEvent.keyDown(grid, { key: 'Z' });
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Zed' } });
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' });
    expect(onDataChange).toHaveBeenCalled();
    expect(onDataChange.mock.calls.at(-1)![0][0].name).toBe('Zed');
  });
});
