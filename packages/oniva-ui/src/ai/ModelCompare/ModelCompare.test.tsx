import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ModelCompare } from './ModelCompare';

const responses = [
  { id: 'a', model: 'Atlas 2', text: 'Answer A', latencyMs: 2100, cost: 0.012 },
  { id: 'b', model: 'Nova Pro', text: 'Answer B', latencyMs: 3400, cost: 0.031 },
];

describe('ModelCompare', () => {
  it('flags fastest and cheapest and selects', () => {
    const onSelect = vi.fn();
    render(<ModelCompare responses={responses} onSelect={onSelect} />);
    expect(screen.getByText('2.1s · fastest')).toBeInTheDocument();
    expect(screen.getByText('$0.012 · cheapest')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: 'Use this one' })[1]!);
    expect(onSelect).toHaveBeenCalledWith('b');
  });

  it('does not flag fastest or cheapest for a single response or when values tie', () => {
    const { rerender } = render(<ModelCompare responses={[responses[0]!]} />);
    expect(screen.queryByText(/fastest|cheapest/)).not.toBeInTheDocument();
    rerender(<ModelCompare responses={[responses[0]!, { ...responses[1]!, latencyMs: 2100, cost: 0.012 }]} />);
    expect(screen.queryByText(/fastest|cheapest/)).not.toBeInTheDocument();
  });

  it('shows an empty message when there are no responses', () => {
    render(<ModelCompare prompt="Hi" responses={[]} />);
    expect(screen.getByText('No responses to compare yet.')).toBeInTheDocument();
  });

  it('keeps precision for sub-cent costs and shows a placeholder for empty output', () => {
    render(<ModelCompare responses={[{ ...responses[0]!, cost: 0.0004, text: '' }, responses[1]!]} />);
    expect(screen.getByText('$0.0004 · cheapest')).toBeInTheDocument();
    expect(screen.getByText('No output returned.')).toBeInTheDocument();
  });

  it('announces the selected response', () => {
    render(<ModelCompare responses={responses} selectedId="b" />);
    expect(screen.getByRole('status')).toHaveTextContent('Nova Pro selected');
    expect(screen.getByRole('button', { name: 'Chosen' })).toBeInTheDocument();
  });
});
