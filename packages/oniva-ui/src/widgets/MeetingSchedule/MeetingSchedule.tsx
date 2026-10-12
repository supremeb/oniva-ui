import * as stylex from '@stylexjs/stylex';
import { CalendarPlus, Clock } from 'lucide-react';
import { useState, type Ref } from 'react';
import { Avatar, AvatarGroup } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { Card, CardHeader, CardHeaderText, CardTitle, Tile } from '../../components/Card';
import { SegmentedControl, SegmentedControlItem } from '../../components/SegmentedControl';
import { isoDate, MONTHS_SHORT, RangeSwitcher, WEEKDAYS_SHORT } from '../../internal/widgets-parts';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  controls: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8 },
  slots: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  slot: { alignItems: 'stretch', display: 'grid', gap: 10, gridTemplateColumns: '72px 1fr' },
  time: {
    color: colors['--oniva-color-text-muted'],
    fontFeatureSettings: "'tnum'",
    fontSize: font['--oniva-font-size-12'],
    lineHeight: font['--oniva-font-lh-12'],
    paddingBlockStart: 10,
    whiteSpace: 'nowrap',
  },
  meeting: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-accent-soft'],
    borderRadius: radius['--oniva-radius-md'],
    color: colors['--oniva-color-accent-soft-fg'],
    display: 'flex',
    gap: 10,
    justifyContent: 'space-between',
    paddingBlock: 8,
    paddingInline: 10,
  },
  mTitle: {
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-14'],
    margin: 0,
  },
  mMeta: {
    alignItems: 'center',
    display: 'flex',
    fontSize: font['--oniva-font-size-12'],
    gap: 4,
    lineHeight: font['--oniva-font-lh-12'],
    opacity: 0.85,
  },
  open: {
    alignItems: 'center',
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'dashed',
    borderWidth: 1,
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    fontSize: font['--oniva-font-size-13'],
    justifyContent: 'space-between',
    paddingBlock: 4,
    paddingInline: 10,
  },
  week: { display: 'grid', gap: 6, gridTemplateColumns: 'repeat(5, minmax(0, 1fr))' },
  col: { display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 },
  colHead: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
  },
  chip: {
    backgroundColor: colors['--oniva-color-accent-soft'],
    borderRadius: radius['--oniva-radius-sm'],
    color: colors['--oniva-color-accent-soft-fg'],
    fontSize: font['--oniva-font-size-11'],
    lineHeight: font['--oniva-font-lh-11'],
    overflow: 'hidden',
    paddingBlock: 4,
    paddingInline: 6,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  none: { color: colors['--oniva-color-text-subtle'], fontSize: font['--oniva-font-size-12'] },
});

export interface Meeting {
  id: string;
  title: string;
  /** `YYYY-MM-DD`. */
  date: string;
  /** 24h `HH:MM`. */
  start: string;
  end: string;
  attendees?: string[];
}

