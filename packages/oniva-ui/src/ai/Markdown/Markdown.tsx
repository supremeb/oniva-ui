import * as stylex from '@stylexjs/stylex';
import { Fragment, useEffect, useRef, useState, type ReactNode, type Ref } from 'react';
import { marked, type Token, type Tokens } from 'marked';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { safeUrl } from '../../internal/ai-motion';
import { CodeBlock } from '../CodeBlock';

const styles = stylex.create({
  root: {
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    lineHeight: font['--oniva-font-lh-16'],
    overflowWrap: 'anywhere',
  },
  p: { marginBlock: 0, marginBlockEnd: 12 },
  // First/last block inside the root, a quote or a list item: no outer margin so the box hugs its content.
  noStart: { marginBlockStart: 0 },
  noEnd: { marginBlockEnd: 0 },
  h1: {
    fontSize: font['--oniva-font-size-20'],
    fontWeight: font['--oniva-font-weight-semibold'],
    lineHeight: font['--oniva-font-lh-20'],
    margin: 0,
    marginBlockEnd: 8,
    marginBlockStart: 16,
  },
  h2: {
    fontSize: font['--oniva-font-size-16'],
    fontWeight: font['--oniva-font-weight-semibold'],
    lineHeight: font['--oniva-font-lh-16'],
    margin: 0,
    marginBlockEnd: 8,
    marginBlockStart: 16,
  },
  h3: {
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-semibold'],
    lineHeight: font['--oniva-font-lh-14'],
    margin: 0,
    marginBlockEnd: 6,
    marginBlockStart: 12,
  },
  list: { marginBlock: 0, marginBlockEnd: 12, paddingInlineStart: 22 },
  ordered: { fontVariantNumeric: 'tabular-nums' },
  nestedList: { marginBlockEnd: 0, marginBlockStart: 4 },
  li: { marginBlockEnd: 4 },
  liLoose: { marginBlockEnd: 16 },
  task: { listStyle: 'none', marginInlineStart: -22 },
  check: { accentColor: accent['--oniva-accent-solid'], marginInlineEnd: 6 },
  quote: {
    borderInlineStartColor: colors['--oniva-color-border-hover'],
    borderInlineStartStyle: 'solid',
    borderInlineStartWidth: 3,
    color: colors['--oniva-color-text-muted'],
    marginBlock: 0,
    marginBlockEnd: 12,
    // Cancel the user-agent's 40px quote indent; the bar sits flush with surrounding text.
    marginInline: 0,
    paddingInlineStart: 12,
  },
  hr: {
    borderColor: colors['--oniva-color-border'],
    borderStyle: 'solid',
    borderWidth: 0,
    borderBlockStartWidth: 1,
    marginBlock: 16,
  },
  a: {
    color: colors['--oniva-color-accent-soft-fg'],
    textDecoration: 'underline',
    textDecorationThickness: 1,
    textUnderlineOffset: 2,
  },
  aWrap: { borderRadius: radius['--oniva-radius-xs'] },
  code: {
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-xs'],
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-mono'],
    fontSize: '0.9em',
    paddingBlock: 1,
    paddingInline: 5,
  },
  block: { marginBlockEnd: 12 },
  blockEnd: { marginBlockEnd: 0 },
  tableWrap: {
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    marginBlockEnd: 12,
    overflowX: 'auto',
  },
  table: { borderCollapse: 'collapse', fontSize: font['--oniva-font-size-13'], width: '100%' },
  th: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderBottomColor: colors['--oniva-color-border'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    color: colors['--oniva-color-text-muted'],
    fontWeight: font['--oniva-font-weight-medium'],
    paddingBlock: 8,
    paddingInline: 12,
    whiteSpace: 'nowrap',
  },
  td: {
    borderBottomColor: colors['--oniva-color-border'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    fontVariantNumeric: 'tabular-nums',
    // The root breaks anywhere; cells keep words whole and let the wrapper scroll instead.
    overflowWrap: 'normal',
    paddingBlock: 8,
    paddingInline: 12,
  },
  left: { textAlign: 'left' },
  right: { textAlign: 'right' },
  center: { textAlign: 'center' },
  img: { height: 'auto', maxWidth: '100%', borderRadius: radius['--oniva-radius-lg'] },
});

export interface MarkdownProps {
  /** Markdown source. Raw HTML in the source is rendered as inert text, never as markup. */
  children: string;
  /** Replace how a link is rendered (e.g. to turn `[1]` links into `Citation`s). */
  renderLink?: (props: {
    href: string | undefined;
    title?: string;
    children: ReactNode;
    text: string;
  }) => ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

type Ctx = {
  renderLink?: MarkdownProps['renderLink'];
  /** Drop the outer margin of the first and last block (root, quote, list item). */
  trim?: boolean;
  nested?: boolean;
};

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
      if (ctx.renderLink)
        return ctx.renderLink({ href, title: l.title ?? undefined, children: kids, text: l.text });
      return href ? (
        <a
          href={href}
          title={l.title ?? undefined}
          target={/^https?:/i.test(href) ? '_blank' : undefined}
          rel="noopener noreferrer"
          {...stylex.props(styles.a, styles.aWrap, focus.ring)}
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
        <img
          src={src}
          alt={im.text}
          title={im.title ?? undefined}
          loading="lazy"
          {...stylex.props(styles.img)}
        />
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

/** Horizontal scroller for wide tables. Becomes a labelled, keyboard-focusable region only while it overflows. */
function TableScroll({
  children,
  trimStart,
  trimEnd,
}: {
  children: ReactNode;
  trimStart?: boolean;
  trimEnd?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [overflows, setOverflows] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const measure = () => setOverflows(el.scrollWidth > el.clientWidth + 1);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => ro.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      {...(overflows ? { tabIndex: 0, role: 'region', 'aria-label': 'Table, scrollable' } : {})}
      {...stylex.props(
        styles.tableWrap,
        overflows && focus.inset,
        trimStart && styles.noStart,
        trimEnd && styles.noEnd,
      )}
    >
      {children}
    </div>
  );
}

function block(tokens: Token[], ctx: Ctx): ReactNode[] {
  const out: ReactNode[] = [];
  const visible = tokens.map((t, i) => (t.type === 'space' ? -1 : i)).filter((i) => i >= 0);
  const firstIdx = visible[0];
  const lastIdx = visible[visible.length - 1];
  tokens.forEach((t, i) => {
    const edge = [
      ctx.trim && i === firstIdx && styles.noStart,
      ctx.trim && i === lastIdx && styles.noEnd,
    ];
    switch (t.type) {
      case 'space':
        return;
      case 'paragraph':
        out.push(
          <p key={i} {...stylex.props(styles.p, edge)}>
            {inline((t as Tokens.Paragraph).tokens, ctx)}
          </p>,
        );
        return;
      case 'heading': {
        const h = t as Tokens.Heading;
        const Tag = `h${Math.min(h.depth, 6)}` as 'h1';
        const s = h.depth === 1 ? styles.h1 : h.depth === 2 ? styles.h2 : styles.h3;
        out.push(
          <Tag key={i} {...stylex.props(s, edge)}>
            {inline(h.tokens, ctx)}
          </Tag>,
        );
        return;
      }
      case 'code': {
        const c = t as Tokens.Code;
        out.push(
          <CodeBlock
            key={i}
            code={c.text}
            language={c.lang || undefined}
            xstyle={ctx.trim && i === lastIdx ? styles.blockEnd : styles.block}
          />,
        );
        return;
      }
      case 'blockquote':
        out.push(
          <blockquote key={i} {...stylex.props(styles.quote, edge)}>
            {block((t as Tokens.Blockquote).tokens, { ...ctx, trim: true })}
          </blockquote>,
        );
        return;
      case 'hr':
        out.push(<hr key={i} {...stylex.props(styles.hr, edge)} />);
        return;
      case 'list': {
        const l = t as Tokens.List;
        const Tag = l.ordered ? 'ol' : 'ul';
        out.push(
          <Tag
            key={i}
            start={l.ordered && l.start !== '' ? Number(l.start) : undefined}
            {...stylex.props(
              styles.list,
              l.ordered && styles.ordered,
              ctx.nested && i !== firstIdx && styles.nestedList,
              edge,
            )}
          >
            {l.items.map((it, j) => (
              <li
                key={j}
                {...stylex.props(
                  styles.li,
                  l.loose && styles.liLoose,
                  j === l.items.length - 1 && styles.noEnd,
                  it.task && styles.task,
                )}
              >
                {it.task && (
                  <input
                    type="checkbox"
                    checked={Boolean(it.checked)}
                    readOnly
                    aria-label={it.checked ? 'Done' : 'Not done'}
                    {...stylex.props(styles.check)}
                  />
                )}
                {block(it.tokens, { ...ctx, trim: true, nested: true }).map((n, k) => (
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
        const al = (a: string | null) =>
          a === 'right' ? styles.right : a === 'center' ? styles.center : styles.left;
        out.push(
          <TableScroll
            key={i}
            trimStart={ctx.trim && i === firstIdx}
            trimEnd={ctx.trim && i === lastIdx}
          >
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
          </TableScroll>,
        );
        return;
      }
      case 'html':
        out.push(
          <p key={i} {...stylex.props(styles.p, edge)}>
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
      {block(tokens, { renderLink, trim: true })}
    </div>
  );
}
