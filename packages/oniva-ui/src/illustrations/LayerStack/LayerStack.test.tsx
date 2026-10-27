import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { LayerStack } from './LayerStack';

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

describe("LayerStack", () => {
  it('renders a labelled group', () => {
    const { container } = render(<LayerStack />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('role', 'group');
    expect(root.getAttribute('aria-label')).toBeTruthy();
  });

  it('accepts a custom label and can be marked decorative', () => {
    const { container, rerender } = render(<LayerStack label="Custom scene" />);
    expect(container.firstElementChild).toHaveAttribute('aria-label', 'Custom scene');
    rerender(<LayerStack isDecorative />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstElementChild).not.toHaveAttribute('role');
  });

  it('forwards ref and className', () => {
    let el: HTMLDivElement | null = null;
    const { container } = render(
      <LayerStack
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
    const { container } = render(<LayerStack />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<LayerStack />);
    await expectNoA11yViolations(container);
  });

  it('selects an entry on click and reports it', async () => {
    const onChange = vi.fn();
    render(<LayerStack interval={0} onChange={onChange} />);
    const data = screen.getByRole('option', { name: /Data/ });
    await userEvent.click(data);
    expect(onChange).toHaveBeenCalledWith(3);
    expect(data).toHaveAttribute('aria-selected', 'true');
  });

  it('moves selection with the arrow keys', async () => {
    const onChange = vi.fn();
    render(<LayerStack interval={0} onChange={onChange} />);
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}');
    expect(onChange).toHaveBeenLastCalledWith(1);
    expect(screen.getByRole('option', { name: /Automations/ })).toHaveAttribute('aria-selected', 'true');
  });

  it('follows a controlled index', () => {
    render(<LayerStack index={2} interval={0} />);
    expect(screen.getByRole('option', { name: /Integrations/ })).toHaveAttribute('aria-selected', 'true');
  });
});
