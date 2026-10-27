import * as stylex from '@stylexjs/stylex';
import { Check, X } from 'lucide-react';
import { useId, useMemo, useState, type KeyboardEvent } from 'react';
import { focus } from './focus';
import { m8 } from './m8-motion';
import { s3 } from './s3-shell';
import { colors } from '../tokens/colors.stylex';
import { font } from '../tokens/font.stylex';
import { radius } from '../tokens/radius.stylex';

/** Word-level diff with per-change review (Tab between changes, Y accept, N reject). Shared by AgentRun and Evals. */

export type DiffDecision = 'accepted' | 'rejected' | null;
export interface DiffSegment {
  id: number | null;
  same?: string;
  del?: string;
  ins?: string;
}

export function diffWords(a: string, b: string): DiffSegment[] {
  const x = a.split(/(\s+|[.,;:!?])/).filter(Boolean);
  const y = b.split(/(\s+|[.,;:!?])/).filter(Boolean);
  const n = x.length;
  const m = y.length;
  const t: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      t[i]![j] = x[i] === y[j] ? t[i + 1]![j + 1]! + 1 : Math.max(t[i + 1]![j]!, t[i]![j + 1]!);
  const ops: Array<['s' | 'd' | 'i', string]> = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (x[i] === y[j]) {
      ops.push(['s', x[i++]!]);
      j++;
    } else if (t[i + 1]![j]! >= t[i]![j + 1]!) ops.push(['d', x[i++]!]);
    else ops.push(['i', y[j++]!]);
  }
  while (i < n) ops.push(['d', x[i++]!]);
  while (j < m) ops.push(['i', y[j++]!]);
  const out: DiffSegment[] = [];
  let k = 0;
  let nextId = 0;
  while (k < ops.length) {
    const op = ops[k]!;
    if (op[0] === 's') {
      const last = out[out.length - 1];
      if (last && last.same !== undefined) last.same += op[1];
      else out.push({ id: null, same: op[1] });
      k++;
      continue;
    }
    let del = '';
    let ins = '';
    // a change swallows the whitespace between its changed words
    while (k < ops.length) {
      const o = ops[k]!;
      const isGap = o[0] === 's' && /^\s+$/.test(o[1]) && ops[k + 1] && ops[k + 1]![0] !== 's';
      if (o[0] === 'd') del += o[1];
      else if (o[0] === 'i') ins += o[1];
      else if (isGap) {
        del += o[1];
        ins += o[1];
      } else break;
      k++;
    }
    out.push({ id: nextId++, del: del.trim() ? del : '', ins: ins.trim() ? ins : '' });
  }
  return out;
}

const styles = stylex.create({
  root: {
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: 1.7,
    margin: 0,
    overflowWrap: 'anywhere',
  },
  change: {
    borderRadius: radius['--oniva-radius-xs'],
    display: 'inline',
    outlineOffset: 2,
  },
  del: {
    backgroundColor: colors['--oniva-color-danger-bg'],
    borderRadius: radius['--oniva-radius-xs'],
    color: colors['--oniva-color-danger-fg'],
    textDecoration: 'line-through',
  },
  ins: {
    backgroundColor: colors['--oniva-color-success-bg'],
    borderRadius: radius['--oniva-radius-xs'],
    color: colors['--oniva-color-success-fg'],
    textDecoration: 'none',
  },
  tools: { display: 'inline-flex', gap: 2, marginInlineStart: 4, verticalAlign: 'middle' },
  mini: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-sm'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'inline-flex',
    height: 20,
    justifyContent: 'center',
    padding: 0,
    width: 20,
  },
  count: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
    margin: 0,
  },
  hint: { color: colors['--oniva-color-text-muted'] },
});

export interface ReviewDiffProps {
  original: string;
  suggested: string;
  label?: string;
  onDecision?: (index: number, decision: Exclude<DiffDecision, null>) => void;
  /** Resulting text after decisions. */
  onChange?: (text: string, decisions: DiffDecision[]) => void;
  /** Controlled decisions. */
  decisions?: DiffDecision[];
}

export function ReviewDiff({
  original,
  suggested,
  label,
  onDecision,
  onChange,
  decisions: controlled,
}: ReviewDiffProps) {
  const segs = useMemo(() => diffWords(original, suggested), [original, suggested]);
  const total = segs.filter((s) => s.id !== null).length;
  const [inner, setInner] = useState<DiffDecision[]>([]);
  const decisions = controlled ?? inner;
  const [msg, setMsg] = useState('');
  const hintId = useId();

  const textFor = (d: DiffDecision[]) =>
    segs
      .map((s) =>
        s.id === null
          ? s.same
          : d[s.id] === 'accepted'
            ? s.ins
            : d[s.id] === 'rejected'
              ? s.del
              : s.ins,
      )
      .join('');

  const decide = (id: number, decision: Exclude<DiffDecision, null>) => {
    const next = [...decisions];
    next[id] = decision;
    if (controlled === undefined) setInner(next);
    onDecision?.(id, decision);
    onChange?.(textFor(next), next);
    const left = segs.filter((s) => s.id !== null && !next[s.id!]).length;
    setMsg(`Change ${id + 1} of ${total} ${decision}. ${left} left to review.`);
  };

  const onKey = (id: number) => (e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (k === 'y') {
      e.preventDefault();
      decide(id, 'accepted');
    } else if (k === 'n') {
      e.preventDefault();
      decide(id, 'rejected');
    }
  };

  return (
    <div>
      <p {...stylex.props(styles.root)} aria-label={label}>
        {segs.map((s, idx) => {
          if (s.id === null) return <span key={idx}>{s.same}</span>;
          const d = decisions[s.id] ?? null;
          const id = s.id;
          const state = d ?? 'pending';
          return (
            <span
              key={idx}
              role="group"
              tabIndex={0}
              aria-label={`Change ${id + 1} of ${total}, ${state}. Press Y to accept, N to reject.`}
              data-decision={state}
              onKeyDown={onKey(id)}
              {...stylex.props(styles.change, focus.ring)}
            >
              {(d === null || d === 'rejected') && s.del ? (
                <del key={`d${state}`} {...stylex.props(styles.del, m8.fade)}>{s.del}</del>
              ) : null}
              {(d === null || d === 'accepted') && s.ins ? (
                <ins key={`i${state}`} {...stylex.props(styles.ins, m8.fade)}>{s.ins}</ins>
              ) : null}
              {d === null && (
                <span {...stylex.props(styles.tools, m8.pop)}>
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label={`Accept change ${id + 1}`}
                    onClick={() => decide(id, 'accepted')}
                    {...stylex.props(styles.mini)}
                  >
                    <Check size={12} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-label={`Reject change ${id + 1}`}
                    onClick={() => decide(id, 'rejected')}
                    {...stylex.props(styles.mini)}
                  >
                    <X size={12} aria-hidden="true" />
                  </button>
                </span>
              )}
            </span>
          );
        })}
      </p>
      <p id={hintId} {...stylex.props(styles.count)}>
        {total === 0
          ? 'No changes.'
          : `${decisions.filter(Boolean).length} of ${total} reviewed · Tab to move, Y accept, N reject`}
      </p>
      <span role="status" aria-live="polite" {...stylex.props(styles.hint, s3.srOnly)}>
        {msg}
      </span>
    </div>
  );
}
