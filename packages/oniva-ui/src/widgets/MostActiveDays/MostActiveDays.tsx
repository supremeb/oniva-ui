import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef, useState, type Ref } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { Card, CardHeader, CardHeaderText, CardTitle, Tile } from '../../components/Card';
import {
  fmtInt,
  isoDate,
  MONTHS,
  RangeSwitcher,
  wstyles,
  WEEKDAYS_SHORT,
} from '../../internal/widgets-parts';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  scroller: { maxHeight: 300, overflowY: 'auto', paddingInline: 4, position: 'relative' },
  month: { display: 'flex', flexDirection: 'column', gap: 8, paddingBlock: 8 },
  monthTitle: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-16'],
    fontWeight: font['--oniva-font-weight-medium'],
    margin: 0,
    paddingBlock: 4,
  },
  grid: { display: 'grid', gap: 4, gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' },
  dow: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-11'],
    lineHeight: font['--oniva-font-lh-11'],
    textAlign: 'center',
  },
  day: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    fontFeatureSettings: "'tnum'",
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 2,
    justifyContent: 'center',
    minHeight: 40,
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colors['--oniva-color-focus-ring']}`,
    },
    outlineOffset: 1,
    paddingBlock: 4,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'transform, box-shadow',
    transform: { default: 'none', ':hover': 'scale(1.06)' },
  },
  selected: { boxShadow: `0 0 0 2px ${colors['--oniva-color-text']}` },
  h0: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    color: colors['--oniva-color-text-muted'],
  },
  h1: {
    backgroundColor: `color-mix(in srgb, ${colors['--oniva-color-chart-1']} 22%, ${colors['--oniva-color-surface-inner']})`,
  },
  h2: {
    backgroundColor: `color-mix(in srgb, ${colors['--oniva-color-chart-1']} 45%, ${colors['--oniva-color-surface-inner']})`,
  },
  h3: {
    backgroundColor: `color-mix(in srgb, ${colors['--oniva-color-chart-1']} 70%, ${colors['--oniva-color-surface-inner']})`,
  },
  h4: { backgroundColor: colors['--oniva-color-chart-1'], color: colors['--oniva-color-on-chart'] },
});

const HEAT = [styles.h0, styles.h1, styles.h2, styles.h3, styles.h4];

export interface MostActiveDaysProps {
  year: number;
  /** Steps keyed by `YYYY-MM-DD`; missing days count as 0. */
  data: Record<string, number>;
  /** Daily goal; heat levels are relative to it. Default 10,000. */
  goal?: number;
  /** Initial month 0-11. */
  defaultMonth?: number;
  /** Fires when a day is pressed. */
  onSelectDay?: (date: string, steps: number) => void;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const level = (v: number, goal: number) =>
  v <= 0 ? 0 : v < goal * 0.4 ? 1 : v < goal * 0.7 ? 2 : v < goal ? 3 : 4;

/** A year of day buttons grouped by month, heat-coloured by steps, with a month switcher. */
export function MostActiveDays({
  year,
  data,
  goal = 10000,
  defaultMonth = 0,
  onSelectDay,
  className,
  xstyle,
  ref,
}: MostActiveDaysProps) {
  const [month, setMonth] = useState(defaultMonth);
  const [picked, setPicked] = useState<string | null>(null);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const scroller = useRef<HTMLDivElement>(null);

  const scrollTo = (m: number, smooth: boolean) => {
    const box = scroller.current;
    const sec = refs.current[m];
    if (!box || !sec) return;
    const top = sec.offsetTop;
    if (typeof box.scrollTo === 'function')
      box.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
  };
  useEffect(() => {
    scrollTo(defaultMonth, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const monthTotal = (m: number) => {
    let t = 0;
    const n = new Date(Date.UTC(year, m + 1, 0)).getUTCDate();
    for (let d = 1; d <= n; d++) t += data[isoDate(year, m, d)] ?? 0;
    return t;
  };
  const go = (m: number) => {
    setMonth(m);
    scrollTo(m, true);
  };

  return (
    <Card ref={ref} className={className} xstyle={xstyle}>
      <CardHeader>
        <CardHeaderText>
          <CardTitle>Most active days</CardTitle>
          <div {...stylex.props(wstyles.valueRow)}>
            <p {...stylex.props(wstyles.value)}>{fmtInt(monthTotal(month))}</p>
            <span {...stylex.props(wstyles.unit)}>total steps</span>
          </div>
        </CardHeaderText>
        <RangeSwitcher
          label={MONTHS[month]}
          prevLabel="Previous month"
          nextLabel="Next month"
          prevDisabled={month <= 0}
          nextDisabled={month >= 11}
          onPrev={() => go(month - 1)}
          onNext={() => go(month + 1)}
          minLabelWidth={88}
        />
      </CardHeader>
      <Tile padding="sm">
        <div ref={scroller} {...stylex.props(styles.scroller)}>
          {MONTHS.map((name, m) => {
            const first = new Date(Date.UTC(year, m, 1)).getUTCDay();
            const n = new Date(Date.UTC(year, m + 1, 0)).getUTCDate();
            return (
              <section
                key={name}
                ref={(el) => {
                  refs.current[m] = el;
                }}
                aria-label={`${name} ${year}`}
                {...stylex.props(styles.month)}
              >
                <h4 {...stylex.props(styles.monthTitle)}>{name.slice(0, 3)}</h4>
                <div {...stylex.props(styles.grid)}>
                  {WEEKDAYS_SHORT.map((w) => (
                    <span key={w} aria-hidden="true" {...stylex.props(styles.dow)}>
                      {w.slice(0, 2)}
                    </span>
                  ))}
                  {Array.from({ length: first }, (_, k) => (
                    <span key={`b${k}`} />
                  ))}
                  {Array.from({ length: n }, (_, k) => {
                    const date = isoDate(year, m, k + 1);
                    const steps = data[date] ?? 0;
                    return (
                      <AriaButton
                        key={date}
                        aria-label={`${name} ${k + 1}, ${fmtInt(steps)} steps`}
                        onPress={() => {
                          setPicked(date);
                          setMonth(m);
                          onSelectDay?.(date, steps);
                        }}
                        {...stylex.props(
                          styles.day,
                          HEAT[level(steps, goal)],
                          picked === date && styles.selected,
                        )}
                      >
                        {k + 1}
                      </AriaButton>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </Tile>
    </Card>
  );
}
