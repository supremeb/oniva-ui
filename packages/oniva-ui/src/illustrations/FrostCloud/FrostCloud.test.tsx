import { render, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { FrostCloud } from './FrostCloud';

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

describe("FrostCloud", () => {
  it('renders a labelled img', () => {
    const { container } = render(<FrostCloud />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('role', 'img');
    expect(root.getAttribute('aria-label')).toBeTruthy();
  });

  it('accepts a custom label and can be marked decorative', () => {
    const { container, rerender } = render(<FrostCloud label="Custom scene" />);
    expect(container.firstElementChild).toHaveAttribute('aria-label', 'Custom scene');
    rerender(<FrostCloud isDecorative />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstElementChild).not.toHaveAttribute('role');
  });

  it('forwards ref and className', () => {
    let el: HTMLDivElement | null = null;
    const { container } = render(
      <FrostCloud
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
    const { container } = render(<FrostCloud />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<FrostCloud />);
    await expectNoA11yViolations(container);
  });

  it('reacts to clicks and pointer moves without throwing', () => {
    mockReducedMotion(true);
    const { container } = render(<FrostCloud color="blue" />);
    const stage = container.querySelector('[data-cloud="frost"]') as HTMLElement;
    fireEvent.pointerMove(stage, { clientX: 10, clientY: 10, pointerType: 'mouse' });
    fireEvent.click(stage);
    expect(stage).toBeInTheDocument();
  });

  it('can render without the sky', () => {
    const { container } = render(<FrostCloud background={false} />);
    expect(container.querySelectorAll('svg').length).toBe(1);
  });
});
