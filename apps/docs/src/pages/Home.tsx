import * as stylex from '@stylexjs/stylex';
import {
  ArrowRight,
  Bot,
  Columns3,
  HeartPulse,
  Landmark,
  Settings as SettingsIcon,
  Star,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AgentLimits,
  AgentProgress,
  AlertsFeed,
  AreaChart,
  Accordion,
  AccordionItem,
  ActivityWidget,
  BarChart,
  Badge,
  ChartCard,
  ComposerLoader,
  Composer,
  ContributorProfile,
  ContributionHeatmap,
  DataTable,
  DonutChart,
  Gauge,
  LinkButton,
  ProfileCard,
  RadarChart,
  Sidebar,
  SidebarAccount,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarSection,
  SleepScoreWidget,
  StepsWidget,
  type SleepNight,
  type StepsWeek,
  type TaskItem,
} from 'oniva-ui';
import type { ColumnDef } from '@tanstack/react-table';
import { CustomerCell, PriceCell, StatusBadgeCell } from 'oniva-ui';
import { accent } from '@oniva-tokens/accent.stylex';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import { radius } from '@oniva-tokens/radius.stylex';
import { shadow } from '@oniva-tokens/shadow.stylex';
import {
  contributionYear,
  revenueByMonth,
  skillsRadar,
  sleepStages,
} from '../../../../packages/oniva-ui/src/charts/_data/datasets';
import {
  customers,
  type Customer,
} from '../../../../packages/oniva-ui/src/components/DataTable/sample-data';
import { CodeBlock } from '../components/CodeBlock';
import { GithubIcon } from '../components/GithubIcon';
import { Preview } from '../components/Preview';
import { demoModules, getDemo } from '../demos';
import { SITE, counts, templates } from '../lib/site';

const BP = '@media (min-width: 800px)';
const fade = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(0.25em)' },
  to: { opacity: 1, transform: 'none' },
});

