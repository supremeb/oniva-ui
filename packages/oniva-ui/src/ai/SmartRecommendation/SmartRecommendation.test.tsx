import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SmartRecommendation, type Recommendation } from './SmartRecommendation';

const options: Recommendation[] = [
  { id: 'incremental', label: 'Incremental sync', reason: 'Only 4% of rows changed since Friday.', signal: 3 },
  { id: 'full', label: 'Full refresh', reason: 'Rebuilds every table from scratch.', signal: 1 },
];

describe('SmartRecommendation', () => {
  it('shows the reason and the signal in words', () => {
    render(<SmartRecommendation options={options} />);
    expect(screen.getByText('Only 4% of rows changed since Friday.')).toBeInTheDocument();
    expect(screen.getByText('Strong signal')).toBeInTheDocument();
  });

  it('folds with the header button (aria-expanded)', () => {
    render(<SmartRecommendation options={options} />);
    const head = screen.getByRole('button', { name: /Smart recommendation/ });
    expect(head).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(head);
    expect(head).toHaveAttribute('aria-expanded', 'false');
  });

  it('accepts and undoes', () => {
    const onAccept = vi.fn();
    const onUndo = vi.fn();
    render(<SmartRecommendation options={options} onAccept={onAccept} onUndo={onUndo} />);
    fireEvent.click(screen.getByRole('button', { name: 'Accept incremental sync' }));
    expect(onAccept).toHaveBeenCalledWith(options[0]);
    expect(screen.getByRole('status')).toHaveTextContent('Incremental sync accepted');
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onUndo).toHaveBeenCalledWith(options[0]);
    expect(screen.getByRole('button', { name: 'Accept incremental sync' })).toBeInTheDocument();
  });

  it('switches to an alternative from the menu', async () => {
    render(<SmartRecommendation options={options} />);
    fireEvent.click(screen.getByRole('button', { name: /Alternatives/ }));
    const item = await screen.findByRole('menuitemradio', { name: 'Full refresh' });
    fireEvent.click(item);
    expect(await screen.findByText('Rebuilds every table from scratch.')).toBeInTheDocument();
    expect(screen.getByText('Alternative')).toBeInTheDocument();
    expect(screen.getByText('Weak signal')).toBeInTheDocument();
  });

  it('renders nothing without options and forwards ref/className', () => {
    const { container } = render(<SmartRecommendation options={[]} />);
    expect(container).toBeEmptyDOMElement();
    const ref = createRef<HTMLElement>();
    render(<SmartRecommendation options={options} ref={ref} className="x" />);
    expect(ref.current).toHaveClass('x');
  });
});
