import type { DemoModule } from '../../internal/demo';
import { SiteHeader } from './SiteHeader';

const demo: DemoModule = {
  meta: {
    title: 'Site header',
    slug: 'site-header',
    category: 'Blocks',
    description: 'Marketing header with a mega menu (origin-aware popover) and a collapsing mobile menu.',
  },
  demos: [
    { name: 'With mega menu', code: `<SiteHeader />`, Component: () => <SiteHeader /> },
    { name: 'Simple', code: `<SiteHeader megaMenu={false} />`, Component: () => <SiteHeader megaMenu={false} /> },
  ],
};
export default demo;
