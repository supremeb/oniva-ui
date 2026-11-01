import * as stylex from '@stylexjs/stylex';
import { ArrowUpIcon, ChevronRightIcon, LoaderIcon } from '../../icons/IconSet';
import {
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Button as AriaButton, Toolbar } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { focus } from '../../internal/focus';
import { mergeSx, sxClass } from '../../internal/sx';
import { TextReveal } from '../../motion/TextReveal';

const fadeIn = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const spin = stylex.keyframes({ to: { transform: 'rotate(1turn)' } });
const blink = stylex.keyframes({ '0%, 49%': { opacity: 1 }, '50%, 100%': { opacity: 0 } });
const flash = stylex.keyframes({
  from: { backgroundColor: colors['--oniva-color-accent-soft-active'] },
  to: { backgroundColor: 'transparent' },
});

const styles = stylex.create({
  root: { fontFamily: font['--oniva-font-sans'], position: 'relative' },
  text: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-16'],
    lineHeight: font['--oniva-font-lh-24'],
    margin: 0,
    whiteSpace: 'pre-wrap',
  },
  mark: {
    backgroundColor: colors['--oniva-color-accent-soft'],
    borderRadius: radius['--oniva-radius-xs'],
    color: 'inherit',
  },
  markFlash: {
    animationDuration: '1400ms',
    animationFillMode: 'forwards',
    animationName: { default: flash, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundColor: {
      default: 'transparent',
      [media.reducedMotion]: colors['--oniva-color-accent-soft'],
    },
  },
  caret: {
    animationDuration: '1000ms',
    animationIterationCount: 'infinite',
    animationName: { default: blink, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'steps(1, end)',
    backgroundColor: colors['--oniva-color-text'],
    display: 'inline-block',
    height: '1.1em',
    marginInlineStart: 2,
    verticalAlign: 'text-bottom',
    width: 2,
  },
  // Moves between selections with a glide; the first placement has no previous transform, so it never slides in from 0,0.
  positioner: {
    left: 0,
    pointerEvents: 'none',
    position: 'absolute',
    top: 0,
    transitionDuration: motion['--oniva-motion-dur-slower'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-in-out'],
    zIndex: 5,
  },
  pill: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-float'],
    boxSizing: 'border-box',
    display: 'flex',
    height: 40,
    opacity: { default: 0, '[data-shown]': 1 },
    overflow: 'hidden',
    pointerEvents: 'auto',
    transform: {
      default: 'translateX(-50%) scale(var(--oniva-motion-pop-scale))',
      '[data-shown]': 'translateX(-50%) scale(1)',
    },
    transformOrigin: 'top center',
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: 'max-content',
  },
  swap: {
    alignItems: 'center',
    animationDuration: motion['--oniva-motion-dur-base'],
    animationFillMode: 'backwards',
    animationName: { default: fadeIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'flex',
    height: '100%',
  },
  form: { display: 'flex', height: '100%' },
  input: {
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    boxSizing: 'content-box',
    color: colors['--oniva-color-text'],
    fontFamily: 'inherit',
    borderRadius: radius['--oniva-radius-full'],
    fontSize: font['--oniva-font-size-14'],
    height: '100%',
    minWidth: 0,
    paddingInline: 16,
    width: 148,
    '::placeholder': { color: colors['--oniva-color-text-placeholder'] },
  },
  sep: {
    alignSelf: 'center',
    backgroundColor: colors['--oniva-color-border'],
    flexShrink: 0,
    height: 20,
    width: 1,
  },
  action: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-hover'] },
    },
    borderRadius: radius['--oniva-radius-full'],
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    font: 'inherit',
    fontSize: font['--oniva-font-size-14'],
    gap: 6,
    height: 32,
    marginInline: 2,
    paddingInline: 10,
    transform: { default: 'scale(1)', ':active': 'scale(var(--oniva-motion-press-scale))' },
    transitionDuration: motion['--oniva-motion-dur-press'],
    transitionProperty: 'background-color, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    whiteSpace: 'nowrap',
  },
  iconOnly: { paddingInline: 8 },
  // Extra actions slide out sideways: grid-template-columns 0fr -> 1fr, so nothing is measured.
  more: {
    display: 'grid',
    gridTemplateColumns: { default: '0fr', '[data-open]': '1fr' },
    opacity: { default: 0, '[data-open]': 1 },
    transitionDuration: motion['--oniva-motion-dur-sheet'],
    transitionProperty: 'grid-template-columns, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  moreInner: { alignItems: 'center', display: 'flex', minWidth: 0, overflow: 'hidden' },
  chev: {
    transform: { default: 'rotate(0deg)', '[data-open]': 'rotate(180deg)' },
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  busy: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-14'],
    gap: 8,
    paddingInline: 16,
  },
  spinner: {
    animationDuration: '800ms',
    animationIterationCount: 'infinite',
    animationName: { default: spin, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
  },
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
});

export interface SelectionAction {
  id: string;
  label: string;
  icon?: ReactNode;
  /** Shown in the pill while this action runs. Default "Working…". */
  pendingLabel?: string;
}

export interface SelectionRange {
  start: number;
  end: number;
}

export interface SelectionRewriteRequest {
  /** The action id, or `custom` for a typed instruction. */
  actionId: string;
  instruction?: string;
  /** The selected passage. */
  text: string;
  signal: AbortSignal;
}

/** A whole replacement string (streamed word by word for you), or an async stream of text chunks. */
export type SelectionRewrite = (
  req: SelectionRewriteRequest,
) => string | Promise<string> | AsyncIterable<string>;

export interface SelectionActionsProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'style' | 'children' | 'defaultValue'
> {
  /** Controlled text. */
  text?: string;
  defaultText?: string;
  onTextChange?: (text: string) => void;
  actions: SelectionAction[];
  rewrite: SelectionRewrite;
  /** How many actions sit in the pill before the "more" chevron. Default 2. */
  visibleActions?: number;
  /** Placeholder of the free-form instruction field. Default "Describe edits". */
  placeholder?: string;
  /** Start with a passage already selected (docs, tests). */
  defaultSelection?: SelectionRange;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const reduced = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

async function* deltas(res: ReturnType<SelectionRewrite>): AsyncGenerator<string> {
  if (typeof res === 'object' && res !== null && Symbol.asyncIterator in res) {
    yield* res as AsyncIterable<string>;
    return;
  }
  const full = await res;
  if (reduced()) {
    yield full;
    return;
  }
  for (const word of full.match(/\S+\s*/g) ?? [full]) {
    yield word;
    await sleep(36);
  }
}

/** Clamp a preset range into the text (ordered, in bounds); null when nothing is left to select. */
function normalizeRange(range: SelectionRange | undefined, text: string): SelectionRange | null {
  if (!range) return null;
  const a = Math.max(0, Math.min(range.start, range.end, text.length));
  const b = Math.max(0, Math.min(Math.max(range.start, range.end), text.length));
  return b > a ? { start: a, end: b } : null;
}

/** Character offset of (node, offset) inside root's text. */
function offsetIn(root: Node, node: Node, offset: number) {
  const r = document.createRange();
  r.selectNodeContents(root);
  r.setEnd(node, offset);
  return r.toString().length;
}

/** DOM range covering characters [start, end) of root's text. */
function rangeAt(root: Node, start: number, end: number) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const r = document.createRange();
  let pos = 0;
  let setStart = false;
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const len = n.textContent?.length ?? 0;
    if (!setStart && start <= pos + len) {
      r.setStart(n, start - pos);
      setStart = true;
    }
    if (setStart && end <= pos + len) {
      r.setEnd(n, end - pos);
      return r;
    }
    pos += len;
  }
  return setStart ? r : null;
}

/**
 * Select a passage and hand it to an agent. A pill floats under the selection with a free-form instruction field and
 * quick actions (more slide out from the chevron). Running one turns the pill into a progress label (width glides),
 * streams the rewrite into the highlighted passage word by word behind a caret, then settles the new text with a
 * fading highlight. Escape cancels. `rewrite` may return a string or an async stream of chunks.
 */
export function SelectionActions({
  text: textProp,
  defaultText = '',
  onTextChange,
  actions,
  rewrite,
  visibleActions = 2,
  placeholder = 'Describe edits',
  defaultSelection,
  className,
  xstyle,
  ref,
  ...rest
}: SelectionActionsProps) {
  const [inner, setInner] = useState(defaultText);
  const text = textProp ?? inner;
  const [selection, setSelection] = useState<SelectionRange | null>(() =>
    normalizeRange(defaultSelection, textProp ?? defaultText),
  );
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(
    () => !!normalizeRange(defaultSelection, textProp ?? defaultText),
  );
  const [shown, setShown] = useState(false);
  const [working, setWorking] = useState<SelectionAction | null>(null);
  const [streamed, setStreamed] = useState('');
  const [frozen, setFrozen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [instruction, setInstruction] = useState('');
  const [native, setNative] = useState(false);
  const [flashRange, setFlashRange] = useState<SelectionRange | null>(null);
  const [status, setStatus] = useState('');

  const rootRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const lastW = useRef<number | null>(null);
  const pillW = useRef(0);
  const hasPos = pos !== null;

  const setRoot = useCallback(
    (n: HTMLDivElement | null) => {
      rootRef.current = n;
      if (typeof ref === 'function') ref(n);
      else if (ref) ref.current = n;
    },
    [ref],
  );

  const place = useCallback((sel: SelectionRange) => {
    const root = rootRef.current;
    const t = textRef.current;
    if (!root || !t) return;
    const r = rangeAt(t, sel.start, sel.end);
    if (!r) return;
    const rect = r.getBoundingClientRect?.() ?? { left: 0, width: 0, bottom: 0 };
    const base = root.getBoundingClientRect();
    const half = pillW.current / 2;
    const cx = rect.left - base.left + rect.width / 2;
    const x = Math.max(half, Math.min(cx, Math.max(half, base.width - half)));
    setPos({ x, y: rect.bottom - base.top + 8 });
  }, []);

  // Track real selections inside the text. Ignored while the pill owns focus or a rewrite runs.
  useEffect(() => {
    const onChange = () => {
      if (working) return;
      const t = textRef.current;
      const pill = pillRef.current;
      if (pill && document.activeElement && pill.contains(document.activeElement)) return;
      const s = document.getSelection();
      if (
        !t ||
        !s ||
        s.rangeCount === 0 ||
        s.isCollapsed ||
        !t.contains(s.anchorNode) ||
        !t.contains(s.focusNode)
      ) {
        if (!frozen) setSelection(null);
        return;
      }
      const r = s.getRangeAt(0);
      const a = offsetIn(t, r.startContainer, r.startOffset);
      const b = offsetIn(t, r.endContainer, r.endOffset);
      if (b <= a || !text.slice(a, b).trim()) return;
      setFlashRange(null);
      setNative(true);
      setSelection({ start: a, end: b });
    };
    document.addEventListener('selectionchange', onChange);
    return () => document.removeEventListener('selectionchange', onChange);
  }, [working, frozen, text]);

  // Mount/unmount the pill with a fade, and (re)place it whenever the selection moves.
  useEffect(() => {
    if (selection) {
      setMounted(true);
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    const id = setTimeout(() => setMounted(false), 200);
    return () => clearTimeout(id);
  }, [selection]);

  useLayoutEffect(() => {
    if (selection) place(selection);
  }, [selection, place, frozen, working, text]);

  // Width glides between the idle pill and the progress pill (overlay, out of flow).
  useLayoutEffect(() => {
    const el = pillRef.current;
    if (!el) {
      lastW.current = null;
      return;
    }
    const next = el.offsetWidth;
    const prev = lastW.current;
    pillW.current = next;
    lastW.current = next;
    // The pill is only measurable once it is mounted: re-centre it with its real width so edge clamping is right.
    if (selection && prev !== next) place(selection);
    if (prev == null || prev === next || reduced() || typeof el.animate !== 'function') return;
    const a = el.animate([{ width: `${prev}px` }, { width: `${next}px` }], {
      duration: 260,
      easing: 'cubic-bezier(0.23, 1, 0.32, 1)',
    });
    return () => a.cancel();
  }, [working, moreOpen, instruction, mounted, hasPos, selection, place, placeholder]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const commit = (value: string) => {
    onTextChange?.(value);
    if (textProp === undefined) setInner(value);
  };

  const cancel = () => {
    abortRef.current?.abort();
    setWorking(null);
    setStreamed('');
    setFrozen(false);
    setSelection(null);
    setNative(false);
    setInstruction('');
    setMoreOpen(false);
    document.getSelection()?.removeAllRanges();
  };

  const run = async (action: SelectionAction | null, custom?: string) => {
    if (!selection || working) return;
    const source = text.slice(selection.start, selection.end);
    const act: SelectionAction = action ?? {
      id: 'custom',
      label: custom ?? '',
      pendingLabel: 'Editing…',
    };
    const ac = new AbortController();
    abortRef.current = ac;
    document.getSelection()?.removeAllRanges();
    setFrozen(true);
    setWorking(act);
    setStreamed('');
    setStatus(`${act.pendingLabel ?? 'Working…'}`);
    let acc = '';
    try {
      for await (const d of deltas(
        rewrite({ actionId: act.id, instruction: custom, text: source, signal: ac.signal }),
      )) {
        if (ac.signal.aborted) return;
        acc += d;
        setStreamed(acc);
      }
    } catch {
      if (!ac.signal.aborted) {
        cancel();
        setStatus('Edit failed');
      }
      return;
    }
    if (ac.signal.aborted) return;
    const { start, end } = selection;
    commit(text.slice(0, start) + acc + text.slice(end));
    setFlashRange({ start, end: start + acc.length });
    setWorking(null);
    setStreamed('');
    setFrozen(false);
    setSelection(null);
    setNative(false);
    setInstruction('');
    setMoreOpen(false);
    setStatus('Edit applied');
  };

  useEffect(() => {
    if (!flashRange) return;
    const id = setTimeout(() => setFlashRange(null), 1500);
    return () => clearTimeout(id);
  }, [flashRange]);

  const quick = actions.slice(0, visibleActions);
  const extra = actions.slice(visibleActions);
  // A real browser selection paints itself; a preset one (or a frozen one while the field has focus) is painted as a mark.
  const showMark = !!selection && (!native || frozen || !!working);

  const renderAction = (a: SelectionAction) => (
    <AriaButton
      key={a.id}
      onPress={() => void run(a)}
      className={sxClass(stylex.props(styles.action, focus.inset))}
    >
      {a.icon}
      {a.label}
    </AriaButton>
  );

  const sx = stylex.props(styles.root, xstyle);
  return (
    <div
      {...rest}
      ref={setRoot}
      onKeyDown={(e) => {
        rest.onKeyDown?.(e);
        if (e.key === 'Escape' && selection) cancel();
      }}
      {...mergeSx(sx, className)}
    >
      <p ref={textRef} {...stylex.props(styles.text)}>
        {showMark && selection ? (
          <>
            {text.slice(0, selection.start)}
            <mark {...stylex.props(styles.mark)}>
              {working && streamed ? (
                <>
                  <TextReveal text={streamed} staggerMs={30} maxDelayMs={200} />
                  <span aria-hidden="true" {...stylex.props(styles.caret)} />
                </>
              ) : (
                text.slice(selection.start, selection.end)
              )}
            </mark>
            {text.slice(selection.end)}
          </>
        ) : flashRange ? (
          <>
            {text.slice(0, flashRange.start)}
            <mark {...stylex.props(styles.mark, styles.markFlash)}>
              {text.slice(flashRange.start, flashRange.end)}
            </mark>
            {text.slice(flashRange.end)}
          </>
        ) : (
          text
        )}
      </p>
      <span role="status" {...stylex.props(styles.sr)}>
        {status}
      </span>
      {mounted && selection && pos && (
        <div
          style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
          {...stylex.props(styles.positioner)}
        >
          <div
            ref={pillRef}
            data-shown={shown ? '' : undefined}
            onMouseDown={(e) => {
              // Keep the text selection alive when pressing buttons; the field needs its own focus.
              if (!(e.target instanceof HTMLInputElement)) e.preventDefault();
            }}
            {...stylex.props(styles.pill)}
          >
            {working ? (
              <div key="busy" aria-hidden="true" {...stylex.props(styles.swap, styles.busy)}>
                <LoaderIcon size={16} {...stylex.props(styles.spinner)} />
                {working.pendingLabel ?? 'Working…'}
              </div>
            ) : (
              <Toolbar key="idle" aria-label="Edit selection" {...stylex.props(styles.swap)}>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (instruction.trim()) void run(null, instruction.trim());
                  }}
                  {...stylex.props(styles.form)}
                >
                  <input
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    onFocus={() => setFrozen(true)}
                    onBlur={() => setFrozen(false)}
                    placeholder={placeholder}
                    aria-label={placeholder}
                    // A longer placeholder widens the field instead of being cut off.
                    style={
                      placeholder.length > 14
                        ? { width: `min(${placeholder.length + 2}ch, 240px)` }
                        : undefined
                    }
                    {...stylex.props(styles.input, focus.inset)}
                  />
                </form>
                {instruction.trim() ? (
                  <AriaButton
                    aria-label="Send edit instruction"
                    onPress={() => void run(null, instruction.trim())}
                    className={sxClass(stylex.props(styles.action, styles.iconOnly, focus.inset))}
                  >
                    <ArrowUpIcon size={16} aria-hidden="true" />
                  </AriaButton>
                ) : (
                  <>
                    <span aria-hidden="true" {...stylex.props(styles.sep)} />
                    {quick.map(renderAction)}
                    {extra.length > 0 && (
                      <>
                        <div data-open={moreOpen ? '' : undefined} {...stylex.props(styles.more)}>
                          <div inert={!moreOpen} {...stylex.props(styles.moreInner)}>
                            {extra.map(renderAction)}
                          </div>
                        </div>
                        <span aria-hidden="true" {...stylex.props(styles.sep)} />
                        <AriaButton
                          aria-label={moreOpen ? 'Show fewer actions' : 'Show more actions'}
                          aria-expanded={moreOpen}
                          onPress={() => setMoreOpen((o) => !o)}
                          className={sxClass(
                            stylex.props(styles.action, styles.iconOnly, focus.inset),
                          )}
                        >
                          <span
                            data-open={moreOpen ? '' : undefined}
                            {...stylex.props(styles.chev)}
                          >
                            <ChevronRightIcon size={16} aria-hidden="true" />
                          </span>
                        </AriaButton>
                      </>
                    )}
                  </>
                )}
              </Toolbar>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
