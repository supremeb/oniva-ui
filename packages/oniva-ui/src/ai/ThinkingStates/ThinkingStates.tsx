import * as stylex from '@stylexjs/stylex';
import { Check, ChevronDown, ChevronRight, LayoutGrid, Search } from 'lucide-react';
import { useEffect, useId, useLayoutEffect, useRef, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { CrossFade } from '../../motion/CrossFade';
import { m3 } from '../../internal/m3-motion';
import { prefersReducedMotion } from '../../internal/motion-hooks';
import { useFormatters } from '../../internal/format';
import { mergeSx } from '../../internal/sx';
import { TextShimmer } from '../TextShimmer';

const inK = stylex.keyframes({
  from: { filter: 'blur(2px)', opacity: 0, transform: 'translateY(8px)' },
  to: { filter: 'blur(0)', opacity: 1, transform: 'translateY(0)' },
});
const outK = stylex.keyframes({
  from: { filter: 'blur(0)', opacity: 1, transform: 'translateY(0)' },
  to: { filter: 'blur(2px)', opacity: 0, transform: 'translateY(-8px)' },
});
const fadeIn = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const fadeOut = stylex.keyframes({ from: { opacity: 1 }, to: { opacity: 0 } });

const stepIn = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(6px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});
const pulse = stylex.keyframes({ '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.35 } });

const styles = stylex.create({
  panelRoot: { display: 'flex', flexDirection: 'column', fontFamily: font['--oniva-font-sans'], gap: 4 },
  head: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors['--oniva-color-text-muted'],
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-13'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 6,
    paddingBlock: 4,
    paddingInline: 0,
  },
  card: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    gap: 0,
    maxWidth: 440,
    overflow: 'hidden',
    width: '100%',
  },
  cardHead: {
    borderBlockEndColor: colors['--oniva-color-border'],
    borderBlockEndStyle: 'solid',
    borderBlockEndWidth: 1,
    justifyContent: 'flex-start',
    paddingBlock: 12,
    paddingInline: 14,
    width: '100%',
  },
  cardHeadClosed: { borderBlockEndWidth: 0 },
  cardIcon: { color: accent['--oniva-accent-solid'] },
  cardTitle: { color: colors['--oniva-color-text'] },
  cardBody: { paddingBlock: 6, paddingInline: 14 },
  spacer: { flexGrow: 1 },
  srcIcon: { alignItems: 'center', display: 'inline-flex', marginInlineEnd: 6, verticalAlign: 'middle' },
  chev: {
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  chevOpen: { transform: 'rotate(90deg)' },
  chevFlip: { transform: 'rotate(180deg)' },
  steps: { display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none', margin: 0, paddingBlock: 6, paddingInlineEnd: 0, paddingInlineStart: 4, position: 'relative' },
  step: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationFillMode: 'both',
    animationName: { default: stepIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    alignItems: 'flex-start',
    color: colors['--oniva-color-text'],
    display: 'flex',
    flexDirection: 'column',
    fontSize: font['--oniva-font-size-13'],
    gap: 6,
    paddingInlineStart: 18,
    position: 'relative',
  },
  node: {
    backgroundColor: colors['--oniva-color-border-control'],
    borderRadius: radius['--oniva-radius-full'],
    height: 8,
    insetInlineStart: 0,
    position: 'absolute',
    top: 6,
    width: 8,
  },
  nodeActive: {
    animationDuration: '1200ms',
    animationIterationCount: { default: 'infinite', [media.reducedMotion]: 0 },
    animationName: pulse,
    backgroundColor: accent['--oniva-accent-solid'],
  },
  stepLabel: { alignItems: 'center', display: 'inline-flex', gap: 6 },
  line: {
    backgroundColor: colors['--oniva-color-border-control'],
    insetInlineStart: 7.5,
    pointerEvents: 'none',
    position: 'absolute',
    top: 16,
    transformOrigin: 'top center',
    width: 1,
  },
  srcRow: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  src: {
    backgroundColor: { default: colors['--oniva-color-surface-inner'], ':hover': colors['--oniva-color-surface-hover'] },
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text-muted'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-12'],
    paddingBlock: 2,
    paddingInline: 8,
    textDecoration: 'none',
  },
  moreBtn: { appearance: 'none', cursor: 'pointer' },
  doneIcon: { color: colors['--oniva-color-accent-text'] },
  root: {
    color: colors['--oniva-color-text-muted'],
    display: 'inline-grid',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    lineHeight: font['--oniva-font-lh-20'],
    overflow: 'hidden',
  },
  layer: { gridArea: '1 / 1', whiteSpace: 'nowrap' },
  enter: {
    animationDuration: motion['--oniva-motion-dur-base'],
    animationFillMode: 'both',
    animationName: { default: inK, [media.reducedMotion]: fadeIn },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  exit: {
    animationDuration: motion['--oniva-motion-dur-base'],
    animationFillMode: 'both',
    animationName: { default: outK, [media.reducedMotion]: fadeOut },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    pointerEvents: 'none',
  },
});

export interface ThinkingStep {
  kind?: 'search' | 'step';
  label: string;
  /** Sites that were read; the first ones show, the rest hide behind a "+N more" chip. */
  sources?: { label: string; href?: string; icon?: ReactNode }[];
}

export interface ThinkingStatesProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  /** Status lines to cycle through. The last one holds. Omit when using `steps`. */
  messages?: string[];
  /** Panel mode: a collapsible trail of steps with a live timer, revealed one by one. */
  steps?: ThinkingStep[];
  /** Pause between two steps in ms (panel mode). Default 1300. */
  stepMs?: number;
  /** Label of the final row (panel mode). Default "Finished thinking". */
  doneLabel?: string;
  /** Called once with the elapsed seconds when the last step is revealed. */
  onDone?: (seconds: number) => void;
  /** Start the panel collapsed. */
  defaultCollapsed?: boolean;
  /** Panel mode look: `plain` (default) is the bare trail; `card` frames it with a header bar (icon, title, timer, chevron), a divider and the steps below. */
  variant?: 'plain' | 'card';
  /** How long each line is shown before swapping. Default 2000ms. */
  holdMs?: number;
  /** Loop back to the first message after the last. Default false. */
  loop?: boolean;
  /** Pause cycling (e.g. once the answer arrives). */
  paused?: boolean;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

type LineProps = Omit<ThinkingStatesProps, 'steps' | 'stepMs' | 'doneLabel' | 'onDone' | 'defaultCollapsed' | 'variant'>;

/** Rotating agent status line. Each line holds 2s, then swaps (150ms, 8px rise + 2px blur). */
function ThinkingLine({ messages = [], holdMs = 2000, loop = false, paused = false, className, xstyle, ref, ...rest }: LineProps) {
  const [idx, setIdx] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const clear = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (paused || messages.length < 2) return;
    if (!loop && idx >= messages.length - 1) return;
    const id = setTimeout(() => {
      setPrev(idx);
      setIdx((idx + 1) % messages.length);
      clearTimeout(clear.current);
      clear.current = setTimeout(() => setPrev(null), 180);
    }, holdMs);
    return () => clearTimeout(id);
  }, [idx, holdMs, loop, paused, messages.length]);
  useEffect(() => () => clearTimeout(clear.current), []);

  const sx = stylex.props(styles.root, xstyle);
  return (
    <div {...rest} ref={ref} role="status" {...mergeSx(sx, className)}>
      {prev !== null && messages[prev] !== undefined && (
        <span key={`out-${prev}`} aria-hidden="true" {...stylex.props(styles.layer, styles.exit)}>
          {messages[prev]}
        </span>
      )}
      <span key={`in-${idx}`} {...stylex.props(styles.layer, prev !== null && styles.enter)}>
        <TextShimmer>{messages[idx]}</TextShimmer>
      </span>
    </div>
  );
}

