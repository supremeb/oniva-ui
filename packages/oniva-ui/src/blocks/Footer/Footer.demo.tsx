import type { DemoModule } from '../../internal/demo';
import { Footer } from './Footer';

const demo: DemoModule = {
  meta: {
    title: 'Footer',
    slug: 'footer',
    category: 'Blocks',
    description: 'Site footer with brand blurb, link columns and legal row.',
  },
  demos: [{ name: 'Default', code: `<Footer />`, Component: () => <Footer /> }],
};
export default demo;
