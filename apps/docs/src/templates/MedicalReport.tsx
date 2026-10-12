import * as stylex from '@stylexjs/stylex';
import { Activity, Droplet, HeartPulse, Pill, Stethoscope, Thermometer } from 'lucide-react';
import {
  ActivityWidget,
  Badge,
  Button,
  CategoryBar,
  ChartCard,
  ChartLegend,
  DescriptionItem,
  DescriptionList,
  LayoutShell,
  LineChart,
  ProfileCard,
  SleepScoreWidget,
  StatCard,
  StepsWidget,
  type SleepNight,
  type StepsWeek,
} from 'oniva-ui';
import { PageTitle, TemplateSidebar } from './shared';

const styles = stylex.create({
  grid: {
    alignItems: 'start',
    display: 'grid',
    gap: 16,
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 900px)': 'repeat(2, minmax(0, 1fr))',
      '@media (min-width: 1280px)': 'repeat(3, minmax(0, 1fr))',
    },
  },
  span2: { gridColumn: { default: 'auto', '@media (min-width: 1280px)': 'span 2' } },
  stats: {
    display: 'grid',
    gap: 16,
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    marginBlockEnd: 16,
  },
  stack: { display: 'flex', flexDirection: 'column', gap: 16 },
});

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const mk = (label: string, steps: number[]): StepsWeek => ({
  label,
  data: days.map((day, i) => ({ day, steps: steps[i] ?? 0 })),
});
const weeks = [
  mk('29 Sep to 5 Oct', [7240, 6810, 9120, 5330, 8460, 10240, 3980]),
  mk('6 Oct to 12 Oct', [8420, 7180, 8650, 9870, 11240, 7620, 4890]),
];
const nights: SleepNight[] = [
  {
    label: 'Sun, 11 Oct',
    score: 92,
    factors: [
      { label: 'Duration', detail: '7h 35m', score: 47, max: 50 },
      { label: 'Bedtime', detail: '15m earlier', score: 27, max: 30 },
      { label: 'Interruptions', detail: '2 wake-ups', score: 18, max: 20 },
    ],
  },
];
const vitals = [
  { day: 'Mon', hr: 62, sys: 118 },
  { day: 'Tue', hr: 64, sys: 121 },
  { day: 'Wed', hr: 61, sys: 117 },
  { day: 'Thu', hr: 66, sys: 124 },
  { day: 'Fri', hr: 63, sys: 119 },
  { day: 'Sat', hr: 60, sys: 116 },
  { day: 'Sun', hr: 61, sys: 118 },
];
const vs = [
  { key: 'hr', label: 'Resting HR (bpm)', tone: 3 },
  { key: 'sys', label: 'Systolic (mmHg)', tone: 6 },
];
const details = [
  { label: 'Date of birth', value: '28 July, 1997' },
  { label: 'Blood type', value: 'A rh+' },
  { label: 'Primary doctor', value: 'Dr. Elena Marsh' },
];

export function MedicalReport() {
  return (
    <LayoutShell
      sidebar={
        <TemplateSidebar
          active="medical-report"
          workspace="Northside Clinic"
          account={{ name: 'Dr. Elena Marsh', email: 'emarsh@northside.health' }}
        />
      }
      header={
        <PageTitle title="Mira Okonkwo · Health report" sub="Reviewed Oct 12, 2026">
          <Button size="sm" variant="secondary">
            Download PDF
          </Button>
        </PageTitle>
      }
    >
      <div {...stylex.props(styles.stats)}>
        <StatCard
          label="Resting heart rate"
          value="61 bpm"
          delta={-2.1}
          invertDelta
          deltaLabel="vs last week"
          icon={<HeartPulse size={16} />}
          tone={3}
          trend={[66, 64, 65, 63, 62, 62, 61]}
        />
        <StatCard
          label="Blood pressure"
          value="118/76"
          delta={-1.4}
          invertDelta
          deltaLabel="vs last week"
          icon={<Activity size={16} />}
          tone={6}
          trend={[124, 121, 122, 119, 120, 118, 118]}
        />
        <StatCard
          label="Temperature"
          value="36.7 C"
          delta={0}
          deltaLabel="stable"
          icon={<Thermometer size={16} />}
          tone={4}
        />
        <StatCard
          label="HbA1c"
          value="5.4%"
          delta={-0.2}
          invertDelta
          deltaLabel="vs last test"
          icon={<Droplet size={16} />}
          tone={5}
        />
      </div>
      <div {...stylex.props(styles.grid)}>
        <ProfileCard name="Mira Okonkwo" details={details} />
        <ActivityWidget
          move={{ value: 486, goal: 600 }}
          exercise={{ value: 32, goal: 45 }}
          running={{ value: 5.2, goal: 8 }}
        />
        <SleepScoreWidget nights={nights} />
        <ChartCard
          title="Vitals this week"
          legend={<ChartLegend items={vs as never} />}
          xstyle={styles.span2}
        >
          <LineChart data={vitals} index="day" series={vs} />
        </ChartCard>
        <StepsWidget weeks={weeks} defaultIndex={1} height={180} />
        <div {...stylex.props(styles.stack, styles.span2)}>
          <DescriptionList title="Care summary" columns={2}>
            <DescriptionItem icon={<Stethoscope size={16} />} label="Next appointment">
              Oct 28, 9:30 AM
            </DescriptionItem>
            <DescriptionItem icon={<Pill size={16} />} label="Medication">
              Levothyroxine 25 mcg daily
            </DescriptionItem>
            <DescriptionItem icon={<Activity size={16} />} label="Diagnosis">
              Hypothyroidism, well controlled
            </DescriptionItem>
            <DescriptionItem icon={<HeartPulse size={16} />} label="Risk level">
              <Badge variant="success" dot>
                Low
              </Badge>
            </DescriptionItem>
          </DescriptionList>
          <ChartCard title="Glucose control" value="Within range" unit="14 day average">
            <CategoryBar
              showLabels
              marker={72}
              segments={[
                { value: 40, tone: 3, label: 'Low' },
                { value: 40, tone: 7, label: 'Target' },
                { value: 20, tone: 8, label: 'High' },
              ]}
            />
          </ChartCard>
        </div>
      </div>
    </LayoutShell>
  );
}
