import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Collapsible } from './Collapsible';

describe('Collapsible', () => {
  it('expands and collapses', async () => {
    render(<Collapsible trigger="More">Hidden body</Collapsible>);
    const btn = screen.getByRole('button', { name: 'More' });
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
  });

  it('respects defaultExpanded and className', () => {
    const { container } = render(
      <Collapsible trigger="More" defaultExpanded className="c">
        Body
      </Collapsible>,
    );
    expect(screen.getByRole('button', { name: 'More' })).toHaveAttribute('aria-expanded', 'true');
    expect(container.querySelector('.c')).toBeInTheDocument();
  });
});
