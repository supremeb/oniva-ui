import { AgentThinking } from 'oniva-ui';
import type { StateModule } from '../types';

const reasoning = `The user wants Q3 revenue by segment.
1. Load q3_revenue.csv and group by segment.
2. Compare against Q2 and plan ($4.55M).
3. Flag self-serve churn as the one soft spot.`;

const long = `The user wants a retry schedule for the Northwind Labs ingest queue, so start from what the workers do today.
1. Read src/queue/retry.ts and note that every failure is retried after a fixed 30s delay, which piles up during a regional outage.
2. Check the dead-letter policy: after 5 attempts the job moves to the DLQ, so the new schedule must fit inside that budget.
3. Compare exponential backoff with full jitter against decorrelated jitter. Decorrelated jitter spreads load better at high concurrency, but it is harder to reason about in tests.
4. Pick decorrelated jitter with a 2s base and a 5m cap, and keep the attempt limit unchanged so existing alerts still fire.
5. Plan the change: a pure scheduling function, a thin worker adapter, and tests that inject a seeded random source.
6. Risks: jobs already in flight keep the old delay until their next failure, which is acceptable. Document it in the changelog.
7. Draft the summary for the release notes, leading with the outage behaviour.`;

const longPath = `Opened packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts and https://status.northwind.example/api/v2/incidents/2026-10-14/timeline?include=updates,components,postmortem`;

const mod: StateModule = {
  slug: 'agent-thinking',
  title: 'Agent thinking',
  width: 720,
  groups: [
    {
      label: 'Run',
      states: [
        {
          id: 'thinking-collapsed',
          label: 'thinking, collapsed',
          render: () => <AgentThinking isThinking seconds={4}>{reasoning}</AgentThinking>,
        },
        {
          id: 'thinking-expanded',
          label: 'thinking, expanded',
          render: () => (
            <AgentThinking isThinking seconds={9} defaultExpanded>
              {reasoning}
            </AgentThinking>
          ),
        },
        {
          id: 'thinking-minutes',
          label: 'thinking, over a minute',
          render: () => (
            <AgentThinking isThinking seconds={83} defaultExpanded>
              {long}
            </AgentThinking>
          ),
        },
        {
          id: 'done-collapsed',
          label: 'done, collapsed',
          render: () => <AgentThinking seconds={14}>{reasoning}</AgentThinking>,
        },
        {
          id: 'done-expanded',
          label: 'done, expanded',
          render: () => (
            <AgentThinking seconds={14} defaultExpanded>
              {reasoning}
            </AgentThinking>
          ),
        },
        {
          id: 'done-minutes',
          label: 'done, over a minute',
          render: () => (
            <AgentThinking seconds={127} defaultExpanded>
              {long}
            </AgentThinking>
          ),
        },
        {
          id: 'done-instant',
          label: 'done, 0 seconds',
          render: () => <AgentThinking seconds={0}>{reasoning}</AgentThinking>,
        },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'empty',
          label: 'no reasoning text, expanded',
          render: () => <AgentThinking seconds={3} defaultExpanded />,
        },
        {
          id: 'single-line',
          label: 'single line',
          render: () => (
            <AgentThinking seconds={2} defaultExpanded>
              Straightforward lookup, no plan needed.
            </AgentThinking>
          ),
        },
        {
          id: 'long-text',
          label: 'long reasoning',
          render: () => (
            <AgentThinking seconds={41} defaultExpanded>
              {long}
            </AgentThinking>
          ),
        },
        {
          id: 'unbroken',
          label: 'long paths and URLs',
          render: () => (
            <AgentThinking seconds={11} defaultExpanded>
              {longPath}
            </AgentThinking>
          ),
        },
        {
          id: 'node-children',
          label: 'rich children',
          render: () => (
            <AgentThinking seconds={18} defaultExpanded>
              <ol style={{ margin: 0, paddingInlineStart: 18 }}>
                <li>Load q3_revenue.csv</li>
                <li>Group by segment</li>
                <li>
                  Compare against <code>plan.xlsx</code>
                </li>
              </ol>
            </AgentThinking>
          ),
        },
      ],
    },
    {
      label: 'Access',
      states: [
        {
          id: 'disabled',
          label: 'disabled, done',
          render: () => (
            <AgentThinking seconds={14} isDisabled>
              {reasoning}
            </AgentThinking>
          ),
        },
        {
          id: 'narrow',
          label: 'narrow column',
          render: () => (
            <div style={{ maxWidth: 260 }}>
              <AgentThinking isThinking seconds={65} defaultExpanded>
                {reasoning}
              </AgentThinking>
            </div>
          ),
        },
      ],
    },
  ],
  missing: [
    'error / cancelled: the component has no status beyond isThinking, so a failed or stopped run cannot be shown',
    'auto-counting timer: reached only by omitting `seconds` while thinking, which ticks; not held still here',
  ],
};

export default mod;
