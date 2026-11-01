import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TextShimmer } from './TextShimmer';

describe('TextShimmer', () => {
  it('renders text and forwards className/ref', () => {
    let el: HTMLSpanElement | null = null;
    render(
      <TextShimmer className="x" ref={(n) => void (el = n)}>
        Thinking…
      </TextShimmer>,
    );
    expect(screen.getByText('Thinking…')).toHaveClass('x');
    expect(el).toBe(screen.getByText('Thinking…'));
  });
});

describe('TextShimmer layout', () => {
  it('is an inline box so tight line-heights do not clip the clipped-to-text gradient', () => {
    render(<TextShimmer>Drafting the reply…</TextShimmer>);
    expect(getComputedStyle(screen.getByText('Drafting the reply…')).display).toBe('inline');
  });
});
