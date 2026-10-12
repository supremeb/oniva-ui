import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, Ref } from 'react';
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../internal/motion-hooks';
import { mergeRefs } from '../../internal/n3-hooks';
import { mergeSx } from '../../internal/sx';

const styles = stylex.create({
  canvas: { height: '100%', inset: 0, pointerEvents: 'none', position: 'absolute', width: '100%' },
  fixed: { position: 'fixed', zIndex: 1000 },
});

interface Piece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  w: number;
  h: number;
  color: string;
  life: number;
}

export interface ConfettiProps extends Omit<HTMLAttributes<HTMLCanvasElement>, 'style' | 'children'> {
  /** Fires a burst each time this number changes (and is > 0). */
  trigger?: number;
  /** Pieces per burst. Default `80`. */
  count?: number;
  /** Burst origin as fractions of the canvas. Default `{ x: 0.5, y: 0.6 }`. */
  origin?: { x: number; y: number };
  /** Cover the viewport instead of the nearest positioned ancestor. */
  fullscreen?: boolean;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLCanvasElement>;
}

const TOKENS = ['--oniva-accent-400', '--oniva-accent-600', '--oniva-accent-200', '--oniva-color-success-solid', '--oniva-color-warning-solid'];

/** Canvas confetti burst (gravity + drag, ~1.6s). rAF runs only while pieces are alive. Renders nothing under reduced motion. */
export function Confetti({ trigger = 0, count = 80, origin = { x: 0.5, y: 0.6 }, fullscreen, className, xstyle, ref, ...rest }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pieces = useRef<Piece[]>([]);
  const raf = useRef(0);
  const last = useRef(trigger);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || trigger === last.current) return;
    last.current = trigger;
    if (trigger <= 0 || prefersReducedMotion()) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const W = canvas.clientWidth;
    const H = canvas.clientHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const cs = getComputedStyle(canvas);
    const palette = TOKENS.map((t) => cs.getPropertyValue(t).trim()).filter(Boolean);
    const colors = palette.length ? palette : ['currentColor'];
    for (let i = 0; i < count; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9;
      const s = 6 + Math.random() * 9;
      pieces.current.push({
        x: origin.x * W, y: origin.y * H, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
        rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.4, w: 5 + Math.random() * 5, h: 3 + Math.random() * 4,
        color: colors[i % colors.length]!, life: 1,
      });
    }
    if (raf.current) return;
    const step = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      pieces.current = pieces.current.filter((p) => p.life > 0 && p.y < H + 20);
      for (const p of pieces.current) {
        p.vx *= 0.985;
        p.vy = p.vy * 0.985 + 0.35;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life -= 0.009;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 2));
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (pieces.current.length) raf.current = requestAnimationFrame(step);
      else {
        raf.current = 0;
        ctx.clearRect(0, 0, W, H);
      }
    };
    raf.current = requestAnimationFrame(step);
  }, [trigger, count, origin.x, origin.y]);

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      raf.current = 0;
      pieces.current = [];
    },
    [],
  );

  return <canvas aria-hidden="true" {...rest} ref={mergeRefs(canvasRef, ref)} {...mergeSx(stylex.props(styles.canvas, fullscreen && styles.fixed, xstyle), className)} />;
}
