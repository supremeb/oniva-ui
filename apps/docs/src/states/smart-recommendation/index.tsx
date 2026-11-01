import { SmartRecommendation } from 'oniva-ui';
import type { Recommendation } from 'oniva-ui';
import type { StateModule } from '../types';

const sync: Recommendation[] = [
  {
    id: 'incremental',
    label: 'Incremental sync',
    reason: 'Only 4% of rows changed since yesterday, so switching to incremental sync saves about 40 minutes.',
    signal: 3,
  },
  { id: 'full', label: 'Full refresh', reason: 'Rebuilds every table from scratch. Safe, but takes roughly 45 minutes.', signal: 1 },
  { id: 'paused', label: 'Paused sync', reason: 'Wait for the upstream schema change to land before syncing again.', signal: 2 },
];

const withSignal = (signal: Recommendation['signal']): Recommendation[] => [
  { ...sync[0]!, signal },
  sync[1]!,
];

const long: Recommendation[] = [
  {
    id: 'long',
    label: 'Migrate northwind-orders-archive-2024-q3 to the cold storage tier',
    reason:
      'The Northwind Labs orders archive has not been read in 94 days and holds 2.8 TB across 1,412 partitions. Moving it to cold storage cuts the monthly bill by about 310 dollars, and the nightly restore test showed a median retrieval time of 11 minutes for the last three requests. Reads stay possible, only slower.',
    signal: 2,
  },
  sync[1]!,
];

const unbroken: Recommendation[] = [
  {
    id: 'path',
    label: 'warehouse/northwind/orders/2024/09/partition-00412-of-01412.parquet',
    reason:
      'Re-run the compaction for s3://northwind-labs-analytics-prod.example/warehouse/orders/2024/09/partition-00412-of-01412-compacted-v3.parquet.',
    signal: 3,
  },
  sync[1]!,
];

const mod: StateModule = {
  slug: 'smart-recommendation',
  title: 'Smart recommendation',
  width: 440,
  groups: [
    {
      label: 'Signal',
      states: [
        { id: 'strong', label: 'strong signal', render: () => <SmartRecommendation options={withSignal(3)} title="Recommended sync mode" /> },
        { id: 'good', label: 'good signal', render: () => <SmartRecommendation options={withSignal(2)} title="Recommended sync mode" /> },
        { id: 'weak', label: 'weak signal', render: () => <SmartRecommendation options={withSignal(1)} title="Recommended sync mode" /> },
        { id: 'none', label: 'no signal', render: () => <SmartRecommendation options={withSignal(0)} title="Recommended sync mode" /> },
      ],
    },
    {
      label: 'Options',
      states: [
        { id: 'single', label: 'one option, no alternatives', render: () => <SmartRecommendation options={[sync[0]!]} title="Recommended sync mode" /> },
        { id: 'three', label: 'three options', render: () => <SmartRecommendation options={sync} title="Recommended sync mode" /> },
        { id: 'default-title', label: 'default title', render: () => <SmartRecommendation options={sync} /> },
        { id: 'empty', label: 'no options (renders nothing)', render: () => <SmartRecommendation options={[]} /> },
      ],
    },
    {
      label: 'Fold',
      states: [
        { id: 'folded', label: 'folded', render: () => <SmartRecommendation options={sync} defaultOpen={false} title="Recommended sync mode" /> },
        { id: 'folded-single', label: 'folded, one option', render: () => <SmartRecommendation options={[sync[0]!]} defaultOpen={false} /> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'long-text', label: 'long label and reason', render: () => <SmartRecommendation options={long} title="Recommended archive tier" /> },
        { id: 'unbroken', label: 'long unbroken path', render: () => <SmartRecommendation options={unbroken} title="Recommended compaction" /> },
        {
          id: 'rich-reason',
          label: 'rich reason',
          render: () => (
            <SmartRecommendation
              title="Recommended sync mode"
              options={[
                {
                  id: 'rich',
                  label: 'Incremental sync',
                  reason: (
                    <>
                      Only <strong>4%</strong> of rows changed, so <code>incremental</code> saves about 40 minutes.
                    </>
                  ),
                  signal: 3,
                },
              ]}
            />
          ),
        },
        {
          id: 'long-title',
          label: 'long title',
          render: () => <SmartRecommendation options={sync} title="Recommended sync mode for the Northwind Labs nightly orders pipeline" />,
        },
      ],
    },
  ],
  missing: [
    'accepted (needs a click; no prop sets it)',
    'alternative chosen (needs the menu; no prop sets it)',
    'loading / pending recommendation (no such prop)',
  ],
};

export default mod;
