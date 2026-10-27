import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { RegionMap } from './RegionMap';

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

describe("RegionMap", () => {
  it('renders a labelled group', () => {
    const { container } = render(<RegionMap />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('role', 'group');
    expect(root.getAttribute('aria-label')).toBeTruthy();
  });

  it('accepts a custom label and can be marked decorative', () => {
    const { container, rerender } = render(<RegionMap label="Custom scene" />);
    expect(container.firstElementChild).toHaveAttribute('aria-label', 'Custom scene');
    rerender(<RegionMap isDecorative />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstElementChild).not.toHaveAttribute('role');
  });

  it('forwards ref and className', () => {
    let el: HTMLDivElement | null = null;
    const { container } = render(
      <RegionMap
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
    const { container } = render(<RegionMap />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<RegionMap />);
    await expectNoA11yViolations(container);
  });

  it('labels the map after the current region', () => {
    const { container, rerender } = render(<RegionMap />);
    expect(container.firstElementChild).toHaveAttribute('aria-label', expect.stringContaining('DACH'));
    rerender(<RegionMap region="us" />);
    expect(container.firstElementChild).toHaveAttribute('aria-label', 'Map of the United States');
  });

  it('switches region from the menu', async () => {
    const onRegionChange = vi.fn();
    const { container } = render(<RegionMap onRegionChange={onRegionChange} />);
    await userEvent.click(screen.getByRole('button', { name: /Region/ }));
    await userEvent.click(screen.getByRole('option', { name: 'United States' }));
    expect(onRegionChange).toHaveBeenCalledWith('us');
    expect(container.firstElementChild).toHaveAttribute('aria-label', 'Map of the United States');
  });

  it('can hide the menu', () => {
    render(<RegionMap showSwitcher={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
