import * as stylex from '@stylexjs/stylex';
import { Check, ChevronLeft, ChevronRight, Sparkles, Undo2, X } from 'lucide-react';
import { useEffect, useId, useMemo, useState, type HTMLAttributes, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { mergeSx } from '../../internal/sx';
import { Button } from '../../components/Button';
import { SegmentedControl, SegmentedControlItem } from '../../components/SegmentedControl';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { parseUnifiedDiff, toInlineRows, toSplitRows, type DiffHunk, type DiffLine } from './parse';
import { Kbd } from '../../components/Kbd';
import { Announcer, useAnnouncer } from '../../internal/w2-parts';
import { usePresence } from '../../motion/Presence';
import { enterExit } from '../../internal/motion-styles';
import { prefersReducedMotion } from '../../internal/motion-hooks';
import { media } from '../../tokens/media.stylex';

const drawCheck = stylex.keyframes({ from: { strokeDashoffset: 14 }, to: { strokeDashoffset: 0 } });

const styles = stylex.create({
  checkPath: {
    animationDelay: '80ms',
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: drawCheck, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    strokeDasharray: 14,
  },
  reviewed: { alignItems: 'center', color: colors['--oniva-color-success-fg'], display: 'inline-flex', fontSize: font['--oniva-font-size-12'], fontWeight: font['--oniva-font-weight-medium'], gap: 4 },
  bulk: { alignItems: 'center', display: 'inline-flex', gap: 6 },
  wordFold: {
    display: 'inline-grid',
    gridTemplateColumns: { default: '1fr', '[data-gone]': '0fr' },
    opacity: { default: 1, '[data-gone]': 0 },
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'grid-template-columns, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    verticalAlign: 'bottom',
  },
  wordInner: { minWidth: 0, overflow: 'hidden', whiteSpace: 'pre' },
  rowFold: {
    display: 'grid',
    gridTemplateRows: { default: '1fr', '[data-gone]': '0fr' },
    opacity: { default: 1, '[data-gone]': 0 },
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'grid-template-rows, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  rowInner: { minHeight: 0, overflow: 'hidden' },
  tint: {
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'background-color, color, text-decoration-color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  decidedIn: { display: 'inline-block' },
  root: { fontFamily: font['--oniva-font-sans'], overflow: 'hidden' },
  bar: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderBottomColor: colors['--oniva-color-border'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    display: 'flex',
    gap: 10,
    paddingBlock: 8,
    paddingInline: 12,
  },
  file: { color: colors['--oniva-color-text'], flexGrow: 1, fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-13'], minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  add: { color: colors['--oniva-color-success-fg'], fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-12'] },
  del: { color: colors['--oniva-color-danger-fg'], fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-12'] },
  hunkHead: { alignItems: 'center', backgroundColor: colors['--oniva-color-surface'], display: 'flex', gap: 8, paddingInlineEnd: 10 },
  hunkToggle: { color: colors['--oniva-color-text-muted'], flexGrow: 1, fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-12'], gap: 6, paddingBlock: 6, paddingInline: 12, width: 'auto' },
  stat: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
  decided: { fontSize: font['--oniva-font-size-12'], fontWeight: font['--oniva-font-weight-medium'] },
  acc: { color: colors['--oniva-color-success-fg'] },
  rej: { color: colors['--oniva-color-danger-fg'] },
  scroll: { overflowX: 'auto' },
  table: { borderCollapse: 'collapse', fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-12'], lineHeight: font['--oniva-font-lh-16'], minWidth: '100%', tableLayout: 'auto' },
  tbodyRejected: { opacity: 0.5, transitionDuration: motion['--oniva-motion-dur-base'], transitionProperty: 'opacity' },
  no: {
    color: colors['--oniva-color-text-subtle'],
    fontVariantNumeric: 'tabular-nums',
    minWidth: 36,
    paddingInline: 8,
    textAlign: 'end',
    userSelect: 'none',
    verticalAlign: 'top',
    width: 1,
  },
  code: { paddingInline: 8, whiteSpace: 'pre', width: '100%' },
  splitCode: { paddingInline: 8, whiteSpace: 'pre', width: '50%' },
  cAdd: { backgroundColor: colors['--oniva-color-success-bg'] },
  cDel: { backgroundColor: colors['--oniva-color-error-bg'] },
  cEmpty: { backgroundColor: colors['--oniva-color-surface-inset'] },
  wDel: { backgroundColor: colors['--oniva-color-error-bg'], color: colors['--oniva-color-danger-fg'], textDecorationColor: 'currentColor', textDecorationLine: 'line-through', textDecorationThickness: 1 },
  wDelKept: { backgroundColor: 'transparent', color: 'inherit', textDecorationColor: 'transparent' },
  wInsKept: { backgroundColor: 'transparent', color: 'inherit' },
  wIns: { backgroundColor: colors['--oniva-color-success-bg'], color: colors['--oniva-color-success-fg'], textDecorationLine: 'none' },
  wPlain: { textDecorationLine: 'none' },
  inlineCode: { paddingInline: 8, whiteSpace: 'pre-wrap', width: '100%', wordBreak: 'break-word' },
  proseHead: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'flex', fontSize: font['--oniva-font-size-13'], gap: 8, paddingBlockStart: 14, paddingInline: 16 },
  proseSpark: { color: colors['--oniva-color-accent-soft-fg'] },
  proseBody: { display: 'flex', flexDirection: 'column', gap: 6, paddingBlock: 10, paddingInline: 16, paddingBlockEnd: 16 },
  proseP: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-16'], lineHeight: 1.7, margin: 0, position: 'relative' },
  proseActive: { borderRadius: 6, boxShadow: `0 0 0 4px ${colors['--oniva-color-accent-soft']}`, backgroundColor: colors['--oniva-color-accent-soft'] },
  proseSug: { cursor: 'pointer' },
  prosePop: { alignItems: 'center', backgroundColor: colors['--oniva-color-surface'], borderColor: colors['--oniva-color-border'], borderRadius: 10, borderStyle: 'solid', borderWidth: 1, boxShadow: '0 6px 20px rgba(0,0,0,0.18)', display: 'inline-flex', gap: 2, insetBlockStart: '100%', insetInlineStart: 0, marginBlockStart: 4, padding: 3, position: 'absolute', zIndex: 2 },
  proseFoot: { alignItems: 'center', borderTopColor: colors['--oniva-color-border'], borderTopStyle: 'solid', borderTopWidth: 1, display: 'flex', flexWrap: 'wrap', gap: 8, paddingBlock: 10, paddingInline: 16 },
  proseCount: { alignItems: 'center', backgroundColor: colors['--oniva-color-surface-inset'], borderRadius: 6, color: colors['--oniva-color-text'], display: 'inline-flex', fontSize: font['--oniva-font-size-13'], fontVariantNumeric: 'tabular-nums', fontWeight: font['--oniva-font-weight-medium'], justifyContent: 'center', minWidth: 24, paddingInline: 6 },
  proseSpacer: { flexGrow: 1 },
  hunkActions: { alignItems: 'center', display: 'flex', gap: 6 },
  hint: { display: { default: 'inline-flex', '@media (pointer: coarse)': 'none' }, marginInlineStart: 2 },
  sign: { color: colors['--oniva-color-text-muted'], paddingInlineStart: 8, userSelect: 'none', width: 12 },
});

export type HunkDecision = 'accepted' | 'rejected' | null;

export interface FileDiffProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  /** Unified diff text for one file (starting at the first `@@` hunk header). */
  diff: string;
  fileName: string;
  defaultView?: 'unified' | 'split' | 'inline';
  /** `prose` renders an inline word diff as flowing text with a floating Accept / Reject popover and an "Accept all" footer (use with `defaultView="inline"`). Default `code`. */
  layout?: 'code' | 'prose';
  /** Header text of the `prose` layout. */
  label?: string;
  /** Show accept / reject buttons per hunk. */
  reviewable?: boolean;
  onHunkDecision?: (hunkIndex: number, decision: Exclude<HunkDecision, null>) => void;
  /** Called when a decision is taken back with Undo (inline and other views). */
  onHunkUndo?: (hunkIndex: number) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

function ProseReview({ hunks, label }: { hunks: DiffHunk[]; label: string }) {
  const rows = useMemo(() => hunks.flatMap((h) => toInlineRows(h.lines)), [hunks]);
  const sugIdx = useMemo(() => {
    let n = 0;
    return rows.map((r) => (r.kind === 'ctx' ? -1 : n++));
  }, [rows]);
  const total = sugIdx.filter((x) => x >= 0).length;
  const [dec, setDec] = useState<HunkDecision[]>([]);
  const [active, setActive] = useState(0);
  const pending = Array.from({ length: total }, (_, i) => i).filter((i) => !dec[i]);
  const set = (i: number, d: HunkDecision) => setDec((p) => { const n = [...p]; n[i] = d; return n; });
  const go = (delta: number) => {
    if (!pending.length) return;
    const cur = pending.indexOf(active);
    const next = pending[(cur === -1 ? 0 : (cur + delta + pending.length) % pending.length)]!;
    setActive(next);
  };
  const decide = (i: number, d: Exclude<HunkDecision, null>) => {
    set(i, d);
    const rest = pending.filter((x) => x !== i);
    if (rest.length) setActive(rest.find((x) => x > i) ?? rest[0]!);
  };
  const all = (d: Exclude<HunkDecision, null>) => setDec(Array.from({ length: total }, (_, i) => dec[i] ?? d));
  return (
    <div
      onKeyDown={(e) => {
        if (e.metaKey || e.ctrlKey || e.altKey || !pending.includes(active)) return;
        const k = e.key.toLowerCase();
        if (k === 'y' || k === 'n') {
          e.preventDefault();
          decide(active, k === 'y' ? 'accepted' : 'rejected');
        }
      }}
    >
      <div {...stylex.props(styles.proseHead)}>
        <Sparkles size={14} aria-hidden="true" {...stylex.props(styles.proseSpark)} />
        <span>{label}</span>
      </div>
      <div {...stylex.props(styles.proseBody)}>
        {rows.map((r, i) => {
          const si = sugIdx[i]!;
          if (si < 0) return <p key={i} {...stylex.props(styles.proseP)}>{r.line.text}</p>;
          const d = dec[si] ?? null;
          const isActive = si === active && !d;
          const body =
            r.kind === 'changed'
              ? r.segments!.map((seg, k) => (seg.type === 'equal' ? <span key={k}>{seg.text}</span> : <Word key={k} kind={seg.type === 'del' ? 'del' : 'ins'} decision={d} text={seg.text} />))
              : r.kind === 'add'
                ? <Word kind="ins" decision={d} text={r.line.text} />
                : <Word kind="del" decision={d} text={r.line.text} />;
          return (
            <p key={i} {...stylex.props(styles.proseP)} onClick={() => !d && setActive(si)}>
              <span tabIndex={d ? undefined : 0} role={d ? undefined : 'button'} aria-label={d ? undefined : `Suggestion ${si + 1} of ${total}`} onFocus={() => !d && setActive(si)} {...stylex.props(!d && styles.proseSug, isActive && styles.proseActive)}>{body}</span>
              {isActive && (
                <span role="group" aria-label="Suggestion actions" {...stylex.props(styles.prosePop)}>
                  <Button size="xs" variant="soft" aria-keyshortcuts="Y" onPress={() => decide(si, 'accepted')}>
                    <Check size={12} aria-hidden="true" /> Accept <Kbd size="sm" aria-hidden="true" xstyle={styles.hint}>Y</Kbd>
                  </Button>
                  <Button size="xs" variant="ghost" aria-keyshortcuts="N" onPress={() => decide(si, 'rejected')}>
                    <X size={12} aria-hidden="true" /> Reject <Kbd size="sm" aria-hidden="true" xstyle={styles.hint}>N</Kbd>
                  </Button>
                </span>
              )}
            </p>
          );
        })}
      </div>
      <div {...stylex.props(styles.proseFoot)}>
        <span {...stylex.props(styles.proseCount)}>{pending.length}</span>
        <span>{pending.length === 1 ? 'suggestion' : 'suggestions'}</span>
        <span {...stylex.props(styles.proseSpacer)} />
        <Button size="xs" variant="ghost" isIconOnly aria-label="Previous suggestion" isDisabled={pending.length < 2} onPress={() => go(-1)}><ChevronLeft size={14} aria-hidden="true" /></Button>
        <Button size="xs" variant="ghost" isIconOnly aria-label="Next suggestion" isDisabled={pending.length < 2} onPress={() => go(1)}><ChevronRight size={14} aria-hidden="true" /></Button>
        <Button size="sm" variant="secondary" isDisabled={!pending.length} onPress={() => all('rejected')}>Reject all</Button>
        <Button size="sm" isDisabled={!pending.length} onPress={() => all('accepted')}>Accept all</Button>
      </div>
    </div>
  );
}

function cellBg(l: DiffLine | undefined) {
  return !l ? styles.cEmpty : l.type === 'add' ? styles.cAdd : l.type === 'del' ? styles.cDel : null;
}
const sign = (l: DiffLine | undefined) => (l?.type === 'add' ? '+' : l?.type === 'del' ? '−' : '');

function Unified({ hunk }: { hunk: DiffHunk }) {
  return (
    <>
      {hunk.lines.map((l, i) => (
        <tr key={i}>
          <td {...stylex.props(styles.no, cellBg(l))}>{l.oldNo ?? ''}</td>
          <td {...stylex.props(styles.no, cellBg(l))}>{l.newNo ?? ''}</td>
          <td aria-hidden="true" {...stylex.props(styles.sign, cellBg(l))}>{sign(l)}</td>
          <td {...stylex.props(styles.code, cellBg(l))}>
            {l.type !== 'ctx' && <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{l.type === 'add' ? 'Added: ' : 'Removed: '}</span>}
            {l.text || ' '}
          </td>
        </tr>
      ))}
    </>
  );
}

function Split({ hunk }: { hunk: DiffHunk }) {
  return (
    <>
      {toSplitRows(hunk.lines).map((r, i) => (
        <tr key={i}>
          <td {...stylex.props(styles.no, cellBg(r.left))}>{r.left?.oldNo ?? ''}</td>
          <td {...stylex.props(styles.splitCode, cellBg(r.left))}>{r.left ? r.left.text || ' ' : ''}</td>
          <td {...stylex.props(styles.no, cellBg(r.right))}>{r.right?.newNo ?? ''}</td>
          <td {...stylex.props(styles.splitCode, cellBg(r.right))}>{r.right ? r.right.text || ' ' : ''}</td>
        </tr>
      ))}
    </>
  );
}

const canAnimate = () => !prefersReducedMotion() && typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function';

/** Stays mounted while it folds away (~260ms), then unmounts. Instant without animation support. */
function useFoldOut(gone: boolean) {
  const [mounted, setMounted] = useState(!gone);
  const [shown, setShown] = useState(gone ? false : true);
  useEffect(() => {
    if (!gone) {
      setMounted(true);
      setShown(true);
      return;
    }
    if (!canAnimate()) {
      setMounted(false);
      return;
    }
    setShown(false);
    const t = window.setTimeout(() => setMounted(false), 280);
    return () => window.clearTimeout(t);
  }, [gone]);
  return { mounted, folding: gone && !shown ? true : gone };
}

/** A changed word: struck words shrink to nothing on accept, new words shrink on reject; the other side settles into plain text. */
function Word({ kind, decision, text }: { kind: 'del' | 'ins'; decision: HunkDecision; text: string }) {
  const gone = (kind === 'del' && decision === 'accepted') || (kind === 'ins' && decision === 'rejected');
  const kept = (kind === 'del' && decision === 'rejected') || (kind === 'ins' && decision === 'accepted');
  const { mounted } = useFoldOut(gone);
  if (!mounted) return null;
  const Tag = kind === 'del' ? 'del' : 'ins';
  return (
    <span aria-hidden={gone || undefined} data-gone={gone ? '' : undefined} {...stylex.props(styles.wordFold)}>
      <Tag {...stylex.props(styles.wordInner, styles.tint, kind === 'del' ? styles.wDel : styles.wIns, kept && (kind === 'del' ? styles.wDelKept : styles.wInsKept))}>{text}</Tag>
    </span>
  );
}

function FoldRow({ gone, cells }: { gone: boolean; cells: Array<{ node: React.ReactNode; sx: Array<unknown> }> }) {
  const { mounted } = useFoldOut(gone);
  if (!mounted) return null;
  return (
    <tr aria-hidden={gone || undefined}>
      {cells.map((c, i) => (
        <td key={i} {...stylex.props(...(c.sx as []))}>
          <div data-gone={gone ? '' : undefined} {...stylex.props(styles.rowFold)}>
            <div {...stylex.props(styles.rowInner)}>{c.node}</div>
          </div>
        </td>
      ))}
    </tr>
  );
}

function Inline({ hunk, decision }: { hunk: DiffHunk; decision: HunkDecision }) {
  return (
    <>
      {toInlineRows(hunk.lines).map((r, i) => {
        if (r.kind === 'ctx') {
          return (
            <tr key={i}>
              <td {...stylex.props(styles.no)}>{r.oldNo ?? ''}</td>
              <td {...stylex.props(styles.no)}>{r.newNo ?? ''}</td>
              <td {...stylex.props(styles.inlineCode)}>{r.line.text || ' '}</td>
            </tr>
          );
        }
        const goneRow = (r.kind === 'del' && decision === 'accepted') || (r.kind === 'add' && decision === 'rejected');
        const bg = r.kind === 'changed' ? undefined : r.kind === 'add' ? (decision === 'accepted' ? undefined : styles.cAdd) : decision === 'rejected' ? undefined : styles.cDel;
        const body =
          r.kind === 'changed' ? (
            r.segments!.map((seg, k) =>
              seg.type === 'equal' ? <span key={k}>{seg.text}</span> : <Word key={k} kind={seg.type === 'del' ? 'del' : 'ins'} decision={decision} text={seg.text} />,
            )
          ) : r.kind === 'add' ? (
            <ins {...stylex.props(styles.wPlain)}>{r.line.text || ' '}</ins>
          ) : (
            <del {...stylex.props(decision === 'rejected' ? styles.wPlain : styles.wDel)}>{r.line.text || ' '}</del>
          );
        return (
          <FoldRow
            key={i}
            gone={goneRow}
            cells={[
              { node: r.oldNo ?? '', sx: [styles.no, styles.tint, bg] },
              { node: r.newNo ?? '', sx: [styles.no, styles.tint, bg] },
              { node: body, sx: [styles.inlineCode, styles.tint, bg] },
            ]}
          />
        );
      })}
    </>
  );
}

type View = 'unified' | 'split' | 'inline';

function Hunk({ hunk, index, view, reviewable, decision, onDecide, onUndo }: { hunk: DiffHunk; index: number; view: View; reviewable: boolean; decision: HunkDecision; onDecide: (d: Exclude<HunkDecision, null>) => void; onUndo: () => void }) {
  const [open, setOpen] = useState(true);
  const uid = useId();
  return (
    <div>
      <div
        {...stylex.props(styles.hunkHead)}
        onKeyDown={(e) => {
          if (!reviewable || decision || e.metaKey || e.ctrlKey || e.altKey) return;
          const k = e.key.toLowerCase();
          if (k === 'y') {
            e.preventDefault();
            onDecide('accepted');
          }
          else if (k === 'n') {
            e.preventDefault();
            onDecide('rejected');
          }
        }}
      >
        <button type="button" aria-expanded={open} aria-controls={uid} onClick={() => setOpen((o) => !o)} {...stylex.props(aiStyles.triggerReset, styles.hunkToggle)}>
          <ChevronRight size={14} aria-hidden="true" {...stylex.props(aiStyles.chevron, open && aiStyles.chevronOpen)} />
          <span>{hunk.header.replace(/ @@.*$/, ' @@')}</span>
          <span {...stylex.props(styles.stat)}>
            +{hunk.added} −{hunk.removed}
          </span>
        </button>
        {reviewable &&
          (decision ? (
            <span {...stylex.props(styles.hunkActions)}>
              <span data-state="entering" {...stylex.props(styles.decided, styles.decidedIn, enterExit.blur, decision === 'accepted' ? styles.acc : styles.rej)}>
                {decision === 'accepted' ? 'Accepted' : 'Rejected'}
              </span>
              <Button size="xs" variant="ghost" aria-label={`Undo decision for change ${index + 1}`} onPress={onUndo}>
                <Undo2 size={12} aria-hidden="true" /> Undo
              </Button>
            </span>
          ) : (
            <>
              <Button size="xs" variant="ghost" aria-label={`Reject change ${index + 1}`} aria-keyshortcuts="N" onPress={() => onDecide('rejected')}>
                <X size={12} aria-hidden="true" /> Reject <Kbd size="sm" aria-hidden="true" xstyle={styles.hint}>N</Kbd>
              </Button>
              <Button size="xs" variant="soft" aria-label={`Accept change ${index + 1}`} aria-keyshortcuts="Y" onPress={() => onDecide('accepted')}>
                <Check size={12} aria-hidden="true" /> Accept <Kbd size="sm" aria-hidden="true" xstyle={styles.hint}>Y</Kbd>
              </Button>
            </>
          ))}
      </div>
      <AnimatedHeight isOpen={open} id={uid}>
        <div {...stylex.props(styles.scroll)} tabIndex={0} role="region" aria-label={`Hunk ${index + 1} changes`}>
          <table {...stylex.props(styles.table)}>
            <tbody {...stylex.props(decision === 'rejected' && view !== 'inline' && styles.tbodyRejected)}>
              {view === 'unified' ? <Unified hunk={hunk} /> : view === 'split' ? <Split hunk={hunk} /> : <Inline hunk={hunk} decision={decision} />}
            </tbody>
          </table>
        </div>
      </AnimatedHeight>
    </div>
  );
}

/** Unified, split or inline (word-level) file diff with line numbers, collapsible hunks and optional accept / reject (Y / N, undo, all) per hunk. Syntax-neutral. */
export function FileDiff({ diff, fileName, defaultView = 'unified', layout = 'code', label = 'Suggested by AI', reviewable = false, onHunkDecision, onHunkUndo, className, xstyle, ref, ...rest }: FileDiffProps) {
  const hunks = useMemo(() => parseUnifiedDiff(diff), [diff]);
  const [view, setView] = useState<View>(defaultView);
  const [decisions, setDecisions] = useState<HunkDecision[]>([]);
  const { message, announce } = useAnnouncer();
  const added = hunks.reduce((n, h) => n + h.added, 0);
  const removed = hunks.reduce((n, h) => n + h.removed, 0);
  const pending = hunks.filter((_, i) => !decisions[i]).length;
  const bulk = usePresence(reviewable && pending > 1, { initial: false });
  const sx = stylex.props(aiStyles.tile, styles.root, xstyle);
  const decide = (i: number, d: Exclude<HunkDecision, null>) => {
    setDecisions((prev) => {
      const next = [...prev];
      next[i] = d;
      return next;
    });
    onHunkDecision?.(i, d);
    announce(`Change ${i + 1} ${d}. ${hunks.filter((_, k) => k !== i && !decisions[k]).length} left.`);
  };
  if (layout === 'prose') {
    return (
      <div {...rest} ref={ref} {...mergeSx(sx, className)}>
        <ProseReview hunks={hunks} label={label} />
      </div>
    );
  }
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      <div {...stylex.props(styles.bar)}>
        <span {...stylex.props(styles.file)}>{fileName}</span>
        <span {...stylex.props(styles.add)}>+{added}</span>
        <span {...stylex.props(styles.del)}>−{removed}</span>
        {reviewable && bulk.mounted && (
          <span {...bulk.presenceProps} ref={bulk.presenceProps.ref as React.Ref<HTMLSpanElement>} {...stylex.props(styles.bulk, enterExit.blur)}>
            <Button size="xs" variant="ghost" onPress={() => hunks.forEach((_, i) => !decisions[i] && decide(i, 'rejected'))}>Reject all</Button>
            <Button size="xs" variant="soft" onPress={() => hunks.forEach((_, i) => !decisions[i] && decide(i, 'accepted'))}>Accept all</Button>
          </span>
        )}
        {reviewable && hunks.length > 0 && pending === 0 && (
          <span data-state="entering" {...stylex.props(styles.reviewed, enterExit.blur)}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2.5 6.5l2.5 2.5 4.5-5.5" {...stylex.props(styles.checkPath)} />
            </svg>
            All changes reviewed
          </span>
        )}
        <SegmentedControl aria-label="Diff view" size="sm" value={view} onChange={(v) => setView(v as View)}>
          <SegmentedControlItem value="unified">Unified</SegmentedControlItem>
          <SegmentedControlItem value="split">Split</SegmentedControlItem>
          <SegmentedControlItem value="inline">Inline</SegmentedControlItem>
        </SegmentedControl>
      </div>
      {hunks.map((h, i) => (
        <Hunk
          key={h.header + i}
          hunk={h}
          index={i}
          view={view}
          reviewable={reviewable}
          decision={decisions[i] ?? null}
          onDecide={(d) => decide(i, d)}
          onUndo={() => {
            setDecisions((prev) => {
              const next = [...prev];
              next[i] = null;
              return next;
            });
            onHunkUndo?.(i);
            announce(`Change ${i + 1} back to pending`);
          }}
        />
      ))}
      <Announcer message={message} />
    </div>
  );
}
