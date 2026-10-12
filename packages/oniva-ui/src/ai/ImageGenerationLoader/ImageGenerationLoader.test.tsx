import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ImageGenerationLoader } from './ImageGenerationLoader';

describe('ImageGenerationLoader', () => {
  it('announces status, applies aspect ratio and shows the prompt', () => {
    render(<ImageGenerationLoader aspectRatio="16 / 9" prompt="Quarterly revenue chart, isometric" />);
    const el = screen.getByRole('status', { name: 'Generating image' });
    expect(el.style.aspectRatio).toBe('16 / 9');
    expect(screen.getByText('Quarterly revenue chart, isometric')).toBeInTheDocument();
  });
});
