import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ImageGenerationLoader } from './ImageGenerationLoader';

describe('ImageGenerationLoader', () => {
  it('announces status, applies aspect ratio and shows the prompt', () => {
    render(
      <ImageGenerationLoader aspectRatio="16 / 9" prompt="Quarterly revenue chart, isometric" />,
    );
    const el = screen.getByRole('status');
    expect(el.style.aspectRatio).toBe('16 / 9');
    expect(screen.getByText('Quarterly revenue chart, isometric')).toBeInTheDocument();
  });

  it('exposes an accessible status name and omits the prompt when none is given', () => {
    render(<ImageGenerationLoader />);
    expect(screen.getByRole('status')).toHaveTextContent('Generating image');
    expect(screen.getByRole('status').style.aspectRatio).toBe('1 / 1');
    expect(screen.queryByText('Isometric dashboard')).not.toBeInTheDocument();
  });

  it('keeps a long prompt in the DOM in full (clamped visually, not truncated in text)', () => {
    const long = 'x'.repeat(300);
    render(<ImageGenerationLoader prompt={long} />);
    expect(screen.getByText(long)).toBeInTheDocument();
  });
});
