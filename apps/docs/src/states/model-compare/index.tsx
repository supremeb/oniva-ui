import { ModelCompare } from 'oniva-ui';
import type { ModelResponse } from 'oniva-ui';
import type { StateModule } from '../types';

const prompt = 'Summarize Q3 results for the board in three lines.';

const atlas: ModelResponse = {
  id: 'atlas',
  model: 'Atlas 2',
  latencyMs: 2100,
  cost: 0.012,
  tokens: 1840,
  text: 'Q3 revenue was $4.82M, up 11.3% QoQ. The increase came mostly from the Scale tier (+$310K). Churn held at 1.9%.\n\nRisk: two enterprise renewals ($420K ARR) slip into Q4.',
};
const nova: ModelResponse = {
  id: 'nova',
  model: 'Nova Pro',
  latencyMs: 3400,
  cost: 0.031,
  tokens: 2210,
  text: 'Revenue reached $4.82M in Q3 (+11.3% QoQ), driven by Scale-tier expansion. Churn was steady at 1.9%.\n\nWatch item: renewals worth $420K ARR may close in Q4 rather than Q3.',
};
const lumen: ModelResponse = {
  id: 'lumen',
  model: 'Lumen Fast',
  latencyMs: 2900,
  cost: 0.018,
  tokens: 1990,
  text: 'Q3: $4.82M revenue (11.3% growth). Scale tier added $310K. Churn 1.9%. Two renewals ($420K) are delayed to Q4.',
};
const quill: ModelResponse = {
  id: 'quill',
  model: 'Quill Reasoner',
  latencyMs: 11800,
  cost: 0.094,
  tokens: 6420,
  text: 'Q3 closed at $4.82M, an 11.3% sequential increase. Decomposing the movement: Scale-tier expansion contributed +$310K, Core was roughly flat, and logo churn held at 1.9%.\n\nOne exposure to flag: two enterprise renewals totalling $420K ARR are likely to slip past the quarter boundary.',
};

const three = [atlas, nova, lumen];

const longText = `${atlas.text}\n\nDetail by segment: Scale tier closed at $2.14M (+17.0% QoQ) on 38 net new seats across Northwind Labs, Harbor & Pine and Tessellate Freight. Core held at $1.92M (+0.8%). Add-ons contributed $0.76M, of which usage-based overage was $0.31M and is not contractually recurring.\n\nPipeline: Q4 commit is $1.38M against a $1.6M target. Two deals ($420K combined) depend on security review sign-off expected the week of November 11. If both slip, Q4 revenue lands at roughly $5.1M instead of $5.5M.\n\nRecommendations: pull the security review forward, hold the overage out of the forecast, and brief the board on the renewal risk before the October meeting rather than after.`;

