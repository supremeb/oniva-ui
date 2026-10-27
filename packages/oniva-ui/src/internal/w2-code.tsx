import * as stylex from '@stylexjs/stylex';
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { colors } from '../tokens/colors.stylex';
import { font } from '../tokens/font.stylex';
import { motion } from '../tokens/motion.stylex';
import { radius } from '../tokens/radius.stylex';
import { CopyButton } from '../motion/CopyButton';

const styles = stylex.create({
  section: { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 },
  head: { alignItems: 'center', display: 'flex', justifyContent: 'space-between' },
  label: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-11'], fontWeight: font['--oniva-font-weight-medium'], letterSpacing: font['--oniva-font-track-label'], textTransform: 'uppercase' },
  pre: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-md'],
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-mono'],
    fontSize: font['--oniva-font-size-12'],
    lineHeight: font['--oniva-font-lh-16'],
    margin: 0,
    overflow: 'auto',
    overflowWrap: 'anywhere',
    paddingBlock: 8,
    paddingInline: 10,
    // The capped block opens to its full height (leaf scroll box; max-height is measured from scrollHeight).
    transitionDuration: motion['--oniva-motion-dur-sheet'],
    transitionProperty: 'max-height',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    whiteSpace: 'pre-wrap',
  },
  capped: {
    maskImage: 'linear-gradient(to bottom, black calc(100% - 36px), transparent)',
    overflow: 'hidden',
  },
  more: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors['--oniva-color-accent-text'],
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    padding: 2,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'color',
    alignSelf: 'flex-start',
  },
  key: { color: colors['--oniva-color-info-fg'] },
  str: { color: colors['--oniva-color-success-fg'] },
  num: { color: colors['--oniva-color-warning-fg'] },
  lit: { color: colors['--oniva-color-purple-fg'] },
  pending: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], margin: 0 },
});

/** Pretty-printed text of any value; JSON strings are parsed. `json` says whether it should be highlighted. */
export function toCodeText(value: unknown): { text: string; json: boolean } {
  if (typeof value === 'string') {
    const t = value.trim();
    if (t.startsWith('{') || t.startsWith('[')) {
      try {
        return { text: JSON.stringify(JSON.parse(t), null, 2), json: true };
      } catch {
        /* plain text */
      }
    }
    return { text: value, json: false };
  }
  try {
    const s = JSON.stringify(value, null, 2);
    return s === undefined ? { text: String(value), json: false } : { text: s, json: true };
  } catch {
    return { text: String(value), json: false };
  }
}

const TOKEN = /("(?:[^"\\]|\\.)*")(\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g;

/** Token-level JSON highlight (keys, strings, numbers, literals). */
export function highlightJson(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = new RegExp(TOKEN.source, 'g');
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] && m[2]) {
      out.push(<span key={m.index} {...stylex.props(styles.key)}>{m[1]}</span>, m[2]);
    } else {
      const kind = m[1] ? styles.str : /^[tfn]/.test(m[0]) ? styles.lit : styles.num;
      out.push(<span key={m.index} {...stylex.props(kind)}>{m[0]}</span>);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Labelled, copyable, highlighted block capped with a fade and "Show all". */
export function CodeSection({ label, value, cap = 220, copyLabel }: { label: string; value: unknown; cap?: number; copyLabel?: string }) {
  const { text, json } = toCodeText(value);
  const pre = useRef<HTMLPreElement>(null);
  const [full, setFull] = useState(false);
  const [height, setHeight] = useState(0);
  useLayoutEffect(() => {
    const el = pre.current;
    if (!el) return;
    const measure = () => setHeight(el.scrollHeight);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text]);
  const capped = height > cap + 24;
  return (
    <div {...stylex.props(styles.section)}>
      <div {...stylex.props(styles.head)}>
        <span {...stylex.props(styles.label)}>{label}</span>
        <CopyButton size="xs" variant="ghost" value={text} aria-label={copyLabel ?? `Copy ${label.toLowerCase()}`} />
      </div>
      <pre
        ref={pre}
        tabIndex={0}
        aria-label={label}
        style={capped ? { maxHeight: full ? Math.min(height, 640) : cap } : undefined}
        {...stylex.props(styles.pre, capped && !full && styles.capped)}
      >
        <code>{json ? highlightJson(text) : text}</code>
      </pre>
      {capped && (
        <button type="button" aria-expanded={full} onClick={() => setFull(!full)} {...stylex.props(styles.more)}>
          {full ? 'Show less' : 'Show all'}
        </button>
      )}
    </div>
  );
}

export function PendingNote({ children }: { children: ReactNode }) {
  return <p {...stylex.props(styles.pending)}>{children}</p>;
}
