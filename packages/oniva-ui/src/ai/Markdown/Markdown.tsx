import * as stylex from '@stylexjs/stylex';
import { Fragment, type ReactNode, type Ref } from 'react';
import { marked, type Token, type Tokens } from 'marked';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { safeUrl } from '../../internal/ai-motion';
import { CodeBlock } from '../CodeBlock';

const styles = stylex.create({
  root: {
    color: colors.text,
    fontFamily: font.sans,
    fontSize: font.size14,
    lineHeight: font.lh16,
    overflowWrap: 'anywhere',
  },
  p: { marginBlock: 0, marginBlockEnd: 12 },
  h1: { fontSize: font.size20, fontWeight: font.weightSemibold, lineHeight: font.lh20, margin: 0, marginBlockEnd: 8, marginBlockStart: 16 },
  h2: { fontSize: font.size16, fontWeight: font.weightSemibold, lineHeight: font.lh16, margin: 0, marginBlockEnd: 8, marginBlockStart: 16 },
  h3: { fontSize: font.size14, fontWeight: font.weightSemibold, lineHeight: font.lh14, margin: 0, marginBlockEnd: 6, marginBlockStart: 12 },
  list: { marginBlock: 0, marginBlockEnd: 12, paddingInlineStart: 22 },
  li: { marginBlockEnd: 4 },
  task: { listStyle: 'none', marginInlineStart: -22 },
  quote: {
    borderInlineStartColor: colors.borderHover,
    borderInlineStartStyle: 'solid',
    borderInlineStartWidth: 3,
    color: colors.textMuted,
    marginBlock: 0,
    marginBlockEnd: 12,
    paddingInlineStart: 12,
  },
  hr: { borderColor: colors.border, borderStyle: 'solid', borderWidth: 0, borderBlockStartWidth: 1, marginBlock: 16 },
  a: {
    color: colors.accentSoftFg,
    textDecoration: 'underline',
    textDecorationThickness: 1,
    textUnderlineOffset: 2,
  },
  code: {
    backgroundColor: colors.surfaceTertiary,
    borderRadius: radius.xs,
    color: colors.text,
    fontFamily: font.mono,
    fontSize: '0.9em',
    paddingBlock: 1,
    paddingInline: 5,
  },
  block: { marginBlockEnd: 12 },
  tableWrap: {
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: 1,
    marginBlockEnd: 12,
    overflowX: 'auto',
  },
  table: { borderCollapse: 'collapse', fontSize: font.size13, width: '100%' },
  th: {
    backgroundColor: colors.surfaceInset,
    borderBottomColor: colors.border,
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    color: colors.textMuted,
    fontWeight: font.weightMedium,
    paddingBlock: 8,
    paddingInline: 12,
    whiteSpace: 'nowrap',
  },
  td: {
    borderBottomColor: colors.border,
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    fontVariantNumeric: 'tabular-nums',
    paddingBlock: 8,
    paddingInline: 12,
  },
  left: { textAlign: 'left' },
  right: { textAlign: 'right' },
  center: { textAlign: 'center' },
  img: { maxWidth: '100%', borderRadius: radius.lg },
});

