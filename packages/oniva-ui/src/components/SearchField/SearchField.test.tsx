import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SearchField } from './SearchField';

describe('SearchField', () => {
  it('has searchbox role, shows ⌘K hint while empty and a clear button once typed', async () => {
    const onChange = vi.fn();
    render(<SearchField aria-label="Search invoices" onChange={onChange} />);
    const box = screen.getByRole('searchbox', { name: 'Search invoices' });
    expect(screen.getByText('⌘K')).toBeInTheDocument();
    await userEvent.type(box, 'acme');
    expect(onChange).toHaveBeenLastCalledWith('acme');
    expect(screen.queryByText('⌘K')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(box).toHaveValue('');
  });

  it('submits on Enter, clears on Escape, and hides hint when shortcut is null', async () => {
    const onSubmit = vi.fn();
    render(<SearchField aria-label="Find" shortcut={null} onSubmit={onSubmit} defaultValue="x" />);
    const box = screen.getByRole('searchbox');
    await userEvent.type(box, '{Enter}');
    expect(onSubmit).toHaveBeenCalledWith('x');
    await userEvent.type(box, '{Escape}');
    expect(box).toHaveValue('');
  });
});
