import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { McpServerList, type McpServer } from './McpServerList';

const servers: McpServer[] = [
  { id: 'gh', name: 'GitHub', status: 'connected', enabled: true, endpoint: 'stdio · npx @modelcontextprotocol/server-github', tools: [{ name: 'create_issue', description: 'Open an issue' }] },
  { id: 'pg', name: 'Postgres', status: 'error', enabled: false, error: 'ECONNREFUSED 5432', tools: [] },
];

describe('McpServerList', () => {
  it('toggles servers and expands tools', () => {
    const onToggle = vi.fn();
    render(<McpServerList servers={servers} onToggle={onToggle} />);
    expect(screen.getByText('1 tools enabled')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('switch', { name: 'Enable Postgres' }));
    expect(onToggle).toHaveBeenCalledWith('pg', true);
    const btn = screen.getAllByRole('button', { expanded: false })[0]!;
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });
});
