import * as stylex from '@stylexjs/stylex';
import type { ControlSize } from '../../internal/types';
import {
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps as AriaRadioProps,
  RadioGroupStateContext,
} from 'react-aria-components';
import { createContext, use, useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode, type Ref, type RefObject } from 'react';
import { useObjectRef } from 'react-aria';
import { useSlidingIndicator } from '../../motion/SlidingIndicator/SlidingIndicator';
import { media } from '../../tokens/media.stylex';
import { prefersReducedMotion } from '../../internal/motion-hooks';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { cx, ff } from '../../internal/forms-field';
import { useFormatters } from '../../internal/format';
import { useKeyboardInstant } from '../../internal/depth-b1-modality';

const countIn = stylex.keyframes({
  from: { filter: 'blur(2px)', opacity: 0, transform: 'scale(0.9)' },
  to: { filter: 'blur(0)', opacity: 1, transform: 'scale(1)' },
});
const countFade = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });

const styles = stylex.create({
  pill: {
    height: 'var(--oniva-indicator-h, 0px)',
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    transform: 'translate(var(--oniva-indicator-x, 0px), var(--oniva-indicator-y, 0px))',
    transitionDuration: { default: 0, '[data-ready]': motion['--oniva-motion-dur-base'] },
    transitionProperty: 'opacity',
    width: 'var(--oniva-indicator-w, 0px)',
    zIndex: 0,
  },
  pillPress: {
    scale: { default: '1', '[data-pressed]': motion['--oniva-motion-press-scale'] },
    transitionProperty: 'opacity, scale',
    transitionDuration: motion['--oniva-motion-dur-press'],
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  label: {
    display: 'inline-block',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'font-weight',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    '::after': {
      content: 'attr(data-text)',
      display: 'block',
      fontWeight: font['--oniva-font-weight-semibold'],
      height: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      visibility: 'hidden',
    },
  },
  countIn: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: countIn, [media.reducedMotion]: countFade },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  track: {
    alignItems: 'center',
    // Recessed channel: tertiary fill + inner top shadow, no outer shadow.
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-lg'],
    boxShadow: shadow['--oniva-elevation-recessed'],
    boxSizing: 'border-box',
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    gap: 2,
    padding: 4,
    position: 'relative',
  },
  indicator: {
    // Raised pill on the recessed track (lighter surface + rim in dark via the tokens).
    backgroundColor: colors['--oniva-color-segment-selected'],
    borderRadius: radius['--oniva-radius-sm'],
    boxShadow: shadow['--oniva-elevation-raised'],
    transitionTimingFunction: motion['--oniva-motion-ease-in-out'],
  },
  full: { display: 'flex', width: '100%' },
  trackLine: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    borderBottomColor: colors['--oniva-color-border'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    gap: 4,
    padding: 0,
  },
  indicatorLine: {
    backgroundColor: 'transparent',
    borderBottomColor: colors['--oniva-color-accent-text'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 2,
    borderRadius: 0,
    boxShadow: 'none',
    boxSizing: 'border-box',
  },
  itemLine: { borderRadius: 0 },
  icon: { display: 'inline-flex', flexShrink: 0 },
  count: {
    backgroundColor: colors['--oniva-color-surface-active'],
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
    lineHeight: font['--oniva-font-lh-12'],
    minWidth: 18,
    paddingInline: 6,
    textAlign: 'center',
  },

  item: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-sm'],
    boxSizing: 'border-box',
    cursor: 'pointer',
    display: 'inline-flex',
    flexGrow: 0,
    fontSize: font['--oniva-font-size-14'],
    gap: 6,
    justifyContent: 'center',
    lineHeight: font['--oniva-font-lh-14'],
    paddingBlock: 4,
    paddingInline: 10,
    position: 'relative',
    touchAction: 'manipulation',
    transform: {
      default: 'none',
      ':active:not([data-disabled])': `scale(${motion['--oniva-motion-press-scale']})`,
    },
    transitionDuration: `${motion['--oniva-motion-dur-base']}, ${motion['--oniva-motion-dur-press']}`,
    transitionProperty: 'color, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    zIndex: 1,
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  itemSm: { fontSize: font['--oniva-font-size-13'], height: 24, paddingInline: 8 },
  itemMd: { height: 28 },
  fullItem: { flexGrow: 1 },
  off: {
    color: colors['--oniva-color-text-muted'],
    fontWeight: font['--oniva-font-weight-regular'],
  },
  offHover: { color: colors['--oniva-color-text'] },
  on: {
    color: colors['--oniva-color-text'],
    fontWeight: font['--oniva-font-weight-semibold'],
  },
  disabled: { cursor: 'not-allowed', opacity: 0.5 },
});

const SizeCtx = createContext<{ size: 'sm' | 'md'; full: boolean; variant: SegmentedVariant }>({
  size: 'md',
  full: false,
  variant: 'tray',
});

export type SegmentedVariant = 'tray' | 'underline';

/** Drag the pointer across the segments to select as you go (pointer devices; keyboard unaffected). */
function SegDrag({ containerRef }: { containerRef: RefObject<HTMLElement | null> }) {
  const state = use(RadioGroupStateContext);
  useEffect(() => {
    const root = containerRef.current;
    if (!root || !state) return;
    let startX: number | null = null;
    let dragging = false;
    const pick = (x: number) => {
      let best: HTMLInputElement | null = null;
      let dist = Infinity;
      root.querySelectorAll<HTMLElement>('label').forEach((l) => {
        const input = l.querySelector<HTMLInputElement>('input[type="radio"]');
        if (!input || input.disabled) return;
        const r = l.getBoundingClientRect();
        const d = x < r.left ? r.left - x : x > r.right ? x - r.right : 0;
        if (d < dist) {
          dist = d;
          best = input;
        }
      });
      const hit = best as HTMLInputElement | null;
      if (hit && hit.value !== state.selectedValue) state.setSelectedValue(hit.value);
    };
    const move = (e: PointerEvent) => {
      if (startX == null) return;
      if (!dragging && Math.abs(e.clientX - startX) < 6) return;
      dragging = true;
      root.setAttribute('data-dragging', '');
      pick(e.clientX);
    };
    const up = () => {
      startX = null;
      dragging = false;
      root.removeAttribute('data-dragging');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
    const down = (e: PointerEvent) => {
      if (e.button !== 0 || e.pointerType === 'touch') return;
      startX = e.clientX;
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
    };
    root.addEventListener('pointerdown', down);
    return () => {
      root.removeEventListener('pointerdown', down);
      up();
    };
  }, [containerRef, state]);
  return null;
}

const EASE = 'cubic-bezier(0.77, 0, 0.175, 1)';

/**
 * Gliding pill with a stretch: the edge facing the target leads, the trailing edge catches up.
 * Box (x, w) is always the active item's box at rest (LTR and RTL: physical offsets).
 */
function SegIndicator({
  containerRef,
  variant,
}: {
  containerRef: RefObject<HTMLElement | null>;
  variant: SegmentedVariant;
}) {
  const value = use(RadioGroupStateContext)?.selectedValue;
  const { rect, isReady } = useSlidingIndicator(containerRef, {
    activeKey: value,
    selector: '[data-selected="true"]',
  });
  const el = useRef<HTMLSpanElement>(null);
  const prev = useRef(rect);
  useKeyboardInstant(containerRef, () => el.current);
  useEffect(() => {
    const root = containerRef.current;
    const node = el.current;
    if (!root || !node) return;
    const down = (e: PointerEvent) => {
      if (e.button === 0 && (e.target as HTMLElement).closest('[data-selected="true"]')) node.setAttribute('data-pressed', '');
    };
    const up = () => node.removeAttribute('data-pressed');
    root.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      root.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [containerRef]);
  useLayoutEffect(() => {
    const from = prev.current;
    prev.current = rect;
    const node = el.current;
    if (!node || !from || !rect || !isReady || prefersReducedMotion()) return;
    if (node.hasAttribute('data-instant')) return; // keyboard move: snap
    if (from.x === rect.x && from.y === rect.y && from.width === rect.width && from.height === rect.height) return;
    if (typeof node.animate !== 'function') return;
    const left = Math.min(from.x, rect.x);
    const right = Math.max(from.x + from.width, rect.x + rect.width);
    const tf = (x: number, y: number) => `translate(${x}px, ${y}px)`;
    // Same-row moves stretch; vertical or size-only changes just glide.
    const stretch = from.y === rect.y && (right - left > Math.max(from.width, rect.width) + 0.5);
    const frames: Keyframe[] = [{ transform: tf(from.x, from.y), width: from.width + 'px', height: from.height + 'px' }];
    if (stretch) frames.push({ offset: 0.45, transform: tf(left, rect.y), width: right - left + 'px', height: rect.height + 'px' });
    frames.push({ transform: tf(rect.x, rect.y), width: rect.width + 'px', height: rect.height + 'px' });
    const anim = node.animate(frames, { duration: 320, easing: EASE });
    return () => anim.cancel();
  }, [rect, isReady]);
  const vars = rect
    ? ({
        '--oniva-indicator-x': `${rect.x}px`,
        '--oniva-indicator-y': `${rect.y}px`,
        '--oniva-indicator-w': `${rect.width}px`,
        '--oniva-indicator-h': `${rect.height}px`,
        left: 0,
        right: 'auto',
      } as CSSProperties)
    : ({ left: 0, right: 'auto', opacity: 0 } as CSSProperties);
  const sx = stylex.props(styles.pill, styles.pillPress, styles.indicator, variant === 'underline' && styles.indicatorLine);
  return (
    <span
      ref={el}
      aria-hidden="true"
      data-ready={isReady && rect ? '' : undefined}
      className={sx.className}
      style={{ ...(sx.style as CSSProperties), ...vars }}
    />
  );
}

export interface SegmentedControlProps extends Omit<
  AriaRadioGroupProps,
  'className' | 'style' | 'children' | 'orientation'
> {
  size?: Extract<ControlSize, 'sm' | 'md'>;
  /** Stretch to container width with equal segments. */
  fullWidth?: boolean;
  /** `tray` (default): raised pill on an inset track. `underline`: text tabs on a hairline with a gliding line. */
  variant?: SegmentedVariant;
  /** Let the pointer drag across segments to select. Default true. */
  isDraggable?: boolean;
  children?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function SegmentedControl({
  size = 'md',
  fullWidth = false,
  variant = 'tray',
  isDraggable = true,
  children,
  className,
  xstyle,
  ref,
  ...rest
}: SegmentedControlProps) {
  const objRef = useObjectRef(ref);
  const sx = stylex.props(
    styles.track,
    variant === 'underline' && styles.trackLine,
    fullWidth && styles.full,
    xstyle,
  );
  return (
    <AriaRadioGroup
      {...rest}
      ref={objRef}
      orientation="horizontal"
      className={cx(sx.className, className)}
    >
      <SegIndicator containerRef={objRef} variant={variant} />
      {isDraggable && <SegDrag containerRef={objRef} />}
      <SizeCtx value={{ size, full: fullWidth, variant }}>{children}</SizeCtx>
    </AriaRadioGroup>
  );
}

export interface SegmentedControlItemProps extends Omit<
  AriaRadioProps,
  'className' | 'style' | 'children'
> {
  children?: ReactNode;
  /** Leading icon (decorative). Icon-only items need `aria-label`. */
  icon?: ReactNode;
  /** Trailing count, formatted for the locale; part of the accessible name. */
  count?: number;
  /** Trailing custom badge node (e.g. a `<Badge>`). */
  badge?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLLabelElement>;
}

export function SegmentedControlItem({
  children,
  icon,
  count,
  badge,
  className,
  xstyle,
  ref,
  ...rest
}: SegmentedControlItemProps) {
  const { size, full, variant } = use(SizeCtx);
  const fmt = useFormatters();
  return (
    <AriaRadio
      {...rest}
      ref={ref}
      className={({ isSelected, isHovered, isDisabled, isFocusVisible }) =>
        cx(
          stylex.props(
            styles.item,
            size === 'sm' ? styles.itemSm : styles.itemMd,
            full && styles.fullItem,
            variant === 'underline' && styles.itemLine,
            isSelected ? styles.on : styles.off,
            !isSelected && isHovered && styles.offHover,
            isFocusVisible && ff.focusRing,
            isDisabled && styles.disabled,
            xstyle,
          ).className,
          className,
        )
      }
    >
      {icon != null && (
        <span aria-hidden="true" {...stylex.props(styles.icon)}>
          {icon}
        </span>
      )}
      {typeof children === 'string' || typeof children === 'number' ? (
        <span data-text={String(children)} {...stylex.props(styles.label)}>
          {children}
        </span>
      ) : (
        children
      )}
      {count != null && (
        <span key={count} {...stylex.props(styles.count, styles.countIn)}>
          {fmt.number(count)}
        </span>
      )}
      {badge}
    </AriaRadio>
  );
}
