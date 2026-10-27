/** Tiny answer markup parser shared by AiAnswer: paragraphs, "- " lists, **bold** and [1] / [1,3] citations. */

export type Inline =
  | { kind: 'text'; text: string }
  | { kind: 'bold'; text: string }
  | { kind: 'cite'; nums: number[] };

export type AnswerBlock = { kind: 'p'; inline: Inline[] } | { kind: 'ul'; items: Inline[][] };

const TOKEN = /\*\*([^*]+)\*\*|\[(\d+(?:\s*,\s*\d+)*)\]/g;

export function parseInline(src: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  for (const m of src.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) out.push({ kind: 'text', text: m[1] === undefined ? src.slice(last, at).replace(/\s+$/, '') : src.slice(last, at) });
    if (m[1] !== undefined) out.push({ kind: 'bold', text: m[1] });
    else out.push({ kind: 'cite', nums: m[2]!.split(',').map((n) => Number(n.trim())) });
    last = at + m[0].length;
  }
  if (last < src.length) out.push({ kind: 'text', text: src.slice(last) });
  return out;
}

/** Hides a half-typed marker (`[1`, `**bo`) at the very end of a streaming prefix. */
export function trimPartial(src: string): string {
  let out = src.replace(/\[[\d,\s]*$/, '');
  const stars = out.split('**').length - 1;
  if (stars % 2 === 1) out = out.slice(0, out.lastIndexOf('**'));
  return out;
}

export function parseAnswer(src: string): AnswerBlock[] {
  const blocks: AnswerBlock[] = [];
  for (const chunk of src.split(/\n\s*\n/)) {
    let para: string[] = [];
    let items: Inline[][] = [];
    const flushPara = () => {
      if (para.length) blocks.push({ kind: 'p', inline: parseInline(para.join(' ')) });
      para = [];
    };
    const flushList = () => {
      if (items.length) blocks.push({ kind: 'ul', items });
      items = [];
    };
    for (const line of chunk.split('\n')) {
      if (!line.trim()) continue;
      if (/^\s*-\s+/.test(line)) {
        flushPara();
        items.push(parseInline(line.replace(/^\s*-\s+/, '')));
      } else {
        flushList();
        para.push(line.trim());
      }
    }
    flushPara();
    flushList();
  }
  return blocks;
}

/** Plain text without markup, e.g. for copying. */
export function toPlain(src: string): string {
  return src.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\s*\[\d+(?:\s*,\s*\d+)*\]/g, '');
}

/** Splits `quote` into plain / marked pieces. Explicit `highlight` phrases win; otherwise words of 5+ letters shared with `context`. */
export function markQuote(quote: string, highlight: string[] | undefined, context: string[]): { text: string; mark: boolean }[] {
  const ranges: [number, number][] = [];
  const lower = quote.toLowerCase();
  if (highlight?.length) {
    for (const h of highlight) {
      const i = lower.indexOf(h.toLowerCase());
      if (i >= 0) ranges.push([i, i + h.length]);
    }
  } else {
    const ctx = new Set(context.join(' ').toLowerCase().match(/[\p{L}\p{N}]{5,}|\d+/gu) ?? []);
    for (const m of quote.matchAll(/[\p{L}\p{N}]{5,}|\d+/gu)) {
      if (ctx.has(m[0].toLowerCase())) ranges.push([m.index ?? 0, (m.index ?? 0) + m[0].length]);
    }
  }
  ranges.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [];
  for (const r of ranges) {
    const prev = merged[merged.length - 1];
    if (prev && r[0] <= prev[1] + 1) prev[1] = Math.max(prev[1], r[1]);
    else merged.push([...r]);
  }
  const out: { text: string; mark: boolean }[] = [];
  let at = 0;
  for (const [s, e] of merged) {
    if (s > at) out.push({ text: quote.slice(at, s), mark: false });
    out.push({ text: quote.slice(s, e), mark: true });
    at = e;
  }
  if (at < quote.length) out.push({ text: quote.slice(at), mark: false });
  return out;
}
