import * as stylex from '@stylexjs/stylex';
import { Check } from 'lucide-react';
import { useState, type ReactNode, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { useFormatters } from '../../internal/format';
import { focus } from '../../internal/focus';
import { mergeSx } from '../../internal/sx';
import { w4Motion } from '../../internal/w4-styles';
import { radius } from '../../tokens/radius.stylex';
import { Button } from '../Button';

const popIn = stylex.keyframes({
  '0%': { opacity: 0, transform: 'scale(0.85)', filter: 'blur(2px)' },
  '60%': { opacity: 1, transform: 'scale(1.06)', filter: 'blur(0)' },
  '100%': { opacity: 1, transform: 'scale(1)', filter: 'blur(0)' },
});

const styles = stylex.create({
  panel: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: 'none',
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    containerType: 'inline-size',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    maxWidth: 760,
    overflow: 'hidden',
    width: '100%',
  },
  head: {
    alignItems: 'center',
    borderBottomColor: colors['--oniva-color-border'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    display: 'flex',
    gap: 12,
    justifyContent: 'space-between',
    paddingBlock: 12,
    paddingInline: 16,
  },
  headTitle: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-14'],
    margin: 0,
  },
  list: {
    display: 'grid',
    gap: 8,
    gridTemplateColumns: {
      default: 'repeat(3, minmax(0, 1fr))',
      '@container (max-width: 560px)': 'repeat(2, minmax(0, 1fr))',
      '@container (max-width: 380px)': 'minmax(0, 1fr)',
    },
    listStyle: 'none',
    margin: 0,
    // Height before the list scrolls: set `--oniva-tips-max-height` on the panel.
    maxHeight: 'var(--oniva-tips-max-height, 420px)',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    padding: 12,
  },
  tip: {
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    padding: 12,
  },
  tipBg: {
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: 'background-color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  tipDone: { backgroundColor: colors['--oniva-color-surface-inset'] },
  title: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-14'],
    margin: 0,
  },
  titleFade: {
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: 'color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  titleDone: { color: colors['--oniva-color-text-muted'] },
  desc: { flexGrow: 1, margin: 0, marginBlockEnd: 10 },
  done: {
    alignItems: 'center',
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationFillMode: 'both',
    animationName: { default: popIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-spring'],
    color: colors['--oniva-color-success-fg'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 4,
    minHeight: 32,
  },
  meta: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
  },
  muted: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-14'],
  },
  footer: {
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBlock: 10,
    paddingInline: 12,
  },
});

export interface Tip {
  id: string;
  title: string;
  description?: ReactNode;
  /** Button label, e.g. "Try it". */
  action: string;
  /** Shown once the tip is taken. Default "Done". */
  doneLabel?: string;
  /** Primary-styled action. */
  primary?: boolean;
  onAction?: (tip: Tip) => void;
}

export interface TipsPanelProps {
  tips: Tip[];
  title?: string;
  /** Shows a Close button in the footer. */
  onClose?: () => void;
  closeLabel?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

/** Grid of short tips with one action each; taken tips turn into a done state. */
export function TipsPanel({
  tips,
  title = 'Tips',
  onClose,
  closeLabel = 'Close',
  className,
  xstyle,
  ref,
}: TipsPanelProps) {
  const fmt = useFormatters();
  const [done, setDone] = useState<Set<string>>(() => new Set());
  const take = (tip: Tip) => {
    setDone((d) => new Set(d).add(tip.id));
    tip.onAction?.(tip);
  };
  return (
    <section ref={ref} aria-label={title} {...mergeSx(stylex.props(styles.panel, xstyle), className)}>
      <div {...stylex.props(styles.head)}>
        <h3 {...stylex.props(styles.headTitle)}>{title}</h3>
        <span aria-live="polite" {...stylex.props(styles.meta)}>
          {fmt.number(done.size)}/{fmt.number(tips.length)} done
        </span>
      </div>
      <ul aria-label={title} tabIndex={0} {...stylex.props(styles.list, focus.inset)}>
        {tips.map((tip, i) => {
          const isDone = done.has(tip.id);
          return (
            <li
              key={tip.id}
              {...stylex.props(styles.tip, w4Motion.fadeUp, styles.tipBg, isDone && styles.tipDone)}
              style={{ animationDelay: `calc(${Math.min(i, 6)} * ${'var(--oniva-motion-stagger, 40ms)'})` }}
            >
              <h4 {...stylex.props(styles.title, styles.titleFade, isDone && styles.titleDone)}>{tip.title}</h4>
              {tip.description && <p {...stylex.props(styles.muted, styles.desc)}>{tip.description}</p>}
              {isDone ? (
                <span role="status" {...stylex.props(styles.done)}>
                  <Check size={14} aria-hidden="true" />
                  {tip.doneLabel ?? 'Done'}
                </span>
              ) : (
                <Button size="sm" variant={tip.primary ? 'primary' : 'secondary'} onPress={() => take(tip)}>
                  {tip.action}
                </Button>
              )}
            </li>
          );
        })}
      </ul>
      {onClose && (
        <div {...stylex.props(styles.footer)}>
          <Button size="sm" variant="secondary" onPress={onClose}>
            {closeLabel}
          </Button>
        </div>
      )}
    </section>
  );
}
