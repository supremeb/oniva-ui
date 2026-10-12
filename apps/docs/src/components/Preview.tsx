import * as stylex from '@stylexjs/stylex';
import { getDemo } from '../demos';

const styles = stylex.create({
  box: { pointerEvents: 'none', width: '100%' },
});

/** Renders the first live demo of a component, non-interactive (for thumbnails). */
export function Preview({ slug, index = 0 }: { slug: string; index?: number }) {
  const C = getDemo(slug)?.demos[index]?.Component;
  if (!C) return null;
  return (
    <div {...stylex.props(styles.box)} aria-hidden="true" inert>
      <C />
    </div>
  );
}
