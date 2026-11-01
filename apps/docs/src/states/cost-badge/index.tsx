import { CostBadge, UsageMeter } from 'oniva-ui';
import type { StateModule } from '../types';

const breakdown = [
  { label: 'Atlas 2', value: 193.69 },
  { label: 'Nova Pro', value: 87.47 },
  { label: 'Embeddings', value: 31.24 },
];

const manyModels = [
  { label: 'Atlas 2', value: 193.69 },
  { label: 'Nova Pro', value: 87.47 },
  { label: 'Lumen Fast', value: 41.02 },
  { label: 'Quill Reasoner', value: 38.8 },
  { label: 'Embeddings', value: 31.24 },
  { label: 'Image generation', value: 12.75 },
  { label: 'Speech to text', value: 6.4 },
  { label: 'Moderation', value: 1.13 },
];

const mod: StateModule = {
  slug: 'cost-badge',
  title: 'Cost badge & usage meter',
  width: 420,
  groups: [
    {
      label: 'Badge',
      states: [
        { id: 'badge-cost-only', label: 'cost only', render: () => <CostBadge cost={0.043} /> },
        { id: 'badge-with-tokens', label: 'cost + tokens', render: () => <CostBadge cost={0.043} tokens={12400} /> },
        { id: 'badge-zero', label: 'zero cost, zero tokens', render: () => <CostBadge cost={0} tokens={0} /> },
        { id: 'badge-tiny', label: 'sub-tenth-of-a-cent', render: () => <CostBadge cost={0.0004} tokens={212} /> },
        { id: 'badge-one-token', label: 'one token', render: () => <CostBadge cost={0.0001} tokens={1} /> },
        { id: 'badge-large', label: 'large run', render: () => <CostBadge cost={1284.5} tokens={48200000} /> },
        {
          id: 'badge-scale',
          label: 'token scale (999, 1.2k, 184k, 2.4M)',
          render: () => (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
              <CostBadge cost={0.002} tokens={999} />
              <CostBadge cost={0.011} tokens={1240} />
              <CostBadge cost={0.612} tokens={184000} />
              <CostBadge cost={3.18} tokens={2400000} />
            </div>
          ),
        },
      ],
    },
    {
      label: 'Badge locale',
      states: [
        { id: 'badge-eur', label: 'EUR', render: () => <CostBadge cost={0.043} tokens={12400} currency="EUR" /> },
        { id: 'badge-de', label: 'de-DE, EUR', render: () => <CostBadge cost={1284.5} tokens={12400} locale="de-DE" currency="EUR" /> },
        { id: 'badge-jpy', label: 'JPY (no decimals natively)', render: () => <CostBadge cost={6.45} tokens={12400} locale="ja-JP" currency="JPY" /> },
      ],
    },
    {
      label: 'Meter',
      states: [
        {
          id: 'meter-low',
          label: 'low usage',
          render: () => <UsageMeter spent={48.2} budget={500} period="Oct 1 - Oct 31" breakdown={breakdown.slice(0, 2)} />,
        },
        {
          id: 'meter-typical',
          label: 'typical (62%)',
          render: () => <UsageMeter spent={312.4} budget={500} period="Oct 1 - Oct 31" breakdown={breakdown} />,
        },
        {
          id: 'meter-warning',
          label: 'warning (>= 80%)',
          render: () => <UsageMeter spent={412.5} budget={500} period="Oct 1 - Oct 31" breakdown={breakdown} />,
        },
        {
          id: 'meter-exact',
          label: 'at the cap',
          render: () => <UsageMeter spent={500} budget={500} period="Oct 1 - Oct 31" breakdown={breakdown} />,
        },
        {
          id: 'meter-over',
          label: 'over budget',
          render: () => <UsageMeter spent={538.9} budget={500} period="Oct 1 - Oct 31" breakdown={breakdown} />,
        },
        { id: 'meter-zero-budget', label: 'zero budget, spend recorded', render: () => <UsageMeter spent={12.4} budget={0} period="Oct 1 - Oct 31" /> },
        { id: 'meter-zero', label: 'nothing spent', render: () => <UsageMeter spent={0} budget={500} period="Oct 1 - Oct 31" /> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'meter-minimal', label: 'no period, no breakdown', render: () => <UsageMeter spent={312.4} budget={500} /> },
        {
          id: 'meter-custom-title',
          label: 'custom title',
          render: () => <UsageMeter title="Northwind Labs workspace" spent={1840.15} budget={2500} period="Q4 2026" breakdown={breakdown} />,
        },
        {
          id: 'meter-many',
          label: 'long breakdown wraps',
          render: () => <UsageMeter spent={412.5} budget={500} period="Oct 1 - Oct 31" breakdown={manyModels} />,
        },
        {
          id: 'meter-long-title',
          label: 'long title and period',
          render: () => (
            <UsageMeter
              title="Northwind Labs production inference spend across every region"
              spent={312.4}
              budget={500}
              period="Oct 1, 2026 - Oct 31, 2026 (billing cycle 10)"
              breakdown={breakdown}
            />
          ),
        },
        {
          id: 'meter-large',
          label: 'large numbers',
          render: () => <UsageMeter spent={128450.75} budget={150000} period="FY2026" breakdown={[{ label: 'Atlas 2', value: 80210.4 }, { label: 'Nova Pro', value: 48240.35 }]} />,
        },
      ],
    },
    {
      label: 'Meter locale',
      states: [
        {
          id: 'meter-de',
          label: 'de-DE, EUR',
          render: () => <UsageMeter locale="de-DE" currency="EUR" spent={1312.4} budget={1500} period="1. Okt. - 31. Okt." breakdown={breakdown} />,
        },
      ],
    },
  ],
  missing: [
    'badge loading / pending cost (no status prop)',
    'meter with no cap (budget is required; zero budget renders as over)',
    'meter threshold override (warning at 80% is fixed)',
    'badge or meter error / unavailable-cost state',
  ],
};

export default mod;
