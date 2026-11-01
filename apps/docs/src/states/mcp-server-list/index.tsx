import { McpServerList } from 'oniva-ui';
import type { McpServer } from 'oniva-ui';
import type { StateModule } from '../types';

const repo: McpServer = {
  id: 'repo',
  name: 'Northwind Repos',
  status: 'connected',
  enabled: true,
  endpoint: 'stdio · npx @northwind/mcp-repos',
  tools: [
    { name: 'create_issue', description: 'Open an issue in a repository' },
    { name: 'search_code', description: 'Search code across repositories' },
    { name: 'create_pull_request', description: 'Open a pull request from a branch' },
  ],
};
const chat: McpServer = {
  id: 'chat',
  name: 'Northwind Chat',
  status: 'connected',
  enabled: true,
  endpoint: 'https://mcp.chat.northwind.example/sse',
  tools: [
    { name: 'post_message', description: 'Post to a channel' },
    { name: 'search_messages', description: 'Search workspace history' },
  ],
};
const tracker: McpServer = {
  id: 'tracker',
  name: 'Northwind Tracker',
  status: 'connecting',
  enabled: true,
  endpoint: 'https://mcp.tracker.northwind.example/sse',
  tools: [{ name: 'list_issues', description: 'List issues by team' }],
};
const db: McpServer = {
  id: 'db',
  name: 'Orders replica',
  status: 'error',
  enabled: false,
  endpoint: 'stdio · mcp-sql --readonly',
  error: 'ECONNREFUSED 10.0.4.12:5432',
  tools: [{ name: 'query', description: 'Run read-only SQL' }],
};
const files: McpServer = {
  id: 'files',
  name: 'Shared drive',
  status: 'disconnected',
  enabled: false,
  endpoint: 'stdio · npx @northwind/mcp-files /srv/shared',
  tools: [
    { name: 'read_file', description: 'Read a file by path' },
    { name: 'list_directory', description: 'List a directory' },
  ],
};

const longEndpoint = 'https://mcp.eu-central-1.internal.northwind.example/workspaces/northwind-labs/projects/payments-platform/servers/orders-replica/sse?token_scope=read';
const longName = 'Northwind Labs production analytics warehouse (read-only replica, EU region)';

const mod: StateModule = {
  slug: 'mcp-server-list',
  title: 'MCP server list',
  width: 520,
  groups: [
    {
      label: 'Data',
      states: [
        { id: 'empty', label: 'empty', render: () => <McpServerList servers={[]} /> },
        { id: 'one-server', label: 'one server', render: () => <McpServerList servers={[repo]} onToggle={() => undefined} /> },
        { id: 'typical', label: 'typical mix', render: () => <McpServerList servers={[repo, chat, tracker, db]} onToggle={() => undefined} /> },
        {
          id: 'many',
          label: 'many servers',
          render: () => (
            <McpServerList
              servers={[
                repo, chat, tracker, db, files,
                { ...repo, id: 'r2', name: 'Northwind Docs', endpoint: 'stdio · npx @northwind/mcp-docs' },
                { ...chat, id: 'c2', name: 'Northwind Calendar', endpoint: 'https://mcp.calendar.northwind.example/sse' },
                { ...files, id: 'f2', name: 'Release notes', endpoint: 'stdio · npx @northwind/mcp-notes' },
              ]}
              onToggle={() => undefined}
            />
          ),
        },
      ],
    },
    {
      label: 'Status',
      states: [
        { id: 'connected', label: 'connected, enabled', render: () => <McpServerList servers={[repo]} onToggle={() => undefined} /> },
        { id: 'connecting', label: 'connecting', render: () => <McpServerList servers={[tracker]} onToggle={() => undefined} /> },
        { id: 'error', label: 'error shows message', render: () => <McpServerList servers={[db]} onToggle={() => undefined} /> },
        { id: 'error-no-message', label: 'error without message', render: () => <McpServerList servers={[{ ...db, error: undefined }]} onToggle={() => undefined} /> },
        { id: 'disconnected', label: 'disconnected', render: () => <McpServerList servers={[files]} onToggle={() => undefined} /> },
        { id: 'connected-disabled', label: 'connected but switched off', render: () => <McpServerList servers={[{ ...repo, enabled: false }]} onToggle={() => undefined} /> },
        { id: 'all-disabled', label: 'all disabled (0 tools)', render: () => <McpServerList servers={[{ ...repo, enabled: false }, { ...chat, enabled: false }, db]} onToggle={() => undefined} /> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'long-endpoint', label: 'long endpoint truncates', render: () => <McpServerList servers={[{ ...chat, endpoint: longEndpoint }]} onToggle={() => undefined} /> },
        { id: 'long-error', label: 'long error truncates', render: () => <McpServerList servers={[{ ...db, error: `connect ECONNREFUSED 10.0.4.12:5432 while opening ${longEndpoint}` }]} onToggle={() => undefined} /> },
        { id: 'long-name', label: 'long name', render: () => <McpServerList servers={[{ ...db, name: longName, status: 'connected', enabled: true, error: undefined }]} onToggle={() => undefined} /> },
        { id: 'no-endpoint', label: 'no endpoint', render: () => <McpServerList servers={[{ ...repo, endpoint: undefined }]} onToggle={() => undefined} /> },
        { id: 'no-tools', label: 'server without tools', render: () => <McpServerList servers={[{ ...repo, tools: [] }, chat]} onToggle={() => undefined} /> },
        { id: 'custom-title', label: 'custom title', render: () => <McpServerList title="Project connectors" servers={[repo, chat]} onToggle={() => undefined} /> },
      ],
    },
  ],
  missing: [
    'Expanded tool list (open state is internal, no defaultOpen prop)',
    'Row-level loading/pending while a toggle request is in flight (no prop)',
    'Read-only / disabled list (no isDisabled prop)',
  ],
};
export default mod;
