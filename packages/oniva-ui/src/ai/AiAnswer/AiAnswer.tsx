import * as stylex from '@stylexjs/stylex';
import { ChevronRight, Sparkles, Square } from 'lucide-react';
import { Fragment, useEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { Button } from '../../components/Button';
import { aiStyles } from '../../internal/ai-styles';
import { useFormatters } from '../../internal/format';
import { mergeSx } from '../../internal/sx';
import { parseAnswer, toPlain, trimPartial, type Inline } from '../../internal/w3-answer-text';
import { m3 } from '../../internal/m3-motion';
import { CrossFade } from '../../motion/CrossFade';
import { Presence } from '../../motion/Presence';
import { InlineCitation } from '../InlineCitation';
import { MessageActions, type MessageFeedback } from '../MessageActions';
import { useResponseStream } from '../ResponseStream';

/** Words mount one by one while streaming, each fading in out of a light blur. Already-shown words keep their keys, so only new ones animate. */
function Words({ text, animate }: { text: string; animate: boolean }) {
  if (!animate) return <>{text}</>;
  return (
    <>
      {text.split(/(\s+)/).map((w, i) =>
        w === '' ? null : /^\s+$/.test(w) ? (
          <Fragment key={i}>{w}</Fragment>
        ) : (
          <span key={i} {...stylex.props(m3.word)}>{w}</span>
        ),
      )}
    </>
  );
}

const blink = stylex.keyframes({ '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.25 } });
const cardIn = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(6px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

const styles = stylex.create({
  root: {
    boxSizing: 'border-box',
    containerType: 'inline-size',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    gap: 0,
    maxWidth: 640,
    overflow: 'hidden',
    padding: 0,
    width: '100%',
  },
  inner: { display: 'flex', flexDirection: 'column', gap: 16, padding: 20 },
  label: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    fontSize: font['--oniva-font-size-13'],
    gap: 6,
  },
  labelIcon: { color: colors['--oniva-color-accent-text'], flexShrink: 0 },
  footer: {
    alignItems: 'center',
    borderBlockStartColor: colors['--oniva-color-border'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
    padding: '8px 12px',
  },
  meta: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
    paddingInlineEnd: 4,
  },
  related: { display: 'flex', flexDirection: 'column', listStyle: 'none', margin: 0, padding: 0 },
  relatedRow: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderStyle: 'none',
    borderTopColor: colors['--oniva-color-separator'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    color: { default: colors['--oniva-color-text'], ':hover': { default: null, [media.hover]: colors['--oniva-color-accent-text'] } },
    cursor: 'pointer',
    display: 'flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-14'],
    gap: 8,
    justifyContent: 'space-between',
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: -2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    paddingBlock: 10,
    paddingInline: 0,
    textAlign: 'start',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '100%',
  },
  relatedChevron: { color: colors['--oniva-color-icon-muted'], flexShrink: 0 },
  sr: {
    borderWidth: 0,
    clipPath: 'inset(50%)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
  },
  question: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-16'],
    fontWeight: font['--oniva-font-weight-semibold'],
    margin: 0,
  },
  cards: {
    display: 'flex',
    gap: 8,
    margin: 0,
    overflowX: 'auto',
    padding: 0,
    scrollbarWidth: 'none',
    scrollSnapType: 'x mandatory',
    listStyle: 'none',
  },
  card: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationFillMode: 'both',
    animationName: { default: cardIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundColor: {
      default: colors['--oniva-color-surface-inner'],
      ':is([data-active])': colors['--oniva-color-accent-soft'],
    },
    borderColor: {
      default: colors['--oniva-color-border'],
      ':is([data-active])': colors['--oniva-color-accent-text'],
    },
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    gap: 6,
    minWidth: 0,
    padding: 12,
    scrollSnapAlign: 'start',
    textDecoration: 'none',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, border-color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: 156,
  },
  cardHead: { alignItems: 'center', display: 'flex', gap: 6, justifyContent: 'space-between' },
  cardName: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
  },
  cardTitle: {
    color: colors['--oniva-color-text'],
    display: '-webkit-box',
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: 1.35,
    overflow: 'hidden',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
  },
  body: {
    color: colors['--oniva-color-text'],
    display: 'flex',
    flexDirection: 'column',
    fontSize: font['--oniva-font-size-14'],
    gap: 10,
    lineHeight: 1.6,
  },
  p: { margin: 0 },
  ul: { margin: 0, paddingInlineStart: 20 },
  cite: { display: 'inline-block', marginInline: 2, verticalAlign: 'super' },
  dot: {
    animationDuration: '1000ms',
    animationIterationCount: { default: 'infinite', [media.reducedMotion]: 0 },
    animationName: blink,
    backgroundColor: colors['--oniva-color-accent-text'],
    borderRadius: radius['--oniva-radius-full'],
    display: 'inline-block',
    height: 8,
    marginInlineStart: 4,
    verticalAlign: 'middle',
    width: 8,
  },
  followLabel: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-11'],
    fontWeight: font['--oniva-font-weight-medium'],
    letterSpacing: '0.06em',
    margin: 0,
    marginBlockEnd: 6,
    textTransform: 'uppercase',
  },
});

