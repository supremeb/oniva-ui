import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { Button } from 'oniva-ui';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import { radius } from '@oniva-tokens/radius.stylex';

const styles = stylex.create({
  h1: {
    fontSize: font['--oniva-font-size-40'],
    fontWeight: font['--oniva-font-weight-medium'],
    letterSpacing: font['--oniva-font-track-hero'],
    margin: '0 0 8px',
  },
  sub: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-16'], margin: '0 0 32px', maxWidth: 680 },
  h2: { fontSize: font['--oniva-font-size-24'], fontWeight: font['--oniva-font-weight-semibold'], margin: '48px 0 8px' },
  p: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-14'], margin: '0 0 16px', maxWidth: 680 },
  row: { alignItems: 'center', display: 'grid', gap: 12, gridTemplateColumns: '200px 1fr 56px', paddingBlock: 6 },
  code: { fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-12'] },
  muted: { color: colors['--oniva-color-text-muted'] },
  track: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-full'],
    height: 10,
    overflow: 'hidden',
  },
  bar: {
    backgroundColor: colors['--oniva-color-focus-ring'],
    borderRadius: radius['--oniva-radius-full'],
    height: '100%',
    transformOrigin: 'left center',
    transitionProperty: 'transform',
    width: '100%',
  },
  curves: { display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' },
  card: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 16,
  },
  lane: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-full'],
    height: 24,
    marginBlockStart: 12,
    position: 'relative',
  },
  dot: {
    backgroundColor: colors['--oniva-color-focus-ring'],
    borderRadius: radius['--oniva-radius-full'],
    height: 16,
    insetBlockStart: 4,
    insetInlineStart: 4,
    position: 'absolute',
    transitionProperty: 'transform',
    width: 16,
  },
  press: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    cursor: 'pointer',
    display: 'inline-block',
    paddingBlock: 14,
    paddingInline: 24,
    transform: { default: 'none', ':active': 'scale(var(--oniva-motion-press-scale))' },
    transitionDuration: 'var(--oniva-motion-dur-press)',
    transitionProperty: 'transform',
    transitionTimingFunction: 'var(--oniva-motion-ease-out)',
    userSelect: 'none',
  },
  table: { borderCollapse: 'collapse', fontSize: font['--oniva-font-size-13'], width: '100%' },
  cell: {
    borderBottomColor: colors['--oniva-color-separator'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    paddingBlock: 6,
    paddingInlineEnd: 12,
    textAlign: 'start',
  },
});

const DURATIONS = [
  ['instant', 'hover background, highlight'],
  ['micro', 'tooltip exit, tiny popup exit'],
  ['fast', 'popup exits, color'],
  ['press', 'press scale'],
  ['base', 'state changes, fades'],
  ['enter', 'popover / menu / dialog enter'],
  ['slow', 'indicators, modal content'],
  ['height', 'AnimatedHeight'],
  ['deliberate', 'text reveal, number roll'],
  ['sheet', 'drawer / sheet'],
  ['slower', 'rare hero moments'],
] as const;

const EASINGS = [
  ['out', 'Default for enter, exit, press'],
  ['out-expo', 'Big moves, number roll'],
  ['in-out', 'Movement already on screen'],
  ['drawer', 'Sheets and drawers'],
  ['spring', 'Small overshoot: badges, digits'],
  ['emphasized', 'Hero entrances'],
  ['standard', 'Legacy alias'],
] as const;

function useVar(name: string): string {
  const [v, setV] = useState('');
  useEffect(() => {
    setV(getComputedStyle(document.documentElement).getPropertyValue(name).trim());
  }, [name]);
  return v;
}

function fmt(v: string): string {
  const m = /^(\d*\.?\d+)s$/.exec(v);
  return m?.[1] ? `${Math.round(parseFloat(m[1]) * 1000)}ms` : v;
}

function parseBezier(v: string): [number, number, number, number] | null {
  const m = /cubic-bezier\(([^)]+)\)/.exec(v);
  if (!m?.[1]) return null;
  const n = m[1].split(',').map((x) => parseFloat(x));
  return n.length === 4 && n.every((x) => !Number.isNaN(x)) ? (n as [number, number, number, number]) : null;
}

function DurationRow({ name, use, on }: { name: string; use: string; on: boolean }) {
  const ms = useVar(`--oniva-motion-dur-${name}`);
  return (
    <div {...stylex.props(styles.row)}>
      <div>
        <code {...stylex.props(styles.code)}>dur-{name}</code>
        <div {...stylex.props(styles.muted)}>{use}</div>
      </div>
      <div {...stylex.props(styles.track)}>
        <div
          {...stylex.props(styles.bar)}
          style={{
            transform: on ? 'scaleX(1)' : 'scaleX(0)',
            transitionDuration: `var(--oniva-motion-dur-${name})`,
            transitionTimingFunction: 'var(--oniva-motion-ease-out)',
          }}
        />
      </div>
      <code {...stylex.props(styles.code)}>{fmt(ms)}</code>
    </div>
  );
}

