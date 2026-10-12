import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ListBox, ListBoxItem, ListBoxSection } from './ListBox';

describe('ListBox', () => {
  it('exposes listbox/option roles and selects on click', async () => {
    render(
      <ListBox aria-label="Fruit" selectionMode="single" className="c">
        <ListBoxItem id="a">Apple</ListBoxItem>
        <ListBoxItem id="b" description="Yellow">
          Banana
        </ListBoxItem>
      </ListBox>,
    );
    const list = screen.getByRole('listbox', { name: 'Fruit' });
    expect(list).toHaveClass('c');
    const opts = screen.getAllByRole('option');
    expect(opts).toHaveLength(2);
    await userEvent.click(opts[1]!);
    expect(opts[1]).toHaveAttribute('aria-selected', 'true');
    expect(opts[1]).toHaveAccessibleDescription('Yellow');
  });

  it('supports multiple selection, disabled items and sections', async () => {
    render(
      <ListBox aria-label="Opts" selectionMode="multiple">
        <ListBoxSection title="Group">
          <ListBoxItem id="a">A</ListBoxItem>
          <ListBoxItem id="b">B</ListBoxItem>
          <ListBoxItem id="c" isDisabled>
            C
          </ListBoxItem>
        </ListBoxSection>
      </ListBox>,
    );
    const [a, b, c] = screen.getAllByRole('option');
    await userEvent.click(a!);
    await userEvent.click(b!);
    await userEvent.click(c!);
    expect(a).toHaveAttribute('aria-selected', 'true');
    expect(b).toHaveAttribute('aria-selected', 'true');
    expect(c).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByText('Group')).toBeInTheDocument();
  });
});
