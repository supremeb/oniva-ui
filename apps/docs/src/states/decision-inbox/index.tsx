import { DecisionInbox } from 'oniva-ui';
import type { InboxDecision } from 'oniva-ui';
import type { StateModule } from '../types';

const renewal: InboxDecision = {
  id: 'renewal',
  title: 'Renew the design tools plan?',
  detail: '12 seats · $1,800 per year · renews in 5 days',
  primary: 'Renew',
  secondary: 'Change seats',
};
const rollout: InboxDecision = {
  id: 'rollout',
  title: 'Roll out the new onboarding to everyone?',
  detail: 'Test won with +8% activation · 2 weeks of data',
  primary: 'Roll out',
  secondary: 'Keep testing',
};
const refund: InboxDecision = {
  id: 'refund',
  title: 'Approve a $240 refund for order NW-4821?',
  detail: 'Customer reports the export failed twice on Mar 3',
  primary: 'Approve',
  secondary: 'Decline',
};
const rollback: InboxDecision = {
  id: 'rollback',
  title: 'Roll back release 2.14.0 on the EU cluster?',
  detail: 'p95 latency up 38% since 09:12 · 3 alerts firing',
  primary: 'Roll back',
  secondary: 'Wait 15 min',
};
const access: InboxDecision = {
  id: 'access',
  title: 'Grant Atlas 2 write access to the billing workspace?',
  detail: 'Requested by the invoicing agent for 24 hours',
  primary: 'Grant',
  secondary: 'Deny',
};
const budget: InboxDecision = {
  id: 'budget',
  title: 'Raise the monthly model budget to $4,000?',
  detail: 'Spend is at 91% with 9 days left in the cycle',
  primary: 'Raise',
  secondary: 'Keep $3,000',
};

const longPath =
  'packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts';

const mod: StateModule = {
  slug: 'decision-inbox',
  title: 'Decision inbox',
  width: 440,
  groups: [
    {
      label: 'Data',
      states: [
        { id: 'empty', label: 'empty', render: () => <DecisionInbox decisions={[]} /> },
        { id: 'one', label: 'one decision', render: () => <DecisionInbox decisions={[renewal]} /> },
        { id: 'typical', label: 'two decisions', render: () => <DecisionInbox decisions={[rollout, renewal]} /> },
        {
          id: 'long-set',
          label: 'six decisions',
          render: () => <DecisionInbox decisions={[rollout, renewal, refund, rollback, access, budget]} />,
        },
      ],
    },
    {
      label: 'Folded',
      states: [
        {
          id: 'one-folded',
          label: 'second folded',
          render: () => <DecisionInbox decisions={[rollout, { ...refund, collapsed: true }]} />,
        },
        {
          id: 'all-folded',
          label: 'all folded',
          render: () => (
            <DecisionInbox
              decisions={[rollout, renewal, refund, rollback].map((d) => ({ ...d, collapsed: true }))}
            />
          ),
        },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'no-detail',
          label: 'no detail line',
          render: () => <DecisionInbox decisions={[{ ...refund, detail: undefined }, { ...budget, detail: undefined }]} />,
        },
        {
          id: 'long-text',
          label: 'long title, detail and answers',
          render: () => (
            <DecisionInbox
              decisions={[
                {
                  id: 'long',
                  title: `Merge the generated migration for ${longPath} into the release branch before the freeze?`,
                  detail: `Touches ${longPath} and 41 other files · reviewed by Quill Reasoner · 2 checks still pending`,
                  primary: 'Merge into release branch',
                  secondary: 'Hold until checks pass',
                },
                { ...access, collapsed: true, title: `Grant Atlas 2 write access to ${longPath} for the next 24 hours?` },
              ]}
            />
          ),
        },
        {
          id: 'custom-title',
          label: 'custom heading',
          render: () => <DecisionInbox title="Waiting on you · Northwind Labs" decisions={[rollout, renewal]} />,
        },
        {
          id: 'unbroken',
          label: 'unbroken strings',
          render: () => (
            <DecisionInbox
              decisions={[
                {
                  id: 'url',
                  title: 'https://staging.northwind.example/api/v2/exports/2026-03-03T09:12:44Z/customers-eu-west-1-full.csv',
                  detail: 'Sha256-9f2c1d7e4ab3c8d0e51f6a72b94c03de8a1b5f67c2d9e04a3b8c71f5d6e2a049',
                  primary: 'Approve export',
                  secondary: 'Decline',
                },
              ]}
            />
          ),
        },
      ],
    },
  ],
  missing: [
    'answered / confirmation (needs a click; no prop to start answered)',
    'all caught up with title set (reached only after answering every decision)',
  ],
};

export default mod;
