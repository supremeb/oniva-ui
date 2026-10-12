import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ModelCompare } from './ModelCompare';

const responses = [
  { id: 'a', model: 'Claude Sonnet 4.5', text: 'Answer A', latencyMs: 2100, cost: 0.012 },
  { id: 'b', model: 'GPT-5', text: 'Answer B', latencyMs: 3400, cost: 0.031 },
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
});
