import * as stylex from '@stylexjs/stylex';
import { Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Ref } from 'react';
import { Button } from '../../components/Button/Button';
import type { ButtonProps } from '../../components/Button/Button';
import { VisuallyHidden } from '../../components/VisuallyHidden/VisuallyHidden';
import { media } from '../../tokens/media.stylex';

const EASE = 'cubic-bezier(0.77, 0, 0.175, 1)';
const swap = {
  transitionDuration: '250ms',
  transitionProperty: 'opacity, transform, filter',
  transitionTimingFunction: EASE,
} as const;

const styles = stylex.create({
  stack: { display: 'inline-grid', placeItems: 'center' },
  icon: { ...swap, gridArea: '1 / 1' },
  copyIcon: {
    filter: { default: 'blur(0)', '[data-copied]': 'blur(2px)' },
    opacity: { default: 1, '[data-copied]': 0 },
    transform: { default: 'scale(1)', '[data-copied]': 'scale(0.25)', [media.reducedMotion]: 'none' },
  },
  checkIcon: {
    filter: { default: 'blur(2px)', '[data-copied]': 'blur(0)' },
    opacity: { default: 0, '[data-copied]': 1 },
    transform: { default: 'scale(0.25)', '[data-copied]': 'scale(1)', [media.reducedMotion]: 'none' },
  },
});

export interface CopyButtonProps extends Omit<ButtonProps, 'children' | 'isIconOnly' | 'onPress'> {
  /** Text written to the clipboard. */
  value: string;
  /** Milliseconds the check stays before swapping back. Default `1600`. */
  resetAfter?: number;
  onCopy?: (value: string) => void;
  ref?: Ref<HTMLButtonElement>;
}

/** Icon-only copy button: copy icon swaps with a check (scale from 0.25 + blur 2px, 250ms). Announces "Copied" politely. */
export function CopyButton({ value, resetAfter = 1600, onCopy, variant = 'secondary', 'aria-label': ariaLabel = 'Copy', ...rest }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const mark = copied ? { 'data-copied': '' } : {};
  return (
    <Button
      {...rest}
      variant={variant}
      isIconOnly
      aria-label={ariaLabel}
      onPress={() => {
        void navigator.clipboard?.writeText(value);
        onCopy?.(value);
        setCopied(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), resetAfter);
      }}
    >
      <span {...stylex.props(styles.stack)} aria-hidden="true">
        <Copy size={16} {...mark} {...stylex.props(styles.icon, styles.copyIcon)} />
        <Check size={16} {...mark} {...stylex.props(styles.icon, styles.checkIcon)} />
      </span>
      <VisuallyHidden>
        <span role="status">{copied ? 'Copied' : ''}</span>
      </VisuallyHidden>
    </Button>
  );
}
