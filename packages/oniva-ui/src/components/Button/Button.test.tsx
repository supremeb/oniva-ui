import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children and fires onPress', async () => {
    const onPress = vi.fn();
    render(<Button onPress={onPress}>Save</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Save' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not fire when disabled', async () => {
    const onPress = vi.fn();
    render(
      <Button isDisabled onPress={onPress}>
        Save
      </Button>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('blocks presses while loading and exposes pending state', async () => {
    const onPress = vi.fn();
    render(
      <Button isLoading onPress={onPress}>
        Save
      </Button>,
    );
    const btn = screen.getByRole('button');
    await userEvent.click(btn);
    expect(onPress).not.toHaveBeenCalled();
    expect(btn).toHaveAttribute('aria-disabled', 'true');
  });

  it('supports icon-only with aria-label and forwards ref + className', () => {
    let el: HTMLButtonElement | null = null;
    render(
      <Button
        isIconOnly
        aria-label="Add"
        className="custom"
        ref={(n) => {
          el = n;
        }}
      >
        +
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Add' })).toHaveClass('custom');
    expect(el).toBeInstanceOf(HTMLButtonElement);
  });

  it('applies variant/size/xstyle class names', () => {
    const { rerender } = render(<Button variant="secondary">A</Button>);
    const a = screen.getByRole('button').className;
    rerender(
      <Button variant="danger" size="lg">
        A
      </Button>,
    );
    expect(screen.getByRole('button').className).not.toBe(a);
  });
});
