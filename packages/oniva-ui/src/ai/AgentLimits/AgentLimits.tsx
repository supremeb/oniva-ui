import * as stylex from '@stylexjs/stylex';
import { useId, type HTMLAttributes, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { compactNumber } from '../../internal/ai-motion';
import { useFormatters } from '../../internal/format';
import { mergeSx } from '../../internal/sx';
import { Badge } from '../../components/Badge';
import { ProgressBar, ProgressSegments, type ProgressSegment } from '../../components/ProgressBar';

const styles = stylex.create({
  root: { display: 'flex', flexDirection: 'column', gap: 8, padding: 8 },
  tile: { display: 'flex', flexDirection: 'column', gap: 14, padding: 14 },
  head: { alignItems: 'center', display: 'flex', gap: 8, justifyContent: 'space-between' },
  headTitle: {
    color: colors['--oniva-color-text'],
    flexShrink: 0,
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    whiteSpace: 'nowrap',
  },
  planBadge: { minWidth: 0 },
  planText: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  empty: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-13'],
    margin: 0,
    paddingBlock: 6,
    paddingInline: 8,
    textAlign: 'center',
  },
  row: { display: 'flex', flexDirection: 'column', gap: 6 },
  rowTop: { alignItems: 'baseline', display: 'flex', gap: 12, justifyContent: 'space-between' },
  rowText: { minWidth: 0, overflowWrap: 'anywhere' },
  label: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
  },
  reset: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
  pct: {
    color: colors['--oniva-color-text'],
    flexShrink: 0,
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
  },
});

export interface AgentLimit {
  id: string;
  /** e.g. `5-hour limit`. */
  label: string;
  /** e.g. `Resets in 2 hr 46 min`. */
  resetsIn?: string;
  /** 0-100. */
  percent: number;
}

export interface AgentLimitsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'title'> {
  /** Context window breakdown (token counts). */
  context?: { segments: ProgressSegment[]; max: number; title?: string };
  /** Plan name shown as a chip, e.g. `Max (5x)`. */
  plan?: string;
  limits?: AgentLimit[];
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Display value: NaN and negatives read as 0; values over 100 stay visible as over-limit. */
const clampPct = (p: number) => (Number.isFinite(p) ? Math.max(0, Math.round(p)) : 0);
const toneFor = (p: number) => (p >= 90 ? 'danger' : p >= 70 ? 'warning' : 'accent');

/** Context-window segmented bar plus plan usage-limit rows with reset times. */
export function AgentLimits({
  context,
  plan,
  limits = [],
  className,
  xstyle,
  ref,
  ...rest
}: AgentLimitsProps) {
  const f = useFormatters();
  const headId = useId();
  const used = context?.segments.reduce((a, s) => a + s.value, 0) ?? 0;
  const usedPct = context && context.max > 0 ? Math.round((used / context.max) * 100) : 0;
  const isEmpty = !context && limits.length === 0;
  const sx = stylex.props(aiStyles.panel, styles.root, xstyle);
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      {isEmpty && <p {...stylex.props(styles.empty)}>No usage data yet</p>}
      {context && (
        <div {...stylex.props(aiStyles.tile, styles.tile)}>
          <ProgressSegments
            title={context.title ?? 'Context window'}
            segments={context.segments}
            max={context.max}
            summary={`${compactNumber(used)} / ${compactNumber(context.max)} (${f.percent(usedPct / 100)})`}
          />
        </div>
      )}
      {limits.length > 0 && (
        <div role="group" aria-labelledby={headId} {...stylex.props(aiStyles.tile, styles.tile)}>
          <div {...stylex.props(styles.head)}>
            <span id={headId} {...stylex.props(styles.headTitle)}>
              Plan usage limits
            </span>
            {plan && (
              <Badge variant="accent" title={plan} xstyle={styles.planBadge}>
                <span {...stylex.props(styles.planText)}>{plan}</span>
              </Badge>
            )}
          </div>
          {limits.map((l) => (
            <div key={l.id} {...stylex.props(styles.row)}>
              <div {...stylex.props(styles.rowTop)}>
                <span {...stylex.props(styles.rowText)}>
                  <span {...stylex.props(styles.label)}>{l.label}</span>
                  {l.resetsIn && <span {...stylex.props(styles.reset)}> · {l.resetsIn}</span>}
                </span>
                <span {...stylex.props(styles.pct, aiStyles.num)}>
                  {f.percent(clampPct(l.percent) / 100)}
                </span>
              </div>
              <ProgressBar
                aria-label={l.label}
                value={Number.isFinite(l.percent) ? l.percent : 0}
                size="sm"
                tone={toneFor(clampPct(l.percent))}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
