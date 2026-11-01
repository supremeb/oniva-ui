import { AiAnswer } from 'oniva-ui';
import type { AnswerSource } from 'oniva-ui';
import type { StateModule } from '../types';

const sources: AnswerSource[] = [
  { name: 'Finance wiki', title: 'Q3 revenue close: variance and drivers', url: 'https://wiki.example.com/finance/q3-close', snippet: 'Net revenue retention closed at 112%, up from 106% in Q2.', date: 'Oct 8, 2026' },
  { name: 'Board deck', title: 'October board update: expansion revenue', url: 'https://docs.example.com/board/october', snippet: 'Team plan upgrades contributed $1.2M of expansion ARR.', date: 'Oct 14, 2026' },
  { name: 'CRM', title: 'Churned accounts, enterprise segment', url: 'https://crm.example.com/reports/churn', snippet: 'Three enterprise accounts churned, totaling $212K ARR.' },
];

const [financeWiki, boardDeck, crm] = sources as [AnswerSource, AnswerSource, AnswerSource];

const manySources: AnswerSource[] = [
  financeWiki,
  boardDeck,
  crm,
  { name: 'Support desk', title: 'Ticket volume by plan, September to October', url: 'https://support.example.com/reports/volume', snippet: 'Enterprise tickets fell 14% after the onboarding revamp.' },
  { name: 'Product analytics', title: 'Seat expansion cohort, trailing 90 days', url: 'https://analytics.example.com/cohorts/seats' },
  { name: 'Contracts', title: 'Northwind Labs renewal terms and multi-year discount schedule for FY27', url: 'https://contracts.example.com/northwind/renewal-fy27' },
];

const question = 'How did retention move in Q3?';

const answer = `Net revenue retention rose to **112%** in Q3, up from 106% in Q2 [1].

Most of the lift came from expansion:
- Team plan upgrades added about $1.2M of ARR [2]
- Seat growth in existing enterprise accounts [1,2]

Churn was contained: three enterprise accounts left, totaling $212K ARR [3].`;

const partial = `Net revenue retention rose to **112%** in Q3, up from 106% in Q2 [1].

Most of the lift came from expansion:
- Team plan upgrades added about $1.2M of ARR [2]
- Seat growth in`;

const long = `Net revenue retention rose to **112%** in Q3, up from 106% in Q2 [1]. The movement was broad rather than concentrated: eleven of fourteen segments improved quarter over quarter, and the three that slipped did so by less than a point each. Finance attributes roughly two thirds of the lift to expansion inside accounts that were already paying for the Team plan [1,2], with the remainder split between price changes that took effect in August and a smaller than expected contraction in the mid-market band [4].

Drivers, in order of contribution:
- Team plan upgrades added about $1.2M of ARR, most of it from accounts that crossed the 25 seat threshold in July or August and moved to the annual tier [2]
- Seat growth in existing enterprise accounts, led by Northwind Labs and two other multi-year customers who exercised expansion clauses ahead of schedule [1,2,6]
- Lower contraction after the onboarding revamp shipped, which cut early downgrades by about 14% [4]
- Price changes on legacy plans, which landed in full from the August billing cycle [5]

Churn was contained: three enterprise accounts left, totaling $212K ARR [3]. None of them were on multi-year terms, and exit notes cite consolidation of vendors rather than product gaps.`;

const unbroken = `The export lives at https://contracts.example.com/northwind/renewal-fy27/exhibits/schedule-b/discount-tiers-multi-year-prepay-with-ramp-and-true-up-clause.pdf and the working copy is packages/northwind-finance/src/reports/quarterly/retention/cohort-expansion-by-segment-and-plan.csv [1].

Check ARR_EXPANSION_TEAM_PLAN_UPGRADES_Q3_FY26_VS_Q2_FY26_NET_OF_CONTRACTION_AND_CHURN_ADJUSTED [2] before sharing.`;

const noop = () => {};

