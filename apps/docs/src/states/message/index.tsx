import { Message } from 'oniva-ui';
import type { StateModule } from '../types';

const noop = () => undefined;

const answer = (
  <>
    Q3 revenue closed at <strong>$4.82M</strong>, up 14.2% quarter over quarter. Enterprise drove most of the growth,
    with Northwind Labs and two other accounts expanding seats in September.
  </>
);

const longAnswer = (
  <>
    <p style={{ margin: 0 }}>
      Revenue by segment for Q3: Enterprise $3.14M (65%), Mid-market $1.12M (23%), Self-serve $0.56M (12%). Enterprise
      grew 19.4% quarter over quarter, mostly from seat expansion at three accounts that renewed early.
    </p>
    <p style={{ margin: '8px 0 0' }}>
      Mid-market was flat at +0.8% after two churned accounts offset the new logos, and self-serve slipped 3.1% as the
      trial-to-paid rate fell from 7.4% to 6.9% following the pricing page change on August 12. I would look at the
      onboarding funnel before changing price again.
    </p>
    <p style={{ margin: '8px 0 0' }}>
      Gross margin held at 81.3%. The full breakdown, including the monthly cohort table, is in the attached workbook.
    </p>
  </>
);

const unbroken = 'ExponentialBackoffWithDecorrelatedJitterWorkerStrategyForTheNorthwindQueueSchedulerRetryPolicyV2Config.worker.ts';

const longPath =
  'packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts';

