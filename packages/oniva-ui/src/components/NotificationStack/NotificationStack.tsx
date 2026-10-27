import * as stylex from '@stylexjs/stylex';
import { useLayoutEffect, useRef, useState, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { mergeSx } from '../../internal/sx';
import { useReducedMotion } from '../../internal/motion-hooks';
import { useTimeouts } from '../../internal/w4-hooks';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { CloseButton } from '../CloseButton';
import { LinkButton } from '../LinkButton';

const PEEK = 10;

const styles = stylex.create({
  root: {
    display: 'grid',
    fontFamily: font['--oniva-font-sans'],
    // room for the cards peeking out below the front one
    paddingBlockEnd: PEEK * 2,
    position: 'relative',
    width: '100%',
  },
  card: {
    alignSelf: 'start',
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-md'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    gridArea: '1 / 1',
    overflow: 'hidden',
    position: 'relative',
    transformOrigin: 'bottom center',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'transform, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-in-out'],
  },
  d0: { transform: 'none', zIndex: 3 },
  d1: { transform: `translateY(${PEEK}px) scale(0.95)`, zIndex: 2 },
  d2: { opacity: 0.7, transform: `translateY(${PEEK * 2}px) scale(0.9)`, zIndex: 1 },
  gone: {
    opacity: 0,
    pointerEvents: 'none',
    transform: 'translateX(40px) scale(0.97)',
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    zIndex: 4,
  },
  // cards behind the front one take the front card's height so they peek out evenly
  behind: { height: 'var(--oniva-ns-h, auto)', userSelect: 'none' },
  body: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    padding: 14,
    position: 'relative',
  },
  top: { alignItems: 'center', display: 'flex', justifyContent: 'space-between', minHeight: 24 },
  title: {
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-semibold'],
    lineHeight: font['--oniva-font-lh-18'],
    margin: 0,
    paddingInlineEnd: 24,
  },
  text: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-18'],
    margin: 0,
  },
  actions: { display: 'flex', marginBlockStart: 4 },
  pattern: {
    color: colors['--oniva-color-border'],
    height: 72,
    insetBlockStart: 0,
    insetInlineEnd: 0,
    pointerEvents: 'none',
    position: 'absolute',
    width: 96,
  },
});

export type NoticePattern = 'orbit' | 'grid' | 'rays';

export interface Notice {
  id: string;
  /** Small label in the pill, e.g. "Release". */
  badge?: string;
  title: string;
  text: string;
  action?: { label: string; href?: string; onClick?: () => void; external?: boolean };
  /** Line art in the top corner. */
  pattern?: NoticePattern;
}

export interface NotificationStackProps {
  notices: Notice[];
  /** Called when a notice is dismissed with its close button. */
  onDismiss?: (notice: Notice) => void;
  /** Accessible name of the region. */
  'aria-label'?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

function Pattern({ kind }: { kind: NoticePattern }) {
  return (
    <svg
      viewBox="0 0 96 72"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      {...stylex.props(styles.pattern)}
    >
      {kind === 'orbit' && (
        <>
          <circle cx="80" cy="-4" r="22" />
          <circle cx="80" cy="-4" r="40" />
          <circle cx="80" cy="-4" r="58" />
        </>
      )}
      {kind === 'grid' && (
        <>
          {[24, 48, 72].map((x) => (
            <path key={`v${x}`} d={`M${x} 0V72`} />
          ))}
          {[18, 36, 54].map((y) => (
            <path key={`h${y}`} d={`M0 ${y}H96`} />
          ))}
        </>
      )}
      {kind === 'rays' && [0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M96 0L${96 - 100 * Math.cos((i * Math.PI) / 11)} ${100 * Math.sin((i * Math.PI) / 11)}`} />)}
    </svg>
  );
}

/** Notice cards stacked behind each other: dismiss the front one to reveal the next. */
export function NotificationStack({
  notices,
  onDismiss,
  'aria-label': ariaLabel = 'Notifications',
  className,
  xstyle,
  ref,
}: NotificationStackProps) {
  const reduced = useReducedMotion();
  const after = useTimeouts();
  const removed = useRef(new Set<string>());
  const [, force] = useState(0);
  const [leaving, setLeaving] = useState<Set<string>>(() => new Set());

  const rootEl = useRef<HTMLElement | null>(null);
  const items = notices.filter((n) => !removed.current.has(n.id));
  const visible = items.filter((n) => !leaving.has(n.id));

  const frontId = visible[0]?.id;
  useLayoutEffect(() => {
    const root = rootEl.current;
    if (!root || !frontId) return;
    const front = root.querySelector<HTMLElement>(`[data-ns-front="true"]`);
    if (!front) return;
    const set = () => root.style.setProperty('--oniva-ns-h', `${front.offsetHeight}px`);
    set();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(set);
    ro.observe(front);
    return () => ro.disconnect();
  }, [frontId]);

  const dismiss = (n: Notice) => {
    onDismiss?.(n);
    const finish = () => {
      removed.current.add(n.id);
      setLeaving((s) => {
        const next = new Set(s);
        next.delete(n.id);
        return next;
      });
      force((x) => x + 1);
    };
    if (reduced) return finish();
    setLeaving((s) => new Set(s).add(n.id));
    after(260, finish);
  };

  return (
    <section
      ref={(node) => {
        rootEl.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as { current: HTMLElement | null }).current = node;
      }}
      aria-label={ariaLabel} {...mergeSx(stylex.props(styles.root, xstyle), className)}
    >
      {items
        .map((n) => ({ n, depth: visible.indexOf(n) }))
        .filter(({ depth }) => depth < 3)
        .reverse()
        .map(({ n, depth }) => {
          const gone = depth === -1;
          const behind = depth > 0;
          return (
            <article
              key={n.id}
              aria-labelledby={`${n.id}-title`}
              data-ns-front={depth === 0 ? 'true' : undefined}
              aria-hidden={behind || undefined}
              inert={behind || gone}
              {...stylex.props(
                styles.card,
                gone ? styles.gone : depth === 0 ? styles.d0 : depth === 1 ? styles.d1 : styles.d2,
                behind && styles.behind,
              )}
            >
              <Pattern kind={n.pattern ?? 'orbit'} />
              <div {...stylex.props(styles.body)}>
                <div {...stylex.props(styles.top)}>
                  {n.badge ? <Badge size="sm" variant="neutral">{n.badge}</Badge> : <span />}
                  <CloseButton
                    size="sm"
                    aria-label={`Dismiss ${n.title}`}
                    onPress={() => dismiss(n)}
                  />
                </div>
                <h3 id={`${n.id}-title`} {...stylex.props(styles.title)}>
                  {n.title}
                </h3>
                <p {...stylex.props(styles.text)}>{n.text}</p>
                {n.action && (
                  <div {...stylex.props(styles.actions)}>
                    {n.action.href ? (
                      <LinkButton
                        size="sm"
                        variant="secondary"
                        href={n.action.href}
                        {...(n.action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        onPress={n.action.onClick}
                      >
                        {n.action.label}
                      </LinkButton>
                    ) : (
                      <Button size="sm" variant="secondary" onPress={n.action.onClick}>
                        {n.action.label}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </article>
          );
        })}
    </section>
  );
}
