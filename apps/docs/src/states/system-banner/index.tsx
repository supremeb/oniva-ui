import { SystemBanner } from 'oniva-ui';
import type { StateModule } from '../types';

const noop = () => {};

const longPath =
  'Could not write /workspaces/northwind-labs/reports/2026/q3/regional-breakdown/emea/quarterly-revenue-by-segment-final-v12.xlsx';
const longUrl =
  'https://warehouse.northwind-labs.example/api/v2/connectors/revenue-snapshots/regional/emea/segments?from=2026-07-01&to=2026-09-30';

const mod: StateModule = {
  slug: 'system-banner',
  title: 'System banner',
  width: 720,
  groups: [
    {
      label: 'Tone',
      states: [
        {
          id: 'info',
          label: 'info',
          render: () => <SystemBanner tone="info">Earlier messages were summarized to free up context.</SystemBanner>,
        },
        {
          id: 'success',
          label: 'success',
          render: () => <SystemBanner tone="success">Report exported to Q3-revenue.xlsx.</SystemBanner>,
        },
        {
          id: 'warning',
          label: 'warning',
          render: () => <SystemBanner tone="warning">You have used 93% of your weekly limit. Resets Fri 9:00 AM.</SystemBanner>,
        },
        {
          id: 'danger',
          label: 'danger',
          render: () => <SystemBanner tone="danger">The warehouse connector timed out after 30s.</SystemBanner>,
        },
        {
          id: 'neutral',
          label: 'neutral',
          render: () => <SystemBanner tone="neutral">Atlas 2 is now answering in this conversation.</SystemBanner>,
        },
      ],
    },
    {
      label: 'Controls',
      states: [
        {
          id: 'action',
          label: 'with action',
          render: () => (
            <SystemBanner tone="warning" actionLabel="Upgrade" onAction={noop}>
              You have used 93% of your weekly limit. Resets Fri 9:00 AM.
            </SystemBanner>
          ),
        },
        {
          id: 'dismiss',
          label: 'dismissible',
          render: () => (
            <SystemBanner tone="info" onDismiss={noop}>
              Context is 78% full. Older tool output will be summarized soon.
            </SystemBanner>
          ),
        },
        {
          id: 'action-dismiss',
          label: 'action and dismiss',
          render: () => (
            <SystemBanner tone="danger" actionLabel="Retry" onAction={noop} onDismiss={noop}>
              The warehouse connector timed out after 30s.
            </SystemBanner>
          ),
        },
        {
          id: 'action-no-handler',
          label: 'action without handler',
          render: () => (
            <SystemBanner tone="neutral" actionLabel="Switch to Nova Pro">
              Atlas 2 is at capacity right now.
            </SystemBanner>
          ),
        },
        {
          id: 'empty',
          label: 'no message',
          render: () => <SystemBanner tone="info" actionLabel="Details" onAction={noop} onDismiss={noop} />,
        },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'long-message',
          label: 'long message, wraps',
          render: () => (
            <SystemBanner tone="warning" actionLabel="Upgrade" onAction={noop} onDismiss={noop}>
              You have used 93% of your weekly limit on Nova Pro. Requests will fall back to Lumen Fast until the limit
              resets on Friday at 9:00 AM, and long-running agent tasks may be paused until then. Upgrade your plan to
              keep the current model for the rest of this conversation.
            </SystemBanner>
          ),
        },
        {
          id: 'long-path',
          label: 'unbroken path',
          render: () => (
            <SystemBanner tone="danger" actionLabel="Retry" onAction={noop} onDismiss={noop}>
              {longPath}
            </SystemBanner>
          ),
        },
        {
          id: 'long-url',
          label: 'unbroken URL',
          render: () => (
            <SystemBanner tone="info" actionLabel="Open" onAction={noop} onDismiss={noop}>
              {longUrl}
            </SystemBanner>
          ),
        },
        {
          id: 'long-action',
          label: 'long action label',
          render: () => (
            <SystemBanner tone="warning" actionLabel="Switch to Lumen Fast for this conversation" onAction={noop}>
              Nova Pro is rate limited.
            </SystemBanner>
          ),
        },
        {
          id: 'rich',
          label: 'rich children',
          render: () => (
            <SystemBanner tone="success" actionLabel="Open" onAction={noop}>
              <strong>Exported</strong> 4,218 rows to <code>q3-revenue.xlsx</code> in 2.4s.
            </SystemBanner>
          ),
        },
      ],
    },
  ],
};

export default mod;
