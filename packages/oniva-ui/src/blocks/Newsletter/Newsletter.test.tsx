import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Newsletter } from './Newsletter';

describe('Newsletter', () => {
  it('subscribes and confirms', async () => {
    const onSubscribe = vi.fn();
    render(<Newsletter onSubscribe={onSubscribe} className="x" data-testid="n" />);
    await userEvent.type(screen.getByLabelText('Email address'), 'a@b.co');
    await userEvent.click(screen.getByRole('button', { name: 'Subscribe' }));
    expect(onSubscribe).toHaveBeenCalledWith('a@b.co');
    expect(screen.getByText(/Check a@b.co/)).toBeInTheDocument();
    expect(screen.getByTestId('n')).toHaveClass('x');
  });
});