export interface MarkdownProps {
  /** Markdown source. Raw HTML in the source is rendered as inert text, never as markup. */
  children: string;
  /** Replace how a link is rendered (e.g. to turn `[1]` links into `Citation`s). */
  renderLink?: (props: { href: string | undefined; title?: string; children: ReactNode; text: string }) => ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

type Ctx = { renderLink?: MarkdownProps['renderLink'] };

function inline(tokens: Token[] | undefined, ctx: Ctx): ReactNode {
  if (!tokens) return null;
  return tokens.map((t, i) => <Fragment key={i}>{inlineToken(t, ctx)}</Fragment>);
}

function inlineToken(t: Token, ctx: Ctx): ReactNode {
  switch (t.type) {
    case 'text': {
      const tt = t as Tokens.Text;
      return tt.tokens ? inline(tt.tokens, ctx) : tt.text;
    }
    case 'escape':
      return (t as Tokens.Escape).text;
    case 'strong':
      return <strong>{inline((t as Tokens.Strong).tokens, ctx)}</strong>;
    case 'em':
      return <em>{inline((t as Tokens.Em).tokens, ctx)}</em>;
    case 'del':
      return <del>{inline((t as Tokens.Del).tokens, ctx)}</del>;
    case 'codespan':
      return <code {...stylex.props(styles.code)}>{(t as Tokens.Codespan).text}</code>;
    case 'br':
      return <br />;
    case 'link': {
      const l = t as Tokens.Link;
      const href = safeUrl(l.href);
      const kids = inline(l.tokens, ctx);
      if (ctx.renderLink) return ctx.renderLink({ href, title: l.title ?? undefined, children: kids, text: l.text });
      return href ? (
        <a
          href={href}
          title={l.title ?? undefined}
          target="_blank"
          rel="noopener noreferrer"
          {...stylex.props(styles.a)}
        >
          {kids}
        </a>
      ) : (
        <>{kids}</>
      );
    }
    case 'image': {
      const im = t as Tokens.Image;
      const src = safeUrl(im.href);
      return src && !src.startsWith('mailto:') ? (
        <img src={src} alt={im.text} title={im.title ?? undefined} loading="lazy" {...stylex.props(styles.img)} />
      ) : (
        im.text
      );
    }
    case 'html':
      // Never inject raw HTML: show it as literal text.
      return (t as Tokens.HTML).text;
    default:
      return 'raw' in t ? String((t as { raw: string }).raw) : null;
  }
}

function block(tokens: Token[], ctx: Ctx): ReactNode[] {
  const out: ReactNode[] = [];
  tokens.forEach((t, i) => {
    switch (t.type) {
      case 'space':
        return;
      case 'paragraph':
        out.push(
          <p key={i} {...stylex.props(styles.p)}>
            {inline((t as Tokens.Paragraph).tokens, ctx)}
          </p>,
        );
        return;
      case 'heading': {
        const h = t as Tokens.Heading;
        const Tag = (`h${Math.min(h.depth, 6)}`) as 'h1';
        const s = h.depth === 1 ? styles.h1 : h.depth === 2 ? styles.h2 : styles.h3;
        out.push(
          <Tag key={i} {...stylex.props(s)}>
            {inline(h.tokens, ctx)}
          </Tag>,
        );
        return;
      }
      case 'code': {
        const c = t as Tokens.Code;
        out.push(<CodeBlock key={i} code={c.text} language={c.lang || undefined} xstyle={styles.block} />);
        return;
      }
      case 'blockquote':
        out.push(
          <blockquote key={i} {...stylex.props(styles.quote)}>
            {block((t as Tokens.Blockquote).tokens, ctx)}
          </blockquote>,
        );
        return;
      case 'hr':
        out.push(<hr key={i} {...stylex.props(styles.hr)} />);
        return;
      case 'list': {
        const l = t as Tokens.List;
        const Tag = l.ordered ? 'ol' : 'ul';
        out.push(
          <Tag key={i} start={l.ordered && l.start !== '' ? Number(l.start) : undefined} {...stylex.props(styles.list)}>
            {l.items.map((it, j) => (
              <li key={j} {...stylex.props(styles.li, it.task && styles.task)}>
                {it.task && <input type="checkbox" checked={Boolean(it.checked)} readOnly aria-label={it.checked ? 'Done' : 'Not done'} style={{ marginInlineEnd: 6 }} />}
                {block(it.tokens, { ...ctx }).map((n, k) => (
                  <Fragment key={k}>{n}</Fragment>
                ))}
              </li>
            ))}
          </Tag>,
        );
        return;
      }
      case 'table': {
        const tb = t as Tokens.Table;
        const al = (a: string | null) => (a === 'right' ? styles.right : a === 'center' ? styles.center : styles.left);
        out.push(
          <div key={i} {...stylex.props(styles.tableWrap)}>
            <table {...stylex.props(styles.table)}>
              <thead>
                <tr>
                  {tb.header.map((c, j) => (
                    <th key={j} scope="col" {...stylex.props(styles.th, al(tb.align[j] ?? null))}>
                      {inline(c.tokens, ctx)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tb.rows.map((r, ri) => (
                  <tr key={ri}>
                    {r.map((c, j) => (
                      <td key={j} {...stylex.props(styles.td, al(tb.align[j] ?? null))}>
                        {inline(c.tokens, ctx)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>,
        );
        return;
      }
      case 'html':
        out.push(
          <p key={i} {...stylex.props(styles.p)}>
            {(t as Tokens.HTML).text}
          </p>,
        );
        return;
      case 'text': {
        // tight list item content
        const tt = t as Tokens.Text;
        out.push(<Fragment key={i}>{tt.tokens ? inline(tt.tokens, ctx) : tt.text}</Fragment>);
        return;
      }
      default:
        return;
    }
  });
  return out;
}

/** Renders Markdown via `marked` tokens mapped to React elements (no `dangerouslySetInnerHTML`). */
export function Markdown({ children, renderLink, className, xstyle, ref }: MarkdownProps) {
  const tokens = marked.lexer(children, { gfm: true, breaks: false });
  const sx = stylex.props(styles.root, xstyle);
  return (
    <div ref={ref} className={[sx.className, className].filter(Boolean).join(' ')} style={sx.style}>
      {block(tokens, { renderLink })}
    </div>
  );
}
