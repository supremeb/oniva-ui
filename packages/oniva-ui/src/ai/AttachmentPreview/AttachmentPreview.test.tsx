import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AttachmentPreview } from './AttachmentPreview';

describe('AttachmentPreview', () => {
  it('lists files and removes on click', async () => {
    const onRemove = vi.fn();
    render(<AttachmentPreview onRemove={onRemove} attachments={[{ id: 'a', name: 'Q3-board-deck.pdf', kind: 'pdf', size: '2.4 MB' }]} />);
    expect(screen.getByText('2.4 MB')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Remove Q3-board-deck.pdf' }));
    await waitFor(() => expect(onRemove).toHaveBeenCalledWith('a'));
  });
});
