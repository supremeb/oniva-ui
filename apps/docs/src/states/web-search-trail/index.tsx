import { WebSearchTrail } from 'oniva-ui';
import type { WebSearchQuery, WebSearchSource } from 'oniva-ui';
import type { StateModule } from '../types';

const queries: WebSearchQuery[] = [
  { id: 'q1', query: 'B2B SaaS Q3 2026 revenue growth benchmarks', status: 'done', resultCount: 8 },
  { id: 'q2', query: 'net revenue retention median mid-market SaaS', status: 'done', resultCount: 12 },
  { id: 'q3', query: 'Northwind Labs pricing page changes 2026', status: 'done', resultCount: 5 },
];

const sources: WebSearchSource[] = [
  { title: 'SaaS growth benchmarks', url: 'https://benchmarks.example/saas-growth' },
  { title: 'NRR by segment', url: 'https://metrics.example/nrr' },
  { title: 'Mid-market retention report', url: 'https://reports.example/retention-2026' },
  { title: 'Northwind Labs pricing', url: 'https://northwind-labs.example/pricing' },
];

const manySources: WebSearchSource[] = Array.from({ length: 14 }, (_, i) => ({
  title: ['Quarterly benchmark digest', 'Retention cohort study', 'Pricing teardown', 'Expansion revenue guide', 'Churn analysis'][i % 5]!,
  url: `https://source${i + 1}.example/articles/${i + 1}`,
}));

const longQuery =
  'how do usage-based pricing changes affect net revenue retention for mid-market B2B SaaS companies with annual contracts between 2024 and 2026 across North America and Europe';
const longUnbroken =
  'https://northwind-labs.example/research/2026/q3/saas-benchmarks/net-revenue-retention/mid-market/annual-contracts/detailed-breakdown-by-segment-and-region';

const mod: StateModule = {
  slug: 'web-search-trail',
  title: 'Web search trail',
  width: 480,
  groups: [
    {
      label: 'Run',
      states: [
        { id: 'empty', label: 'no queries', render: () => <WebSearchTrail queries={[]} /> },
        {
          id: 'searching-first',
          label: 'first query searching',
          render: () => (
            <WebSearchTrail queries={[{ id: 'q1', query: 'B2B SaaS Q3 2026 revenue growth benchmarks', status: 'searching' }]} />
          ),
        },
        {
          id: 'searching-mixed',
          label: 'one done, one searching',
          render: () => <WebSearchTrail queries={[queries[0]!, { id: 'q2', query: 'net revenue retention median mid-market SaaS', status: 'searching' }]} />,
        },
        {
          id: 'searching-with-sources',
          label: 'searching, sources already read',
          render: () => (
            <WebSearchTrail
              queries={[queries[0]!, queries[1]!, { id: 'q3', query: 'Northwind Labs pricing page changes 2026', status: 'searching' }]}
              sources={sources.slice(0, 2)}
            />
          ),
        },
        { id: 'done', label: 'all done, no sources', render: () => <WebSearchTrail queries={queries} /> },
        { id: 'done-sources', label: 'all done with sources', render: () => <WebSearchTrail queries={queries} sources={sources} /> },
      ],
    },
    {
      label: 'Data',
      states: [
        {
          id: 'single-result',
          label: 'result counts 0 / 1 / 1,240',
          render: () => (
            <WebSearchTrail
              queries={[
                { id: 'a', query: 'obscure vendor compliance memo', status: 'done', resultCount: 0 },
                { id: 'b', query: 'Atlas 2 context window limits', status: 'done', resultCount: 1 },
                { id: 'c', query: 'SaaS churn benchmarks', status: 'done', resultCount: 1240 },
              ]}
            />
          ),
        },
        {
          id: 'no-counts',
          label: 'no result counts',
          render: () => (
            <WebSearchTrail
              queries={[
                { id: 'a', query: 'net revenue retention median', status: 'done' },
                { id: 'b', query: 'expansion revenue by segment', status: 'done' },
              ]}
            />
          ),
        },
        {
          id: 'many-queries',
          label: 'many queries',
          render: () => (
            <WebSearchTrail
              queries={Array.from({ length: 10 }, (_, i): WebSearchQuery => ({
                id: `m${i}`,
                query: ['annual contract value trends', 'SaaS gross margin benchmarks', 'customer acquisition cost payback', 'logo churn vs revenue churn', 'seat-based pricing decline'][i % 5]! + ` ${2022 + (i % 5)}`,
                status: i === 9 ? 'searching' : 'done',
                resultCount: i === 9 ? undefined : 4 + i * 3,
              }))}
              sources={sources}
            />
          ),
        },
        { id: 'many-sources', label: 'many sources (wraps)', render: () => <WebSearchTrail queries={queries} sources={manySources} /> },
        { id: 'one-source', label: 'one source', render: () => <WebSearchTrail queries={queries.slice(0, 1)} sources={sources.slice(0, 1)} /> },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'long-query',
          label: 'long query wraps',
          render: () => <WebSearchTrail queries={[{ id: 'l1', query: longQuery, status: 'done', resultCount: 23 }, { id: 'l2', query: longQuery, status: 'searching' }]} />,
        },
        {
          id: 'long-unbroken-query',
          label: 'long unbroken query (URL)',
          render: () => <WebSearchTrail queries={[{ id: 'u1', query: longUnbroken, status: 'done', resultCount: 3 }, { id: 'u2', query: longUnbroken, status: 'searching' }]} />,
        },
        {
          id: 'long-source',
          label: 'long source title and URL',
          render: () => (
            <WebSearchTrail
              queries={queries.slice(0, 1)}
              sources={[
                { title: 'A very long report title about net revenue retention across every mid-market segment and region', url: longUnbroken },
                { title: 'Short', url: 'https://metrics.example/nrr' },
              ]}
            />
          ),
        },
        {
          id: 'odd-source-urls',
          label: 'unusual source urls',
          render: () => (
            <WebSearchTrail
              queries={queries.slice(0, 1)}
              sources={[
                { title: 'Contact desk', url: 'mailto:research@northwind-labs.example' },
                { title: 'Untrusted scheme', url: 'javascript:alert(1)' },
                { title: 'No url', url: '' },
              ]}
            />
          ),
        },
      ],
    },
  ],
  missing: [
    'Error / failed query (query status is only searching | done)',
    'Cancelled or stopped search',
    'Per-query sources (sources are one flat list)',
    'Collapsed / expandable trail (no open state exposed)',
  ],
};
export default mod;
