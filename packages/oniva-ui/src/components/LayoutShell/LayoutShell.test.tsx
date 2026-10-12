import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LayoutShell } from './LayoutShell';

describe('LayoutShell', () => {
  it('renders sidebar, banner header and main content', () => {
    render(
      <LayoutShell sidebar={<aside aria-label="App">Side</aside>} header={<h1>Dashboard</h1>} className="x">
        <p>Revenue</p>
      </LayoutShell>,
    );
    expect(screen.getByRole('complementary', { name: 'App' })).toBeInTheDocument();
    expect(screen.getByRole('banner')).toHaveTextContent('Dashboard');
    expect(screen.getByRole('main')).toHaveTextContent('Revenue');
  });
  it('toggles the mobile drawer from the menu button and closes via scrim', async () => {
    const onChange = vi.fn();
    const { container } = render(
      <LayoutShell sidebar={<aside aria-label="App">Side</aside>} onSidebarOpenChange={onChange}>
        x
      </LayoutShell>,
    );
    const btn = screen.getByLabelText('Open navigation');
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(btn);
    expect(onChange).toHaveBeenCalledWith(true);
    expect(screen.getByLabelText('Close navigation')).toHaveAttribute('aria-expanded', 'true');
    const scrim = container.querySelector('[aria-hidden="true"]') as HTMLElement;
    await userEvent.click(scrim);
    expect(onChange).toHaveBeenLastCalledWith(false);
  });
  it('works without a sidebar', () => {
    render(<LayoutShell>Body</LayoutShell>);
    expect(screen.queryByRole('button', { hidden: true })).toBeNull();
    expect(screen.getByRole('main')).toHaveTextContent('Body');
  });
});
