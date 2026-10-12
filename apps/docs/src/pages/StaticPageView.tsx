import { useLocation } from 'react-router-dom';
import * as stylex from '@stylexjs/stylex';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import { staticPages } from '../content/static';
import { Crumb } from '../components/doc/DocPageView';
import { SectionH2 } from '../components/doc/primitives';

const s = stylex.create({
  h1: { fontSize: font['--oniva-font-size-40'], fontWeight: font['--oniva-font-weight-medium'], letterSpacing: '-0.025em', lineHeight: 1.1, margin: '28px 0 16px' },
  lede: { color: colors['--oniva-color-text-muted'], fontSize: 18, lineHeight: 1.6, margin: '0 0 8px', maxWidth: 680, textWrap: 'pretty' },
});
const LABEL = { 'getting-started': 'Getting started', foundations: 'Foundations', patterns: 'Patterns' } as const;

export function StaticPageView() {
  const { pathname } = useLocation();
  const page = staticPages.find((p) => p.path === pathname);
  if (!page) return <h1 {...stylex.props(s.h1)}>Not found</h1>;
  return (
    <article>
      <Crumb trail={[{ label: LABEL[page.group] }, { label: page.title }]} />
      <h1 {...stylex.props(s.h1)}>{page.title}</h1>
      <p {...stylex.props(s.lede)}>{page.lede}</p>
      {page.sections.map((sec) => (
        <section key={sec.id} aria-labelledby={sec.id}>
          <SectionH2 id={sec.id}>{sec.title}</SectionH2>
          <sec.Render />
        </section>
      ))}
    </article>
  );
}
