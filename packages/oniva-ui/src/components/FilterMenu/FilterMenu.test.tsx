import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FilterMenu, type FilterMenuGroup } from './FilterMenu';

const groups: FilterMenuGroup[] = [
  {
    id: 'stage',
    label: 'Stage',
    chipPrefix: 'Stage: ',
    options: [
      { id: 'new', label: 'New lead', count: 1240 },
      { id: 'won', label: 'Won' },
    ],
  },
  { id: 'region', label: 'Region', options: [{ id: 'emea', label: 'EMEA' }, { id: 'amer', label: 'Americas' }] },
];

describe('FilterMenu', () => {
  it('picks options, shows removable chips and clears all', async () => {
    const onChange = vi.fn();
    render(<FilterMenu groups={groups} onChange={onChange} />);
    expect(screen.getByRole('button', { name: /^Stage/ })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: /^Region/ })).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(screen.getByRole('checkbox', { name: /New lead/ }));
    expect(onChange).toHaveBeenLastCalledWith({ stage: ['new'] });
    expect(screen.getByRole('checkbox', { name: /New lead/ })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText('1,240')).toBeInTheDocument();
    const chips = screen.getByRole('list', { name: 'Active filters' });
    await userEvent.click(within(chips).getByRole('button', { name: 'Remove filter Stage: New lead' }));
    expect(onChange).toHaveBeenLastCalledWith({});
    await userEvent.click(screen.getByRole('checkbox', { name: /Won/ }));
    await userEvent.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(onChange).toHaveBeenLastCalledWith({});
  });

  it('supports arrow, Enter, and left/right keys on a single tab stop', async () => {
    render(<FilterMenu groups={groups} defaultValue={{}} />);
    await userEvent.tab();
    expect(screen.getByRole('button', { name: /^Stage/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('checkbox', { name: /New lead/ })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(screen.getByRole('checkbox', { name: /New lead/ })).toHaveAttribute('aria-checked', 'true');
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('button', { name: /^Stage/ })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('button', { name: /^Stage/ })).toHaveAttribute('aria-expanded', 'false');
    await userEvent.keyboard('{ArrowDown}{ArrowRight}');
    expect(screen.getByRole('button', { name: /^Region/ })).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('checkbox', { name: 'Americas' })).toHaveFocus();
  });

  it('forwards ref and className and can hide hints', () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(<FilterMenu groups={groups} ref={ref} className="extra" hasHints={false} />);
    expect(ref.current).toHaveClass('extra');
    expect(container.textContent).not.toContain('open or close');
  });
});
