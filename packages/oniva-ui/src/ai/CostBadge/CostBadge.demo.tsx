import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../../components/Button';
import { CostBadge, UsageMeter } from './CostBadge';

function Live() {
  const [spent, setSpent] = useState(312.4);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 380, width: '100%' }}>
      <UsageMeter
        spent={spent}
        budget={500}
        period="Oct 1 - Oct 31"
        breakdown={[
          { label: 'Sonnet 4.5', value: spent * 0.62 },
          { label: 'GPT-5', value: spent * 0.28 },
          { label: 'Embeddings', value: spent * 0.1 },
        ]}
      />
      <Button size="sm" variant="secondary" onPress={() => setSpent((s) => (s > 450 ? 312.4 : s + 64.8))}>
        Simulate usage
      </Button>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Cost badge & usage meter',
    slug: 'cost-badge',
    category: 'AI & Agent',
    description: 'Inline cost + token chip for messages, and a budget meter with an animated spend figure.',
  },
  demos: [
    {
      name: 'Badge',
      code: `<CostBadge cost={0.043} tokens={12400} />`,
      Component: () => (
        <div style={{ display: 'flex', gap: 8 }}>
          <CostBadge cost={0.043} tokens={12400} />
          <CostBadge cost={0.612} tokens={184000} />
        </div>
      ),
    },
    {
      name: 'Usage meter',
      code: `<UsageMeter spent={312.4} budget={500} period="Oct 1 - Oct 31" breakdown={[...]} />`,
      Component: Live,
    },
  ],
};

export default demo;
