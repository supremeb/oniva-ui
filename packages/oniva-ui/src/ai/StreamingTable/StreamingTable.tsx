import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { aib } from '../../internal/aib-styles';
import { mergeSx } from '../../internal/sx';
import { Shimmer } from '../../motion/Shimmer';

const styles = stylex.create({
  wrap: { overflow: 'auto' },
  table: { borderCollapse: 'collapse', fontFamily: font['--oniva-font-sans'], fontSize: font['--oniva-font-size-13'], width: '100%' },
  th: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    paddingBlock: 8,
    paddingInline: 12,
    textAlign: 'start',
    whiteSpace: 'nowrap',
  },
  thRight: { textAlign: 'end' },
  td: { color: colors['--oniva-color-text'], paddingBlock: 9, paddingInline: 12, borderTopColor: colors['--oniva-color-separator'], borderTopStyle: 'solid', borderTopWidth: 1 },
  right: { textAlign: 'end' },
  foot: { alignItems: 'center', display: 'flex', gap: 8, padding: 10 },
});

export interface StreamingColumn<T> {
  key: string;
  header: string;
  align?: 'start' | 'end';
  render?: (row: T) => ReactNode;
}

export interface StreamingTableProps<T> extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  columns: StreamingColumn<T>[];
  rows: T[];
  getKey: (row: T) => string;
  /** While true a shimmering status line shows below the rows. */
  isStreaming?: boolean;
  caption: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Table whose rows arrive from the model one by one; each new row rises in once (CSS keyframe, no replay on re-render). */
export function StreamingTable<T extends Record<string, unknown>>({ columns, rows, getKey, isStreaming, caption, className, xstyle, ref, ...rest }: StreamingTableProps<T>) {
  return (
    <div {...rest} ref={ref} {...mergeSx(stylex.props(aiStyles.tile, xstyle), className)}>
      <div {...stylex.props(styles.wrap)}>
        <table {...stylex.props(styles.table)} aria-busy={isStreaming}>
          <caption style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{caption}</caption>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} scope="col" {...stylex.props(styles.th, c.align === 'end' && styles.thRight)}>{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={getKey(r)} {...stylex.props(aib.rowIn)}>
                {columns.map((c) => (
                  <td key={c.key} {...stylex.props(styles.td, c.align === 'end' && styles.right, c.align === 'end' && aiStyles.num)}>
                    {c.render ? c.render(r) : String(r[c.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isStreaming && (
        <div {...stylex.props(styles.foot)} role="status">
          <Shimmer>Adding rows… {rows.length} so far</Shimmer>
        </div>
      )}
    </div>
  );
}
