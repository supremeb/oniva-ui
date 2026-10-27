import * as stylex from '@stylexjs/stylex';
import { ArrowRight, Check, Copy, Search, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, HTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { aib } from '../../internal/aib-styles';
import { mergeSx } from '../../internal/sx';
import { useFormatters } from '../../internal/format';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { CrossFade } from '../../motion/CrossFade';
import { m3 } from '../../internal/m3-motion';

const styles = stylex.create({
  sRoot: { containerType: 'inline-size', overflow: 'hidden' },
  sGrid: {
    display: 'grid',
    gridTemplateColumns: { default: 'minmax(180px, 2fr) 3fr', '@container (max-width: 480px)': '1fr' },
  },
  sSide: {
    borderInlineEndColor: { default: colors['--oniva-color-separator'], '@container (max-width: 480px)': 'transparent' },
    borderInlineEndStyle: 'solid',
    borderInlineEndWidth: 1,
    minWidth: 0,
    padding: 12,
  },
  sHead: { alignItems: 'center', display: 'flex', gap: 8, minHeight: 28, paddingBlockEnd: 8, paddingInline: 4 },
  sCount: { color: colors['--oniva-color-text-subtle'], fontSize: font['--oniva-font-size-13'], fontVariantNumeric: 'tabular-nums' },
  sList: { display: 'flex', flexDirection: 'column', gap: 2, listStyle: 'none', margin: 0, padding: 0 },
  sRow: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors['--oniva-color-surface-hover'],
      ':is([aria-current="true"])': colors['--oniva-color-surface-inset'],
    },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    gap: 8,
    justifyContent: 'space-between',
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: -2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    paddingBlock: 8,
    paddingInline: 8,
    textAlign: 'start',
    width: '100%',
  },
  sMain: { display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0, padding: 12 },
  sTitle: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8, minHeight: 28 },
  sDots: { alignItems: 'center', display: 'inline-flex', gap: 3 },
  sDot: { backgroundColor: colors['--oniva-color-border-control'], borderRadius: radius['--oniva-radius-full'], height: 6, width: 6 },
  sDotOn: { backgroundColor: colors['--oniva-color-accent-text'] },
  sTemplate: { fontSize: font['--oniva-font-size-14'], lineHeight: 2, margin: 0 },
  sInput: {
    backgroundColor: { default: colors['--oniva-color-surface'], ':focus': colors['--oniva-color-surface'] },
    borderColor: { default: colors['--oniva-color-border-control'], ':focus': colors['--oniva-color-focus-ring'] },
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'content-box',
    color: colors['--oniva-color-text'],
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-13'],
    height: 22,
    margin: 0,
    marginInline: 2,
    maxWidth: '100%',
    outlineStyle: 'none',
    paddingInline: 6,
    verticalAlign: 'baseline',
  },
  sInputOn: { backgroundColor: colors['--oniva-color-accent-soft'], borderColor: 'transparent', color: colors['--oniva-color-accent-soft-fg'] },
  sLabel: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], fontWeight: font['--oniva-font-weight-medium'], letterSpacing: '0.05em', margin: 0, textTransform: 'uppercase' },
  sPreview: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: 1.6,
    margin: 0,
    padding: 12,
    whiteSpace: 'pre-wrap',
  },
  sFoot: {
    alignItems: 'center',
    borderBlockStartColor: colors['--oniva-color-separator'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    paddingBlock: 10,
    paddingInline: 16,
  },
  sBtns: { alignItems: 'center', display: 'flex', gap: 8, marginInlineStart: 'auto' },
  list: { display: 'flex', flexDirection: 'column', gap: 6, listStyle: 'none', margin: 0, padding: 0 },
  item: { display: 'flex', flexDirection: 'column' },
  pick: {
    alignItems: 'flex-start',
    appearance: 'none',
    backgroundColor: { default: 'transparent', ':hover': colors['--oniva-color-surface-hover'] },
    borderRadius: radius['--oniva-radius-lg'],
    borderWidth: 0,
    color: 'inherit',
    cursor: 'pointer',
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    gap: 10,
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: -2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    padding: 12,
    textAlign: 'start',
    width: '100%',
  },
  mark: { backgroundColor: colors['--oniva-color-accent-soft'], borderRadius: 3, color: colors['--oniva-color-accent-soft-fg'] },
  gap: { color: colors['--oniva-color-text-subtle'] },
  tray: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'flex', flexGrow: 1, fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums', gap: 4 },
  sr: { borderWidth: 0, clip: 'rect(0 0 0 0)', height: 1, margin: -1, overflow: 'hidden', padding: 0, position: 'absolute', whiteSpace: 'nowrap', width: 1 },
  tmpl: { color: colors['--oniva-color-text-muted'], fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-12'], lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' },
  vars: { display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', padding: 12 },
  label: { display: 'flex', flexDirection: 'column', gap: 4 },
  foot: { display: 'flex', gap: 8, justifyContent: 'flex-end', padding: 12, paddingTop: 0 },
  search: { position: 'relative' },
  inl: { display: 'inline-flex' },
  searchIcon: { color: colors['--oniva-color-icon-muted'], insetInlineStart: 10, pointerEvents: 'none', position: 'absolute', top: 9 },
});

