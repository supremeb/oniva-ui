import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { EnrichmentOrbit } from './EnrichmentOrbit';

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

describe("EnrichmentOrbit", () => {
  it('renders a labelled img', () => {
    const { container } = render(<EnrichmentOrbit />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('role', 'img');
    expect(root.getAttribute('aria-label')).toBeTruthy();
  });

  it('accepts a custom label and can be marked decorative', () => {
    const { container, rerender } = render(<EnrichmentOrbit label="Custom scene" />);
    expect(container.firstElementChild).toHaveAttribute('aria-label', 'Custom scene');
    rerender(<EnrichmentOrbit isDecorative />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstElementChild).not.toHaveAttribute('role');
  });

  it('forwards ref and className', () => {
    let el: HTMLDivElement | null = null;
    const { container } = render(
      <EnrichmentOrbit
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
    const { container } = render(<EnrichmentOrbit />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<EnrichmentOrbit />);
    await expectNoA11yViolations(container);
  });

  it('names the centre and nodes in the label', () => {
    const { container } = render(<EnrichmentOrbit center={{ name: 'Enricher' }} nodes={[{ name: 'CRM' }, { name: 'Billing' }, { name: 'Support' }]} />);
    const l = container.firstElementChild?.getAttribute('aria-label');
    expect(l).toContain('Enricher');
    expect(l).toContain('Billing');
  });
});
