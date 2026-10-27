import { fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../internal/test-a11y';
import { squarify } from '../../internal/w2-treemap';
import { ContextMap, type ContextBlock } from './ContextMap';

const blocks: ContextBlock[] = [
  { id: 'system', label: 'System prompt', kind: 'system', tokens: 6200 },
  { id: 'tools', label: 'Tool definitions', kind: 'tools', tokens: 14800 },
  { id: 'spec', label: 'checkout.spec.ts', kind: 'file', tokens: 8200, detail: 'Read at 0:09', items: [{ label: 'describe(checkout)' }] },
  { id: 'chat', label: 'Chat', kind: 'chat', tokens: 41000 },
];

describe('squarify', () => {
  it('fills the area and keeps ids', () => {
    const r = squarify([{ id: 'a', value: 3 }, { id: 'b', value: 1 }, { id: 'c', value: 2 }]);
    expect(r.map((x) => x.id)).toEqual(['a', 'b', 'c']);
    expect(r.reduce((n, x) => n + x.w * x.h, 0)).toBeCloseTo(10_000, 3);
  });
});

describe('ContextMap', () => {
  it('lists every block and free space with name, kind and tokens', async () => {
    const { container } = render(<ContextMap blocks={blocks} limit={200_000} model="Atlas 2" />);
    expect(screen.getByRole('button', { name: 'Chat, Chat, 41,000 tokens' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Free space, 129,800 tokens/ })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });

  it('pins a tile on click, shows details, and Escape lets go', () => {
    const onSelect = vi.fn();
    render(<ContextMap blocks={blocks} limit={200_000} onSelect={onSelect} />);
    const tile = screen.getByRole('button', { name: /checkout\.spec\.ts/ });
    fireEvent.click(tile);
    expect(tile).toHaveAttribute('aria-pressed', 'true');
    expect(onSelect).toHaveBeenCalledWith(blocks[2]);
    expect(screen.getByText(/Read at 0:09/)).toBeInTheDocument();
    fireEvent.keyDown(tile, { key: 'Escape' });
    expect(tile).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(screen.getByRole('button', { name: /Free space/ }));
    expect(onSelect).toHaveBeenLastCalledWith(null);
  });

  it('switches between before and after a compaction', () => {
    const before = [...blocks, { id: 'old', label: 'Old turns', kind: 'chat' as const, tokens: 30000 }];
    render(<ContextMap blocks={blocks} limit={200_000} compaction={{ before, summarized: ['old'], summary: 'Old turns became a summary.' }} />);
    expect(screen.queryByRole('button', { name: /Old turns/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('radio', { name: 'Before' }));
    expect(screen.getByRole('button', { name: /Old turns/ })).toBeInTheDocument();
  });

  it('shows "Not compacted yet" for null', () => {
    render(<ContextMap blocks={blocks} compaction={null} />);
    expect(screen.getByText(/Not compacted yet/)).toBeInTheDocument();
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ContextMap blocks={blocks} ref={ref} className="x" />);
    expect(ref.current).toHaveClass('x');
  });
});
