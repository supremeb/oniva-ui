import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { applyFilters, FilterBar, type FilterField, type FilterValue } from './FilterBar';
import { expectNoA11yViolations } from '../../internal/test-a11y';

const fields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'n', label: 'Amount', type: 'number' },
];

function Harness({ initial = [] as FilterValue[] }) {
  const [f, setF] = useState(initial);
  return <FilterBar fields={fields} filters={f} onFiltersChange={setF} className="x" data-testid="fb" />;
}

describe('FilterBar', () => {
  it('applyFilters handles operators', () => {
    const rows = [{ name: 'Ann', n: 5 }, { name: 'Bob', n: 20 }];
    expect(applyFilters(rows, [{ id: '1', field: 'n', operator: '>', value: '10' }])).toHaveLength(1);
    expect(applyFilters(rows, [{ id: '1', field: 'name', operator: 'contains', value: 'an' }])).toHaveLength(1);
  });
  it('removes filters and clears all', async () => {
    render(<Harness initial={[{ id: '1', field: 'name', operator: 'is', value: 'Ann' }, { id: '2', field: 'n', operator: '>', value: '3' }]} />);
    expect(screen.getByTestId('fb')).toHaveClass('x');
    await userEvent.click(screen.getByRole('button', { name: 'Remove Name filter' }));
    expect(screen.queryByRole('group', { name: 'Name filter' })).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(screen.queryByRole('group', { name: 'Amount filter' })).toBeNull();
  });
  it('has no a11y violations', async () => {
    const { container } = render(<Harness initial={[{ id: '1', field: 'name', operator: 'is', value: 'Ann' }]} />);
    await expectNoA11yViolations(container);
  });
});
