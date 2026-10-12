import * as stylex from '@stylexjs/stylex';
import { useState, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { toneStyle } from '../../internal/charts-styles';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { ChartTooltip } from '../ChartTooltip/ChartTooltip';

const styles = stylex.create({
  root: { fontFamily: font['--oniva-font-sans'], position: 'relative', width: '100%' },
  row: { display: 'flex', gap: 3, height: 36 },
  cell: {
    backgroundColor: 'currentColor',
    borderRadius: 4,
    borderWidth: 0,
    cursor: 'default',
    flex: '1 1 0',
    minWidth: 3,
    opacity: { default: 1, ':hover': 0.7 },
    outline: 'none',
    padding: 0,
    transitionDuration: '150ms',
    transitionProperty: 'opacity',
    boxShadow: {
      default: 'none',
      ':focus-visible': `0 0 0 2px ${colors['--oniva-color-focus-ring']}`,
    },
  },
  danger: { color: colors['--oniva-color-danger-solid'] },
  empty: { color: colors['--oniva-color-chart-track'] },
});

export interface TrackerItem {
  label: string;
  /** Status maps to colour: up = emerald, degraded = yellow, down = red, none = grey. Or give `tone`. */
  status?: 'up' | 'degraded' | 'down' | 'none';
  tone?: number;
  detail?: ReactNode;
}

export interface TrackerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  items: TrackerItem[];
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const statusTone = { up: 7, degraded: 8, none: 0, down: -1 } as const;
const statusText = { up: 'Operational', degraded: 'Degraded', down: 'Outage', none: 'No data' };

/** Row of status cells (uptime / habit tracker). Each cell is focusable with a tooltip. */
export function Tracker({ items, className, xstyle, ref, ...rest }: TrackerProps) {
  const [tip, setTip] = useState<{ i: number; x: number } | null>(null);
  const sx = stylex.props(styles.root, xstyle);
  const up = items.filter((i) => (i.status ?? 'up') === 'up').length;
  return (
    <div
      role="group"
      aria-label={`Status tracker, ${up} of ${items.length} operational`}
      {...rest}
      ref={ref}
      {...sx}
      className={[sx.className, className].filter(Boolean).join(' ')}
    >
      <div {...stylex.props(styles.row)}>
        {items.map((it, i) => {
          const st = it.status ?? 'up';
          const tone = it.tone ?? statusTone[st];
          return (
            <button
              key={i}
              type="button"
              aria-label={`${it.label}: ${statusText[st]}`}
              {...stylex.props(
                styles.cell,
                st === 'down' && !it.tone
                  ? styles.danger
                  : tone > 0
                    ? toneStyle(tone)
                    : styles.empty,
              )}
              onPointerEnter={(e) =>
                setTip({ i, x: e.currentTarget.offsetLeft + e.currentTarget.offsetWidth / 2 })
              }
              onPointerLeave={() => setTip(null)}
              onFocus={(e) =>
                setTip({ i, x: e.currentTarget.offsetLeft + e.currentTarget.offsetWidth / 2 })
              }
              onBlur={() => setTip(null)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setTip(null);
              }}
            />
          );
        })}
      </div>
      {tip && (
        <ChartTooltip
          x={tip.x}
          y={-4}
          title={items[tip.i]!.label}
          rows={[
            { label: statusText[items[tip.i]!.status ?? 'up'], value: items[tip.i]!.detail ?? '' },
          ]}
        />
      )}
    </div>
  );
}
