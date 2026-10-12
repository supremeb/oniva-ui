import * as stylex from '@stylexjs/stylex';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge, Button } from 'oniva-ui';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import { ComponentCard } from '../components/ComponentCard';
import { demoModules } from '../demos';

const styles = stylex.create({
  hero: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    paddingBlock: 48,
  },
  h1: {
    fontSize: {
      default: font['--oniva-font-size-48'],
      '@media (min-width: 800px)': font['--oniva-font-size-64'],
    },
    fontWeight: font['--oniva-font-weight-medium'],
    letterSpacing: font['--oniva-font-track-hero'],
    lineHeight: 1.1,
    margin: 0,
    maxWidth: 800,
  },
  sub: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-18'],
    lineHeight: font['--oniva-font-lh-18'],
    margin: 0,
    maxWidth: 560,
  },
  actions: { display: 'flex', gap: 12 },
  h2: {
    fontSize: font['--oniva-font-size-20'],
    fontWeight: font['--oniva-font-weight-semibold'],
    margin: '48px 0 16px',
  },
  grid: {
    display: 'grid',
    gap: 16,
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  },
});

export function Home() {
  const navigate = useNavigate();
  return (
    <>
      <section {...stylex.props(styles.hero)}>
        <Badge variant="accent">v0.1 · StyleX · React Aria</Badge>
        <h1 {...stylex.props(styles.h1)}>
          React design system for dashboards &amp; agent interfaces
        </h1>
        <p {...stylex.props(styles.sub)}>
          Original, MIT-licensed components styled with StyleX and built on React Aria. Light, dark
          and eight accent themes out of the box.
        </p>
        <div {...stylex.props(styles.actions)}>
          <Button
            size="lg"
            endIcon={<ArrowRight size={16} />}
            onPress={() => navigate('/components')}
          >
            Browse components
          </Button>
        </div>
      </section>
      <h2 {...stylex.props(styles.h2)}>Components</h2>
      <div {...stylex.props(styles.grid)} data-testid="home-component-grid">
        {demoModules.map((m) => (
          <ComponentCard key={m.meta.slug} mod={m} />
        ))}
      </div>
    </>
  );
}
