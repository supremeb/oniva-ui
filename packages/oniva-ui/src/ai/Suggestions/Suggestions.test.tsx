import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Suggestions } from './Suggestions';

describe('Suggestions', () => {
  it('selects a suggestion', () => {
    const onSelect = vi.fn();
    render(<Suggestions suggestions={['Summarize', 'Explain']} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: 'Explain' }));
    expect(onSelect).toHaveBeenCalledWith('Explain');
  });

  it('names the group, with a default and an override', () => {
    const { rerender } = render(<Suggestions suggestions={['Summarize']} />);
    expect(screen.getByRole('group', { name: 'Suggestions' })).toBeTruthy();
    rerender(<Suggestions aria-label="Suggested prompts" suggestions={['Summarize']} />);
    expect(screen.getByRole('group', { name: 'Suggested prompts' })).toBeTruthy();
  });

  it('renders no chips for an empty list', () => {
    render(<Suggestions suggestions={[]} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('tolerates duplicate suggestions without key warnings', () => {
    const err = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<Suggestions suggestions={['Explain', 'Explain']} />);
    expect(screen.getAllByRole('button')).toHaveLength(2);
    expect(err).not.toHaveBeenCalled();
    err.mockRestore();
  });

  it('keeps the full text as the chip name and title when the label truncates', () => {
    const long = 'Review packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff.worker.ts';
    render(<Suggestions suggestions={[long]} />);
    const chip = screen.getByRole('button', { name: long });
    expect(chip.getAttribute('title')).toBe(long);
  });
});
