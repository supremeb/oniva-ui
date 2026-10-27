import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { IntegrationBeam } from './IntegrationBeam';

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

describe("IntegrationBeam", () => {
  it('renders a labelled group', () => {
    const { container } = render(<IntegrationBeam />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('role', 'group');
    expect(root.getAttribute('aria-label')).toBeTruthy();
  });

  it('accepts a custom label and can be marked decorative', () => {
    const { container, rerender } = render(<IntegrationBeam label="Custom scene" />);
    expect(container.firstElementChild).toHaveAttribute('aria-label', 'Custom scene');
    rerender(<IntegrationBeam isDecorative />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstElementChild).not.toHaveAttribute('role');
  });

  it('forwards ref and className', () => {
    let el: HTMLDivElement | null = null;
    const { container } = render(
      <IntegrationBeam
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
    const { container } = render(<IntegrationBeam />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<IntegrationBeam />);
    await expectNoA11yViolations(container);
  });

  it('lets you pause a tool with a press', async () => {
    render(<IntegrationBeam />);
    const mail = screen.getByRole('button', { name: 'Mail: pause sync' });
    expect(mail).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(mail);
    expect(mail).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(mail);
    expect(mail).toHaveAttribute('aria-pressed', 'false');
  });

  it('toggles with the keyboard', async () => {
    render(<IntegrationBeam />);
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Mail: pause sync' })).toHaveFocus();
    await userEvent.keyboard(' ');
    expect(screen.getByRole('button', { name: 'Mail: pause sync' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows the connected count under reduced motion', () => {
    mockReducedMotion(true);
    const { container } = render(<IntegrationBeam />);
    expect(container).toHaveTextContent('6 connected');
  });

  it('announces pause and reconnect with the new count', async () => {
    const { container } = render(<IntegrationBeam />);
    await userEvent.click(screen.getByRole('button', { name: 'Mail: pause sync' }));
    expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent('Mail paused. 5 of 6 connected.');
    expect(container).toHaveTextContent('5 connected');
    await userEvent.click(screen.getByRole('button', { name: 'Mail: pause sync' }));
    expect(container.querySelector('[aria-live="polite"]')).toHaveTextContent('Mail connected. 6 of 6 connected.');
  });

  it('draws static beams without pulses under reduced motion', () => {
    mockReducedMotion(true);
    const { container } = render(<IntegrationBeam />);
    const pulses = [...container.querySelectorAll('svg g')].filter((g) => g.querySelector('path[filter]'));
    pulses.forEach((g) => expect((g as SVGGElement).style.opacity).not.toBe('1'));
  });
});
