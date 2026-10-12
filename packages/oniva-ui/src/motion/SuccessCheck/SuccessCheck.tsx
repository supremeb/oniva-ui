import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, Ref } from 'react';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { media } from '../../tokens/media.stylex';

const spin = stylex.keyframes({ from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } });
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
const BOB = 'cubic-bezier(0.34, 1.35, 0.64, 1)';

const styles = stylex.create({
  root: { display: 'inline-grid', height: 'var(--sc-size, 40px)', placeItems: 'center', position: 'relative', width: 'var(--sc-size, 40px)' },
  layer: { gridArea: '1 / 1', height: '100%', width: '100%' },
  spinner: {
    animationDuration: '800ms',
    animationIterationCount: 'infinite',
    animationName: { default: spin, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
    filter: { default: 'blur(0)', '[data-status="success"]': 'blur(4px)' },
    opacity: { default: 1, '[data-status="success"]': 0, '[data-status="idle"]': 0 },
    transform: { default: 'scale(1)', '[data-status="success"]': 'scale(0.6)' },
    transitionDuration: '250ms',
    transitionProperty: 'opacity, filter, transform',
    transitionTimingFunction: EASE,
  },
  disc: {
    backgroundColor: colors['--oniva-color-success-solid'],
    borderRadius: '50%',
    filter: { default: 'blur(10px)', '[data-status="success"]': 'blur(0)' },
    opacity: { default: 0, '[data-status="success"]': 1 },
    transform: {
      default: 'translateY(-12px) rotate(-80deg) scale(0.6)',
      '[data-status="success"]': 'translateY(0) rotate(0deg) scale(1)',
      [media.reducedMotion]: 'none',
    },
    transitionDuration: '500ms',
    transitionProperty: 'opacity, filter, transform',
    transitionTimingFunction: `${EASE}, ${EASE}, ${BOB}`,
  },
  track: { stroke: colors['--oniva-color-border'] },
  arc: { stroke: colors['--oniva-color-text'] },
  check: {
    stroke: colors['--oniva-color-on-solid'],
    strokeDasharray: 24,
    strokeDashoffset: { default: 24, '[data-status="success"]': 0 },
    transitionDelay: { default: '0ms', '[data-status="success"]': '80ms' },
    transitionDuration: '500ms',
    transitionProperty: 'stroke-dashoffset',
    transitionTimingFunction: EASE,
  },
});

export type SuccessCheckStatus = 'idle' | 'loading' | 'success';

export interface SuccessCheckProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style'> {
  status?: SuccessCheckStatus;
  /** Pixel size. Default `40`. */
  size?: number;
  /** Accessible label per status. */
  labels?: Partial<Record<SuccessCheckStatus, string>>;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

/** Spinner that morphs into a drawn check (500ms recipe: blur 10px to 0, rotate from -80deg, SVG path draw delayed 80ms). */
export function SuccessCheck({ status = 'loading', size = 40, labels, className, xstyle, ref, ...rest }: SuccessCheckProps) {
  const label = { idle: '', loading: 'Loading', success: 'Success', ...labels }[status];
  return (
    <span
      role="status"
      aria-label={label || undefined}
      {...rest}
      ref={ref}
      data-status={status}
      {...mergeSx(stylex.props(styles.root, xstyle), className, { ['--sc-size' as string]: `${size}px` })}
    >
      <svg aria-hidden="true" data-status={status} viewBox="0 0 24 24" fill="none" {...stylex.props(styles.layer, styles.spinner)}>
        <circle cx="12" cy="12" r="9" {...stylex.props(styles.track)} strokeWidth="2" />
        <path d="M12 3a9 9 0 0 1 9 9" {...stylex.props(styles.arc)} strokeWidth="2" strokeLinecap="round" />
      </svg>
      <svg aria-hidden="true" data-status={status} viewBox="0 0 24 24" fill="none" {...stylex.props(styles.layer, styles.disc)} />
      <svg aria-hidden="true" data-status={status} viewBox="0 0 24 24" fill="none" {...stylex.props(styles.layer)}>
        <path data-status={status} d="M7 12.5l3.2 3.2L17 9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...stylex.props(styles.check)} />
      </svg>
    </span>
  );
}
