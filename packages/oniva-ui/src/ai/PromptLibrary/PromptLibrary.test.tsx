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

describe('PromptLibrary (state pass)', () => {
  const sp = [{ id: 'p1', name: 'Release notes', tags: ['product'], template: 'Write release notes for {product} v{version}.' }];
  it('says there are no saved prompts instead of a failed search when empty', () => {
    const { unmount } = render(<PromptLibrary prompts={[]} />);
    expect(screen.getByText('No saved prompts yet.')).toBeInTheDocument();
    unmount();
    render(<PromptLibrary variant="split" prompts={[]} />);
    expect(screen.getByText('No saved prompts yet.')).toBeInTheDocument();
  });
  it('keeps the search message when a query matches nothing', () => {
    render(<PromptLibrary prompts={sp} />);
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search prompts' }), { target: { value: 'zzz' } });
    expect(screen.getByText('No prompts match “zzz”.')).toBeInTheDocument();
  });
  it('split view: requireAll keeps Use aria-disabled and announces what is missing', () => {
    const onUse = vi.fn();
    render(<PromptLibrary variant="split" requireAll prompts={sp} onUse={onUse} />);
    const use = screen.getByRole('button', { name: 'Use prompt' });
    expect(use).toHaveAttribute('aria-disabled', 'true');
    fireEvent.click(use);
    expect(onUse).not.toHaveBeenCalled();
    expect(screen.getByRole('status')).toHaveTextContent('2 variables still missing');
    fireEvent.change(screen.getByLabelText('product'), { target: { value: 'Ledger' } });
    fireEvent.change(screen.getByLabelText('version'), { target: { value: '2.4' } });
    expect(screen.getByRole('button', { name: 'Use prompt' })).not.toHaveAttribute('aria-disabled');
    fireEvent.click(screen.getByRole('button', { name: 'Use prompt' }));
    expect(onUse.mock.calls[0]![1]).toBe('Write release notes for Ledger v2.4.');
  });
});
