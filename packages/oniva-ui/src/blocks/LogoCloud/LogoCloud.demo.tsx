import type { DemoModule } from '../../internal/demo';
import { LogoCloud } from './LogoCloud';

const demo: DemoModule = {
  meta: {
    title: 'Logo cloud',
    slug: 'logo-cloud',
    category: 'Blocks',
    description: 'Customer logos as a grid or an infinite marquee that pauses on hover and goes static under reduced motion.',
  },
  demos: [
    { name: 'Grid', code: `<LogoCloud />`, Component: () => <LogoCloud /> },
    { name: 'Marquee', code: `<LogoCloud variant="marquee" />`, Component: () => <LogoCloud variant="marquee" /> },
  ],
};
export default demo;
