import type { DemoModule } from '../../internal/demo';
import { Testimonials } from './Testimonials';

const demo: DemoModule = {
  meta: {
    title: 'Testimonials',
    slug: 'testimonials',
    category: 'Blocks',
    description: 'Customer quotes as a staggered grid or a single-quote carousel with previous/next controls.',
  },
  demos: [
    { name: 'Grid', code: `<Testimonials />`, Component: () => <Testimonials /> },
    { name: 'Carousel', code: `<Testimonials variant="carousel" />`, Component: () => <Testimonials variant="carousel" /> },
  ],
};
export default demo;
