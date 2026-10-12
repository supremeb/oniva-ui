import type { DemoModule } from '../../internal/demo';
import { Questionnaire } from './Questionnaire';

const demo: DemoModule = {
  meta: {
    title: 'Questionnaire',
    slug: 'questionnaire',
    category: 'AI & Agent',
    description:
      'Clarifying questions an agent asks in plan mode, with single and multi-select option cards.',
  },
  demos: [
    {
      name: 'Plan-mode questions',
      code: `<Questionnaire questions={questions} onSubmit={(answers) => …} />`,
      Component: () => (
        <div style={{ maxWidth: 480 }}>
          <Questionnaire
            questions={[
              {
                id: 'period',
                prompt: 'Which period should I analyze?',
                options: [
                  { id: 'q3', label: 'Q3 2026', description: 'Jul 1 – Sep 30' },
                  { id: 'ytd', label: 'Year to date', description: 'Jan 1 – Sep 30' },
                ],
              },
              {
                id: 'cuts',
                prompt: 'How should I break it down?',
                multiple: true,
                options: [
                  { id: 'segment', label: 'By segment' },
                  { id: 'region', label: 'By region' },
                  { id: 'rep', label: 'By sales rep' },
                ],
              },
            ]}
          />
        </div>
      ),
    },
  ],
};

export default demo;
