import * as stylex from '@stylexjs/stylex';
import { useEffect, useRef } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { useReducedMotion } from '../../internal/motion-hooks';
import { mergeSx } from '../../internal/sx';

const styles = stylex.create({
  root: { alignItems: 'center', display: 'flex', gap: 3, height: 32 },
  bar: {
    backgroundColor: colors['--oniva-color-accent-fg'],
    borderRadius: radius['--oniva-radius-full'],
    flexShrink: 0,
    height: '100%',
    opacity: 0.85,
    transform: 'scaleY(0.12)',
    transformOrigin: 'center',
    transitionDuration: motion['--oniva-motion-dur-fast'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: 3,
  },
  idle: { backgroundColor: colors['--oniva-color-border-hover'], opacity: 1 },
});

export interface AudioWaveformProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Live analyser (e.g. from `AudioContext.createAnalyser()`); omit to simulate. */
  analyser?: AnalyserNode | null;
  /** When false bars rest at a flat baseline. Default true. */
  active?: boolean;
  /** Bar count. Default 24. */
  bars?: number;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Bars that scaleY with live microphone level (AnalyserNode) or a simulated voice envelope. */
export function AudioWaveform({
  analyser,
  active = true,
  bars = 24,
  className,
  xstyle,
  ref,
  ...rest
}: AudioWaveformProps) {
  const els = useRef<(HTMLSpanElement | null)[]>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    const set = (i: number, v: number) => {
      const el = els.current[i];
      if (el) el.style.transform = `scaleY(${Math.max(0.12, Math.min(1, v)).toFixed(3)})`;
    };
    if (!active || reduced) {
      for (let i = 0; i < bars; i++) set(i, active ? 0.35 + 0.4 * Math.abs(Math.sin(i * 0.7)) : 0.12);
      return;
    }
    const data = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;
    let raf = 0;
    let last = 0;
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (t - last < 55) return; // ~18fps is plenty for bars
      last = t;
      if (analyser && data) {
        analyser.getByteFrequencyData(data);
        const step = Math.max(1, Math.floor(data.length / bars / 2));
        for (let i = 0; i < bars; i++) set(i, (data[i * step] ?? 0) / 255);
      } else {
        const env = 0.55 + 0.45 * Math.sin(t / 700);
        for (let i = 0; i < bars; i++) {
          set(i, env * (0.25 + 0.75 * Math.abs(Math.sin(t / 190 + i * 0.9) * Math.cos(t / 330 + i * 0.4))));
        }
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [analyser, active, bars, reduced]);

  return (
    <div {...rest} ref={ref} aria-hidden="true" {...mergeSx(stylex.props(styles.root, xstyle), className)}>
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          ref={(n) => void (els.current[i] = n)}
          {...stylex.props(styles.bar, !active && styles.idle)}
        />
      ))}
    </div>
  );
}
