import { SourceChip } from 'oniva-ui';
import type { StateModule } from '../types';

const longTitle =
  'Net revenue retention by customer segment, cohort and contract length across 2,400 B2B subscription companies';
const longHost = 'quarterly-benchmarks-and-pricing-research.northwind-analytics-institute.example';

const mod: StateModule = {
  slug: 'source-chip',
  title: 'Source chip',
  width: 720,
  groups: [
    {
      label: 'Content',
      states: [
        {
          id: 'single',
          label: 'single source',
          render: () => <SourceChip title="SaaS growth benchmarks" url="https://www.northwind.example/atlas" />,
        },
        {
          id: 'row',
          label: 'row of sources',
          render: () => (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <SourceChip title="SaaS growth benchmarks" url="https://www.northwind.example/atlas" />
              <SourceChip title="Q3 earnings roundup" url="https://markets.example/q3-roundup" />
              <SourceChip title="NRR by segment" url="https://research.example/nrr" />
              <SourceChip title="Pricing page teardown" url="https://docs.example/pricing" />
              <SourceChip title="Churn playbook" url="https://blog.example/churn" />
            </div>
          ),
        },
        {
          id: 'long-title',
          label: 'long title',
          render: () => <SourceChip title={longTitle} url="https://research.example/nrr" />,
        },
        {
          id: 'long-host',
          label: 'long host',
          render: () => <SourceChip title="Benchmarks" url={`https://${longHost}/reports/2026`} />,
        },
        {
          id: 'long-both',
          label: 'long title and host',
          render: () => <SourceChip title={longTitle} url={`https://${longHost}/reports/2026`} />,
        },
        {
          id: 'short-title',
          label: 'one-letter title',
          render: () => <SourceChip title="Q" url="https://a.example" />,
        },
      ],
    },
    {
      label: 'Url',
      states: [
        {
          id: 'unsafe-url',
          label: 'unsafe url (no href)',
          render: () => <SourceChip title="Unsafe link" url="javascript:alert(1)" />,
        },
        {
          id: 'not-a-url',
          label: 'not a url',
          render: () => <SourceChip title="Internal note" url="notes/q3-planning" />,
        },
        {
          id: 'relative-url',
          label: 'relative path',
          render: () => <SourceChip title="Internal runbook" url="/runbooks/on-call" />,
        },
        {
          id: 'mailto',
          label: 'mailto',
          render: () => <SourceChip title="Ask the analyst" url="mailto:analyst@northwind.example" />,
        },
        {
          id: 'empty-url',
          label: 'empty url',
          render: () => <SourceChip title="Missing source" url="" />,
        },
        {
          id: 'unicode-host',
          label: 'non-latin host',
          render: () => <SourceChip title="Marktbericht" url="https://märkte.example/bericht" />,
        },
      ],
    },
  ],
};

export default mod;
