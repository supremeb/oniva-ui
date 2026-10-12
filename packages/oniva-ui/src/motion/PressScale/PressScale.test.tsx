import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PressScale } from './PressScale';

describe('PressScale', () => {
  it('sets data-pressed on pointer down and clears on up', () => {
    render(<PressScale className="c">x</PressScale>);
    const el = screen.getByText('x');
    expect(el).toHaveClass('c');
    fireEvent.pointerDown(el, { pointerType: 'mouse', button: 0 });
    expect(el).toHaveAttribute('data-pressed');
    fireEvent.pointerUp(el);
    expect(el).not.toHaveAttribute('data-pressed');
  });
  it('ignores keyboard and disabled', () => {
    render(<PressScale isDisabled>x</PressScale>);
    const el = screen.getByText('x');
    fireEvent.keyDown(el, { key: ' ' });
    fireEvent.pointerDown(el, { pointerType: 'touch' });
    expect(el).not.toHaveAttribute('data-pressed');
  });
});
