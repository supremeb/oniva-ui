import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Slider } from './Slider';

describe('Slider', () => {
  it('exposes a labelled slider and changes with the keyboard', async () => {
    const onChange = vi.fn();
    render(<Slider label="Credit limit" defaultValue={50} minValue={0} maxValue={100} onChange={onChange} />);
    const thumb = screen.getByRole('slider');
    expect(thumb).toHaveValue('50');
    thumb.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith(51);
  });

  it('renders two thumbs for a range', () => {
    render(<Slider label="Amount" defaultValue={[20, 80]} />);
    const thumbs = screen.getAllByRole('slider');
    expect(thumbs).toHaveLength(2);
    expect(thumbs[0]).toHaveValue('20');
    expect(thumbs[1]).toHaveValue('80');
  });

  it('supports disabled', () => {
    render(<Slider label="X" defaultValue={10} isDisabled />);
    expect(screen.getByRole('slider')).toBeDisabled();
  });
});
