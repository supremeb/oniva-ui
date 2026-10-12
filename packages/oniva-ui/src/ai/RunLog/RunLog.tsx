import * as stylex from '@stylexjs/stylex';
import { ArrowDown, Check, Copy } from 'lucide-react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type HTMLAttributes, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { IconSwap, useCopy } from '../../internal/n1-ai';
import { mergeSx } from '../../internal/sx';
import { Button } from '../../components/Button';
import { IconButton } from '../../components/IconButton';
import { Presence } from '../../motion/Presence';
import { parseAnsi, type AnsiSpan } from './ansi';

const lineIn = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(4px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});
const fadeIn = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });

const styles = stylex.create({
  root: { display: 'flex', flexDirection: 'column', fontFamily: font['--oniva-font-sans'], overflow: 'hidden', position: 'relative' },
  bar: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderBottomColor: colors['--oniva-color-border'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    display: 'flex',
    gap: 8,
    paddingBlock: 6,
    paddingInline: 12,
  },
  title: { color: colors['--oniva-color-text-muted'], flexGrow: 1, fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-12'] },
  scroller: {
    backgroundColor: colors['--oniva-color-surface'],
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-mono'],
    fontSize: font['--oniva-font-size-12'],
    lineHeight: font['--oniva-font-lh-18'],
    maxHeight: 'var(--oniva-runlog-height, 260px)',
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: -2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    overflow: 'auto',
    paddingBlock: 8,
    paddingInline: 12,
  },
  line: { minHeight: 18, whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
  fresh: {
    animationDuration: motion['--oniva-motion-dur-base'],
    animationFillMode: 'backwards',
    animationName: { default: lineIn, [media.reducedMotion]: fadeIn },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  red: { color: colors['--oniva-color-danger-fg'] },
  green: { color: colors['--oniva-color-success-fg'] },
  yellow: { color: colors['--oniva-color-warning-fg'] },
  blue: { color: colors['--oniva-color-info-fg'] },
  magenta: { color: colors['--oniva-color-purple-fg'] },
  cyan: { color: colors['--oniva-color-cyan-fg'] },
  gray: { color: colors['--oniva-color-text-muted'] },
  bold: { fontWeight: font['--oniva-font-weight-bold'] },
  dim: { opacity: 0.65 },
  jump: { bottom: 12, insetInlineEnd: 16, position: 'absolute' },
});

function Span({ s }: { s: AnsiSpan }) {
  return <span {...stylex.props(s.color && styles[s.color], s.bold && styles.bold, s.dim && styles.dim)}>{s.text}</span>;
}

export interface RunLogProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children' | 'title'> {
  /** Output lines; may contain ANSI SGR colors. Append to stream. */
  lines: string[];
  title?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Terminal-style streaming log. New lines fade in, ANSI colors render, autoscroll pauses when you scroll up. */
export function RunLog({ lines, title = 'Output', className, xstyle, ref, ...rest }: RunLogProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(true);
  const pinnedRef = useRef(true);
  const initial = useRef(lines.length);
  const parsed = useMemo(() => lines.map(parseAnsi), [lines]);
  const plain = useMemo(() => parsed.map((l) => l.map((s) => s.text).join('')).join('\n'), [parsed]);
  const { copied, copy } = useCopy(plain);

  useLayoutEffect(() => {
    const el = scroller.current;
    if (el && pinnedRef.current) el.scrollTop = el.scrollHeight;
  }, [lines.length]);
  useEffect(() => {
    pinnedRef.current = pinned;
  }, [pinned]);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
    pinnedRef.current = atBottom;
    setPinned(atBottom);
  };
  const jump = () => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight });
    pinnedRef.current = true;
    setPinned(true);
  };

  const sx = stylex.props(aiStyles.tile, styles.root, xstyle);
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      <div {...stylex.props(styles.bar)}>
        <span {...stylex.props(styles.title)}>{title}</span>
        <IconButton size="xs" variant="ghost" aria-label={copied ? 'Copied' : 'Copy output'} onPress={copy}>
          <IconSwap on={copied} a={<Copy size={14} />} b={<Check size={14} />} />
        </IconButton>
      </div>
      <div ref={scroller} role="log" aria-label={title} tabIndex={0} onScroll={onScroll} {...stylex.props(styles.scroller)}>
        {parsed.map((spans, i) => (
          <div key={i} {...stylex.props(styles.line, i >= initial.current && styles.fresh)}>
            {spans.length ? spans.map((s, j) => <Span key={j} s={s} />) : ' '}
          </div>
        ))}
      </div>
      <Presence isPresent={!pinned} preset="scale" initial={false} xstyle={styles.jump}>
        <Button size="xs" variant="secondary" onPress={jump}>
          <ArrowDown size={12} aria-hidden="true" /> Jump to latest
        </Button>
      </Presence>
    </div>
  );
}
