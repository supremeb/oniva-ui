import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import type { SortDescriptor } from 'react-aria-components';
import { describe, expect, it } from 'vitest';
import { Cell, Column, Row, Table, TableBody, TableHeader } from './Table';

const data = [
  { id: 'a', name: 'Zed' },
  { id: 'b', name: 'Amy' },
];

function Sample({ selectable = false }: { selectable?: boolean }) {
  const [sort, setSort] = useState<SortDescriptor>({ column: 'name', direction: 'ascending' });
  const rows = [...data].sort((x, y) =>
    sort.direction === 'ascending' ? x.name.localeCompare(y.name) : y.name.localeCompare(x.name),
  );
  return (
    <Table
      aria-label="People"
      className="custom"
      sortDescriptor={sort}
      onSortChange={setSort}
      selectionMode={selectable ? 'multiple' : 'none'}
    >
      <TableHeader>
        <Column id="name" isRowHeader allowsSorting>
          Name
        </Column>
      </TableHeader>
      <TableBody items={rows}>
        {(r) => (
          <Row id={r.id}>
            <Cell>{r.name}</Cell>
          </Row>
        )}
      </TableBody>
    </Table>
  );
}

describe('Table', () => {
  it('renders a grid with columns and rows', () => {
    render(<Sample />);
    expect(screen.getByRole('grid', { name: 'People' })).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(3);
    expect(screen.getByRole('columnheader', { name: /Name/ })).toBeInTheDocument();
  });

  it('sorts when the header is pressed', async () => {
    render(<Sample />);
    const first = () => within(screen.getAllByRole('row')[1]!).getByRole('rowheader').textContent;
    expect(first()).toBe('Amy');
    await userEvent.click(screen.getByRole('columnheader', { name: /Name/ }));
    expect(first()).toBe('Zed');
  });

  it('adds checkboxes when selection is enabled', async () => {
    render(<Sample selectable />);
    const boxes = screen.getAllByRole('checkbox');
    expect(boxes).toHaveLength(3);
    await userEvent.click(boxes[1]!);
    expect(boxes[1]).toBeChecked();
    expect((boxes[0] as HTMLInputElement).indeterminate).toBe(true);
  });

  it('forwards className to the container', () => {
    const { container } = render(<Sample />);
    expect(container.querySelector('.custom')).toBeInTheDocument();
  });
});
