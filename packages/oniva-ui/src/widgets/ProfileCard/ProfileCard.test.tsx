import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ProfileCard } from './ProfileCard';

const details = [
  { label: 'Date of birth', value: '28 July, 1997' },
  { label: 'Blood type', value: 'A rh+' },
];

describe('ProfileCard', () => {
  it('shows name, initial and detail rows', () => {
    render(<ProfileCard name="Mira Okonkwo" details={details} subtitle="Patient since 2021" />);
    expect(screen.getByRole('heading', { name: 'Mira Okonkwo' })).toBeInTheDocument();
    expect(screen.getByText('Patient since 2021')).toBeInTheDocument();
    expect(screen.getByText('28 July, 1997')).toBeInTheDocument();
    expect(screen.getByText('Blood type')).toBeInTheDocument();
  });

  it('add button fires and forwards ref/className', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    let el: HTMLElement | null = null;
    render(
      <ProfileCard
        name="Mira Okonkwo"
        details={details}
        onAddPhoto={onAdd}
        className="extra"
        ref={(n) => {
          el = n;
        }}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Add photo' }));
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(el).toBeInstanceOf(HTMLElement);
    expect((el as unknown as HTMLElement).className).toContain('extra');
  });
});
