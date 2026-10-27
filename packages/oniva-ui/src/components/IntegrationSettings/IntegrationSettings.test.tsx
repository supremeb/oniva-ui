import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { IntegrationSettings, isValidSiteUrl } from './IntegrationSettings';

describe('IntegrationSettings', () => {
  it('validates the site address', () => {
    expect(isValidSiteUrl('shop.example.com')).toBe(true);
    expect(isValidSiteUrl('https://shop.example.com/store')).toBe(true);
    expect(isValidSiteUrl('not a url')).toBe(false);
  });

  it('shows the save bar on change, flags a bad address, then saves valid values', async () => {
    const onSave = vi.fn();
    render(
      <IntegrationSettings
        name="Storefront"
        count={128}
        meta="Connected on March 4"
        defaultValues={{ siteUrl: 'shop.example.com' }}
        onSave={onSave}
      />,
    );
    expect(screen.getByText('128')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Save changes' })).toBeNull();
    const url = screen.getByRole('textbox', { name: 'Site address' });
    await userEvent.clear(url);
    await userEvent.type(url, 'nope');
    expect(url).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('button', { name: 'Save changes' })).toBeDisabled();
    await userEvent.clear(url);
    await userEvent.type(url, 'store.example.org');
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }));
    await waitFor(() => expect(onSave).toHaveBeenCalled());
    expect(onSave.mock.calls[0]?.[0]).toMatchObject({ siteUrl: 'store.example.org', enabled: true });
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Save changes' })).toBeNull());
  });

  it('discard restores values; generate shows a revealed key; switch reports toggle', async () => {
    const onToggle = vi.fn();
    render(
      <IntegrationSettings
        name="Storefront"
        meta="Connected"
        onGenerateKey={() => 'ok_test_key_1234'}
        onToggle={onToggle}
        defaultValues={{ siteUrl: 'shop.example.com' }}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Generate key' }));
    expect(await screen.findByDisplayValue('ok_test_key_1234')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Discard' }));
    expect(screen.queryByDisplayValue('ok_test_key_1234')).toBeNull();
    await userEvent.click(screen.getByRole('switch', { name: 'Storefront sync' }));
    expect(onToggle).toHaveBeenCalledWith(false);
    expect(screen.getByText(/Paused/)).toBeInTheDocument();
  });

  it('forwards ref and className', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<IntegrationSettings name="Storefront" ref={ref} className="extra" />);
    expect(ref.current).toHaveClass('extra');
  });
});
