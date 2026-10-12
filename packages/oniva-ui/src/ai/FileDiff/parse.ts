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
