import type { DemoModule } from '../../internal/demo';
import { Badge } from './Badge';

const row = { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' } as const;

const demo: DemoModule = {
  meta: {
    title: 'Badge',
    slug: 'badge',
    category: 'Data display',
    description: 'Status chips and counts with semantic color variants and an optional dot.',
  },
  demos: [
    {
      name: 'Variants',
      code: `<Badge>Neutral</Badge>
<Badge variant="accent">New</Badge>
<Badge variant="success">Shipped</Badge>
<Badge variant="warning">Waiting</Badge>
<Badge variant="danger">Delivery failed</Badge>
<Badge variant="info">In review</Badge>`,
      Component: () => (
        <div style={row}>
          <Badge>Neutral</Badge>
          <Badge variant="accent">New</Badge>
          <Badge variant="success">Shipped</Badge>
          <Badge variant="warning">Waiting</Badge>
          <Badge variant="danger">Delivery failed</Badge>
          <Badge variant="info">In review</Badge>
        </div>
      ),
    },
    {
      name: 'With dot',
      code: `<Badge dot variant="success">Active</Badge>
<Badge dot variant="warning">Pending</Badge>
<Badge dot variant="danger">Offline</Badge>`,
      Component: () => (
        <div style={row}>
          <Badge dot variant="success">
            Active
          </Badge>
          <Badge dot variant="warning">
            Pending
          </Badge>
          <Badge dot variant="danger">
            Offline
          </Badge>
        </div>
      ),
    },
    {
      name: 'Sizes and shapes',
      code: `<Badge size="sm">Small</Badge>
<Badge shape="square">12</Badge>`,
      Component: () => (
        <div style={row}>
          <Badge size="sm">Small</Badge>
          <Badge>Medium</Badge>
          <Badge shape="square">12</Badge>
        </div>
      ),
    },
  ],
};

export default demo;
