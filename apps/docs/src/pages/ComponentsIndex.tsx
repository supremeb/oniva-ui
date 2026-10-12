import * as stylex from '@stylexjs/stylex';
import { font } from '@oniva-tokens/font.stylex';
import { ComponentCard } from '../components/ComponentCard';
import { demoModules, groupByCategory } from '../demos';

const styles = stylex.create({
  h1: {
    fontSize: font.size32,
    fontWeight: font.weightMedium,
    letterSpacing: font.trackHero,
    margin: '0 0 8px',
  },
  h2: { fontSize: font.size18, fontWeight: font.weightSemibold, margin: '32px 0 12px' },
  grid: { display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' },
});

export function ComponentsIndex() {
  return (
    <>
      <h1 {...stylex.props(styles.h1)}>Components</h1>
      {groupByCategory(demoModules).map(([category, mods]) => (
        <section key={category} aria-labelledby={`cat-${category}`}>
          <h2 id={`cat-${category}`} {...stylex.props(styles.h2)}>
            {category}
          </h2>
          <div {...stylex.props(styles.grid)}>
            {mods.map((m) => (
              <ComponentCard key={m.meta.slug} mod={m} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
