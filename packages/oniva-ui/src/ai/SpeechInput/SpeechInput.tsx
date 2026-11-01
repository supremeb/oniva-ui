import * as stylex from '@stylexjs/stylex';
import { MicIcon, SquareIcon } from '../../icons/IconSet';
import { useEffect, useRef, useState } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { focus } from '../../internal/focus';
import { mergeSx } from '../../internal/sx';
import { AudioWaveform } from '../AudioWaveform';

const ring = stylex.keyframes({
  '0%': { opacity: 0.45, transform: 'scale(1)' },
  '100%': { opacity: 0, transform: 'scale(1.9)' },
});

const styles = stylex.create({
  root: { alignItems: 'center', display: 'inline-flex', gap: 12, maxWidth: '100%' },
  wrap: { display: 'inline-flex', flexShrink: 0, position: 'relative' },
  btn: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border-control'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: 'none',
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'inline-flex',
    height: 40,
    justifyContent: 'center',
    position: 'relative',
    transform: { default: 'none', ':active': `scale(${motion['--oniva-motion-press-scale']})` },
    transitionDuration: motion['--oniva-motion-dur-press'],
    transitionProperty: 'transform, background-color, border-color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: 40,
    zIndex: 1,
  },
  btnIdle: {
    borderColor: { default: colors['--oniva-color-border-control'], ':hover': { default: null, [media.hover]: colors['--oniva-color-border-hover'] } },
  },
  btnRec: {
    backgroundColor: colors['--oniva-color-danger-solid'],
    borderColor: colors['--oniva-color-danger-solid'],
    color: colors['--oniva-color-on-solid'],
  },
  pulse: {
    animationDuration: '1.6s',
    animationIterationCount: 'infinite',
    animationName: { default: ring, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundColor: colors['--oniva-color-danger-solid'],
    borderRadius: radius['--oniva-radius-full'],
    inset: 0,
    pointerEvents: 'none',
    position: 'absolute',
  },
  time: {
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-13'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-medium'],
    flexShrink: 0,
    minWidth: 36,
  },
  hint: {
    color: colors['--oniva-color-text-muted'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: 1.35,
    minWidth: 0,
    overflowWrap: 'anywhere',
  },
  srOnly: {
    borderWidth: 0,
    clip: 'rect(0,0,0,0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
  },
});

export interface SpeechInputProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'onError'> {
  /** Called with the recorded clip (null in demo mode, where no microphone is used). */
  onRecorded?: (blob: Blob | null, seconds: number) => void;
  /** Never touch the microphone; simulate a recording. Used automatically when MediaRecorder is missing. */
  demo?: boolean;
  /** Called when mic permission is denied; the component falls back to demo mode. */
  onError?: (error: unknown) => void;
  idleLabel?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** Mic button: idle / recording with a pulse ring, elapsed time and live waveform. */
export function SpeechInput({
  onRecorded,
  demo = false,
  onError,
  idleLabel = 'Select to dictate',
  className,
  xstyle,
  ref,
  ...rest
}: SpeechInputProps) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const rec = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const secondsRef = useRef(0);
  const ctx = useRef<AudioContext | null>(null);
  const starting = useRef(false);

  useEffect(() => {
    if (!recording) return;
    const id = setInterval(() => {
      secondsRef.current += 1;
      setSeconds(secondsRef.current);
    }, 1000);
    return () => clearInterval(id);
  }, [recording]);

  useEffect(
    () => () => {
      stream.current?.getTracks().forEach((t) => t.stop());
      void ctx.current?.close().catch(() => undefined);
    },
    [],
  );

  const start = async () => {
    if (starting.current) return; // a second press while the permission prompt is open must not start another recorder
    starting.current = true;
    secondsRef.current = 0;
    setSeconds(0);
    const canRecord =
      !demo && typeof MediaRecorder !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;
    if (canRecord) {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.current = s;
        const mr = new MediaRecorder(s);
        chunks.current = [];
        mr.ondataavailable = (e) => chunks.current.push(e.data);
        mr.onstop = () =>
          onRecorded?.(new Blob(chunks.current, { type: mr.mimeType }), secondsRef.current);
        mr.start();
        rec.current = mr;
        const AC = window.AudioContext;
        if (AC) {
          const c = new AC();
          ctx.current = c;
          const a = c.createAnalyser();
          a.fftSize = 128;
          c.createMediaStreamSource(s).connect(a);
          setAnalyser(a);
        }
      } catch (e) {
        onError?.(e); // denied -> simulated recording
      }
    }
    starting.current = false;
    setRecording(true);
  };

  const stop = () => {
    setRecording(false);
    if (rec.current && rec.current.state !== 'inactive') rec.current.stop();
    else onRecorded?.(null, secondsRef.current);
    rec.current = null;
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    setAnalyser(null);
  };

  return (
    <div {...rest} ref={ref} {...mergeSx(stylex.props(aiStyles.num, styles.root, xstyle), className)}>
      <span {...stylex.props(styles.wrap)}>
        {recording && <span aria-hidden="true" {...stylex.props(styles.pulse)} />}
        <AriaButton
          aria-label={recording ? 'Stop recording' : 'Start recording'}
          onPress={() => (recording ? stop() : void start())}
          {...stylex.props(styles.btn, focus.ring, recording ? styles.btnRec : styles.btnIdle)}
        >
          {recording ? <SquareIcon size={14} fill="currentColor" /> : <MicIcon size={18} />}
        </AriaButton>
      </span>
      <span role="status" {...stylex.props(styles.srOnly)}>
        {recording ? 'Recording' : ''}
      </span>
      {recording ? (
        <>
          <span role="timer" aria-label="Elapsed time" {...stylex.props(styles.time)}>
            {fmt(seconds)}
          </span>
          <AudioWaveform analyser={analyser} bars={20} />
        </>
      ) : (
        <span {...stylex.props(styles.hint)}>{idleLabel}</span>
      )}
    </div>
  );
}
