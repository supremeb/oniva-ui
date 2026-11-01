import * as stylex from '@stylexjs/stylex';
import { CheckIcon, ChevronDownIcon, GripIcon } from '../../icons/IconSet';
import { type CSSProperties, type HTMLAttributes, type ReactNode, type Ref, useRef } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { mergeSx, sxClass } from '../../internal/sx';

const nodeIn = stylex.keyframes({
  from: { opacity: 0, transform: `translateY(${motion['--oniva-motion-travel']}) scale(0.97)` },
  to: { opacity: 1, transform: 'translateY(0) scale(1)' },
});
const draw = stylex.keyframes({ from: { transform: 'scaleY(0)' }, to: { transform: 'scaleY(1)' } });
const travel = stylex.keyframes({
  '0%': { opacity: 0, transform: 'translateY(0)' },
  '15%': { opacity: 1 },
  '85%': { opacity: 1 },
  '100%': { opacity: 0, transform: 'translateY(var(--oniva-flow-gap, 44px))' },
});
const pulse = stylex.keyframes({
  '0%, 100%': { opacity: 0.35, transform: 'scale(0.8)' },
  '50%': { opacity: 1, transform: 'scale(1)' },
});
const tagIn = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const pop = stylex.keyframes({
  '0%': { opacity: 0, transform: 'scale(0.5)' },
  '60%': { opacity: 1, transform: 'scale(1.12)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
});

const styles = stylex.create({
  canvas: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    backgroundImage: `radial-gradient(${colors['--oniva-color-border-control']} 1px, transparent 1.2px)`,
    backgroundSize: '16px 16px',
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    fontFamily: font['--oniva-font-sans'],
    paddingBlock: 24,
    paddingInline: 16,
  },
  empty: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], lineHeight: font['--oniva-font-lh-16'], margin: 0, paddingBlock: 12, textAlign: 'center' },
  list: { alignItems: 'center', display: 'flex', flexDirection: 'column', listStyle: 'none', margin: 0, padding: 0 },
  item: { alignItems: 'center', display: 'flex', flexDirection: 'column', maxWidth: '100%', width: 460 },
  tagRow: { alignSelf: 'flex-start', marginBlockEnd: -1, paddingInlineStart: 8, position: 'relative', zIndex: 1 },
  tag: {
    animationDelay: 'calc(var(--oniva-i, 0) * 180ms + 120ms)',
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: tagIn, [media.reducedMotion]: 'none' },
    borderRadius: radius['--oniva-radius-md'],
    display: 'inline-block',
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    marginBlockEnd: 6,
    paddingBlock: 2,
    paddingInline: 8,
  },
  tagTrigger: { backgroundColor: colors['--oniva-color-purple-bg'], color: colors['--oniva-color-purple-fg'] },
  tagCondition: { backgroundColor: colors['--oniva-color-warning-bg'], color: colors['--oniva-color-warning-fg'] },
  tagAction: { backgroundColor: colors['--oniva-color-info-bg'], color: colors['--oniva-color-info-fg'] },
  node: {
    animationDelay: 'calc(var(--oniva-i, 0) * 180ms)',
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: nodeIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: {
      default: colors['--oniva-color-border'],
      '[data-active]': colors['--oniva-color-accent-soft-fg'],
    },
    borderRadius: radius['--oniva-radius-xxl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: {
      default: 'none',
      '[data-active]': `0 0 0 3px ${colors['--oniva-color-accent-soft']}`,
    },
    boxSizing: 'border-box',
    position: 'relative',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'border-color, box-shadow',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '100%',
  },
  head: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    boxSizing: 'border-box',
    color: 'inherit',
    display: 'flex',
    font: 'inherit',
    gap: 12,
    padding: 12,
    textAlign: 'start',
    width: '100%',
  },
  headPress: {
    backgroundColor: { default: 'transparent', ':hover': { default: null, [media.hover]: colors['--oniva-color-overlay-hover'] } },
    borderRadius: radius['--oniva-radius-xxl'],
    cursor: 'pointer',
    transitionDuration: motion['--oniva-motion-dur-instant'],
    transitionProperty: 'background-color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  iconTile: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-purple-bg'],
    borderRadius: radius['--oniva-radius-lg'],
    color: colors['--oniva-color-purple-fg'],
    display: 'inline-flex',
    flexShrink: 0,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  titles: { display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, overflowWrap: 'anywhere' },
  title: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-medium'], lineHeight: font['--oniva-font-lh-18'] },
  desc: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], lineHeight: font['--oniva-font-lh-16'] },
  status: { alignItems: 'center', display: 'inline-flex', flexShrink: 0, justifyContent: 'center', marginInlineStart: 'auto', width: 16 },
  running: {
    animationDuration: '1200ms',
    animationIterationCount: 'infinite',
    animationName: { default: pulse, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-in-out'],
    backgroundColor: colors['--oniva-color-accent-soft-fg'],
    borderRadius: radius['--oniva-radius-full'],
    height: 8,
    width: 8,
  },
  done: {
    alignItems: 'center',
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationName: { default: pop, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundColor: colors['--oniva-color-success-solid'],
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-success-on-solid'],
    display: 'inline-flex',
    height: 16,
    justifyContent: 'center',
    width: 16,
  },
  rows: { display: 'flex', flexDirection: 'column', gap: 6, margin: 0, paddingBlockEnd: 12, paddingBlockStart: 4, paddingInline: 12, listStyle: 'none' },
  row: { alignItems: 'flex-start', display: 'flex', gap: 6, minWidth: 0 },
  grip: { color: colors['--oniva-color-icon-subtle'], flexShrink: 0, marginBlockStart: 6 },
  join: { color: colors['--oniva-color-text-muted'], flexShrink: 0, fontSize: font['--oniva-font-size-13'], lineHeight: '28px', textAlign: 'start', width: 28 },
  chips: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 6, minWidth: 0 },
  chip: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    display: 'inline-flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-13'],
    gap: 4,
    height: 28,
    maxWidth: '100%',
    minWidth: 0,
    paddingInline: 8,
  },
  chipText: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  chipSoft: { backgroundColor: colors['--oniva-color-surface-tertiary'], borderColor: 'transparent' },
  op: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], overflowWrap: 'anywhere' },
  chev: { color: colors['--oniva-color-icon-muted'], flexShrink: 0 },
  dot: { borderRadius: radius['--oniva-radius-full'], flexShrink: 0, height: 8, width: 8 },
  dotAccent: { backgroundColor: colors['--oniva-color-accent-soft-fg'] },
  dotSuccess: { backgroundColor: colors['--oniva-color-success-solid'] },
  dotWarning: { backgroundColor: colors['--oniva-color-warning-solid'] },
  dotDanger: { backgroundColor: colors['--oniva-color-danger-solid'] },
  dotInfo: { backgroundColor: colors['--oniva-color-info-solid'] },
  // Connector: a hairline that draws down from the node above, with an optional pulse travelling along it.
  link: { flexShrink: 0, height: 'var(--oniva-flow-gap, 44px)', position: 'relative', width: 1 },
  line: {
    animationDelay: 'calc(var(--oniva-i, 0) * 180ms + 220ms)',
    animationDuration: motion['--oniva-motion-dur-sheet'],
    animationFillMode: 'backwards',
    animationName: { default: draw, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundColor: colors['--oniva-color-border-control'],
    inset: 0,
    position: 'absolute',
    transformOrigin: 'top',
  },
  spark: {
    animationDuration: '1500ms',
    animationIterationCount: 'infinite',
    animationName: { default: travel, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-in-out'],
    backgroundColor: colors['--oniva-color-accent-soft-fg'],
    borderRadius: radius['--oniva-radius-full'],
    height: 6,
    insetInlineStart: -2.5,
    position: 'absolute',
    top: 0,
    width: 6,
  },
  sr: { borderWidth: 0, clip: 'rect(0 0 0 0)', height: 1, margin: -1, overflow: 'hidden', padding: 0, position: 'absolute', whiteSpace: 'nowrap', width: 1 },
});

