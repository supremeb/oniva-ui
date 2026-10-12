import type { DemoModule } from '../../internal/demo';
import { FeatureBento } from './FeatureBento';

const demo: DemoModule = {
  meta: {
    title: 'Feature bento',
    slug: 'feature-bento',
    category: 'Blocks',
    description: 'Asymmetric bento grid of nested cards. Cells fade up once as they scroll into view.',
  },
  demos: [{ name: 'Default', code: `<FeatureBento />`, Component: () => <FeatureBento /> }],
};
export default demo;
