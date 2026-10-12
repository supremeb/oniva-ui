import * as stylex from '@stylexjs/stylex';
import { Maximize2, RefreshCw } from 'lucide-react';
import type { HTMLAttributes, Ref } from 'react';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { aib } from '../../internal/aib-styles';
import { mergeSx } from '../../internal/sx';

const drift = stylex.keyframes({
  from: { transform: 'translate3d(0,0,0)' },
  to: { transform: 'translate3d(-8px,-8px,0)' },
});

const styles = stylex.create({
  grid: { display: 'grid', gap: 8, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', padding: 8 },
  tile: {
    aspectRatio: '1 / 1',
    borderRadius: radius['--oniva-radius-lg'],
    overflow: 'hidden',
    position: 'relative',
  },
  layer: { inset: 0, position: 'absolute' },
  img: {
    height: '100%',
    objectFit: 'cover',
    transitionDuration: motion['--oniva-motion-dur-deliberate'],
    transitionProperty: 'filter, opacity, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '100%',
  },
  /** progress 0-1 maps to blur 4px -> 0 via inline `--p`; capped at 4px per motion rules. */
  imgPending: { filter: 'blur(4px)', opacity: 0.0, transform: 'scale(1.02)' },
  imgBlur: { filter: 'blur(4px)', opacity: 0.85, transform: 'scale(1.02)' },
  imgSharp: { filter: 'blur(0)', opacity: 1, transform: 'scale(1)' },
  noise: {
    backgroundImage: `radial-gradient(${colors['--oniva-color-border-hover']} 1px, transparent 1.4px)`,
    backgroundColor: colors['--oniva-color-surface-inset'],
    backgroundSize: '8px 8px',
    inset: -8,
    position: 'absolute',
    animationDuration: '1.2s',
    animationIterationCount: 'infinite',
    animationName: { default: drift, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
    transitionDuration: motion['--oniva-motion-dur-deliberate'],
    transitionProperty: 'opacity',
  },
  noiseGone: { opacity: 0 },
  progress: {
    backgroundColor: accent['--oniva-accent-500'],
    bottom: 0,
    height: 3,
    left: 0,
    transformOrigin: 'left center',
    position: 'absolute',
    right: 0,
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'transform, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  pct: {
    backgroundColor: colors['--oniva-color-overlay'],
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-on-solid'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-11'],
    fontVariantNumeric: 'tabular-nums',
    insetInlineStart: 8,
    paddingBlock: 2,
    paddingInline: 8,
    position: 'absolute',
    top: 8,
  },
  actions: {
    display: 'flex',
    gap: 4,
    insetInlineEnd: 8,
    position: 'absolute',
    top: 8,
  },
  action: {
    backgroundColor: colors['--oniva-color-surface'],
    boxShadow: 'none',
    color: colors['--oniva-color-text'],
  },
  caption: {
    color: colors['--oniva-color-text-muted'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-12'],
    paddingBlock: 0,
    paddingInline: 12,
  },
});

export interface ImageGenTile {
  id: string;
  /** Final image URL. */
  src: string;
  alt: string;
  /** 0-100 while generating; 100 or undefined with `src` = done. */
  progress?: number;
}

export interface ImageGenGridProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  tiles: ImageGenTile[];
  prompt?: string;
  onRegenerate?: (id: string) => void;
  onUpscale?: (id: string) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/**
 * 2x2 image generation grid. Each tile reveals noise dots -> blurred preview (>=35%) -> sharp (100%),
 * with a per-tile progress bar and hover/focus regenerate + upscale actions.
 */
export function ImageGenGrid({
  tiles,
  prompt,
  onRegenerate,
  onUpscale,
  className,
  xstyle,
  ref,
  ...rest
}: ImageGenGridProps) {
  return (
    <div {...rest} ref={ref} {...mergeSx(stylex.props(aiStyles.panel, xstyle), className)}>
      <div {...stylex.props(styles.grid)}>
        {tiles.slice(0, 4).map((t) => {
          const p = Math.max(0, Math.min(100, t.progress ?? 100));
          const done = p >= 100;
          const stage = done ? styles.imgSharp : p >= 35 ? styles.imgBlur : styles.imgPending;
          return (
            <div key={t.id} {...stylex.props(styles.tile, aiStyles.tile)}>
              <div {...stylex.props(styles.layer)}>
                <img src={t.src} alt={done ? t.alt : ''} {...stylex.props(styles.img, stage)} />
              </div>
              <div aria-hidden="true" {...stylex.props(styles.noise, p >= 35 && styles.noiseGone)} />
              {!done && (
                <>
                  <span role="progressbar" aria-label={`Generating ${t.alt}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(p)} {...stylex.props(styles.progress)} style={{ transform: `scaleX(${p / 100})` }} />
                  <span aria-hidden="true" {...stylex.props(styles.pct)}>{Math.round(p)}%</span>
                </>
              )}
              {done && (
                <div {...stylex.props(styles.actions)}>
                  <button type="button" aria-label={`Regenerate ${t.alt}`} onClick={() => onRegenerate?.(t.id)} {...stylex.props(aib.mini, styles.action)}>
                    <RefreshCw size={14} />
                  </button>
                  <button type="button" aria-label={`Upscale ${t.alt}`} onClick={() => onUpscale?.(t.id)} {...stylex.props(aib.mini, styles.action)}>
                    <Maximize2 size={14} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {prompt && <p {...stylex.props(styles.caption)}>{prompt}</p>}
    </div>
  );
}
