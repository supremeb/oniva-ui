import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TipsPanel, type Tip } from './TipsPanel';

const tips: Tip[] = [
  { id: 'search', title: 'Quick search', description: 'Jump anywhere.', action: 'Try it' },
  { id: 'plans', title: 'Ready for Pro?', action: 'See plans', primary: true, doneLabel: 'Viewed' },
];

describe('TipsPanel', () => {
  it('renders tips as list items with a counter', () => {
    render(<TipsPanel tips={tips} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('0/2 done')).toBeInTheDocument();
  });

  it('turns a taken tip into a status and calls onAction', () => {
    const onAction = vi.fn();
    render(<TipsPanel tips={[{ ...tips[1]!, onAction }]} />);
    fireEvent.click(screen.getByRole('button', { name: 'See plans' }));
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toHaveTextContent('Viewed');
    expect(screen.queryByRole('button', { name: 'See plans' })).toBeNull();
    expect(screen.getByText('1/1 done')).toBeInTheDocument();
  });

  it('shows Close only with onClose and is keyboard-reachable', () => {
    const onClose = vi.fn();
    const { rerender } = render(<TipsPanel tips={tips} />);
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
    rerender(<TipsPanel tips={tips} onClose={onClose} />);
    const close = screen.getByRole('button', { name: 'Close' });
    close.focus();
    expect(close).toHaveFocus();
    fireEvent.click(close);
    expect(onClose).toHaveBeenCalled();
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLElement>();
    render(<TipsPanel tips={tips} ref={ref} className="x" />);
    expect(ref.current).toHaveClass('x');
  });
});
