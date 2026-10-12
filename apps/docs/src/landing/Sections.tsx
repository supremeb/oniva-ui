import * as stylex from '@stylexjs/stylex';
import { ArrowRight, Minus, Moon, Plus, Star, Sun } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button as RacButton } from 'react-aria-components';
import {
  AnimatedNumber,
  Badge,
  Button,
  CopyButton,
  DonutChart,
  InView,
  LinkButton,
  ProgressBar,
  SegmentedControl,
  SegmentedControlItem,
  Slider,
  Switch,
  WordRotate,
  accentNames,
  accentSwatches,
  type AccentName,
  type ThemeMode,
} from 'oniva-ui';
import { accent } from '@oniva-tokens/accent.stylex';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import { radius } from '@oniva-tokens/radius.stylex';
import { sleepStages } from '../../../../packages/oniva-ui/src/charts/_data/datasets';
import { CodeBlock } from '../components/CodeBlock';
import { GithubIcon } from '../components/GithubIcon';
import { Preview } from '../components/Preview';
import { demoModules, groupByCategory } from '../demos';
import { SITE, counts } from '../lib/site';
import { ui } from './ui';
import { mq } from './mq.stylex';

const catCount = (cat: string) => demoModules.filter((m) => m.meta.category === cat).length;

const s = stylex.create({
  bento: {
    display: 'grid',
    gap: 16,
    gridTemplateColumns: { default: 'minmax(0, 1fr)', [mq.BP]: 'repeat(6, minmax(0, 1fr))' },
    marginBlockStart: 48,
  },
  tile: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: { default: colors['--oniva-color-border'], ':hover': colors['--oniva-color-border-hover'] },
    borderRadius: radius['--oniva-radius-xxl'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    minWidth: 0,
    overflow: 'hidden',
    padding: 20,
    position: 'relative',
    textDecoration: 'none',
    transitionDuration: '200ms',
    transitionProperty: 'border-color, transform',
    transitionTimingFunction: mq.EASE,
  },
  c6: { gridColumn: { default: 'auto', [mq.BP]: 'span 6' } },
  c4: { gridColumn: { default: 'auto', [mq.BP]: 'span 4' } },
  c3: { gridColumn: { default: 'auto', [mq.BP]: 'span 3' } },
  c2: { gridColumn: { default: 'auto', [mq.BP]: 'span 2' } },
  tileHead: { alignItems: 'baseline', display: 'flex', gap: 10, justifyContent: 'space-between' },
  tileName: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-16'], fontWeight: 500, margin: 0 },
  count: {
    color: colors['--oniva-color-text'],
    fontFamily: mq.DISPLAY,
    fontSize: 'clamp(40px, 5vw, 64px)',
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 500,
    letterSpacing: '-0.04em',
    lineHeight: 1,
  },
  tileDesc: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-14'], lineHeight: 1.45, margin: 0 },
  tileView: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    justifyContent: 'center',
    minHeight: 0,
    pointerEvents: 'none',
  },
  fullW: { width: '100%' },
  split: {
    display: 'grid',
    gap: { default: 32, [mq.BP]: 64 },
    gridTemplateColumns: { default: 'minmax(0, 1fr)', [mq.BP]: 'minmax(0, 5fr) minmax(0, 6fr)' },
    alignItems: 'center',
  },
  micro: {
    display: 'grid',
    gap: 16,
    gridTemplateColumns: { default: 'minmax(0, 1fr)', '@media (min-width: 600px)': 'repeat(2, minmax(0, 1fr))', '@media (min-width: 1000px)': 'repeat(4, minmax(0, 1fr))' },
    marginBlockStart: 48,
  },
  microCard: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xxl'],
    borderStyle: 'solid',
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    minHeight: 200,
    padding: 20,
  },
  microStage: { alignItems: 'center', display: 'flex', flexGrow: 1, gap: 12, justifyContent: 'center', minHeight: 72 },
  microName: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-14'], fontWeight: 500, margin: 0 },
  spec: { color: colors['--oniva-color-text-muted'], fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-12'], margin: 0 },
  bigNum: { color: colors['--oniva-color-text'], fontFamily: mq.DISPLAY, fontSize: 40, fontWeight: 500, letterSpacing: '-0.03em' },
  big: { fontFamily: mq.DISPLAY, fontSize: 28, fontWeight: 500, letterSpacing: '-0.03em' },
  themeStage: {
    backgroundColor: colors['--oniva-color-bg'],
    backgroundImage: `radial-gradient(70% 60% at 85% 0%, color-mix(in srgb, ${accent['--oniva-accent-500']} 42%, transparent), transparent 70%), radial-gradient(60% 60% at 0% 100%, color-mix(in srgb, ${accent['--oniva-accent-700']} 38%, transparent), transparent 70%)`,
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xxl'],
    borderStyle: 'solid',
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    padding: { default: 20, [mq.BP]: 32 },
  },
  glass: {
    backdropFilter: 'blur(10px)',
    backgroundColor: `color-mix(in srgb, ${colors['--oniva-color-surface']} 82%, transparent)`,
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    padding: 18,
  },
  row: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 10 },
  rowTop: { marginBlockStart: 16 },
  swGrid: { display: 'flex', flexWrap: 'wrap', gap: 10, marginBlockStart: 28 },
  swBtn: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: { default: colors['--oniva-color-border'], ':hover': colors['--oniva-color-border-hover'] },
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-13'],
    gap: 8,
    height: 36,
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    paddingInline: 12,
    transform: { default: 'none', ':active': 'scale(0.97)' },
    transitionDuration: '120ms',
    transitionProperty: 'transform, border-color',
    transitionTimingFunction: mq.EASE,
  },
  swBtnOn: { borderColor: colors['--oniva-color-text'] },
  swChip: { borderRadius: radius['--oniva-radius-full'], height: 14, width: 14 },
  swChipColor: (c: string) => ({ backgroundColor: c }),
  agentGrid: {
    display: 'grid',
    gap: 16,
    gridTemplateColumns: { default: 'minmax(0, 1fr)', [mq.BP]: 'repeat(3, minmax(0, 1fr))' },
    marginBlockStart: 48,
  },
  agentCard: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xxl'],
    borderStyle: 'solid',
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    minWidth: 0,
    padding: 22,
  },
  agentTitle: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-16'], fontWeight: 500, margin: 0 },
  agentCode: { marginBlockStart: 16 },
  cta: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    backgroundImage: `radial-gradient(60% 90% at 50% 120%, color-mix(in srgb, ${accent['--oniva-accent-500']} 45%, transparent), transparent 70%)`,
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xxxl'],
    borderStyle: 'solid',
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    paddingBlock: { default: 56, [mq.BP]: 96 },
    paddingInline: 24,
    textAlign: 'center',
  },
  ctaActions: { display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBlockStart: 28 },
  index: { marginBlockStart: 40 },
  indexCat: { marginBlockEnd: 20 },
  indexTitle: { alignItems: 'baseline', display: 'flex', gap: 8, marginBlockEnd: 10 },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  chip: {
    backgroundColor: { default: 'transparent', ':hover': colors['--oniva-color-surface-inset-hover'] },
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-13'],
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    paddingBlock: 4,
    paddingInline: 10,
    textDecoration: 'none',
    transitionDuration: '120ms',
    transitionProperty: 'background-color, transform',
    transform: { default: 'none', ':active': 'scale(0.97)' },
  },
  footer: {
    alignItems: 'center',
    borderBlockStartColor: colors['--oniva-color-border'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: font['--oniva-font-size-13'],
    gap: 16,
    justifyContent: 'space-between',
    marginBlockStart: 96,
    paddingBlock: 28,
  },
  footLinks: { display: 'flex', flexWrap: 'wrap', gap: 18 },
  footLink: { color: { default: colors['--oniva-color-text-muted'], ':hover': colors['--oniva-color-text'] }, textDecoration: 'none' },
});