const mod: StateModule = {
  slug: 'model-compare',
  title: 'Model compare',
  width: 1000,
  groups: [
    {
      label: 'Data',
      states: [
        { id: 'empty', label: 'no responses', render: () => <ModelCompare prompt={prompt} responses={[]} /> },
        { id: 'one', label: 'one response (no flags)', render: () => <ModelCompare prompt={prompt} responses={[atlas]} /> },
        { id: 'two', label: 'two responses', render: () => <ModelCompare prompt={prompt} responses={[atlas, nova]} /> },
        { id: 'three', label: 'three responses', render: () => <ModelCompare prompt={prompt} responses={three} /> },
        { id: 'four', label: 'four responses (wraps)', render: () => <ModelCompare prompt={prompt} responses={[...three, quill]} /> },
        {
          id: 'six',
          label: 'six responses (stagger cap)',
          render: () => (
            <ModelCompare
              prompt={prompt}
              responses={[...three, quill, { ...atlas, id: 'a2', model: 'Atlas 2 (low effort)', latencyMs: 1400, cost: 0.006 }, { ...nova, id: 'n2', model: 'Nova Pro (long context)', cost: 0.052 }]}
            />
          ),
        },
        { id: 'no-prompt', label: 'no prompt', render: () => <ModelCompare responses={three} /> },
      ],
    },
    {
      label: 'Badges',
      states: [
        {
          id: 'fastest-is-cheapest',
          label: 'one model is fastest and cheapest',
          render: () => <ModelCompare prompt={prompt} responses={[lumen, { ...atlas, latencyMs: 2600, cost: 0.02 }, nova]} />,
        },
        {
          id: 'tie',
          label: 'two tie for fastest and cheapest',
          render: () => <ModelCompare prompt={prompt} responses={[atlas, { ...nova, latencyMs: atlas.latencyMs, cost: atlas.cost }, lumen]} />,
        },
        {
          id: 'all-tied',
          label: 'all tied (no flags)',
          render: () => <ModelCompare prompt={prompt} responses={three.map((r) => ({ ...r, latencyMs: 2400, cost: 0.015 }))} />,
        },
        {
          id: 'no-tokens',
          label: 'token count missing',
          render: () => <ModelCompare prompt={prompt} responses={three.map(({ tokens: _t, ...r }) => r)} />,
        },
        {
          id: 'sub-second',
          label: 'sub-second, sub-cent',
          render: () => <ModelCompare prompt={prompt} responses={[{ ...lumen, latencyMs: 640, cost: 0.0004, tokens: 212 }, { ...atlas, latencyMs: 980, cost: 0.0011, tokens: 240 }]} />,
        },
      ],
    },
    {
      label: 'Selection',
      states: [
        { id: 'selected-first', label: 'first selected', render: () => <ModelCompare prompt={prompt} responses={three} selectedId="atlas" onSelect={() => undefined} /> },
        { id: 'selected-last', label: 'last selected', render: () => <ModelCompare prompt={prompt} responses={three} selectedId="lumen" onSelect={() => undefined} /> },
        { id: 'selected-unknown', label: 'selectedId matches nothing', render: () => <ModelCompare prompt={prompt} responses={three} selectedId="missing" /> },
        { id: 'no-handler', label: 'no onSelect', render: () => <ModelCompare prompt={prompt} responses={three} /> },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'long-text',
          label: 'long output next to short ones',
          render: () => <ModelCompare prompt={prompt} responses={[{ ...atlas, text: longText, tokens: 5120 }, nova, lumen]} />,
        },
        {
          id: 'long-unbroken',
          label: 'long unbroken text',
          render: () => (
            <ModelCompare
              prompt={prompt}
              responses={[
                { ...atlas, text: 'Source: https://reports.northwind.example/board/2026/q3/revenue-summary/segments/scale-tier/detail?view=quarterly&compare=previous-quarter&format=pdf' },
                { ...nova, text: 'packages/northwind-billing/src/revenue/recognition/schedules/quarterly-rollup-by-segment.worker.ts' },
                lumen,
              ]}
            />
          ),
        },
        {
          id: 'long-model-name',
          label: 'long model name',
          render: () => (
            <ModelCompare
              prompt={prompt}
              responses={[{ ...atlas, model: 'Atlas 2 Extended Context Reasoning Preview (2026-03-14 snapshot)' }, nova, lumen]}
              selectedId="atlas"
            />
          ),
        },
        {
          id: 'long-prompt',
          label: 'long prompt',
          render: () => (
            <ModelCompare
              prompt="Summarize Q3 results for the board in three lines. Lead with revenue and the quarter-over-quarter change, call out the single largest driver, state churn, and finish with the one risk the directors should discuss before the November meeting."
              responses={three}
            />
          ),
        },
        {
          id: 'empty-text',
          label: 'empty output',
          render: () => <ModelCompare prompt={prompt} responses={[{ ...atlas, text: '' }, nova, lumen]} />,
        },
      ],
    },
  ],
  missing: [
    'Loading / streaming responses (no status prop; responses are always complete)',
    'Error or refused response for one model (no status or error field on ModelResponse)',
    'Disabled selection (no isDisabled prop)',
  ],
};
export default mod;