function EaseCard({ name, use, on }: { name: string; use: string; on: boolean }) {
  const v = useVar(`--oniva-motion-ease-${name}`);
  const b = parseBezier(v);
  const S = 120;
  const pad = 20;
  // y axis is inverted; allow overshoot room above/below
  const X = (x: number) => pad + x * S;
  const Y = (y: number) => pad + (1 - y) * S;
  return (
    <div {...stylex.props(styles.card)}>
      <code {...stylex.props(styles.code)}>ease-{name}</code>
      <div {...stylex.props(styles.muted)} style={{ fontSize: 12 }}>{use}</div>
      <svg viewBox={`0 0 ${S + pad * 2} ${S + pad * 2}`} width="100%" height={160} role="img" aria-label={`${name} curve`}>
        <rect x={pad} y={pad} width={S} height={S} fill="none" stroke="currentColor" opacity={0.15} />
        {b && (
          <>
            <path
              d={`M ${X(0)} ${Y(0)} C ${X(b[0])} ${Y(b[1])}, ${X(b[2])} ${Y(b[3])}, ${X(1)} ${Y(1)}`}
              fill="none"
              stroke="var(--oniva-color-focus-ring)"
              strokeWidth={2.5}
            />
            <line x1={X(0)} y1={Y(0)} x2={X(b[0])} y2={Y(b[1])} stroke="currentColor" opacity={0.3} />
            <line x1={X(1)} y1={Y(1)} x2={X(b[2])} y2={Y(b[3])} stroke="currentColor" opacity={0.3} />
          </>
        )}
      </svg>
      <code {...stylex.props(styles.code, styles.muted)}>{v}</code>
      <div {...stylex.props(styles.lane)}>
        <div
          {...stylex.props(styles.dot)}
          style={{
            transform: on ? 'translateX(calc(var(--lane-w, 200px)))' : 'translateX(0)',
            transitionDuration: '700ms',
            transitionTimingFunction: `var(--oniva-motion-ease-${name})`,
            ['--lane-w' as string]: '180px',
          }}
        />
      </div>
    </div>
  );
}

export function MotionFoundations() {
  const [on, setOn] = useState(false);
  return (
    <>
      <h1 {...stylex.props(styles.h1)}>Motion</h1>
      <p {...stylex.props(styles.sub)}>
        Tokens are public <code>--oniva-motion-*</code> CSS variables. Enters ease-out at 150-250ms, exits run at roughly 60-75% of the
        enter, only transform and opacity animate, and every duration collapses under <code>prefers-reduced-motion</code>.
      </p>
      <Button onPress={() => setOn((v) => !v)}>Play / reset all demos</Button>

      <h2 {...stylex.props(styles.h2)}>Durations</h2>
      <p {...stylex.props(styles.p)}>Values are read live from the CSS variables. Bars use the matching token as their transition duration.</p>
      <div>
        {DURATIONS.map(([n, u]) => (
          <DurationRow key={n} name={n} use={u} on={on} />
        ))}
      </div>

      <h2 {...stylex.props(styles.h2)}>Easings</h2>
      <p {...stylex.props(styles.p)}>
        Curves are drawn from the token values; the dot travels with the same easing over 700ms so differences are visible.
      </p>
      <div {...stylex.props(styles.curves)}>
        {EASINGS.map(([n, u]) => (
          <EaseCard key={n} name={n} use={u} on={on} />
        ))}
      </div>

      <h2 {...stylex.props(styles.h2)}>Press feedback</h2>
      <p {...stylex.props(styles.p)}>
        Scale to <code>--oniva-motion-press-scale</code> (0.97) in 120ms, pointer-only (<code>:active</code>). Press and hold the card.
      </p>
      <span {...stylex.props(styles.press)} role="button" tabIndex={0}>
        Press me
      </span>

      <h2 {...stylex.props(styles.h2)}>Scalars</h2>
      <table {...stylex.props(styles.table)}>
        <thead>
          <tr>
            <th {...stylex.props(styles.cell)}>Token</th>
            <th {...stylex.props(styles.cell)}>Value</th>
            <th {...stylex.props(styles.cell)}>Reduced motion</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['pop-scale', 'popover / dialog starting scale', '1'],
            ['press-scale', 'press feedback', '1'],
            ['travel', 'slide distance for enters', '0px'],
            ['stagger', 'step between staggered children', '~0'],
          ].map(([n, u, r]) => (
            <ScalarRow key={n} name={n!} use={u!} reduced={r!} />
          ))}
        </tbody>
      </table>
    </>
  );
}

function ScalarRow({ name, use, reduced }: { name: string; use: string; reduced: string }) {
  const v = useVar(`--oniva-motion-${name}`);
  return (
    <tr>
      <td {...stylex.props(styles.cell)}>
        <code {...stylex.props(styles.code)}>{name}</code> <span {...stylex.props(styles.muted)}>{use}</span>
      </td>
      <td {...stylex.props(styles.cell)}>
        <code {...stylex.props(styles.code)}>{v}</code>
      </td>
      <td {...stylex.props(styles.cell)}>{reduced}</td>
    </tr>
  );
}
