import * as stylex from '@stylexjs/stylex';
import { ArrowRight } from 'lucide-react';
import { InView, LinkButton } from 'oniva-ui';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import craft from 'virtual:oniva-craft';
import { mq } from '../mq.stylex';
import { ui } from '../ui';

const s = stylex.create({
  stats: {
    borderBlockStartColor: colors['--oniva-color-text'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'grid',
    gridTemplateColumns: {
      default: 'repeat(2, minmax(0, 1fr))',
      '@media (min-width: 900px)': 'repeat(4, minmax(0, 1fr))',
    },
    margin: 0,
    marginBlockStart: { default: 40, [mq.BP]: 56 },
    padding: 0,
  },
  stat: {
    borderBlockEndColor: colors['--oniva-color-border'],
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    paddingBlock: 18,
    paddingInlineEnd: 12,
  },
  num: {
    color: colors['--oniva-color-text'],
    fontFamily: mq.DISPLAY,
    fontSize: { default: 32, [mq.BP]: 40 },
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 500,
    letterSpacing: '-0.04em',
    lineHeight: 1,
    margin: 0,
    order: 1,
  },
  sep: { color: colors['--oniva-color-text-subtle'], fontWeight: 400, paddingInline: 2 },
  label: { color: colors['--oniva-color-text-muted'], fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-12'], lineHeight: 1.45, margin: 0, order: 2 },
  links: { display: 'flex', flexWrap: 'wrap', gap: 12, marginBlockStart: 32 },
});

/** The level of detail, as counts: build-time from the repo source and the contrast script, never typed. */
export function Detail() {
  const { blueprints, tests, contrast, axe, tokens } = craft;
  const stats: { v: React.ReactNode; l: string }[] = [
    { v: blueprints.count, l: 'blueprints in the specs registry, each drawn from the running component' },
    { v: blueprints.moments, l: 'moments captured on the Switch blueprint alone' },
    { v: tokens.dur.length, l: 'motion duration tokens' },
    { v: tests.files, l: 'test files in the repo' },
    {
      v: (
        <>
          {contrast.accents}
          <span {...stylex.props(s.sep)}>×</span>
          {contrast.themes}
        </>
      ),
      l: 'accents × themes, every contrast pair checked',
    },
    { v: contrast.pairs, l: `contrast pairs, ${contrast.checks.toLocaleString('en-US')} checks, ${contrast.failing} failing` },
    { v: axe.themes.length, l: `themes under axe in e2e${axe.themes.length ? `: ${axe.themes.join(' and ')}` : ''}` },
    { v: tokens.total, l: `design tokens across ${tokens.files} files` },
  ];
  return (
    <section {...stylex.props(ui.wrap, ui.section)} aria-labelledby="detail-title" style={{ paddingBlockStart: 0 }}>
      <InView preset="slide">
        <p {...stylex.props(ui.eyebrow)}>Level of detail</p>
        <h2 id="detail-title" {...stylex.props(ui.h2)}>
          Down to the millisecond.
        </h2>
        <p {...stylex.props(ui.lead)}>
          The core components each get a blueprint: the real thing, paused at key moments, with each size, duration and curve read from what rendered. Anything that cannot be read is marked as an estimate.
        </p>
      </InView>
      <InView preset="slide">
        <dl {...stylex.props(s.stats)}>
          {stats.map((st) => (
            <div key={st.l} {...stylex.props(s.stat)}>
              <dd {...stylex.props(s.num)}>{st.v}</dd>
              <dt {...stylex.props(s.label)}>{st.l}</dt>
            </div>
          ))}
        </dl>
        <div {...stylex.props(s.links)}>
          <LinkButton href="#/specs" endIcon={<ArrowRight size={14} />}>
            See the blueprints
          </LinkButton>
          <LinkButton href="#/foundations/elevation" variant="secondary">
            Depth
          </LinkButton>
          <LinkButton href="#/foundations/color" variant="secondary">
            Color
          </LinkButton>
          <LinkButton href="#/foundations/motion" variant="secondary">
            Motion
          </LinkButton>
        </div>
      </InView>
    </section>
  );
}
