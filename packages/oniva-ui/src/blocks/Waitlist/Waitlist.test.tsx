import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Waitlist } from './Waitlist';

describe('Waitlist', () => {
  it('shows the success state after joining', async () => {
    const onJoin = vi.fn();
    render(<Waitlist onJoin={onJoin} />);
    await userEvent.type(screen.getByLabelText('Email address'), 'ada@example.com');
    await userEvent.click(screen.getByRole('button', { name: /join waitlist/i }));
    expect(await screen.findByRole('heading', { name: "You're on the list" })).toBeInTheDocument();
    expect(onJoin).toHaveBeenCalledWith('ada@example.com');
    expect(screen.getByText(/ada@example.com/)).toBeInTheDocument();
  });
  it('forwards className', () => {
    render(<Waitlist className="x" data-testid="w" />);
    expect(screen.getByTestId('w')).toHaveClass('x');
  });
});
