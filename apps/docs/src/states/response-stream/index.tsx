import { ResponseStream } from 'oniva-ui';
import type { StateModule } from '../types';

const summary =
  'Q3 revenue landed at $4.82M, up 14.2% quarter over quarter. Enterprise renewals carried most of the growth, while self-serve churn ticked up slightly in September.';

const longAnswer = [
  'Here is what changed between the 2.3.0 and 2.4.0 builds of the Northwind scheduler.',
  'The retry queue now uses decorrelated jitter, which cut the p95 redelivery delay from 41s to 12s in the staging run on 14 March. Workers pick up delayed jobs in batches of 64, and the batch size is configurable through queue.config.json.',
  'Two follow-ups remain: the dead-letter sweep still runs hourly instead of every five minutes, and the dashboard counts cancelled jobs as failed. Both are tracked in NW-2214 and NW-2231.',
].join('\n\n');

const longUnbroken =
  'The failing request was GET https://api.northwind.example/v2/workspaces/ws_8f3a91c2d7/projects/prj_44b1e0a9/deployments/dpl_2026_03_14T09_41_22Z_rollback_candidate_7/artifacts/build-output-manifest.json?include=checksums,signatures&cursor=eyJwYWdlIjoxMiwic2l6ZSI6MjAwfQ and the worker log is at /var/log/northwind/queue/workers/scheduler-exponential-backoff-decorrelated-jitter-worker-00042.log.';

const mod: StateModule = {
  slug: 'response-stream',
  title: 'Response stream',
  width: 720,
  groups: [
    {
      label: 'Run',
      states: [
        {
          id: 'pending',
          label: 'pending (nothing revealed yet)',
          render: () => <ResponseStream text={summary} intervalMs={3_600_000} />,
        },
        {
          id: 'complete',
          label: 'complete',
          render: () => <ResponseStream text={summary} instant />,
        },
        {
          id: 'complete-paragraphs',
          label: 'complete, three paragraphs',
          render: () => <ResponseStream text={longAnswer} instant />,
        },
        {
          id: 'pending-custom-render',
          label: 'pending, custom render',
          render: () => (
            <ResponseStream
              text={summary}
              intervalMs={3_600_000}
              render={(visible, done) => <span data-done={done}>{visible || '​'}</span>}
            />
          ),
        },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'empty-text', label: 'empty text', render: () => <ResponseStream text="" /> },
        { id: 'one-word', label: 'one word', render: () => <ResponseStream text="Done." instant /> },
        {
          id: 'long-unbroken',
          label: 'long URL and file path',
          render: () => <ResponseStream text={longUnbroken} instant />,
        },
        {
          id: 'custom-render',
          label: 'custom render (list)',
          render: () => (
            <ResponseStream
              text={'Top accounts by expansion\nNorthwind Labs +$212k\nHarbor & Finch +$96k\nLumen Freight +$64k'}
              instant
              render={(visible) => {
                const [title = '', ...rows] = visible.split('\n');
                return (
                  <div>
                    <strong>{title}</strong>
                    <ul>
                      {rows.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                );
              }}
            />
          ),
        },
      ],
    },
  ],
  missing: [
    'Frozen mid-stream frame (the reveal is driven by an internal timer, so a partial frame cannot be held still)',
    'Error / cancelled stream (the component has no status prop; it only reveals text)',
  ],
};
export default mod;
