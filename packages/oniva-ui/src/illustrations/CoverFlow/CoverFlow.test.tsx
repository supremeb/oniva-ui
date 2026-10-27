import { render, screen, fireEvent, act } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { CoverFlow } from './CoverFlow';

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

describe("CoverFlow", () => {
  it('renders a labelled group', () => {
    const { container } = render(<CoverFlow />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('role', 'group');
    expect(root.getAttribute('aria-label')).toBeTruthy();
  });

  it('accepts a custom label and can be marked decorative', () => {
    const { container, rerender } = render(<CoverFlow label="Custom scene" />);
    expect(container.firstElementChild).toHaveAttribute('aria-label', 'Custom scene');
    rerender(<CoverFlow isDecorative />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstElementChild).not.toHaveAttribute('role');
  });

  it('forwards ref and className', () => {
    let el: HTMLDivElement | null = null;
    const { container } = render(
      <CoverFlow
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
    const { container } = render(<CoverFlow />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<CoverFlow />);
    await expectNoA11yViolations(container);
  });

  it('moves with the arrow keys and reports the new index', () => {
    mockReducedMotion(true);
    const onIndexChange = vi.fn();
    const { container } = render(<CoverFlow defaultIndex={0} onIndexChange={onIndexChange} />);
    expect(container).toHaveTextContent('Northern Lights');
    const root = container.firstElementChild as HTMLElement;
    act(() => {
      fireEvent.keyDown(root, { key: 'ArrowRight' });
    });
    expect(onIndexChange).toHaveBeenLastCalledWith(1);
    expect(screen.getByRole('button', { name: 'Previous cover' })).toBeEnabled();
    expect(container).toHaveTextContent('Paper Cities');
  });

  it('jumps with the buttons and ticks and selects with Enter', () => {
    mockReducedMotion(true);
    const onSelect = vi.fn();
    const { container } = render(<CoverFlow defaultIndex={0} onSelect={onSelect} />);
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Next cover' }));
    });
    expect(container).toHaveTextContent('Paper Cities');
    act(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Go to Low Tide' }));
    });
    expect(container).toHaveTextContent('Low Tide');
    expect(screen.getByRole('button', { name: 'Next cover' })).toBeDisabled();
    act(() => {
      fireEvent.keyDown(container.firstElementChild as HTMLElement, { key: 'Enter' });
    });
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ title: 'Low Tide' }), 6);
  });

  it('follows a controlled index', () => {
    mockReducedMotion(true);
    const { container, rerender } = render(<CoverFlow index={2} />);
    expect(container).toHaveTextContent('Slow Orbit');
    rerender(<CoverFlow index={4} />);
    expect(container).toHaveTextContent('Afterglow');
  });
});
