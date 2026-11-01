import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
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

  it('renders no body bar when there is no reasoning text', () => {
    const { container } = render(<Reasoning isStreaming>{null}</Reasoning>);
    expect(container.querySelector('[role="region"]')?.textContent).toBe('');
    expect(container.querySelector('[role="region"] > div > div')).toBeNull();
  });

  it('labels the region by its trigger and announces when thinking finishes', () => {
    const { rerender } = render(
      <Reasoning isStreaming duration={9}>
        why
      </Reasoning>,
    );
    const region = screen.getByRole('region', { hidden: true });
    expect(region).toHaveAttribute('aria-labelledby', screen.getByRole('button').id);
    expect(screen.getByRole('status')).toHaveTextContent('');
    act(() => {
      rerender(<Reasoning duration={9}>why</Reasoning>);
    });
    expect(screen.getByRole('status')).toHaveTextContent('Thought for 9s');
  });
});
