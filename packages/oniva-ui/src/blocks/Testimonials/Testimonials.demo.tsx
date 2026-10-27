import type { DemoModule } from '../../internal/demo';
import { Testimonials } from './Testimonials';

const demo: DemoModule = {
  meta: {
    title: 'Testimonials',
    slug: 'testimonials',
    category: 'Blocks',
    description: 'Customer quotes as a staggered grid, a single-quote carousel, or an endless wall of columns that ease to a stop on hover and scrub with inertia.',
  },
  demos: [
    { name: 'Grid', code: `<Testimonials />`, Component: () => <Testimonials /> },
    { name: 'Carousel', code: `<Testimonials variant="carousel" />`, Component: () => <Testimonials variant="carousel" /> },
    { name: 'Wall', code: `<Testimonials variant="wall" speed={26} />`, Component: () => <Testimonials variant="wall" speed={26} /> },
  ],
};
export default demo;
