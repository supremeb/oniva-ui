import { InlineCitation } from 'oniva-ui';
import type { StateModule } from '../types';

const prose = { fontSize: 14, lineHeight: '22px', margin: 0 } as const;

const nrr = 'https://www.northwind.example/investors/q3-2026';
const nrrSnippet = 'Net revenue retention was 118%, up from 112% in Q2, driven by seat expansion in the Scale tier.';

const mod: StateModule = {
  slug: 'inline-citation',
  title: 'Inline citation',
  width: 720,
  groups: [
    {
      label: 'Index',
      states: [
        {
          id: 'single',
          label: 'single digit',
          render: () => (
            <p style={prose}>
              Net revenue retention reached 118% in Q3
              <InlineCitation index={1} title="Northwind Q3 2026 investor letter" url={nrr} date="Oct 2, 2026" snippet={nrrSnippet} />.
            </p>
          ),
        },
        {
          id: 'double-digit',
          label: 'two digits',
          render: () => (
            <p style={prose}>
              Gross churn fell for the third quarter in a row
              <InlineCitation index={12} title="Quarterly churn review" url="https://www.northwind.example/reports/churn-q3" />.
            </p>
          ),
        },
        {
          id: 'three-digit',
          label: 'three digits',
          render: () => (
            <p style={prose}>
              The appendix lists every cohort
              <InlineCitation index={104} title="Cohort appendix" url="https://www.northwind.example/reports/cohorts" />.
            </p>
          ),
        },
      ],
    },
    {
      label: 'In text',
      states: [
        {
          id: 'paragraph',
          label: 'paragraph with several',
          render: () => (
            <p style={prose}>
              Net revenue retention reached 118% in Q3
              <InlineCitation index={1} title="Northwind Q3 2026 investor letter" url={nrr} date="Oct 2, 2026" snippet={nrrSnippet} />
              , while gross churn fell to 1.9%
              <InlineCitation index={2} title="SaaS Benchmarks Report 2026" url="https://benchmarks.example/saas-2026" date="Sep 18, 2026" snippet="Median gross churn for mid-market SaaS is 2.8% annually." />
              <InlineCitation index={3} title="Northwind churn dashboard" url="https://www.northwind.example/dashboards/churn" />
              . Expansion revenue accounted for most of the lift, led by the Scale tier
              <InlineCitation index={4} title="Scale tier expansion analysis" url="https://www.northwind.example/analysis/scale-tier-expansion" date="Oct 9, 2026" />
              , and the team expects the trend to hold through the first half of next year.
            </p>
          ),
        },
        {
          id: 'line-wrap',
          label: 'at a wrapping line end',
          render: () => (
            <p style={{ ...prose, width: 260 }}>
              Seat expansion in the Scale tier drove most of the lift in retention this quarter across mid-market accounts
              <InlineCitation index={7} title="Scale tier expansion analysis" url="https://www.northwind.example/analysis/scale-tier-expansion" />
              {' '}and enterprise accounts
              <InlineCitation index={8} title="Enterprise renewals" url="https://www.northwind.example/analysis/renewals" />.
            </p>
          ),
        },
      ],
    },
    {
      label: 'Source',
      states: [
        {
          id: 'no-metadata',
          label: 'title and url only',
          render: () => (
            <p style={prose}>
              Support volume was flat
              <InlineCitation index={5} title="Support volume, Q3" url="https://www.northwind.example/support/volume" />.
            </p>
          ),
        },
        {
          id: 'long-title',
          label: 'long title and url',
          render: () => (
            <p style={prose}>
              The migration finished two weeks early
              <InlineCitation
                index={6}
                title="Postmortem and retrospective: migrating the Northwind billing ledger from the monolith to the event-sourced ledger service"
                url="https://engineering.northwind.example/postmortems/2026/billing-ledger-migration/retrospective-and-lessons-learned/full-report"
                date="Oct 21, 2026"
                snippet="The cutover completed on October 14 with zero reconciliation errors across 4.2 million ledger entries; the rollback plan was never exercised."
              />.
            </p>
          ),
        },
        {
          id: 'unsafe-url',
          label: 'unsafe url (no link)',
          render: () => (
            <p style={prose}>
              This source could not be linked
              <InlineCitation index={9} title="Untrusted source" url="javascript:alert(1)" />.
            </p>
          ),
        },
        {
          id: 'relative-url',
          label: 'relative url',
          render: () => (
            <p style={prose}>
              See the internal runbook
              <InlineCitation index={10} title="Incident runbook" url="/docs/runbooks/incident" snippet="Page the on-call engineer, then open a channel named after the incident." />.
            </p>
          ),
        },
      ],
    },
  ],
  missing: [
    'preview card open (opens on hover/focus only; no defaultOpen prop is exposed)',
    'snippet-only / date-only card contents (same: card is not reachable without pointer)',
    'no-index / custom children (children prop is accepted but never rendered)',
  ],
};

export default mod;
