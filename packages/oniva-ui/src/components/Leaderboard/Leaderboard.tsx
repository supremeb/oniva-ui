import * as stylex from '@stylexjs/stylex';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { useLayoutEffect, useRef } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { Avatar } from '../Avatar';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { dash } from '../../internal/dash-styles';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  /** Rank in the previous period; drives the change arrow. */
  previousRank?: number;
  subtitle?: string;
  avatarSrc?: string;
}

const styles = stylex.create({
  list: { display: 'flex', flexDirection: 'column', gap: 4, listStyle: 'none', margin: 0 },
  row: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    display: 'flex',
    gap: 12,
    padding: 10,
  },
  rank: {
    color: colors['--oniva-color-text-muted'],
    fontWeight: font['--oniva-font-weight-semibold'],
    textAlign: 'center',
    width: 24,
  },
  first: { color: colors['--oniva-color-warning-fg'] },
  who: { display: 'flex', flexGrow: 1, flexDirection: 'column', minWidth: 0 },
  sub: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
  score: { fontWeight: font['--oniva-font-weight-semibold'] },
  change: { alignItems: 'center', display: 'inline-flex', fontSize: font['--oniva-font-size-12'], gap: 1, minWidth: 36 },
  up: { color: colors['--oniva-color-success-fg'] },
  down: { color: colors['--oniva-color-danger-fg'] },
  same: { color: colors['--oniva-color-text-muted'] },
});

export interface LeaderboardProps extends Omit<HTMLAttributes<HTMLOListElement>, 'style'> {
  entries: LeaderboardEntry[];
  /** Label for the score read by screen readers, e.g. "points". */
  scoreLabel?: string;
  scoreFormat?: Intl.NumberFormatOptions;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLOListElement>;
}

/** Ranked list. Entries are sorted by score; reorders animate with a FLIP transform (skipped for reduced motion). */
export function Leaderboard({ entries, scoreLabel = 'points', scoreFormat, className, xstyle, ref, ...rest }: LeaderboardProps) {
  const sorted = [...entries].sort((a, b) => b.score - a.score);
  const nodes = useRef(new Map<string, HTMLLIElement>());
  const tops = useRef(new Map<string, number>());

  useLayoutEffect(() => {
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    nodes.current.forEach((el, id) => {
      const top = el.getBoundingClientRect().top;
      const prev = tops.current.get(id);
      if (!reduce && prev != null && Math.abs(prev - top) > 1 && el.animate) {
        el.animate([{ transform: `translateY(${prev - top}px)` }, { transform: 'translateY(0)' }], {
          duration: 250,
          easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
        });
      }
      tops.current.set(id, top);
    });
  });

  const sx = stylex.props(dash.root, dash.panel, styles.list, xstyle);
  return (
    <ol {...rest} ref={ref} {...mergeSx(sx, className)}>
      {sorted.map((e, i) => {
        const rank = i + 1;
        const diff = e.previousRank != null ? e.previousRank - rank : 0;
        return (
          <li
            key={e.id}
            ref={(el) => {
              if (el) nodes.current.set(e.id, el);
              else nodes.current.delete(e.id);
            }}
            {...stylex.props(styles.row)}
          >
            <span {...stylex.props(styles.rank, dash.num, rank === 1 && styles.first)}>
              <span {...stylex.props(dash.sr)}>Rank </span>
              {rank}
            </span>
            <Avatar name={e.name} src={e.avatarSrc} size="sm" />
            <span {...stylex.props(styles.who)}>
              <span {...stylex.props(dash.title, dash.ellipsis)}>{e.name}</span>
              {e.subtitle && <span {...stylex.props(styles.sub)}>{e.subtitle}</span>}
            </span>
            <span {...stylex.props(styles.change, dash.num, diff > 0 ? styles.up : diff < 0 ? styles.down : styles.same)}>
              {diff > 0 ? <ArrowUp size={12} aria-hidden="true" /> : diff < 0 ? <ArrowDown size={12} aria-hidden="true" /> : <Minus size={12} aria-hidden="true" />}
              <span {...stylex.props(dash.sr)}>{diff > 0 ? 'Up' : diff < 0 ? 'Down' : 'No change'}</span>
              {diff !== 0 && Math.abs(diff)}
            </span>
            <span {...stylex.props(styles.score, dash.num)}>
              <AnimatedNumber value={e.score} format={scoreFormat} />
              <span {...stylex.props(dash.sr)}> {scoreLabel}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
