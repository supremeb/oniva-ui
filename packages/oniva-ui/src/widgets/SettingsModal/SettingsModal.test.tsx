import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SettingsModal } from './SettingsModal';

const pages = [
  { id: 'profile', label: 'Profile', content: <p>Display name settings</p> },
  { id: 'notifications', label: 'Notifications', content: <p>Email digest settings</p> },
  {
    id: 'security',
    label: 'Security',
    heading: 'Sign-in & security',
    content: <p>2FA settings</p>,
  },
];

describe('SettingsModal', () => {
  it('renders the open dialog with sidebar tabs and first page', () => {
    render(<SettingsModal pages={pages} isOpen />);
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    expect(screen.getByText('Display name settings')).toBeInTheDocument();
  });

  it('switches pages and reports page change; hidden when closed', async () => {
    const user = userEvent.setup();
    const onPage = vi.fn();
    const { rerender } = render(<SettingsModal pages={pages} isOpen onPageChange={onPage} />);
    await user.click(screen.getByRole('tab', { name: 'Security' }));
    expect(onPage).toHaveBeenCalledWith('security');
    expect(screen.getByRole('heading', { name: 'Sign-in & security' })).toBeInTheDocument();
    expect(screen.getByText('2FA settings')).toBeInTheDocument();
    rerender(<SettingsModal pages={pages} isOpen={false} onPageChange={onPage} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
