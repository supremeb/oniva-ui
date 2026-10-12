import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Artifact } from './Artifact';

describe('Artifact', () => {
  it('renders title, version and fires actions', () => {
    const onClose = vi.fn();
    const onDownload = vi.fn();
    render(
      <Artifact open title="Retention memo" version="v2" onClose={onClose} onDownload={onDownload}>
        body
      </Artifact>,
    );
    expect(screen.getByRole('complementary', { name: 'Retention memo' })).toBeInTheDocument();
    expect(screen.getByText('v2')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Download artifact' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close artifact' }));
    expect(onDownload).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });
  it('renders nothing when closed', () => {
    render(<Artifact open={false} title="x" />);
    expect(screen.queryByRole('complementary')).toBeNull();
  });
});
