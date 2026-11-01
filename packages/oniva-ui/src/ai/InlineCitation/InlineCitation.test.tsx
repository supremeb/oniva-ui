import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { InlineCitation } from './InlineCitation';

describe('InlineCitation', () => {
  it('renders an accessible numbered link to the source', () => {
    render(<p>Rates rose<InlineCitation index={2} title="Fed holds rates" url="https://www.news.example/markets/fed" /></p>);
    const link = screen.getByRole('link', { name: 'Source 2: Fed holds rates' });
    expect(link).toHaveAttribute('href', 'https://www.news.example/markets/fed');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(link).toHaveTextContent('2');
  });
  it('drops unsafe urls', () => {
    render(<InlineCitation index={1} title="Bad" url="javascript:alert(1)" />);
    expect(screen.getByRole('link', { name: 'Source 1: Bad' })).not.toHaveAttribute('href');
  });
  it('shows host and date in the preview card, and omits an empty host line for unsafe urls', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<InlineCitation index={1} title="Q3 letter" url="https://www.northwind.example/q3" date="Oct 2, 2026" snippet="Retention was 118%." />);
    await user.tab();
    expect(await screen.findByText('northwind.example · Oct 2, 2026')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open source/ })).toHaveAttribute('href', 'https://www.northwind.example/q3');
    unmount();

    render(<InlineCitation index={2} title="Bad" url="javascript:alert(1)" date="Oct 2, 2026" />);
    await user.tab();
    expect(await screen.findByText('Oct 2, 2026')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Open source/ })).not.toBeInTheDocument();
  });
});
