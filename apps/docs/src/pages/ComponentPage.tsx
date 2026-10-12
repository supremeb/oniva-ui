import * as stylex from '@stylexjs/stylex';
import { Link, useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, Tile } from 'oniva-ui';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import { CodeBlock } from '../components/CodeBlock';
import { getDemo } from '../demos';
import { getDocPage } from '../content';
import { DocPageView, Crumb } from '../components/doc/DocPageView';

const styles = stylex.create({
  h1: {
    fontSize: font['--oniva-font-size-32'],
    fontWeight: font['--oniva-font-weight-medium'],
    letterSpacing: font['--oniva-font-track-hero'],
    margin: '8px 0',
  },
  lead: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-16'],
    lineHeight: font['--oniva-font-lh-16'],
    margin: '0 0 24px',
    maxWidth: 640,
  },
  stack: { display: 'flex', flexDirection: 'column', gap: 24 },
  // Demos have intrinsic widths (boards, tables, calendars); scroll inside the stage instead of widening the
  // page on phones (CI mobile 390px overflow check).
  preview: {
    alignItems: 'flex-start',
    display: 'flex',
    minHeight: 96,
    minWidth: 0,
    overflowX: 'auto',
    padding: 24,
    // containing block for absolutely positioned visually-hidden spans, so they clip with the stage
    position: 'relative',
  },
});

export function ComponentPage() {
  const { slug } = useParams();
  const mod = getDemo(slug);
  if (!mod) {
    return (
      <>
        <h1 {...stylex.props(styles.h1)}>Not found</h1>
        <p {...stylex.props(styles.lead)}>
          No component called “{slug}”. <Link to="/components">Back to all components</Link>
        </p>
      </>
    );
  }
  const doc = getDocPage(slug);
  if (doc) return <DocPageView key={slug} page={doc} mod={mod} />;
  return (
    <article>
      <Crumb trail={[{ label: 'Components', to: '/components' }, { label: mod.meta.category }, { label: mod.meta.title }]} />
      <h1 {...stylex.props(styles.h1)}>{mod.meta.title}</h1>
      <p {...stylex.props(styles.lead)}>{mod.meta.description}</p>
      <div {...stylex.props(styles.stack)}>
        {mod.demos.map((d) => (
          <Card key={d.name} data-testid="demo">
            <CardHeader>
              <CardTitle as="h2">{d.name}</CardTitle>
            </CardHeader>
            <Tile padding="none" xstyle={styles.preview}>
              <d.Component />
            </Tile>
            <CodeBlock code={d.code} />
          </Card>
        ))}
      </div>
    </article>
  );
}
