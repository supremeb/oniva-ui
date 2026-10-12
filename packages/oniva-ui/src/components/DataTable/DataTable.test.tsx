import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ColumnDef } from '@tanstack/react-table';
import { describe, expect, it } from 'vitest';
import { PriceCell, StatusBadgeCell } from './cells';
import { DataTable } from './DataTable';

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
});
