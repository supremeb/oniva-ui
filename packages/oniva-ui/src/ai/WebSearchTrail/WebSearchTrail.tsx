import * as stylex from '@stylexjs/stylex';
import { Check, Globe } from 'lucide-react';
import type { HTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { Spinner } from '../../components/Spinner';
import { SourceChip } from '../SourceChip';
import { TextShimmer } from '../TextShimmer';
import { mergeSx } from '../../internal/sx';

const styles = stylex.create({
  root: { display: 'flex', flexDirection: 'column', gap: 10, padding: 12 },
  head: {
    alignItems: 'center',
    color: colors.textMuted,
    display: 'flex',
    fontSize: font.size13,
    fontWeight: font.weightMedium,
    gap: 6,
  },
  list: { display: 'flex', flexDirection: 'column', gap: 6, listStyle: 'none', margin: 0, padding: 0 },
  row: {
    alignItems: 'center',
    color: colors.text,
    display: 'flex',
    fontSize: font.size13,
    gap: 8,
    lineHeight: font.lh13,
  },
  count: { color: colors.textMuted, marginInlineStart: 'auto', fontVariantNumeric: 'tabular-nums' },
  icon: { alignItems: 'center', display: 'inline-flex', flexShrink: 0, justifyContent: 'center', width: 16 },
  ok: { color: colors.successSolid },
  sources: { display: 'flex', flexWrap: 'wrap', gap: 6 },
});

export interface WebSearchQuery {
  id: string;
  query: string;
  status: 'searching' | 'done';
  resultCount?: number;
}
export interface WebSearchSource {
  title: string;
  url: string;
}

export interface WebSearchTrailProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  queries: WebSearchQuery[];
  sources?: WebSearchSource[];
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Search queries the agent ran (with live status) plus the sources it read. */
export function WebSearchTrail({ queries, sources = [], className, xstyle, ref, ...rest }: WebSearchTrailProps) {
  const searching = queries.some((q) => q.status === 'searching');
  const sx = stylex.props(aiStyles.tile, styles.root, xstyle);
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      <div {...stylex.props(styles.head)}>
        <Globe size={14} aria-hidden="true" />
        {searching ? <TextShimmer>Searching the web…</TextShimmer> : <span>Searched the web</span>}
      </div>
      <ul {...stylex.props(styles.list)} aria-label="Search queries">
        {queries.map((q) => (
          <li key={q.id} {...stylex.props(styles.row)}>
            <span {...stylex.props(styles.icon)}>
              {q.status === 'searching' ? (
                <Spinner size="xs" label="Searching" />
              ) : (
                <Check size={14} aria-label="Done" {...stylex.props(styles.ok)} />
              )}
            </span>
            <span>{q.query}</span>
            {q.resultCount != null && <span {...stylex.props(styles.count)}>{q.resultCount} results</span>}
          </li>
        ))}
      </ul>
      {sources.length > 0 && (
        <div {...stylex.props(styles.sources)}>
          {sources.map((s) => (
            <SourceChip key={s.url} title={s.title} url={s.url} />
          ))}
        </div>
      )}
    </div>
  );
}
