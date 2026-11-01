import type { DemoModule } from '../../internal/demo';
import { Sources, type SourceItem } from './Sources';

const sources: SourceItem[] = [
  { title: 'SaaS retention benchmarks 2026', url: 'https://www.northwind.example/research/retention' },
  { title: 'Q3 earnings roundup', url: 'https://markets.example/reports/q3' },
  { title: 'Net revenue retention explained', url: 'https://blog.ledgerly.example/nrr' },
  { title: 'Cohort analysis in SQL', url: 'https://docs.querybench.example/tutorials/cohorts' },
  { title: 'Churn in B2B SaaS', url: 'https://www.pricewise.example/churn' },
  { title: 'Expansion revenue playbook', url: 'https://growthnotes.example/expansion' },
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
