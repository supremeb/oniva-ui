import * as stylex from '@stylexjs/stylex';
import { useState, type Ref } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { Button } from '../../components/Button';
import { Card, CardHeader, CardHeaderText, CardTitle, Tile } from '../../components/Card';
import {
  isoDate,
  MONTHS,
  RangeSwitcher,
  WEEKDAYS_SHORT,
} from '../../internal/widgets-parts';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  head: { alignItems: 'center', display: 'flex', gap: 8 },
  table: { borderCollapse: 'separate', borderSpacing: 4, tableLayout: 'fixed', width: '100%' },
  th: {
    color: colors.textMuted,
    fontSize: font.size12,
    fontWeight: font.weightMedium,
    paddingBlock: 4,
    textAlign: 'start',
  },
  cell: {
    backgroundColor: colors.surfaceInset,
    borderRadius: radius.md,
    boxSizing: 'border-box',
    height: 92,
    overflow: 'hidden',
    padding: 6,
    verticalAlign: 'top',
  },
  outside: { backgroundColor: 'transparent', opacity: 0.45 },
  day: {
    alignItems: 'center',
    color: colors.text,
    display: 'inline-flex',
    fontFeatureSettings: "'tnum'",
    fontSize: font.size12,
    fontWeight: font.weightMedium,
    height: 22,
    justifyContent: 'center',
    minWidth: 22,
    paddingInline: 4,
  },
  today: {
    backgroundColor: colors.text,
    borderRadius: radius.full,
    color: colors.bg,
  },
  pills: { display: 'flex', flexDirection: 'column', gap: 2, marginTop: 2 },
  pill: {
    borderRadius: radius.xs,
    borderWidth: 0,
    cursor: 'pointer',
    fontFamily: font.sans,
    fontSize: font.size11,
    fontWeight: font.weightMedium,
    lineHeight: font.lh11,
    outline: { default: 'none', ':focus-visible': `2px solid ${colors.focusRing}` },
    overflow: 'hidden',
    paddingBlock: 1,
    paddingInline: 5,
    textAlign: 'start',
    textOverflow: 'ellipsis',
    transitionDuration: motion.durBase,
    transitionProperty: 'filter',
    filter: { default: 'none', ':hover': 'brightness(0.96)' },
    whiteSpace: 'nowrap',
  },
  accent: { backgroundColor: colors.accentSoft, color: colors.accentSoftFg },
  success: { backgroundColor: colors.successBg, color: colors.successFg },
  warning: { backgroundColor: colors.warningBg, color: colors.warningFg },
  danger: { backgroundColor: colors.dangerBg, color: colors.dangerFg },
  info: { backgroundColor: colors.infoBg, color: colors.infoFg },
  more: { color: colors.textMuted, fontSize: font.size11, paddingInline: 5 },
});

export type EventTone = 'accent' | 'success' | 'warning' | 'danger' | 'info';

export interface CalendarEvent {
  id: string;
  title: string;
  /** `YYYY-MM-DD`. */
  date: string;
  /** Optional time shown before the title, e.g. "9:30". */
  time?: string;
  tone?: EventTone;
}

export interface EventCalendarProps {
  events: CalendarEvent[];
  /** Initially shown month (default: month of `today`). */
  defaultMonth?: { year: number; month: number };
  /** `YYYY-MM-DD` highlighted as today (default: real today). */
  today?: string;
  onEventPress?: (event: CalendarEvent) => void;
  /** Max pills per cell before "+n more". Default 2. */
  maxPerDay?: number;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Month grid with colour-coded event pills, month switcher and a Today shortcut. */
export function EventCalendar({
  events,
  defaultMonth,
  today,
  onEventPress,
  maxPerDay = 2,
  className,
  xstyle,
  ref,
}: EventCalendarProps) {
  const now = new Date();
  const todayIso = today ?? isoDate(now.getFullYear(), now.getMonth(), now.getDate());
  const [ty, tm] = todayIso.split('-').map(Number) as [number, number];
  const [view, setView] = useState(defaultMonth ?? { year: ty, month: tm - 1 });
  const shift = (d: number) =>
    setView((v) => {
      const dt = new Date(Date.UTC(v.year, v.month + d, 1));
      return { year: dt.getUTCFullYear(), month: dt.getUTCMonth() };
    });

  const first = new Date(Date.UTC(view.year, view.month, 1));
  const start = new Date(first.getTime() - first.getUTCDay() * 86400000);
  const lastDay = new Date(Date.UTC(view.year, view.month + 1, 0));
  const weeks = Math.ceil((first.getUTCDay() + lastDay.getUTCDate()) / 7);
  const cells = Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => new Date(start.getTime() + (w * 7 + d) * 86400000)),
  );
  const byDate = new Map<string, CalendarEvent[]>();
  for (const e of events) byDate.set(e.date, [...(byDate.get(e.date) ?? []), e]);

  return (
    <Card ref={ref} className={className} xstyle={xstyle}>
      <CardHeader>
        <CardHeaderText>
          <CardTitle>Calendar</CardTitle>
        </CardHeaderText>
        <div {...stylex.props(styles.head)}>
          <Button
            size="sm"
            variant="secondary"
            onPress={() => setView({ year: ty, month: tm - 1 })}
          >
            Today
          </Button>
          <RangeSwitcher
            label={`${MONTHS[view.month]} ${view.year}`}
            prevLabel="Previous month"
            nextLabel="Next month"
            onPrev={() => shift(-1)}
            onNext={() => shift(1)}
            minLabelWidth={120}
          />
        </div>
      </CardHeader>
      <Tile padding="sm">
        <table {...stylex.props(styles.table)} aria-label={`${MONTHS[view.month]} ${view.year}`}>
          <thead>
            <tr>
              {WEEKDAYS_SHORT.map((w) => (
                <th key={w} scope="col" {...stylex.props(styles.th)}>
                  {w}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cells.map((row) => (
              <tr key={row[0]?.toISOString()}>
                {row.map((d) => {
                  const iso = isoDate(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
                  const list = byDate.get(iso) ?? [];
                  const outside = d.getUTCMonth() !== view.month;
                  return (
                    <td
                      key={iso}
                      aria-label={iso}
                      {...stylex.props(styles.cell, outside && styles.outside)}
                    >
                      <span {...stylex.props(styles.day, iso === todayIso && styles.today)}>
                        {d.getUTCDate()}
                      </span>
                      <div {...stylex.props(styles.pills)}>
                        {list.slice(0, maxPerDay).map((e) => (
                          <AriaButton
                            key={e.id}
                            onPress={() => onEventPress?.(e)}
                            aria-label={`${e.title}, ${iso}${e.time ? ` at ${e.time}` : ''}`}
                            {...stylex.props(styles.pill, styles[e.tone ?? 'accent'])}
                          >
                            {e.time ? `${e.time} ` : ''}
                            {e.title}
                          </AriaButton>
                        ))}
                        {list.length > maxPerDay && (
                          <span {...stylex.props(styles.more)}>+{list.length - maxPerDay} more</span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Tile>
    </Card>
  );
}
