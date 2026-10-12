import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { List, ListItem } from './List';

describe('List', () => {
  it('renders a grid list with rows and checkbox selection', async () => {
    render(
      <List aria-label="Files" selectionMode="multiple" className="c">
        <ListItem id="a">Alpha</ListItem>
        <ListItem id="b" description="Second">
          Beta
        </ListItem>
      </List>,
    );
    expect(screen.getByRole('grid', { name: 'Files' })).toHaveClass('c');
    expect(screen.getAllByRole('row')).toHaveLength(2);
    const boxes = screen.getAllByRole('checkbox');
    await userEvent.click(boxes[0]!);
    expect(boxes[0]).toBeChecked();
    expect(screen.getAllByRole('row')[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('renders static rows without checkboxes', () => {
    render(
      <List aria-label="Static">
        <ListItem id="a">Alpha</ListItem>
      </List>,
    );
    expect(screen.queryByRole('checkbox')).toBeNull();
  });
});
