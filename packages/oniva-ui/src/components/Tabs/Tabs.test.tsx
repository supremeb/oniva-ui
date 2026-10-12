import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tab, TabList, TabPanel, Tabs } from './Tabs';

function Example(props: {
  variant?: 'line' | 'pill';
  onChange?: (k: unknown) => void;
  className?: string;
}) {
  return (
    <Tabs variant={props.variant} onSelectionChange={props.onChange} className={props.className}>
      <TabList aria-label="Account">
        <Tab id="overview">Overview</Tab>
        <Tab id="billing" count={3}>
          Billing
        </Tab>
        <Tab id="team" isDisabled>
          Team
        </Tab>
      </TabList>
      <TabPanel id="overview">Overview panel</TabPanel>
      <TabPanel id="billing">Billing panel</TabPanel>
      <TabPanel id="team">Team panel</TabPanel>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('exposes tablist/tab/tabpanel roles with the first tab selected', () => {
    render(<Example />);
    expect(screen.getByRole('tablist', { name: 'Account' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel');
  });
  it('switches on click and arrow-key navigation', async () => {
    const onChange = vi.fn();
    render(<Example onChange={onChange} />);
    await userEvent.click(screen.getByRole('tab', { name: /Billing/ }));
    expect(onChange).toHaveBeenCalledWith('billing');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Billing panel');
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
  });
  it('disabled tab is not selectable; variant changes classes; className forwarded', async () => {
    const { rerender } = render(<Example className="x" />);
    await userEvent.click(screen.getByRole('tab', { name: 'Team' }));
    expect(screen.getByRole('tab', { name: 'Team' })).toHaveAttribute('aria-selected', 'false');
    const a = screen.getByRole('tablist').className;
    expect(screen.getByRole('tablist').parentElement?.parentElement).toHaveClass('x');
    rerender(<Example variant="pill" />);
    expect(screen.getByRole('tablist').className).not.toBe(a);
  });
});
