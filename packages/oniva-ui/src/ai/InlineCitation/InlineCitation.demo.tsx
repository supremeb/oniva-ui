import type { DemoModule } from '../../internal/demo';
import { InlineCitation } from './InlineCitation';

const demo: DemoModule = {
  meta: {
    title: 'Inline citation',
    slug: 'inline-citation',
    category: 'AI & Agent',
    description: 'Footnote pill inside generated text. Hover or focus previews the source with an excerpt.',
  },
  demos: [
    {
      name: 'In a paragraph',
      code: `Net revenue retention hit 118%<InlineCitation index={1} title="..." url="..." snippet="..." />`,
      Component: () => (
        <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0, maxWidth: 520 }}>
          Net revenue retention reached 118% in Q3
          <InlineCitation index={1} title="Northwind Q3 2026 investor letter" url="https://www.northwind.example/investors/q3-2026" date="Oct 2, 2026" snippet="Net revenue retention was 118%, up from 112% in Q2, driven by seat expansion in the Scale tier." />
          , while gross churn fell to 1.9%
          <InlineCitation index={2} title="SaaS Benchmarks Report 2026" url="https://www.saastr.com/benchmarks-2026" date="Sep 18, 2026" snippet="Median gross churn for mid-market SaaS is 2.8% annually." />
          .
        </p>
      ),
    },
  ],
};

export default demo;
