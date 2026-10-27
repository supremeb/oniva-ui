import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { ModelSelector } from './ModelSelector';

const models = [
  { id: 'nova-pro', name: 'Nova Pro', description: 'Fast and capable', speed: 4, quality: 4, cost: 3, latencyMs: 900, pricePerM: 15 },
  { id: 'atlas-2', name: 'Atlas 2', description: 'Most intelligent', speed: 2, quality: 5, cost: 5, latencyMs: 2100, pricePerM: 25 },
];

describe('ModelSelector', () => {
  it('shows the current model and picks another', async () => {
    const onChange = vi.fn();
    render(<ModelSelector models={models} value="nova-pro" onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Model: Nova Pro' }));
    fireEvent.click(await screen.findByRole('menuitemradio', { name: /Atlas 2/ }));
    expect(onChange).toHaveBeenCalledWith('atlas-2');
  });

  it('exposes strengths as text for screen readers', async () => {
    render(<ModelSelector models={models} value="nova-pro" />);
    fireEvent.click(screen.getByRole('button', { name: 'Model: Nova Pro' }));
    expect(await screen.findByText('Speed 4 of 5')).toBeInTheDocument();
  });

  it('toggles extended thinking, reveals effort and rolls latency', async () => {
    const onThinkingChange = vi.fn();
    const onEffortChange = vi.fn();
    render(<ModelSelector models={models} defaultValue="nova-pro" onThinkingChange={onThinkingChange} onEffortChange={onEffortChange} />);
    fireEvent.click(screen.getByRole('button', { name: 'Model: Nova Pro' }));
    expect(screen.queryByRole('menuitemcheckbox', { name: 'High effort' })).toBeNull();
    fireEvent.click(await screen.findByRole('menuitemcheckbox', { name: 'Extended thinking' }));
    expect(onThinkingChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('button', { name: 'Model: Nova Pro, extended thinking on', hidden: true })).toBeInTheDocument();
    fireEvent.click(await screen.findByRole('menuitemcheckbox', { name: 'High effort' }));
    expect(onEffortChange).toHaveBeenCalledWith('high');
    expect(screen.getAllByText('3.6').length).toBeGreaterThan(0);
  });

  it('forwards ref to the trigger', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<ModelSelector ref={ref} models={models} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
