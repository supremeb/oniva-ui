import * as stylex from '@stylexjs/stylex';
import { ArrowUp, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { Scene, loop, useScene, type IllustrationProps } from '../../internal/w7-scene';

/* Clean-room implementation from the public Glow Keyboard description (no third-party source). */

const drift = stylex.keyframes({
  '0%, 100%': { borderRadius: '0%', transform: 'translate(-3%, 0) rotate(0deg) scale(1)' },
  '50%': { borderRadius: '8%', transform: 'translate(3%, -4%) rotate(4deg) scale(1.1)' },
});
const driftWhite = stylex.keyframes({
  '0%, 100%': { borderRadius: '0%', transform: 'translate(4%, -2%) rotate(0deg) scale(1.05)' },
  '50%': { borderRadius: '10%', transform: 'translate(-4%, 3%) rotate(-5deg) scale(0.96)' },
});
const sentOut = stylex.keyframes({
  from: { opacity: 0.9, transform: 'translateY(0)', filter: 'blur(0)' },
  to: { opacity: 0, transform: 'translateY(-7cqw)', filter: 'blur(3px)' },
});
const sendPop = stylex.keyframes({
  '0%': { transform: 'scale(1)' },
  '35%': { transform: 'scale(0.86)' },
  '100%': { transform: 'scale(1)' },
});
const wave = stylex.keyframes({
  from: { opacity: 0.85, transform: 'translate(-50%, 0) scale(0.4)' },
  to: { opacity: 0, transform: 'translate(-50%, -16cqw) scale(1.4)' },
});
const flash = stylex.keyframes({
  from: { opacity: 0.9 },
  to: { opacity: 0 },
});

const styles = stylex.create({
  fill: {
    backgroundColor: colors['--oniva-color-bg'],
    borderRadius: radius['--oniva-radius-xxl'],
    cursor: 'text',
    inset: 0,
    overflow: 'hidden',
    position: 'absolute',
  },
  floor: {
    bottom: 0,
    height: '64%',
    left: 0,
    maskImage: 'linear-gradient(to top, black 35%, transparent)',
    overflow: 'hidden',
    position: 'absolute',
    right: 0,
  },
  layer: {
    animationDuration: '12s',
    animationName: { default: drift, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
    inset: '-10%',
    position: 'absolute',
  },
  colour: {
    animationDuration: '14s',
    backgroundImage: `radial-gradient(60% 70% at 25% 80%, ${accent['--oniva-accent-400']}, transparent), radial-gradient(55% 70% at 75% 85%, ${colors['--oniva-color-purple-fg']}, transparent), radial-gradient(50% 60% at 50% 100%, ${colors['--oniva-color-cyan-fg']}, transparent)`,
    opacity: 0.85,
  },
  white: {
    animationDuration: '19s',
    animationName: { default: driftWhite, [media.reducedMotion]: 'none' },
    backgroundImage: `radial-gradient(45% 55% at 60% 90%, ${colors['--oniva-color-on-solid']}, transparent)`,
    mixBlendMode: 'screen',
    opacity: 0.5,
  },
  wave: {
    animationDuration: '900ms',
    animationFillMode: 'both',
    animationName: { default: wave, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundImage: `radial-gradient(closest-side, ${accent['--oniva-accent-300']}, transparent)`,
    borderRadius: radius['--oniva-radius-full'],
    bottom: '4%',
    filter: 'blur(4px)',
    height: '14cqw',
    pointerEvents: 'none',
    position: 'absolute',
    width: '14cqw',
  },
  waveAt: (x: number) => ({ left: `${x}%` }),
  glowAt: (x: number) => ({ left: `${x}%` }),
  inputWrap: {
    left: '24%',
    position: 'absolute',
    right: '24%',
    top: '10%',
  },
  glow: {
    animationDuration: '500ms',
    animationFillMode: 'both',
    animationName: { default: flash, [media.reducedMotion]: 'none' },
    backgroundImage: `radial-gradient(closest-side, ${accent['--oniva-accent-400']}, transparent)`,
    filter: 'blur(10px)',
    height: '12cqw',
    pointerEvents: 'none',
    position: 'absolute',
    top: '-3cqw',
    width: '24cqw',
    transform: 'translateX(-50%)',
  },
  input: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderRadius: radius['--oniva-radius-xxl'],
    boxShadow: `${shadow['--oniva-shadow-md']}, 0 0 0 1px ${colors['--oniva-color-border']}`,
    boxSizing: 'border-box',
    display: 'flex',
    gap: '1.6cqw',
    height: '8cqw',
    padding: '0 1.2cqw 0 2.4cqw',
    position: 'relative',
  },
  field: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    fontFamily: font['--oniva-font-sans'],
    fontSize: '2.4cqw',
    minWidth: 0,
    outline: 'none',
    '::placeholder': { color: colors['--oniva-color-text-placeholder'] },
  },
  sent: {
    alignItems: 'center',
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'both',
    animationName: { default: sentOut, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    color: colors['--oniva-color-text'],
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: '2.4cqw',
    inset: 0,
    overflow: 'hidden',
    paddingInline: '6.6cqw 1.2cqw',
    pointerEvents: 'none',
    position: 'absolute',
    whiteSpace: 'nowrap',
  },
  sendPop: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationName: { default: sendPop, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  inputIcon: { color: colors['--oniva-color-accent-text'], flexShrink: 0, height: '3cqw', width: '3cqw' },
  send: {
    alignItems: 'center',
    backgroundImage: `linear-gradient(145deg, ${accent['--oniva-accent-500']}, ${accent['--oniva-accent-700']})`,
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-accent-fg'],
    display: 'inline-flex',
    flexShrink: 0,
    height: '5.6cqw',
    justifyContent: 'center',
    width: '5.6cqw',
  },
  board: {
    backgroundColor: `color-mix(in srgb, ${colors['--oniva-color-surface-tertiary']} 70%, transparent)`,
    borderRadius: radius['--oniva-radius-xl'],
    bottom: '5%',
    boxShadow: `inset 0 0 0 1px ${colors['--oniva-color-border']}`,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.7cqw',
    left: '13%',
    padding: '1.1cqw',
    position: 'absolute',
    right: '13%',
  },
  row: { display: 'flex', gap: '0.7cqw', justifyContent: 'center' },
  key: {
    alignItems: 'center',
    backdropFilter: 'blur(6px)',
    backgroundColor: `color-mix(in srgb, ${colors['--oniva-color-surface']} 62%, transparent)`,
    borderRadius: radius['--oniva-radius-md'],
    boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${colors['--oniva-color-border-hover']} 70%, transparent), 0 0.5cqw 0 color-mix(in srgb, ${colors['--oniva-color-border-hover']} 60%, transparent)`,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    fontFamily: font['--oniva-font-sans'],
    fontSize: '1.7cqw',
    fontWeight: 500,
    height: '4.6cqw',
    justifyContent: 'center',
    minWidth: 0,
    transform: 'translateY(0)',
    // Springy release; the press itself is near-instant (see `down`)
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: 'transform, background-color, color',
    transitionTimingFunction: motion['--oniva-motion-ease-spring'],
  },
  down: {
    transitionDuration: motion['--oniva-motion-dur-instant'],
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundColor: `color-mix(in srgb, ${accent['--oniva-accent-300']} 55%, transparent)`,
    color: colors['--oniva-color-text'],
    transform: 'translateY(0.5cqw)',
  },
  small: { fontSize: '1.1cqw', height: '2.7cqw' },
  wide: (f: number) => ({ flexGrow: f }),
});

export interface GlowKeyboardProps extends IllustrationProps {
  /** Prompts the demo types one after another; each is sent with Enter. */
  prompts?: string[];
  placeholder?: string;
  /** Called when a prompt is sent with Enter, by the demo or by the user. */
  onSubmit?: (text: string) => void;
}

type KeyDef = { id: string; cap: string; grow?: number; small?: boolean };
const letters = (chars: string): KeyDef[] => chars.split('').map((c) => ({ id: c, cap: c.toUpperCase() }));
const ROWS: KeyDef[][] = [
  [
    { id: 'Escape', cap: 'esc', grow: 1.4, small: true },
    ...Array.from({ length: 12 }, (_, i) => ({ id: `F${i + 1}`, cap: `F${i + 1}`, small: true })),
  ],
  [...'1234567890'.split('').map((c) => ({ id: c, cap: c })), { id: 'Backspace', cap: '⌫', grow: 1.7 }],
  [{ id: 'Tab', cap: '⇥', grow: 1.5 }, ...letters('qwertyuiop')],
  [{ id: 'CapsLock', cap: '⇪', grow: 1.8 }, ...letters('asdfghjkl'), { id: 'Enter', cap: '↵', grow: 2 }],
  [{ id: 'Shift', cap: '⇧', grow: 2.3 }, ...letters('zxcvbnm'), { id: 'Shift2', cap: '⇧', grow: 2.3 }],
  [
    { id: 'Fn', cap: 'fn', grow: 1.2 },
    { id: 'Control', cap: '⌃', grow: 1.2 },
    { id: 'Alt', cap: '⌥', grow: 1.2 },
    { id: 'Meta', cap: '⌘', grow: 1.5 },
    { id: ' ', cap: '', grow: 6 },
    { id: 'Meta2', cap: '⌘', grow: 1.5 },
    { id: 'Alt2', cap: '⌥', grow: 1.2 },
  ],
];

const DEFAULT_PROMPTS = [
  'Plan a weekend hike near Asheville',
  'Which trails are open after rain?',
  'Pack list for a two-night trip',
];

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

/**
 * An AI chat input that types itself over a glass keyboard. Every key press sinks the key, sends a wave up the gradient
 * floor and flashes the input glow. Typing yourself works too and stops the demo. Runs only while on screen and does not type under reduced motion.
 */
export function GlowKeyboard({
  prompts = DEFAULT_PROMPTS,
  placeholder = 'Ask AI anything…',
  onSubmit,
  label,
  ...rest
}: GlowKeyboardProps) {
  return (
    <Scene ratio="43 / 25" role="group" label={label ?? 'AI chat input above a glass keyboard'} clip {...rest}>
      <Board prompts={prompts} placeholder={placeholder} onSubmit={onSubmit} />
    </Scene>
  );
}

type Wave = { id: number; x: number };

function Board({
  prompts,
  placeholder,
  onSubmit,
}: {
  prompts: string[];
  placeholder: string;
  onSubmit?: (text: string) => void;
}) {
  const { live, reduced } = useScene();
  const [text, setText] = useState('');
  const [down, setDown] = useState<string[]>([]);
  const [waves, setWaves] = useState<Wave[]>([]);
  const [flashAt, setFlashAt] = useState<{ id: number; x: number } | null>(null);
  const [userTyped, setUserTyped] = useState(false);
  const [sent, setSent] = useState<{ id: number; text: string } | null>(null);
  const [sendId, setSendId] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const keys = useRef<Record<string, HTMLElement | null>>({});
  const seq = useRef(0);
  const submit = useRef(onSubmit);
  submit.current = onSubmit;

  const press = useCallback((id: string) => {
    const root = board.current;
    const el = keys.current[id];
    if (root && el) {
      const rr = (root.parentElement ?? root).getBoundingClientRect();
      const kr = el.getBoundingClientRect();
      const x = ((kr.left + kr.width / 2 - rr.left) / rr.width) * 100;
      const n = ++seq.current;
      setWaves((w) => [...w.slice(-8), { id: n, x }]);
      setFlashAt({ id: n, x });
      window.setTimeout(() => setWaves((w) => w.filter((v) => v.id !== n)), 1000);
    }
    setDown((d) => [...d, id]);
    window.setTimeout(() => setDown((d) => d.filter((v, i) => !(v === id && i === d.indexOf(id)))), 110);
  }, []);

  // the demo types on its own
  useEffect(() => {
    if (!live || reduced || userTyped || !prompts.length) return;
    let dead = false;
    (async () => {
      let p = 0;
      while (!dead) {
        const prompt = prompts[p % prompts.length]!;
        let value = '';
        await sleep(700);
        let typoDone = false;
        for (let i = 0; i < prompt.length && !dead; i++) {
          const ch = prompt[i]!;
          const upper = ch !== ch.toLowerCase();
          if (upper) {
            // Shift is held down through the capital letter
            setDown((d) => [...d, 'Shift']);
            press('Shift');
            await sleep(110);
          }
          if (!typoDone && i === Math.floor(prompt.length / 2) && /[a-z]/.test(ch)) {
            typoDone = true;
            const wrong = 'qwertyuiopasdfghjklzxcvbnm'[(ch.charCodeAt(0) * 7) % 26]!;
            press(wrong);
            value += wrong;
            setText(value);
            await sleep(240);
            press('Backspace');
            value = value.slice(0, -1);
            setText(value);
            await sleep(140);
          }
          const id = ch === ' ' ? ' ' : ch.toLowerCase();
          press(id);
          value += ch;
          setText(value);
          if (upper) {
            await sleep(60);
            setDown((d) => d.filter((v) => v !== 'Shift'));
          }
          await sleep(ch === ' ' ? 150 : 55 + Math.random() * 110);
        }
        if (dead) return;
        await sleep(420);
        press('Enter');
        submit.current?.(prompt);
        setSent({ id: ++seq.current, text: prompt });
        setSendId((v) => v + 1);
        setText('');
        await sleep(1400);
        p += 1;
      }
    })();
    return () => {
      dead = true;
    };
  }, [live, reduced, userTyped, prompts, press]);

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    setUserTyped(true);
    const id = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (keys.current[id]) press(id);
    if (e.key === 'Enter' && text.trim()) {
      submit.current?.(text);
      setSent({ id: ++seq.current, text });
      setSendId((v) => v + 1);
      setText('');
    }
  };

  return (
    <div onPointerDown={(e) => { if (e.target !== inputRef.current) { e.preventDefault(); inputRef.current?.focus(); } }} {...stylex.props(styles.fill)}>
      <div aria-hidden="true" {...stylex.props(styles.floor)}>
        <span {...stylex.props(styles.layer, styles.colour, loop.run)} />
        <span {...stylex.props(styles.layer, styles.white, loop.run, loop.delay(-4))} />
        {waves.map((w) => (
          <span key={w.id} {...stylex.props(styles.wave, styles.waveAt(w.x), loop.once)} />
        ))}
      </div>
      <div {...stylex.props(styles.inputWrap)}>
        <div {...stylex.props(styles.input)}>
          {flashAt && <span key={flashAt.id} aria-hidden="true" {...stylex.props(styles.glow, styles.glowAt(flashAt.x), loop.once)} />}
          <Sparkles {...stylex.props(styles.inputIcon)} />
          {sent && (
            <span key={sent.id} aria-hidden="true" {...stylex.props(styles.sent)}>
              {sent.text}
            </span>
          )}
          <input
            ref={inputRef}
            onFocus={() => setUserTyped(true)}
            aria-label="Chat message"
            placeholder={placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKey}
            {...stylex.props(styles.field)}
          />
          <span key={sendId} aria-hidden="true" {...stylex.props(styles.send, sendId > 0 && styles.sendPop)}>
            <ArrowUp size={16} />
          </span>
        </div>
      </div>
      <div ref={board} aria-hidden="true" {...stylex.props(styles.board)}>
        {ROWS.map((row, r) => (
          <div key={r} {...stylex.props(styles.row)}>
            {row.map((k) => (
              <span
                key={k.id}
                ref={(el) => {
                  keys.current[k.id] = el;
                }}
                {...stylex.props(styles.key, k.grow ? styles.wide(k.grow) : null, k.small && styles.small, down.includes(k.id) && styles.down)}
              >
                {k.cap}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
