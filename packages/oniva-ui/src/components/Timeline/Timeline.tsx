import * as stylex from '@stylexjs/stylex';
import { ChevronDown } from 'lucide-react';
import { useId, useState } from 'react';
import { useFormatters } from '../../internal/format';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { dash } from '../../internal/dash-styles';
import { focus } from '../../internal/focus';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import type { Tone } from '../../internal/types';

export interface TimelineEvent {
  id: string;
  /** ISO timestamp. */
  time: string;
  actor: string;
  /** What happened, e.g. "merged pull request #482". */
  action: ReactNode;
  icon?: ReactNode;
  tone?: Tone;
  /** Expandable details. */
  details?: ReactNode;
}

const styles = stylex.create({
  group: { listStyle: 'none', margin: 0, padding: 0 },
  day: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-semibold'],
    margin: 0,
    marginBlock: 16,
    textTransform: 'uppercase',
    letterSpacing: font['--oniva-font-track-label'],
  },
  item: { display: 'flex', gap: 12, position: 'relative' },
  rail: { alignItems: 'center', display: 'flex', flexDirection: 'column', flexShrink: 0, width: 28 },
  dot: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderColor: colors['--oniva-color-surface'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 2,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text-on-tertiary'],
    display: 'flex',
    flexShrink: 0,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  tone_info: { backgroundColor: colors['--oniva-color-info-bg'], color: colors['--oniva-color-info-fg'] },
  tone_success: { backgroundColor: colors['--oniva-color-success-bg'], color: colors['--oniva-color-success-fg'] },
  tone_warning: { backgroundColor: colors['--oniva-color-warning-bg'], color: colors['--oniva-color-warning-fg'] },
  tone_danger: { backgroundColor: colors['--oniva-color-danger-bg'], color: colors['--oniva-color-danger-fg'] },
  tone_neutral: {},
  line: { backgroundColor: colors['--oniva-color-border'], flexGrow: 1, minHeight: 8, width: 1 },
  body: { flexGrow: 1, minWidth: 0, paddingBottom: 16 },
  head: { alignItems: 'baseline', display: 'flex', gap: 8, minHeight: 28 },
  text: { flexGrow: 1, lineHeight: font['--oniva-font-lh-14'], paddingTop: 4 },
  time: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], flexShrink: 0 },
  toggle: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-sm'],
    color: { default: colors['--oniva-color-text-muted'], ':hover': { default: null, [media.hover]: colors['--oniva-color-text'] } },
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-12'],
    gap: 2,
    marginTop: 2,
  },
  chev: {
    transform: { default: 'rotate(0deg)', ':is([data-open])': 'rotate(180deg)' },
    transitionDuration: motion['--oniva-motion-dur-fast'],
    transitionProperty: 'transform',
  },
  panelWrap: {
    display: 'grid',
    gridTemplateRows: { default: '0fr', ':is([data-open])': '1fr' },
    transitionDuration: { default: motion['--oniva-motion-dur-height'], [media.reducedMotion]: '0s' },
    transitionProperty: 'grid-template-rows',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  panelInner: { overflow: 'hidden' },
  panel: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-md'],
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-13'],
    marginTop: 6,
    padding: 10,
  },
});

export function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

function dayLabel(key: string, today?: string, locale = 'en-US'): string {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(Date.UTC(y!, m! - 1, d));
  const base = date.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' });
  if (today) {
    const diff = Math.round((Date.parse(today) - date.getTime()) / 86400000);
    if (diff === 0) return `Today · ${base}`;
    if (diff === 1) return `Yesterday · ${base}`;
  }
  return base;
}

function timeLabel(iso: string): string {
  const t = iso.slice(11, 16);
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  return `${((h! + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h! >= 12 ? 'PM' : 'AM'}`;
}

function Item({ ev, last }: { ev: TimelineEvent; last: boolean }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const tone = ev.tone ?? 'neutral';
  return (
    <li {...stylex.props(styles.item)}>
      <div {...stylex.props(styles.rail)}>
        <span aria-hidden="true" {...stylex.props(styles.dot, styles[`tone_${tone}`])}>
          {ev.icon}
        </span>
        {!last && <span aria-hidden="true" {...stylex.props(styles.line)} />}
      </div>
      <div {...stylex.props(styles.body)}>
        <div {...stylex.props(styles.head)}>
          <span {...stylex.props(styles.text)}>
            <span {...stylex.props(dash.title)}>{ev.actor}</span> {ev.action}
          </span>
          <time dateTime={ev.time} {...stylex.props(styles.time, dash.num)}>
            {timeLabel(ev.time)}
          </time>
        </div>
        {ev.details != null && (
          <>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={id}
              data-open={open || undefined}
              onClick={() => setOpen((o) => !o)}
              {...stylex.props(dash.reset, styles.toggle, focus.ring)}
            >
              {open ? 'Hide details' : 'Show details'}
              <ChevronDown size={14} aria-hidden="true" data-open={open || undefined} {...stylex.props(styles.chev)} />
            </button>
            <div data-open={open || undefined} {...stylex.props(styles.panelWrap)}>
              <div id={id} role="region" aria-label={`Details for ${ev.actor}`} inert={!open} {...stylex.props(styles.panelInner)}>
                <div {...stylex.props(styles.panel)}>{ev.details}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </li>
  );
}

export interface TimelineProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  events: TimelineEvent[];
  /** ISO date (YYYY-MM-DD) used for "Today"/"Yesterday" labels. */
  today?: string;
  /** BCP 47 locale for day headings. Defaults to the active React Aria locale. */
  locale?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Vertical activity timeline grouped by day (newest first by input order). */
export function Timeline({ events, today, locale: localeProp, className, xstyle, ref, ...rest }: TimelineProps) {
  const { locale: ctxLocale } = useFormatters();
  const locale = localeProp ?? ctxLocale;
  const groups: [string, TimelineEvent[]][] = [];
  for (const ev of events) {
    const k = dayKey(ev.time);
    const g = groups.find(([key]) => key === k);
    if (g) g[1].push(ev);
    else groups.push([k, [ev]]);
  }
  const sx = stylex.props(dash.root, xstyle);
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      {groups.map(([key, evs]) => (
        <section key={key} aria-label={dayLabel(key, today, locale)}>
          <h3 {...stylex.props(styles.day)}>{dayLabel(key, today, locale)}</h3>
          <ol {...stylex.props(styles.group)}>
            {evs.map((ev, i) => (
              <Item key={ev.id} ev={ev} last={i === evs.length - 1} />
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
