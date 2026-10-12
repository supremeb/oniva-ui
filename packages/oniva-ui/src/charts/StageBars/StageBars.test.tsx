import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StageBars } from './StageBars';

const stages = [
  { id: 'a', label: 'Awake' },
  { id: 'd', label: 'Deep' },
];
const segments = [
  { stage: 'a', start: 0, end: 10 },
  { stage: 'd', start: 10, end: 70 },
];

describe('StageBars', () => {
  it('summarises durations per stage', () => {
    render(<StageBars stages={stages} segments={segments} />);
    expect(screen.getByRole('group')).toHaveAttribute(
      'aria-label',
      expect.stringContaining('Deep 1h 0m'),
    );
  });
  it('shows clock times in the tooltip', () => {
    render(<StageBars stages={stages} segments={segments} startClock={{ hour: 23, minute: 0 }} />);
    fireEvent.focus(screen.getByLabelText('Deep: 1h 0m'));
    expect(screen.getByRole('tooltip')).toHaveTextContent('11:10 PM');
  });
});
