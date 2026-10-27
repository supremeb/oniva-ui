import * as stylex from '@stylexjs/stylex';
import { Check, CircleAlert, Trophy } from 'lucide-react';
import { useState, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { Radio, RadioGroup } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { useFormatters } from '../../internal/format';
import { mergeSx, sxClass } from '../../internal/sx';
import { enterExit } from '../../internal/motion-styles';
import { formatDuration, w2s } from '../../internal/w2-parts';

const NARROW = '@container (max-width: 560px)';

const rise = stylex.keyframes({
  from: { opacity: 0, transform: `translateY(${motion['--oniva-motion-travel']})` },
  to: { opacity: 1, transform: 'translateY(0)' },
});
const sheen = stylex.keyframes({ from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(100%)' } });

const popIn = stylex.keyframes({
  '0%': { opacity: 0, transform: 'scale(0.6)' },
  '60%': { opacity: 1, transform: 'scale(1.1)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
});

const styles = stylex.create({
  pop: {
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: popIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'inline-flex',
  },
  lineSwap: { display: 'block' },
  lineMuted: { color: colors['--oniva-color-text-muted'] },
  rowBack: { opacity: { default: 0.6, ':hover': 1, ':focus-within': 1 } },
  root: { containerType: 'inline-size', fontFamily: font['--oniva-font-sans'], overflow: 'hidden', width: '100%' },
  bar: {
    alignItems: 'baseline',
    borderBottomColor: colors['--oniva-color-border'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    display: 'flex',
    gap: 8,
    paddingBlock: 10,
    paddingInline: 14,
  },
  title: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-semibold'], margin: 0 },
  barEnd: { alignItems: 'baseline', color: colors['--oniva-color-text-muted'], display: 'flex', flexShrink: 0, fontSize: font['--oniva-font-size-13'], fontVariantNumeric: 'tabular-nums', gap: 10, marginInlineStart: 'auto' },
  strong: { color: colors['--oniva-color-text'], fontWeight: font['--oniva-font-weight-medium'] },
  nameLine: { alignItems: 'baseline', display: 'flex', gap: 6, minWidth: 0 },
  stepLine: { color: colors['--oniva-color-info-fg'], fontSize: font['--oniva-font-size-13'], minHeight: 18, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  task: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  list: { display: 'flex', flexDirection: 'column', gap: 6, padding: 8 },
  row: {
    alignItems: 'center',
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: rise, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: 'transparent',
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    columnGap: 12,
    display: 'grid',
    gridTemplateAreas: {
      default: '"who bar score act"',
      [NARROW]: '"who score" "bar bar" "act act"',
    },
    gridTemplateColumns: {
      default: 'minmax(0, 2fr) minmax(80px, 1.2fr) minmax(64px, auto) auto',
      [NARROW]: 'minmax(0, 1fr) auto',
    },
    opacity: 1,
    paddingBlock: 10,
    paddingInline: 12,
    rowGap: 8,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'opacity, background-color, border-color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  rowPicked: { backgroundColor: colors['--oniva-color-success-bg'], borderColor: colors['--oniva-color-success-solid'] },
  who: { alignItems: 'center', display: 'flex', gap: 12, gridArea: 'who', minWidth: 0 },
  tile: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-sm'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    flexShrink: 0,
    fontSize: font['--oniva-font-size-11'],
    fontWeight: font['--oniva-font-weight-semibold'],
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  names: { display: 'flex', flexDirection: 'column', minWidth: 0 },
  name: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-medium'], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  approach: { color: colors['--oniva-color-text-muted'], display: { default: 'block', [NARROW]: 'none' }, fontSize: font['--oniva-font-size-12'], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  mid: { display: 'flex', flexDirection: 'column', gap: 4, gridArea: 'bar', minWidth: 0 },
  track: { backgroundColor: colors['--oniva-color-chart-track'], borderRadius: radius['--oniva-radius-full'], height: 6, overflow: 'hidden', position: 'relative' },
  fill: {
    borderRadius: radius['--oniva-radius-full'],
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    transformOrigin: 'left center',
    transitionDuration: motion['--oniva-motion-dur-slower'],
    transitionProperty: 'transform, background-color, box-shadow',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '100%',
  },
  fillRunning: { backgroundColor: colors['--oniva-color-info-solid'], boxShadow: `0 0 8px 0 ${colors['--oniva-color-info-solid']}` },
  fillDone: { backgroundColor: colors['--oniva-color-success-solid'], boxShadow: `0 0 0 0 transparent` },
  fillFailed: { backgroundColor: colors['--oniva-color-danger-solid'], boxShadow: `0 0 0 0 transparent` },
  shine: {
    animationDuration: '1.6s',
    animationIterationCount: 'infinite',
    animationName: { default: sheen, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
    backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)',
    inset: 0,
    position: 'absolute',
  },
  line: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], minHeight: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  lineFailed: { color: colors['--oniva-color-danger-fg'] },
  score: { alignItems: 'flex-end', display: 'flex', flexDirection: 'column', gridArea: 'score', justifySelf: 'end' },
  scoreNum: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-16'], fontVariantNumeric: 'tabular-nums', fontWeight: font['--oniva-font-weight-semibold'], lineHeight: 1.1 },
  sub: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-11'], fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' },
  act: { alignItems: 'center', display: 'flex', gap: 6, gridArea: 'act', justifySelf: { default: 'end', [NARROW]: 'stretch' }, minWidth: 90 },
  use: {
    alignItems: 'center',
    backgroundColor: { default: colors['--oniva-color-surface-inner'], '[data-hovered]': colors['--oniva-color-surface-hover'], '[data-selected]': colors['--oniva-color-success-solid'] },
    borderColor: { default: colors['--oniva-color-border-control'], '[data-selected]': 'transparent' },
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: { default: colors['--oniva-color-text'], '[data-selected]': colors['--oniva-color-success-on-solid'] },
    cursor: 'pointer',
    display: 'inline-flex',
    flexGrow: { default: 0, [NARROW]: 1 },
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 4,
    justifyContent: 'center',
    minHeight: { default: 28, '@media (pointer: coarse)': 40 },
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 2,
    outlineStyle: { default: 'none', '[data-focus-visible]': 'solid' },
    outlineWidth: 2,
    paddingInline: 10,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, color, border-color',
  },
});

export type AttemptStatus = 'running' | 'done' | 'failed';

export interface Attempt {
  id: string;
  /** Usually the model. */
  name: string;
  approach: string;
  icon?: ReactNode;
  status: AttemptStatus;
  /** 0 to 1. A failed attempt keeps where it stopped. */
  progress?: number;
  /** What it does right now, shown while it runs. */
  step?: string;
  /** 0 to 100 once done. Only the order matters for Best. */
  score?: number;
  /** One line about the outcome or the error. */
  note?: string;
  /** Milliseconds. */
  took?: number;
  /** Cost in dollars. */
  cost?: number;
}

export interface ParallelAttemptsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children' | 'title'> {
  attempts: Attempt[];
  task?: string;
  title?: string;
  /** Controlled pick; defaults to the best finished attempt. */
  picked?: string | null;
  onPick?: (attempt: Attempt) => void;
  formatCost?: (amount: number) => string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Several attempts at one task race as rows with a live bar; the best finished one is marked and picked, and you can switch. */
export function ParallelAttempts({ attempts, task, title, picked, onPick, formatCost, className, xstyle, ref, ...rest }: ParallelAttemptsProps) {
  const f = useFormatters();
  const [own, setOwn] = useState<string | null>(null);
  const cost = formatCost ?? ((n: number) => f.currency(n, 'USD', { minimumFractionDigits: 2, maximumFractionDigits: 3 }));
  const done = attempts.filter((a) => a.status === 'done' && a.score !== undefined);
  const best = done.reduce<Attempt | undefined>((b, a) => (!b || (a.score ?? 0) > (b.score ?? 0) ? a : b), undefined);
  const current = picked !== undefined ? picked : (own ?? best?.id ?? null);
  const titleId = `pa-${(title ?? 'best').replace(/\W/g, '')}`;
  const sx = stylex.props(aiStyles.panel, styles.root, xstyle);
  const radios = attempts.some((a) => a.status === 'done');

  const rows = attempts.map((a, i) => {
    const isPicked = current === a.id;
    const isBest = best?.id === a.id;
    const pct = Math.max(0, Math.min(1, a.status === 'done' ? 1 : (a.progress ?? 0)));
    const line = a.status === 'running' ? (a.step ?? 'Working…') : (a.note ?? (a.status === 'done' ? 'Finished' : 'Failed'));
    return (
      <div
        key={a.id}
        data-status={a.status}
        style={{ animationDelay: `${Math.min(i, 6) * 50}ms` }}
        {...stylex.props(styles.row, isPicked && styles.rowPicked, !isPicked && current != null && styles.rowBack)}
      >
        <div {...stylex.props(styles.who)}>
          <span aria-hidden="true" {...stylex.props(styles.tile)}>{a.icon ?? a.name.slice(0, 1)}</span>
          <span {...stylex.props(styles.names)}>
            <span {...stylex.props(styles.nameLine)}>
              <span {...stylex.props(styles.name)}>{a.name}</span>
              <span {...stylex.props(styles.approach)}>· {a.approach}</span>
            </span>
            <span {...stylex.props(styles.line, styles.stepLine, a.status === 'failed' && styles.lineFailed, a.status === 'done' && styles.lineMuted)} title={line}>
              <span key={`${a.status}`} data-state="entering" {...stylex.props(styles.lineSwap, enterExit.blur)}>
                {a.status === 'failed' && <CircleAlert size={11} aria-hidden="true" />} {line}
              </span>
            </span>
          </span>
        </div>
        <div {...stylex.props(styles.mid)}>
          <div aria-hidden="true" {...stylex.props(styles.track)}>
            <div style={{ transform: `scaleX(${pct})` }} {...stylex.props(styles.fill, a.status === 'running' ? styles.fillRunning : a.status === 'done' ? styles.fillDone : styles.fillFailed)}>
              {a.status === 'running' && <span {...stylex.props(styles.shine)} />}
            </div>
          </div>
        </div>
        <div {...stylex.props(styles.score)}>
          {a.status === 'done' && a.score !== undefined ? (
            <>
              <span {...stylex.props(styles.scoreNum)}>{f.number(a.score)}</span>
              <span {...stylex.props(styles.sub)}>{[a.took !== undefined ? formatDuration(a.took) : null, a.cost !== undefined ? cost(a.cost) : null].filter(Boolean).join(' · ')}</span>
            </>
          ) : (
            <>
              <span {...stylex.props(styles.sub)}>{a.status === 'running' ? f.percent(pct) : 'Failed'}</span>
              {a.cost !== undefined && <span {...stylex.props(styles.sub)}>{cost(a.cost)}</span>}
            </>
          )}
        </div>
        <div {...stylex.props(styles.act)}>
          {isBest && (
            <span {...stylex.props(styles.pop)}>
              <span {...stylex.props(w2s.tag, w2s.tagSuccess)}>
                <Trophy size={11} aria-hidden="true" /> Best
              </span>
            </span>
          )}
          {a.status === 'done' && (
            <Radio value={a.id} aria-label={`${a.name}${a.score !== undefined ? `, score ${a.score}` : ''}`} className={() => sxClass(stylex.props(styles.use))}>
              {({ isSelected }) => (
                <>
                  {isSelected && <Check size={12} aria-hidden="true" />}
                  {isSelected ? 'In use' : 'Use this one'}
                </>
              )}
            </Radio>
          )}
        </div>
      </div>
    );
  });

  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      <div {...stylex.props(styles.bar)}>
        <h4 id={titleId} {...stylex.props(styles.title)}>{title ?? `Best of ${attempts.length}`}</h4>
        {task && <span {...stylex.props(styles.task)}>{task}</span>}
        <span {...stylex.props(styles.barEnd)}>
          <span><span {...stylex.props(styles.strong)}>{done.length}</span> of {attempts.length} done</span>
          <span {...stylex.props(styles.strong)}>{cost(attempts.reduce((n, a) => n + (a.cost ?? 0), 0))}</span>
        </span>
      </div>
      {radios ? (
        <RadioGroup
          aria-labelledby={titleId}
          value={current ?? ''}
          onChange={(id) => {
            setOwn(id);
            const a = attempts.find((x) => x.id === id);
            if (a) onPick?.(a);
          }}
          className={() => sxClass(stylex.props(styles.list))}
        >
          {rows}
        </RadioGroup>
      ) : (
        <div role="list" aria-labelledby={titleId} {...stylex.props(styles.list)}>
          {rows}
        </div>
      )}
    </div>
  );
}
