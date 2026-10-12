import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AudioWaveform } from './AudioWaveform';

describe('AudioWaveform', () => {
  it('renders the requested number of bars and hides from AT', () => {
    const { container } = render(<AudioWaveform bars={10} active={false} />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root.children).toHaveLength(10);
  });
});
