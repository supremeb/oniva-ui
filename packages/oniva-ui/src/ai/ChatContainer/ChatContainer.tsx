import * as stylex from '@stylexjs/stylex';
import { ArrowDownIcon } from '../../icons/IconSet';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { colors } from '../../tokens/colors.stylex';
import { motion } from '../../tokens/motion.stylex';
import { media } from '../../tokens/media.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { IconButton } from '../../components/IconButton';
import { focus } from '../../internal/focus';
import { mergeSx } from '../../internal/sx';

const riseIn = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(8px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

const styles = stylex.create({
  root: { boxSizing: 'border-box', height: '100%', position: 'relative' },
  scroll: {
    boxSizing: 'border-box',
    height: '100%',
    overflowY: 'auto',
    overscrollBehaviorY: 'contain',
    paddingBlock: 16,
    paddingInline: 16,
  },
  inner: { display: 'flex', flexDirection: 'column', gap: 24, marginInline: 'auto', maxWidth: 760 },
  float: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationFillMode: 'backwards',
    animationName: { default: riseIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'flex',
    insetBlockEnd: 12,
    insetInline: 0,
    justifyContent: 'center',
    pointerEvents: 'none',
    position: 'absolute',
  },
  floatBtn: { pointerEvents: 'auto' },
  btn: { backgroundColor: colors['--oniva-color-surface'], boxShadow: shadow['--oniva-elevation-floating'] },
});

export interface ScrollToBottomButtonProps {
  onPress: () => void;
  xstyle?: stylex.StyleXStyles;
}

/** Floating circular "jump to latest" button. */
export function ScrollToBottomButton({ onPress, xstyle }: ScrollToBottomButtonProps) {
  return (
    <div {...stylex.props(styles.float)}>
      <IconButton
        variant="secondary"
        size="sm"
        aria-label="Scroll to bottom"
        onPress={onPress}
        xstyle={[styles.floatBtn, styles.btn, xstyle]}
      >
        <ArrowDownIcon size={16} aria-hidden="true" />
      </IconButton>
    </div>
  );
}

export interface ChatContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  children?: ReactNode;
  /** Distance (px) from the bottom within which the view keeps following new content. */
  threshold?: number;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Scrollable message log that sticks to the bottom as content grows and shows a jump button when you scroll away. */
export function ChatContainer({
  children,
  threshold = 48,
  className,
  xstyle,
  ref,
  ...rest
}: ChatContainerProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const stuck = useRef(true);
  const [away, setAway] = useState(false);

  const toBottom = useCallback((smooth = true) => {
    const el = scroller.current;
    if (!el) return;
    if (typeof el.scrollTo === 'function')
      el.scrollTo({
        top: el.scrollHeight,
        behavior:
          smooth && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
            ? 'smooth'
            : 'auto',
      });
    else el.scrollTop = el.scrollHeight;
  }, []);

  const measure = () => {
    const el = scroller.current;
    if (!el) return;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
    stuck.current = near;
    setAway(!near);
  };
  const measureRef = useRef(measure);
  measureRef.current = measure;

  useEffect(() => {
    const target = content.current;
    const box = scroller.current;
    if (!target || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      if (stuck.current) toBottom(false);
      // Content shrank or the viewport grew until nothing overflows: drop a stale jump button.
      else measureRef.current();
    });
    ro.observe(target);
    if (box) ro.observe(box);
    return () => ro.disconnect();
  }, [toBottom]);

  const sx = stylex.props(styles.root, xstyle);
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      <div
        ref={scroller}
        role="log"
        aria-label="Conversation"
        aria-live="polite"
        tabIndex={0}
        onScroll={measure}
        {...stylex.props(styles.scroll, focus.inset)}
      >
        <div ref={content} {...stylex.props(styles.inner)}>
          {children}
        </div>
      </div>
      {away && (
        <ScrollToBottomButton
          onPress={() => {
            stuck.current = true;
            toBottom();
          }}
        />
      )}
    </div>
  );
}
