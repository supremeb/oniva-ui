import * as stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { colors } from '../tokens/colors.stylex';
import { font } from '../tokens/font.stylex';
import { media } from '../tokens/media.stylex';
import { motion } from '../tokens/motion.stylex';
import { radius } from '../tokens/radius.stylex';
import { VisuallyHidden } from '../components/VisuallyHidden';

/** Helpers shared by the loop-7 agent components (worker w2). */

/** Epoch-ms clock that ticks while `active`; frozen otherwise. Pass `override` to drive it from outside (tests, replays). */
export function useNow(active: boolean, everyMs = 1000, override?: number): number {
  const [now, setNow] = useState(() => override ?? Date.now());
  useEffect(() => {
    if (override !== undefined || !active) return;
    setNow(Date.now());
    const t = window.setInterval(() => setNow(Date.now()), everyMs);
    return () => window.clearInterval(t);
  }, [active, everyMs, override]);
  return override ?? now;
}

/** `0.4s`, `12.3s`, `2m 05s`, `3h 12m`. Live timers always show tenths below a minute. */
export function formatDuration(ms: number, live = false): string {
  if (!live && ms < 1000) return `${Math.max(1, Math.round(ms))}ms`;
  if (ms < 60_000) return `${(Math.floor(ms / 100) / 10).toFixed(1)}s`;
  const s = Math.floor(ms / 1000);
  if (s < 3600) return `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`;
  const h = Math.floor(s / 3600);
  return `${h}h ${String(Math.floor(s / 60) % 60).padStart(2, '0')}m`;
}

/** `m:ss` clock for countdowns. */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.ceil(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** Polite live-region message holder: `const { message, announce } = useAnnouncer()`; render `<Announcer message={message} />`. */
export function useAnnouncer() {
  const [message, setMessage] = useState('');
  const announce = useCallback((m: string) => setMessage(m), []);
  return { message, announce };
}

export function Announcer({ message }: { message: string }) {
  return (
    <VisuallyHidden>
      <span role="status" aria-live="polite">
        {message}
      </span>
    </VisuallyHidden>
  );
}

/** Copy to the clipboard with a legacy fallback. Resolves true on success. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Stable per-instance DOM id prefix. */
export function useDomId(prefix: string): string {
  return `${prefix}-${useId().replace(/:/g, '')}`;
}

/** Keeps the latest callback in a ref so effects/timers never see stale props. */
export function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

const pulse = stylex.keyframes({ '0%': { opacity: 1 }, '50%': { opacity: 0.45 }, '100%': { opacity: 1 } });

/** Shared tiny pieces: flagged span, swatch, tag, and the gray tray/card pair used by Pro-style agent surfaces. */
export const w2s = stylex.create({
  tag: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-full'],
    display: 'inline-flex',
    flexShrink: 0,
    fontSize: font['--oniva-font-size-11'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 4,
    lineHeight: font['--oniva-font-lh-16'],
    paddingBlock: 1,
    paddingInline: 7,
    whiteSpace: 'nowrap',
  },
  tagNeutral: {
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    color: colors['--oniva-color-text-on-tertiary'],
  },
  tagWarning: {
    backgroundColor: colors['--oniva-color-warning-bg'],
    color: colors['--oniva-color-warning-fg'],
  },
  tagDanger: {
    backgroundColor: colors['--oniva-color-danger-bg'],
    color: colors['--oniva-color-danger-fg'],
  },
  tagSuccess: {
    backgroundColor: colors['--oniva-color-success-bg'],
    color: colors['--oniva-color-success-fg'],
  },
  tagInfo: {
    backgroundColor: colors['--oniva-color-info-bg'],
    color: colors['--oniva-color-info-fg'],
  },
  flag: {
    backgroundColor: { default: colors['--oniva-color-warning-bg'], ':hover': colors['--oniva-color-warning-bg'] },
    borderBottomColor: colors['--oniva-color-warning-solid'],
    borderBottomStyle: 'dashed',
    borderBottomWidth: 1.5,
    borderRadius: radius['--oniva-radius-xs'],
    color: 'inherit',
    cursor: 'help',
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 1,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: { default: 2, [media.contrast]: 3 },
    paddingInline: 2,
  },
  note: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-12'],
    lineHeight: font['--oniva-font-lh-16'],
    marginBlockStart: 4,
    maxWidth: 320,
    paddingBlock: 6,
    paddingInline: 8,
  },
  noteSource: { color: colors['--oniva-color-text-muted'], display: 'block', marginBlockStart: 2 },
  mono: { fontFamily: font['--oniva-font-mono'] },
  num: { fontVariantNumeric: 'tabular-nums' },
  muted: { color: colors['--oniva-color-text-muted'] },
  pulse: {
    animationDuration: '1.4s',
    animationIterationCount: 'infinite',
    animationName: { default: pulse, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
  },
  ease: {
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
});

/** A flagged piece of text: either a plain string or `{ text, note, source? }` (note shown on hover/focus). */
export interface FlaggedPart {
  text: string;
  /** Why the agent is unsure, one line. */
  note?: string;
  source?: string;
}
export type FlaggedText = string | Array<string | FlaggedPart>;

export function flaggedToString(t: FlaggedText): string {
  return typeof t === 'string' ? t : t.map((p) => (typeof p === 'string' ? p : p.text)).join('');
}

/** Renders flagged text. A flagged span is focusable, `aria-describedby` its note (role=tooltip), shown on hover/focus or when `openKey` matches. */
export function FlaggedSpans({
  value,
  idBase,
  openId,
  onOpenChange,
}: {
  value: FlaggedText;
  idBase: string;
  /** Which flag id currently shows its note (controlled by the parent so `F` can step through flags). */
  openId?: string | null;
  onOpenChange?: (id: string | null) => void;
}): ReactNode {
  if (typeof value === 'string') return value;
  return value.map((p, i) => {
    if (typeof p === 'string') return p;
    const id = `${idBase}-f${i}`;
    const open = openId === id;
    return (
      <span key={i}>
        <span
          tabIndex={0}
          data-flag={id}
          aria-describedby={open ? `${id}-note` : undefined}
          onMouseEnter={() => onOpenChange?.(id)}
          onMouseLeave={() => onOpenChange?.(null)}
          onFocus={() => onOpenChange?.(id)}
          onBlur={() => onOpenChange?.(null)}
          {...stylex.props(w2s.flag)}
        >
          {p.text}
        </span>
        {open && p.note && (
          <span id={`${id}-note`} role="tooltip" {...stylex.props(w2s.note)}>
            {p.note}
            {p.source && <span {...stylex.props(w2s.noteSource)}>{p.source}</span>}
          </span>
        )}
      </span>
    );
  });
}

/** Lists flag ids (document order) inside a container. */
export function flagIds(root: HTMLElement | null): string[] {
  return root ? Array.from(root.querySelectorAll<HTMLElement>('[data-flag]')).map((e) => e.dataset.flag!) : [];
}
