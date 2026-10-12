import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MultiSelect } from './MultiSelect';

const options = [
  { id: 'design', label: 'Design' },
  { id: 'eng', label: 'Engineering' },
  { id: 'fin', label: 'Finance' },
];

describe('MultiSelect', () => {
  it('selects several options and shows chips', async () => {
    const onChange = vi.fn();
    render(<MultiSelect label="Teams" options={options} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /Teams/ }));
    const list = await screen.findByRole('listbox');
    await userEvent.click(within(list).getByRole('option', { name: 'Design' }));
    await userEvent.click(within(list).getByRole('option', { name: 'Finance' }));
    expect(onChange).toHaveBeenLastCalledWith(['design', 'fin']);
    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Remove Design' })).toBeInTheDocument();
  });

  it('removes a chip via its remove button', async () => {
    const onChange = vi.fn();
    render(
      <MultiSelect label="Teams" options={options} defaultValue={['design', 'eng']} onChange={onChange} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Remove Design' }));
    expect(onChange).toHaveBeenLastCalledWith(['eng']);
    expect(screen.queryByRole('button', { name: 'Remove Design' })).toBeNull();
  });
});
