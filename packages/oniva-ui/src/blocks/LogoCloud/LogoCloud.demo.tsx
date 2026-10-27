import type { DemoModule } from '../../internal/demo';
import { LogoCloud } from './LogoCloud';

const demo: DemoModule = {
  meta: {
    title: 'Logo cloud',
    slug: 'logo-cloud',
    category: 'Blocks',
    description: 'Customer logos as a grid or an endless marquee that eases to a stop on hover, scrubs with inertia and goes static under reduced motion.',
  },
  demos: [
    { name: 'Grid', code: `<LogoCloud />`, Component: () => <LogoCloud /> },
    { name: 'Marquee, two rows', code: `<LogoCloud variant="marquee" rows={2} caption="Trusted by teams at" speed={34} />`, Component: () => <LogoCloud variant="marquee" rows={2} caption="Trusted by teams at" speed={34} /> },
    { name: 'One row', code: `<LogoCloud variant="marquee" />`, Component: () => <LogoCloud variant="marquee" /> },
    { name: 'Two rows, reversed', code: `<LogoCloud variant="marquee" rows={2} speed={32} direction="right" />`, Component: () => <LogoCloud variant="marquee" rows={2} speed={32} direction="right" /> },
  ],
};
export default demo;
