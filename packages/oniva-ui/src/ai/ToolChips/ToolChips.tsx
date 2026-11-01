import * as stylex from '@stylexjs/stylex';
import { ChevronDownIcon, FileTextIcon, LoaderIcon, MessageSquareIcon, PencilIcon, SearchIcon, SparklesIcon, TerminalIcon, TriangleAlertIcon } from '../../icons/IconSet';
import { useId, useRef, useState, type CSSProperties, type ComponentType, type HTMLAttributes, type Ref } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { pluralize } from '../../internal/format';
import { focus } from '../../internal/focus';
import { mergeSx, sxClass } from '../../internal/sx';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { Shimmer } from '../../motion/Shimmer';

const popIn = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(0.95)' },
  to: { opacity: 1, transform: 'scale(1)' },
});
const fadeIn = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const spin = stylex.keyframes({ to: { transform: 'rotate(1turn)' } });
const swapIn = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(0.6)' },
  to: { opacity: 1, transform: 'scale(1)' },
});

const styles = stylex.create({
  root: { alignItems: 'flex-start', display: 'flex', flexDirection: 'column', fontFamily: font['--oniva-font-sans'], maxWidth: 440, width: '100%' },
  trigger: {
    color: colors['--oniva-color-text-muted'],
    fontVariantNumeric: 'tabular-nums',
    gap: 8,
    paddingBlock: 4,
    width: 'auto',
  },
  triggerStatic: { cursor: 'default' },
  chevron: {
    color: colors['--oniva-color-icon-muted'],
    transform: { default: 'rotate(-90deg)', '[data-open]': 'rotate(0deg)' },
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  body: { display: 'flex', flexDirection: 'column', gap: 12, paddingBlockStart: 6, width: '100%' },
  calls: { display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', margin: 0, padding: 0 },
  call: {
    alignItems: 'center',
    animationDelay: 'calc(var(--oniva-i, 0) * 80ms)',
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'backwards',
    animationName: { default: popIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'flex',
    gap: 10,
    minHeight: 34,
    transformOrigin: 'left center',
  },
  icon: {
    alignItems: 'center',
    color: colors['--oniva-color-icon-muted'],
    display: 'inline-flex',
    flexShrink: 0,
    justifyContent: 'center',
    width: 16,
  },
  iconWrap: { display: 'inline-flex' },
  sr: {
    borderWidth: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
  },
  iconSwap: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationName: { default: swapIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-spring'],
  },
  iconError: { color: colors['--oniva-color-danger-fg'] },
  spinner: {
    animationDuration: '800ms',
    animationIterationCount: 'infinite',
    animationName: { default: spin, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
    color: colors['--oniva-color-accent-soft-fg'],
  },
  label: {
    color: colors['--oniva-color-text'],
    flexShrink: 0,
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    maxWidth: '70%',
    minWidth: 0,
    overflowWrap: 'anywhere',
  },
  target: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-md'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text-muted'],
    flexGrow: 1,
    fontFamily: font['--oniva-font-mono'],
    fontSize: font['--oniva-font-size-13'],
    minWidth: 0,
    overflow: 'hidden',
    paddingBlock: 6,
    paddingInline: 10,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  targetError: { color: colors['--oniva-color-danger-fg'] },
  rule: {
    animationDelay: '200ms',
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: fadeIn, [media.reducedMotion]: 'none' },
    backgroundColor: colors['--oniva-color-border'],
    borderWidth: 0,
    height: 1,
    margin: 0,
    width: '100%',
  },
  edits: { display: 'flex', flexWrap: 'wrap', gap: 8, listStyle: 'none', margin: 0, maxWidth: '100%', padding: 0 },
  editFile: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  edit: {
    maxWidth: '100%',
    minWidth: 0,
    animationDelay: 'calc(var(--oniva-i, 0) * 70ms + 240ms)',
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: fadeIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-out',
  },
  editBtn: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: colors['--oniva-color-surface'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-hover'] },
    },
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: font['--oniva-font-mono'],
    fontSize: font['--oniva-font-size-13'],
    gap: 8,
    maxWidth: '100%',
    paddingBlock: 6,
    paddingInline: 10,
    transform: { default: 'scale(1)', ':active': 'scale(var(--oniva-motion-press-scale))' },
    transitionDuration: motion['--oniva-motion-dur-press'],
    transitionProperty: 'background-color, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  editStatic: { cursor: 'default' },
  add: { color: colors['--oniva-color-success-fg'], fontVariantNumeric: 'tabular-nums' },
  del: { color: colors['--oniva-color-danger-fg'], fontVariantNumeric: 'tabular-nums' },
  more: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors['--oniva-color-text-muted'],
    cursor: 'pointer',
    fontFamily: font['--oniva-font-mono'],
    fontSize: font['--oniva-font-size-12'],
    paddingBlock: 6,
    paddingInline: 4,
  },
});

export type ToolChipKind = 'thinking' | 'edit' | 'run' | 'read' | 'search' | 'message';

const kindIcon: Record<ToolChipKind, ComponentType<{ size?: number; 'aria-hidden'?: 'true' }>> = {
  thinking: SparklesIcon,
  edit: PencilIcon,
  run: TerminalIcon,
  read: FileTextIcon,
  search: SearchIcon,
  message: MessageSquareIcon,
};

export interface ToolChipCall {
  id: string;
  kind: ToolChipKind;
  /** Verb phrase, e.g. "Write 204 lines". */
  label: string;
  /** Monospace detail: file, command or note. */
  target?: string;
  /** `running` shows a spinner and a shimmering label. Default `done`. */
  status?: 'running' | 'done' | 'error';
}

export interface ToolChipEdit {
  id: string;
  file: string;
  added: number;
  removed: number;
}

export interface ToolChipsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  calls: ToolChipCall[];
  /** Files touched, rendered as diff chips below the calls. */
  edits?: ToolChipEdit[];
  /** Header text. Default "N tool calls". */
  summary?: string;
  defaultOpen?: boolean;
  /** Diff chips shown before "+N more". Default 3. */
  maxEdits?: number;
  onEditPress?: (edit: ToolChipEdit) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Compact tool-call summary: a collapsible list of icon + verb + monospace chip rows, then diff chips per edited file.
 * Rows pop in on an 80ms stagger, a running row swaps its spinner for the kind icon the moment it finishes, and
 * "+N more" reveals the remaining diff chips with the same entrance.
 */
export function ToolChips({ calls, edits = [], summary, defaultOpen = true, maxEdits = 3, onEditPress, className, xstyle, ref, ...rest }: ToolChipsProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [showAll, setShowAll] = useState(false);
  const uid = useId();
  const initial = useRef(calls.length);
  const text = summary ?? pluralize(calls.length, { one: '# tool call', other: '# tool calls' });
  const shown = showAll ? edits : edits.slice(0, maxEdits);
  const hidden = edits.length - shown.length;
  const nothing = calls.length === 0 && edits.length === 0;

  const sx = stylex.props(styles.root, xstyle);
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      <button
        type="button"
        aria-expanded={nothing ? undefined : open}
        aria-controls={nothing ? undefined : uid}
        disabled={nothing}
        onClick={() => setOpen((o) => !o)}
        {...stylex.props(aiStyles.triggerReset, styles.trigger, nothing && styles.triggerStatic)}
      >
        {!nothing && (
          <span data-open={open ? '' : undefined} aria-hidden="true" {...stylex.props(styles.chevron)}>
            <ChevronDownIcon size={14} />
          </span>
        )}
        <span>{text}</span>
      </button>
      <AnimatedHeight isOpen={open && !nothing} id={uid}>
        <div {...stylex.props(styles.body)}>
          <ul {...stylex.props(styles.calls)}>
            {calls.map((c, i) => {
              const Icon = kindIcon[c.kind];
              const running = c.status === 'running';
              const error = c.status === 'error';
              return (
                <li key={c.id} style={{ '--oniva-i': i < initial.current ? Math.min(i, 6) : 0 } as CSSProperties} {...stylex.props(styles.call)}>
                  <span {...stylex.props(styles.icon, error && styles.iconError)}>
                    {/* Re-keyed on status so a finished call pops its icon in where the spinner was. */}
                    <span key={c.status ?? 'idle'} {...stylex.props(styles.iconWrap, c.status === 'done' && styles.iconSwap)}>
                      {running ? (
                        <LoaderIcon size={16} aria-hidden="true" {...stylex.props(styles.spinner)} />
                      ) : error ? (
                        <TriangleAlertIcon size={16} aria-hidden="true" />
                      ) : (
                        <Icon size={16} aria-hidden="true" />
                      )}
                    </span>
                  </span>
                  <span {...stylex.props(styles.label)}>{running ? <Shimmer>{c.label}</Shimmer> : c.label}</span>
                  {c.target && <span {...stylex.props(styles.target, error && styles.targetError)}>{c.target}</span>}
                  {(running || error) && <span {...stylex.props(styles.sr)}>{running ? ' (running)' : ' (failed)'}</span>}
                </li>
              );
            })}
          </ul>
          {edits.length > 0 && (
            <>
              <hr aria-hidden="true" {...stylex.props(styles.rule)} />
              <ul aria-label="Edited files" {...stylex.props(styles.edits)}>
                {shown.map((e, i) => (
                  <li key={e.id} style={{ '--oniva-i': showAll && i >= maxEdits ? i - maxEdits : i } as CSSProperties} {...stylex.props(styles.edit)}>
                    <AriaButton
                      onPress={onEditPress ? () => onEditPress(e) : undefined}
                      aria-label={`${e.file}, ${e.added} added, ${e.removed} removed`}
                      className={sxClass(stylex.props(styles.editBtn, focus.ring, !onEditPress && styles.editStatic))}
                    >
                      <span {...stylex.props(styles.editFile)}>{e.file}</span>
                      <span aria-hidden="true" {...stylex.props(styles.add)}>
                        +{e.added}
                      </span>
                      <span aria-hidden="true" {...stylex.props(styles.del)}>
                        −{e.removed}
                      </span>
                    </AriaButton>
                  </li>
                ))}
                {hidden > 0 && (
                  <li>
                    <button type="button" onClick={() => setShowAll(true)} {...stylex.props(styles.more, focus.ring)}>
                      +{hidden} more
                    </button>
                  </li>
                )}
              </ul>
            </>
          )}
        </div>
      </AnimatedHeight>
    </div>
  );
}
