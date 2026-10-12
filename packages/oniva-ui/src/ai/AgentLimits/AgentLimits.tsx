import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { compactNumber } from '../../internal/ai-motion';
import { mergeSx } from '../../internal/sx';
import { Badge } from '../../components/Badge';
import { ProgressBar, ProgressSegments, type ProgressSegment } from '../../components/ProgressBar';

const styles = stylex.create({
  root: { display: 'flex', flexDirection: 'column', gap: 8, padding: 8 },
  tile: { display: 'flex', flexDirection: 'column', gap: 14, padding: 14 },
  head: { alignItems: 'center', display: 'flex', gap: 8, justifyContent: 'space-between' },
  headTitle: { color: colors.text, fontSize: font.size14, fontWeight: font.weightMedium },
  row: { display: 'flex', flexDirection: 'column', gap: 6 },
  rowTop: { alignItems: 'baseline', display: 'flex', gap: 8, justifyContent: 'space-between' },
  label: { color: colors.text, fontSize: font.size13, fontWeight: font.weightMedium },
  reset: { color: colors.textMuted, fontSize: font.size12 },
  pct: { color: colors.text, fontSize: font.size13, fontWeight: font.weightMedium },
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

const toneFor = (p: number) => (p >= 90 ? 'danger' : p >= 70 ? 'warning' : 'accent');

/** Context-window segmented bar plus plan usage-limit rows with reset times. */
export function AgentLimits({ context, plan, limits = [], className, xstyle, ref, ...rest }: AgentLimitsProps) {
  const used = context?.segments.reduce((a, s) => a + s.value, 0) ?? 0;
  const sx = stylex.props(aiStyles.panel, styles.root, xstyle);
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      {context && (
        <div {...stylex.props(aiStyles.tile, styles.tile)}>
          <ProgressSegments
            title={context.title ?? 'Context window'}
            segments={context.segments}
            max={context.max}
            summary={`${compactNumber(used)} / ${compactNumber(context.max)} (${Math.round((used / context.max) * 100)}%)`}
          />
        </div>
      )}
      {limits.length > 0 && (
        <div {...stylex.props(aiStyles.tile, styles.tile)}>
          <div {...stylex.props(styles.head)}>
            <span {...stylex.props(styles.headTitle)}>Plan usage limits</span>
            {plan && <Badge variant="accent">{plan}</Badge>}
          </div>
          {limits.map((l) => (
            <div key={l.id} {...stylex.props(styles.row)}>
              <div {...stylex.props(styles.rowTop)}>
                <span>
                  <span {...stylex.props(styles.label)}>{l.label}</span>
                  {l.resetsIn && <span {...stylex.props(styles.reset)}> · {l.resetsIn}</span>}
                </span>
                <span {...stylex.props(styles.pct, aiStyles.num)}>{Math.round(l.percent)}%</span>
              </div>
              <ProgressBar aria-label={l.label} value={l.percent} size="sm" tone={toneFor(l.percent)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
