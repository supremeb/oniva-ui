import type { DemoModule } from '../../internal/demo';
import { MostActiveDays } from './MostActiveDays';

/** Deterministic daily steps for 2026. */
function makeData() {
  const out: Record<string, number> = {};
  let s = 7;
  for (let m = 0; m < 12; m++) {
    const n = new Date(Date.UTC(2026, m + 1, 0)).getUTCDate();
    for (let d = 1; d <= n; d++) {
      s = (s * 1103515245 + 12345) % 2147483648;
      const r = s / 2147483648;
      const date = `2026-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      if (new Date(Date.UTC(2026, m, d)) > new Date(Date.UTC(2026, 9, 11))) continue;
      out[date] = r < 0.1 ? 0 : Math.round(2000 + r * 10500);
    }
  }
  return out;
}
const data = makeData();

const demo: DemoModule = {
  meta: {
    title: 'MostActiveDays',
    slug: 'most-active-days',
    category: 'Widgets',
    description: 'Year of day buttons grouped by month, heat-coloured by steps, with a month switcher.',
  },
  demos: [
    {
      name: 'Year view',
      code: `<MostActiveDays year={2026} data={stepsByDate} defaultMonth={5} />`,
      Component: () => (
        <div style={{ maxWidth: 420 }}>
          <MostActiveDays year={2026} data={data} defaultMonth={5} />
        </div>
      ),
    },
    {
      name: 'Lower goal',
      code: `<MostActiveDays year={2026} data={stepsByDate} goal={7500} defaultMonth={8} />`,
      Component: () => (
        <div style={{ maxWidth: 420 }}>
          <MostActiveDays year={2026} data={data} goal={7500} defaultMonth={8} />
        </div>
      ),
    },
  ],
};

export default demo;
