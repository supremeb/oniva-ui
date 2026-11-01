import * as stylex from '@stylexjs/stylex';
import { CheckIcon, GlobeIcon } from '../../icons/IconSet';
import type { HTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { Spinner } from '../../components/Spinner';
import { SourceChip } from '../SourceChip';
import { TextShimmer } from '../TextShimmer';
import { mergeSx } from '../../internal/sx';
import { useFormatters } from '../../internal/format';

const styles = stylex.create({
  root: { display: 'flex', flexDirection: 'column', gap: 10, padding: 12 },
  head: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 6,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  row: {
    alignItems: 'flex-start',
    color: colors['--oniva-color-text'],
    display: 'flex',
    fontSize: font['--oniva-font-size-13'],
    gap: 8,
    lineHeight: font['--oniva-font-lh-13'],
  },
  query: { flexGrow: 1, minWidth: 0, overflowWrap: 'anywhere' },
  count: {
    color: colors['--oniva-color-text-muted'],
    flexShrink: 0,
    fontVariantNumeric: 'tabular-nums',
    marginInlineStart: 'auto',
    whiteSpace: 'nowrap',
  },
  icon: {
    alignItems: 'center',
    display: 'inline-flex',
    flexShrink: 0,
    height: font['--oniva-font-lh-13'],
    justifyContent: 'center',
    width: 16,
  },
  ok: { color: colors['--oniva-color-success-solid'] },
  sourceItem: { display: 'flex', maxWidth: '100%', minWidth: 0 },
  sources: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
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
export function WebSearchTrail({
  queries,
  sources = [],
  className,
  xstyle,
  ref,
  ...rest
}: WebSearchTrailProps) {
  const { plural } = useFormatters();
  const searching = queries.some((q) => q.status === 'searching');
  const sx = stylex.props(aiStyles.tile, styles.root, xstyle);
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      <div {...stylex.props(styles.head)} aria-live="polite">
        <GlobeIcon size={14} aria-hidden="true" />
        {searching ? (
          <TextShimmer>Searching the web…</TextShimmer>
        ) : (
          <span>{queries.length > 0 ? 'Searched the web' : 'No searches yet'}</span>
        )}
      </div>
      {queries.length > 0 && (
        <ul {...stylex.props(styles.list)} aria-label="Search queries">
          {queries.map((q) => (
            <li key={q.id} {...stylex.props(styles.row)}>
              <span {...stylex.props(styles.icon)}>
                {q.status === 'searching' ? (
                  <Spinner size="xs" label="Searching" />
                ) : (
                  <CheckIcon size={14} role="img" aria-label="Done" {...stylex.props(styles.ok)} />
                )}
              </span>
              <span {...stylex.props(styles.query)}>{q.query}</span>
              {q.resultCount != null && (
                <span {...stylex.props(styles.count)}>
                  {plural(q.resultCount, { one: '# result', other: '# results' })}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      {sources.length > 0 && (
        <ul {...stylex.props(styles.sources)} aria-label="Sources">
          {sources.map((s, i) => (
            <li key={`${s.url}-${i}`} {...stylex.props(styles.sourceItem)}>
              <SourceChip title={s.title} url={s.url} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
