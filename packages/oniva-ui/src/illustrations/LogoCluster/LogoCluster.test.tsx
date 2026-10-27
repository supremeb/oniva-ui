import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { LogoCluster } from './LogoCluster';

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

describe("LogoCluster", () => {
  it('renders a labelled img', () => {
    const { container } = render(<LogoCluster />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('role', 'img');
    expect(root.getAttribute('aria-label')).toBeTruthy();
  });

  it('accepts a custom label and can be marked decorative', () => {
    const { container, rerender } = render(<LogoCluster label="Custom scene" />);
    expect(container.firstElementChild).toHaveAttribute('aria-label', 'Custom scene');
    rerender(<LogoCluster isDecorative />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstElementChild).not.toHaveAttribute('role');
  });

  it('forwards ref and className', () => {
    let el: HTMLDivElement | null = null;
    const { container } = render(
      <LogoCluster
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
    const { container } = render(<LogoCluster />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<LogoCluster />);
    await expectNoA11yViolations(container);
  });

  it('renders one bubble per logo', () => {
    const { container } = render(<LogoCluster logos={[{ name: 'A' }, { name: 'B' }, { name: 'C' }]} />);
    expect(container.textContent).toContain('A');
    expect(container.textContent).toContain('C');
    expect(container.firstElementChild?.getAttribute('aria-label')).toContain('A, B, C');
  });
});
