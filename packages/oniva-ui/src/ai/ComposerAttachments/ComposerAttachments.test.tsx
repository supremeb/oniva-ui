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
    expect(screen.getByRole('progressbar', { name: 'Uploading board-deck.pdf' })).toBeInTheDocument();
    expect(screen.getByText('42%')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Remove q3_revenue.csv' }));
    expect(onRemove).toHaveBeenCalledWith('a');
  });

  it('flags failed uploads', () => {
    render(<ComposerAttachments files={[{ id: 'c', name: 'bad.zip', status: 'error' }]} />);
    expect(screen.getByText('Upload failed')).toBeInTheDocument();
  });
});
