import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { VoiceOrbScene } from './VoiceOrbScene';

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

describe("VoiceOrbScene", () => {
  it('renders a labelled group', () => {
    const { container } = render(<VoiceOrbScene />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('role', 'group');
    expect(root.getAttribute('aria-label')).toBeTruthy();
  });

  it('accepts a custom label and can be marked decorative', () => {
    const { container, rerender } = render(<VoiceOrbScene label="Custom scene" />);
    expect(container.firstElementChild).toHaveAttribute('aria-label', 'Custom scene');
    rerender(<VoiceOrbScene isDecorative />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstElementChild).not.toHaveAttribute('role');
  });

  it('forwards ref and className', () => {
    let el: HTMLDivElement | null = null;
    const { container } = render(
      <VoiceOrbScene
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
    const { container } = render(<VoiceOrbScene />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<VoiceOrbScene />);
    await expectNoA11yViolations(container);
  });

  it('shows the caption for a controlled state', () => {
    render(<VoiceOrbScene state="thinking" />);
    expect(screen.getByText('Checking your calendar…')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /demo/ })).not.toBeInTheDocument();
  });

  it('pauses and resumes the demo', async () => {
    render(<VoiceOrbScene />);
    const pause = screen.getByRole('button', { name: 'Pause voice demo' });
    await userEvent.click(pause);
    expect(screen.getByRole('button', { name: 'Play voice demo' })).toBeInTheDocument();
    expect(screen.getByText('Say something to begin')).toBeInTheDocument();
  });
});