function Reveal({ children }: { children: React.ReactNode }) {
  return <InView preset="slide">{children}</InView>;
}

export function Bento() {
  const ai = counts.ai;
  return (
    <section {...stylex.props(ui.wrap, ui.section)} aria-labelledby="bento-title">
      <Reveal>
        <p {...stylex.props(ui.eyebrow)}>The material</p>
        <h2 id="bento-title" {...stylex.props(ui.h2)}>
          {counts.total} components. One system.
        </h2>
        <p {...stylex.props(ui.lead)}>
          Every tile is the real component, running. Tokens, motion and accessibility are shared, so
          a chart, a composer and a date picker behave like siblings.
        </p>
      </Reveal>
      <div {...stylex.props(s.bento)}>
        <Link to="/components/agent-progress" {...stylex.props(s.tile, s.c4)}>
          <div {...stylex.props(s.tileHead)}>
            <h3 {...stylex.props(s.tileName)}>AI &amp; Agent</h3>
            <span {...stylex.props(s.count)}>{ai}</span>
          </div>
          <p {...stylex.props(s.tileDesc)}>Composer, reasoning, tool approval, plans, memory, run logs.</p>
          <div {...stylex.props(s.tileView)} aria-hidden="true" inert>
            <div {...stylex.props(s.fullW)}>
              <Preview slug="tool-approval" />
            </div>
            <div {...stylex.props(s.fullW)}>
              <Preview slug="agent-progress" />
            </div>
          </div>
        </Link>
        <Link to="/charts" {...stylex.props(s.tile, s.c2)}>
          <div {...stylex.props(s.tileHead)}>
            <h3 {...stylex.props(s.tileName)}>Charts</h3>
            <span {...stylex.props(s.count)}>{counts.charts}</span>
          </div>
          <p {...stylex.props(s.tileDesc)}>Keyboard-reachable points, screen-reader tables.</p>
          <div {...stylex.props(s.tileView)} aria-hidden="true" inert>
            <DonutChart
              data={sleepStages}
              valueFormat={(m) => `${Math.floor(m / 60)}h ${m % 60}m`}
              centerValue="7h 20m"
              centerLabel="Total"
              size={150}
            />
          </div>
        </Link>
        <Link to="/components/leaderboard" {...stylex.props(s.tile, s.c3)}>
          <div {...stylex.props(s.tileHead)}>
            <h3 {...stylex.props(s.tileName)}>Data</h3>
            <span {...stylex.props(s.count)}>{catCount('Data display') + catCount('Widgets')}</span>
          </div>
          <p {...stylex.props(s.tileDesc)}>Tables, widgets, rankings and KPIs.</p>
          <div {...stylex.props(s.tileView)} aria-hidden="true" inert>
            <div {...stylex.props(s.fullW)}>
              <Preview slug="leaderboard" />
            </div>
          </div>
        </Link>
        <Link to="/components/segmented-control" {...stylex.props(s.tile, s.c3)}>
          <div {...stylex.props(s.tileHead)}>
            <h3 {...stylex.props(s.tileName)}>Forms</h3>
            <span {...stylex.props(s.count)}>{catCount('Forms')}</span>
          </div>
          <p {...stylex.props(s.tileDesc)}>React Aria under every field. Labels, errors, focus: done.</p>
          <div {...stylex.props(s.tileView)} aria-hidden="true" inert>
            <div {...stylex.props(s.fullW)}>
              <Preview slug="segmented-control" />
            </div>
            <div {...stylex.props(s.fullW)}>
              <Preview slug="slider" />
            </div>
          </div>
        </Link>
        <Link to="/foundations/motion" {...stylex.props(s.tile, s.c6)}>
          <div {...stylex.props(s.tileHead)}>
            <h3 {...stylex.props(s.tileName)}>Motion</h3>
            <span {...stylex.props(s.count)}>{catCount('Motion')}</span>
          </div>
          <p {...stylex.props(s.tileDesc)}>Transform and opacity only. Reduced-motion aware.</p>
          <div {...stylex.props(s.tileView, s.big)} aria-hidden="true" inert>
            Built for <WordRotate words={['dashboards', 'agents', 'teams', 'launch day']} />
          </div>
        </Link>
      </div>
    </section>
  );
}

