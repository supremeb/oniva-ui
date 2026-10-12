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
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    textDecoration: 'none',
  },
  card: {
    backgroundColor: {
      default: colors['--oniva-color-surface-inset'],
      ':hover': colors['--oniva-color-surface-inset-hover'],
    },
    height: '100%',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color',
  },
  title: {
    fontSize: font['--oniva-font-size-16'],
    fontWeight: font['--oniva-font-weight-semibold'],
    margin: 0,
  },
  desc: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-18'],
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
