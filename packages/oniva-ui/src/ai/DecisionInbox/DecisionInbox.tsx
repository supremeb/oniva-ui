import * as stylex from '@stylexjs/stylex';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useState, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { focus } from '../../internal/focus';
import { mergeSx } from '../../internal/sx';
import { useReducedMotion } from '../../internal/motion-hooks';
import { useTimeouts } from '../../internal/w4-hooks';
import { w4 } from '../../internal/w4-styles';
import { Button } from '../../components/Button';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { CrossFade } from '../../motion/CrossFade';
import { m3 } from '../../internal/m3-motion';

const styles = stylex.create({
  card: { maxWidth: 440, overflow: 'hidden', width: '100%' },
  bar: {
    alignItems: 'center',
    borderBlockEndColor: colors['--oniva-color-separator'],
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    display: 'flex',
    minHeight: 44,
    paddingInline: 16,
  },
  head: {
    alignItems: 'center',
    color: colors['--oniva-color-text'],
    display: 'flex',
    fontSize: font['--oniva-font-size-14'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 8,
    margin: 0,
  },
  iconBox: { display: 'inline-flex', flexShrink: 0 },
  warn: { color: colors['--oniva-color-warning-solid'], flexShrink: 0 },
  ok: { color: colors['--oniva-color-success-solid'], flexShrink: 0 },
  list: { overflow: 'hidden' },
  row: {
        paddingBlockEnd: 14,
    paddingBlockStart: 12,
    paddingInline: 16,
  },
  divided: {
    borderBlockStartColor: colors['--oniva-color-separator'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
  },
  title: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-18'],
    margin: 0,
  },
  folded: {
    display: 'block',
    color: colors['--oniva-color-text-muted'],
    width: '100%',
    fontWeight: font['--oniva-font-weight-regular'],
  },
  pair: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8 },
  detail: { margin: 0, marginBlockStart: 2 },
  actions: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8, marginBlockStart: 12 },
  confirm: {
    alignItems: 'center',
    color: colors['--oniva-color-success-fg'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 6,
    minHeight: 32,
  },
  empty: {
    margin: 0,
    paddingBlock: 14,
    paddingInline: 16,
  },
});

export interface Decision {
  id: string;
  title: string;
  /** Short context under the title. */
  detail?: string;
  /** Main answer (filled button). */
  primary: string;
  /** Other answer (light button). */
  secondary: string;
  /** Starts folded to one muted line; click to open. */
  collapsed?: boolean;
}

export type DecisionAnswer = 'primary' | 'secondary';

export interface DecisionInboxProps {
  decisions: Decision[];
  /** Called with the decision and the chosen answer. */
  onDecide?: (decision: Decision, answer: DecisionAnswer) => void;
  title?: string;
  /** How long the confirmation shows before the row folds away (ms). */
  confirmMs?: number;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

interface RowState {
  open: boolean;
  answered?: string;
  gone?: boolean;
}

/** Open decisions with two quick answers each; answered ones confirm and fold away. */
export function DecisionInbox({
  decisions,
  onDecide,
  title,
  confirmMs = 1100,
  className,
  xstyle,
  ref,
}: DecisionInboxProps) {
  const reduced = useReducedMotion();
  const after = useTimeouts();
  const [state, setState] = useState<Record<string, RowState>>(() =>
    Object.fromEntries(decisions.map((d) => [d.id, { open: !d.collapsed }])),
  );
  const patch = (id: string, next: Partial<RowState>) =>
    setState((s) => ({ ...s, [id]: { open: true, ...s[id], ...next } }));

  const openCount = decisions.filter((d) => !state[d.id]?.answered).length;

  const decide = (d: Decision, answer: DecisionAnswer) => {
    patch(d.id, { answered: answer === 'primary' ? d.primary : d.secondary });
    onDecide?.(d, answer);
    after(reduced ? 0 : confirmMs, () => {
      setState((s) => {
        const next = { ...s, [d.id]: { ...s[d.id]!, gone: true } };
        const folded = decisions.find((x) => x.id !== d.id && !next[x.id]?.open && !next[x.id]?.answered);
        if (folded) next[folded.id] = { ...next[folded.id]!, open: true };
        return next;
      });
    });
  };

  return (
    <section ref={ref} aria-label="Decision inbox" {...mergeSx(stylex.props(w4.card, styles.card, xstyle), className)}>
      <div {...stylex.props(styles.bar)}>
        <h3 aria-live="polite" {...stylex.props(styles.head)}>
          <CrossFade as="span" contentKey={openCount > 0 ? 'warn' : 'ok'} duration={220} xstyle={styles.iconBox}>
            {openCount > 0 ? (
              <AlertTriangle size={16} aria-hidden="true" {...stylex.props(styles.warn)} />
            ) : (
              <CheckCircle2 size={16} aria-hidden="true" {...stylex.props(styles.ok)} />
            )}
          </CrossFade>
          {title ?? (openCount > 0 ? (
            <span>
              <AnimatedNumber value={openCount} /> {openCount === 1 ? 'needs' : 'need'} your input
            </span>
          ) : (
            <CrossFade as="span" contentKey="caught-up" duration={220}>All caught up</CrossFade>
          ))}
        </h3>
      </div>
      <div {...stylex.props(styles.list)}>
        {decisions.map((d, idx) => {
          const s = state[d.id] ?? { open: true };
          return (
            <AnimatedHeight key={d.id} isOpen={!s.gone}>
              <div {...stylex.props(styles.row, idx > 0 && styles.divided)}>
                {s.open ? (
                  <p {...stylex.props(styles.title)}>{d.title}</p>
                ) : (
                  <button
                    type="button"
                    title={d.title}
                    onClick={() => patch(d.id, { open: true })}
                    {...stylex.props(w4.reset, styles.title, styles.folded, w4.clamp1, focus.ring)}
                  >
                    {d.title}
                  </button>
                )}
                <AnimatedHeight isOpen={s.open}>
                  {d.detail && <p {...stylex.props(w4.muted, styles.detail)}>{d.detail}</p>}
                  <div {...stylex.props(styles.actions)}>
                    <CrossFade as="div" contentKey={s.answered ? 'done' : 'ask'} duration={220}>
                    {s.answered ? (
                      <span role="status" {...stylex.props(styles.confirm)}>
                        <CheckCircle2 size={16} aria-hidden="true" {...stylex.props(m3.pop)} />
                        {s.answered}
                      </span>
                    ) : (
                      <span {...stylex.props(styles.pair)}>
                        <Button size="sm" variant="primary" onPress={() => decide(d, 'primary')}>
                          {d.primary}
                        </Button>
                        <Button size="sm" variant="secondary" onPress={() => decide(d, 'secondary')}>
                          {d.secondary}
                        </Button>
                      </span>
                    )}
                    </CrossFade>
                  </div>
                </AnimatedHeight>
              </div>
            </AnimatedHeight>
          );
        })}
        <AnimatedHeight isOpen={openCount === 0}>
          <p {...stylex.props(w4.muted, styles.empty)}>Nothing waiting on you. New decisions show up here.</p>
        </AnimatedHeight>
      </div>
    </section>
  );
}
