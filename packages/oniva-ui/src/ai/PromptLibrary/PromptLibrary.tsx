import * as stylex from '@stylexjs/stylex';
import { Search, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { HTMLAttributes, Ref } from 'react';
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

const styles = stylex.create({
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
  tmpl: { color: colors['--oniva-color-text-muted'], fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-12'], lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' },
  vars: { display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', padding: 12 },
  label: { display: 'flex', flexDirection: 'column', gap: 4 },
  foot: { display: 'flex', gap: 8, justifyContent: 'flex-end', padding: 12, paddingTop: 0 },
  search: { position: 'relative' },
  searchIcon: { color: colors['--oniva-color-icon-muted'], insetInlineStart: 10, pointerEvents: 'none', position: 'absolute', top: 9 },
});

export interface SavedPrompt {
  id: string;
  name: string;
  /** Template with `{{variable}}` placeholders. */
  template: string;
  tags?: string[];
}

export interface PromptLibraryProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'title'> {
  prompts: SavedPrompt[];
  title?: string;
  /** Called with the template filled in with the entered variables. */
  onUse?: (prompt: SavedPrompt, filled: string) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const VAR = /\{\{\s*([\w-]+)\s*\}\}/g;
export const variablesOf = (t: string) => [...new Set([...t.matchAll(VAR)].map((m) => m[1]!))];
export const fillTemplate = (t: string, v: Record<string, string>) => t.replace(VAR, (_, k: string) => v[k] || `{{${k}}}`);

/** Saved prompts with search, `{{variable}}` inputs and a live-filled preview. */
export function PromptLibrary({ prompts, title = 'Prompt library', onUse, className, xstyle, ref, ...rest }: PromptLibraryProps) {
  const fmt = useFormatters();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const [vals, setVals] = useState<Record<string, string>>({});
  const shown = useMemo(() => {
    const n = q.trim().toLowerCase();
    return prompts.filter((p) => !n || p.name.toLowerCase().includes(n) || p.tags?.some((t) => t.toLowerCase().includes(n)));
  }, [prompts, q]);
  return (
    <div {...rest} ref={ref} {...mergeSx(stylex.props(aiStyles.panel, aib.pad, xstyle), className)}>
      <div {...stylex.props(aib.head)}>
        <h3 {...stylex.props(aib.title)}>{title}</h3>
        <span {...stylex.props(aib.meta, aiStyles.num)}>{shown.length} of {prompts.length}</span>
      </div>
      <div {...stylex.props(styles.search)} style={{ marginBottom: 8 }}>
        <Search size={14} aria-hidden="true" {...stylex.props(styles.searchIcon)} />
        <input type="search" aria-label="Search prompts" placeholder="Search prompts or tags" value={q} onChange={(e) => setQ(e.target.value)} {...stylex.props(aib.field)} style={{ paddingInlineStart: 30 }} />
      </div>
      <ul {...stylex.props(styles.list)}>
        {shown.map((p) => {
          const isOpen = open === p.id;
          const vars = variablesOf(p.template);
          return (
            <li key={p.id} {...stylex.props(aiStyles.tile, styles.item)}>
              <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : p.id)} {...stylex.props(styles.pick)}>
                <span {...stylex.props(aib.iconBox)}><Sparkles size={16} /></span>
                <span {...stylex.props(aib.grow)}>
                  <span {...stylex.props(aib.name)} style={{ display: 'block' }}>{p.name}</span>
                  <span {...stylex.props(aib.meta)} style={{ display: 'block' }}>{fmt.plural(vars.length, { one: '# variable', other: '# variables' })}</span>
                </span>
                {p.tags?.slice(0, 2).map((t) => <Badge key={t} variant="neutral">{t}</Badge>)}
              </button>
              <AnimatedHeight isOpen={isOpen}>
                <div {...stylex.props(aib.divider)}>
                  <div {...stylex.props(styles.vars)}>
                    {vars.map((v) => (
                      <label key={v} {...stylex.props(styles.label, aib.meta)}>
                        {v}
                        <input value={vals[`${p.id}.${v}`] ?? ''} onChange={(e) => setVals((s) => ({ ...s, [`${p.id}.${v}`]: e.target.value }))} {...stylex.props(aib.field)} />
                      </label>
                    ))}
                  </div>
                  <p {...stylex.props(styles.tmpl)} style={{ padding: '0 12px 12px' }}>
                    {fillTemplate(p.template, Object.fromEntries(vars.map((v) => [v, vals[`${p.id}.${v}`] ?? ''])))}
                  </p>
                  <div {...stylex.props(styles.foot)}>
                    <Button size="sm" onPress={() => onUse?.(p, fillTemplate(p.template, Object.fromEntries(vars.map((v) => [v, vals[`${p.id}.${v}`] ?? '']))))}>
                      Use prompt
                    </Button>
                  </div>
                </div>
              </AnimatedHeight>
            </li>
          );
        })}
      </ul>
      {shown.length === 0 && <p {...stylex.props(aib.meta)} style={{ padding: 16, textAlign: 'center' }}>No prompts match “{q}”.</p>}
    </div>
  );
}
