import * as stylex from '@stylexjs/stylex';
import { InView } from 'oniva-ui';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import craft from 'virtual:oniva-craft';
import { principles } from '../../content/principles';
import { counts } from '../../lib/site';
import { mq } from '../mq.stylex';
import { ui } from '../ui';
import { durMs, type Vars } from './live';

const s = stylex.create({
  grid: {
    columnGap: 40,
    display: 'grid',
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 640px)': 'repeat(2, minmax(0, 1fr))',
      '@media (min-width: 1040px)': 'repeat(3, minmax(0, 1fr))',
    },
    marginBlockStart: 48,
    rowGap: 44,
  },
  cell: {
    borderBlockStartColor: colors['--oniva-color-text'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    minWidth: 0,
    paddingBlockStart: 16,
  },
  n: { color: colors['--oniva-color-text-muted'], fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums' },
  title: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-18'], fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 1.3, margin: 0 },
  body: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-14'], lineHeight: 1.55, margin: 0, textWrap: 'pretty' },
  proof: {
    borderBlockStartColor: colors['--oniva-color-border'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBlockStart: 'auto',
    paddingBlockStart: 14,
  },
  figure: { alignItems: 'baseline', display: 'flex', flexWrap: 'wrap', gap: 8 },
  big: {
    color: colors['--oniva-color-text'],
    fontFamily: mq.DISPLAY,
    fontSize: 40,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: 500,
    letterSpacing: '-0.04em',
    lineHeight: 1,
  },
  unit: { color: colors['--oniva-color-text-subtle'], fontSize: font['--oniva-font-size-14'] },
  src: { color: colors['--oniva-color-text-muted'], fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-12'], lineHeight: 1.5, margin: 0, overflowWrap: 'anywhere' },
  tag: { color: colors['--oniva-color-accent-text'] },
  reveal: { display: 'flex', width: '100%' },
});

const fmt = (n: number) => n.toLocaleString('en-US');
const UI_EXCLUDED = ['deliberate', 'sheet', 'slower']; // text reveal and number roll, drawer, hero entrance

interface Proof {
  value: string;
  unit: string;
  source: string;
  kind: 'live' | 'build';
}

function proofs(vars: Vars | null): Record<string, Proof | null> {
  const ui = craft.tokens.dur.filter((n) => !UI_EXCLUDED.some((x) => n.endsWith(`-${x}`)));
  const longest = vars && ui.length ? Math.max(...ui.map((n) => durMs(vars, n))) : null;
  const c = craft.contrast;
  return {
    tokens: { value: fmt(craft.tokens.total), unit: 'tokens', source: `--oniva-* across ${craft.tokens.files} token files`, kind: 'build' },
    aria: { value: fmt(craft.aria.components), unit: `of ${fmt(craft.aria.of)} components`, source: "import from 'react-aria-components'", kind: 'build' },
    motion:
      longest == null
        ? null
        : { value: fmt(longest), unit: 'ms longest', source: `of ${ui.length} UI --oniva-motion-dur-* tokens, read from this page. Sheet, ${UI_EXCLUDED.filter((x) => x !== 'sheet').join(' and ')} excluded`, kind: 'live' },
    contrast: { value: fmt(c.checks), unit: 'checks', source: `${c.pairs} pairs × ${c.themes} themes × ${c.accents} accents, ${fmt(c.failing)} failing`, kind: 'build' },
    names: { value: fmt(counts.total), unit: 'components', source: 'one set of prop names, from the demo registry', kind: 'live' },
    docs: { value: fmt(craft.docs.pages), unit: 'full doc pages', source: `${fmt(craft.docs.withDemos)} components ship live demos`, kind: 'build' },
  };
}

export function Principles({ vars }: { vars: Vars | null }) {
  const p = proofs(vars);
  return (
    <section {...stylex.props(ui.wrap, ui.section)} aria-labelledby="principles-title">
      <InView preset="slide">
        <p {...stylex.props(ui.eyebrow)}>The principles</p>
        <h2 id="principles-title" {...stylex.props(ui.h2)}>
          Six rules. Each one is measured.
        </h2>
        <p {...stylex.props(ui.lead)}>
          When a call is unclear, we argue from these. The number under each is read from the running system or counted from source, never typed in.
        </p>
      </InView>
      <ol {...stylex.props(s.grid)} style={{ listStyle: 'none', margin: 0, padding: 0, marginBlockStart: 48 }}>
        {principles.map((pr, i) => {
          const proof = p[pr.id];
          return (
            <li key={pr.id} style={{ display: 'flex' }}>
              <InView preset="slide" xstyle={s.reveal}>
                <div {...stylex.props(s.cell)} style={{ width: '100%' }}>
                  <span {...stylex.props(s.n)} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 {...stylex.props(s.title)}>{pr.title}</h3>
                  <p {...stylex.props(s.body)}>{pr.body}</p>
                  <div {...stylex.props(s.proof)} style={{ minHeight: 124 }}>
                    {proof && (
                      <>
                        <div {...stylex.props(s.figure)}>
                          <span {...stylex.props(s.big)}>{proof.value}</span>
                          <span {...stylex.props(s.unit)}>{proof.unit}</span>
                        </div>
                        <p {...stylex.props(s.src)}>
                          <span {...stylex.props(s.tag)}>{proof.kind}</span> · {proof.source}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </InView>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
