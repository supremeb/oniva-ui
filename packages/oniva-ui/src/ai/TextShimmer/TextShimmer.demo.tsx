import type { DemoModule } from '../../internal/demo';
import { TextShimmer } from './TextShimmer';

const demo: DemoModule = {
  meta: {
    title: 'Text shimmer',
    slug: 'text-shimmer',
    category: 'AI & Agent',
    description:
      'Loading label with a moving highlight. Falls back to static muted text when reduced motion is on.',
  },
  demos: [
    {
      name: 'Thinking label',
      code: `<TextShimmer>Thinking…</TextShimmer>`,
      Component: () => (
        <div style={{ fontSize: 15, fontWeight: 500 }}>
          <TextShimmer>Thinking…</TextShimmer>
        </div>
      ),
    },
    {
      name: 'Status lines',
      code: `<TextShimmer>Searching the web for Q3 revenue benchmarks</TextShimmer>
<TextShimmer>Reading 4 sources</TextShimmer>`,
      Component: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
          <TextShimmer>Searching the web for Q3 revenue benchmarks</TextShimmer>
          <TextShimmer>Reading 4 sources</TextShimmer>
        </div>
      ),
    },
  ],
};

export default demo;
