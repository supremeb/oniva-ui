import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Input } from '../Input';
import { Form } from './Form';

describe('Form', () => {
  it('submits and shows native validation error', async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <Form onSubmit={onSubmit} aria-label="Invite">
        <Input label="Email" name="email" isRequired />
        <button type="submit">Send</button>
      </Form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSubmit).not.toHaveBeenCalled();
    await userEvent.type(screen.getByLabelText(/Email/), 'a@b.co');
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('exposes form role and forwards ref', () => {
    let el: HTMLFormElement | null = null;
    render(
      <Form
        aria-label="Profile"
        ref={(n) => {
          el = n;
        }}
      />,
    );
    expect(screen.getByRole('form', { name: 'Profile' })).toBeInTheDocument();
    expect(el).toBeInstanceOf(HTMLFormElement);
  });
});
