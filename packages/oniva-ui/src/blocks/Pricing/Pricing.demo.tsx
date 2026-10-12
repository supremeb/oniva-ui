import type { DemoModule } from '../../internal/demo';
import { Pricing } from './Pricing';

const demo: DemoModule = {
  meta: {
    title: 'Pricing',
    slug: 'pricing',
    category: 'Blocks',
    description: 'Three-tier pricing with a monthly/yearly toggle; prices roll between values with AnimatedNumber.',
  },
  demos: [
    { name: 'Monthly', code: `<Pricing />`, Component: () => <Pricing /> },
    { name: 'Starts on yearly', code: `<Pricing defaultBilling="yearly" />`, Component: () => <Pricing defaultBilling="yearly" /> },
  ],
};
export default demo;
