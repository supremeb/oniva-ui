import * as stylex from '@stylexjs/stylex';
import { media } from '../../tokens/media.stylex';
import { ImageIcon } from 'lucide-react';
import type { HTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { mergeSx } from '../../internal/sx';
import { TextShimmer } from '../TextShimmer';

const drift = stylex.keyframes({
  '0%': { backgroundPosition: '0% 20%' },
  '50%': { backgroundPosition: '100% 80%' },
  '100%': { backgroundPosition: '0% 20%' },
});

const styles = stylex.create({
  root: {
    borderRadius: radius['--oniva-radius-xl'],
    boxSizing: 'border-box',
    fontFamily: font['--oniva-font-sans'],
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  canvas: {
    animationDuration: '6s',
    animationIterationCount: 'infinite',
    animationName: { default: drift, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
    backgroundImage: `radial-gradient(circle at 20% 20%, ${colors['--oniva-color-chart-4']}, transparent 55%), radial-gradient(circle at 80% 30%, ${colors['--oniva-color-chart-5']}, transparent 55%), radial-gradient(circle at 50% 90%, ${colors['--oniva-color-chart-3']}, transparent 60%)`,
    backgroundSize: '200% 200%',
    filter: 'blur(24px) saturate(1.1)',
    inset: -24,
    opacity: 0.55,
    position: 'absolute',
  },
  frame: { backgroundColor: colors['--oniva-color-surface-inset'], inset: 0, position: 'absolute' },
  label: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    flexDirection: 'column',
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 6,
    inset: 0,
    justifyContent: 'center',
    position: 'absolute',
  },
  prompt: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-regular'],
    maxWidth: '80%',
    textAlign: 'center',
  },
});

export interface ImageGenerationLoaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** CSS aspect ratio, e.g. `1 / 1` or `16 / 9`. */
  aspectRatio?: string;
  /** Prompt echoed under the label. */
  prompt?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Placeholder shown while an image is generated: drifting blurred color field plus shimmering label. */
export function ImageGenerationLoader({
  aspectRatio = '1 / 1',
  prompt,
  className,
  xstyle,
  ref,
  ...rest
}: ImageGenerationLoaderProps) {
  const sx = stylex.props(styles.root, xstyle);
  const m = mergeSx(sx, className, { aspectRatio });
  return (
    <div role="status" aria-label="Generating image" {...rest} ref={ref} {...m}>
      <div {...stylex.props(styles.frame)} />
      <div aria-hidden="true" {...stylex.props(styles.canvas)} />
      <div {...stylex.props(styles.label)}>
        <ImageIcon size={20} aria-hidden="true" />
        <TextShimmer>Generating image…</TextShimmer>
        {prompt && <span {...stylex.props(styles.prompt)}>{prompt}</span>}
      </div>
    </div>
  );
}
