import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AuthCard } from './AuthCard';

describe('AuthCard', () => {
  it('submits entered credentials', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AuthCard onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText('Email'), 'sam@acme.io');
    await user.type(screen.getByLabelText('Password'), 'hunter2!!');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(onSubmit).toHaveBeenCalledWith({ email: 'sam@acme.io', password: 'hunter2!!' });
  });

  it('shows rejection errors and fires social/forgot handlers', async () => {
    const user = userEvent.setup();
    const onSocial = vi.fn();
    let el: HTMLElement | null = null;
    render(
      <AuthCard
        onSubmit={() => Promise.reject(new Error('Wrong password'))}
        onSocial={onSocial}
        className="extra"
        ref={(n) => {
          el = n;
        }}
      />,
    );
    await user.type(screen.getByLabelText('Email'), 'sam@acme.io');
    await user.type(screen.getByLabelText('Password'), 'x');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Wrong password');
    await user.click(screen.getByRole('button', { name: 'GitHub' }));
    expect(onSocial).toHaveBeenCalledWith('github');
    expect(screen.getByRole('link', { name: 'Forgot password?' })).toBeInTheDocument();
    expect(el).toBeInstanceOf(HTMLElement);
  });
});
