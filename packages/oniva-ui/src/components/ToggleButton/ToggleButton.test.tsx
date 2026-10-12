import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ToggleButton } from './ToggleButton';

describe('ToggleButton', () => {
  it('toggles aria-pressed and calls onChange', async () => {
    const onChange = vi.fn();
    render(<ToggleButton onChange={onChange}>Bold</ToggleButton>);
    const b = screen.getByRole('button', { name: 'Bold' });
    expect(b).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(b);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(b).toHaveAttribute('aria-pressed', 'true');
  });
  it('selected styling differs from unselected', () => {
    const { rerender } = render(<ToggleButton isSelected={false}>A</ToggleButton>);
    const a = screen.getByRole('button').className;
    rerender(<ToggleButton isSelected>A</ToggleButton>);
    expect(screen.getByRole('button').className).not.toBe(a);
  });
  it('disabled does not toggle', async () => {
    const onChange = vi.fn();
    render(
      <ToggleButton isDisabled onChange={onChange}>
        A
      </ToggleButton>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onChange).not.toHaveBeenCalled();
  });
});
