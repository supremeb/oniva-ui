import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FileDiff } from './FileDiff';
import { parseUnifiedDiff, toSplitRows } from './parse';

const diff = `@@ -1,3 +1,3 @@
 keep
-old
+new
 end
@@ -10,1 +10,2 @@
 tail
+extra`;

describe('parseUnifiedDiff', () => {
  it('parses hunks with line numbers', () => {
    const h = parseUnifiedDiff(diff);
    expect(h).toHaveLength(2);
    expect(h[0]!.added).toBe(1);
    expect(h[0]!.lines[1]).toMatchObject({ type: 'del', oldNo: 2 });
    expect(h[0]!.lines[2]).toMatchObject({ type: 'add', newNo: 2 });
    expect(toSplitRows(h[0]!.lines)).toHaveLength(3);
  });
});

describe('FileDiff', () => {
  it('records per-hunk decisions and collapses hunks', () => {
    const onHunkDecision = vi.fn();
    render(<FileDiff fileName="a.ts" diff={diff} reviewable onHunkDecision={onHunkDecision} />);
    fireEvent.click(screen.getByRole('button', { name: 'Accept change 1' }));
    expect(onHunkDecision).toHaveBeenCalledWith(0, 'accepted');
    expect(screen.getByText('Accepted')).toBeInTheDocument();
    const toggle = screen.getAllByRole('button', { expanded: true })[0]!;
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});

const prose = `@@ -1,2 +1,2 @@
 # Release notes
-The new dashboard is available for all customers today.
+The new dashboard is live for all customers.`;

describe('diffWords', () => {
  it('groups changed words and keeps equal ones', async () => {
    const { diffWords } = await import('./parse');
    const segs = diffWords('is available for all', 'is live for all');
    expect(segs.map((s) => s.type)).toEqual(['equal', 'del', 'ins', 'equal']);
    expect(segs[1]!.text).toBe('available');
    expect(segs[2]!.text).toBe('live');
  });
});

describe('FileDiff inline mode', () => {
  it('shows struck and added words on one line', () => {
    const { container } = render(<FileDiff fileName="notes.md" diff={prose} defaultView="inline" />);
    expect(container.querySelector('del')).toHaveTextContent('available');
    expect(container.querySelector('ins')).toHaveTextContent('live');
  });

  it('accept collapses the removed words; reject removes the added ones; undo restores', () => {
    const onHunkUndo = vi.fn();
    const { container } = render(<FileDiff fileName="notes.md" diff={prose} defaultView="inline" reviewable onHunkUndo={onHunkUndo} />);
    fireEvent.click(screen.getByRole('button', { name: 'Accept change 1' }));
    expect(container.querySelector('del')).toBeNull();
    expect(container.querySelector('ins')).toHaveTextContent('live');
    fireEvent.click(screen.getByRole('button', { name: 'Undo decision for change 1' }));
    expect(onHunkUndo).toHaveBeenCalledWith(0);
    expect(container.querySelector('del')).toHaveTextContent('available');
    fireEvent.click(screen.getByRole('button', { name: 'Reject change 1' }));
    expect(container.querySelector('ins')).toBeNull();
    expect(container.querySelector('del')).toHaveTextContent('available');
  });

  it('Y and N decide the focused hunk; Accept all handles the rest', () => {
    const onHunkDecision = vi.fn();
    render(<FileDiff fileName="a.ts" diff={diff} reviewable onHunkDecision={onHunkDecision} />);
    const toggle = screen.getAllByRole('button', { expanded: true })[0]!;
    fireEvent.keyDown(toggle, { key: 'y' });
    expect(onHunkDecision).toHaveBeenCalledWith(0, 'accepted');
    fireEvent.click(screen.getByRole('button', { name: 'Reject change 2' }));
    expect(onHunkDecision).toHaveBeenLastCalledWith(1, 'rejected');
  });

  it('switches to inline from the view control and forwards ref/className', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<FileDiff fileName="notes.md" diff={prose} ref={ref} className="x" />);
    fireEvent.click(screen.getByRole('radio', { name: 'Inline' }));
    expect(document.querySelector('ins')).toBeInTheDocument();
    expect(ref.current).toHaveClass('x');
  });
});
