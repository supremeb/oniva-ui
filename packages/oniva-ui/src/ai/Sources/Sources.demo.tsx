import type { DemoModule } from '../../internal/demo';
import { Sources, type SourceItem } from './Sources';

const sources: SourceItem[] = [
  { title: 'SaaS retention benchmarks 2026', url: 'https://www.bvp.com/atlas/retention' },
  { title: 'Q3 earnings roundup', url: 'https://www.reuters.com/markets/q3' },
  { title: 'Net revenue retention explained', url: 'https://www.saastr.com/nrr' },
  { title: 'Cohort analysis in SQL', url: 'https://mode.com/sql-tutorial/cohorts' },
  { title: 'Churn in B2B SaaS', url: 'https://www.profitwell.com/churn' },
  { title: 'Expansion revenue playbook', url: 'https://openviewpartners.com/expansion' },
];

const demo: DemoModule = {
  meta: {
    title: 'Sources',
    slug: 'sources',
    category: 'AI & Agent',
    description: 'Collapsible "Used N sources" list with stacked favicons.',
  },
  demos: [
    {
      name: 'Collapsed',
      code: `<Sources sources={sources} />`,
      Component: () => <Sources sources={sources} />,
    },
    {
      name: 'Open by default',
      code: `<Sources sources={sources} defaultOpen />`,
      Component: () => <Sources sources={sources} defaultOpen />,
    },
  ],
};

export default demo;
