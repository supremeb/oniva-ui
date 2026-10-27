import * as stylex from '@stylexjs/stylex';
import { AlertCircle, Check, ChevronDown, Clock, RotateCcw, Wrench } from 'lucide-react';
import { Children, isValidElement, useEffect, useRef, useState, type ReactElement, type ReactNode, type Ref } from 'react';
import { Button as AriaButton, Disclosure, DisclosurePanel, Heading, type DisclosureProps } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { enterExit } from '../../internal/motion-styles';
import { aiStyles } from '../../internal/ai-styles';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { sxClass } from '../../internal/sx';
import { CodeSection, PendingNote } from '../../internal/w2-code';
import { Announcer, formatDuration, useNow } from '../../internal/w2-parts';
import { Spinner } from '../../components/Spinner';
import { Button } from '../../components/Button';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { Shimmer } from '../../motion/Shimmer';

const drawIcon = stylex.keyframes({ from: { strokeDashoffset: 24 }, to: { strokeDashoffset: 0 } });
const popIn = stylex.keyframes({
  '0%': { opacity: 0, transform: 'scale(0.6)' },
  '60%': { opacity: 1, transform: 'scale(1.08)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
});

const styles = stylex.create({
  draw: {
    animationDelay: '80ms',
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: drawIcon, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    strokeDasharray: 24,
  },
  // The panel stays rendered (not display:none / content-visibility:hidden) so AnimatedHeight can animate grid rows both ways.
  panelShow: { contentVisibility: 'visible', display: 'block' },
  statusSlot: { alignItems: 'center', display: 'inline-flex' },
  pop: {
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: popIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  root: { overflow: 'hidden' },
  trigger: { paddingBlock: 12, paddingInline: 16, gap: 10 },
  leadIcon: { alignItems: 'center', color: colors['--oniva-color-icon-muted'], display: 'inline-flex', flexShrink: 0 },
  flip: { transform: 'rotate(180deg)' },
  okDot: { alignItems: 'center', backgroundColor: colors['--oniva-color-accent-text'], borderRadius: '50%', color: colors['--oniva-color-surface-inner'], display: 'inline-flex', height: 14, justifyContent: 'center', width: 14 },
  statusText: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'inline-flex', fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums', gap: 6, flexShrink: 0 },
  failedText: { color: colors['--oniva-color-danger-fg'], fontSize: font['--oniva-font-size-13'] },
  name: {
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-mono'],
    fontSize: font['--oniva-font-size-13'],
    flexShrink: 0,
  },
  summary: {
    color: colors['--oniva-color-text-muted'],
    fontFamily: font['--oniva-font-mono'],
    fontSize: font['--oniva-font-size-13'],
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  human: { fontFamily: font['--oniva-font-sans'] },
  spacer: { flexGrow: 1 },
  body: {
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    paddingBlock: 16,
    paddingInline: 16,
  },
  err: { color: colors['--oniva-color-danger-fg'] },
  errorRow: {
    alignItems: 'flex-start',
    backgroundColor: colors['--oniva-color-danger-bg'],
    borderRadius: radius['--oniva-radius-md'],
    color: colors['--oniva-color-danger-fg'],
    display: 'flex',
    fontSize: font['--oniva-font-size-13'],
    gap: 8,
    padding: 10,
  },
  errorText: { flexGrow: 1, lineHeight: font['--oniva-font-lh-18'], margin: 0, minWidth: 0, overflowWrap: 'anywhere' },
  tile: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-sm'],
    color: colors['--oniva-color-icon-muted'],
    display: 'inline-flex',
    flexShrink: 0,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  groupHead: { gap: 10, paddingBlock: 4, paddingInline: 0 },
  stack: { alignItems: 'center', display: 'flex', flexShrink: 0 },
  stackItem: { marginInlineStart: -1 },
  tileBox: { borderColor: colors['--oniva-color-border'], borderStyle: 'solid', borderWidth: 1, height: 28, width: 28 },
  groupTitle: { alignItems: 'baseline', color: colors['--oniva-color-text'], display: 'inline-flex', fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-medium'], gap: 6, minWidth: 0 },
  groupMeta: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums', fontWeight: font['--oniva-font-weight-regular'] },
  groupList: { display: 'flex', flexDirection: 'column', gap: 8, paddingBlockStart: 8 },
});

export type ToolCallStatus = 'pending' | 'running' | 'success' | 'error';

export interface ToolCallCardProps extends Omit<DisclosureProps, 'className' | 'style' | 'children'> {
  /** Tool identifier, e.g. `query_warehouse`. */
  name: string;
  /** Arguments sent to the tool. Objects are pretty-printed and highlighted; JSON strings are parsed. */
  args?: unknown;
  status?: ToolCallStatus;
  /** Final duration as text, e.g. `1.2s`. Prefer `durationMs`. */
  duration?: string;
  /** Final duration in ms. While running, a live timer counts from `startedAt` (or from when the call started running). */
  durationMs?: number;
  /** Start time in ms since epoch; the live timer counts from here. */
  startedAt?: number;
  /** Short human summary shown instead of the raw `key=value` argument line. */
  summary?: ReactNode;
  /** Icon in the leading tile. */
  icon?: ReactNode;
  /** What the tool returned. `children` wins when both are given. */
  result?: unknown;
  /** Result shown in the expanded panel. */
  children?: ReactNode;
  /** Error message, shown with Retry when status is `error`. */
  error?: string;
  /** Shows a Retry button next to the error. */
  onRetry?: () => void;
  /** Opens the card when the call fails and closes it on the next run, unless someone toggled it by hand (uncontrolled only). */
  openOnError?: boolean;
  /** Height in px after which arguments and result are capped with a fade and "Show all". */
  maxCodeHeight?: number;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

function StatusGlyph({ status }: { status: ToolCallStatus }) {
  if (status === 'running') return <Spinner size="xs" label="Running" />;
  if (status === 'success') return <span {...stylex.props(styles.okDot)}><Check size={10} strokeWidth={3} aria-label="Succeeded" {...stylex.props(styles.draw)} /></span>;
  if (status === 'error') return <AlertCircle size={14} aria-label="Failed" {...stylex.props(styles.err)} />;
  return <Clock size={14} aria-label="Queued" />;
}

/** Status changes blur in (keyed by status); the success check draws itself. */
function StatusIcon({ status }: { status: ToolCallStatus }) {
  return (
    <span key={status} data-state="entering" {...stylex.props(styles.statusSlot, enterExit.blur)}>
      <StatusGlyph status={status} />
    </span>
  );
}

/** One agent tool invocation: name, summary, live timer, status, highlighted arguments and result with copy, and retry on error. */
export function ToolCallCard({
  name,
  args,
  status = 'success',
  duration,
  durationMs,
  startedAt,
  summary,
  icon,
  result,
  children,
  error,
  onRetry,
  openOnError = true,
  maxCodeHeight = 220,
  className,
  xstyle,
  ref,
  isExpanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  ...rest
}: ToolCallCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded || (openOnError && status === 'error'));
  const open = expandedProp ?? expanded;
  const touched = useRef(false);
  const prev = useRef(status);
  const running = status === 'running';
  const since = useRef<number>(startedAt ?? Date.now());
  if (running && prev.current !== 'running') since.current = startedAt ?? Date.now();
  const now = useNow(running, 100);

  // Open on failure and close again on the next run, unless someone toggled it by hand.
  useEffect(() => {
    if (expandedProp !== undefined || !openOnError) {
      prev.current = status;
      return;
    }
    if (status === 'error' && prev.current !== 'error' && !touched.current) setExpanded(true);
    else if (prev.current === 'error' && status !== 'error' && !touched.current) setExpanded(false);
    prev.current = status;
  }, [status, expandedProp, openOnError]);

  const argText =
    summary === undefined && args && typeof args === 'object' && !Array.isArray(args)
      ? Object.entries(args as Record<string, unknown>)
          .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
          .join(' ')
      : '';
  const timeText = running ? formatDuration(Math.max(0, now - since.current), true) : durationMs !== undefined ? formatDuration(durationMs) : duration;
  const hasResult = children != null || result !== undefined;
  const sx = stylex.props(aiStyles.tile, styles.root, xstyle);
  const announce = running ? `${name} running` : status === 'success' ? `${name} finished` : status === 'error' ? `${name} failed${error ? `: ${error}` : ''}` : '';

  return (
    <Disclosure
      {...rest}
      ref={ref}
      isExpanded={open}
      onExpandedChange={(v) => {
        touched.current = true;
        if (expandedProp === undefined) setExpanded(v);
        onExpandedChange?.(v);
      }}
      data-status={status}
      className={[sx.className, className].filter(Boolean).join(' ')}
    >
      {({ isExpanded }) => (
        <>
          <Heading level={3} {...stylex.props(aiStyles.heading)}>
            <AriaButton slot="trigger" className={() => sxClass(stylex.props(aiStyles.triggerReset, styles.trigger, focus.inset))}>
              <span aria-hidden="true" {...stylex.props(styles.leadIcon)}>{icon ?? <Wrench size={16} />}</span>
              <span {...stylex.props(styles.name)}>{name}</span>
              {summary !== undefined ? (
                <span {...stylex.props(styles.summary, styles.human)}>{summary}</span>
              ) : (
                argText && <span {...stylex.props(styles.summary)}>{argText}</span>
              )}
              <span {...stylex.props(styles.spacer)} />
              <span {...stylex.props(styles.statusText)}>
                {status === 'error' ? (
                  <span {...stylex.props(styles.failedText, styles.statusText)}>
                    <StatusIcon status={status} />
                    Failed
                  </span>
                ) : (
                  <>
                    <StatusIcon status={status} />
                    {timeText}
                  </>
                )}
              </span>
              <ChevronDown size={14} aria-hidden="true" {...stylex.props(aiStyles.chevron, isExpanded && styles.flip)} />
            </AriaButton>
          </Heading>
          <DisclosurePanel className={() => sxClass(stylex.props(styles.panelShow))}>
          <AnimatedHeight isOpen={isExpanded}>
            <div {...stylex.props(styles.body)}>
              {status === 'error' && (
                <div {...stylex.props(styles.errorRow)}>
                  <AlertCircle size={14} aria-hidden="true" />
                  <p {...stylex.props(styles.errorText)}>{error ?? 'The tool call failed.'}</p>
                  {onRetry && (
                    <Button size="xs" variant="secondary" onPress={onRetry}>
                      <RotateCcw size={12} aria-hidden="true" /> Retry
                    </Button>
                  )}
                </div>
              )}
              {args !== undefined && <CodeSection label="Arguments" value={args} cap={maxCodeHeight} />}
              {children != null ? (
                typeof children === 'string' ? (
                  <CodeSection label="Result" value={children} cap={maxCodeHeight} />
                ) : (
                  <div>
                    <PendingNote>Result</PendingNote>
                    {children}
                  </div>
                )
              ) : result !== undefined ? (
                <CodeSection label="Result" value={result} cap={maxCodeHeight} />
              ) : running ? (
                <PendingNote>Waiting for result…</PendingNote>
              ) : null}
              {args === undefined && !hasResult && status === 'success' && <PendingNote>No arguments or result.</PendingNote>}
            </div>
          </AnimatedHeight>
          </DisclosurePanel>
          <Announcer message={announce} />
        </>
      )}
    </Disclosure>
  );
}

export interface ToolCallGroupProps {
  /** `ToolCallCard` elements as direct children: the group reads their icon, status and duration for its header. */
  children: ReactNode;
  /** Label once nothing runs; defaults to "Used N tools". */
  label?: string;
  runningLabel?: string;
  /** Total in ms; otherwise the sum of the cards' `durationMs`. */
  durationMs?: number;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Folds several tool calls of one turn into a single summary line ("Used 3 tools · 2.4s") that opens to the cards. */
export function ToolCallGroup({ children, label, runningLabel = 'Using tools…', durationMs, defaultOpen = false, open: openProp, onOpenChange, className, xstyle, ref }: ToolCallGroupProps) {
  const f = useFormatters();
  const [openState, setOpenState] = useState(defaultOpen);
  const open = openProp ?? openState;
  const calls = Children.toArray(children)
    .filter(isValidElement)
    .map((c) => (c as ReactElement<Partial<ToolCallCardProps>>).props);
  const running = calls.some((c) => c.status === 'running');
  const failed = calls.filter((c) => c.status === 'error').length;
  const since = useRef(Date.now());
  const wasRunning = useRef(false);
  if (running && !wasRunning.current) since.current = Date.now();
  wasRunning.current = running;
  const now = useNow(running, 100);
  const sum = calls.length > 0 && calls.every((c) => c.durationMs != null) ? calls.reduce((t, c) => t + (c.durationMs ?? 0), 0) : undefined;
  const ms = running ? now - since.current : (durationMs ?? sum);
  const count = f.plural(calls.length, { one: 'Used # tool', other: 'Used # tools' });
  const title = running ? runningLabel : (label ?? count);
  return (
    <div ref={ref} data-running={running || undefined} className={[stylex.props(xstyle).className, className].filter(Boolean).join(' ')}>
      <AriaButtonToggle
        open={open}
        onToggle={() => {
          if (openProp === undefined) setOpenState(!open);
          onOpenChange?.(!open);
        }}
      >
        <span aria-hidden="true" {...stylex.props(styles.stack)}>
          {calls.slice(-3).map((c, i, arr) => (
            <span key={calls.length - arr.length + i} {...stylex.props(styles.tile, styles.tileBox, styles.pop, i > 0 && styles.stackItem)}>{c.icon ?? <Wrench size={12} />}</span>
          ))}
        </span>
        <span {...stylex.props(styles.groupTitle)}>
          {running ? <Shimmer>{title}</Shimmer> : title}
          {!running && failed > 0 && <span {...stylex.props(styles.groupMeta)}>· {f.number(failed)} failed</span>}
          {ms !== undefined && <span {...stylex.props(styles.groupMeta)}>· {formatDuration(ms, running)}</span>}
        </span>
      </AriaButtonToggle>
      <AnimatedHeight isOpen={open}>
        <div {...stylex.props(styles.groupList)}>{children}</div>
      </AnimatedHeight>
      <Announcer message={running ? runningLabel : `${count}${failed ? `, ${failed} failed` : ''}`} />
    </div>
  );
}

function AriaButtonToggle({ open, onToggle, children }: { open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <Heading level={3} {...stylex.props(aiStyles.heading)}>
      <AriaButton aria-expanded={open} onPress={onToggle} className={() => sxClass(stylex.props(aiStyles.triggerReset, styles.groupHead, focus.inset))}>
        {children}
        <ChevronDown size={14} aria-hidden="true" {...stylex.props(aiStyles.chevron, open && styles.flip)} />
      </AriaButton>
    </Heading>
  );
}
