import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Flex } from './Flex';

describe('Flex', () => {
  it('renders children in the chosen element and forwards className', () => {
    render(
      <Flex as="ul" className="c" aria-label="list">
        <li>One</li>
      </Flex>,
    );
    const el = screen.getByRole('list');
    expect(el.tagName).toBe('UL');
    expect(el).toHaveClass('c');
  });
  it('maps gap/align/justify to different classes', () => {
    const { rerender } = render(<Flex data-testid="f">a</Flex>);
    const a = screen.getByTestId('f').className;
    rerender(
      <Flex data-testid="f" gap={24} align="center" justify="between" wrap direction="column">
        a
      </Flex>,
    );
    expect(screen.getByTestId('f').className).not.toBe(a);
  });
  it('forwards ref', () => {
    let el: HTMLElement | null = null;
    render(
      <Flex
        ref={(n) => {
          el = n;
        }}
      >
        x
      </Flex>,
    );
    expect(el).toBeInstanceOf(HTMLElement);
  });
});
