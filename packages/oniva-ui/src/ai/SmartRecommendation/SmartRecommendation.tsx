import * as stylex from '@stylexjs/stylex';
import { ArrowDownUp, Check, ChevronDown, Sparkles } from 'lucide-react';
import { useState, type CSSProperties, type ReactNode, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { mergeSx } from '../../internal/sx';
import { w4 } from '../../internal/w4-styles';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../../components/DropdownMenu';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { CrossFade } from '../../motion/CrossFade';
import { Presence } from '../../motion/Presence';

const styles = stylex.create({
  card: { maxWidth: 440, overflow: 'hidden', width: '100%' },
  head: {
    alignItems: 'center',
    display: 'flex',
    gap: 8,
    minHeight: 44,
    paddingInlineEnd: 12,
    paddingInlineStart: 16,
    width: '100%',
    boxSizing: 'border-box',
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    borderRadius: radius['--oniva-radius-xl'],
  },
  spark: { color: colors['--oniva-color-accent-text'], flexShrink: 0 },
  title: { flexGrow: 1 },
  chevron: {
    color: colors['--oniva-color-icon-muted'],
    transform: 'rotate(-90deg)',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  chevronOpen: { transform: 'rotate(0deg)' },
  reason: {
    lineHeight: font['--oniva-font-lh-20'],
    margin: 0,
    paddingBlockEnd: 14,
    paddingInline: 16,
  },
  foot: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    borderTopColor: colors['--oniva-color-separator'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    justifyContent: 'space-between',
    minHeight: 48,
    paddingBlock: 10,
    paddingInlineEnd: 10,
    paddingInlineStart: 16,
  },
  signal: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-12'],
    gap: 8,
  },
  bars: { alignItems: 'flex-end', display: 'inline-flex', gap: 2, height: 12 },
  bar: {
    backgroundColor: colors['--oniva-color-chart-track'],
    borderRadius: radius['--oniva-radius-xs'],
    transform: 'scaleY(0.6)',
    transformOrigin: 'bottom center',
    transitionDelay: 'calc(var(--oniva-i, 0) * 50ms)',
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: 'background-color, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-spring'],
    width: 3,
  },
  barOn: { backgroundColor: colors['--oniva-color-accent-text'], transform: 'scaleY(1)' },
  inl: { display: 'inline-flex' },
  gap: { alignItems: 'center', gap: 6 },
  b1: { height: 5 },
  b2: { height: 8 },
  b3: { height: 11 },
  lvl1: { backgroundColor: colors['--oniva-color-warning-solid'] },
  lvl3: { backgroundColor: colors['--oniva-color-success-solid'] },
  btn: { fontSize: font['--oniva-font-size-13'], paddingInline: 10 },
  actions: { alignItems: 'center', display: 'flex', gap: 6, marginInlineStart: 'auto' },
  accepted: {
    alignItems: 'center',
    display: 'inline-flex',
    gap: 6,
    color: colors['--oniva-color-success-fg'],
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
  },
});

export type SignalLevel = 0 | 1 | 2 | 3;

export interface Recommendation {
  id: string;
  /** Short name used in the accept button, e.g. "Incremental sync". */
  label: string;
  /** One sentence why. */
  reason: ReactNode;
  /** 0 none, 1 weak, 2 good, 3 strong. */
  signal: SignalLevel;
}

