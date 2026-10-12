import * as stylex from '@stylexjs/stylex';
import { Link } from 'react-router-dom';
import { Badge, Card, Tile } from 'oniva-ui';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import { motion } from '@oniva-tokens/motion.stylex';
import type { DemoModule } from '../../../../packages/oniva-ui/src/internal/demo';

const styles = stylex.create({
  link: {
    borderRadius: 16,
    color: 'inherit',
    display: 'block',
    outlineColor: colors.focusRing,
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    textDecoration: 'none',
  },
  card: {
    backgroundColor: { default: colors.surfaceInset, ':hover': colors.surfaceInsetHover },
    height: '100%',
    transitionDuration: motion.durBase,
    transitionProperty: 'background-color',
  },
  title: { fontSize: font.size16, fontWeight: font.weightSemibold, margin: 0 },
  desc: {
    color: colors.textMuted,
    fontSize: font.size13,
    lineHeight: font.lh18,
    margin: '6px 0 0',
  },
  row: { alignItems: 'center', display: 'flex', gap: 8, justifyContent: 'space-between' },
});

export function ComponentCard({ mod }: { mod: DemoModule }) {
  const { title, slug, description, category } = mod.meta;
  return (
    <Link to={`/components/${slug}`} {...stylex.props(styles.link)}>
      <Card xstyle={styles.card}>
        <Tile padding="md">
          <div {...stylex.props(styles.row)}>
            <h3 {...stylex.props(styles.title)}>{title}</h3>
            <Badge size="sm">{category}</Badge>
          </div>
          <p {...stylex.props(styles.desc)}>{description}</p>
        </Tile>
      </Card>
    </Link>
  );
}
