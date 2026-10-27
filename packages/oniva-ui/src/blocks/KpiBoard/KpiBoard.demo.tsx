import type { DemoModule } from '../../internal/demo';
import { KpiBoard } from './KpiBoard';

const demo: DemoModule = {
  meta: {
    title: 'KPI board',
    slug: 'kpi-board',
    category: 'Blocks',
    description: 'Dashboard header: three trend cards, a this-period vs last-period chart with a plan filter, and a focus card. Numbers roll when the range changes.',
  },
  demos: [
    { name: 'Default', code: `<KpiBoard />`, Component: () => <KpiBoard /> },
    {
      name: 'With action',
      code: `<KpiBoard title="Growth" defaultRange="30d" action={{ label: 'View plan', onPress: () => {} }} />`,
      Component: () => <KpiBoard title="Growth" defaultRange="30d" action={{ label: 'View plan', onPress: () => {} }} />,
    },
  ],
};
export default demo;
