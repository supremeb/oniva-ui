import type { DemoModule } from '../../internal/demo';
import { SmartRecommendation, type Recommendation } from './SmartRecommendation';

const options: Recommendation[] = [
  { id: 'incremental', label: 'incremental sync', reason: (
      <>
        Only 4% of rows changed since yesterday, so switching to{' '}
        <strong style={{ color: 'var(--oniva-color-text)', fontWeight: 500 }}>incremental sync</strong> saves about 40 minutes.
      </>
    ), signal: 3 },
  { id: 'full', label: 'full refresh', reason: 'Rebuilds every table from scratch. Safe, but takes roughly 45 minutes.', signal: 1 },
  { id: 'paused', label: 'paused sync', reason: 'Wait for the upstream schema change to land before syncing again.', signal: 2 },
];

const demo: DemoModule = {
  meta: {
    title: 'Smart recommendation',
    slug: 'smart-recommendation',
    category: 'AI & Agent',
    description: 'Suggestion card with a confidence signal, alternatives to switch to, and accept with undo.',
  },
  demos: [
    {
      name: 'Default',
      code: `<SmartRecommendation
  options={[
    { id: 'incremental', label: 'incremental sync', reason: 'Only 4% of rows changed.', signal: 3 },
    { id: 'full', label: 'full refresh', reason: 'Rebuilds every table.', signal: 1 },
  ]}
  onAccept={(o) => api.setMode(o.id)}
  onUndo={(o) => api.revert(o.id)}
/>`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 460 }}>
          <SmartRecommendation options={options} title="Recommended sync mode" />
        </div>
      ),
    },
    {
      name: 'Folded',
      code: `<SmartRecommendation options={options} defaultOpen={false} />`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 460 }}>
          <SmartRecommendation options={options} defaultOpen={false} />
        </div>
      ),
    },
  ],
};

export default demo;
