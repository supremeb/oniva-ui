import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { IntegrationPicker, type Integration } from './IntegrationPicker';

const items: Integration[] = [
  { id: 'docs', name: 'Docs Hub', category: 'Knowledge', description: 'Sync pages.', features: ['Two-way sync', 'Page search'], connected: true },
  { id: 'mail', name: 'Mail Relay', category: 'Messaging', description: 'Send and read mail.', features: ['Threads'] },
  { id: 'crm', name: 'CRM Core', category: 'Sales', description: 'Accounts and deals.', features: ['Deals'] },
];

describe('IntegrationPicker', () => {
  it('groups Connected and Available and shows the picked integration', async () => {
    render(<IntegrationPicker integrations={items} appName="Oniva" />);
    expect(screen.getAllByText('Connected').length).toBeGreaterThan(0);
    expect(screen.getByText('Available')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Oniva + Docs Hub' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('option', { name: /Mail Relay/ }));
    expect(screen.getByRole('heading', { name: 'Oniva + Mail Relay' })).toBeInTheDocument();
    expect(screen.getByText('Threads')).toBeInTheDocument();
  });

  it('filters by search and reports toggles from the switch', async () => {
    const onToggle = vi.fn();
    render(<IntegrationPicker integrations={items} defaultSelected="mail" onToggle={onToggle} />);
    await userEvent.type(screen.getByRole('searchbox', { name: 'Search integrations' }), 'crm');
    expect(screen.getAllByRole('option')).toHaveLength(1);
    await userEvent.click(screen.getByRole('option', { name: /CRM Core/ }));
    await userEvent.click(screen.getByRole('switch', { name: 'Connect CRM Core' }));
    expect(onToggle).toHaveBeenCalledWith('crm', true);
    expect(screen.getByRole('switch', { name: 'Disconnect CRM Core' })).toBeChecked();
  });

  it('ArrowDown from search moves into the list; Esc/ArrowLeft call onClose/onBack when empty', async () => {
    const onClose = vi.fn();
    const onBack = vi.fn();
    render(<IntegrationPicker integrations={items} onClose={onClose} onBack={onBack} />);
    const search = screen.getByRole('searchbox');
    await userEvent.click(search);
    await userEvent.keyboard('{ArrowLeft}');
    expect(onBack).toHaveBeenCalled();
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
    await userEvent.keyboard('{ArrowDown}');
    expect(within(screen.getByRole('listbox')).getAllByRole('option').includes(document.activeElement as HTMLElement)).toBe(true);
  });

  it('forwards ref and className', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<IntegrationPicker integrations={items} ref={ref} className="extra" />);
    expect(ref.current).toHaveClass('extra');
  });
});