export interface MeetingScheduleProps {
  meetings: Meeting[];
  /** `YYYY-MM-DD` of the day/week initially shown. */
  defaultDate: string;
  defaultView?: 'day' | 'week';
  /** First and last bookable hour (24h), default 9 to 17. */
  hours?: [number, number];
  /** Called when an open slot is booked. */
  onBook?: (slot: { date: string; start: string; end: string }) => void;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const toDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number];
  return new Date(Date.UTC(y, m - 1, d));
};
const toIso = (d: Date) => isoDate(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
const hh = (h: number) => `${String(h).padStart(2, '0')}:00`;
const label12 = (t: string) => {
  const h = Number(t.slice(0, 2));
  return `${h % 12 || 12}:${t.slice(3)} ${h < 12 ? 'AM' : 'PM'}`;
};

/** Day/week agenda with hourly slots; meetings show attendees, open slots can be booked. */
export function MeetingSchedule({
  meetings,
  defaultDate,
  defaultView = 'day',
  hours = [9, 17],
  onBook,
  className,
  xstyle,
  ref,
}: MeetingScheduleProps) {
  const [view, setView] = useState<'day' | 'week'>(defaultView);
  const [date, setDate] = useState(defaultDate);
  const [booked, setBooked] = useState<Meeting[]>([]);
  const all = [...meetings, ...booked];
  const d = toDate(date);
  const monday = new Date(d.getTime() - ((d.getUTCDay() + 6) % 7) * 86400000);
  const friday = new Date(monday.getTime() + 4 * 86400000);

  const step = view === 'day' ? 1 : 7;
  const move = (n: number) => setDate(toIso(new Date(d.getTime() + n * step * 86400000)));
  const rangeLabel =
    view === 'day'
      ? `${WEEKDAYS_SHORT[d.getUTCDay()]}, ${d.getUTCDate()} ${MONTHS_SHORT[d.getUTCMonth()]}`
      : `${monday.getUTCDate()} ${MONTHS_SHORT[monday.getUTCMonth()]} – ${friday.getUTCDate()} ${MONTHS_SHORT[friday.getUTCMonth()]}`;

  const book = (h: number) => {
    const slot = { date, start: hh(h), end: hh(h + 1) };
    setBooked((b) => [...b, { id: `booked-${date}-${h}`, title: 'Booked meeting', ...slot }]);
    onBook?.(slot);
  };

  const hourList = Array.from({ length: Math.max(0, hours[1] - hours[0]) }, (_, i) => hours[0] + i);

  return (
    <Card ref={ref} className={className} xstyle={xstyle}>
      <CardHeader>
        <CardHeaderText>
          <CardTitle>Schedule</CardTitle>
        </CardHeaderText>
        <div {...stylex.props(styles.controls)}>
          <SegmentedControl
            size="sm"
            aria-label="Schedule view"
            value={view}
            onChange={(v) => setView(v as 'day' | 'week')}
          >
            <SegmentedControlItem value="day">Day</SegmentedControlItem>
            <SegmentedControlItem value="week">Week</SegmentedControlItem>
          </SegmentedControl>
          <RangeSwitcher
            label={rangeLabel}
            prevLabel={`Previous ${view}`}
            nextLabel={`Next ${view}`}
            onPrev={() => move(-1)}
            onNext={() => move(1)}
            minLabelWidth={view === 'day' ? 84 : 112}
          />
        </div>
      </CardHeader>
      <Tile padding="sm">
        {view === 'day' ? (
          <ul aria-label={`Meetings on ${date}`} {...stylex.props(styles.slots)}>
            {hourList.map((h) => {
              const m = all.find((x) => x.date === date && x.start === hh(h));
              return (
                <li key={h} {...stylex.props(styles.slot)}>
                  <span {...stylex.props(styles.time)}>{label12(hh(h))}</span>
                  {m ? (
                    <div {...stylex.props(styles.meeting)}>
                      <div>
                        <p {...stylex.props(styles.mTitle)}>{m.title}</p>
                        <span {...stylex.props(styles.mMeta)}>
                          <Clock size={12} aria-hidden="true" />
                          {label12(m.start)} – {label12(m.end)}
                        </span>
                      </div>
                      {m.attendees && (
                        <AvatarGroup size="sm" max={3}>
                          {m.attendees.map((a) => (
                            <Avatar key={a} name={a} />
                          ))}
                        </AvatarGroup>
                      )}
                    </div>
                  ) : (
                    <div {...stylex.props(styles.open)}>
                      Open
                      <Button
                        size="xs"
                        variant="ghost"
                        startIcon={<CalendarPlus size={14} />}
                        aria-label={`Book ${label12(hh(h))}`}
                        onPress={() => book(h)}
                      >
                        Book
                      </Button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div {...stylex.props(styles.week)}>
            {Array.from({ length: 5 }, (_, i) => {
              const day = new Date(monday.getTime() + i * 86400000);
              const iso = toIso(day);
              const list = all
                .filter((x) => x.date === iso)
                .sort((a, b) => a.start.localeCompare(b.start));
              return (
                <section key={iso} aria-label={iso} {...stylex.props(styles.col)}>
                  <span {...stylex.props(styles.colHead)}>
                    {WEEKDAYS_SHORT[day.getUTCDay()]} {day.getUTCDate()}
                  </span>
                  {list.length === 0 && <span {...stylex.props(styles.none)}>Free</span>}
                  {list.map((m) => (
                    <div key={m.id} {...stylex.props(styles.chip)} title={m.title}>
                      {label12(m.start).replace(':00', '')} {m.title}
                    </div>
                  ))}
                </section>
              );
            })}
          </div>
        )}
      </Tile>
    </Card>
  );
}
