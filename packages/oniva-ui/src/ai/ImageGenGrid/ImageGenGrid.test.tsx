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