const styles = stylex.create({
  wrap: {
    marginInline: 'auto',
    maxWidth: 1200,
    paddingInline: { default: 16, [BP]: 32 },
    width: '100%',
  },
  hero: {
    alignItems: 'center',
    backgroundImage: `radial-gradient(60% 55% at 50% 0%, ${colors['--oniva-color-accent-tint']}, transparent 70%)`,
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    paddingBlock: { default: '56px 32px', [BP]: '88px 48px' },
    textAlign: 'center',
  },
  pill: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-xs'],
    color: colors['--oniva-color-text'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-14'],
    gap: 8,
    paddingBlock: 4,
    paddingInline: 6,
    paddingInlineEnd: 12,
    textDecoration: 'none',
  },
  pillNew: {
    backgroundColor: colors['--oniva-color-accent-soft'],
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-accent-soft-fg'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-semibold'],
    letterSpacing: font['--oniva-font-track-label'],
    paddingBlock: 2,
    paddingInline: 8,
  },
  h1: {
    fontSize: { default: font['--oniva-font-size-48'], [BP]: font['--oniva-font-size-72'] },
    fontWeight: font['--oniva-font-weight-medium'],
    letterSpacing: font['--oniva-font-track-hero'],
    lineHeight: 1.08,
    margin: 0,
    maxWidth: 980,
  },
  word: {
    animationDuration: '420ms',
    animationName: { default: fade, '@media (prefers-reduced-motion: reduce)': 'none' },
    color: colors['--oniva-color-text'],
    display: 'inline-block',
    textDecorationColor: accent['--oniva-accent-500'],
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
    textDecorationThickness: '0.07em',
    textUnderlineOffset: '0.18em',
  },
  sub: {
    color: colors['--oniva-color-text-muted'],
    fontSize: { default: font['--oniva-font-size-16'], [BP]: font['--oniva-font-size-18'] },
    lineHeight: 1.55,
    margin: 0,
    maxWidth: 640,
  },
  actions: { display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' },
  tech: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: font['--oniva-font-size-14'],
    gap: '8px 20px',
    justifyContent: 'center',
    paddingBlock: 16,
  },
  techItem: { color: colors['--oniva-color-text'], fontWeight: font['--oniva-font-weight-medium'] },
  techDot: { color: colors['--oniva-color-text-subtle'] },
  masonry: {
    columnCount: { default: 1, '@media (min-width: 700px)': 2, '@media (min-width: 1100px)': 3 },
    columnGap: 16,
    marginBlockStart: 16,
  },
  mItem: { breakInside: 'avoid', marginBlockEnd: 16 },
  clip: { overflowX: 'auto' },
  frame: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-card'],
    display: 'flex',
    height: 440,
    justifyContent: 'center',
    padding: 16,
  },
  section: { paddingBlock: { default: 40, [BP]: 72 } },
  eyebrow: {
    color: colors['--oniva-color-accent-soft-fg'],
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-semibold'],
    letterSpacing: font['--oniva-font-track-label'],
    margin: 0,
    textTransform: 'uppercase',
  },
  h2: {
    fontSize: { default: font['--oniva-font-size-32'], [BP]: font['--oniva-font-size-48'] },
    fontWeight: font['--oniva-font-weight-medium'],
    letterSpacing: font['--oniva-font-track-hero'],
    lineHeight: 1.1,
    margin: '8px 0 12px',
  },
  lead: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-16'],
    lineHeight: 1.55,
    margin: '0 0 28px',
    maxWidth: 620,
  },
  center: { marginInline: 'auto', textAlign: 'center' },
  mini: {
    display: 'grid',
    gap: 14,
    gridTemplateColumns: { default: 'repeat(auto-fill, minmax(min(100%, 240px), 1fr))' },
  },
  miniCard: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: {
      default: colors['--oniva-color-border'],
      ':hover': colors['--oniva-color-border-hover'],
    },
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    overflow: 'hidden',
    textDecoration: 'none',
  },
  miniView: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    display: 'flex',
    height: 150,
    justifyContent: 'center',
    overflow: 'hidden',
    padding: 14,
  },
  miniInner: { maxHeight: '100%', maxWidth: '100%', overflow: 'hidden', width: '100%' },
  miniLabel: {
    alignItems: 'center',
    display: 'flex',
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    justifyContent: 'space-between',
    padding: '10px 14px',
  },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBlockStart: 24 },
  chip: {
    backgroundColor: {
      default: colors['--oniva-color-surface-inset'],
      ':hover': colors['--oniva-color-surface-inset-hover'],
    },
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-13'],
    paddingBlock: 4,
    paddingInline: 10,
    textDecoration: 'none',
  },
  loaderGrid: {
    alignItems: 'center',
    display: 'grid',
    gap: 32,
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 960px)': 'minmax(0, 5fr) minmax(0, 7fr)',
    },
  },
  loaderBody: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-16'],
    lineHeight: 1.55,
    padding: '20px 20px 64px',
  },
  stageBox: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-card'],
    padding: { default: 16, [BP]: 40 },
  },
  charts: {
    display: 'grid',
    gap: 16,
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 700px)': 'repeat(2, minmax(0, 1fr))',
      '@media (min-width: 1100px)': 'repeat(3, minmax(0, 1fr))',
    },
  },
  centerBox: { display: 'flex', justifyContent: 'center', padding: 8 },
  tpl: {
    display: 'grid',
    gap: 16,
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 700px)': 'repeat(2, minmax(0, 1fr))',
      '@media (min-width: 1100px)': 'repeat(3, minmax(0, 1fr))',
    },
  },
  tplCard: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: {
      default: colors['--oniva-color-border'],
      ':hover': colors['--oniva-color-border-hover'],
    },
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    padding: 12,
    textDecoration: 'none',
  },
  tplThumb: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-accent-tint'],
    backgroundImage: `linear-gradient(135deg, ${colors['--oniva-color-accent-tint']}, ${colors['--oniva-color-surface-inset']})`,
    borderRadius: radius['--oniva-radius-lg'],
    color: accent['--oniva-accent-500'],
    display: 'flex',
    height: 140,
    justifyContent: 'center',
  },
  tplTitle: {
    fontSize: font['--oniva-font-size-16'],
    fontWeight: font['--oniva-font-weight-semibold'],
    margin: 0,
  },
  tplDesc: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-14'],
    lineHeight: 1.5,
    margin: '4px 0 0',
  },
  agents: {
    alignItems: 'center',
    display: 'grid',
    gap: 32,
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 960px)': 'repeat(2, minmax(0, 1fr))',
    },
  },
  bullets: {
    color: colors['--oniva-color-text-muted'],
    display: 'grid',
    fontSize: font['--oniva-font-size-16'],
    gap: 10,
    lineHeight: 1.5,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  bulletStrong: {
    color: colors['--oniva-color-text'],
    fontWeight: font['--oniva-font-weight-semibold'],
  },
  cta: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    backgroundImage: `radial-gradient(70% 90% at 50% 0%, ${colors['--oniva-color-accent-tint']}, transparent 70%)`,
    borderRadius: radius['--oniva-radius-card'],
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    padding: { default: '40px 20px', [BP]: '64px 40px' },
    textAlign: 'center',
  },
  faq: { marginInline: 'auto', maxWidth: 760 },
  footer: {
    alignItems: 'center',
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: font['--oniva-font-size-14'],
    gap: 16,
    justifyContent: 'space-between',
    marginBlockStart: 40,
    paddingBlock: 28,
  },
  footLinks: { display: 'flex', flexWrap: 'wrap', gap: 16 },
  footLink: {
    color: colors['--oniva-color-text-muted'],
    textDecoration: { default: 'none', ':hover': 'underline' },
  },
});

