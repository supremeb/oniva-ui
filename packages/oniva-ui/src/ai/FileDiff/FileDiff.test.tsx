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
