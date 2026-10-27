import * as stylex from '@stylexjs/stylex';
import { Check, ShieldQuestion, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { enterExit } from '../../internal/motion-styles';
import { mergeSx } from '../../internal/sx';
import { Button } from '../../components/Button';
import { Kbd } from '../../components/Kbd';
import { VisuallyHidden } from '../../components/VisuallyHidden';
import { formatClock, w2s } from '../../internal/w2-parts';
import { AnimatedHeight } from '../../motion/AnimatedHeight';

const drawIcon = stylex.keyframes({ from: { strokeDashoffset: 24 }, to: { strokeDashoffset: 0 } });

const styles = stylex.create({
  draw: {
    animationDelay: '60ms',
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: drawIcon, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    strokeDasharray: 24,
  },
  bodyWrap: {
    filter: { default: 'blur(0)', '[data-leaving]': 'blur(3px)' },
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: 'filter',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  root: { overflow: 'hidden' },
  head: { alignItems: 'center', display: 'flex', gap: 10, paddingBlock: 10, paddingInline: 12 },
  titles: { display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 2, minWidth: 0 },
  title: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-medium'] },
  tool: { fontFamily: font['--oniva-font-mono'] },
  status: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
  ok: { color: colors['--oniva-color-success-fg'] },
  no: { color: colors['--oniva-color-danger-fg'] },
  body: {
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    paddingBlock: 10,
    paddingInline: 12,
  },
  args: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: 8,
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-mono'],
    fontSize: font['--oniva-font-size-12'],
    lineHeight: font['--oniva-font-lh-16'],
    margin: 0,
    maxHeight: 160,
    overflow: 'auto',
    padding: 10,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  details: { columnGap: 12, display: 'grid', fontSize: font['--oniva-font-size-12'], gridTemplateColumns: 'minmax(60px, auto) minmax(0, 1fr)', margin: 0, rowGap: 4 },
  dk: { color: colors['--oniva-color-text-muted'], margin: 0 },
  dv: { color: colors['--oniva-color-text'], margin: 0, overflowWrap: 'anywhere' },
  rowRoot: { borderRadius: 14 },
  rowHead: { paddingBlock: 8, paddingInline: 10 },
  rowIcon: { alignItems: 'center', backgroundColor: colors['--oniva-color-surface-inset'], borderRadius: 999, color: colors['--oniva-color-text-muted'], display: 'inline-flex', flexShrink: 0, height: 28, justifyContent: 'center', width: 28 },
  rowTitle: { fontSize: font['--oniva-font-size-14'] },
  rowActions: { alignItems: 'center', display: 'inline-flex', flexShrink: 0, gap: 6, marginInlineStart: 'auto' },
  tray: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 8 },
  clock: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums', marginInlineStart: 'auto' },
  clockWarn: { color: colors['--oniva-color-warning-fg'] },
  clockBase: { transitionDuration: motion['--oniva-motion-dur-base'], transitionProperty: 'color' },
  hint: { display: { default: 'inline-flex', '@media (pointer: coarse)': 'none', '@container (max-width: 400px)': 'none' }, marginInlineStart: 2 },
  wrap: { containerType: 'inline-size', width: '100%' },
  result: {
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    lineHeight: font['--oniva-font-lh-16'],
    paddingBlock: 10,
    paddingInline: 12,
  },
});

export type ToolApprovalRisk = 'low' | 'medium' | 'high';
export type ToolApprovalStatus = 'pending' | 'approved' | 'denied';

export interface ToolApprovalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children' | 'title'> {
  /** Tool identifier, e.g. `repo.merge_pull_request`. */
  toolName: string;
  /** What the agent wants to do, in plain language. */
  description?: string;
  /** Arguments preview (JSON-stringified). */
  args?: unknown;
  /** Controlled status; uncontrolled (starts pending) when omitted. */
  status?: ToolApprovalStatus;
  onApprove?: (opts: { always: boolean }) => void;
  /** `reason` is `timeout` when the countdown ran out, otherwise `user`. */
  onDeny?: (opts: { reason: 'user' | 'timeout' }) => void;
  /** Tinted badge in the header. Set it from the action, not the model's confidence. */
  risk?: ToolApprovalRisk;
  /** Key-value rows in the preview, above the raw arguments. */
  details?: Array<{ label: string; value: ReactNode }>;
  /** Custom preview content (recipients, a diff…), shown before the details. */
  preview?: ReactNode;
  /** Seconds until the request expires and is denied. Pauses while the card is hovered or focused. */
  expiresIn?: number;
  /** Called when the countdown runs out, right before `onDeny({ reason: 'timeout' })`. */
  onExpire?: () => void;
  /** Show the keyboard hints on the buttons. The shortcuts (Cmd/Ctrl+Enter approves, Esc denies) work either way. */
  shortcuts?: boolean;
  /** `card` (default) shows the full preview; `row` is a compact one-line request with inline Deny / Approve that settles into "Approved · just now". */
  variant?: 'card' | 'row';
  /** Result shown after approval (e.g. "Merged #482 into main"). */
  result?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const riskLabel = { low: 'Low risk', medium: 'Medium risk', high: 'High risk' } as const;

/** Human-in-the-loop confirmation for a tool call: risk badge, preview, approve / deny / always allow with shortcuts and a pausing countdown, then morphs to a result row. */
export function ToolApproval({
  toolName,
  description,
  args,
  status,
  onApprove,
  onDeny,
  result,
  risk,
  details,
  preview,
  expiresIn,
  onExpire,
  shortcuts = true,
  variant = 'card',
  className,
  xstyle,
  ref,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...rest
}: ToolApprovalProps) {
  const [inner, setInner] = useState<ToolApprovalStatus>('pending');
  const [always, setAlways] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const [left, setLeft] = useState(expiresIn ?? 0);
  const [paused, setPaused] = useState(false);
  const countdownId = useId();
  const st = status ?? inner;
  const fire = useRef({ onExpire, onDeny });
  fire.current = { onExpire, onDeny };

  const decide = (to: ToolApprovalStatus, alw = false, reason: 'user' | 'timeout' = 'user') => {
    setInner(to);
    setAlways(alw);
    setTimedOut(reason === 'timeout');
    if (to === 'approved') onApprove?.({ always: alw });
    else onDeny?.({ reason });
  };

  // A fresh request (status back to pending) restarts the countdown.
  useEffect(() => {
    if (st === 'pending') setLeft(expiresIn ?? 0);
  }, [st, expiresIn]);

  useEffect(() => {
    if (st !== 'pending' || !expiresIn || paused) return;
    const t = window.setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => window.clearInterval(t);
  }, [st, expiresIn, paused]);

  useEffect(() => {
    if (st === 'pending' && expiresIn && left === 0) {
      fire.current.onExpire?.();
      setInner('denied');
      setTimedOut(true);
      fire.current.onDeny?.({ reason: 'timeout' });
    }
  }, [left, st, expiresIn]);

  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || st !== 'pending') return;
    if (e.key === 'Escape') {
      e.preventDefault();
      decide('denied');
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      decide('approved');
    }
  };

  const isRow = variant === 'row';
  const sx = stylex.props(aiStyles.tile, styles.root, isRow && styles.rowRoot, xstyle);
  const label =
    st === 'pending'
      ? 'Approval required'
      : st === 'approved'
        ? always
          ? 'Approved, always allowed'
          : 'Approved'
        : timedOut
          ? 'Denied, timed out'
          : 'Denied';
  const warn = expiresIn !== undefined && left <= 10;
  return (
    <div className={stylex.props(styles.wrap).className}>
      <div
        {...rest}
        ref={ref}
        role="group"
        aria-label={description ?? toolName}
        aria-describedby={st === 'pending' && expiresIn ? countdownId : undefined}
        onKeyDown={handleKey}
        onMouseEnter={(e) => {
          setPaused(true);
          onMouseEnter?.(e);
        }}
        onMouseLeave={(e) => {
          setPaused(false);
          onMouseLeave?.(e);
        }}
        onFocus={(e) => {
          setPaused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false);
          onBlur?.(e);
        }}
        {...mergeSx(sx, className)}
      >
        <div {...stylex.props(styles.head, isRow && styles.rowHead)}>
          {isRow ? <span {...stylex.props(styles.rowIcon)}>{st === 'approved' ? <Check key="ok" size={14} aria-hidden="true" {...stylex.props(styles.ok, styles.draw)} /> : st === 'denied' ? <X key="no" size={14} aria-hidden="true" {...stylex.props(styles.no, styles.draw)} /> : <ShieldQuestion size={14} aria-hidden="true" />}</span> : st === 'approved' ? <Check key="ok" size={16} aria-hidden="true" {...stylex.props(styles.ok, styles.draw)} /> : st === 'denied' ? <X key="no" size={16} aria-hidden="true" {...stylex.props(styles.no, styles.draw)} /> : <ShieldQuestion size={16} aria-hidden="true" />}
          <div {...stylex.props(styles.titles)}>
            <span {...stylex.props(styles.title, isRow && styles.rowTitle)}>{description ?? 'Allow this tool to run?'}</span>
            {!isRow && <span {...stylex.props(styles.status, styles.tool)}>{toolName}</span>}
          </div>
          {risk && st === 'pending' && (
            <span {...stylex.props(w2s.tag, risk === 'high' ? w2s.tagDanger : risk === 'medium' ? w2s.tagWarning : w2s.tagNeutral)}>{riskLabel[risk]}</span>
          )}
          <span role="status" key={st} data-state="entering" {...stylex.props(styles.status, enterExit.blur, st === 'approved' && styles.ok, st === 'denied' && styles.no)}>
            {isRow && st !== 'pending' ? `${label} · just now` : isRow ? '' : label}
          </span>
          {isRow && st === 'pending' && (
            <span {...stylex.props(styles.rowActions)}>
              <Button size="sm" variant="ghost" aria-keyshortcuts="Escape" onPress={() => decide('denied')}>Deny</Button>
              <Button size="sm" aria-keyshortcuts="Control+Enter Meta+Enter" onPress={() => decide('approved')}>Approve</Button>
            </span>
          )}
        </div>
        <AnimatedHeight isOpen={st === 'pending' && !(isRow && !preview && !(details && details.length) && args === undefined)}>
          <div data-leaving={st !== 'pending' ? '' : undefined} {...stylex.props(styles.body, styles.bodyWrap)}>
            {preview}
            {details && details.length > 0 && (
              <dl {...stylex.props(styles.details)}>
                {details.map((d) => (
                  <div key={d.label} style={{ display: 'contents' }}>
                    <dt {...stylex.props(styles.dk)}>{d.label}</dt>
                    <dd {...stylex.props(styles.dv)}>{d.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {args !== undefined && <pre tabIndex={0} aria-label="Arguments" {...stylex.props(styles.args)}>{JSON.stringify(args, null, 2)}</pre>}
            {!isRow && <div {...stylex.props(styles.tray)}>
              <Button size="sm" aria-keyshortcuts="Control+Enter Meta+Enter" onPress={() => decide('approved')}>
                Approve {shortcuts && <Kbd size="sm" aria-hidden="true" xstyle={styles.hint}>⌘↵</Kbd>}
              </Button>
              <Button size="sm" variant="secondary" onPress={() => decide('approved', true)}>Always allow</Button>
              <Button size="sm" variant="ghost" aria-keyshortcuts="Escape" onPress={() => decide('denied')}>
                Deny {shortcuts && <Kbd size="sm" aria-hidden="true" xstyle={styles.hint}>Esc</Kbd>}
              </Button>
              {expiresIn !== undefined && (
                <>
                  <span aria-hidden="true" {...stylex.props(styles.clock, styles.clockBase, warn && styles.clockWarn)}>
                    {paused ? 'Paused · ' : ''}Expires in {formatClock(left)}
                  </span>
                  <VisuallyHidden>
                    <span id={countdownId}>Expires in {Math.ceil(left)} seconds unless approved or denied. The timer pauses while you are on this card.</span>
                  </VisuallyHidden>
                </>
              )}
            </div>}
          </div>
        </AnimatedHeight>
        <AnimatedHeight isOpen={st === 'approved' && result !== undefined}>
          <div {...stylex.props(styles.result)}>{result}</div>
        </AnimatedHeight>
      </div>
    </div>
  );
}
