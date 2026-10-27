import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { allocateCells, ContextWindow, type ContextPart } from './ContextWindow';

const parts: ContextPart[] = [
  { id: 'system', label: 'System prompt', tokens: 4200, locked: true },
  { id: 'files', label: 'Files', items: [{ id: 'schema', label: 'schema.prisma', tokens: 9400 }, { id: 'billing', label: 'billing.ts', tokens: 21300 }] },
  { id: 'chat', label: 'Conversation', tokens: 108600, compact: true },
];

describe('allocateCells', () => {
  it('gives every part at least one cell and never exceeds the field', () => {
    const a = allocateCells([1, 50_000, 200_000], 200_000, 100);
    expect(a[0]).toBe(1);
    expect(a.reduce((n, c) => n + c, 0)).toBeLessThanOrEqual(100);
  });
});

describe('ContextWindow', () => {
  it('is a labelled group with the used-of-limit sentence', async () => {
    const { container } = render(<ContextWindow parts={parts} limit={200_000} model="Atlas 2" />);
    expect(screen.getByRole('group', { name: 'Context window' })).toBeInTheDocument();
    expect(screen.getAllByText(/143,500 of 200,000 tokens used/).length).toBeGreaterThan(0);
    await expectNoA11yViolations(container);
  });

  it('opens a part and removes an item inside the card', () => {
    render(<ContextWindow parts={parts} limit={200_000} />);
    const toggle = screen.getByRole('button', { name: /Files/ });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Remove billing.ts' }));
    expect(screen.queryByText('billing.ts')).not.toBeInTheDocument();
    expect(screen.getAllByText(/122,200 of 200,000/).length).toBeGreaterThan(0);
  });

  it('delegates removal when onRemoveItem is given', () => {
    const onRemoveItem = vi.fn();
    render(<ContextWindow parts={parts} limit={200_000} onRemoveItem={onRemoveItem} />);
    fireEvent.click(screen.getByRole('button', { name: /Files/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove schema.prisma' }));
    expect(onRemoveItem).toHaveBeenCalledWith('files', 'schema');
    expect(screen.getByText('schema.prisma')).toBeInTheDocument();
  });

  it('compacts a part and warns when nearly full', async () => {
    const onCompact = vi.fn().mockResolvedValue(undefined);
    render(<ContextWindow parts={parts} limit={170_000} onCompact={onCompact} />);
    expect(screen.getAllByText(/left/).length).toBeGreaterThan(0);
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Compact Conversation' }));
    });
    expect(onCompact).toHaveBeenCalledWith('chat');
    await waitFor(() => expect(screen.getByText('Compacted')).toBeInTheDocument());
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ContextWindow parts={parts} limit={200_000} ref={ref} className="x" />);
    expect(ref.current).toHaveClass('x');
  });
});
