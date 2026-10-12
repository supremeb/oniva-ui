import * as stylex from '@stylexjs/stylex';
import { Link } from 'react-router-dom';
import { Badge } from 'oniva-ui';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import { demoModules } from '../demos';

const styles = stylex.create({
  h1: {
    fontSize: font['--oniva-font-size-40'],
    fontWeight: font['--oniva-font-weight-medium'],
    letterSpacing: font['--oniva-font-track-hero'],
    margin: '0 0 8px',
  },
  sub: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-16'],
    margin: '0 0 32px',
    maxWidth: 640,
  },
  section: { marginBlockEnd: 48 },
  head: { alignItems: 'baseline', display: 'flex', flexWrap: 'wrap', gap: 12, marginBlockEnd: 16 },
  h2: {
    fontSize: font['--oniva-font-size-24'],
    fontWeight: font['--oniva-font-weight-semibold'],
    margin: 0,
  },
  more: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-14'] },
  desc: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-14'],
    margin: '0 0 16px',
    maxWidth: 720,
  },
  grid: {
    alignItems: 'start',
    display: 'grid',
    gap: 24,
    gridTemplateColumns: {
      default: 'minmax(0, 1fr)',
      '@media (min-width: 1000px)': 'repeat(2, minmax(0, 1fr))',
    },
  },
  cell: { minWidth: 0 },
  name: {
    color: colors['--oniva-color-text-subtle'],
    fontSize: font['--oniva-font-size-12'],
    marginBlockEnd: 8,
  },
});

export function ChartsGallery() {
  const charts = demoModules.filter((m) => m.meta.category === 'Charts');
  return (
    <>
      <h1 {...stylex.props(styles.h1)}>Charts</h1>
      <p {...stylex.props(styles.sub)}>
        {charts.length} chart types, all SVG, keyboard-focusable with tooltips and themed by tokens.
        Every example below is live.
      </p>
      {charts.map((m) => (
        <section
          key={m.meta.slug}
          id={m.meta.slug}
          aria-labelledby={`c-${m.meta.slug}`}
          {...stylex.props(styles.section)}
        >
          <div {...stylex.props(styles.head)}>
            <h2 id={`c-${m.meta.slug}`} {...stylex.props(styles.h2)}>
              {m.meta.title}
            </h2>
            <Badge size="sm">{m.demos.length} examples</Badge>
            <Link to={`/components/${m.meta.slug}`} {...stylex.props(styles.more)}>
              Docs and code
            </Link>
          </div>
          <p {...stylex.props(styles.desc)}>{m.meta.description}</p>
          <div {...stylex.props(styles.grid)}>
            {m.demos.map((d) => (
              <div key={d.name} {...stylex.props(styles.cell)}>
                <div {...stylex.props(styles.name)}>{d.name}</div>
                <d.Component />
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
