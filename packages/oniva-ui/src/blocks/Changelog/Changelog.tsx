import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { SectionHead } from '../../internal/blocks-parts';
import { bs } from '../../internal/blocks-styles';
import { mergeSx } from '../../internal/sx';
import { Badge } from '../../components/Badge/Badge';
import { InView } from '../../motion/InView';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';

const NARROW = '@media (max-width: 720px)';

const styles = stylex.create({
  list: { display: 'flex', flexDirection: 'column', listStyle: 'none', margin: 0, marginInline: 'auto', maxWidth: 760, padding: 0 },
  entry: {
    borderTopColor: colors['--oniva-color-separator'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    display: 'grid',
    gap: { default: 32, [NARROW]: 8 },
    gridTemplateColumns: { default: '140px 1fr', [NARROW]: '1fr' },
    paddingBlock: 32,
  },
  meta: { display: 'flex', flexDirection: 'column', gap: 6 },
  date: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], fontVariantNumeric: 'tabular-nums' },
  body: { display: 'flex', flexDirection: 'column', gap: 10 },
  ul: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-14'], lineHeight: 1.6, margin: 0, paddingInlineStart: 20 },
  version: { borderRadius: radius['--oniva-radius-sm'], fontFamily: font['--oniva-font-mono'] },
});

export interface ChangelogEntry {
  version: string;
  date: string;
  /** ISO date for the `<time>` element. */
  iso: string;
  title: string;
  tag?: 'New' | 'Improved' | 'Fixed';
  changes: ReactNode[];
}

export const defaultChangelog: ChangelogEntry[] = [
  { version: 'v2.8', date: 'Oct 6, 2026', iso: '2026-10-06', title: 'Agent budgets', tag: 'New', changes: ['Set per-agent and per-customer spend caps.', 'Soft limits send a Slack warning at 80%.', 'Hard limits pause runs instantly.'] },
  { version: 'v2.7', date: 'Sep 15, 2026', iso: '2026-09-15', title: 'Faster trace search', tag: 'Improved', changes: ['Search across 30 days of traces in under a second.', 'Saved filters now sync across your team.'] },
  { version: 'v2.6.1', date: 'Aug 28, 2026', iso: '2026-08-28', title: 'Webhook retry fix', tag: 'Fixed', changes: ['Webhooks retry with exponential backoff after a 5xx.', 'Fixed duplicate alerts for flapping agents.'] },
];

export interface ChangelogProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  entries?: ChangelogEntry[];
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

const tagVariant = { New: 'accent', Improved: 'info', Fixed: 'success' } as const;

export function Changelog({ entries = defaultChangelog, className, xstyle, ref, ...rest }: ChangelogProps) {
  const sx = stylex.props(bs.section, xstyle);
  return (
    <section ref={ref} {...rest} {...mergeSx(sx, className)}>
      <div {...stylex.props(bs.inner)}>
        <SectionHead center eyebrow="Changelog" title="What shipped lately" lead="New features and fixes, newest first." />
        <ol {...stylex.props(styles.list)}>
          {entries.map((e) => (
            <li key={e.version}>
              <InView preset="fade">
                <article {...stylex.props(styles.entry)}>
                  <div {...stylex.props(styles.meta)}>
                    <time dateTime={e.iso} {...stylex.props(styles.date)}>{e.date}</time>
                    <span><Badge size="sm" xstyle={styles.version}>{e.version}</Badge></span>
                  </div>
                  <div {...stylex.props(styles.body)}>
                    <h3 {...stylex.props(bs.h3)}>
                      {e.title} {e.tag && <Badge size="sm" variant={tagVariant[e.tag]}>{e.tag}</Badge>}
                    </h3>
                    <ul {...stylex.props(styles.ul)}>
                      {e.changes.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              </InView>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