const WORDS = ['Dashboards', 'Agent Interfaces', 'Healthcare', 'Finance'] as const;

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => setI((n) => (n + 1) % WORDS.length), 2400);
    return () => clearInterval(id);
  }, []);
  return (
    <span key={i} aria-live="off" {...stylex.props(styles.word)}>
      {WORDS[i]}
    </span>
  );
}

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const mkWeek = (label: string, steps: number[]): StepsWeek => ({
  label,
  data: days.map((day, i) => ({ day, steps: steps[i] ?? 0 })),
});
const weeks = [
  mkWeek('22 Jun to 28 Jun', [6120, 7450, 8040, 9010, 7730, 11820, 5210]),
  mkWeek('29 Jun to 5 Jul', [8420, 3180, 2650, 9870, 11240, 7620, 4890]),
];
const nights: SleepNight[] = [
  {
    label: 'Mon, 5 Jul',
    score: 98,
    factors: [
      { label: 'Duration', detail: '7h 50m', score: 49, max: 50 },
      { label: 'Bedtime', detail: '20m earlier', score: 29, max: 30 },
      { label: 'Interruptions', detail: '5m wake up', score: 20, max: 20 },
    ],
  },
];
const alerts = [
  {
    id: 'a1',
    severity: 'critical' as const,
    title: 'Unusual sign-in blocked',
    description: 'A login from a new device in Lisbon was stopped.',
    date: 'Oct 11',
  },
  {
    id: 'a2',
    severity: 'warning' as const,
    title: 'Invoice INV-2041 overdue',
    description: 'Northwind Traders is 3 days past the $4,820 due date.',
    date: 'Oct 10',
  },
  {
    id: 'a3',
    severity: 'success' as const,
    title: 'Backup completed',
    description: 'Nightly snapshot finished in 6m 12s.',
    date: 'Oct 8',
  },
  {
    id: 'a4',
    severity: 'info' as const,
    title: 'Quarterly report ready',
    description: 'Q3 revenue summary was shared with finance.',
    date: 'Oct 9',
  },
];
const plan: TaskItem[] = [
  { id: '1', label: 'Load q3_revenue.csv', status: 'done' },
  { id: '2', label: 'Group deals by segment', status: 'done' },
  { id: '3', label: 'Compare against Q2 and plan', status: 'running' },
  { id: '4', label: 'Search for industry benchmarks', status: 'pending' },
  { id: '5', label: 'Write the summary', status: 'pending' },
];
const limitsCtx = {
  max: 1_000_000,
  segments: [
    { id: 'sys', label: 'System', value: 42_000, display: '42k', color: 'c5' as const },
    { id: 'msg', label: 'Messages', value: 468_000, display: '468k', color: 'c4' as const },
    { id: 'tool', label: 'Tool results', value: 270_000, display: '270k', color: 'c1' as const },
  ],
};
const limits = [
  { id: '5h', label: '5-hour limit', resetsIn: 'Resets in 2 hr 46 min', percent: 38 },
  { id: 'wk', label: 'Weekly limit', resetsIn: 'Resets Fri 9:00 AM', percent: 74 },
];
const contributions = contributionYear();
const contribStats = [
  { label: 'Sponsors', value: 42 },
  { label: 'Merged PRs', value: 318 },
  { label: 'Reviews', value: 764 },
  { label: 'Repos', value: 19 },
];
const tableCols: ColumnDef<Customer>[] = [
  {
    accessorKey: 'name',
    header: 'Customer',
    cell: ({ row }) => <CustomerCell name={row.original.name} />,
  },
  {
    accessorKey: 'fulfilment',
    header: 'Status',
    enableSorting: false,
    cell: ({ getValue }) => {
      const v = getValue<Customer['fulfilment']>();
      return (
        <StatusBadgeCell
          label={v}
          variant={v === 'Shipped' ? 'success' : v === 'Waiting' ? 'warning' : 'danger'}
        />
      );
    },
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ getValue }) => <PriceCell value={getValue<number>()} />,
  },
];
const models = [
  { id: 'sonnet-5', name: 'Sonnet 5', description: 'Fast and capable for everyday work' },
  { id: 'opus-5', name: 'Opus 5', description: 'Most intelligent, slower' },
];