export function MotionStrip() {
  const [n, setN] = useState(1284);
  return (
    <section {...stylex.props(ui.wrap, ui.section)} aria-labelledby="motion-title">
      <Reveal>
        <p {...stylex.props(ui.eyebrow)}>Motion, with taste</p>
        <h2 id="motion-title" {...stylex.props(ui.h2)}>
          Fast enough to disappear.
        </h2>
        <p {...stylex.props(ui.lead)}>
          Press, slide, count, copy. Each interaction has one job, under 300ms, on one curve. Try them.
        </p>
      </Reveal>
      <div {...stylex.props(s.micro)}>
        <div {...stylex.props(s.microCard)}>
          <div {...stylex.props(s.microStage)}>
            <Button variant="primary">Deploy</Button>
          </div>
          <div>
            <h3 {...stylex.props(s.microName)}>Press</h3>
            <p {...stylex.props(s.spec)}>scale 0.97 · 120ms · ease-out</p>
          </div>
        </div>
        <div {...stylex.props(s.microCard)}>
          <div {...stylex.props(s.microStage)}>
            <SegmentedControl aria-label="Range" defaultValue="30d" size="sm">
              <SegmentedControlItem value="7d">7d</SegmentedControlItem>
              <SegmentedControlItem value="30d">30d</SegmentedControlItem>
              <SegmentedControlItem value="90d">90d</SegmentedControlItem>
            </SegmentedControl>
          </div>
          <div>
            <h3 {...stylex.props(s.microName)}>Sliding indicator</h3>
            <p {...stylex.props(s.spec)}>measured box · 250ms · ease-in-out</p>
          </div>
        </div>
        <div {...stylex.props(s.microCard)}>
          <div {...stylex.props(s.microStage)}>
            <Button isIconOnly size="sm" variant="secondary" aria-label="Decrease" onPress={() => setN((v) => v - 137)}>
              <Minus size={14} />
            </Button>
            <span {...stylex.props(s.bigNum)}>
              <AnimatedNumber value={n} />
            </span>
            <Button isIconOnly size="sm" variant="secondary" aria-label="Increase" onPress={() => setN((v) => v + 137)}>
              <Plus size={14} />
            </Button>
          </div>
          <div>
            <h3 {...stylex.props(s.microName)}>Rolling digits</h3>
            <p {...stylex.props(s.spec)}>per-digit · 350ms · ease-out-expo</p>
          </div>
        </div>
        <div {...stylex.props(s.microCard)}>
          <div {...stylex.props(s.microStage)}>
            <code {...stylex.props(ui.mono)}>npm i oniva-ui</code>
            <CopyButton value="npm i oniva-ui" aria-label="Copy install command" size="sm" />
          </div>
          <div>
            <h3 {...stylex.props(s.microName)}>Confirm</h3>
            <p {...stylex.props(s.spec)}>swap from 0.25 · blur 2px · 250ms</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export interface ThemingProps {
  accent: AccentName;
  onAccentChange: (a: AccentName) => void;
  theme: ThemeMode;
  isDark: boolean;
  onThemeChange: (t: ThemeMode) => void;
}

export function Theming({ accent: current, onAccentChange, isDark, onThemeChange }: ThemingProps) {
  return (
    <section {...stylex.props(ui.wrap, ui.section)} aria-labelledby="theme-title">
      <div {...stylex.props(s.split)}>
        <Reveal>
          <p {...stylex.props(ui.eyebrow)}>Theming</p>
          <h2 id="theme-title" {...stylex.props(ui.h2)}>
            Change one variable. Everything follows.
          </h2>
          <p {...stylex.props(ui.lead)}>
            Colors, radii and shadows are public <code {...stylex.props(ui.mono)}>--oniva-*</code>{' '}
            variables. The hero shader reads the same ones, so the field above is literally your theme.
          </p>
          <div role="group" aria-label="Theme accent" {...stylex.props(s.swGrid)}>
            {accentNames.map((name) => (
              <RacButton
                key={name}
                aria-pressed={current === name}
                onPress={() => onAccentChange(name)}
                {...stylex.props(s.swBtn, current === name && s.swBtnOn)}
              >
                <span {...stylex.props(s.swChip, s.swChipColor(accentSwatches[name]))} aria-hidden="true" />
                {name}
              </RacButton>
            ))}
          </div>
          <div {...stylex.props(s.row, s.rowTop)}>
            <Button
              variant="secondary"
              size="sm"
              startIcon={isDark ? <Sun size={14} /> : <Moon size={14} />}
              onPress={() => onThemeChange(isDark ? 'light' : 'dark')}
            >
              {isDark ? 'Light mode' : 'Dark mode'}
            </Button>
          </div>
        </Reveal>
        <Reveal>
          <div {...stylex.props(s.themeStage)}>
            <div {...stylex.props(s.glass)}>
              <div {...stylex.props(s.row)}>
                <Badge variant="info" dot>
                  Live
                </Badge>
                <span {...stylex.props(s.tileName)}>Deploy pipeline</span>
              </div>
              <ProgressBar aria-label="Build progress" value={72} />
              <Slider aria-label="Replicas" defaultValue={40} />
              <div {...stylex.props(s.row)}>
                <Switch defaultSelected>Auto-promote</Switch>
                <Button variant="primary" size="sm">
                  Promote
                </Button>
                <Button variant="secondary" size="sm">
                  Roll back
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const AGENTS_MD = `# AGENTS.md (excerpt)
- StyleX only. Tokens, not hex.
- One prop grammar: size, tone,
  variant, isDisabled, xstyle.
- One folder per component.
- Every demo ships its source.`;

export function Agents() {
  return (
    <section {...stylex.props(ui.wrap, ui.section)} aria-labelledby="agents-title">
      <Reveal>
        <p {...stylex.props(ui.eyebrow)}>Built for agents</p>
        <h2 id="agents-title" {...stylex.props(ui.h2)}>
          A system your agent can read.
        </h2>
        <p {...stylex.props(ui.lead)}>
          Predictable names, one prop grammar and a runnable demo per component. Humans skim it,
          agents generate against it.
        </p>
      </Reveal>
      <div {...stylex.props(s.agentGrid)}>
        <div {...stylex.props(s.agentCard)}>
          <h3 {...stylex.props(s.agentTitle)}>Conventions in the repo</h3>
          <p {...stylex.props(s.tileDesc)}>
            AGENTS.md documents tokens, prop grammar and motion rules, so generated code matches on the
            first pass.
          </p>
          <div {...stylex.props(s.agentCode)}>
            <CodeBlock code={AGENTS_MD} />
          </div>
        </div>
        <div {...stylex.props(s.agentCard)}>
          <h3 {...stylex.props(s.agentTitle)}>Demos are the spec</h3>
          <p {...stylex.props(s.tileDesc)}>
            {counts.total} components, each with a runnable example and its exact source. No guessing
            at props.
          </p>
          <div {...stylex.props(s.agentCode)}>
            <CodeBlock
              code={`<ToolApproval
  toolName="github.merge_pull_request"
  description="Merge #482 into main"
  onApprove={run}
/>`}
            />
          </div>
        </div>
        <div {...stylex.props(s.agentCard)}>
          <h3 {...stylex.props(s.agentTitle)}>UI for the agent loop</h3>
          <p {...stylex.props(s.tileDesc)}>
            {counts.ai} building blocks: composer, reasoning, approvals, plans, memory, run logs and MCP
            server lists.
          </p>
          <div {...stylex.props(s.agentCode)}>
            <LinkButton href="#/components/mcp-server-list" variant="secondary" endIcon={<ArrowRight size={14} />}>
              See the agent kit
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Cta() {
  return (
    <section {...stylex.props(ui.wrap)} aria-labelledby="oss-title">
      <div {...stylex.props(s.cta)}>
        <p {...stylex.props(ui.eyebrow)}>Open source · MIT</p>
        <h2 id="oss-title" {...stylex.props(ui.h2)}>
          Build the interface. Ship it today.
        </h2>
        <div {...stylex.props(s.ctaActions)}>
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
      </div>
    </section>
  );
}

/** Every component page, one link each (kept as the landing's compact index). */
export function Index() {
  const groups = groupByCategory(demoModules);
  return (
    <section {...stylex.props(ui.wrap, s.index)} aria-labelledby="index-title">
      <h2 id="index-title" {...stylex.props(ui.eyebrow)}>
        All {counts.total} components
      </h2>
      <nav aria-label="All components" data-testid="home-component-grid" {...stylex.props(s.indexCat)}>
        {groups.map(([cat, mods]) => (
          <div key={cat} {...stylex.props(s.indexCat)}>
            <p {...stylex.props(ui.eyebrow, s.indexTitle)}>
              {cat} <span>{mods.length}</span>
            </p>
            <div {...stylex.props(s.chips)}>
              {mods.map((m) => (
                <Link key={m.meta.slug} to={`/components/${m.meta.slug}`} {...stylex.props(s.chip)}>
                  {m.meta.title}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </section>
  );
}

export function Footer() {
  return (
    <footer {...stylex.props(ui.wrap)}>
      <div {...stylex.props(s.footer)}>
        <span>oniva/ui · MIT · Built with StyleX and React Aria</span>
        <div {...stylex.props(s.footLinks)}>
          <Link to="/components" {...stylex.props(s.footLink)}>
            Components
          </Link>
          <Link to="/charts" {...stylex.props(s.footLink)}>
            Charts
          </Link>
          <Link to="/foundations/motion" {...stylex.props(s.footLink)}>
            Motion
          </Link>
          <a href={SITE.github} rel="noreferrer" {...stylex.props(s.footLink)}>
            <GithubIcon size={13} /> GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
