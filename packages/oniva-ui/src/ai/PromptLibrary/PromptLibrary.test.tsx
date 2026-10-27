import { createRef } from 'react';
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

describe('PromptLibrary (loop 7)', () => {
  const sp = [{ id: 'p1', name: 'Release notes', template: 'Write release notes for {product} v{version}.', variables: { product: { default: 'Ledger' } } }];
  it('supports single-brace variables, defaults and requireAll', () => {
    expect(variablesOf('Hi {a} and {{b}}')).toEqual(['a', 'b']);
    const onUse = vi.fn();
    render(<PromptLibrary prompts={sp} requireAll onUse={onUse} />);
    fireEvent.click(screen.getByRole('button', { name: /Release notes/ }));
    expect(screen.getByLabelText('product')).toHaveValue('Ledger');
    fireEvent.click(screen.getByRole('button', { name: 'Use prompt' }));
    expect(onUse).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText('version'), { target: { value: '2.4' } });
    fireEvent.click(screen.getByRole('button', { name: 'Use prompt' }));
    expect(onUse.mock.calls[0]![1]).toBe('Write release notes for Ledger v2.4.');
  });
  it('copies the filled prompt and moves focus into the list with ArrowDown', () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const onCopy = vi.fn();
    render(<PromptLibrary prompts={sp} onCopy={onCopy} />);
    fireEvent.keyDown(screen.getByRole('searchbox', { name: 'Search prompts' }), { key: 'ArrowDown' });
    expect(screen.getByRole('button', { name: /Release notes/ })).toHaveFocus();
    fireEvent.click(screen.getByRole('button', { name: /Release notes/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(onCopy).toHaveBeenCalledWith('Write release notes for Ledger v{version}.');
  });
  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<PromptLibrary ref={ref} className="extra" prompts={sp} />);
    expect(ref.current).toHaveClass('extra');
  });
});
