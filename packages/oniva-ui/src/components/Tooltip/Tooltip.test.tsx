import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Button } from '../Button';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('shows on keyboard focus, links via aria-describedby, hides on Esc', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Copy link" delay={0}>
        <Button aria-label="Copy">c</Button>
      </Tooltip>,
    );
    await user.tab();
    const tip = await screen.findByRole('tooltip');
    expect(tip).toHaveTextContent('Copy link');
    expect(screen.getByRole('button', { name: 'Copy' })).toHaveAttribute(
      'aria-describedby',
      tip.id,
    );
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
  });

  it('shows on hover', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Hello" delay={10} showArrow={false}>
        <Button>Hover me</Button>
      </Tooltip>,
    );
    const b = screen.getByRole('button', { name: 'Hover me' });
    await user.unhover(b);
    await user.pointer({ target: b });
    await user.hover(b);
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Hello');
  });
});
