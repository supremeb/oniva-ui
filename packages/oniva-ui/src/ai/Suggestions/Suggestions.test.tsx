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
});
