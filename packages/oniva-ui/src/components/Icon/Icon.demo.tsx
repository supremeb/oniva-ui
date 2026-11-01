import { BellIcon, CreditCardIcon, ShieldCheckIcon, TriangleAlertIcon } from '../../icons/IconSet';
import type { DemoModule } from '../../internal/demo';
import { Icon } from './Icon';

const row = { display: 'flex', gap: 16, alignItems: 'center' } as const;

const demo: DemoModule = {
  meta: {
    title: 'Icon',
    slug: 'icon',
    category: 'Primitives',
    description: 'Glyph wrapper with size, tone and style tokens. Decorative unless labelled.',
  },
  demos: [
    {
      name: 'Sizes',
      code: `<Icon icon={BellIcon} size="xs" />
<Icon icon={BellIcon} size="sm" />
<Icon icon={BellIcon} size="md" />
<Icon icon={BellIcon} size="lg" />
<Icon icon={BellIcon} size="xl" />`,
      Component: () => (
        <div style={row}>
          {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((s) => (
            <Icon key={s} icon={BellIcon} size={s} />
          ))}
        </div>
      ),
    },
    {
      name: 'Tones',
      code: `<Icon icon={CreditCardIcon} tone="muted" />
<Icon icon={ShieldCheckIcon} tone="success" />
<Icon icon={TriangleAlertIcon} tone="warning" label="Payment overdue" />`,
      Component: () => (
        <div style={row}>
          <Icon icon={CreditCardIcon} tone="muted" size="lg" />
          <Icon icon={ShieldCheckIcon} tone="success" size="lg" />
          <Icon icon={TriangleAlertIcon} tone="warning" size="lg" label="Payment overdue" />
        </div>
      ),
    },
  ],
};
export default demo;
