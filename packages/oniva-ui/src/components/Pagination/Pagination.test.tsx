import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination, getPaginationRange } from './Pagination';

describe('getPaginationRange', () => {
  it('shows all pages when few', () => {
    expect(getPaginationRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });
  it('adds ellipses', () => {
    expect(getPaginationRange(1, 20)).toEqual([1, 2, 3, 4, 5, 'ellipsis-end', 20]);
    expect(getPaginationRange(10, 20)).toEqual([1, 'ellipsis-start', 9, 10, 11, 'ellipsis-end', 20]);
    expect(getPaginationRange(20, 20)).toEqual([1, 'ellipsis-start', 16, 17, 18, 19, 20]);
  });
});

describe('Pagination', () => {
  it('marks current page and navigates with next/prev and page buttons', async () => {
    const onPageChange = vi.fn();
    render(<Pagination pageCount={20} defaultPage={10} onPageChange={onPageChange} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 10' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenLastCalledWith(11);
    expect(screen.getByRole('button', { name: 'Page 11' })).toHaveAttribute('aria-current', 'page');
    await userEvent.click(screen.getByRole('button', { name: 'Page 20' }));
    expect(onPageChange).toHaveBeenLastCalledWith(20);
  });
  it('disables prev on first page and next on last', () => {
    const { rerender } = render(<Pagination pageCount={3} page={1} />);
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    rerender(<Pagination pageCount={3} page={3} />);
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });
  it('simple variant shows summary and Next', async () => {
    const onPageChange = vi.fn();
    render(<Pagination variant="simple" pageCount={5} summary="Showing 1-10 of 48" onPageChange={onPageChange} />);
    expect(screen.getByText('Showing 1-10 of 48')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Next/ }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});
