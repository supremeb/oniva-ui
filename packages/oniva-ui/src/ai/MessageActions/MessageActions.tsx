import * as stylex from '@stylexjs/stylex';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  GitBranch,
  RotateCcw,
  Share2,
  ThumbsDown,
  ThumbsUp,
  Volume2,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState, type HTMLAttributes, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { IconButton } from '../../components/IconButton';
import { Button } from '../../components/Button';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { CrossFade } from '../../motion/CrossFade';
import { Presence } from '../../motion/Presence';
import { IconSwap, useCopy } from '../../internal/n1-ai';
import { mergeSx } from '../../internal/sx';

const spin = stylex.keyframes({ from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } });
const pop = stylex.keyframes({ '0%': { transform: 'scale(1)' }, '45%': { transform: 'scale(1.3)' }, '100%': { transform: 'scale(1)' } });
const bounce = stylex.keyframes({ '0%, 100%': { transform: 'scaleY(0.35)' }, '50%': { transform: 'scaleY(1)' } });

const styles = stylex.create({
  wrap: { display: 'inline-flex', flexDirection: 'column', gap: 6, maxWidth: '100%' },
  root: {
    alignItems: 'center',
    display: 'inline-flex',
    gap: 2,
    opacity: {
      default: 1,
      [media.hover]: { default: 0.55, ':hover': 1, ':focus-within': 1 },
    },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  loud: { opacity: 1 },
  active: { color: colors['--oniva-color-accent-soft-fg'] },
  spin: {
    animationDuration: '600ms',
    animationName: { default: spin, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'inline-flex',
  },
  spinLoop: { animationIterationCount: 'infinite', animationTimingFunction: 'linear' },
  pop: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationName: { default: pop, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-spring'],
    display: 'inline-flex',
  },
  switcher: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
    gap: 0,
  },
  count: { minWidth: 30, textAlign: 'center' },
  inl: { display: 'inline-flex' },
  thanks: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], marginInlineStart: 4 },
  eq: { alignItems: 'center', display: 'inline-flex', gap: 2, height: 14 },
  bar: {
    animationDuration: '700ms',
    animationIterationCount: 'infinite',
    animationName: { default: bounce, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
    backgroundColor: 'currentColor',
    borderRadius: radius['--oniva-radius-full'],
    height: '100%',
    transformOrigin: 'center',
    width: 2,
  },
  feedback: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    paddingBlock: 2,
  },
  chip: {
    appearance: 'none',
    backgroundColor: {
      default: colors['--oniva-color-surface-inner'],
      ':hover': colors['--oniva-color-surface-hover'],
      ':is([aria-pressed="true"])': colors['--oniva-color-accent-soft'],
    },
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: {
      default: colors['--oniva-color-text-muted'],
      ':is([aria-pressed="true"])': colors['--oniva-color-accent-soft-fg'],
    },
    cursor: 'pointer',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-12'],
    transform: { default: 'none', ':active': `scale(${motion['--oniva-motion-press-scale']})` },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, color, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    paddingBlock: 3,
    paddingInline: 10,
  },
  other: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text'],
    flexGrow: 1,
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-12'],
    minWidth: 120,
    paddingBlock: 4,
    paddingInline: 8,
  },
  panel: {
    borderBlockStartColor: colors['--oniva-color-border'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    gap: 8,
    paddingBlockStart: 10,
  },
  panelHead: { alignItems: 'center', display: 'flex', justifyContent: 'space-between', width: '100%' },
  wrapPanel: { display: 'flex', maxWidth: '100%', width: '100%' },
  ask: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-medium'] },
  sr: {
    borderWidth: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
  },
});

export type MessageFeedback = 'like' | 'dislike' | null;

export interface MessageActionsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children' | 'onCopy'> {
  /** Plain text copied by the copy action. */
  text: string;
  onRegenerate?: () => void;
  onShare?: () => void;
  onBranch?: () => void;
  /** Controlled feedback value; uncontrolled when omitted. */
  feedback?: MessageFeedback;
  /** Called with the vote right away and, for a dislike, once more with the picked reason. */
  onFeedback?: (value: MessageFeedback, reason?: string) => void;
  /** Show like / dislike buttons. Default true. */
  showFeedback?: boolean;
  /** Quick reasons offered after a dislike. Pass `[]` to skip the reason row. */
  reasons?: string[];
  /** Total number of versions, or the versions themselves. From two on a "‹ 2 / 3 ›" switcher unfolds. */
  versions?: number | string[];
  /** Controlled version (0-based). */
  version?: number;
  onVersionChange?: (index: number) => void;
  /** Keeps the regenerate arrow spinning while a new version is written. */
  isRegenerating?: boolean;
  /** `panel` titles the reason row ("What went wrong?"), adds a close button and turns Send into a "Thanks!" confirmation. */
  variant?: 'default' | 'panel';
  /** Start with this vote picked (uncontrolled). */
  defaultFeedback?: MessageFeedback;
  /** Start with the reason row open (needs `defaultFeedback="dislike"`). */
  defaultReasonOpen?: boolean;
  /** Shows a read-aloud button. Called with true on start and false on stop. */
  onSpeak?: (playing: boolean) => void;
  /** Controlled read-aloud state. */
  isSpeaking?: boolean;
  onCopy?: (text: string) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const DEFAULT_REASONS = ['Not accurate', 'Too long', "Didn't follow instructions", 'Other'];

