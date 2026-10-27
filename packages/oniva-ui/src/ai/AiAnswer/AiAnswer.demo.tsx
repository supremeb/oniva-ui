import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../../components/Button';
import { AiAnswer, type AnswerSource } from './AiAnswer';

const sources: AnswerSource[] = [
  { name: 'Finance wiki', title: 'Q3 revenue close: variance and drivers', url: 'https://wiki.example.com/finance/q3-close', snippet: 'Net revenue retention closed at 112%, up from 106% in Q2.', date: 'Oct 8, 2026' },
  { name: 'Board deck', title: 'October board update: expansion revenue', url: 'https://docs.example.com/board/october', snippet: 'Team plan upgrades contributed $1.2M of expansion ARR.', date: 'Oct 14, 2026' },
  { name: 'CRM', title: 'Churned accounts, enterprise segment', url: 'https://crm.example.com/reports/churn', snippet: 'Three enterprise accounts churned, totaling $212K ARR.' },
];

const answer = `Net revenue retention rose to **112%** in Q3, up from 106% in Q2 [1].

Most of the lift came from expansion:
- Team plan upgrades added about $1.2M of ARR [2]
- Seat growth in existing enterprise accounts [1,2]

Churn was contained: three enterprise accounts left, totaling $212K ARR [3].`;

const demo: DemoModule = {
  meta: {
    title: 'AI answer',
    slug: 'ai-answer',
    category: 'AI & Agent',
    description: 'A sourced assistant answer: source cards, streamed text with citation chips that preview their source, copy, regenerate, feedback and follow-ups.',
  },
  demos: [
    {
      name: 'Finished answer',
      code: `<AiAnswer
  question="How did retention move in Q3?"
  sources={sources}
  answer={answer}
  animate={false}
  followUps={['What drove enterprise churn?', 'Compare with Q3 last year']}
  meta="Answered in 4.6s"
  onRegenerate={…}
  onFeedback={(value, reason) => track(value, reason)}
/>`,
      Component: () => (
        <AiAnswer
          question="How did retention move in Q3?"
          sources={sources}
          answer={answer}
          animate={false}
          followUps={['What drove enterprise churn?', 'Compare with Q3 last year']}
          meta="Answered in 4.6s"
          onRegenerate={() => {}}
        />
      ),
    },
    {
      name: 'Streaming',
      code: `const [run, setRun] = useState(0);
<AiAnswer key={run} sources={sources} answer={answer} onStop={…} />`,
      Component: function StreamDemo() {
        const [run, setRun] = useState(0);
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <AiAnswer key={run} question="How did retention move in Q3?" sources={sources} answer={answer} onStop={() => {}} />
            <div>
              <Button size="sm" variant="secondary" onPress={() => setRun((r) => r + 1)}>
                Replay
              </Button>
            </div>
          </div>
        );
      },
    },
  ],
};

export default demo;
