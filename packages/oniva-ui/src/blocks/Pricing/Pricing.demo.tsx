import type { DemoModule } from '../../internal/demo';
import { Pricing, type PricingPlan } from './Pricing';

const compactPlans: PricingPlan[] = [
  { name: 'Starter', monthly: 29, yearly: 24, description: '', features: ['Unlimited dashboards', 'Scheduled reports', 'Email support'], excluded: ['Custom domains', 'API access', 'SSO'], cta: 'Start free trial', limits: [{ label: 'Monthly visitors', value: '10k' }, { label: 'Seats', value: '2' }, { label: 'Workspaces', value: '1' }], details: ['Hourly sync'] },
  { name: 'Growth', monthly: 99, yearly: 79, description: '', features: ['Unlimited dashboards', 'Custom domains', 'API access', 'Scheduled reports', 'Chat and email support'], excluded: ['SSO'], cta: 'Start free trial', featured: true, limits: [{ label: 'Monthly visitors', value: '100k' }, { label: 'Seats', value: '10' }, { label: 'Workspaces', value: '3' }], details: ['Sync every 15 min'] },
  { name: 'Scale', monthly: 249, yearly: 199, description: '', features: ['Unlimited dashboards', 'Custom domains', 'API access', 'Scheduled reports', 'Dedicated onboarding', 'Priority support'], excluded: ['SSO'], cta: 'Start free trial', limits: [{ label: 'Monthly visitors', value: '1M' }, { label: 'Seats', value: 'Unlimited' }, { label: 'Workspaces', value: '10' }], details: ['Real-time sync'] },
];

const demo: DemoModule = {
  meta: {
    title: 'Pricing',
    slug: 'pricing',
    category: 'Blocks',
    description: 'Three-tier pricing with a monthly/yearly toggle, limit tiles, excluded features and foldable details; prices roll with AnimatedNumber.',
  },
  demos: [
    { name: 'Compact plan cards', code: `<Pricing variant="compact" title="Choose your plan" subtitle="Find the right plan for your team. Start with a 14-day free trial." plans={plans} />`, Component: () => <Pricing variant="compact" title="Choose your plan" subtitle="Find the right plan for your team. Start with a 14-day free trial." plans={compactPlans} /> },
    { name: 'Monthly', code: `<Pricing />`, Component: () => <Pricing /> },
    { name: 'Starts on yearly', code: `<Pricing defaultBilling="yearly" />`, Component: () => <Pricing defaultBilling="yearly" /> },
  ],
};
export default demo;