const MAX_SOURCES = 3;

function Sources({ sources }: { sources: NonNullable<ThinkingStep['sources']> }) {
  const [all, setAll] = useState(false);
  const fmt = useFormatters();
  const shown = all ? sources : sources.slice(0, MAX_SOURCES);
  const more = sources.length - shown.length;
  return (
    <span {...stylex.props(styles.srcRow)}>
      {shown.map((s, i) =>
        s.href ? (
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer" title={s.href} style={{ animationDelay: `${(i % 6) * 50}ms` }} {...stylex.props(styles.src, m3.pop)}>
            {s.icon && <span aria-hidden="true" {...stylex.props(styles.srcIcon)}>{s.icon}</span>}
            {s.label}
          </a>
        ) : (
          <span key={s.label} style={{ animationDelay: `${(i % 6) * 50}ms` }} {...stylex.props(styles.src, m3.pop)}>{s.icon && <span aria-hidden="true" {...stylex.props(styles.srcIcon)}>{s.icon}</span>}{s.label}</span>
        ),
      )}
      {more > 0 && (
        <button type="button" onClick={() => setAll(true)} {...stylex.props(styles.src, styles.moreBtn, m3.press)}>
          +{fmt.number(more)} more
        </button>
      )}
    </span>
  );
}

function ThinkingPanel({
  steps = [],
  stepMs = 1300,
  doneLabel = 'Finished thinking',
  onDone,
  defaultCollapsed = false,
  variant = 'plain',
  className,
  xstyle,
  ref,
  ...rest
}: Omit<LineProps, 'messages' | 'holdMs' | 'loop' | 'paused'> & Pick<ThinkingStatesProps, 'steps' | 'stepMs' | 'doneLabel' | 'onDone' | 'defaultCollapsed' | 'variant'>) {
  const uid = useId();
  const [shown, setShown] = useState(1);
  const [secs, setSecs] = useState(0);
  const [open, setOpen] = useState(!defaultCollapsed);
  const start = useRef(0);
  const finished = shown > steps.length;
  const cb = useRef(onDone);
  useEffect(() => {
    cb.current = onDone;
  });
  useEffect(() => {
    start.current = Date.now();
  }, []);
  useEffect(() => {
    if (finished) return;
    const id = setTimeout(() => {
      setShown((n) => n + 1);
    }, stepMs);
    return () => clearTimeout(id);
  }, [shown, finished, stepMs]);
  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => setSecs(Math.round((Date.now() - start.current) / 1000)), 500);
    return () => clearInterval(id);
  }, [finished]);
  useEffect(() => {
    if (!finished) return;
    const s = Math.max(1, Math.round((Date.now() - start.current) / 1000));
    setSecs(s);
    cb.current?.(s);
  }, [finished]);

  const olRef = useRef<HTMLOListElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const prevH = useRef(0);
  const rows = Math.min(shown, steps.length) + (finished ? 1 : 0);
  // The timeline grows down to each new node: the line is sized to the last node, then scaleY plays from the old extent.
  useLayoutEffect(() => {
    const ol = olRef.current;
    const line = lineRef.current;
    if (!ol || !line) return;
    const items = ol.querySelectorAll<HTMLElement>(':scope > li');
    const last = items[items.length - 1];
    if (!last || items.length < 2) {
      line.style.height = '0px';
      prevH.current = 0;
      return;
    }
    const h = Math.max(0, last.offsetTop - 16 + 10);
    line.style.height = `${h}px`;
    if (prevH.current > 0 && h > prevH.current && !prefersReducedMotion() && typeof line.animate === 'function') {
      line.animate([{ transform: `scaleY(${prevH.current / h})` }, { transform: 'scaleY(1)' }], {
        duration: 300,
        easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
      });
    }
    prevH.current = h;
  }, [rows, open]);
  const visible = steps.slice(0, Math.min(shown, steps.length));
  const card = variant === 'card';
  const sx = stylex.props(styles.panelRoot, card && styles.card, xstyle);
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      <button type="button" aria-expanded={open} aria-controls={uid} onClick={() => setOpen((o) => !o)} {...stylex.props(styles.head, card && styles.cardHead, card && !open && styles.cardHeadClosed)}>
        {card && <LayoutGrid size={14} aria-hidden="true" {...stylex.props(styles.cardIcon)} />}
        <CrossFade as="span" contentKey={finished ? 'done' : 'live'} duration={220}>
          {finished ? (
            <span>{card ? <><span {...stylex.props(styles.cardTitle)}>Thought</span> {secs}s</> : <>Worked for {secs}s</>}</span>
          ) : card ? (
            <><TextShimmer>Thinking</TextShimmer> {secs}s</>
          ) : (
            <TextShimmer>{`Thinking · ${secs}s`}</TextShimmer>
          )}
        </CrossFade>
        {card && <span {...stylex.props(styles.spacer)} />}
        {card ? (
          <ChevronDown size={14} aria-hidden="true" {...stylex.props(styles.chev, open && styles.chevFlip)} />
        ) : (
          <ChevronRight size={14} aria-hidden="true" {...stylex.props(styles.chev, open && styles.chevOpen)} />
        )}
      </button>
      <AnimatedHeight isOpen={open} id={uid}>
        <ol ref={olRef} aria-live="polite" {...stylex.props(styles.steps, card && styles.cardBody)}>
          <span ref={lineRef} aria-hidden="true" {...stylex.props(styles.line)} />
          {visible.map((s, i) => {
            const active = !finished && i === visible.length - 1;
            return (
              <li key={i} {...stylex.props(styles.step)}>
                <span aria-hidden="true" {...stylex.props(styles.node, active && styles.nodeActive)} />
                <span {...stylex.props(styles.stepLabel)}>
                  {s.kind === 'search' && <Search size={13} aria-hidden="true" />}
                  {active ? <TextShimmer>{s.label}</TextShimmer> : s.label}
                </span>
                {s.sources && s.sources.length > 0 && <Sources sources={s.sources} />}
              </li>
            );
          })}
          {finished && (
            <li {...stylex.props(styles.step)}>
              <span aria-hidden="true" {...stylex.props(styles.node)} />
              <span {...stylex.props(styles.stepLabel)}>
                <Check size={14} aria-hidden="true" {...stylex.props(styles.doneIcon, m3.pop, m3.draw)} />
                {doneLabel}
              </span>
            </li>
          )}
        </ol>
      </AnimatedHeight>
    </div>
  );
}

/** Agent working indicator: a rotating status line (`messages`) or, with `steps`, a collapsible panel with a live timer, searched sources and steps that appear one by one. */
export function ThinkingStates(props: ThinkingStatesProps) {
  const { steps, stepMs, doneLabel, onDone, defaultCollapsed, variant, ...line } = props;
  if (steps) {
    const { messages: _m, holdMs: _h, loop: _l, paused: _p, ...panel } = line;
    void _m; void _h; void _l; void _p;
    return <ThinkingPanel {...panel} steps={steps} stepMs={stepMs} doneLabel={doneLabel} onDone={onDone} defaultCollapsed={defaultCollapsed} variant={variant} />;
  }
  return <ThinkingLine {...line} />;
}
