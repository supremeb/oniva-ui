import * as stylex from '@stylexjs/stylex';
import { Check, ChevronRight, X } from 'lucide-react';
import { useId, useMemo, useState, type HTMLAttributes, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { mergeSx } from '../../internal/sx';
import { Button } from '../../components/Button';
import { SegmentedControl, SegmentedControlItem } from '../../components/SegmentedControl';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { parseUnifiedDiff, toSplitRows, type DiffHunk, type DiffLine } from './parse';

const styles = stylex.create({
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
  sign: { color: colors['--oniva-color-text-muted'], paddingInlineStart: 8, userSelect: 'none', width: 12 },
});

export type HunkDecision = 'accepted' | 'rejected' | null;

export interface FileDiffProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  /** Unified diff text for one file (starting at the first `@@` hunk header). */
  diff: string;
  fileName: string;
  defaultView?: 'unified' | 'split';
  /** Show accept / reject buttons per hunk. */
  reviewable?: boolean;
  onHunkDecision?: (hunkIndex: number, decision: Exclude<HunkDecision, null>) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
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

function Hunk({ hunk, index, view, reviewable, decision, onDecide }: { hunk: DiffHunk; index: number; view: 'unified' | 'split'; reviewable: boolean; decision: HunkDecision; onDecide: (d: Exclude<HunkDecision, null>) => void }) {
  const [open, setOpen] = useState(true);
  const uid = useId();
  return (
    <div>
      <div {...stylex.props(styles.hunkHead)}>
        <button type="button" aria-expanded={open} aria-controls={uid} onClick={() => setOpen((o) => !o)} {...stylex.props(aiStyles.triggerReset, styles.hunkToggle)}>
          <ChevronRight size={14} aria-hidden="true" {...stylex.props(aiStyles.chevron, open && aiStyles.chevronOpen)} />
          <span>{hunk.header.replace(/ @@.*$/, ' @@')}</span>
          <span {...stylex.props(styles.stat)}>
            +{hunk.added} −{hunk.removed}
          </span>
        </button>
        {reviewable &&
          (decision ? (
            <span role="status" {...stylex.props(styles.decided, decision === 'accepted' ? styles.acc : styles.rej)}>
              {decision === 'accepted' ? 'Accepted' : 'Rejected'}
            </span>
          ) : (
            <>
              <Button size="xs" variant="ghost" aria-label={`Reject change ${index + 1}`} onPress={() => onDecide('rejected')}>
                <X size={12} aria-hidden="true" /> Reject
              </Button>
              <Button size="xs" variant="soft" aria-label={`Accept change ${index + 1}`} onPress={() => onDecide('accepted')}>
                <Check size={12} aria-hidden="true" /> Accept
              </Button>
            </>
          ))}
      </div>
      <AnimatedHeight isOpen={open} id={uid}>
        <div {...stylex.props(styles.scroll)} tabIndex={0} role="region" aria-label={`Hunk ${index + 1} changes`}>
          <table {...stylex.props(styles.table)}>
            <tbody {...stylex.props(decision === 'rejected' && styles.tbodyRejected)}>
              {view === 'unified' ? <Unified hunk={hunk} /> : <Split hunk={hunk} />}
            </tbody>
          </table>
        </div>
      </AnimatedHeight>
    </div>
  );
}

/** Unified / split file diff with line numbers, collapsible hunks and optional accept / reject per hunk. Syntax-neutral. */
export function FileDiff({ diff, fileName, defaultView = 'unified', reviewable = false, onHunkDecision, className, xstyle, ref, ...rest }: FileDiffProps) {
  const hunks = useMemo(() => parseUnifiedDiff(diff), [diff]);
  const [view, setView] = useState<'unified' | 'split'>(defaultView);
  const [decisions, setDecisions] = useState<HunkDecision[]>([]);
  const added = hunks.reduce((n, h) => n + h.added, 0);
  const removed = hunks.reduce((n, h) => n + h.removed, 0);
  const sx = stylex.props(aiStyles.tile, styles.root, xstyle);
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      <div {...stylex.props(styles.bar)}>
        <span {...stylex.props(styles.file)}>{fileName}</span>
        <span {...stylex.props(styles.add)}>+{added}</span>
        <span {...stylex.props(styles.del)}>−{removed}</span>
        <SegmentedControl aria-label="Diff view" size="sm" value={view} onChange={(v) => setView(v as 'unified' | 'split')}>
          <SegmentedControlItem value="unified">Unified</SegmentedControlItem>
          <SegmentedControlItem value="split">Split</SegmentedControlItem>
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
          onDecide={(d) => {
            setDecisions((prev) => {
              const next = [...prev];
              next[i] = d;
              return next;
            });
            onHunkDecision?.(i, d);
          }}
        />
      ))}
    </div>
  );
}
