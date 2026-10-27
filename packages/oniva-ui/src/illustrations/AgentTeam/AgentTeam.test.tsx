import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { AgentTeam } from './AgentTeam';

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

describe("AgentTeam", () => {
  it('renders a labelled img', () => {
    const { container } = render(<AgentTeam />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('role', 'img');
    expect(root.getAttribute('aria-label')).toBeTruthy();
  });

  it('accepts a custom label and can be marked decorative', () => {
    const { container, rerender } = render(<AgentTeam label="Custom scene" />);
    expect(container.firstElementChild).toHaveAttribute('aria-label', 'Custom scene');
    rerender(<AgentTeam isDecorative />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstElementChild).not.toHaveAttribute('role');
  });

  it('forwards ref and className', () => {
    let el: HTMLDivElement | null = null;
    const { container } = render(
      <AgentTeam
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
    const { container } = render(<AgentTeam />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<AgentTeam />);
    await expectNoA11yViolations(container);
  });

  it('shows the finished team under reduced motion', () => {
    mockReducedMotion(true);
    const { container } = render(<AgentTeam prompt="Build a team" />);
    expect(container).toHaveTextContent('Build a team');
    expect(container).toHaveTextContent('Researcher');
    expect(container).toHaveTextContent('Outreach');
  });

  it('names the prompt and roles in the default label', () => {
    const { container } = render(<AgentTeam prompt="Find leads" />);
    expect(container.firstElementChild?.getAttribute('aria-label')).toContain('Find leads');
    expect(container.firstElementChild?.getAttribute('aria-label')).toContain('Researcher');
  });
});
