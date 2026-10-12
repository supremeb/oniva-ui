import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { McpServerList, type McpServer } from './McpServerList';

const initial: McpServer[] = [
  { id: 'gh', name: 'GitHub', status: 'connected', enabled: true, endpoint: 'stdio · npx @modelcontextprotocol/server-github', tools: [
    { name: 'create_issue', description: 'Open an issue in a repo' },
    { name: 'search_code', description: 'Search code across repos' },
    { name: 'create_pull_request', description: 'Open a PR from a branch' },
  ] },
  { id: 'slack', name: 'Slack', status: 'connected', enabled: true, endpoint: 'https://mcp.slack.com/sse', tools: [
    { name: 'post_message', description: 'Post to a channel' },
    { name: 'search_messages', description: 'Search workspace history' },
  ] },
  { id: 'linear', name: 'Linear', status: 'connecting', enabled: true, endpoint: 'https://mcp.linear.app/sse', tools: [{ name: 'list_issues', description: 'List issues by team' }] },
  { id: 'pg', name: 'Postgres (prod replica)', status: 'error', enabled: false, endpoint: 'stdio · mcp-postgres', error: 'ECONNREFUSED 10.0.4.12:5432', tools: [{ name: 'query', description: 'Run read-only SQL' }] },
];

function Controlled() {
  const [servers, setServers] = useState(initial);
  return (
    <div style={{ maxWidth: 520, width: '100%' }}>
      <McpServerList servers={servers} onToggle={(id, enabled) => setServers((l) => l.map((s) => (s.id === id ? { ...s, enabled } : s)))} />
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'MCP server list',
    slug: 'mcp-server-list',
    category: 'AI & Agent',
    description: 'Connected Model Context Protocol servers with status, enable toggles and expandable tool lists.',
  },
  demos: [
    {
      name: 'Workspace servers',
      code: `<McpServerList servers={servers} onToggle={(id, enabled) => update(id, enabled)} />`,
      Component: Controlled,
    },
  ],
};

export default demo;
