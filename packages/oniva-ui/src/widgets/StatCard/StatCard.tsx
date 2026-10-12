import * as stylex from '@stylexjs/stylex';
import type { ReactNode, Ref } from 'react';
import { Card, CardHeader, CardHeaderText, CardTitle, Tile } from '../../components/Card';
import { Sparkline } from '../../charts/Sparkline';
import { wstyles } from '../../internal/widgets-parts';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { DeltaBadge } from '../DeltaBadge';

const styles = stylex.create({
  body: { alignItems: 'flex-end', display: 'flex', gap: 12, justifyContent: 'space-between' },
  left: { display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 },
  icon: {
    alignItems: 'center',
    backgroundColor: colors.surfaceInset,
    borderRadius: radius.md,
    color: colors.iconMuted,
    display: 'inline-flex',
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  hint: { color: colors.textMuted, fontSize: font.size12, lineHeight: font.lh12 },
  deltaRow: { alignItems: 'center', display: 'flex', gap: 8 },
});

export interface StatCardProps {
  label: string;
  /** Preformatted headline value, e.g. "$48,210". */
  value: ReactNode;
  /** Signed percentage change. */
  delta?: number;
  /** Lower is better (flips delta colors). */
  invertDelta?: boolean;
  /** Text after the delta, e.g. "vs last month". */
  deltaLabel?: string;
  icon?: ReactNode;
  /** Trend series for the sparkline. */
  trend?: number[];
  /** 1-based chart tone for the sparkline. */
  tone?: number;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** KPI card: label, big value, delta chip and a sparkline. */
export function StatCard({
  label,
  value,
  delta,
  invertDelta,
  deltaLabel,
  icon,
  trend,
  tone = 1,
  className,
  xstyle,
  ref,
}: StatCardProps) {
  return (
    <Card ref={ref} className={className} xstyle={xstyle}>
      <CardHeader>
        <CardHeaderText>
          <CardTitle>{label}</CardTitle>
        </CardHeaderText>
        {icon && (
          <span aria-hidden="true" {...stylex.props(styles.icon)}>
            {icon}
          </span>
        )}
      </CardHeader>
      <Tile>
        <div {...stylex.props(styles.body)}>
          <div {...stylex.props(styles.left)}>
            <p {...stylex.props(wstyles.value)}>{value}</p>
            {delta !== undefined && (
              <div {...stylex.props(styles.deltaRow)}>
                <DeltaBadge value={delta} invert={invertDelta} size="sm" />
                {deltaLabel && <span {...stylex.props(styles.hint)}>{deltaLabel}</span>}
              </div>
            )}
          </div>
          {trend && (
            <Sparkline data={trend} tone={tone} width={96} height={40} label={`${label} trend`} />
          )}
        </div>
      </Tile>
    </Card>
  );
}
