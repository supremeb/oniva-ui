import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link } from 'react-aria-components';
import { describe, expect, it } from 'vitest';
import { HoverCard, HoverCardContent } from './HoverCard';

describe('HoverCard', () => {
  it('opens on keyboard focus, shows content, closes on Esc', async () => {
    const user = userEvent.setup();
    render(
      <HoverCard delay={0} closeDelay={0}>
        <Link href="#maria">Maria Chen</Link>
        <HoverCardContent aria-label="Maria Chen preview">
          <span>Controller at Northwind</span>
        </HoverCardContent>
      </HoverCard>,
    );
    await user.tab();
    expect(await screen.findByText('Controller at Northwind')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByText('Controller at Northwind')).not.toBeInTheDocument(),
    );
  });

  it('is closed by default and the trigger advertises a popup', () => {
    render(
      <HoverCard>
        <Link href="#x">Trigger</Link>
        <HoverCardContent aria-label="preview">Preview body</HoverCardContent>
      </HoverCard>,
    );
    const link = screen.getByRole('link', { name: 'Trigger' });
    expect(link).toHaveAttribute('aria-haspopup', 'dialog');
    expect(link).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Preview body')).not.toBeInTheDocument();
  });
});