const MINI = [
  'button',
  'badge',
  'switch',
  'tabs',
  'avatar',
  'progress-bar',
  'slider',
  'checkbox',
  'radio-group',
  'input',
  'segmented-control',
  'tag',
  'alert',
  'accordion',
  'stepper',
  'meter',
  'pagination',
  'breadcrumbs',
  'spinner',
  'toggle-button-group',
  'search-field',
  'kbd',
  'skeleton',
  'select',
];
const tplIcon = {
  dashboard: Landmark,
  'ai-chat': Bot,
  'project-board': Columns3,
  'medical-report': HeartPulse,
  settings: SettingsIcon,
} as const;

const FAQ = [
  [
    'Is it really free?',
    'Yes. oniva/ui is MIT licensed. Use it in personal and commercial projects, no seats and no paywalled components.',
  ],
  [
    'Do I need the StyleX compiler?',
    'No. Import oniva-ui/styles.css once and use the components. The compiler is only needed if you want to pass xstyle overrides.',
  ],
  [
    'How does theming work?',
    'Every color, radius and shadow is a public --oniva-* CSS variable. Wrap your app in ThemeProvider for light, dark or system, plus eight accent colors.',
  ],
  [
    'Is it accessible?',
    'Interactive behavior comes from React Aria, so keyboard, focus and ARIA are handled for you. Charts expose focusable points with tooltips and are axe-tested.',
  ],
  [
    'Why is it good for AI agents?',
    'Props follow one convention (size, tone, variant, isDisabled, xstyle), every component ships a runnable demo with its source, and there are dedicated chat, tool call and reasoning components.',
  ],
  ['What React version does it need?', 'React 19. Components take ref as a regular prop.'],
] as const;

const AGENT_SNIPPET = `# 1. install
npm i oniva-ui react-aria react-aria-components

# 2. once, at your app entry
import 'oniva-ui/styles.css';
import { ThemeProvider } from 'oniva-ui';

# 3. paste into AGENTS.md / CLAUDE.md
Use oniva-ui for all UI. Props: size ('sm'|'md'|'lg'), tone, variant,
isDisabled / isInvalid / isLoading, xstyle. Docs and runnable examples:
${SITE.live}#/components/<slug>`;