export interface AnswerSource {
  title: string;
  /** Short label shown on the card, e.g. `Help center`. */
  name: string;
  url: string;
  snippet?: string;
  date?: string;
}

export interface AiAnswerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children' | 'onCopy'> {
  /** Shown as the title above the sources. */
  question?: string;
  sources?: AnswerSource[];
  /** Blank lines make paragraphs, "- " a list, **bold**, [1] or [1,3] cite sources (1-based). May grow while streaming. */
  answer: string;
  /** More text is still coming from the model. Keeps the cursor going once the reveal has caught up. */
  isStreaming?: boolean;
  /** Reveal the text word by word. Default true; reduced motion shows it at once. */
  animate?: boolean;
  /** Words revealed per second. Default 38. */
  speed?: number;
  followUps?: string[];
  onFollowUp?: (question: string) => void;
  onRegenerate?: () => void;
  onStop?: () => void;
  onFeedback?: (value: MessageFeedback, reason?: string) => void;
  feedbackReasons?: string[];
  onCopy?: (text: string) => void;
  /** Small text at the end of the footer row, e.g. `Answered in 4.6s`. */
  meta?: ReactNode;
  /** Label above the text. Default `Answer`; `false` hides it. */
  label?: ReactNode | false;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

function Body({
  answer,
  animate,
  speed,
  isStreaming,
  sources,
  active,
  setActive,
  onDone,
}: {
  answer: string;
  animate: boolean;
  speed: number;
  isStreaming: boolean;
  sources: AnswerSource[];
  active: number | null;
  setActive: (n: number | null) => void;
  onDone: (done: boolean) => void;
}) {
  const { visible, isComplete } = useResponseStream(answer, { speed: Math.max(1, Math.round(speed * 0.3)), intervalMs: 50, instant: !animate });
  const done = isComplete && !isStreaming;
  useEffect(() => onDone(done), [done, onDone]);
  const blocks = parseAnswer(done ? visible : trimPartial(visible));

  const renderInline = (inline: Inline[]) =>
    inline.map((t, i) => {
      if (t.kind === 'text') return <Fragment key={i}><Words text={t.text} animate={animate && !done} /></Fragment>;
      if (t.kind === 'bold') return <strong key={i}>{t.text}</strong>;
      return (
        <Fragment key={i}>
          {t.nums.map((n) => {
            const s = sources[n - 1];
            if (!s) return null;
            return (
              <span
                key={n}
                onMouseEnter={() => setActive(n)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(n)}
                onBlur={() => setActive(null)}
                {...stylex.props(styles.cite, animate && !done && m3.pop)}
              >
                <InlineCitation index={n} title={s.title} url={s.url} snippet={s.snippet} date={s.date} />
              </span>
            );
          })}
        </Fragment>
      );
    });

  return (
    <div aria-busy={!done} data-active-source={active ?? undefined} {...stylex.props(styles.body)}>
      {blocks.map((b, i) =>
        b.kind === 'p' ? (
          <p key={i} {...stylex.props(styles.p)}>
            {renderInline(b.inline)}
            {!done && i === blocks.length - 1 && <span aria-hidden="true" {...stylex.props(styles.dot)} />}
          </p>
        ) : (
          <ul key={i} {...stylex.props(styles.ul)}>
            {b.items.map((it, j) => (
              <li key={j}>
                {renderInline(it)}
                {!done && i === blocks.length - 1 && j === b.items.length - 1 && <span aria-hidden="true" {...stylex.props(styles.dot)} />}
              </li>
            ))}
          </ul>
        ),
      )}
      {blocks.length === 0 && !done && <span aria-hidden="true" {...stylex.props(styles.dot)} />}
    </div>
  );
}

