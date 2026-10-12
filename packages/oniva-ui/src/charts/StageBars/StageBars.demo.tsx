import type { DemoModule } from '../../internal/demo';
import { ChartCard } from '../ChartCard';
import { StageBars, type StageSegment } from './StageBars';

const stages = [
  { id: 'awake', label: 'Awake', tone: 10 },
  { id: 'rem', label: 'REM', tone: 6 },
  { id: 'light', label: 'Light', tone: 3 },
  { id: 'deep', label: 'Deep', tone: 5 },
];
const plan: [string, number][] = [
  ['awake', 12],
  ['light', 38],
  ['deep', 52],
  ['light', 24],
  ['rem', 18],
  ['light', 36],
  ['deep', 44],
  ['light', 28],
  ['rem', 26],
  ['light', 30],
  ['awake', 6],
  ['light', 34],
  ['rem', 34],
  ['light', 22],
  ['deep', 10],
  ['light', 30],
  ['rem', 36],
  ['awake', 8],
  ['light', 12],
];
let t = 0;
const segments: StageSegment[] = plan.map(([stage, len]) => {
  const s = { stage, start: t, end: t + len };
  t += len;
  return s;
});

const demo: DemoModule = {
  meta: {
    title: 'Stage bars',
    slug: 'stage-bars',
    category: 'Charts',
    description:
      'Stage timeline (hypnogram): one row per stage with rounded time blocks, ideal for sleep or pipeline stages.',
  },
  demos: [
    {
      name: 'Sleep stages',
      code: `<StageBars stages={[{ id: 'awake', label: 'Awake', tone: 10 }, …]} segments={[{ stage: 'awake', start: 0, end: 12 }, …]} startClock={{ hour: 23, minute: 10 }} />`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 680 }}>
          <ChartCard title="Sleep stages" value="8h 20m" unit="11:10 PM to 7:30 AM">
            <StageBars stages={stages} segments={segments} startClock={{ hour: 23, minute: 10 }} />
          </ChartCard>
        </div>
      ),
    },
  ],
};
export default demo;
