import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../Button';
import { Leaderboard, type LeaderboardEntry } from './Leaderboard';

const start: LeaderboardEntry[] = [
  { id: 'pn', name: 'Priya Nair', subtitle: 'Enterprise · EMEA', score: 482000, previousRank: 2 },
  { id: 'mo', name: 'Marcus Okafor', subtitle: 'Mid-market · NA', score: 451500, previousRank: 1 },
  { id: 'ls', name: 'Lena Schmidt', subtitle: 'Enterprise · DACH', score: 397200, previousRank: 3 },
  { id: 'dk', name: 'Daniel Kim', subtitle: 'SMB · APAC', score: 301800, previousRank: 5 },
  { id: 'ar', name: 'Aisha Rahman', subtitle: 'Mid-market · MEA', score: 288900, previousRank: 4 },
];

function Board() {
  const [entries, setEntries] = useState(start);
  return (
    <div>
      <Leaderboard entries={entries} scoreLabel="in closed revenue" scoreFormat={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }} aria-label="Sales leaderboard, Q4" />
      <p>
        <Button variant="secondary" onPress={() => setEntries((es) => es.map((e) => (e.id === 'ar' ? { ...e, score: e.score + 120000 } : e)))}>
          Aisha closes a $120,000 deal
        </Button>
      </p>
    </div>
  );
}

const demo: DemoModule = {
  meta: { title: 'Leaderboard', slug: 'leaderboard', category: 'Data display', description: 'Ranked list with rank-change arrows, rolling scores and animated reordering.' },
  demos: [
    {
      name: 'Sales leaderboard',
      code: `<Leaderboard
  aria-label="Sales leaderboard, Q4"
  scoreFormat={{ style: 'currency', currency: 'USD', maximumFractionDigits: 0 }}
  entries={[{ id: 'pn', name: 'Priya Nair', score: 482000, previousRank: 2 }]}
/>`,
      Component: Board,
    },
  ],
};
export default demo;