export function Home() {
  return (
    <div {...stylex.props(styles.wrap)}>
      <section {...stylex.props(styles.hero)} aria-labelledby="hero-title">
        <Link to="/components/composer-loader" {...stylex.props(styles.pill)}>
          <span {...stylex.props(styles.pillNew)}>NEW</span>
          <span>v0.1 is out</span>
        </Link>
        <h1 id="hero-title" {...stylex.props(styles.h1)}>
          React design system for <RotatingWord />
        </h1>
        <p {...stylex.props(styles.sub)}>
          oniva/ui is an open source React design system with {counts.total} components, including{' '}
          {counts.charts} data charts, {counts.widgets} ready-made widgets and {counts.ai} building
          blocks for AI agents. StyleX, React Aria, light and dark, eight accents.
        </p>
        <div {...stylex.props(styles.actions)}>
          <LinkButton href="#/components" size="lg" variant="primary" endIcon={<ArrowRight size={16} />}>
            Browse components
          </LinkButton>
          <LinkButton
            href={SITE.github}
            size="lg"
            variant="secondary"
            startIcon={<Star size={16} />}
            target="_blank"
            rel="noreferrer"
          >
            Star on GitHub
          </LinkButton>
        </div>
        <div {...stylex.props(styles.tech)} aria-label="Built with">
          <span>
            <span {...stylex.props(styles.techItem)}>React</span> 19
          </span>
          <span {...stylex.props(styles.techDot)} aria-hidden="true">
            ·
          </span>
          <span>
            <span {...stylex.props(styles.techItem)}>StyleX</span> 0.19
          </span>
          <span {...stylex.props(styles.techDot)} aria-hidden="true">
            ·
          </span>
          <span>
            <span {...stylex.props(styles.techItem)}>React Aria</span> 1.22
          </span>
          <span {...stylex.props(styles.techDot)} aria-hidden="true">
            ·
          </span>
          <span>
            <span {...stylex.props(styles.techItem)}>TanStack Table</span> 8
          </span>
        </div>
      </section>

      <section aria-label="Widget showcase" {...stylex.props(styles.masonry)}>
        <div {...stylex.props(styles.mItem)}>
          <ProfileCard
            name="Mira Okonkwo"
            details={[
              { label: 'Date of birth', value: '28 July, 1997' },
              { label: 'Blood type', value: 'A rh+' },
              { label: 'Primary doctor', value: 'Dr. Elena Marsh' },
            ]}
            onAddPhoto={() => {}}
          />
        </div>
        <div {...stylex.props(styles.mItem)}>
          <StepsWidget weeks={weeks} defaultIndex={1} height={200} />
        </div>
        <div {...stylex.props(styles.mItem)}>
          <ActivityWidget
            move={{ value: 486, goal: 600 }}
            exercise={{ value: 32, goal: 45 }}
            running={{ value: 5.2, goal: 8 }}
          />
        </div>
        <div {...stylex.props(styles.mItem)}>
          <AlertsFeed alerts={alerts} maxHeight={320} />
        </div>
        <div {...stylex.props(styles.mItem)}>
          <SleepScoreWidget nights={nights} />
        </div>
        <div {...stylex.props(styles.mItem)}>
          <AgentProgress items={plan} />
        </div>
        <div {...stylex.props(styles.mItem)}>
          <ContributorProfile
            name="Ana Lindqvist"
            handle="analind"
            pro
            amount={5520}
            delta={14.8}
            year={2026}
            stats={contribStats}
            activity={contributions}
          />
        </div>
        <div {...stylex.props(styles.mItem)}>
          <div {...stylex.props(styles.frame)}>
            <Sidebar aria-label="Showcase navigation">
              <SidebarHeader name="Acme Finance" />
              <SidebarContent>
                <SidebarSection>
                  <SidebarItem
                    href="#/templates/dashboard"
                    icon={<Landmark size={18} />}
                    isActive
                    badge="12"
                  >
                    Overview
                  </SidebarItem>
                  <SidebarItem href="#/templates/project-board" icon={<Columns3 size={18} />}>
                    Pipeline
                  </SidebarItem>
                  <SidebarItem href="#/templates/ai-chat" icon={<Bot size={18} />}>
                    Agents
                  </SidebarItem>
                  <SidebarItem href="#/templates/medical-report" icon={<HeartPulse size={18} />}>
                    Reports
                  </SidebarItem>
                </SidebarSection>
              </SidebarContent>
              <SidebarFooter>
                <SidebarAccount name="Aylin Demir" email="aylin@acme.co" />
              </SidebarFooter>
            </Sidebar>
          </div>
        </div>
        <div {...stylex.props(styles.mItem, styles.clip)}>
          <DataTable
            aria-label="Recent customers"
            title="Customers"
            data={customers}
            columns={tableCols}
            itemLabel="customers"
            pageSize={4}
            density="sm"
            searchable={false}
            selectable={false}
            getRowId={(r) => r.id}
          />
        </div>
        <div {...stylex.props(styles.mItem)}>
          <AgentLimits plan="Max (5x)" context={limitsCtx} limits={limits} />
        </div>
        <div {...stylex.props(styles.mItem)}>
          <Composer
            placeholder="Analyze Q3 revenue by segment…"
            models={models}
            model="sonnet-5"
            isStreaming
            hideEffort
            hidePermissions
          />
        </div>
      </section>

      <section {...stylex.props(styles.section)} aria-labelledby="install-title">
        <p {...stylex.props(styles.eyebrow)}>Components</p>
        <h2 id="install-title" {...stylex.props(styles.h2)}>
          Install tons of components
        </h2>
        <p {...stylex.props(styles.lead)}>
          {counts.total} components, each with live examples and copyable code. Every preview below
          is the real thing.
        </p>
        <div {...stylex.props(styles.mini)}>
          {MINI.filter((s) => getDemo(s)).map((slug) => {
            const m = getDemo(slug)!;
            return (
              <Link key={slug} to={`/components/${slug}`} {...stylex.props(styles.miniCard)}>
                <div {...stylex.props(styles.miniView)}>
                  <div {...stylex.props(styles.miniInner)}>
                    <Preview slug={slug} />
                  </div>
                </div>
                <div {...stylex.props(styles.miniLabel)}>
                  {m.meta.title}
                  <ArrowRight size={14} aria-hidden="true" />
                </div>
              </Link>
            );
          })}
        </div>
        <nav
          aria-label="All components"
          {...stylex.props(styles.chips)}
          data-testid="home-component-grid"
        >
          {demoModules.map((m) => (
            <Link
              key={m.meta.slug}
              to={`/components/${m.meta.slug}`}
              {...stylex.props(styles.chip)}
            >
              {m.meta.title}
            </Link>
          ))}
        </nav>
      </section>

      <section {...stylex.props(styles.section)} aria-labelledby="loader-title">
        <div {...stylex.props(styles.loaderGrid)}>
          <div>
            <p {...stylex.props(styles.eyebrow)}>AI & Agent</p>
            <h2 id="loader-title" {...stylex.props(styles.h2)}>
              A loading state worth staring at
            </h2>
            <p {...stylex.props(styles.lead)}>
              ComposerLoader sends a light around the composer while your agent works. It honors
              reduced motion and follows your accent color.
            </p>
            <LinkButton
              href="#/components/composer-loader"
              variant="secondary"
              endIcon={<ArrowRight size={16} />}
            >
              See ComposerLoader
            </LinkButton>
          </div>
          <div {...stylex.props(styles.stageBox)}>
            <ComposerLoader active>
              <div {...stylex.props(styles.loaderBody)}>
                Analyze Q3 revenue by segment and compare it with plan…
              </div>
            </ComposerLoader>
          </div>
        </div>
      </section>

      <section {...stylex.props(styles.section)} aria-labelledby="charts-title">
        <p {...stylex.props(styles.eyebrow)}>Charts</p>
        <h2 id="charts-title" {...stylex.props(styles.h2)}>
          {counts.charts} charts, zero chart library
        </h2>
        <p {...stylex.props(styles.lead)}>
          Hand-built SVG with hover tooltips, focusable points and theme-aware tones.
        </p>
        <div {...stylex.props(styles.charts)}>
          <ChartCard
            title="Revenue"
            value="$753,300"
            unit="this year"
            delta={{ label: '18.2%', trend: 'up' }}
          >
            <AreaChart
              data={revenueByMonth}
              index="month"
              valueFormat="currency"
              series={[{ key: 'revenue', label: 'Revenue', tone: 1 }]}
              height={190}
            />
          </ChartCard>
          <ChartCard title="Revenue by month" value="Last 6 months">
            <BarChart
              data={revenueByMonth.slice(-6)}
              index="month"
              valueFormat="currency"
              series={[{ key: 'revenue', label: 'Revenue', tone: 6 }]}
              height={190}
            />
          </ChartCard>
          <ChartCard title="Sleep stages" value="7h 20m" unit="last night">
            <div {...stylex.props(styles.centerBox)}>
              <DonutChart
                data={sleepStages}
                valueFormat={(m) => `${Math.floor(m / 60)}h ${m % 60}m`}
                centerValue="7h 20m"
                centerLabel="Total"
                size={176}
              />
            </div>
          </ChartCard>
          <ChartCard title="Skill profile">
            <RadarChart
              data={skillsRadar}
              index="skill"
              series={[{ key: 'you', label: 'You', tone: 5 }]}
              max={100}
              height={210}
            />
          </ChartCard>
          <ChartCard title="Monthly budget" value="$7,200" unit="of $10,000">
            <div {...stylex.props(styles.centerBox)}>
              <Gauge value={72} caption="Budget used" tone={6} valueFormat="percent" />
            </div>
          </ChartCard>
          <ChartCard title="Contributions" value="1,146" unit="in the last year">
            <ContributionHeatmap data={contributions} range="monthly" />
          </ChartCard>
        </div>
        <div {...stylex.props(styles.chips)}>
          <LinkButton href="#/charts" variant="secondary" endIcon={<ArrowRight size={16} />}>
            Explore all {counts.charts} charts
          </LinkButton>
        </div>
      </section>

      <section {...stylex.props(styles.section)} aria-labelledby="tpl-title">
        <p {...stylex.props(styles.eyebrow)}>Templates</p>
        <h2 id="tpl-title" {...stylex.props(styles.h2)}>
          Start from a full page
        </h2>
        <p {...stylex.props(styles.lead)}>
          Five complete layouts composed only from oniva/ui components. Copy them, swap the data,
          ship.
        </p>
        <div {...stylex.props(styles.tpl)}>
          {templates.map((t) => {
            const I = tplIcon[t.slug];
            return (
              <Link key={t.slug} to={`/templates/${t.slug}`} {...stylex.props(styles.tplCard)}>
                <div {...stylex.props(styles.tplThumb)}>
                  <I size={44} aria-hidden="true" />
                </div>
                <div>
                  <h3 {...stylex.props(styles.tplTitle)}>{t.title}</h3>
                  <p {...stylex.props(styles.tplDesc)}>{t.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section {...stylex.props(styles.section)} aria-labelledby="agents-title">
        <div {...stylex.props(styles.agents)}>
          <div>
            <p {...stylex.props(styles.eyebrow)}>For coding agents</p>
            <h2 id="agents-title" {...stylex.props(styles.h2)}>
              Built for agents
            </h2>
            <p {...stylex.props(styles.lead)}>
              Your AI pair programmer writes better UI when the API is predictable.
            </p>
            <ul {...stylex.props(styles.bullets)}>
              <li>
                <span {...stylex.props(styles.bulletStrong)}>One convention.</span> size, tone,
                variant, isDisabled and xstyle mean the same thing everywhere.
              </li>
              <li>
                <span {...stylex.props(styles.bulletStrong)}>Runnable examples.</span> Each
                component page ships source that matches the live preview.
              </li>
              <li>
                <span {...stylex.props(styles.bulletStrong)}>Agent UI included.</span> Message,
                reasoning, tool call, plan and composer components.
              </li>
            </ul>
          </div>
          <CodeBlock code={AGENT_SNIPPET} />
        </div>
      </section>

      <section {...stylex.props(styles.section)} aria-labelledby="oss-title">
        <div {...stylex.props(styles.cta)}>
          <Badge variant="accent">MIT licensed</Badge>
          <h2 id="oss-title" {...stylex.props(styles.h2)}>
            Open source, MIT
          </h2>
          <p {...stylex.props(styles.lead)}>
            No seats, no paywalled components. Read the code, fork it, send a pull request.
          </p>
          <div {...stylex.props(styles.actions)}>
            <LinkButton
              href={SITE.github}
              size="lg"
              variant="primary"
              startIcon={<GithubIcon />}
              target="_blank"
              rel="noreferrer"
            >
              Star on GitHub
            </LinkButton>
            <LinkButton href="#/components" size="lg" variant="secondary">
              Browse components
            </LinkButton>
          </div>
        </div>
      </section>

      <section {...stylex.props(styles.section)} aria-labelledby="faq-title">
        <div {...stylex.props(styles.faq)}>
          <h2 id="faq-title" {...stylex.props(styles.h2, styles.center)}>
            Frequently asked questions
          </h2>
          <Accordion defaultExpandedKeys={['f0']}>
            {FAQ.map(([q, a], i) => (
              <AccordionItem key={q} id={`f${i}`} title={q}>
                {a}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <footer {...stylex.props(styles.footer)}>
        <span>
          oniva/ui · MIT © 2026{' '}
          <a href={SITE.url} {...stylex.props(styles.footLink)}>
            Oniva
          </a>
        </span>
        <nav aria-label="Footer" {...stylex.props(styles.footLinks)}>
          <Link to="/components" {...stylex.props(styles.footLink)}>
            Components
          </Link>
          <Link to="/charts" {...stylex.props(styles.footLink)}>
            Charts
          </Link>
          <Link to="/templates/dashboard" {...stylex.props(styles.footLink)}>
            Templates
          </Link>
          <a href={SITE.github} {...stylex.props(styles.footLink)}>
            GitHub
          </a>
          <a href={SITE.url} {...stylex.props(styles.footLink)}>
            oniva.ai
          </a>
        </nav>
      </footer>
    </div>
  );
}
