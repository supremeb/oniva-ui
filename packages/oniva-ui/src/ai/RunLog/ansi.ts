/* eslint-disable no-control-regex */
export interface AnsiSpan {
  text: string;
  color?: 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'gray';
  bold?: boolean;
  dim?: boolean;
}

const COLORS: Record<number, AnsiSpan['color']> = {
  30: 'gray', 31: 'red', 32: 'green', 33: 'yellow', 34: 'blue', 35: 'magenta', 36: 'cyan',
  90: 'gray', 91: 'red', 92: 'green', 93: 'yellow', 94: 'blue', 95: 'magenta', 96: 'cyan',
};

/** Basic ANSI SGR parser: foreground 30-37 / 90-97, bold, dim, reset. Other escapes are stripped. */
export function parseAnsi(input: string): AnsiSpan[] {
  const out: AnsiSpan[] = [];
  const re = /\u001b\[([\d;]*)m/g;
  let color: AnsiSpan['color'];
  let bold = false;
  let dim = false;
  let last = 0;
  const push = (text: string) => {
    if (text) out.push({ text, color, bold, dim });
  };
  for (let m = re.exec(input); m; m = re.exec(input)) {
    push(input.slice(last, m.index));
    last = m.index + m[0].length;
    for (const c of (m[1] || '0').split(';').map(Number)) {
      if (c === 0) { color = undefined; bold = false; dim = false; }
      else if (c === 1) bold = true;
      else if (c === 2) dim = true;
      else if (c === 22) { bold = false; dim = false; }
      else if (c === 39) color = undefined;
      else if (COLORS[c]) color = COLORS[c];
    }
  }
  push(input.slice(last));
  return out.map((s) => ({ ...s, text: s.text.replace(/\u001b\[[\d;?]*[A-Za-z]/g, '') }));
}
