import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tag, TagGroup } from './Tag';

describe('TagGroup', () => {
  it('renders a labelled grid of tags', () => {
    render(
      <TagGroup label="Categories">
        <Tag id="a">Payments</Tag>
        <Tag id="b" color="success">Active</Tag>
      </TagGroup>,
    );
    expect(screen.getByRole('grid', { name: 'Categories' })).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(2);
  });
  it('removes via the remove button', async () => {
    const onRemove = vi.fn();
    render(
      <TagGroup aria-label="Filters" onRemove={onRemove}>
        <Tag id="eu">Region: EU</Tag>
        <Tag id="paid">Status: Paid</Tag>
      </TagGroup>,
    );
    const row = screen.getAllByRole('row')[0]!;
    await userEvent.click(within(row).getByRole('button'));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
  it('selection and color change classes', async () => {
    const onSelectionChange = vi.fn();
    render(
      <TagGroup aria-label="Pick" selectionMode="multiple" onSelectionChange={onSelectionChange}>
        <Tag id="a">One</Tag>
        <Tag id="b" color="danger">Two</Tag>
      </TagGroup>,
    );
    const [one, two] = screen.getAllByRole('row');
    expect(one!.className).not.toBe(two!.className);
    await userEvent.click(one!);
    expect(onSelectionChange).toHaveBeenCalled();
  });
});
