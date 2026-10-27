export interface DiffLine {
  type: 'add' | 'del' | 'ctx';
  text: string;
  oldNo?: number;
  newNo?: number;
}
export interface DiffHunk {
  header: string;
  lines: DiffLine[];
  added: number;
  removed: number;
}

/** Parses a unified diff string (single file) into hunks with line numbers. */
export function parseUnifiedDiff(diff: string): DiffHunk[] {
  const hunks: DiffHunk[] = [];
  let cur: DiffHunk | null = null;
  let o = 0;
  let n = 0;
  for (const raw of diff.replace(/\r\n/g, '\n').split('\n')) {
    const m = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(raw);
    if (m) {
      cur = { header: raw, lines: [], added: 0, removed: 0 };
      hunks.push(cur);
      o = Number(m[1]);
      n = Number(m[2]);
      continue;
    }
    if (!cur) continue;
    const c = raw[0];
    if (c === '+') {
      cur.lines.push({ type: 'add', text: raw.slice(1), newNo: n++ });
      cur.added++;
    } else if (c === '-') {
      cur.lines.push({ type: 'del', text: raw.slice(1), oldNo: o++ });
      cur.removed++;
    } else if (c === ' ') {
      cur.lines.push({ type: 'ctx', text: raw.slice(1), oldNo: o++, newNo: n++ });
    }
  }
  return hunks;
}

export interface SplitRow {
  left?: DiffLine;
  right?: DiffLine;
}

/** Pairs deletions with following additions for side-by-side rendering. */
export function toSplitRows(lines: DiffLine[]): SplitRow[] {
  const rows: SplitRow[] = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i]!;
    if (l.type === 'ctx') {
      rows.push({ left: l, right: l });
      i++;
      continue;
    }
    const dels: DiffLine[] = [];
    const adds: DiffLine[] = [];
    while (i < lines.length && lines[i]!.type === 'del') dels.push(lines[i++]!);
    while (i < lines.length && lines[i]!.type === 'add') adds.push(lines[i++]!);
    for (let k = 0; k < Math.max(dels.length, adds.length); k++) rows.push({ left: dels[k], right: adds[k] });
  }
  return rows;
}

export interface WordSegment {
  type: 'equal' | 'del' | 'ins';
  text: string;
}

const WORD = /\s+|[\p{L}\p{N}_]+|[^\s\p{L}\p{N}_]/gu;

/** Word-level diff of two strings (LCS over words, whitespace and punctuation tokens). Adjacent segments of the same type are merged. */
export function diffWords(a: string, b: string): WordSegment[] {
  const x = a.match(WORD) ?? [];
  const y = b.match(WORD) ?? [];
  const n = x.length;
  const m = y.length;
  const lcs: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) lcs[i]![j] = x[i] === y[j] ? lcs[i + 1]![j + 1]! + 1 : Math.max(lcs[i + 1]![j]!, lcs[i]![j + 1]!);
  const out: WordSegment[] = [];
  const push = (type: WordSegment['type'], text: string) => {
    const last = out[out.length - 1];
    if (last && last.type === type) last.text += text;
    else out.push({ type, text });
  };
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (x[i] === y[j]) {
      push('equal', x[i]!);
      i++;
      j++;
    }
    else if (lcs[i + 1]![j]! >= lcs[i]![j + 1]!) push('del', x[i++]!);
    else push('ins', y[j++]!);
  }
  while (i < n) push('del', x[i++]!);
  while (j < m) push('ins', y[j++]!);
  return out;
}

export interface InlineRow {
  line: DiffLine;
  /** Present for a deleted line paired with an added one: the merged word-level segments. */
  segments?: WordSegment[];
  oldNo?: number;
  newNo?: number;
  kind: 'ctx' | 'changed' | 'del' | 'add';
}

/** Pairs deleted and added lines of a hunk into one row each with word-level segments. */
export function toInlineRows(lines: DiffLine[]): InlineRow[] {
  const rows: InlineRow[] = [];
  let i = 0;
  while (i < lines.length) {
    const l = lines[i]!;
    if (l.type === 'ctx') {
      rows.push({ line: l, oldNo: l.oldNo, newNo: l.newNo, kind: 'ctx' });
      i++;
      continue;
    }
    const dels: DiffLine[] = [];
    const adds: DiffLine[] = [];
    while (i < lines.length && lines[i]!.type === 'del') dels.push(lines[i++]!);
    while (i < lines.length && lines[i]!.type === 'add') adds.push(lines[i++]!);
    const pairs = Math.min(dels.length, adds.length);
    for (let k = 0; k < pairs; k++) rows.push({ line: adds[k]!, segments: diffWords(dels[k]!.text, adds[k]!.text), oldNo: dels[k]!.oldNo, newNo: adds[k]!.newNo, kind: 'changed' });
    for (let k = pairs; k < dels.length; k++) rows.push({ line: dels[k]!, oldNo: dels[k]!.oldNo, kind: 'del' });
    for (let k = pairs; k < adds.length; k++) rows.push({ line: adds[k]!, newNo: adds[k]!.newNo, kind: 'add' });
  }
  return rows;
}
