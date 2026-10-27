import * as stylex from '@stylexjs/stylex';
import { Check, ChevronDown, KeyRound, ShieldAlert, X } from 'lucide-react';
import { useEffect, useId, useState, type KeyboardEvent, type ReactNode, type Ref, type HTMLAttributes } from 'react';
import { Radio, RadioGroup } from 'react-aria-components';
import { VisuallyHidden } from 'react-aria';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { focus } from '../../internal/focus';
import { enterExit } from '../../internal/motion-styles';
import { mergeSx, sxClass } from '../../internal/sx';
import { pluralize } from '../../internal/format';
import { prefersReducedMotion } from '../../internal/motion-hooks';
import { Announcer, formatClock, useAnnouncer, useNow, w2s } from '../../internal/w2-parts';
import { Button } from '../../components/Button';
import { Kbd } from '../../components/Kbd';
import { AnimatedHeight } from '../../motion/AnimatedHeight';

const NARROW = '@container (max-width: 340px)';

const rise = stylex.keyframes({
  from: { opacity: 0, transform: `translateY(${motion['--oniva-motion-travel']})` },
  to: { opacity: 1, transform: 'translateY(0)' },
});

const pop = stylex.keyframes({
  '0%': { opacity: 0, transform: 'scale(0.5)' },
  '60%': { opacity: 1, transform: 'scale(1.15)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
});

const styles = stylex.create({
  iconPop: {
    animationDelay: '120ms',
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: pop, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  wrap: { containerType: 'inline-size', maxWidth: 400, width: '100%' },
  card: { display: 'flex', flexDirection: 'column', fontFamily: font['--oniva-font-sans'], gap: 12, padding: 14 },
  head: { alignItems: 'center', display: 'flex', gap: 10 },
  avatar: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-accent-soft'],
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-accent-soft-fg'],
    display: 'flex',
    flexShrink: 0,
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-semibold'],
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  titles: { display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 2, minWidth: 0 },
  title: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-semibold'], margin: 0 },
  target: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'inline-flex', fontSize: font['--oniva-font-size-12'], gap: 4, minWidth: 0 },
  reason: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-18'],
    margin: 0,
    paddingInlineStart: { default: 42, [NARROW]: 0 },
  },
  preview: { backgroundColor: colors['--oniva-color-surface-inset'], borderRadius: radius['--oniva-radius-md'], display: 'flex', flexDirection: 'column', gap: 2, padding: 8 },
  previewTitle: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-11'], fontWeight: font['--oniva-font-weight-medium'], letterSpacing: font['--oniva-font-track-label'], margin: 0, paddingBlockEnd: 4, paddingInline: 4, textTransform: 'uppercase' },
  list: { display: 'flex', flexDirection: 'column', gap: 2, listStyle: 'none', margin: 0, padding: 0 },
  row: {
    alignItems: 'center',
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: rise, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    color: colors['--oniva-color-text'],
    display: 'flex',
    fontSize: font['--oniva-font-size-13'],
    gap: 8,
    justifyContent: 'space-between',
    minWidth: 0,
    paddingBlock: 3,
    paddingInline: 4,
  },
  rowLabel: { alignItems: 'center', display: 'inline-flex', gap: 6, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  meta: { color: colors['--oniva-color-text-muted'], flexShrink: 0, fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums' },
  more: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors['--oniva-color-accent-text'],
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-12'],
    gap: 4,
    minHeight: { default: 24, '@media (pointer: coarse)': 36 },
    paddingInline: 4,
  },
  scopes: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-md'],
    display: 'flex',
    gap: 2,
    padding: 2,
  },
  scope: {
    alignItems: 'center',
    backgroundColor: { default: 'transparent', '[data-selected]': colors['--oniva-color-surface-inner'], '[data-hovered]': colors['--oniva-color-surface-hover'] },
    borderRadius: radius['--oniva-radius-sm'],
    boxShadow: { default: 'none', '[data-selected]': `0 0 0 1px ${colors['--oniva-color-border']}` },
    color: { default: colors['--oniva-color-text-muted'], '[data-selected]': colors['--oniva-color-text'] },
    cursor: 'pointer',
    display: 'flex',
    flexBasis: 0,
    flexGrow: 1,
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    justifyContent: 'center',
    minHeight: { default: 28, '@media (pointer: coarse)': 40 },
    paddingInline: 8,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: -2,
    outlineStyle: { default: 'none', '[data-focus-visible]': 'solid' },
    outlineWidth: 2,
  },
  actions: { display: 'flex', gap: 8, justifyContent: 'flex-end' },
  grow: { flexGrow: { default: 0, [NARROW]: 1 }, flexBasis: { default: 'auto', [NARROW]: 0 } },
  hint: { display: { default: 'inline-flex', [NARROW]: 'none', '@media (pointer: coarse)': 'none' }, marginInlineStart: 4 },
  label: { display: 'inline-flex' },
  resolved: {
    alignItems: 'center',
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-13'],
    gap: 8,
    outlineStyle: 'none',
    paddingBlock: 10,
    paddingInline: 12,
    position: 'relative',
  },
  resolvedCol: { display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 1, minWidth: 0 },
  resolvedSub: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums' },
  resolvedText: { color: colors['--oniva-color-text'], fontWeight: font['--oniva-font-weight-medium'], minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  okIcon: { color: colors['--oniva-color-success-fg'], flexShrink: 0 },
  noIcon: { color: colors['--oniva-color-danger-fg'], flexShrink: 0 },
  drain: {
    backgroundColor: colors['--oniva-color-success-solid'],
    bottom: 0,
    height: 2,
    insetInlineStart: 0,
    position: 'absolute',
    transformOrigin: 'left center',
    transitionDuration: '1s',
    transitionProperty: 'transform',
    transitionTimingFunction: 'linear',
    width: '100%',
  },
});

export type PermissionScope = 'once' | 'timed' | 'always';
export type PermissionRisk = 'safe' | 'risky' | 'destructive';

export interface PermissionPreviewItem {
  id: string;
  label: string;
  meta?: string;
  icon?: ReactNode;
}

export interface PermissionDecision {
  allow: boolean;
  scope: PermissionScope;
  /** Epoch ms of the answer. */
  at: number;
  /** Epoch ms a timed grant ends. */
  until?: number;
}

export interface PermissionRequestProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children' | 'defaultValue'> {
  agent: { name: string; model?: string; avatar?: ReactNode };
  /** Read after "wants to", e.g. `push to main`. */
  action: string;
  target?: string;
  toolIcon?: ReactNode;
  risk?: PermissionRisk;
  /** The agent's own words on why it needs this. */
  reason?: string;
  /** Exactly what will happen: files, recipients, amounts. */
  preview?: PermissionPreviewItem[];
  previewTitle?: string;
  /** Rows shown before "N more". */
  previewLimit?: number;
  scopes?: PermissionScope[];
  scope?: PermissionScope;
  defaultScope?: PermissionScope;
  onScopeChange?: (scope: PermissionScope) => void;
  /** Minutes a timed grant holds. */
  duration?: number;
  decision?: PermissionDecision | null;
  defaultDecision?: PermissionDecision | null;
  /** Called with the answer, or `null` for Revoke / Change / Ask again. */
  onDecisionChange?: (decision: PermissionDecision | null) => void;
  /** Clock (epoch ms) for the time left; without it a timed grant ticks every second. */
  now?: number;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

/** An agent asks for one specific right: who, why and exactly what will happen. Allow once, for a while or always; then it folds into one status line with time left and Revoke. */
export function PermissionRequest({
  agent,
  action,
  target,
  toolIcon,
  risk = 'risky',
  reason,
  preview,
  previewTitle = 'What will happen',
  previewLimit = 3,
  scopes = ['once', 'timed', 'always'],
  scope: scopeProp,
  defaultScope = 'once',
  onScopeChange,
  duration = 60,
  decision: decisionProp,
  defaultDecision = null,
  onDecisionChange,
  now: nowProp,
  className,
  xstyle,
  ref,
  onKeyDown,
  ...rest
}: PermissionRequestProps) {
  const uid = useId();
  const titleId = `${uid}-title`;
  const reasonId = `${uid}-reason`;
  const [scopeState, setScopeState] = useState<PermissionScope>(defaultScope);
  const [decisionState, setDecisionState] = useState<PermissionDecision | null>(defaultDecision);
  const [showAll, setShowAll] = useState(false);
  const { message, announce } = useAnnouncer();
  const decision = decisionProp !== undefined ? decisionProp : decisionState;
  const allowed = risk === 'destructive' ? scopes.filter((s) => s !== 'always') : scopes;
  const requested = scopeProp ?? scopeState;
  const scope = allowed.includes(requested) ? requested : (allowed[0] ?? 'once');
  const timed = !!decision?.allow && decision.scope === 'timed' && decision.until !== undefined;
  const now = useNow(timed, 1000, nowProp);
  // Fold: the card stays mounted while its height glides to 0 and the one-line status glides open (grid-template-rows).
  const [settled, setSettled] = useState(!!decision || prefersReducedMotion());
  const [folded, setFolded] = useState(!!decision);
  useEffect(() => {
    if (!decision) {
      setSettled(false);
      setFolded(false);
      return;
    }
    if (prefersReducedMotion() || typeof Element === 'undefined' || typeof Element.prototype.animate !== 'function') {
      setSettled(true);
      setFolded(true);
      return;
    }
    const raf = requestAnimationFrame(() => setSettled(true));
    const t = window.setTimeout(() => setFolded(true), 260);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [decision]);

  const durationText = duration === 60 ? '1 hour' : duration % 60 === 0 && duration > 60 ? pluralize(duration / 60, { one: '# hour', other: '# hours' }) : pluralize(duration, { one: '# minute', other: '# minutes' });
  const scopeText = (s: PermissionScope) => (s === 'once' ? 'once' : s === 'timed' ? `for ${durationText}` : 'always');
  const scopeLabel = (s: PermissionScope) => (s === 'once' ? 'Just once' : s === 'timed' ? durationText.replace(/^1 hour$/, '1 hour') : 'Always');

  const commit = (d: PermissionDecision | null) => {
    if (decisionProp === undefined) setDecisionState(d);
    onDecisionChange?.(d);
  };
  const answer = (allow: boolean) => {
    const at = nowProp ?? Date.now();
    const d: PermissionDecision = { allow, scope: allow ? scope : 'once', at, ...(allow && scope === 'timed' ? { until: at + duration * 60_000 } : {}) };
    announce(allow ? `Allowed ${scopeText(scope)}: ${agent.name} can ${action}` : `Denied: ${agent.name} cannot ${action}`);
    commit(d);
  };
  const reset = () => {
    announce('Permission reset');
    commit(null);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || decision) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      answer(false);
    } else if (e.key === 'Enter' && !(e.target as HTMLElement).closest('button, [role="radio"], a')) {
      e.preventDefault();
      answer(true);
    }
  };

  const sx = stylex.props(styles.wrap, xstyle);

  const renderTile = (inner: ReactNode, live = false) => (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      <div data-state="entering" {...stylex.props(aiStyles.tile, enterExit.blur)}>
        {inner}
      </div>
      {live && !decision && <Announcer message={message} />}
    </div>
  );

  let resolvedEl: ReactNode = null;
  if (decision) {
    const left = decision.until !== undefined ? decision.until - now : undefined;
    const expired = left !== undefined && left <= 0;
    const total = duration * 60_000;
    const text = !decision.allow ? 'Denied' : expired ? 'Expired' : `Allowed ${scopeText(decision.scope)}`;
    resolvedEl = (
      <AnimatedHeight isOpen={settled || prefersReducedMotion()}>
        <div tabIndex={-1} {...stylex.props(styles.resolved)}>
          {decision.allow && !expired ? <Check size={16} aria-hidden="true" {...stylex.props(styles.okIcon, styles.iconPop)} /> : <X size={16} aria-hidden="true" {...stylex.props(styles.noIcon, styles.iconPop)} />}
          <span {...stylex.props(styles.resolvedCol)}>
            <span role="status" {...stylex.props(styles.resolvedText)}>
              <VisuallyHidden>{agent.name}: </VisuallyHidden>
              {text}
              <span {...stylex.props(w2s.muted)}> · {action}</span>
            </span>
            {timed && !expired && left !== undefined && decision.until !== undefined && (
              <span {...stylex.props(styles.resolvedSub)}>
                {formatClock(left / 1000)} left · until {new Date(decision.until).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </span>
          <Button size="xs" variant="ghost" onPress={reset}>
            {decision.allow && !expired ? 'Revoke' : expired ? 'Ask again' : 'Change'}
          </Button>
          {timed && !expired && left !== undefined && (
            <span aria-hidden="true" style={{ transform: `scaleX(${Math.max(0, Math.min(1, left / total))})` }} {...stylex.props(styles.drain)} />
          )}
        </div>
      </AnimatedHeight>
    );
  }

  const shown = preview ? (showAll ? preview : preview.slice(0, previewLimit)) : [];
  const hidden = preview ? preview.length - shown.length : 0;
  const riskTag = risk === 'safe' ? null : (
    <span {...stylex.props(w2s.tag, risk === 'destructive' ? w2s.tagDanger : w2s.tagWarning)}>
      {risk === 'destructive' ? <ShieldAlert size={11} aria-hidden="true" /> : null}
      {risk === 'destructive' ? 'Destructive' : 'Risky'}
    </span>
  );

  const card = (
      <AnimatedHeight isOpen={!decision}>
      <div
        role="dialog"
        aria-modal="false"
        aria-labelledby={titleId}
        aria-describedby={reason ? reasonId : undefined}
        onKeyDown={onKey}
        {...stylex.props(styles.card)}
      >
        <div {...stylex.props(styles.head)}>
          <span aria-hidden="true" {...stylex.props(styles.avatar)}>{agent.avatar ?? initials(agent.name)}</span>
          <div {...stylex.props(styles.titles)}>
            <h4 id={titleId} {...stylex.props(styles.title)}>
              {agent.name} wants to {action}
            </h4>
            {(target || agent.model) && (
              <span {...stylex.props(styles.target)}>
                {toolIcon ?? <KeyRound size={12} aria-hidden="true" />}
                <span {...stylex.props(w2s.mono)}>{target}</span>
                {agent.model && <span>{target ? '· ' : ''}{agent.model}</span>}
              </span>
            )}
          </div>
          {riskTag}
        </div>
        {reason && (
          <p id={reasonId} {...stylex.props(styles.reason)}>
            {reason}
          </p>
        )}
        {preview && preview.length > 0 && (
          <div {...stylex.props(styles.preview)}>
            <p {...stylex.props(styles.previewTitle)}>{previewTitle}</p>
            <ul {...stylex.props(styles.list)}>
              {shown.map((p, i) => (
                <li key={p.id} style={{ animationDelay: `${Math.min(i, 6) * 40}ms` }} {...stylex.props(styles.row)}>
                  <span {...stylex.props(styles.rowLabel)}>
                    {p.icon}
                    {p.label}
                  </span>
                  {p.meta && <span {...stylex.props(styles.meta)}>{p.meta}</span>}
                </li>
              ))}
            </ul>
            {hidden > 0 && (
              <button type="button" aria-expanded={showAll} onClick={() => setShowAll(true)} {...stylex.props(styles.more, focus.ring)}>
                <ChevronDown size={12} aria-hidden="true" /> {pluralize(hidden, { one: '# more', other: '# more' })}
              </button>
            )}
          </div>
        )}
        {allowed.length > 1 && (
          <RadioGroup
            aria-label="How long"
            orientation="horizontal"
            value={scope}
            onChange={(v) => {
              setScopeState(v as PermissionScope);
              onScopeChange?.(v as PermissionScope);
            }}
            className={() => sxClass(stylex.props(styles.scopes))}
          >
            {allowed.map((s) => (
              <Radio key={s} value={s} className={() => sxClass(stylex.props(styles.scope))}>
                {scopeLabel(s)}
              </Radio>
            ))}
          </RadioGroup>
        )}
        <div {...stylex.props(styles.actions)}>
          <Button size="sm" variant="ghost" aria-keyshortcuts="Escape" xstyle={styles.grow} onPress={() => answer(false)}>
            Deny
            <Kbd size="sm" aria-hidden="true" xstyle={styles.hint}>Esc</Kbd>
          </Button>
          <Button size="sm" variant={risk === 'destructive' ? 'danger' : 'primary'} aria-keyshortcuts="Enter" xstyle={styles.grow} onPress={() => answer(true)}>
            <span key={scope} data-state="entering" {...stylex.props(styles.label, enterExit.blur)}>
              {`Allow ${scopeText(scope)}`}
            </span>
            <Kbd size="sm" aria-hidden="true" xstyle={styles.hint}>↵</Kbd>
          </Button>
        </div>
      </div>
      </AnimatedHeight>
  );
  return renderTile(
    <>
      {(!decision || !folded) && card}
      {resolvedEl}
    </>,
    true,
  );
}
