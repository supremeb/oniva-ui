import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { useRef } from 'react';
import { mergeRefs } from '../../internal/n3-hooks';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  root: { position: 'relative' },
  pill: {
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-lg'],
    height: 'var(--ph, 0px)',
    left: 0,
    opacity: { default: 0, '[data-visible]': 1 },
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    transform: 'translate(var(--px, 0px), var(--py, 0px))',
    transitionDuration: {
      default: `${motion['--oniva-motion-dur-slow']}, ${motion['--oniva-motion-dur-base']}`,
      '[data-instant]': '0ms',
    },
    transitionProperty: 'transform, opacity',
    transitionTimingFunction: `${motion['--oniva-motion-ease-in-out']}, ${motion['--oniva-motion-ease-out']}`,
    width: 'var(--pw, 0px)',
    willChange: 'transform',
    zIndex: 0,
  },
  item: { position: 'relative', zIndex: 1 },
});

export interface HoverPillProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Children mark hover targets with `data-hover-pill-item` (or use `<HoverPillItem>`). */
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/**
 * One background pill glides between hover targets in a list/nav (shared-layout hover). Pointer moves glide
 * (transform 250ms ease-in-out); keyboard focus snaps instantly. Size snaps per item, position glides.
 */
export function HoverPill({ className, xstyle, ref, children, onPointerOver, onPointerLeave, onFocus, onBlur, ...rest }: HoverPillProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const visible = useRef(false);

  const target = (el: EventTarget | null) => (el instanceof Element ? (el.closest('[data-hover-pill-item]') as HTMLElement | null) : null);
  const moveTo = (item: HTMLElement | null, instant: boolean) => {
    const root = rootRef.current;
    const pill = pillRef.current;
    if (!root || !pill) return;
    if (!item) {
      visible.current = false;
      pill.removeAttribute('data-visible');
      return;
    }
    // First appearance snaps into place (no glide from nowhere).
    if (instant || !visible.current) pill.setAttribute('data-instant', '');
    else pill.removeAttribute('data-instant');
    pill.style.setProperty('--px', `${item.offsetLeft}px`);
    pill.style.setProperty('--py', `${item.offsetTop}px`);
    pill.style.setProperty('--pw', `${item.offsetWidth}px`);
    pill.style.setProperty('--ph', `${item.offsetHeight}px`);
    pill.setAttribute('data-visible', '');
    visible.current = true;
  };

  return (
    <div
      {...rest}
      ref={mergeRefs(rootRef, ref)}
      onPointerOver={(e) => {
        onPointerOver?.(e);
        const item = target(e.target);
        if (item && e.pointerType !== 'touch') moveTo(item, false);
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        moveTo(null, false);
      }}
      onFocus={(e) => {
        onFocus?.(e);
        const item = target(e.target);
        if (item && e.target instanceof Element && e.target.matches(':focus-visible')) moveTo(item, true);
      }}
      onBlur={(e) => {
        onBlur?.(e);
        if (!e.currentTarget.contains(e.relatedTarget)) moveTo(null, true);
      }}
      {...mergeSx(stylex.props(styles.root, xstyle), className)}
    >
      <span ref={pillRef} aria-hidden="true" {...stylex.props(styles.pill)} />
      {children}
    </div>
  );
}

export interface HoverPillItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Convenience wrapper that marks a hover target. For links/buttons add `data-hover-pill-item` directly. */
export function HoverPillItem({ className, xstyle, ref, ...rest }: HoverPillItemProps) {
  return <div {...rest} ref={ref} data-hover-pill-item="" {...mergeSx(stylex.props(styles.item, xstyle), className)} />;
}
