import * as stylex from '@stylexjs/stylex';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, Tile } from 'oniva-ui';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import { CodeBlock } from '../CodeBlock';
import type { DemoModule } from '../../../../../packages/oniva-ui/src/internal/demo';
import type { DocPage, Section } from '../../content/types';
import { AnatomyStage, DoDont, Intro, KeyboardTable, MetaStrip, Playground, PropsTable, Related, RuleCards, SectionH2, StateGallery, UsageCards } from './primitives';

const s = stylex.create({
  crumb: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'flex', flexWrap: 'wrap', fontSize: font['--oniva-font-size-14'], gap: 6 },
  crumbLink: { color: { default: 'inherit', ':hover': colors['--oniva-color-text'] }, textDecoration: 'none' },
  crumbCur: { color: colors['--oniva-color-text'] },
  h1: { fontSize: font['--oniva-font-size-40'], fontWeight: font['--oniva-font-weight-medium'], letterSpacing: '-0.025em', lineHeight: 1.1, margin: '28px 0 16px' },
  lede: { color: colors['--oniva-color-text-muted'], fontSize: 18, lineHeight: 1.6, margin: '0 0 24px', maxWidth: 680, textWrap: 'pretty' },
  stack: { display: 'flex', flexDirection: 'column', gap: 24 },
  preview: { alignItems: 'flex-start', display: 'flex', minHeight: 96, minWidth: 0, overflowX: 'auto', padding: 24, position: 'relative' },
});

export function Crumb({ trail }: { trail: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" {...stylex.props(s.crumb)}>
      {trail.map((t, i) => (
        <span key={t.label}>
          {t.to ? <Link to={t.to} {...stylex.props(s.crumbLink)}>{t.label}</Link> : <span aria-current="page" {...stylex.props(i === trail.length - 1 && s.crumbCur)}>{t.label}</span>}
          {i < trail.length - 1 ? ' / ' : ''}
        </span>
      ))}
    </nav>
  );
}

function SectionView({ sec }: { sec: Section }) {
  return (
    <section aria-labelledby={sec.id}>
      <SectionH2 id={sec.id}>{sec.title}</SectionH2>
      {'intro' in sec && sec.intro ? <Intro>{sec.intro}</Intro> : null}
      {sec.type === 'rules' ? <RuleCards items={sec.items} /> : null}
      {sec.type === 'numbered' ? <RuleCards numbered items={sec.items} /> : null}
      {sec.type === 'dodont' ? <DoDont items={sec.items} /> : null}
      {sec.type === 'text' ? <Intro>{sec.body}</Intro> : null}
      {sec.type === 'itemTypes' ? <StateGallery states={sec.items.map((i) => ({ name: i.name, description: i.description, Render: i.Render }))} /> : null}
      {sec.type === 'custom' ? <sec.Render /> : null}
    </section>
  );
}

export function DocPageView({ page, mod }: { page: DocPage; mod: DemoModule }) {
  const [root, ...rest] = page.group;
  return (
    <article>
      <Crumb trail={[{ label: root ?? 'Components', to: '/components' }, ...rest.map((l) => ({ label: l })), { label: mod.meta.title }]} />
      <h1 {...stylex.props(s.h1)}>{mod.meta.title}</h1>
      <p {...stylex.props(s.lede)}>{page.lede}</p>
      <MetaStrip page={page} />
      <section aria-labelledby="anatomy"><SectionH2 id="anatomy">Anatomy</SectionH2><AnatomyStage {...page.anatomy} /></section>
      <section aria-labelledby="usage"><SectionH2 id="usage">Usage</SectionH2><UsageCards usage={page.usage} /></section>
      <section aria-labelledby="playground"><SectionH2 id="playground">Playground</SectionH2><Intro>Change the controls or use the component directly. The code below stays in sync.</Intro><Playground key={page.slug} pg={page.playground} /></section>
      <section aria-labelledby="states"><SectionH2 id="states">All states</SectionH2><Intro>Each state is a live instance, locked so you can study it.</Intro><StateGallery states={page.states} /></section>
      {page.sections.map((sec) => <SectionView key={sec.id} sec={sec} />)}
      {page.content ? (
        <section aria-labelledby="content"><SectionH2 id="content">{page.content.title ?? 'Content'}</SectionH2><RuleCards items={page.content.rules} /></section>
      ) : null}
      <section aria-labelledby="accessibility">
        <SectionH2 id="accessibility">Accessibility</SectionH2>
        <KeyboardTable rows={page.accessibility.keyboard} />
        <div style={{ height: 16 }} />
        <RuleCards items={[...page.accessibility.notes.map((n, i) => ({ title: `Note ${i + 1}`, body: n })), ...(page.accessibility.reducedMotion ? [{ title: 'Reduced motion', body: page.accessibility.reducedMotion }] : [])]} />
      </section>
      <section aria-labelledby="api"><SectionH2 id="api">API</SectionH2><PropsTable props={page.props} /></section>
      <section aria-labelledby="examples">
        <SectionH2 id="examples">Examples</SectionH2>
        <div {...stylex.props(s.stack)}>
          {mod.demos.map((d) => (
            <Card key={d.name} data-testid="demo">
              <CardHeader><CardTitle as="h3">{d.name}</CardTitle></CardHeader>
              <Tile padding="none" xstyle={s.preview}><d.Component /></Tile>
              <CodeBlock code={d.code} />
            </Card>
          ))}
        </div>
      </section>
      <section aria-labelledby="related"><SectionH2 id="related">Related</SectionH2><Related slugs={page.related} /></section>
    </article>
  );
}
