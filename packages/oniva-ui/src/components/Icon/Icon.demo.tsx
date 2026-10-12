import { Bell, CreditCard, ShieldCheck, TriangleAlert } from 'lucide-react';
import type { DemoModule } from '../../internal/demo';
import { Icon } from './Icon';

const row = { display: 'flex', gap: 16, alignItems: 'center' } as const;

const demo: DemoModule = {
  meta: {
    title: 'Icon',
    slug: 'icon',
    category: 'Primitives',
    description: 'Lucide wrapper with size and tone tokens. Decorative unless labelled.',
  },
  demos: [
    {
      name: 'Sizes',
      code: `<Icon icon={Bell} size="xs" />
<Icon icon={Bell} size="sm" />
<Icon icon={Bell} size="md" />
<Icon icon={Bell} size="lg" />
<Icon icon={Bell} size="xl" />`,
      Component: () => (
        <div style={row}>
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
            <Icon key={s} icon={Bell} size={s} />
          ))}
        </div>
      ),
    },
    {
      name: 'Tones',
      code: `<Icon icon={CreditCard} tone="muted" />
<Icon icon={ShieldCheck} tone="success" />
<Icon icon={TriangleAlert} tone="warning" label="Payment overdue" />`,
      Component: () => (
        <div style={row}>
          <Icon icon={CreditCard} tone="muted" size="lg" />
          <Icon icon={ShieldCheck} tone="success" size="lg" />
          <Icon icon={TriangleAlert} tone="warning" size="lg" label="Payment overdue" />
        </div>
      ),
    },
  ],
};
export default demo;