export type FlowNodeKind = 'trigger' | 'condition' | 'action';
export type FlowNodeStatus = 'idle' | 'running' | 'done';

export interface FlowCondition {
  id: string;
  /** Leading word: "If", "and", "or". */
  join?: string;
  subject?: string;
  subjectIcon?: ReactNode;
  field: string;
  operator?: string;
  value?: string;
  valueTone?: 'accent' | 'success' | 'warning' | 'danger' | 'info';
}

export interface FlowNode {
  id: string;
  kind: FlowNodeKind;
  title: string;
  description?: string;
  icon?: ReactNode;
  /** Tag above the card. Defaults to Trigger / If / Else / Action. */
  tag?: string;
  conditions?: FlowCondition[];
  status?: FlowNodeStatus;
}

export interface FlowchartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  nodes: FlowNode[];
  /** Node with the accent ring. */
  activeId?: string;
  /** Show a pulse travelling along every connector (a run in progress). */
  isRunning?: boolean;
  /** Makes each node header a button. */
  onNodePress?: (node: FlowNode) => void;
  /** Shown when `nodes` is empty. Default "No steps yet". */
  emptyLabel?: ReactNode;
  /** Distance between nodes in px. Default 44. */
  gap?: number;
  'aria-label'?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const tagStyle = { trigger: styles.tagTrigger, condition: styles.tagCondition, action: styles.tagAction } as const;
const tagText = { trigger: 'Trigger', condition: 'If / Else', action: 'Action' } as const;
const dotStyle = { accent: styles.dotAccent, success: styles.dotSuccess, warning: styles.dotWarning, danger: styles.dotDanger, info: styles.dotInfo } as const;

