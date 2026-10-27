import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { WorldMap } from './WorldMap';

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

describe("WorldMap", () => {
  it('renders a labelled group', () => {
    const { container } = render(<WorldMap />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('role', 'group');
    expect(root.getAttribute('aria-label')).toBeTruthy();
  });

  it('accepts a custom label and can be marked decorative', () => {
    const { container, rerender } = render(<WorldMap label="Custom scene" />);
    expect(container.firstElementChild).toHaveAttribute('aria-label', 'Custom scene');
    rerender(<WorldMap isDecorative />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstElementChild).not.toHaveAttribute('role');
  });

  it('forwards ref and className', () => {
    let el: HTMLDivElement | null = null;
    const { container } = render(
      <WorldMap
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
    const { container } = render(<WorldMap />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<WorldMap />);
    await expectNoA11yViolations(container);
  });

  it('labels the map after the highlighted continent', () => {
    const { container, rerender } = render(<WorldMap />);
    expect(container.firstElementChild).toHaveAttribute('aria-label', 'World map with Europe highlighted');
    rerender(<WorldMap continent="oceania" />);
    expect(container.firstElementChild).toHaveAttribute('aria-label', 'World map with Oceania highlighted');
  });

  it('switches continent from the menu', async () => {
    const onContinentChange = vi.fn();
    const { container } = render(<WorldMap onContinentChange={onContinentChange} />);
    await userEvent.click(screen.getByRole('button', { name: /Continent/ }));
    await userEvent.click(screen.getByRole('option', { name: 'Asia' }));
    expect(onContinentChange).toHaveBeenCalledWith('asia');
    expect(container.firstElementChild).toHaveAttribute('aria-label', 'World map with Asia highlighted');
  });

  it('switcher opens with ArrowDown, moves with keys, picks with Enter and closes with Escape', async () => {
    const onContinentChange = vi.fn();
    render(<WorldMap onContinentChange={onContinentChange} />);
    const trigger = screen.getByRole('button', { name: /Continent/ });
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(onContinentChange).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.keyboard('{ArrowDown}{Escape}');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });
});
