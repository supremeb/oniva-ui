import { render, fireEvent, act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { ModelWheel } from './ModelWheel';

function mockReducedMotion(matches: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches: matches && query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList,
  );
}

afterEach(() => vi.restoreAllMocks());

describe("ModelWheel", () => {
  it('renders a labelled group', () => {
    const { container } = render(<ModelWheel />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('role', 'group');
    expect(root.getAttribute('aria-label')).toBeTruthy();
  });

  it('accepts a custom label and can be marked decorative', () => {
    const { container, rerender } = render(<ModelWheel label="Custom scene" />);
    expect(container.firstElementChild).toHaveAttribute('aria-label', 'Custom scene');
    rerender(<ModelWheel isDecorative />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstElementChild).not.toHaveAttribute('role');
  });

  it('forwards ref and className', () => {
    let el: HTMLDivElement | null = null;
    const { container } = render(
      <ModelWheel
        className="custom"
        ref={(n) => {
          el = n;
        }}
      />,
    );
    expect(el).toBe(container.firstElementChild);
    expect(container.firstElementChild).toHaveClass('custom');
  });

  it('renders under reduced motion', () => {
    mockReducedMotion(true);
    const { container } = render(<ModelWheel />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<ModelWheel />);
    await expectNoA11yViolations(container);
  });

  it('spins with the arrow keys under reduced motion', () => {
    mockReducedMotion(true);
    const { container } = render(<ModelWheel />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('tabindex', '0');
    const live = container.querySelector('[aria-live="polite"]') as HTMLElement;
    expect(live).toHaveTextContent('Atlas 2');
    act(() => {
      fireEvent.keyDown(root, { key: 'ArrowDown' });
    });
    expect(live).toHaveTextContent('Atlas 2 Mini');
    act(() => {
      fireEvent.keyDown(root, { key: 'ArrowUp' });
    });
    expect(live).toHaveTextContent('Atlas 2');
  });

  it('uses only fictional model names by default', () => {
    const { container } = render(<ModelWheel />);
    expect(container.textContent).not.toMatch(/gpt|claude|gemini|llama|grok/i);
  });
});
