import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Reasoning } from './Reasoning';

describe('Reasoning', () => {
  it('is open while streaming', () => {
    render(<Reasoning isStreaming>checking</Reasoning>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('shows the duration and toggles manually', () => {
    render(<Reasoning duration={12}>why</Reasoning>);
    const b = screen.getByRole('button', { name: /Thought for 12s/ });
    expect(b).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(b);
    expect(b).toHaveAttribute('aria-expanded', 'true');
  });
});
