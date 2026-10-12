import type { DemoModule } from '../../internal/demo';
import { skillsRadar } from '../_data/datasets';
import { ChartCard } from '../ChartCard';
import { ChartLegend } from '../ChartLegend';
import { RadarChart } from './RadarChart';

const demo: DemoModule = {
  meta: {
    title: 'Radar chart',
    slug: 'radar-chart',
    category: 'Charts',
    description:
      'Spider chart with grid rings, focusable points and side-by-side comparison polygons.',
  },
  demos: [
    {
      name: 'Single series',
      code: `<RadarChart data={skills} index="skill" series={[{ key: 'you', label: 'You', tone: 5 }]} max={100} />`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <ChartCard title="Skill profile">
            <RadarChart
              data={skillsRadar}
              index="skill"
              series={[{ key: 'you', label: 'You', tone: 5 }]}
              max={100}
            />
          </ChartCard>
        </div>
      ),
    },
    {
      name: 'Comparison',
      code: `<RadarChart data={skills} index="skill" max={100}
  series={[{ key: 'you', label: 'You', tone: 5 }, { key: 'team', label: 'Team average', tone: 1 }]} />`,
      Component: () => (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <ChartCard
            title="You vs team"
            legend={
              <ChartLegend
                items={[
                  { label: 'You', tone: 5 },
                  { label: 'Team average', tone: 1 },
                ]}
              />
            }
          >
            <RadarChart
              data={skillsRadar}
              index="skill"
              max={100}
              series={[
                { key: 'you', label: 'You', tone: 5 },
                { key: 'team', label: 'Team average', tone: 1 },
              ]}
            />
          </ChartCard>
        </div>
      ),
    },
  ],
};
export default demo;
