import type { DemoModule } from '../../internal/demo';
import { FAQ } from './FAQ';

const demo: DemoModule = {
  meta: {
    title: 'FAQ',
    slug: 'faq',
    category: 'Blocks',
    description: 'Frequently asked questions in an accessible accordion.',
  },
  demos: [
    { name: 'Default', code: `<FAQ />`, Component: () => <FAQ /> },
    { name: 'Custom items', code: `<FAQ title="Billing" items={[{ question: 'Can I cancel?', answer: 'Anytime.' }]} />`, Component: () => <FAQ title="Billing" items={[{ question: 'Can I cancel?', answer: 'Anytime, from Settings. You keep access until the period ends.' }]} /> },
  ],
};
export default demo;
