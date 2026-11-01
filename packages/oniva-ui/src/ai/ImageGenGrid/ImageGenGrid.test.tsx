import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ImageGenGrid } from './ImageGenGrid';

const tiles = [
  { id: 'a', src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=', alt: 'Harbor at dawn', progress: 100 },
  { id: 'b', src: 'data:image/gif;base64,R0lGODlhAQABAAAAACw=', alt: 'Harbor at noon', progress: 40 },
];

describe('ImageGenGrid', () => {
  it('shows progress for pending tiles and fires actions on finished ones', () => {
    const onRegenerate = vi.fn();
    render(<ImageGenGrid tiles={tiles} onRegenerate={onRegenerate} />);
    expect(screen.getByRole('progressbar', { name: 'Generating Harbor at noon' })).toHaveAttribute('aria-valuenow', '40');
    fireEvent.click(screen.getByRole('button', { name: 'Regenerate Harbor at dawn' }));
    expect(onRegenerate).toHaveBeenCalledWith('a');
    expect(screen.queryByRole('button', { name: 'Regenerate Harbor at noon' })).toBeNull();
  });
});

describe('ImageGenGrid status and edges', () => {
  it('announces how many images are ready', () => {
    render(<ImageGenGrid tiles={tiles} />);
    expect(screen.getByRole('status')).toHaveTextContent('1 of 2 images ready');
  });

  it('renders no grid or status for an empty list, only the prompt', () => {
    render(<ImageGenGrid tiles={[]} prompt="Sunrise over a coastal city" />);
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.getByText('Sunrise over a coastal city')).toBeInTheDocument();
  });

  it('caps at four tiles and clamps progress', () => {
    const many = ['a', 'b', 'c', 'd', 'e'].map((id, i) => ({ id, src: tiles[0]!.src, alt: `Frame ${id}`, progress: i === 0 ? -10 : 100 }));
    render(<ImageGenGrid tiles={many} />);
    expect(screen.queryByRole('button', { name: 'Regenerate Frame e' })).toBeNull();
    expect(screen.getByRole('progressbar', { name: 'Generating Frame a' })).toHaveAttribute('aria-valuenow', '0');
  });
});
