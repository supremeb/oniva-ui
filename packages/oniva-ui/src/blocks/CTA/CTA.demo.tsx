import type { DemoModule } from '../../internal/demo';
import { CTA } from './CTA';

const demo: DemoModule = {
  meta: {
    title: 'CTA',
    slug: 'cta',
    category: 'Blocks',
    description: 'Closing call-to-action panel on a tinted accent surface.',
  },
  demos: [
    { name: 'Default', code: `<CTA />`, Component: () => <CTA /> },
    { name: 'Custom copy', code: `<CTA title="Ready when you are" primaryLabel="Book a demo" secondaryLabel="Read the docs" />`, Component: () => <CTA title="Ready when you are" primaryLabel="Book a demo" secondaryLabel="Read the docs" /> },
  ],
};
export default demo;