const mod: StateModule = {
  slug: 'ai-answer',
  title: 'AI answer',
  width: 640,
  groups: [
    {
      label: 'Run',
      states: [
        {
          id: 'waiting',
          label: 'streaming, nothing yet',
          render: () => <AiAnswer question={question} sources={sources} answer="" isStreaming animate={false} onStop={noop} />,
        },
        {
          id: 'streaming',
          label: 'streaming, partial text',
          render: () => <AiAnswer question={question} sources={sources} answer={partial} isStreaming animate={false} onStop={noop} />,
        },
        {
          id: 'streaming-no-stop',
          label: 'streaming, no stop handler',
          render: () => <AiAnswer question={question} sources={sources} answer={partial} isStreaming animate={false} />,
        },
        {
          id: 'done',
          label: 'done, full footer',
          render: () => (
            <AiAnswer
              question={question}
              sources={sources}
              answer={answer}
              animate={false}
              followUps={['What drove enterprise churn?', 'Compare with Q3 last year']}
              meta="Answered in 4.6s"
              onRegenerate={noop}
              onFeedback={noop}
              feedbackReasons={['Inaccurate', 'Missing sources', 'Too long']}
            />
          ),
        },
        {
          id: 'done-bare',
          label: 'done, copy only',
          render: () => <AiAnswer question={question} sources={sources} answer={answer} animate={false} />,
        },
        {
          id: 'empty-answer',
          label: 'done, empty answer',
          render: () => <AiAnswer question={question} sources={sources} answer="" animate={false} />,
        },
      ],
    },
    {
      label: 'Sources',
      states: [
        {
          id: 'no-sources',
          label: 'no sources',
          render: () => <AiAnswer question="What is a good retention number?" answer="Net revenue retention above **100%** means expansion outweighs churn. Healthy B2B products usually sit between 105% and 120%." animate={false} onRegenerate={noop} />,
        },
        {
          id: 'one-source',
          label: 'one source',
          render: () => (
            <AiAnswer
              question={question}
              sources={[financeWiki]}
              answer="Net revenue retention rose to **112%** in Q3, up from 106% in Q2 [1]."
              animate={false}
              onRegenerate={noop}
            />
          ),
        },
        {
          id: 'many-sources',
          label: 'six sources, scrolls',
          render: () => <AiAnswer question={question} sources={manySources} answer={long} animate={false} onRegenerate={noop} meta="Answered in 7.2s" />,
        },
        {
          id: 'missing-citation',
          label: 'cites a source that does not exist',
          render: () => <AiAnswer question={question} sources={[financeWiki]} answer="Retention rose [1]. Expansion drove most of it [2,3]." animate={false} onRegenerate={noop} />,
        },
        {
          id: 'non-http-source',
          label: 'non-web source url',
          render: () => (
            <AiAnswer
              question={question}
              sources={[{ name: 'Local file', title: 'Retention model.xlsx', url: 'file:///Users/finance/retention-model.xlsx' }, boardDeck]}
              answer="The model assumes 112% [1], matching the board deck [2]."
              animate={false}
              onRegenerate={noop}
            />
          ),
        },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'long-answer',
          label: 'long answer, list and citations',
          render: () => <AiAnswer question={question} sources={manySources} answer={long} animate={false} followUps={['What drove enterprise churn?', 'Compare with Q3 last year']} onRegenerate={noop} onFeedback={noop} />,
        },
        {
          id: 'long-question',
          label: 'long question',
          render: () => (
            <AiAnswer
              question="How did net revenue retention move in Q3 for enterprise accounts on multi-year terms compared with the mid-market band, and what share of that came from price changes rather than seat expansion?"
              sources={sources}
              answer={answer}
              animate={false}
              onRegenerate={noop}
            />
          ),
        },
        {
          id: 'unbroken-text',
          label: 'long URLs and identifiers',
          render: () => <AiAnswer question={question} sources={sources} answer={unbroken} animate={false} onRegenerate={noop} />,
        },
        {
          id: 'long-followups',
          label: 'long follow-ups',
          render: () => (
            <AiAnswer
              question={question}
              sources={sources}
              answer={answer}
              animate={false}
              followUps={[
                'Which enterprise accounts churned in Q3 and what reasons did they give in their exit interviews with the success team?',
                'Compare with Q3 last year',
                'https://wiki.example.com/finance/q3-close/appendix/retention-by-segment-and-plan-tier-detail',
              ]}
              onRegenerate={noop}
            />
          ),
        },
      ],
    },
    {
      label: 'Chrome',
      states: [
        {
          id: 'no-label',
          label: 'label hidden, no question',
          render: () => <AiAnswer sources={sources} answer={answer} label={false} animate={false} onRegenerate={noop} />,
        },
        {
          id: 'custom-label',
          label: 'custom label',
          render: () => <AiAnswer question={question} sources={sources} answer={answer} label="Atlas 2 answer" animate={false} onRegenerate={noop} meta="Atlas 2 · 4.6s" />,
        },
      ],
    },
  ],
  missing: [
    'error / failed answer (no status or error prop)',
    'stopped / cancelled answer (Stop only calls onStop; nothing renders a cancelled state)',
    'disabled / read-only',
    'regenerating (onRegenerate has no pending state)',
  ],
};

export default mod;
