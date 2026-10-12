import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Settings } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('is an accessible button and fires onPress', async () => {
    const onPress = vi.fn();
    render(
      <IconButton aria-label="Settings" onPress={onPress} className="c">
        <Settings size={16} />
      </IconButton>,
    );
    const b = screen.getByRole('button', { name: 'Settings' });
    await userEvent.click(b);
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(b).toHaveClass('c');
  });
  it('size changes classes; disabled blocks press', async () => {
    const onPress = vi.fn();
    const { rerender } = render(<IconButton aria-label="A" size="sm" />);
    const a = screen.getByRole('button').className;
    rerender(<IconButton aria-label="A" size="lg" isDisabled onPress={onPress} />);
    expect(screen.getByRole('button').className).not.toBe(a);
    await userEvent.click(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
