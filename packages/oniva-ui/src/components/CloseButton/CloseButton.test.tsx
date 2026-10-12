import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CloseButton } from './CloseButton';

describe('CloseButton', () => {
  it('is labelled "Close" and fires onPress', async () => {
    const onPress = vi.fn();
    render(<CloseButton onPress={onPress} className="c" />);
    const b = screen.getByRole('button', { name: 'Close' });
    await userEvent.click(b);
    expect(onPress).toHaveBeenCalled();
    expect(b).toHaveClass('c');
  });
  it('accepts a custom label and disabled', async () => {
    const onPress = vi.fn();
    render(<CloseButton aria-label="Dismiss banner" isDisabled onPress={onPress} />);
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss banner' }));
    expect(onPress).not.toHaveBeenCalled();
  });
});