const mod: StateModule = {
  slug: 'message',
  title: 'Message',
  width: 720,
  groups: [
    {
      label: 'User',
      states: [
        {
          id: 'user',
          label: 'user, named, timestamp',
          render: () => (
            <Message role="user" name="Bala" timestamp="10:42 AM">
              Can you analyze Q3 revenue by segment?
            </Message>
          ),
        },
        {
          id: 'user-anonymous',
          label: 'user, no name or timestamp',
          render: () => <Message role="user">Retry the failed export.</Message>,
        },
        {
          id: 'user-multiline',
          label: 'user, multiline',
          render: () => (
            <Message role="user" name="Bala" timestamp="10:44 AM">
              {'Three things for the Q3 review:\n1. Revenue by segment\n2. Churned accounts and why\n3. Trial-to-paid rate since the pricing change'}
            </Message>
          ),
        },
        {
          id: 'user-long',
          label: 'user, long text wraps',
          render: () => (
            <Message role="user" name="Bala" timestamp="10:45 AM">
              I need a summary of Q3 revenue by segment, compared with Q2 and the same quarter last year, with churned
              accounts called out separately and the effect of the August pricing page change isolated if that is
              possible from the data we have in the warehouse export. Keep it short enough to paste into the board
              update.
            </Message>
          ),
        },
        {
          id: 'user-no-break-points',
          label: 'user, no break points',
          render: () => (
            <Message role="user" name="Bala" timestamp="10:46 AM">
              {unbroken + unbroken}
            </Message>
          ),
        },
        {
          id: 'user-unbroken',
          label: 'user, long unbroken text',
          render: () => (
            <Message role="user" name="Bala" timestamp="10:46 AM">
              {`Why does ${longPath} keep timing out? https://status.northwind.example/incidents/2026-10-14/queue-worker-backoff-regression`}
            </Message>
          ),
        },
      ],
    },
    {
      label: 'Assistant',
      states: [
        {
          id: 'assistant',
          label: 'assistant, content only',
          render: () => (
            <Message role="assistant" name="Atlas 2">
              {answer}
            </Message>
          ),
        },
        {
          id: 'assistant-default-name',
          label: 'assistant, no name',
          render: () => <Message role="assistant">{answer}</Message>,
        },
        {
          id: 'assistant-timestamp',
          label: 'assistant, timestamp',
          render: () => (
            <Message role="assistant" name="Atlas 2" timestamp="10:42 AM">
              {answer}
            </Message>
          ),
        },
        {
          id: 'long-answer',
          label: 'assistant, long multi-paragraph',
          render: () => (
            <Message role="assistant" name="Atlas 2" timestamp="10:43 AM" copyText="Q3 revenue summary" onRetry={noop} onFeedback={noop} feedback={null}>
              {longAnswer}
            </Message>
          ),
        },
        {
          id: 'assistant-no-break-points',
          label: 'assistant, no break points',
          render: () => (
            <Message role="assistant" name="Atlas 2" timestamp="10:47 AM">
              {unbroken + unbroken}
            </Message>
          ),
        },
        {
          id: 'assistant-unbroken',
          label: 'assistant, long unbroken text',
          render: () => (
            <Message role="assistant" name="Atlas 2" timestamp="10:47 AM" copyText={longPath}>
              The timeout comes from {longPath}, which retries without jitter. See
              https://status.northwind.example/incidents/2026-10-14/queue-worker-backoff-regression for the incident
              notes.
            </Message>
          ),
        },
      ],
    },
    {
      label: 'Actions',
      states: [
        {
          id: 'actions-copy',
          label: 'copy only',
          render: () => (
            <Message role="assistant" name="Atlas 2" timestamp="10:42 AM" copyText="Q3 revenue closed at $4.82M.">
              {answer}
            </Message>
          ),
        },
        {
          id: 'actions-retry',
          label: 'retry only',
          render: () => (
            <Message role="assistant" name="Atlas 2" timestamp="10:42 AM" onRetry={noop}>
              {answer}
            </Message>
          ),
        },
        {
          id: 'actions-feedback',
          label: 'feedback, none chosen',
          render: () => (
            <Message role="assistant" name="Atlas 2" timestamp="10:42 AM" onFeedback={noop} feedback={null}>
              {answer}
            </Message>
          ),
        },
        {
          id: 'actions-all',
          label: 'all actions',
          render: () => (
            <Message
              role="assistant"
              name="Atlas 2"
              timestamp="10:42 AM"
              copyText="Q3 revenue closed at $4.82M."
              onRetry={noop}
              onFeedback={noop}
              feedback={null}
            >
              {answer}
            </Message>
          ),
        },
        {
          id: 'feedback-up',
          label: 'feedback up',
          render: () => (
            <Message role="assistant" name="Atlas 2" timestamp="10:42 AM" copyText="Q3 revenue closed at $4.82M." onRetry={noop} onFeedback={noop} feedback="up">
              {answer}
            </Message>
          ),
        },
        {
          id: 'feedback-down',
          label: 'feedback down',
          render: () => (
            <Message role="assistant" name="Atlas 2" timestamp="10:42 AM" copyText="Q3 revenue closed at $4.82M." onRetry={noop} onFeedback={noop} feedback="down">
              {answer}
            </Message>
          ),
        },
        {
          id: 'user-ignores-actions',
          label: 'user role ignores actions',
          render: () => (
            <Message role="user" name="Bala" timestamp="10:42 AM" copyText="Hi" onRetry={noop} onFeedback={noop}>
              Can you analyze Q3 revenue by segment?
            </Message>
          ),
        },
      ],
    },
    {
      label: 'Size',
      states: [
        {
          id: 'narrow-column',
          label: 'narrow (sidebar ~320)',
          render: () => (
            <div style={{ width: 320, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Message role="user" name="Bala" timestamp="10:42 AM">
                Can you analyze Q3 revenue by segment and flag anything odd?
              </Message>
              <Message role="assistant" name="Atlas 2" timestamp="10:42 AM" copyText="x" onRetry={noop} onFeedback={noop} feedback={null}>
                {answer}
              </Message>
            </div>
          ),
        },
      ],
    },
  ],
  missing: [
    'Copied confirmation (set by clicking copy, no prop)',
    'Empty children (renders an empty bubble or content block; not a designed state)',
    'Avatar image (avatarSrc loads a network image; fixtures use the initials fallback)',
  ],
};
export default mod;
