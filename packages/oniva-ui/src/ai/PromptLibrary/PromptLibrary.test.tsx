import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PromptLibrary, fillTemplate, variablesOf } from './PromptLibrary';

const prompts = [
  { id: 'p1', name: 'Weekly status update', template: 'Write a status update for {{team}} covering {{period}}.', tags: ['reporting'] },
  { id: 'p2', name: 'Bug triage', template: 'Triage {{issue}}.', tags: ['eng'] },
];

describe('PromptLibrary', () => {
  it('extracts and fills variables', () => {
    expect(variablesOf(prompts[0]!.template)).toEqual(['team', 'period']);
    expect(fillTemplate('Hi {{a}} {{b}}', { a: 'x' })).toBe('Hi x {{b}}');
  });
  it('filters, fills and uses', () => {
    const onUse = vi.fn();
    render(<PromptLibrary prompts={prompts} onUse={onUse} />);
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search prompts' }), { target: { value: 'weekly' } });
    expect(screen.queryByText('Bug triage')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Weekly status update/ }));
    fireEvent.change(screen.getByLabelText('team'), { target: { value: 'Payments' } });
    fireEvent.click(screen.getByRole('button', { name: 'Use prompt' }));
    expect(onUse.mock.calls[0]![1]).toBe('Write a status update for Payments covering {{period}}.');
  });
});
