import type { DemoModule } from '../../internal/demo';
import { Markdown } from './Markdown';

const md = `## Q3 summary

Revenue closed at **$4.82M**, up *14.2%* QoQ. Key drivers:

1. Enterprise renewals (+$310K)
2. Usage-based add-ons
3. Fewer downgrades in EMEA

| Segment | Q2 | Q3 | Change |
|---|--:|--:|--:|
| Enterprise | $2.61M | $3.02M | +15.7% |
| Mid-market | $1.30M | $1.42M | +9.2% |
| Self-serve | $0.36M | $0.38M | +5.6% |

> Self-serve churn rose to 3.1% in September.

\`\`\`sql
select segment, sum(amount) from deals where quarter = 'Q3' group by 1;
\`\`\`
`;

const demo: DemoModule = {
  meta: {
    title: 'Markdown',
    slug: 'markdown',
    category: 'AI & Agent',
    description:
      'Safe Markdown renderer: marked tokens are mapped to React elements. Raw HTML and unsafe URLs are never rendered as markup.',
  },
  demos: [
    {
      name: 'Rich answer',
      code: `<Markdown>{source}</Markdown>`,
      Component: () => (
        <div style={{ maxWidth: 600 }}>
          <Markdown>{md}</Markdown>
        </div>
      ),
    },
    {
      name: 'Raw HTML is inert',
      code: `<Markdown>{'<script>alert(1)</script> [click](javascript:alert(1))'}</Markdown>`,
      Component: () => (
        <div style={{ maxWidth: 600 }}>
          <Markdown>{'<script>alert(1)</script>\n\n[click me](javascript:alert(1))'}</Markdown>
        </div>
      ),
    },
  ],
};

export default demo;
