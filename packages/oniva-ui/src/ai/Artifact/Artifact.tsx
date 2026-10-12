import * as stylex from '@stylexjs/stylex';
import { Copy, Download, Share2, X } from 'lucide-react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { Badge } from '../../components/Badge';
import { IconButton } from '../../components/IconButton';
import { IconSwap, useCopy } from '../../internal/n1-ai';
import { mergeSx } from '../../internal/sx';
import { usePresence } from '../../motion/Presence';
import { Check } from 'lucide-react';

const slideIn = stylex.keyframes({
  from: { opacity: 0, transform: 'translateX(24px)' },
  to: { opacity: 1, transform: 'translateX(0)' },
});
const slideOut = stylex.keyframes({
  from: { opacity: 1, transform: 'translateX(0)' },
  to: { opacity: 0, transform: 'translateX(24px)' },
});
const fadeIn = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const fadeOut = stylex.keyframes({ from: { opacity: 1 }, to: { opacity: 0 } });

const styles = stylex.create({
  root: {
    animationDuration: {
      default: null,
      '[data-state="entering"]': motion['--oniva-motion-dur-sheet'],
      '[data-state="exiting"]': motion['--oniva-motion-dur-enter'],
    },
    animationFillMode: 'both',
    animationName: {
      default: null,
      '[data-state="entering"]': { default: slideIn, [media.reducedMotion]: fadeIn },
      '[data-state="exiting"]': { default: slideOut, [media.reducedMotion]: fadeOut },
    },
    animationTimingFunction: motion['--oniva-motion-ease-drawer'],
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-md'],
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    maxWidth: '100%',
    minHeight: 0,
    overflow: 'hidden',
    width: 'var(--oniva-artifact-width, 420px)',
  },
  header: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderBottomColor: colors['--oniva-color-border'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    display: 'flex',
    gap: 8,
    paddingBlock: 8,
    paddingInline: 14,
  },
  titles: { alignItems: 'center', display: 'flex', flexGrow: 1, gap: 8, minWidth: 0 },
  title: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-semibold'],
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  actions: { alignItems: 'center', display: 'flex', gap: 2 },
  content: { flexGrow: 1, minHeight: 0, overflow: 'auto', padding: 16 },
});

export interface ArtifactProps extends Omit<HTMLAttributes<HTMLElement>, 'style' | 'title' | 'children'> {
  open: boolean;
  onClose?: () => void;
  title: string;
  /** e.g. `v3`. */
  version?: string;
  /** Text copied by the copy action; the button is hidden when omitted. */
  copyText?: string;
  onDownload?: () => void;
  onShare?: () => void;
  /** Extra header actions rendered before the built-ins. */
  actions?: ReactNode;
  /** Panel body. */
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

/** Side panel for generated documents / code. Slides + fades in from the right; the content slot scrolls. */
export function Artifact({ open, onClose, title, version, copyText, onDownload, onShare, actions, children, className, xstyle, ref, ...rest }: ArtifactProps) {
  const { mounted, presenceProps } = usePresence(open);
  const { copied, copy } = useCopy(copyText ?? '');
  if (!mounted) return null;
  const { ref: pRef, ...pp } = presenceProps;
  const sx = stylex.props(styles.root, xstyle);
  return (
    <aside
      {...rest}
      {...pp}
      aria-label={title}
      ref={(n) => {
        pRef(n);
        if (typeof ref === 'function') ref(n);
        else if (ref) ref.current = n;
      }}
      {...mergeSx(sx, className)}
    >
      <header {...stylex.props(styles.header)}>
        <div {...stylex.props(styles.titles)}>
          <h3 {...stylex.props(styles.title)}>{title}</h3>
          {version && <Badge variant="neutral">{version}</Badge>}
        </div>
        <div {...stylex.props(styles.actions)}>
          {actions}
          {copyText !== undefined && (
            <IconButton size="xs" variant="ghost" aria-label={copied ? 'Copied' : 'Copy'} onPress={copy}>
              <IconSwap on={copied} a={<Copy size={14} />} b={<Check size={14} />} />
            </IconButton>
          )}
          {onDownload && (
            <IconButton size="xs" variant="ghost" aria-label="Download artifact" onPress={onDownload}>
              <Download size={14} />
            </IconButton>
          )}
          {onShare && (
            <IconButton size="xs" variant="ghost" aria-label="Share" onPress={onShare}>
              <Share2 size={14} />
            </IconButton>
          )}
          {onClose && (
            <IconButton size="xs" variant="ghost" aria-label="Close artifact" onPress={onClose}>
              <X size={14} />
            </IconButton>
          )}
        </div>
      </header>
      <div {...stylex.props(styles.content)}>{children}</div>
    </aside>
  );
}
