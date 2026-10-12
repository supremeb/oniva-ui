import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ContributorProfile } from './ContributorProfile';

const activity = [
  { date: '2026-10-09', value: 3 },
  { date: '2026-10-10', value: 0 },
  { date: '2026-10-11', value: 5 },
];
const stats = [
  { label: 'Sponsors', value: 42 },
  { label: 'Merged PRs', value: 318 },
];

describe('ContributorProfile', () => {
  it('renders identity, amount, delta and stats', () => {
    render(
      <ContributorProfile
        name="Ana Lindqvist"
        handle="analind"
        pro
        amount={5520}
        delta={14.8}
        stats={stats}
        activity={activity}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Ana Lindqvist' })).toBeInTheDocument();
    expect(screen.getByText('@analind')).toBeInTheDocument();
    expect(screen.getByText('PRO')).toBeInTheDocument();
    expect(screen.getByText('$5,520')).toBeInTheDocument();
    expect(screen.getByText('+14.8%')).toBeInTheDocument();
    expect(screen.getByText('318')).toBeInTheDocument();
  });

  it('fires actions, switches range, forwards ref', async () => {
    const user = userEvent.setup();
    const onShare = vi.fn();
    let el: HTMLElement | null = null;
    render(
      <ContributorProfile
        name="Ana Lindqvist"
        handle="analind"
        amount={5520}
        stats={stats}
        activity={activity}
        onShare={onShare}
        className="extra"
        ref={(n) => {
          el = n;
        }}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Share' }));
    expect(onShare).toHaveBeenCalled();
    await user.click(screen.getByRole('radio', { name: 'Weekly' }));
    expect(screen.getByRole('radio', { name: 'Weekly' })).toBeChecked();
    expect(screen.queryByText('PRO')).toBeNull();
    expect(el).toBeInstanceOf(HTMLElement);
  });
});
