import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ComposerAttachments } from './ComposerAttachments';

describe('ComposerAttachments', () => {
  it('renders tiles with size, upload ring and remove', () => {
    const onRemove = vi.fn();
    render(
      <ComposerAttachments
        onRemove={onRemove}
        files={[
          { id: 'a', name: 'q3_revenue.csv', size: 48_200, type: 'text/csv' },
          { id: 'b', name: 'board-deck.pdf', size: 2_400_000, status: 'uploading', progress: 42 },
        ]}
      />,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('47 KB')).toBeInTheDocument();
    expect(
      screen.getByRole('progressbar', { name: 'Uploading board-deck.pdf' }),
    ).toBeInTheDocument();
    expect(screen.getByText('42%')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Remove q3_revenue.csv' }));
    expect(onRemove).toHaveBeenCalledWith('a');
  });

  it('flags failed uploads', () => {
    render(<ComposerAttachments files={[{ id: 'c', name: 'bad.zip', status: 'error' }]} />);
    expect(screen.getByText('Upload failed')).toBeInTheDocument();
  });

  it('announces a failed upload with the file name', () => {
    render(<ComposerAttachments files={[{ id: 'c', name: 'bad.zip', status: 'error' }]} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Upload failed: bad.zip');
  });

  it('exposes the full name on truncated tiles', () => {
    const name = 'northwind-labs-quarterly-business-review-appendix-final-v3.xlsx';
    render(<ComposerAttachments files={[{ id: 'l', name, size: 3_900_000 }]} />);
    expect(screen.getByText(name)).toHaveAttribute('title', name);
    expect(screen.getByText('3.7 MB')).toBeInTheDocument();
  });

  it('clamps progress to 0-100 and treats 100 as done', () => {
    render(
      <ComposerAttachments
        files={[
          { id: 'a', name: 'over.bin', status: 'uploading', progress: 140 },
          { id: 'b', name: 'under.bin', status: 'uploading', progress: -5 },
          { id: 'c', name: 'done.bin', size: 2048, progress: 100 },
        ]}
      />,
    );
    expect(screen.getByRole('progressbar', { name: 'Uploading over.bin' })).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByRole('progressbar', { name: 'Uploading under.bin' })).toHaveAttribute('aria-valuenow', '0');
    expect(screen.queryByRole('progressbar', { name: 'Uploading done.bin' })).toBeNull();
    expect(screen.getByText('2 KB')).toBeInTheDocument();
  });

  it('omits remove buttons without onRemove and forwards ref', () => {
    const ref = { current: null as HTMLUListElement | null };
    render(<ComposerAttachments ref={ref} files={[{ id: 'a', name: 'a.md', size: 90 }]} />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(ref.current?.tagName).toBe('UL');
  });
});
