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

describe('AttachmentPreview details', () => {
  it('keeps the extension in its own span and exposes the full name as a title', () => {
    render(<AttachmentPreview attachments={[{ id: 'a', name: 'northwind-labs-quarterly-review.pdf', kind: 'pdf' }]} />);
    expect(screen.getByText('.pdf')).toBeInTheDocument();
    expect(screen.getByTitle('northwind-labs-quarterly-review.pdf')).toBeInTheDocument();
  });

  it('does not split names without a short extension', () => {
    render(<AttachmentPreview attachments={[{ id: 'a', name: 'Makefile', kind: 'code' }]} />);
    expect(screen.getByText('Makefile')).toBeInTheDocument();
  });

  it('falls back to the icon when the thumbnail fails to load', () => {
    const { container } = render(
      <AttachmentPreview attachments={[{ id: 'i', name: 'a.png', kind: 'image', previewUrl: 'data:image/png;base64,AAAA' }]} />,
    );
    const img = container.querySelector('img') as HTMLImageElement;
    expect(img).toBeTruthy();
    fireEvent.error(img);
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders list items without inline display styles and without remove buttons when read-only', () => {
    render(<AttachmentPreview attachments={[{ id: 'a', name: 'a.pdf', kind: 'pdf' }]} />);
    expect(screen.getByRole('list', { name: 'Attachments' })).toBeInTheDocument();
    expect(screen.getByRole('listitem')).not.toHaveAttribute('style');
    expect(screen.queryByRole('button')).toBeNull();
  });
});
