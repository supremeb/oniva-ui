import type { DemoModule } from '../../internal/demo';
import { CodeBlock } from './CodeBlock';

const py = `import pandas as pd

df = pd.read_csv("q3_revenue.csv", parse_dates=["closed_at"])
by_segment = df.groupby("segment")["amount"].sum().sort_values(ascending=False)
print(by_segment.head())`;

const demo: DemoModule = {
  meta: {
    title: 'Code Block',
    slug: 'code-block',
    category: 'AI & Agent',
    description: 'Code panel with filename, language label and copy-to-clipboard.',
  },
  demos: [
    {
      name: 'With header',
      code: `<CodeBlock filename="q3_revenue.py" language="python" code={code} />`,
      Component: () => (
        <div style={{ maxWidth: 560 }}>
          <CodeBlock filename="q3_revenue.py" language="python" code={py} />
        </div>
      ),
    },
    {
      name: 'Bare',
      code: `<CodeBlock code="npm i @oniva/ui" />`,
      Component: () => (
        <div style={{ maxWidth: 360 }}>
          <CodeBlock code="npm i @oniva/ui" />
        </div>
      ),
    },
  ],
};

export default demo;
