import type { DemoModule } from '../../internal/demo';
import { Hero } from './Hero';

const demo: DemoModule = {
  meta: {
    title: 'Hero',
    slug: 'hero',
    category: 'Blocks',
    description: 'Landing-page hero in four variants: centered, split with product shot, email signup and dashboard preview.',
  },
  demos: [
    { name: 'Centered', code: `<Hero />`, Component: () => <Hero /> },
    { name: 'Split with product shot', code: `<Hero variant="split" />`, Component: () => <Hero variant="split" /> },
    { name: 'Signup', code: `<Hero variant="signup" primaryLabel="Get started" />`, Component: () => <Hero variant="signup" primaryLabel="Get started" /> },
    { name: 'Dashboard preview', code: `<Hero variant="dashboard" />`, Component: () => <Hero variant="dashboard" /> },
  ],
};
export default demo;
