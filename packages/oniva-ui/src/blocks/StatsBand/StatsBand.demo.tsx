import type { DemoModule } from '../../internal/demo';
import { StatsBand } from './StatsBand';

const demo: DemoModule = {
  meta: {
    title: 'Stats band',
    slug: 'stats-band',
    category: 'Blocks',
    description: 'Headline metrics that roll up from zero when scrolled into view.',
  },
  demos: [
    { name: 'Default', code: `<StatsBand />`, Component: () => <StatsBand /> },
    { name: 'Custom stats', code: `<StatsBand stats={[{ label: 'Uptime', value: 0.9999, format: { style: 'percent', minimumFractionDigits: 2 } }]} />`, Component: () => <StatsBand stats={[{ label: 'Uptime', value: 0.9999, format: { style: 'percent', minimumFractionDigits: 2 } }, { label: 'Regions', value: 12 }]} /> },
  ],
};
export default demo;
