import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { GlowKeyboard } from './GlowKeyboard';

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

describe("GlowKeyboard", () => {
  it('renders a labelled group', () => {
    const { container } = render(<GlowKeyboard />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('role', 'group');
    expect(root.getAttribute('aria-label')).toBeTruthy();
  });

  it('accepts a custom label and can be marked decorative', () => {
    const { container, rerender } = render(<GlowKeyboard label="Custom scene" />);
    expect(container.firstElementChild).toHaveAttribute('aria-label', 'Custom scene');
    rerender(<GlowKeyboard isDecorative />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(container.firstElementChild).not.toHaveAttribute('role');
  });

  it('forwards ref and className', () => {
    let el: HTMLDivElement | null = null;
    const { container } = render(
      <GlowKeyboard
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
    const { container } = render(<GlowKeyboard />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it('has no axe violations', async () => {
    const { container } = render(<GlowKeyboard />);
    await expectNoA11yViolations(container);
  });

  it('accepts typing and submits with Enter', async () => {
    mockReducedMotion(true);
    const onSubmit = vi.fn();
    render(<GlowKeyboard onSubmit={onSubmit} />);
    const input = screen.getByRole('textbox', { name: 'Chat message' });
    await userEvent.type(input, 'hello{Enter}');
    expect(onSubmit).toHaveBeenCalledWith('hello');
    expect(input).toHaveValue('');
  });

  it('does not type by itself under reduced motion', () => {
    mockReducedMotion(true);
    render(<GlowKeyboard />);
    expect(screen.getByRole('textbox', { name: 'Chat message' })).toHaveValue('');
  });

  it('focuses the input when the scene is pressed anywhere', async () => {
    const { container } = render(<GlowKeyboard prompts={[]} />);
    const input = screen.getByLabelText('Chat message');
    await userEvent.pointer({ keys: '[MouseLeft]', target: container.querySelector('[aria-hidden="true"]') as Element });
    expect(input).toHaveFocus();
  });
});
