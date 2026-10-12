import * as stylex from '@stylexjs/stylex';
import { CheckCircle2 } from 'lucide-react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { SectionHead } from '../../internal/blocks-parts';
import { bs } from '../../internal/blocks-styles';
import { mergeSx } from '../../internal/sx';
import { Badge } from '../../components/Badge/Badge';
import { InView } from '../../motion/InView';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';

const NARROW = '@media (max-width: 720px)';

const styles = stylex.create({
  grid: {
    display: 'grid',
    gap: 16,
    gridAutoRows: { default: 'minmax(220px, auto)', [NARROW]: 'auto' },
    gridTemplateColumns: { default: 'repeat(6, 1fr)', [NARROW]: '1fr' },
  },
  cell: { display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'space-between', overflow: 'hidden' },
  text: { display: 'flex', flexDirection: 'column', gap: 8 },
  visual: { display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 },
  line: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderRadius: radius['--oniva-radius-lg'],
    display: 'flex',
    fontSize: font['--oniva-font-size-13'],
    gap: 8,
    justifyContent: 'space-between',
    paddingBlock: 8,
    paddingInline: 12,
  },
  ok: { color: colors['--oniva-color-success-solid'], flexShrink: 0 },
  big: {
    fontSize: font['--oniva-font-size-48'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-semibold'],
    letterSpacing: font['--oniva-font-track-hero'],
    lineHeight: 1,
  },
  fill: { height: '100%' },
  s4: { gridColumn: { default: 'span 4', [NARROW]: 'auto' }, height: '100%' },
  s2: { gridColumn: { default: 'span 2', [NARROW]: 'auto' }, height: '100%' },
  code: { fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-13'], margin: 0, marginTop: 16, overflowX: 'auto' },
});

export interface FeatureBentoProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'title'> {
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

const runs = [
  ['Refund triage', 'Resolved in 4.2s'],
  ['Invoice matching', 'Resolved in 1.8s'],
  ['Lead enrichment', 'Resolved in 6.5s'],
];

export function FeatureBento({
  eyebrow = 'Why teams switch',
  title = 'Less firefighting, more shipping',
  description = 'A control room designed around the way operators actually work.',
  className,
  xstyle,
  ref,
  ...rest
}: FeatureBentoProps) {
  const sx = stylex.props(bs.section, xstyle);
  return (
    <section ref={ref} {...rest} {...mergeSx(sx, className)}>
      <div {...stylex.props(bs.inner)}>
        <SectionHead eyebrow={eyebrow} title={title} lead={description} />
        <div {...stylex.props(styles.grid)}>
          <InView xstyle={styles.s4}>
            <div {...stylex.props(bs.card, styles.cell, styles.fill)}>
              <div {...stylex.props(styles.text)}>
                <h3 {...stylex.props(bs.h3)}>Every run, explained</h3>
                <p {...stylex.props(bs.p)}>Plain-language summaries of what each agent did and why, with the evidence attached.</p>
              </div>
              <div {...stylex.props(styles.visual)}>
                {runs.map(([a, b]) => (
                  <div key={a} {...stylex.props(styles.line)}>
                    <span {...stylex.props(bs.row)}>
                      <CheckCircle2 size={16} {...stylex.props(styles.ok)} aria-hidden="true" />
                      {a}
                    </span>
                    <span {...stylex.props(bs.p)}>{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </InView>
          <InView xstyle={styles.s2}>
            <div {...stylex.props(bs.card, styles.cell, styles.fill)}>
              <div {...stylex.props(styles.text)}>
                <Badge variant="success" dot>Uptime</Badge>
                <h3 {...stylex.props(bs.h3)}>Always on</h3>
              </div>
              <span {...stylex.props(styles.big)}>99.99%</span>
            </div>
          </InView>
          <InView xstyle={styles.s2}>
            <div {...stylex.props(bs.card, styles.cell, styles.fill)}>
              <div {...stylex.props(styles.text)}>
                <h3 {...stylex.props(bs.h3)}>40% lower spend</h3>
                <p {...stylex.props(bs.p)}>Automatic model routing sends easy tasks to cheaper models.</p>
              </div>
              <span {...stylex.props(styles.big)}>-40%</span>
            </div>
          </InView>
          <InView xstyle={styles.s4}>
            <div {...stylex.props(bs.card, styles.cell, styles.fill)}>
              <div {...stylex.props(styles.text)}>
                <h3 {...stylex.props(bs.h3)}>Connect in minutes</h3>
                <p {...stylex.props(bs.p)}>Drop in our SDK or point your gateway at Oniva. Python, TypeScript and OpenTelemetry supported.</p>
              </div>
              <pre tabIndex={0} aria-label="Install snippet" {...stylex.props(bs.tile, styles.code)}>
                {'npm i @oniva/sdk\noniva.trace(agent)'}
              </pre>
            </div>
          </InView>
        </div>
      </div>
    </section>
  );
}
