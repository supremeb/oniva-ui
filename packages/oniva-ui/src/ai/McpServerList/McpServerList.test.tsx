import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { McpServerList, type McpServer } from './McpServerList';

const servers: McpServer[] = [
  { id: 'gh', name: 'Northwind Repos', status: 'connected', enabled: true, endpoint: 'stdio · npx @northwind/mcp-repos', tools: [{ name: 'create_issue', description: 'Open an issue' }] },
  { id: 'pg', name: 'Orders replica', status: 'error', enabled: false, error: 'ECONNREFUSED 5432', tools: [] },
];

describe('McpServerList', () => {
  it('toggles servers and expands tools', () => {
    const onToggle = vi.fn();
    render(<McpServerList servers={servers} onToggle={onToggle} />);
    expect(screen.getByText('1 tool enabled')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('switch', { name: 'Enable Orders replica' }));
    expect(onToggle).toHaveBeenCalledWith('pg', true);
    const btn = screen.getAllByRole('button', { expanded: false })[0]!;
    fireEvent.click(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'true');
  });

  it('shows an empty message and zero count with no servers', () => {
    render(<McpServerList servers={[]} />);
    expect(screen.getByText('No MCP servers connected')).toBeInTheDocument();
    expect(screen.getByText('0 tools enabled')).toBeInTheDocument();
    expect(screen.queryByRole('list')).toBeNull();
  });

  it('pluralizes the enabled tool count', () => {
    render(<McpServerList servers={[{ ...servers[0]!, tools: [{ name: 'a', description: 'A' }, { name: 'b', description: 'B' }] }]} />);
    expect(screen.getByText('2 tools enabled')).toBeInTheDocument();
  });

  it('shows the error message in place of the endpoint, with a title for truncation', () => {
    render(<McpServerList servers={servers} />);
    expect(screen.getByText('ECONNREFUSED 5432')).toHaveAttribute('title', 'ECONNREFUSED 5432');
  });

  it('omits the detail line without an endpoint and explains an empty tool list when expanded', () => {
    render(<McpServerList servers={[{ id: 'x', name: 'Bare', status: 'connected', enabled: true, tools: [] }]} />);
    fireEvent.click(screen.getByRole('button', { expanded: false }));
    expect(screen.getByText('No tools exposed')).toBeInTheDocument();
  });
});