/** Action row under an assistant message: copy, regenerate with version switcher, thumbs with reasons, read aloud, share, branch. */
export function MessageActions({
  text,
  onRegenerate,
  onShare,
  onBranch,
  feedback,
  onFeedback,
  showFeedback = true,
  reasons = DEFAULT_REASONS,
  versions = 1,
  version,
  onVersionChange,
  isRegenerating = false,
  variant = 'default',
  defaultFeedback = null,
  defaultReasonOpen = false,
  onSpeak,
  isSpeaking,
  onCopy,
  className,
  xstyle,
  ref,
  ...rest
}: MessageActionsProps) {
  const { copied, copy } = useCopy(text);
  const [inner, setInner] = useState<MessageFeedback>(defaultFeedback);
  const value = feedback === undefined ? inner : feedback;
  const [reasonOpen, setReasonOpen] = useState(defaultReasonOpen);
  const [reason, setReason] = useState<string | null>(defaultReasonOpen ? 'Too long' : null);
  const [sent, setSent] = useState(false);
  const [other, setOther] = useState('');
  const [thanks, setThanks] = useState(false);
  const [spins, setSpins] = useState(0);
  const [live, setLive] = useState('');
  useEffect(() => {
    if (!thanks) return;
    const id = setTimeout(() => setThanks(false), 2200);
    return () => clearTimeout(id);
  }, [thanks]);
  const dislikeRef = useRef<HTMLButtonElement>(null);

  const count = Array.isArray(versions) ? versions.length : versions;
  const [innerV, setInnerV] = useState(Math.max(count - 1, 0));
  const prevCount = useRef(count);
  useEffect(() => {
    if (count > prevCount.current && version === undefined) setInnerV(count - 1);
    prevCount.current = count;
  }, [count, version]);
  const current = Math.min(version ?? innerV, Math.max(count - 1, 0));
  const goto = (i: number) => {
    const next = Math.min(Math.max(i, 0), count - 1);
    setInnerV(next);
    onVersionChange?.(next);
    setLive(`Version ${next + 1} of ${count}`);
  };

  const [innerSpeak, setInnerSpeak] = useState(false);
  const speaking = isSpeaking ?? innerSpeak;
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const toggleSpeak = () => {
    const next = !speaking;
    if (isSpeaking === undefined) {
      setInnerSpeak(next);
      clearTimeout(timer.current);
      if (next) {
        timer.current = setTimeout(() => {
          setInnerSpeak(false);
          onSpeak?.(false);
        }, Math.max(2600, text.length * 55));
      }
    }
    onSpeak?.(next);
    setLive(next ? 'Reading aloud' : '');
  };

  const vote = (v: 'like' | 'dislike') => {
    const next = value === v ? null : v;
    setInner(next);
    setThanks(false);
    setSent(false);
    setReason(null);
    onFeedback?.(next);
    setReasonOpen(next === 'dislike' && reasons.length > 0);
  };
  const send = () => {
    const picked = reason === 'Other' || (reason && !reasons.includes(reason)) ? other.trim() || reason : reason;
    if (picked) onFeedback?.('dislike', picked);
    setLive('Thanks for the feedback');
    if (variant === 'panel') {
      setSent(true);
      setTimeout(() => {
        setReasonOpen(false);
        setSent(false);
        setThanks(true);
        dislikeRef.current?.focus();
      }, 1200);
      return;
    }
    setReasonOpen(false);
    setThanks(true);
    dislikeRef.current?.focus();
  };

  const sx = stylex.props(styles.wrap, variant === 'panel' && styles.wrapPanel, xstyle);
  const showSwitcher = count > 1 && !!onRegenerate;
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      <div
        role="toolbar"
        aria-label="Message actions"
        {...stylex.props(styles.root, (reasonOpen || isRegenerating || speaking) && styles.loud)}
      >
        <IconButton
          size="xs"
          variant="ghost"
          aria-label={copied ? 'Copied' : 'Copy'}
          onPress={() => {
            copy();
            onCopy?.(text);
            setLive('Copied');
          }}
        >
          <IconSwap on={copied} a={<Copy size={14} />} b={<Check size={14} />} />
        </IconButton>
        {onRegenerate && (
          <IconButton
            size="xs"
            variant="ghost"
            aria-label="Regenerate response"
            onPress={() => {
              setSpins((n) => n + 1);
              onRegenerate();
            }}
          >
            <span
              key={spins}
              aria-hidden="true"
              {...stylex.props(spins > 0 && styles.spin, isRegenerating && styles.spin, isRegenerating && styles.spinLoop)}
            >
              <RotateCcw size={14} />
            </span>
          </IconButton>
        )}
        <Presence isPresent={showSwitcher} preset="scale" initial={false} xstyle={styles.inl}>
          <span role="group" aria-label="Response versions" {...stylex.props(styles.switcher)}>
            <IconButton size="xs" variant="ghost" aria-label="Previous version" isDisabled={current <= 0} onPress={() => goto(current - 1)}>
              <ChevronLeft size={14} />
            </IconButton>
            <span aria-label={`Version ${current + 1} of ${count}`} role="img" {...stylex.props(styles.count)}>
              <AnimatedNumber aria-hidden="true" value={current + 1} /> / {count}
            </span>
            <IconButton size="xs" variant="ghost" aria-label="Next version" isDisabled={current >= count - 1} onPress={() => goto(current + 1)}>
              <ChevronRight size={14} />
            </IconButton>
          </span>
        </Presence>
        {showFeedback && (
          <>
            <IconButton
              size="xs"
              variant="ghost"
              aria-label="Mark response as good"
              aria-pressed={value === 'like'}
              onPress={() => vote('like')}
              xstyle={value === 'like' ? styles.active : undefined}
            >
              <span key={value === 'like' ? 'on' : 'off'} {...stylex.props(value === 'like' && styles.pop)}>
                <ThumbsUp size={14} fill={value === 'like' ? 'currentColor' : 'none'} />
              </span>
            </IconButton>
            <IconButton
              ref={dislikeRef}
              size="xs"
              variant="ghost"
              aria-label="Mark response as bad"
              aria-pressed={value === 'dislike'}
              aria-expanded={reasons.length > 0 ? reasonOpen : undefined}
              onPress={() => vote('dislike')}
              xstyle={value === 'dislike' ? styles.active : undefined}
            >
              <span key={value === 'dislike' ? 'on' : 'off'} {...stylex.props(value === 'dislike' && styles.pop)}>
                <ThumbsDown size={14} fill={value === 'dislike' ? 'currentColor' : 'none'} />
              </span>
            </IconButton>
          </>
        )}
        <Presence isPresent={thanks && !reasonOpen} preset="blur" initial={false} xstyle={styles.inl}>
          <span aria-hidden="true" {...stylex.props(styles.thanks)}>Thanks</span>
        </Presence>
        {onSpeak && (
          <IconButton
            size="xs"
            variant="ghost"
            aria-label={speaking ? 'Stop reading aloud' : 'Read aloud'}
            aria-pressed={speaking}
            onPress={toggleSpeak}
            xstyle={speaking ? styles.active : undefined}
          >
            <CrossFade as="span" contentKey={speaking ? 'on' : 'off'} duration={200}>
              {speaking ? (
                <span aria-hidden="true" {...stylex.props(styles.eq)}>
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} {...stylex.props(styles.bar)} style={{ animationDelay: `${i * 120}ms` }} />
                  ))}
                </span>
              ) : (
                <Volume2 size={14} />
              )}
            </CrossFade>
          </IconButton>
        )}
        {onShare && (
          <IconButton size="xs" variant="ghost" aria-label="Share" onPress={onShare}>
            <Share2 size={14} />
          </IconButton>
        )}
        {onBranch && (
          <IconButton size="xs" variant="ghost" aria-label="Branch from here" onPress={onBranch}>
            <GitBranch size={14} />
          </IconButton>
        )}
      </div>
      {showFeedback && reasons.length > 0 && (
        <AnimatedHeight isOpen={reasonOpen}>
          <div
            role="group"
            aria-label="Why was this response not helpful?"
            inert={!reasonOpen}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setReasonOpen(false);
                dislikeRef.current?.focus();
              }
            }}
            {...stylex.props(styles.feedback, variant === 'panel' && styles.panel)}
          >
            {variant === 'panel' && (
              <div {...stylex.props(styles.panelHead)} style={{ flexBasis: '100%' }}>
                <span {...stylex.props(styles.ask)}>What went wrong?</span>
                <IconButton size="xs" variant="ghost" aria-label="Close feedback" onPress={() => { setReasonOpen(false); dislikeRef.current?.focus(); }}>
                  <X size={14} />
                </IconButton>
              </div>
            )}
            {reasons.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={reason === r}
                onClick={() => setReason(reason === r ? null : r)}
                {...stylex.props(styles.chip)}
              >
                {r}
              </button>
            ))}
            {reason === 'Other' && (
              <input
                aria-label="Tell us more"
                placeholder="Tell us more"
                value={other}
                onChange={(e) => setOther(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') send();
                }}
                {...stylex.props(styles.other)}
              />
            )}
            <Button size="sm" variant={sent ? 'secondary' : 'secondary'} isDisabled={!reason || sent} onPress={send} startIcon={sent ? <Check size={14} aria-hidden="true" /> : undefined} xstyle={sent ? styles.active : undefined}>
              {sent ? 'Thanks!' : 'Send'}
            </Button>
          </div>
        </AnimatedHeight>
      )}
      <span role="status" aria-live="polite" {...stylex.props(styles.sr)}>
        {live}
      </span>
    </div>
  );
}
