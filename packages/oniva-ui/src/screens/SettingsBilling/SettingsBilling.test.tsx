import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { SettingsBilling } from './SettingsBilling';

describe('SettingsBilling', () => {
  it('renders landmarks and opens the Billing tab by default', () => {
    render(<SettingsBilling />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('tab', { name: 'Billing', selected: true })).toBeInTheDocument();
    expect(screen.getByRole('grid', { name: 'Invoices' })).toBeInTheDocument();
  });

  it('names the download buttons after the invoice', async () => {
    const onDownloadInvoice = vi.fn();
    render(<SettingsBilling onDownloadInvoice={onDownloadInvoice} />);
    await userEvent.click(screen.getByRole('button', { name: 'Download invoice INV-1031' }));
    expect(onDownloadInvoice).toHaveBeenCalledWith('INV-1031');
    expect(screen.getByRole('status')).toHaveTextContent('Downloading INV-1031.');
  });

  it('switches yearly pricing and plan', async () => {
    const onChangePlan = vi.fn();
    render(<SettingsBilling onChangePlan={onChangePlan} />);
    expect(screen.getByRole('article', { name: 'Team plan' })).toHaveTextContent('$480');
    await userEvent.click(screen.getByRole('radio', { name: /Yearly/ }));
    expect(screen.getByRole('article', { name: 'Team plan' })).toHaveTextContent('$384');
    await userEvent.click(screen.getByRole('button', { name: 'Choose Scale' }));
    expect(onChangePlan).toHaveBeenCalledWith('scale', 'yearly');
  });

  it('moves between tabs with the keyboard and invites a member', async () => {
    render(<SettingsBilling defaultTab="General" />);
    screen.getByRole('tab', { name: 'General' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(await screen.findByRole('tab', { name: /Members/, selected: true })).toBeInTheDocument();
    // The tab panel swaps with a short animation; wait for the new panel under parallel load.
    await userEvent.type(await screen.findByLabelText('Email'), 'zoe@northwind.example');
    await userEvent.click(await screen.findByRole('button', { name: 'Send invite' }));
    expect(await screen.findByText('zoe')).toBeInTheDocument();
  });

  it('creates and revokes api keys', async () => {
    render(<SettingsBilling defaultTab="API keys" />);
    await userEvent.click(screen.getByRole('button', { name: 'Create key' }));
    expect(screen.getByRole('note')).toHaveTextContent('shown once');
    await userEvent.click(screen.getByRole('button', { name: 'Revoke Production' }));
    expect(screen.queryByText('Production')).toBeNull();
  });

  it('forwards ref and className', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<SettingsBilling ref={ref} className="x" />);
    expect(container.querySelector('.x')).toBe(ref.current);
  });
});
