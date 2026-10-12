import type { DemoModule } from '../../internal/demo';
import { FeatureGrid } from './FeatureGrid';

const demo: DemoModule = {
  meta: {
    title: 'Feature grid',
    slug: 'feature-grid',
    category: 'Blocks',
    description: 'Responsive grid of feature tiles with icons; tiles rise in with a short stagger.',
  },
  demos: [
    { name: 'Default', code: `<FeatureGrid />`, Component: () => <FeatureGrid /> },
    {
      name: 'Custom copy',
      code: `<FeatureGrid
  eyebrow="Security"
  title="Built for regulated teams"
  features={[{ title: 'SOC 2 Type II', description: 'Audited yearly.' }]}
/>`,
      Component: () => (
        <FeatureGrid
          eyebrow="Security"
          title="Built for regulated teams"
          features={[
            { title: 'SOC 2 Type II', description: 'Audited every year, report available on request.' },
            { title: 'Regional data', description: 'Keep traces in the US or EU, per workspace.' },
            { title: 'SSO and SCIM', description: 'Okta, Entra and Google out of the box.' },
          ]}
        />
      ),
    },
  ],
};
export default demo;
