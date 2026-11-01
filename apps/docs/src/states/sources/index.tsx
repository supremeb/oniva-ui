import { Sources } from 'oniva-ui';
import type { SourceItem } from 'oniva-ui';
import type { StateModule } from '../types';

const typical: SourceItem[] = [
  { title: 'SaaS retention benchmarks 2026', url: 'https://www.northwind.example/research/retention-benchmarks' },
  { title: 'Q3 earnings roundup', url: 'https://markets.example/reports/q3-earnings' },
  { title: 'Net revenue retention explained', url: 'https://blog.ledgerly.example/nrr' },
  { title: 'Cohort analysis in SQL', url: 'https://docs.querybench.example/tutorials/cohorts' },
  { title: 'Churn in B2B SaaS', url: 'https://www.pricewise.example/churn' },
  { title: 'Expansion revenue playbook', url: 'https://growthnotes.example/expansion' },
];

const long: SourceItem[] = [
  {
    title: 'A very long report title about net revenue retention, expansion cohorts and seat-based pricing across mid-market accounts in 2026',
    url: 'https://research.northwind.example/reports/2026/q3/net-revenue-retention-expansion-cohorts-seat-based-pricing/full-text.html?utm_source=newsletter&utm_medium=email',
  },
  { title: 'Short one', url: 'https://markets.example/a' },
  { title: 'Docs', url: 'https://averyveryverylongsubdomainname.internal-documentation.northwind-labs.example/guides/getting-started' },
];

const manyIcons: SourceItem[] = [
  ...typical,
  { title: 'Pricing page teardown', url: 'https://teardowns.example/pricing' },
  { title: 'Seat expansion study', url: 'https://www.atlas-insights.example/seats' },
];

const favicon =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><rect width='16' height='16' fill='%23888'/><circle cx='8' cy='8' r='4' fill='white'/></svg>";

const mod: StateModule = {
  slug: 'sources',
  title: 'Sources',
  width: 420,
  groups: [
    {
      label: 'Data',
      states: [
        { id: 'empty', label: 'empty', render: () => <Sources sources={[]} defaultOpen /> },
        { id: 'one', label: 'one source (collapsed)', render: () => <Sources sources={typical.slice(0, 1)} /> },
        { id: 'one-open', label: 'one source (open)', render: () => <Sources sources={typical.slice(0, 1)} defaultOpen /> },
        { id: 'typical', label: 'typical (collapsed)', render: () => <Sources sources={typical} /> },
        { id: 'typical-open', label: 'typical (open)', render: () => <Sources sources={typical} defaultOpen /> },
        { id: 'many', label: 'many (9, open)', render: () => <Sources sources={manyIcons} defaultOpen /> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'long-text', label: 'long titles and hosts', render: () => <Sources sources={long} defaultOpen /> },
        {
          id: 'favicons',
          label: 'favicon images',
          render: () => <Sources sources={typical.slice(0, 3).map((s) => ({ ...s, favicon }))} defaultOpen />,
        },
        {
          id: 'custom-label',
          label: 'custom label',
          render: () => <Sources sources={typical.slice(0, 3)} label="3 fuentes consultadas" defaultOpen />,
        },
        {
          id: 'duplicate-urls',
          label: 'duplicate urls',
          render: () => (
            <Sources
              sources={[
                { title: 'Retention dashboard, overview', url: 'https://markets.example/dash' },
                { title: 'Retention dashboard, cohorts tab', url: 'https://markets.example/dash' },
              ]}
              defaultOpen
            />
          ),
        },
        {
          id: 'unsafe-url',
          label: 'unsafe / malformed url',
          render: () => (
            <Sources
              sources={[
                { title: 'Script link is neutralised', url: 'javascript:alert(1)' },
                { title: 'Not a url at all', url: 'internal note' },
                { title: 'Fine', url: 'https://markets.example/ok' },
              ]}
              defaultOpen
            />
          ),
        },
      ],
    },
  ],
  missing: ['Controlled open state (only defaultOpen is exposed)', 'Loading / streaming sources', 'Per-source error or unavailable'],
};
export default mod;
