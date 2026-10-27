import { Database, Mail, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { ToolCallCard, ToolCallGroup } from './ToolCallCard';

const args = { table: 'deals', stage: 'closed_won', since: '2026-07-01', limit: 500 };
const result = { rows: 412, total_usd: 4820310, segments: ['enterprise', 'mid-market', 'self-serve'], truncated: false };

function Retry() {
  const [status, setStatus] = useState<'error' | 'running' | 'success'>('error');
  useEffect(() => {
    if (status !== 'running') return;
    const t = window.setTimeout(() => setStatus('success'), 1800);
    return () => window.clearTimeout(t);
  }, [status]);
  return (
    <ToolCallCard
      name="send_email"
      icon={<Mail size={13} />}
      summary={status === 'running' ? 'Sending the renewal reminder…' : status === 'success' ? 'Sent the renewal reminder' : 'Could not send the renewal reminder'}
      status={status}
      args={{ to: 'dana@northwind.example', subject: 'Your plan renews on Nov 3' }}
      result={status === 'success' ? { id: 'msg_8841', accepted: true } : undefined}
      error="SMTP 550: mailbox unavailable"
      durationMs={status === 'success' ? 1800 : undefined}
      onRetry={() => setStatus('running')}
    />
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Tool call card',
    slug: 'tool-call-card',
    category: 'AI & Agent',
    description: 'One agent tool call: live timer, status and summary, folding open to highlighted arguments and result with copy, retry on error, and a group that sums several calls up.',
  },
  demos: [
    {
      name: 'States',
      code: `<ToolCallCard name="query_warehouse" icon={<Database size={13} />} summary="Queried closed-won deals" status="success" durationMs={1240} args={args} result={result} />
<ToolCallCard name="web_search" icon={<Search size={13} />} summary="Searching competitor pricing…" status="running" args={{ q: 'crm pricing 2026' }} />`,
      Component: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 640 }}>
          <ToolCallCard name="query_warehouse" icon={<Database size={13} />} summary="Queried closed-won deals" status="success" durationMs={1240} args={args} result={result} defaultExpanded />
          <ToolCallCard name="web_search" icon={<Search size={13} />} summary="Searching competitor pricing…" status="running" args={{ q: 'crm pricing 2026' }} />
          <ToolCallCard name="read_file" status="success" duration="80ms" args={{ path: 'notes/q3.md' }}>
            {'Q3 retention held at 91%.\nTop mover: self-serve annual plans.'}
          </ToolCallCard>
        </div>
      ),
    },
    {
      name: 'Retry on error',
      code: `<ToolCallCard name="send_email" status="error" error="SMTP 550: mailbox unavailable" args={{ to: 'dana@northwind.example' }} onRetry={retry} />`,
      Component: () => (
        <div style={{ maxWidth: 640 }}>
          <Retry />
        </div>
      ),
    },
    {
      name: 'Group',
      code: `<ToolCallGroup>
  <ToolCallCard name="query_warehouse" status="success" durationMs={1240} />
  <ToolCallCard name="web_search" status="success" durationMs={900} />
  <ToolCallCard name="send_email" status="error" error="SMTP 550" />
</ToolCallGroup>`,
      Component: () => (
        <div style={{ maxWidth: 640 }}>
          <ToolCallGroup defaultOpen>
            <ToolCallCard name="query_warehouse" icon={<Database size={13} />} summary="Queried closed-won deals" status="success" durationMs={1240} args={args} result={result} />
            <ToolCallCard name="web_search" icon={<Search size={13} />} summary="Searched competitor pricing" status="success" durationMs={900} args={{ q: 'crm pricing 2026' }} />
            <ToolCallCard name="send_email" icon={<Mail size={13} />} summary="Could not send the summary" status="error" args={{ to: 'dana@northwind.example', timeout_ms: 8000 }} error="SMTP 550: mailbox unavailable" onRetry={() => {}} />
          </ToolCallGroup>
        </div>
      ),
    },
  ],
};

export default demo;
