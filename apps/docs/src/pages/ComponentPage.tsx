import * as stylex from '@stylexjs/stylex';
import { Link, useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, Tile } from 'oniva-ui';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import { CodeBlock } from '../components/CodeBlock';
import { getDemo } from '../demos';

const styles = stylex.create({
  crumb: { color: colors.textMuted, fontSize: font.size13, textDecoration: 'none' },
  h1: {
    fontSize: font.size32,
    fontWeight: font.weightMedium,
    letterSpacing: font.trackHero,
    margin: '8px 0',
  },
  lead: {
    color: colors.textMuted,
    fontSize: font.size16,
    lineHeight: font.lh16,
    margin: '0 0 24px',
    maxWidth: 640,
  },
  stack: { display: 'flex', flexDirection: 'column', gap: 24 },
  preview: { alignItems: 'flex-start', display: 'flex', minHeight: 96, padding: 24 },
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
  return (
    <article>
      <Link to="/components" {...stylex.props(styles.crumb)}>
        ← Components
      </Link>
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
