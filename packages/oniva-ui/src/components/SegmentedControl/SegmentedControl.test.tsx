import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SegmentedControl, SegmentedControlItem } from './SegmentedControl';

describe('SegmentedControl', () => {
  it('selects segments and reports value', async () => {
    const onChange = vi.fn();
    render(
      <SegmentedControl aria-label="Range" defaultValue="30d" onChange={onChange}>
        <SegmentedControlItem value="7d">7 days</SegmentedControlItem>
        <SegmentedControlItem value="30d">30 days</SegmentedControlItem>
        <SegmentedControlItem value="90d">90 days</SegmentedControlItem>
      </SegmentedControl>,
    );
    expect(screen.getByRole('radiogroup', { name: 'Range' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '30 days' })).toBeChecked();
    await userEvent.click(screen.getByRole('radio', { name: '90 days' }));
    expect(onChange).toHaveBeenCalledWith('90d');
  });

  it('moves with arrow keys and supports disabled item', async () => {
    render(
      <SegmentedControl aria-label="View" defaultValue="a">
        <SegmentedControlItem value="a">A</SegmentedControlItem>
        <SegmentedControlItem value="b" isDisabled>B</SegmentedControlItem>
        <SegmentedControlItem value="c">C</SegmentedControlItem>
      </SegmentedControl>,
    );
    screen.getByRole('radio', { name: 'A' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'C' })).toBeChecked();
  });
});
