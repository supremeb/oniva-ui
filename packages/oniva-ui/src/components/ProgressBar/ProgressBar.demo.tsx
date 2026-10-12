import type { DemoModule } from '../../internal/demo';
import { ProgressBar } from './ProgressBar';
import { ProgressSegments } from './ProgressSegments';

const col = { display: 'grid', gap: 20, maxWidth: 440, width: '100%' } as const;

const demo: DemoModule = {
  meta: {
    title: 'Progress bar',
    slug: 'progress-bar',
    category: 'Feedback',
    description:
      'Determinate, indeterminate and multi-segment progress built on React Aria ProgressBar.',
  },
  demos: [
    {
      name: 'Basic',
      code: `<ProgressBar label="Storage used" value={64} showValue />
<ProgressBar label="Quarter goal" value={92} tone="success" showValue />
<ProgressBar label="Budget" value={88} tone="warning" showValue />
<ProgressBar aria-label="Syncing" isIndeterminate />`,
      Component: () => (
        <div style={col}>
          <ProgressBar label="Storage used" value={64} showValue />
          <ProgressBar label="Quarter goal" value={92} tone="success" showValue />
          <ProgressBar label="Budget" value={88} tone="warning" showValue />
          <ProgressBar aria-label="Syncing" isIndeterminate />
        </div>
      ),
    },
    {
      name: 'Multi-segment (context window)',
      code: `<ProgressSegments
  title="Context window"
  max={1_000_000}
  segments={[
    { id: 'sys', label: 'System', value: 120_000, display: '120k', color: 'c4' },
    { id: 'msg', label: 'Messages', value: 500_000, display: '500k', color: 'c1' },
    { id: 'files', label: 'Files', value: 200_000, display: '200k', color: 'c5' },
  ]}
/>`,
      Component: () => (
        <div style={col}>
          <ProgressSegments
            title="Context window"
            max={1_000_000}
            summary="820k / 1M (82%)"
            segments={[
              { id: 'sys', label: 'System', value: 120_000, display: '120k', color: 'c4' },
              { id: 'msg', label: 'Messages', value: 500_000, display: '500k', color: 'c1' },
              { id: 'files', label: 'Files', value: 200_000, display: '200k', color: 'c5' },
            ]}
          />
        </div>
      ),
    },
    {
      name: 'Sizes',
      code: `<ProgressBar aria-label="sm" size="sm" value={40} />
<ProgressBar aria-label="md" size="md" value={40} />
<ProgressBar aria-label="lg" size="lg" value={40} />`,
      Component: () => (
        <div style={col}>
          <ProgressBar aria-label="sm" size="sm" value={40} />
          <ProgressBar aria-label="md" size="md" value={40} />
          <ProgressBar aria-label="lg" size="lg" value={40} />
        </div>
      ),
    },
  ],
};
export default demo;