export interface SmartRecommendationProps {
  /** The first option is recommended; the rest are alternatives. */
  options: Recommendation[];
  onAccept?: (option: Recommendation) => void;
  onUndo?: (option: Recommendation) => void;
  /** Starts with the reason visible. */
  defaultOpen?: boolean;
  title?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

const SIGNAL_TEXT = ['No signal', 'Weak signal', 'Good signal', 'Strong signal'] as const;
const level = (s: unknown): SignalLevel => {
  const n = Math.round(Number(s));
  return (Number.isFinite(n) ? Math.min(3, Math.max(0, n)) : 0) as SignalLevel;
};

/** "Incremental sync" becomes "incremental sync"; acronyms keep their capitals. */
const lowerFirst = (s: string) => (/^\p{Lu}\p{Ll}/u.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s);

/** Suggestion card: confidence signal, alternatives to switch to, accept with undo. */
export function SmartRecommendation({
  options,
  onAccept,
  onUndo,
  defaultOpen = true,
  title = 'Smart recommendation',
  className,
  xstyle,
  ref,
}: SmartRecommendationProps) {
  const [chosen, setChosen] = useState(0);
  const [accepted, setAccepted] = useState<number | null>(null);
  const [open, setOpen] = useState(defaultOpen);

  const at = chosen < options.length ? chosen : 0;
  const current = options[at];
  if (!current) return null;
  const done = accepted === at;
  const signal = level(current.signal);
  const alternatives = options.map((o, i) => ({ o, i })).filter(({ i }) => i !== at);

  return (
    <section
      ref={ref}
      aria-label={title}
      {...mergeSx(stylex.props(w4.card, styles.card, xstyle), className)}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        {...stylex.props(w4.reset, styles.head, focus.inset)}
      >
        <Sparkles size={16} aria-hidden="true" {...stylex.props(styles.spark)} />
        <span {...stylex.props(styles.title)}>{title}</span>
        <Presence isPresent={at !== 0} preset="scale" initial={false} xstyle={styles.inl}>
          <Badge size="sm" variant="neutral">
            Alternative
          </Badge>
        </Presence>
        <ChevronDown size={16} aria-hidden="true" {...stylex.props(styles.chevron, open && styles.chevronOpen)} />
      </button>
      <AnimatedHeight isOpen={open}>
        <CrossFade contentKey={current.id} morph="height" duration={220}>
          <p {...stylex.props(w4.muted, styles.reason)}>{current.reason}</p>
        </CrossFade>
      </AnimatedHeight>
      <div {...stylex.props(styles.foot)}>
        <span {...stylex.props(styles.signal)}>
          <span aria-hidden="true" {...stylex.props(styles.bars)}>
            {[1, 2, 3].map((n) => (
              <span key={n} style={{ '--oniva-i': n } as CSSProperties} {...stylex.props(styles.bar, styles[`b${n}` as 'b1'], signal >= n && styles.barOn, signal >= n && signal === 1 && styles.lvl1, signal >= n && signal === 3 && styles.lvl3)} />
            ))}
          </span>
          {SIGNAL_TEXT[signal]}
        </span>
        <CrossFade as="span" contentKey={done ? 'done' : 'pick'} duration={220} xstyle={styles.actions}>
        <span {...stylex.props(styles.inl, styles.gap)}>
          {done ? (
            <>
              <span role="status" {...stylex.props(styles.accepted)}>
                <Check size={14} aria-hidden="true" />
                {current.label} accepted
              </span>
              <Button
                size="sm"
                variant="ghost"
                onPress={() => {
                  setAccepted(null);
                  onUndo?.(current);
                }}
              >
                Undo
              </Button>
            </>
          ) : (
            <>
              {alternatives.length > 0 && (
                <DropdownMenu>
                  <Button size="sm" xstyle={styles.btn} variant="secondary" startIcon={<ArrowDownUp size={14} />}>
                    Alternatives
                  </Button>
                  <DropdownMenuContent
                    placement="bottom end"
                    aria-label="Alternatives"
                    selectionMode="single"
                    selectedKeys={[String(at)]}
                    onSelectionChange={(keys) => {
                      const k = [...keys][0];
                      if (k != null) setChosen(Number(k));
                    }}
                  >
                    {options.map((o, i) => (
                      <DropdownMenuItem key={i} id={String(i)} textValue={o.label}>
                        {o.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <Button size="sm" xstyle={styles.btn} variant="primary"
                onPress={() => {
                  setAccepted(at);
                  onAccept?.(current);
                }}
              >
                Accept {lowerFirst(current.label)}
              </Button>
            </>
          )}
        </span>
        </CrossFade>
      </div>
    </section>
  );
}
