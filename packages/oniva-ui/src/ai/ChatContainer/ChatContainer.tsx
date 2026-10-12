import * as stylex from '@stylexjs/stylex';
import { ArrowDown } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { motion } from '../../tokens/motion.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { IconButton } from '../../components/IconButton';
import { mergeSx } from '../../internal/sx';

const styles = stylex.create({
  root: { boxSizing: 'border-box', height: '100%', position: 'relative' },
  scroll: {
    boxSizing: 'border-box',
    height: '100%',
    overflowY: 'auto',
    paddingBlock: 16,
    paddingInline: 16,
  },
  inner: { display: 'flex', flexDirection: 'column', gap: 24, marginInline: 'auto', maxWidth: 760 },
  float: {
    insetBlockEnd: 12,
    insetInlineStart: '50%',
    position: 'absolute',
    transform: 'translateX(-50%)',
    transitionDuration: motion.durBase,
  },
  btn: { backgroundColor: colors.surface, boxShadow: shadow.md },
});

export interface ScrollToBottomButtonProps {
  onPress: () => void;
  xstyle?: stylex.StyleXStyles;
}

/** Floating circular "jump to latest" button. */
export function ScrollToBottomButton({ onPress, xstyle }: ScrollToBottomButtonProps) {
  return (
    <div {...stylex.props(styles.float)}>
      <IconButton variant="secondary" size="sm" aria-label="Scroll to bottom" onPress={onPress} xstyle={[styles.btn, xstyle]}>
        <ArrowDown size={16} aria-hidden="true" />
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
export function ChatContainer({ children, threshold = 48, className, xstyle, ref, ...rest }: ChatContainerProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const stuck = useRef(true);
  const [away, setAway] = useState(false);

  const toBottom = useCallback((smooth = true) => {
    const el = scroller.current;
    if (!el) return;
    if (typeof el.scrollTo === 'function') el.scrollTo({ top: el.scrollHeight, behavior: smooth && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'auto' });
    else el.scrollTop = el.scrollHeight;
  }, []);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight <= threshold;
    stuck.current = near;
    setAway(!near);
  };

  useEffect(() => {
    const target = content.current;
    if (!target || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      if (stuck.current) toBottom(false);
    });
    ro.observe(target);
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
        onScroll={onScroll}
        {...stylex.props(styles.scroll)}
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
