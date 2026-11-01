import { Citation } from 'oniva-ui';
import type { StateModule } from '../types';

const prose = { fontSize: 14, lineHeight: '22px', margin: 0 } as const;

const mod: StateModule = {
  slug: 'citation',
  title: 'Citation',
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
              Net revenue retention was 118%
              <Citation index={1} title="Net revenue retention by segment" url="https://www.northwind.example/reports/nrr" />.
            </p>
          ),
        },
        {
          id: 'double-digit',
          label: 'two digits',
          render: () => (
            <p style={prose}>
              Churn dropped for the third quarter in a row
              <Citation index={12} title="Quarterly churn review" url="https://www.northwind.example/reports/churn-q3" />.
            </p>
          ),
        },
        {
          id: 'three-digit',
          label: 'three digits',
          render: () => (
            <p style={prose}>
              The appendix lists every cohort
              <Citation index={128} title="Cohort appendix" url="https://data.northwind.example/cohorts" />.
            </p>
          ),
        },
      ],
    },
    {
      label: 'Placement',
      states: [
        {
          id: 'adjacent',
          label: 'adjacent citations',
          render: () => (
            <p style={prose}>
              Expansion revenue grew 24% year over year
              <Citation index={1} title="Expansion revenue by plan" url="https://www.northwind.example/reports/expansion" />
              <Citation index={2} title="Annual plan mix" url="https://www.northwind.example/reports/plan-mix" />
              <Citation index={3} title="Pricing changes, March release" url="https://docs.northwind.example/changelog/pricing" />
              , driven mostly by seat growth.
            </p>
          ),
        },
        {
          id: 'paragraph',
          label: 'wrapping paragraph',
          render: () => (
            <p style={prose}>
              Net revenue retention was 118% in the quarter
              <Citation index={1} title="NRR by segment" url="https://www.northwind.example/reports/nrr" />, ahead of the
              112% median across comparable teams
              <Citation index={2} title="Growth benchmarks" url="https://benchmarks.example/atlas" />. Support volume fell
              9% after the onboarding rewrite
              <Citation index={3} title="Support volume, Q3" url="https://www.northwind.example/support/q3" />, while the
              median first response time held at 4 minutes 12 seconds
              <Citation index={4} title="Response time dashboard" url="https://www.northwind.example/support/response-time" />.
              Enterprise renewals closed two weeks earlier than planned
              <Citation index={5} title="Renewal calendar" url="https://www.northwind.example/sales/renewals" />.
            </p>
          ),
        },
      ],
    },
    {
      label: 'Source',
      states: [
        {
          id: 'long-title',
          label: 'long title',
          render: () => (
            <p style={prose}>
              Seat utilisation is highest in the first ninety days
              <Citation
                index={2}
                title="Seat utilisation across onboarding cohorts, segmented by plan tier, region and contract length, 2024 to 2026 (extended edition)"
                url="https://www.northwind.example/research/seat-utilisation"
              />
              .
            </p>
          ),
        },
        {
          id: 'long-unbroken-title',
          label: 'long unbroken title',
          render: () => (
            <p style={prose}>
              Build artefacts are stored per release
              <Citation
                index={4}
                title="packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts"
                url="https://repo.northwind.example/packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts"
              />
              .
            </p>
          ),
        },
        {
          id: 'long-host',
          label: 'long host',
          render: () => (
            <p style={prose}>
              The audit trail is retained for seven years
              <Citation
                index={3}
                title="Retention policy"
                url="https://compliance-and-data-governance.internal.eu-west.northwind-labs.example/policies/retention"
              />
              .
            </p>
          ),
        },
        {
          id: 'relative-url',
          label: 'relative url',
          render: () => (
            <p style={prose}>
              See the workspace settings for details
              <Citation index={1} title="Workspace settings" url="/settings/workspace" />.
            </p>
          ),
        },
        {
          id: 'unsafe-url',
          label: 'unsafe url (no href)',
          render: () => (
            <p style={prose}>
              This source has no navigable address
              <Citation index={1} title="Unavailable source" url="javascript:alert(1)" />.
            </p>
          ),
        },
        {
          id: 'invalid-url',
          label: 'not a url',
          render: () => (
            <p style={prose}>
              The note was copied from a spreadsheet cell
              <Citation index={2} title="Planning sheet" url="planning sheet / tab 3" />.
            </p>
          ),
        },
      ],
    },
  ],
  missing: [
    'tooltip open (hover/focus card): the open state is internal to the tooltip and not exposed as a prop',
    'hover and focus-visible styles: need pointer or keyboard interaction, not reachable from props',
  ],
};

export default mod;
