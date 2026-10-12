import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { TreeView, TreeViewItem } from './TreeView';

function Sample() {
  return (
    <TreeView aria-label="Files" selectionMode="single" className="c">
      <TreeViewItem id="src" title="src">
        <TreeViewItem id="a" title="a.ts" />
      </TreeViewItem>
      <TreeViewItem id="pkg" title="package.json" />
    </TreeView>
  );
}

describe('TreeView', () => {
  it('renders a tree and expands a parent via its chevron', async () => {
    render(<Sample />);
    expect(screen.getByRole('treegrid', { name: 'Files' })).toHaveClass('c');
    expect(screen.queryByText('a.ts')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: /expand/i }));
    expect(screen.getByText('a.ts')).toBeInTheDocument();
  });

  it('selects an item and expands with ArrowRight', async () => {
    render(<Sample />);
    const rows = screen.getAllByRole('row');
    await userEvent.click(rows[1]!);
    expect(rows[1]).toHaveAttribute('aria-selected', 'true');
    await userEvent.click(rows[0]!);
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByText('a.ts')).toBeInTheDocument();
  });
});
