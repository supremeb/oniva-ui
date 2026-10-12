import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Text } from './Text';

describe('Text', () => {
  it('renders as the chosen element and forwards className/ref', () => {
    let el: HTMLElement | null = null;
    render(
      <Text as="p" className="c" ref={(n) => { el = n; }}>
        Net revenue
      </Text>,
    );
    expect(screen.getByText('Net revenue').tagName).toBe('P');
    expect(screen.getByText('Net revenue')).toHaveClass('c');
    expect(el).toBeInstanceOf(HTMLParagraphElement);
  });
  it('variants and tabular change classes', () => {
    const { rerender } = render(<Text data-testid="t">1</Text>);
    const a = screen.getByTestId('t').className;
    rerender(<Text data-testid="t" variant="display" tabular tone="muted">1</Text>);
    expect(screen.getByTestId('t').className).not.toBe(a);
  });
});
