import { VisuallyHidden } from '../../components/VisuallyHidden/VisuallyHidden';
import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, Ref } from 'react';
import { useState } from 'react';
import { mergeSx } from '../../internal/sx';
import { media } from '../../tokens/media.stylex';

const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

const styles = stylex.create({
  root: { display: 'inline-flex', whiteSpace: 'pre' },
  char: { display: 'inline-block', height: '1.25em', lineHeight: '1.25em', overflow: 'hidden', verticalAlign: 'top' },
  reel: {
    display: 'flex',
    flexDirection: 'column',
    transform: {
      default: 'translateY(0)',
      '[data-rolled]': 'translateY(-50%)',
      [media.reducedMotion]: 'none',
    },
    transitionDuration: '250ms',
    transitionProperty: 'transform',
    transitionTimingFunction: EASE,
  },
});

export interface RollingTextProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style' | 'children'> {
  text: string;
  /** Controlled roll. If omitted, rolls while hovered or focused. */
  isRolled?: boolean;
  /** Per-character stagger in ms. Default `30`. */
  stagger?: number;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

/** Per-character slot-machine roll (250ms, 30ms stagger). Hover/focus by default or controlled via `isRolled`. Static under reduced motion. */
export function RollingText({ text, isRolled, stagger = 30, className, xstyle, ref, onPointerEnter, onPointerLeave, onFocus, onBlur, ...rest }: RollingTextProps) {
  const [held, setHeld] = useState(false);
  const rolled = isRolled ?? held;
  return (
    <span
      {...rest}
      ref={ref}
      onPointerEnter={(e) => {
        setHeld(true);
        onPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        setHeld(false);
        onPointerLeave?.(e);
      }}
      onFocus={(e) => {
        setHeld(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setHeld(false);
        onBlur?.(e);
      }}
      {...mergeSx(stylex.props(styles.root, xstyle), className)}
    >
      <VisuallyHidden>{text}</VisuallyHidden>
      {Array.from(text, (c, i) => (
        <span key={i} aria-hidden="true" {...stylex.props(styles.char)}>
          <span data-rolled={rolled ? '' : undefined} {...stylex.props(styles.reel)} style={{ transitionDelay: `${i * stagger}ms` }}>
            <span>{c}</span>
            <span>{c}</span>
          </span>
        </span>
      ))}
    </span>
  );
}
