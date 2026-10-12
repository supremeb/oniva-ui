import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ModelSelector } from './ModelSelector';

const models = [
  { id: 'sonnet-5', name: 'Sonnet 5', description: 'Fast and capable' },
  { id: 'opus-5', name: 'Opus 5', description: 'Most intelligent' },
];

describe('ModelSelector', () => {
  it('shows the current model and picks another', async () => {
    const onChange = vi.fn();
    render(<ModelSelector models={models} value="sonnet-5" onChange={onChange} />);
    const trigger = screen.getByRole('button', { name: 'Model: Sonnet 5' });
    fireEvent.click(trigger);
    const opt = await screen.findByRole('menuitemradio', { name: /Opus 5/ });
    fireEvent.click(opt);
    expect(onChange).toHaveBeenCalledWith('opus-5');
  });
});