export interface SavedPrompt {
  id: string;
  name: string;
  /** Template with `{{variable}}` placeholders. */
  template: string;
  tags?: string[];
  /** Optional hints per variable name: a description (placeholder) and a default value. */
  variables?: Record<string, { description?: string; default?: string }>;
}

export type PromptLibraryVariant = 'list' | 'split';

export interface PromptLibraryProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'title' | 'onCopy'> {
  prompts: SavedPrompt[];
  title?: string;
  /** Called with the template filled in with the entered variables. */
  onUse?: (prompt: SavedPrompt, filled: string) => void;
  /** Called after the filled prompt was copied to the clipboard. */
  onCopy?: (filled: string) => void;
  /** Use stays aria-disabled until every variable is filled. Default false (unfilled variables stay as `{{name}}`). */
  requireAll?: boolean;
  useLabel?: string;
  /** `list` (default): expandable rows. `split`: prompt list on the left, inline-fill editor and live preview on the right. */
  variant?: PromptLibraryVariant;
  /** Split variant: id of the prompt selected on first render (default: first). */
  defaultSelectedId?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

// `{{name}}` and `{name}` both mark a variable.
const VAR = /\{\{\s*([\w-]+)\s*\}\}|\{([\w-]+)\}/g;
export const variablesOf = (t: string) => [...new Set([...t.matchAll(VAR)].map((m) => (m[1] ?? m[2])!))];
export const fillTemplate = (t: string, v: Record<string, string>) => t.replace(VAR, (whole, a?: string, b?: string) => v[(a ?? b)!] || whole);

type Piece = { text: string; kind: 'static' | 'filled' | 'empty' };
function piecesOf(t: string, v: Record<string, string>): Piece[] {
  const out: Piece[] = [];
  let last = 0;
  for (const m of t.matchAll(VAR)) {
    const at = m.index ?? 0;
    if (at > last) out.push({ text: t.slice(last, at), kind: 'static' });
    const val = v[(m[1] ?? m[2])!];
    out.push(val ? { text: val, kind: 'filled' } : { text: m[0], kind: 'empty' });
    last = at + m[0].length;
  }
  if (last < t.length) out.push({ text: t.slice(last), kind: 'static' });
  return out;
}

/** Saved prompts with search, `{{variable}}` inputs and a live-filled preview. */
export function PromptLibrary({ prompts, title = 'Prompt library', onUse, onCopy, requireAll = false, useLabel = 'Use prompt', variant = 'list', defaultSelectedId, className, xstyle, ref, ...rest }: PromptLibraryProps) {
  const fmt = useFormatters();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(variant === 'split' ? (defaultSelectedId ?? null) : null);
  const [vals, setVals] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);
  const [live, setLive] = useState('');
  const listRef = useRef<HTMLUListElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(copyTimer.current), []);
  const valuesOf = (p: SavedPrompt) =>
    Object.fromEntries(variablesOf(p.template).map((v) => [v, vals[`${p.id}.${v}`] ?? p.variables?.[v]?.default ?? '']));
  const missingOf = (p: SavedPrompt) => Object.values(valuesOf(p)).filter((x) => !x.trim()).length;
  const use = (p: SavedPrompt) => {
    if (requireAll && missingOf(p) > 0) {
      setLive(fmt.plural(missingOf(p), { one: '# variable still missing', other: '# variables still missing' }));
      return;
    }
    onUse?.(p, fillTemplate(p.template, valuesOf(p)));
    setLive('Prompt used');
  };
  const openPrompt = prompts.find((p) => p.id === open);
  const missingOpen = openPrompt ? missingOf(openPrompt) : -1;
  const prevMissing = useRef(missingOpen);
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    if (prevMissing.current > 0 && missingOpen === 0) setPulse((n) => n + 1);
    prevMissing.current = missingOpen;
  }, [missingOpen]);
  const shown = useMemo(() => {
    const n = q.trim().toLowerCase();
    return prompts.filter((p) => !n || p.name.toLowerCase().includes(n) || p.tags?.some((t) => t.toLowerCase().includes(n)));
  }, [prompts, q]);
  const sel = shown.find((p) => p.id === open) ?? shown[0];
  const copyOf = (p: SavedPrompt) => {
    const filled = fillTemplate(p.template, valuesOf(p));
    void Promise.resolve(navigator.clipboard?.writeText(filled)).catch(() => {});
    setCopied(p.id);
    setLive('Prompt copied');
    onCopy?.(filled);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(null), 1600);
  };
  if (variant === 'split') {
    const vars = sel ? variablesOf(sel.template) : [];
    const vv = sel ? valuesOf(sel) : {};
    const filledCount = vars.filter((v) => vv[v]?.trim()).length;
    const segs: Array<{ t: string } | { v: string }> = [];
    if (sel) {
      let last = 0;
      for (const m of sel.template.matchAll(VAR)) {
        const at = m.index ?? 0;
        if (at > last) segs.push({ t: sel.template.slice(last, at) });
        segs.push({ v: (m[1] ?? m[2])! });
        last = at + m[0].length;
      }
      if (last < sel.template.length) segs.push({ t: sel.template.slice(last) });
    }
    return (
      <div {...rest} ref={ref} {...mergeSx(stylex.props(aiStyles.tile, styles.sRoot, xstyle), className)}>
        <div {...stylex.props(styles.sGrid)}>
          <div {...stylex.props(styles.sSide)}>
            <div {...stylex.props(styles.sHead)}>
              <h3 {...stylex.props(aib.title)}>{title}</h3>
              <span {...stylex.props(styles.sCount)}><AnimatedNumber value={shown.length} /></span>
            </div>
            <div {...stylex.props(styles.search)} style={{ marginBottom: 8 }}>
              <Search size={14} aria-hidden="true" {...stylex.props(styles.searchIcon)} />
              <input type="search" aria-label="Search prompts" placeholder="Search templates" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Escape' && q) { e.preventDefault(); setQ(''); } }} {...stylex.props(aib.field)} style={{ paddingInlineStart: 30 }} />
            </div>
            <ul ref={listRef} {...stylex.props(styles.sList)}>
              {shown.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    aria-current={sel?.id === p.id ? 'true' : undefined}
                    onClick={() => setOpen(p.id)}
                    onKeyDown={(e) => { const btns = [...(listRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? [])]; const i = btns.indexOf(e.currentTarget); const to = e.key === 'ArrowDown' ? btns[i + 1] : e.key === 'ArrowUp' ? btns[i - 1] : undefined; if (to) { e.preventDefault(); to.focus(); } }}
                    {...stylex.props(styles.sRow)}
                  >
                    <span {...stylex.props(aib.grow, aib.clamp)}>{p.name}</span>
                    {p.tags?.[0] && <Badge variant="neutral" size="sm">{p.tags[0]}</Badge>}
                  </button>
                </li>
              ))}
            </ul>
            {shown.length === 0 && <p {...stylex.props(aib.meta)} style={{ padding: 16, textAlign: 'center' }}>No prompts match “{q}”.</p>}
          </div>
          {sel && (
            <div {...stylex.props(styles.sMain)}>
              <div {...stylex.props(styles.sTitle)}>
                <h4 {...stylex.props(aib.title)}>{sel.name}</h4>
                <span {...stylex.props(aib.grow)} />
                {sel.tags?.[0] && <Badge variant="accent" size="sm">{sel.tags[0]}</Badge>}
                {vars.length > 0 && (
                  <>
                    <span aria-hidden="true" {...stylex.props(styles.sDots)}>
                      {vars.map((v) => <span key={v} {...stylex.props(styles.sDot, !!vv[v]?.trim() && styles.sDotOn)} />)}
                    </span>
                    <span {...stylex.props(aib.meta, aiStyles.num)}>{filledCount} of {vars.length} filled</span>
                  </>
                )}
              </div>
              <p data-vars="" {...stylex.props(styles.sTemplate)}>
                {segs.map((g, i) =>
                  'v' in g ? (
                    <input
                      key={i}
                      data-var={g.v}
                      aria-label={g.v}
                      placeholder={sel.variables?.[g.v]?.description ?? g.v}
                      value={vals[`${sel.id}.${g.v}`] ?? sel.variables?.[g.v]?.default ?? ''}
                      size={1}
                      style={{ width: `${Math.max((vals[`${sel.id}.${g.v}`] ?? sel.variables?.[g.v]?.default ?? '').length, (sel.variables?.[g.v]?.description ?? g.v).length, 4) + 1}ch` }}
                      onChange={(e) => { const next = e.target.value; setVals((x) => ({ ...x, [`${sel.id}.${g.v}`]: next })); }}
                      onKeyDown={(e) => {
                        if (e.key !== 'Enter') return;
                        e.preventDefault();
                        const nextEmpty = vars.slice(vars.indexOf(g.v) + 1).concat(vars.slice(0, vars.indexOf(g.v))).find((n) => !vv[n]?.trim());
                        if (nextEmpty) e.currentTarget.closest('[data-vars]')?.querySelector<HTMLInputElement>(`input[data-var="${nextEmpty}"]`)?.focus();
                        else use(sel);
                      }}
                      {...stylex.props(styles.sInput, !!vv[g.v]?.trim() && styles.sInputOn)}
                    />
                  ) : (
                    <span key={i}>{g.t}</span>
                  ),
                )}
              </p>
              <p {...stylex.props(styles.sLabel)}>Preview</p>
              <p {...stylex.props(styles.sPreview)}>
                {piecesOf(sel.template, vv).map((pc, i) =>
                  pc.kind === 'filled' ? <mark key={i} {...stylex.props(styles.mark)}>{pc.text}</mark> : pc.kind === 'empty' ? <span key={i} {...stylex.props(styles.gap)}>{pc.text}</span> : pc.text,
                )}
              </p>
            </div>
          )}
        </div>
        {sel && (
          <div {...stylex.props(styles.sFoot)}>
            <span {...stylex.props(styles.tray)}>
              ~<AnimatedNumber value={Math.ceil(fillTemplate(sel.template, valuesOf(sel)).length / 4)} /> tokens
              {missingOf(sel) > 0 && requireAll && ` · ${fmt.plural(missingOf(sel), { one: '# variable missing', other: '# variables missing' })}`}
            </span>
            <span {...stylex.props(styles.sBtns)}>
              <Button
                size="sm"
                variant="secondary"
                startIcon={
                  <CrossFade as="span" contentKey={copied === sel.id ? 'check' : 'copy'} duration={200}>
                    {copied === sel.id ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                  </CrossFade>
                }
                onPress={() => copyOf(sel)}
              >
                {copied === sel.id ? 'Copied' : 'Copy'}
              </Button>
              <Button size="sm" endIcon={<ArrowRight size={14} aria-hidden="true" />} aria-disabled={requireAll && missingOf(sel) > 0 ? true : undefined} onPress={() => use(sel)}>
                {useLabel}
              </Button>
            </span>
          </div>
        )}
        <span role="status" aria-live="polite" {...stylex.props(styles.sr)}>{live}</span>
      </div>
    );
  }
  return (
    <div {...rest} ref={ref} {...mergeSx(stylex.props(aiStyles.panel, aib.pad, xstyle), className)}>
      <div {...stylex.props(aib.head)}>
        <h3 {...stylex.props(aib.title)}>{title}</h3>
        <span {...stylex.props(aib.meta, aiStyles.num)}><AnimatedNumber value={shown.length} /> of {prompts.length}</span>
      </div>
      <div {...stylex.props(styles.search)} style={{ marginBottom: 8 }}>
        <Search size={14} aria-hidden="true" {...stylex.props(styles.searchIcon)} />
        <input type="search" aria-label="Search prompts" placeholder="Search prompts or tags" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'ArrowDown') { e.preventDefault(); listRef.current?.querySelector<HTMLButtonElement>('button')?.focus(); } if (e.key === 'Escape' && q) { e.preventDefault(); setQ(''); } }} {...stylex.props(aib.field)} style={{ paddingInlineStart: 30 }} />
      </div>
      <ul ref={listRef} {...stylex.props(styles.list)}>
        {shown.map((p, pi) => {
          const isOpen = open === p.id;
          const vars = variablesOf(p.template);
          return (
            <li key={p.id} style={{ '--oniva-i': Math.min(pi, 6) } as CSSProperties} {...stylex.props(aiStyles.tile, styles.item, m3.rise)}>
              <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : p.id)} onKeyDown={(e) => { const btns = [...(listRef.current?.querySelectorAll<HTMLButtonElement>('button[aria-expanded]') ?? [])]; const i = btns.indexOf(e.currentTarget); const to = e.key === 'ArrowDown' ? btns[i + 1] : e.key === 'ArrowUp' ? btns[i - 1] : e.key === 'Home' ? btns[0] : e.key === 'End' ? btns[btns.length - 1] : undefined; if (to) { e.preventDefault(); to.focus(); } }} {...stylex.props(styles.pick)}>
                <span {...stylex.props(aib.iconBox)}><Sparkles size={16} /></span>
                <span {...stylex.props(aib.grow)}>
                  <span {...stylex.props(aib.name)} style={{ display: 'block' }}>{p.name}</span>
                  <span {...stylex.props(aib.meta)} style={{ display: 'block' }}>{fmt.plural(vars.length, { one: '# variable', other: '# variables' })}</span>
                </span>
                {p.tags?.slice(0, 2).map((t) => <Badge key={t} variant="neutral">{t}</Badge>)}
              </button>
              <AnimatedHeight isOpen={isOpen}>
                <div {...stylex.props(aib.divider)}>
                  <div data-vars="" {...stylex.props(styles.vars)}>
                    {vars.map((v, vi) => (
                      <label key={v} {...stylex.props(styles.label, aib.meta)}>
                        {v}
                        <input
                          value={vals[`${p.id}.${v}`] ?? p.variables?.[v]?.default ?? ''}
                          placeholder={p.variables?.[v]?.description}
                          onChange={(e) => {
                            const next = e.target.value;
                            setVals((s) => ({ ...s, [`${p.id}.${v}`]: next }));
                          }}
                          onBlur={() => { if (missingOf(p) === 0 && vars.length) setLive('All variables filled'); }}
                          onKeyDown={(e) => {
                            if (e.key !== 'Enter') return;
                            e.preventDefault();
                            const vv = valuesOf(p);
                            const nextEmpty = vars.slice(vi + 1).concat(vars.slice(0, vi)).find((n) => !vv[n]?.trim());
                            if (nextEmpty) (e.currentTarget.closest('[data-vars]')?.querySelector<HTMLInputElement>(`input[data-var="${nextEmpty}"]`))?.focus();
                            else use(p);
                          }}
                          data-var={v}
                          {...stylex.props(aib.field)}
                        />
                      </label>
                    ))}
                  </div>
                  <p {...stylex.props(styles.tmpl)} style={{ padding: '0 12px 12px' }}>
                    {piecesOf(p.template, valuesOf(p)).map((pc, i) =>
                      pc.kind === 'filled' ? <mark key={i} {...stylex.props(styles.mark, m3.pop)}>{pc.text}</mark> : pc.kind === 'empty' ? <span key={i} {...stylex.props(styles.gap)}>{pc.text}</span> : pc.text,
                    )}
                  </p>
                  <div {...stylex.props(styles.foot)}>
                    <span {...stylex.props(styles.tray)}>
                      ~<AnimatedNumber value={Math.ceil(fillTemplate(p.template, valuesOf(p)).length / 4)} /> tokens
                      {missingOf(p) > 0 && ` · ${fmt.plural(missingOf(p), { one: '# variable missing', other: '# variables missing' })}`}
                    </span>
                    <Button
                      size="sm"
                      variant="secondary"
                      startIcon={
                        <CrossFade as="span" contentKey={copied === p.id ? 'check' : 'copy'} duration={200}>
                          {copied === p.id ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                        </CrossFade>
                      }
                      onPress={() => {
                        const filled = fillTemplate(p.template, valuesOf(p));
                        void Promise.resolve(navigator.clipboard?.writeText(filled)).catch(() => {});
                        setCopied(p.id);
                        setLive('Prompt copied');
                        onCopy?.(filled);
                        clearTimeout(copyTimer.current);
                        copyTimer.current = setTimeout(() => setCopied(null), 1600);
                      }}
                    >
                      {copied === p.id ? 'Copied' : 'Copy'}
                    </Button>
                    <span key={pulse} {...stylex.props(styles.inl, pulse > 0 && m3.thumbPop)}>
                      <Button size="sm" aria-disabled={requireAll && missingOf(p) > 0 ? true : undefined} onPress={() => use(p)}>
                        {useLabel}
                      </Button>
                    </span>
                  </div>
                </div>
              </AnimatedHeight>
            </li>
          );
        })}
      </ul>
      <span role="status" aria-live="polite" {...stylex.props(styles.sr)}>{live}</span>
      {shown.length === 0 && <p {...stylex.props(aib.meta)} style={{ padding: 16, textAlign: 'center' }}>No prompts match “{q}”.</p>}
    </div>
  );
}
