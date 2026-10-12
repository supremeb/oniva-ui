// Shared sample data for chart demos. Not exported from the library.

export const revenueByMonth = [
  { month: 'Jan', revenue: 42800, expenses: 31200 },
  { month: 'Feb', revenue: 46100, expenses: 32800 },
  { month: 'Mar', revenue: 51900, expenses: 34100 },
  { month: 'Apr', revenue: 49600, expenses: 35900 },
  { month: 'May', revenue: 57300, expenses: 36400 },
  { month: 'Jun', revenue: 63200, expenses: 38800 },
  { month: 'Jul', revenue: 61400, expenses: 40100 },
  { month: 'Aug', revenue: 68700, expenses: 41300 },
  { month: 'Sep', revenue: 73900, expenses: 43700 },
  { month: 'Oct', revenue: 71200, expenses: 44200 },
  { month: 'Nov', revenue: 79800, expenses: 46500 },
  { month: 'Dec', revenue: 88400, expenses: 49100 },
];

export const stepsByWeekday = [
  { day: 'Mon', steps: 8420 },
  { day: 'Tue', steps: 3180 },
  { day: 'Wed', steps: 2650 },
  { day: 'Thu', steps: 9870 },
  { day: 'Fri', steps: 11240 },
  { day: 'Sat', steps: 7620 },
  { day: 'Sun', steps: 4890 },
];

export const funnelSteps = [
  { label: 'Visitors', value: 48200 },
  { label: 'Signups', value: 12640 },
  { label: 'Activated', value: 7310 },
  { label: 'Trial started', value: 3920 },
  { label: 'Paid', value: 1480 },
];

export const sleepStages = [
  { label: 'Deep', value: 96, tone: 5 },
  { label: 'REM', value: 112, tone: 6 },
  { label: 'Light', value: 214, tone: 3 },
  { label: 'Awake', value: 18, tone: 10 },
];

export const tokenUsage = [
  { day: 'Mon', input: 1.42, output: 0.46, cached: 0.88 },
  { day: 'Tue', input: 1.85, output: 0.61, cached: 1.12 },
  { day: 'Wed', input: 2.1, output: 0.72, cached: 1.34 },
  { day: 'Thu', input: 1.76, output: 0.58, cached: 1.2 },
  { day: 'Fri', input: 2.34, output: 0.83, cached: 1.51 },
  { day: 'Sat', input: 0.94, output: 0.31, cached: 0.52 },
  { day: 'Sun', input: 0.78, output: 0.27, cached: 0.41 },
];

export const trafficSources = [
  { label: 'Organic search', value: 18420 },
  { label: 'Direct', value: 11260 },
  { label: 'Referral', value: 7840 },
  { label: 'Social', value: 4310 },
  { label: 'Email', value: 2970 },
];

export const topPages = [
  { name: '/pricing', value: 12480 },
  { name: '/docs/getting-started', value: 9215 },
  { name: '/blog/agent-design-systems', value: 6730 },
  { name: '/changelog', value: 4102 },
  { name: '/templates/dashboard', value: 3366 },
  { name: '/login', value: 2208 },
];

export const skillsRadar = [
  { skill: 'Research', you: 82, team: 68 },
  { skill: 'Visual design', you: 91, team: 74 },
  { skill: 'Prototyping', you: 76, team: 71 },
  { skill: 'Engineering', you: 64, team: 52 },
  { skill: 'Strategy', you: 70, team: 77 },
  { skill: 'Writing', you: 58, team: 63 },
];

export const customersScatter = [
  { name: 'Northwind', orders: 12, spend: 4.2, seats: 40 },
  { name: 'Acme Corp', orders: 34, spend: 12.8, seats: 120 },
  { name: 'Globex', orders: 22, spend: 7.5, seats: 64 },
  { name: 'Initech', orders: 9, spend: 2.1, seats: 18 },
  { name: 'Umbrella', orders: 41, spend: 18.9, seats: 210 },
  { name: 'Hooli', orders: 28, spend: 15.3, seats: 150 },
  { name: 'Stark Ind.', orders: 17, spend: 9.8, seats: 88 },
  { name: 'Wayne Ent.', orders: 6, spend: 3.4, seats: 25 },
  { name: 'Wonka', orders: 15, spend: 5.9, seats: 36 },
  { name: 'Soylent', orders: 31, spend: 10.2, seats: 96 },
  { name: 'Cyberdyne', orders: 24, spend: 13.7, seats: 132 },
  { name: 'Pied Piper', orders: 11, spend: 6.4, seats: 52 },
];

export const sankeyFlows = {
  nodes: [
    { id: 'search', label: 'Search' },
    { id: 'social', label: 'Social' },
    { id: 'direct', label: 'Direct' },
    { id: 'landing', label: 'Landing page' },
    { id: 'docs', label: 'Docs' },
    { id: 'signup', label: 'Signup' },
    { id: 'bounce', label: 'Bounced' },
    { id: 'paid', label: 'Paid plan' },
    { id: 'free', label: 'Free plan' },
  ],
  links: [
    { source: 'search', target: 'landing', value: 420 },
    { source: 'search', target: 'docs', value: 260 },
    { source: 'social', target: 'landing', value: 210 },
    { source: 'direct', target: 'landing', value: 180 },
    { source: 'direct', target: 'docs', value: 90 },
    { source: 'landing', target: 'signup', value: 310 },
    { source: 'landing', target: 'bounce', value: 500 },
    { source: 'docs', target: 'signup', value: 160 },
    { source: 'docs', target: 'bounce', value: 190 },
    { source: 'signup', target: 'paid', value: 120 },
    { source: 'signup', target: 'free', value: 350 },
  ],
};

export const stageBars = [
  { label: 'Design', value: 86 },
  { label: 'Build', value: 64 },
  { label: 'Review', value: 41 },
  { label: 'Ship', value: 18 },
];

/** Deterministic pseudo-random uptime/status history for Tracker demos. */
export function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** One year of daily contribution counts ending 2026-10-11 (inclusive). */
export function contributionYear(end = new Date(Date.UTC(2026, 9, 11))) {
  const rnd = seeded(42);
  const out: { date: string; value: number }[] = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(end.getTime() - i * 86400000);
    const dow = d.getUTCDay();
    const weekend = dow === 0 || dow === 6;
    const burst = Math.sin(i / 17) > 0.3 ? 1.6 : 0.7;
    const r = rnd();
    const v = r < (weekend ? 0.6 : 0.22) ? 0 : Math.round(rnd() * 9 * burst * (weekend ? 0.5 : 1));
    out.push({ date: d.toISOString().slice(0, 10), value: v });
  }
  return out;
}

export const uptimeHistory = (() => {
  const rnd = seeded(7);
  return Array.from({ length: 60 }, (_, i) => {
    const r = rnd();
    const status = r > 0.965 ? 'down' : r > 0.9 ? 'degraded' : 'up';
    return { label: `Day ${i + 1}`, status } as {
      label: string;
      status: 'up' | 'degraded' | 'down';
    };
  });
})();
