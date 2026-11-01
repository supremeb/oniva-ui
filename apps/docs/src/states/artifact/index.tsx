import { Artifact, Badge } from 'oniva-ui';
import type { ReactNode } from 'react';
import type { StateModule } from '../types';

const memo = `Q3 retention summary

- Net revenue retention: 112% (+3 pts QoQ)
- SMB logo churn: 2.1%, down from 2.9%
- Expansion led by the Team plan upgrade path (184k ARR)

Next: segment churn by acquisition channel.`;

const longMemo = Array.from({ length: 5 }, (_, i) => `Section ${i + 1}. Northwind Labs accounts on the Team plan expanded by ${12 + i * 3}% over the quarter, driven by seat growth in the EMEA region and a steady shift from monthly to annual billing. Churn held at ${(2.1 + i * 0.1).toFixed(1)}% across the SMB segment.`).join('\n\n');

const longUrl = 'https://northwind-labs.example/reports/2026/q3/retention/segments/acquisition-channel/organic-search-and-referral-breakdown-final-v3.pdf';

function Body({ children }: { children: ReactNode }) {
  return <p style={{ margin: 0, whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: '20px' }}>{children}</p>;
}

const noop = () => undefined;
const full = { version: 'v3', copyText: memo, onDownload: noop, onShare: noop, onClose: noop };

const mod: StateModule = {
  slug: 'artifact',
  title: 'Artifact',
  width: 460,
  groups: [
    {
      label: 'Visibility',
      states: [
        { id: 'open', label: 'open, all actions', render: () => <Artifact open title="Q3 retention summary" {...full}><Body>{memo}</Body></Artifact> },
        { id: 'closed', label: 'closed (renders nothing)', render: () => <Artifact open={false} title="Q3 retention summary" {...full}><Body>{memo}</Body></Artifact> },
      ],
    },
    {
      label: 'Header',
      states: [
        { id: 'title-only', label: 'title only', render: () => <Artifact open title="Q3 retention summary"><Body>{memo}</Body></Artifact> },
        { id: 'with-version', label: 'version badge', render: () => <Artifact open title="Q3 retention summary" version="v3"><Body>{memo}</Body></Artifact> },
        { id: 'copy-only', label: 'copy only', render: () => <Artifact open title="Q3 retention summary" copyText={memo}><Body>{memo}</Body></Artifact> },
        { id: 'download-share', label: 'download and share', render: () => <Artifact open title="Q3 retention summary" version="v3" onDownload={noop} onShare={noop}><Body>{memo}</Body></Artifact> },
        { id: 'close-only', label: 'close only', render: () => <Artifact open title="Q3 retention summary" onClose={noop}><Body>{memo}</Body></Artifact> },
        {
          id: 'custom-actions',
          label: 'custom actions slot',
          render: () => (
            <Artifact open title="Q3 retention summary" version="v3" copyText={memo} onClose={noop} actions={<Badge variant="success">Published</Badge>}>
              <Body>{memo}</Body>
            </Artifact>
          ),
        },
        {
          id: 'long-title',
          label: 'long title truncates',
          render: () => (
            <Artifact open title="Q3 2026 retention and expansion summary for the Northwind Labs enterprise accounts review" {...full}>
              <Body>{memo}</Body>
            </Artifact>
          ),
        },
        {
          id: 'long-version',
          label: 'long version tag',
          render: () => (
            <Artifact open title="Q3 retention summary" {...full} version="v12-draft-2026-10-31">
              <Body>{memo}</Body>
            </Artifact>
          ),
        },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'empty', label: 'no children', render: () => <Artifact open title="Untitled document" version="v1" onClose={noop} /> },
        { id: 'short', label: 'short body', render: () => <Artifact open title="Release note" {...full} copyText="Shipped."><Body>Shipped.</Body></Artifact> },
        { id: 'long-scroll', label: 'long body scrolls', render: () => (
          <div style={{ height: 360, display: 'flex' }}>
            <Artifact open title="Q3 retention summary" {...full}><Body>{longMemo}</Body></Artifact>
          </div>
        ) },
        { id: 'long-unbroken', label: 'long unbroken URL', render: () => <Artifact open title="Q3 retention summary" {...full}><Body>{longUrl}</Body></Artifact> },
        {
          id: 'rich-content',
          label: 'code content',
          render: () => (
            <Artifact open title="retry-schedule.ts" version="v2" copyText="export const retry = 3;" onDownload={noop} onClose={noop}>
              <pre style={{ margin: 0, fontSize: 12, lineHeight: '18px', overflow: 'auto' }}>{`export function nextDelay(attempt: number) {
  const base = 250 * 2 ** attempt;
  return Math.min(base, 30_000);
}`}</pre>
            </Artifact>
          ),
        },
      ],
    },
    {
      label: 'Layout',
      states: [
        { id: 'narrow', label: 'narrow container (max-width 100%)', render: () => <div style={{ width: 300 }}><Artifact open title="Q3 retention summary" {...full}><Body>{memo}</Body></Artifact></div> },
      ],
    },
  ],
  missing: [
    'Loading or generating state (no pending/streaming prop)',
    'Error state (no error prop)',
    'Copied confirmation (reached only by pressing Copy)',
    'Entering and exiting animation frames (transient)',
  ],
};
export default mod;
