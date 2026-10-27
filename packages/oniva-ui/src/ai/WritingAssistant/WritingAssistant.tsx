import * as stylex from '@stylexjs/stylex';
import { ArrowUp, Mic, Sparkles, SquarePen } from 'lucide-react';
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type HTMLAttributes, type Ref } from 'react';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { IconButton } from '../../components/IconButton';
import { mergeSx } from '../../internal/sx';
import { useResponseStream } from '../ResponseStream';
import { TypingIndicator } from '../TypingIndicator';
import { m3 } from '../../internal/m3-motion';
import { CrossFade } from '../../motion/CrossFade';
import { Presence } from '../../motion/Presence';

const drift = stylex.keyframes({
  '0%': { transform: 'translate3d(-8%, 0, 0) scale(1)' },
  '50%': { transform: 'translate3d(8%, -6%, 0) scale(1.15)' },
  '100%': { transform: 'translate3d(-8%, 0, 0) scale(1)' },
});
const rise = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});
const breathe = stylex.keyframes({
  '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
  '50%': { opacity: 0, transform: 'scale(1.7)' },
});
const wave = stylex.keyframes({ '0%, 100%': { transform: 'scaleY(0.4)' }, '50%': { transform: 'scaleY(1)' } });

const styles = stylex.create({
  inl: { display: 'inline-flex' },
  root: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xxl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: 'none',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    height: 400,
    isolation: 'isolate',
    maxWidth: 380,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  glow: {
    animationDuration: '14s',
    animationIterationCount: { default: 'infinite', [media.reducedMotion]: 0 },
    animationName: drift,
    animationTimingFunction: 'ease-in-out',
    backgroundImage: `radial-gradient(60% 60% at 30% 70%, ${colors['--oniva-color-accent-soft']}, transparent 70%), radial-gradient(50% 50% at 75% 85%, ${colors['--oniva-color-accent-tint']}, transparent 70%)`,
    bottom: -40,
    height: '60%',
    insetInline: -40,
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: -1,
  },
  head: {
    alignItems: 'flex-start',
    borderBottomColor: colors['--oniva-color-border'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    display: 'flex',
    gap: 10,
    paddingBlock: 12,
    paddingInline: 16,
  },
  nameRow: { alignItems: 'center', color: colors['--oniva-color-text'], display: 'flex', gap: 6 },
  spark: { color: accent['--oniva-accent-solid'], flexShrink: 0 },
  titles: { flexGrow: 1, minWidth: 0 },
  name: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-medium'], margin: 0 },
  tagline: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], margin: 0 },
  scroll: { display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 10, minHeight: 0, overflowY: 'auto', paddingBlock: 4, paddingInline: 16 },
  welcome: {
    alignItems: 'flex-start',
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationName: { default: rise, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    justifyContent: 'center',
    flexGrow: 1,
  },
  greeting: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-16'], fontWeight: font['--oniva-font-weight-medium'], lineHeight: 1.25, margin: 0 },
  chips: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  chip: {
    appearance: 'none',
    backgroundColor: { default: colors['--oniva-color-surface-hover'], ':hover': colors['--oniva-color-surface-active'] },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-13'],
    paddingBlock: 7,
    paddingInline: 12,
  },
  msg: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationName: { default: rise, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    borderRadius: radius['--oniva-radius-lg'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: 1.5,
    maxWidth: '88%',
    overflowWrap: 'anywhere',
    paddingBlock: 8,
    paddingInline: 12,
    whiteSpace: 'pre-wrap',
  },
  user: { alignSelf: 'flex-end', backgroundColor: accent['--oniva-accent-solid'], color: colors['--oniva-color-accent-fg'] },
  bot: { alignSelf: 'flex-start', backgroundColor: colors['--oniva-color-surface-inset'], color: colors['--oniva-color-text'] },
  composer: {
    alignItems: 'flex-end',
    display: 'flex',
    gap: 4,
    paddingBlock: 12,
    paddingInline: 16,
  },
  field: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    flexGrow: 1,
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    lineHeight: '20px',
    maxHeight: 80,
    minHeight: 28,
    outlineStyle: 'none',
    overflowY: 'auto',
    padding: 4,
    resize: 'none',
    '::placeholder': { color: colors['--oniva-color-text-placeholder'] },
  },
  micOn: { backgroundColor: colors['--oniva-color-text'], color: colors['--oniva-color-bg'], position: 'relative' },
  ring: {
    animationDuration: '1600ms',
    animationIterationCount: { default: 'infinite', [media.reducedMotion]: 0 },
    animationName: breathe,
    borderColor: colors['--oniva-color-text'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    inset: 0,
    pointerEvents: 'none',
    position: 'absolute',
  },
  bars: { alignItems: 'center', display: 'inline-flex', gap: 2, height: 14 },
  bar: {
    animationDuration: '900ms',
    animationIterationCount: { default: 'infinite', [media.reducedMotion]: 0 },
    animationName: wave,
    animationTimingFunction: 'ease-in-out',
    backgroundColor: 'currentColor',
    borderRadius: radius['--oniva-radius-full'],
    height: '100%',
    width: 2,
  },
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

interface Msg {
  id: number;
  role: 'user' | 'assistant';
  text: string;
}

export interface WritingAssistantProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  name?: string;
  tagline?: string;
  greeting?: string;
  /** Chips on the welcome screen; each sends itself as a message. */
  suggestions?: string[];
  placeholder?: string;
  /** Produce the reply for a message. A sample writer is used by default. */
  respond?: (message: string) => string | Promise<string>;
  /** `auto` uses browser speech recognition when available; `simulate` always plays a sample take. */
  speech?: 'auto' | 'simulate';
  /** Sentence used for simulated dictation. */
  dictation?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

type Recognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

const sampleReply = (m: string) => `Here is a first pass for “${m.length > 48 ? `${m.slice(0, 48)}…` : m}”:\n\nThank you for the update. I reviewed the details and have a short proposal ready. Lmk if you want a warmer or more direct tone.`;

function Reply({ text }: { text: string }) {
  const { visible } = useResponseStream(text, { speed: 4, intervalMs: 30 });
  return <>{visible}</>;
}

/** A small AI writing helper card: welcome chips, streamed replies, auto-growing prompt field and live voice dictation. */
export function WritingAssistant({
  name = 'Quill',
  tagline = 'Your writing companion.',
  greeting = 'What should we write?',
  suggestions,
  placeholder = 'Ask anything…',
  respond = sampleReply,
  speech = 'auto',
  dictation = 'Draft a short thank-you note to the design team for shipping the new onboarding flow.',
  className,
  xstyle,
  ref,
  ...rest
}: WritingAssistantProps) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState('');
  const [pending, setPending] = useState(false);
  const [listening, setListening] = useState(false);
  const [live, setLive] = useState('');
  const area = useRef<HTMLTextAreaElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const transcript = useRef('');
  const stopListen = useRef<(() => void) | null>(null);
  const alive = useRef(true);
  useEffect(() => () => { alive.current = false; stopListen.current?.(); }, []);

  useLayoutEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 80)}px`;
  }, [draft]);
  useEffect(() => {
    end.current?.scrollIntoView?.({ block: 'end' });
  }, [messages, pending]);

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || pending) return;
    setMessages((m) => [...m, { id: ++idRef.current, role: 'user', text: t }]);
    setDraft('');
    setPending(true);
    const reply = await respond(t);
    if (!alive.current) return;
    setPending(false);
    setMessages((m) => [...m, { id: ++idRef.current, role: 'assistant', text: reply }]);
    setLive(`${name} replied`);
  };

  const finish = () => {
    setListening(false);
    stopListen.current = null;
    const said = transcript.current.trim();
    transcript.current = '';
    setDraft('');
    if (said) void send(said);
  };

  const toggleMic = () => {
    if (listening) {
      stopListen.current?.();
      finish();
      return;
    }
    transcript.current = '';
    setListening(true);
    setLive('Listening');
    const w = window as unknown as { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
    const Rec = speech === 'auto' ? (w.SpeechRecognition ?? w.webkitSpeechRecognition) : undefined;
    if (Rec) {
      const r = new Rec();
      r.continuous = true;
      r.interimResults = true;
      r.lang = document.documentElement.lang || navigator.language;
      r.onresult = (e) => {
        const text = Array.from(e.results).map((x) => x[0]?.transcript ?? '').join(' ');
        transcript.current = text;
        setDraft(text);
      };
      r.onend = () => finish();
      stopListen.current = () => {
        r.onend = null;
        r.stop();
      };
      r.start();
    } else {
      const words = dictation.split(' ');
      let i = 0;
      const id = setInterval(() => {
        i += 1;
        transcript.current = words.slice(0, i).join(' ');
        setDraft(transcript.current);
        if (i >= words.length) {
          clearInterval(id);
          setTimeout(() => { if (alive.current && stopListen.current) { stopListen.current(); finish(); } }, 500);
        }
      }, 140);
      stopListen.current = () => clearInterval(id);
    }
  };

  const sx = stylex.props(styles.root, xstyle);
  const fresh = messages.length === 0;
  return (
    <div {...rest} ref={ref} role="group" aria-label={name} {...mergeSx(sx, className)}>
      <div aria-hidden="true" {...stylex.props(styles.glow)} />
      <div {...stylex.props(styles.head)}>
        <div {...stylex.props(styles.titles)}>
          <div {...stylex.props(styles.nameRow)}>
            <Sparkles size={14} aria-hidden="true" {...stylex.props(styles.spark)} />
            <h3 {...stylex.props(styles.name)}>{name}</h3>
          </div>
          <p {...stylex.props(styles.tagline)}>{tagline}</p>
        </div>
        <Presence isPresent={!fresh} preset="scale" initial={false} xstyle={styles.inl}>
          <IconButton
            size="sm"
            variant="ghost"
            aria-label="New chat"
            onPress={() => {
              setMessages([]);
              setPending(false);
            }}
          >
            <SquarePen size={16} aria-hidden="true" />
          </IconButton>
        </Presence>
      </div>
      <div {...stylex.props(styles.scroll)}>
        {fresh ? (
          <div {...stylex.props(styles.welcome, m3.rise)}>
            <p {...stylex.props(styles.greeting)}>{greeting}</p>
            {suggestions && suggestions.length > 0 && (
              <div {...stylex.props(styles.chips)}>
                {suggestions.map((s, si) => (
                  <button key={s} type="button" onClick={() => void send(s)} style={{ '--oniva-i': si + 1 } as CSSProperties} {...stylex.props(styles.chip, m3.rise, m3.press)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <div key={m.id} {...stylex.props(styles.msg, m.role === 'user' ? styles.user : styles.bot, m3.rise)}>
                {m.role === 'assistant' && i === messages.length - 1 ? <Reply text={m.text} /> : m.text}
              </div>
            ))}
            <Presence isPresent={pending} preset="slide" initial={false} xstyle={[styles.msg, styles.bot]}>
              <TypingIndicator label={`${name} is writing`} />
            </Presence>
          </>
        )}
        <div ref={end} />
      </div>
      <form
        {...stylex.props(styles.composer)}
        onSubmit={(e) => {
          e.preventDefault();
          void send(draft);
        }}
      >
        <textarea
          ref={area}
          aria-label="Message"
          rows={1}
          value={draft}
          placeholder={listening ? 'Listening…' : placeholder}
          readOnly={listening}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              void send(draft);
            }
          }}
          {...stylex.props(styles.field)}
        />
        <IconButton
          size="sm"
          variant="ghost"
          aria-label={listening ? 'Stop dictation' : 'Start dictation'}
          aria-pressed={listening}
          onPress={toggleMic}
          xstyle={listening ? styles.micOn : undefined}
        >
          <CrossFade as="span" contentKey={listening ? 'on' : 'off'} duration={200}>
          {listening ? (
            <>
              <span aria-hidden="true" {...stylex.props(styles.ring)} />
              <span aria-hidden="true" {...stylex.props(styles.bars)}>
                {[0, 1, 2].map((i) => (
                  <span key={i} {...stylex.props(styles.bar)} style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </span>
            </>
          ) : (
            <Mic size={16} aria-hidden="true" />
          )}
          </CrossFade>
        </IconButton>
        <Presence isPresent={!!draft.trim() && !listening} preset="scale" initial={false} xstyle={styles.inl}>
          <IconButton size="sm" variant="primary" aria-label="Send message" type="submit" isDisabled={pending}>
            <ArrowUp size={16} aria-hidden="true" />
          </IconButton>
        </Presence>
      </form>
      <span role="status" aria-live="polite" {...stylex.props(styles.sr)}>
        {live}
      </span>
    </div>
  );
}