/** A sourced assistant answer: source cards, streamed text with hoverable citation chips, and copy / regenerate / feedback / follow-ups once done. */
export function AiAnswer({
  question,
  sources = [],
  answer,
  isStreaming = false,
  animate = true,
  speed = 38,
  followUps,
  onFollowUp,
  onRegenerate,
  onStop,
  onFeedback,
  feedbackReasons,
  onCopy,
  meta,
  label = 'Answer',
  className,
  xstyle,
  ref,
  ...rest
}: AiAnswerProps) {
  const fmt = useFormatters();
  const [active, setActive] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  // A different (non-prefix) answer starts the reveal over.
  const prev = useRef(answer);
  const [run, setRun] = useState(0);
  if (prev.current !== answer && !answer.startsWith(prev.current)) setRun((r) => r + 1);
  prev.current = answer;

  const copyText = `${toPlain(answer)}${sources.length ? `\n\n${sources.map((s, i) => `${i + 1}. ${s.title} (${s.url})`).join('\n')}` : ''}`;
  const sx = stylex.props(aiStyles.panel, styles.root, xstyle);
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      <div {...stylex.props(styles.inner)}>
      {question && <h3 {...stylex.props(styles.question)}>{question}</h3>}
      {sources.length > 0 && (
        <>
          <CrossFade as="span" contentKey={done ? 'done' : 'reading'} duration={200} xstyle={styles.sr}>
            {done ? fmt.plural(sources.length, { one: '# source', other: '# sources' }) : `Reading ${fmt.plural(sources.length, { one: '# source', other: '# sources' })}`}
          </CrossFade>
          <ul aria-label="Sources" {...stylex.props(styles.cards)}>
            {sources.map((s, i) => (
              <li key={s.url} style={{ display: 'contents' }}>
                <a
                  href={/^https?:/i.test(s.url) ? s.url : undefined}
                  target="_blank"
                  rel="noreferrer"
                  data-active={active === i + 1 ? '' : undefined}
                  onMouseEnter={() => setActive(i + 1)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i + 1)}
                  onBlur={() => setActive(null)}
                  {...stylex.props(styles.card)}
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <span {...stylex.props(styles.cardHead)}>
                    <span {...stylex.props(styles.cardName)}>{s.name}</span>
                    <span aria-label={`Source ${i + 1}`} {...stylex.props(styles.cardName)}>{i + 1}</span>
                  </span>
                  <span {...stylex.props(styles.cardTitle)}>{s.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
      {label !== false && (
        <div {...stylex.props(styles.label)}>
          <Sparkles size={14} aria-hidden="true" {...stylex.props(styles.labelIcon)} />
          {label}
        </div>
      )}
      <Body
        key={run}
        answer={answer}
        animate={animate}
        speed={speed}
        isStreaming={isStreaming}
        sources={sources}
        active={active}
        setActive={setActive}
        onDone={setDone}
      />
      <Presence isPresent={!done && !!onStop} preset="slide" initial={false}>
        <div>
          <Button size="sm" variant="secondary" startIcon={<Square size={12} fill="currentColor" aria-hidden="true" />} onPress={onStop}>
            Stop
          </Button>
        </div>
      </Presence>
      {done && followUps && followUps.length > 0 && (
        <div {...stylex.props(m3.rise)} style={{ '--oniva-i': 2 } as CSSProperties}>
          <p {...stylex.props(styles.followLabel)}>Related</p>
          <ul {...stylex.props(styles.related)}>
            {followUps.map((q) => (
              <li key={q}>
                <button type="button" onClick={() => onFollowUp?.(q)} {...stylex.props(styles.relatedRow)}>
                  {q}
                  <ChevronRight size={14} aria-hidden="true" {...stylex.props(styles.relatedChevron)} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      </div>
      {done && (
        <div {...stylex.props(styles.footer, m3.rise)}>
          <MessageActions text={copyText} onRegenerate={onRegenerate} onFeedback={onFeedback} reasons={feedbackReasons} onCopy={onCopy} />
          {meta && <span {...stylex.props(styles.meta)}>{meta}</span>}
        </div>
      )}
    </div>
  );
}