/**
 * Workflow canvas on a dotted grid: trigger, condition and action nodes joined by connectors. Nodes rise in on a 180ms
 * stagger while each connector draws down behind them; `isRunning` sends a pulse along the lines, `status` morphs a node's
 * corner marker (pulse -> drawn-in check) and `activeId` moves the accent ring (border + shadow transition).
 */
export function Flowchart({ nodes, activeId, isRunning = false, onNodePress, gap = 44, emptyLabel = 'No steps yet', className, xstyle, ref, 'aria-label': ariaLabel = 'Workflow', ...rest }: FlowchartProps) {
  const initial = useRef(nodes.length);
  const sx = stylex.props(styles.canvas, xstyle);
  const vars = { '--oniva-flow-gap': `${gap}px` } as CSSProperties;
  const running = nodes.filter((n) => n.status === 'running').at(-1);
  const announcement = running ? `${running.title}: running` : nodes.length > 0 && nodes.every((n) => n.status === 'done') ? 'Workflow complete' : '';
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className, vars)}>
      {nodes.length === 0 && <p {...stylex.props(styles.empty)}>{emptyLabel}</p>}
      <span role="status" {...stylex.props(styles.sr)}>
        {announcement}
      </span>
      <ol aria-label={ariaLabel} {...stylex.props(styles.list)}>
        {nodes.map((n, i) => {
          const idx = i < initial.current ? Math.min(i, 5) : 0; // stagger capped at 6 so long flows don't take seconds to appear
          const iv = { '--oniva-i': idx } as CSSProperties;
          const head = (
            <>
              {n.icon && (
                <span aria-hidden="true" {...stylex.props(styles.iconTile)}>
                  {n.icon}
                </span>
              )}
              <span {...stylex.props(styles.titles)}>
                <span {...stylex.props(styles.title)}>{n.title}</span>
                {n.description && <span {...stylex.props(styles.desc)}>{n.description}</span>}
              </span>
              {n.status && n.status !== 'idle' && (
                <span {...stylex.props(styles.status)}>
                  {n.status === 'running' ? (
                    <span aria-hidden="true" {...stylex.props(styles.running)} />
                  ) : (
                    <span aria-hidden="true" {...stylex.props(styles.done)}>
                      <CheckIcon size={10} strokeWidth={2.25} />
                    </span>
                  )}
                  <span {...stylex.props(styles.sr)}>{n.status === 'running' ? 'Running' : 'Done'}</span>
                </span>
              )}
            </>
          );
          return (
            <li key={n.id} aria-current={n.id === activeId ? 'step' : undefined} style={iv} {...stylex.props(styles.item)}>
              <div {...stylex.props(styles.tagRow)}>
                <span {...stylex.props(styles.tag, tagStyle[n.kind])}>{n.tag ?? tagText[n.kind]}</span>
              </div>
              <div data-active={n.id === activeId ? '' : undefined} {...stylex.props(styles.node)}>
                {onNodePress ? (
                  <AriaButton onPress={() => onNodePress(n)} className={sxClass(stylex.props(styles.head, styles.headPress, focus.ring))}>
                    {head}
                  </AriaButton>
                ) : (
                  <div {...stylex.props(styles.head)}>{head}</div>
                )}
                {n.conditions && n.conditions.length > 0 && (
                  <ul {...stylex.props(styles.rows)}>
                    {n.conditions.map((c) => (
                      <li key={c.id} {...stylex.props(styles.row)}>
                        <GripIcon size={14} aria-hidden="true" {...stylex.props(styles.grip)} />
                        <span {...stylex.props(styles.join)}>{c.join ?? ''}</span>
                        <span {...stylex.props(styles.chips)}>
                          {c.subject && (
                            <span title={c.subject} {...stylex.props(styles.chip)}>
                              {c.subjectIcon}
                              <span {...stylex.props(styles.chipText)}>{c.subject}</span>
                            </span>
                          )}
                          <span title={c.field} {...stylex.props(styles.chip, styles.chipSoft)}>
                            <span {...stylex.props(styles.chipText)}>{c.field}</span>
                            <ChevronDownIcon size={12} aria-hidden="true" {...stylex.props(styles.chev)} />
                          </span>
                          {c.operator && <span {...stylex.props(styles.op)}>{c.operator}</span>}
                          {c.value && (
                            <span title={c.value} {...stylex.props(styles.chip, styles.chipSoft)}>
                              {c.valueTone && <span aria-hidden="true" {...stylex.props(styles.dot, dotStyle[c.valueTone])} />}
                              <span {...stylex.props(styles.chipText)}>{c.value}</span>
                              <ChevronDownIcon size={12} aria-hidden="true" {...stylex.props(styles.chev)} />
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {i < nodes.length - 1 && (
                <span aria-hidden="true" style={iv} {...stylex.props(styles.link)}>
                  <span {...stylex.props(styles.line)} />
                  {(isRunning || n.status === 'running') && <span {...stylex.props(styles.spark)} />}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
