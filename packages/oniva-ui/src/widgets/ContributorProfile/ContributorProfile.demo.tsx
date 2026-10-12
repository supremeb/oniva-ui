import type { DemoModule } from '../../internal/demo';
import { ContributorProfile } from './ContributorProfile';

function makeActivity() {
  const out: { date: string; value: number }[] = [];
  let s = 11;
  const end = Date.UTC(2026, 9, 11);
  for (let i = 364; i >= 0; i--) {
    s = (s * 1664525 + 1013904223) % 4294967296;
    const r = s / 4294967296;
    const d = new Date(end - i * 86400000);
    const weekend = d.getUTCDay() === 0 || d.getUTCDay() === 6;
    out.push({
      date: d.toISOString().slice(0, 10),
      value: r < (weekend ? 0.7 : 0.3) ? 0 : Math.round(r * 10),
    });
  }
  return out;
}
const activity = makeActivity();
const stats = [
  { label: 'Sponsors', value: 42 },
  { label: 'Merged PRs', value: 318 },
  { label: 'Reviews', value: 764 },
  { label: 'Repos', value: 19 },
];

const demo: DemoModule = {
  meta: {
    title: 'Contributor profile',
    slug: 'contributor-profile',
    category: 'Widgets',
    description:
      'Contributor card with PRO chip, yearly $ total + delta, stat tiles and a contribution heatmap.',
  },
  demos: [
    {
      name: 'Pro contributor',
      code: `<ContributorProfile
  name="Ana Lindqvist"
  handle="analind"
  pro
  amount={5520}
  delta={14.8}
  year={2026}
  stats={stats}
  activity={activity}
/>`,
      Component: () => (
        <div style={{ maxWidth: 560 }}>
          <ContributorProfile
            name="Ana Lindqvist"
            handle="analind"
            pro
            amount={5520}
            delta={14.8}
            year={2026}
            stats={stats}
            activity={activity}
          />
        </div>
      ),
    },
    {
      name: 'Monthly view, declining',
      code: `<ContributorProfile name="Kofi Mensah" handle="kofim" amount={1280} delta={-6.3} stats={stats} activity={activity} defaultRange="monthly" />`,
      Component: () => (
        <div style={{ maxWidth: 560 }}>
          <ContributorProfile
            name="Kofi Mensah"
            handle="kofim"
            amount={1280}
            delta={-6.3}
            year={2026}
            stats={stats}
            activity={activity}
            defaultRange="monthly"
          />
        </div>
      ),
    },
  ],
};

export default demo;
