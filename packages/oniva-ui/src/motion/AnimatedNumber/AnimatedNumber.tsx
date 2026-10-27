import * as stylex from '@stylexjs/stylex';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, HTMLAttributes, Ref } from 'react';
import { mergeRefs } from '../../internal/n3-hooks';
import { useInView } from '../InView/useInView';
import { mergeSx } from '../../internal/sx';
import { prefersReducedMotion } from '../../internal/motion-hooks';

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1,
    whiteSpace: 'pre',
  },
  inline: { display: 'inline-flex' },
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
  cell: {
    display: 'inline-block',
    height: '1.2em',
    // extra block padding keeps tall glyphs from clipping; negative margin keeps layout tight
    marginBlock: '-0.1em',
    overflow: 'hidden',
    paddingBlock: '0.1em',
    position: 'relative',
    verticalAlign: 'top',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    transform: 'translateY(calc(var(--oniva-digit, 0) * -1.2em))',
  },
  digit: { display: 'block', height: '1.2em', lineHeight: '1.2em', textAlign: 'center' },
});

interface Slot {
  key: string;
  type: 'digit' | 'text';
  value: string;
}

/** Splits a formatted number into slots with stable keys (anchored to the decimal point) so columns persist across value changes. */
function toSlots(parts: Intl.NumberFormatPart[]): Slot[] {
  const slots: Slot[] = [];
  const intParts = parts.filter((p) => p.type === 'integer' || p.type === 'group');
  const intTotal = intParts.length; // number of int/group tokens
  let ii = 0;
  let fi = 0;
  parts.forEach((p, n) => {
    if (p.type === 'integer') {
      // integer chunks are runs of digits between group separators; key digits from the right of the whole number
      const fromRight = intTotal - ii - 1;
      ii++;
      const chars = [...p.value];
      chars.forEach((c, k) => slots.push({ key: `i${fromRight}-${chars.length - k}`, type: 'digit', value: c }));
    } else if (p.type === 'group') {
      ii++;
      slots.push({ key: `g${intTotal - ii}`, type: 'text', value: p.value });
    } else if (p.type === 'fraction') {
      [...p.value].forEach((c) => slots.push({ key: `f${fi++}`, type: 'digit', value: c }));
    } else {
      slots.push({ key: `${p.type}${n}`, type: 'text', value: p.value });
    }
  });
  return slots;
}

const EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';
/** Resting digit shown by a column; the stack holds 0-9 twice so a roll can wrap in either direction without a seam. */
const STACK = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export interface AnimatedNumberProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style' | 'children'> {
  value: number;
  /** `Intl.NumberFormat` options (currency, percent, compact, fraction digits…). */
  format?: Intl.NumberFormatOptions;
  locale?: string | string[];
  /** Roll length in ms. Default is the `dur-deliberate` token (350ms); odometer-style counts usually want 700-900. */
  duration?: number;
  /** Wait before the first count-in, in ms. Default 0. */
  delay?: number;
  /** Count in from zero the first time the number scrolls into view (every digit rolls up to its value). Default `false`. */
  countIn?: boolean;
  /** Extra delay per digit counted from the right, in ms, so the last digit settles last. Default 0. */
  digitStagger?: number;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

/**
 * Per-digit rolling number (NumberFlow-like). Digits are columns translated with transform
 * (350ms ease-out-expo); new digits mount at their final position. Reduced motion collapses the
 * duration so the value just updates. The full formatted value is exposed to screen readers once.
 */
export function AnimatedNumber({
  value,
  format,
  locale,
  duration,
  delay = 0,
  countIn = false,
  digitStagger = 0,
  className,
  xstyle,
  ref,
  ...rest
}: AnimatedNumberProps) {
  const { ref: viewRef, inView } = useInView<HTMLSpanElement>({ threshold: 0.3 });
  // Until it is seen, a count-in number shows zeros in the final slot layout so nothing shifts when it rolls.
  const [armed, setArmed] = useState(countIn);
  useEffect(() => {
    if (!countIn) return setArmed(false);
    if (!inView) return;
    // Release on the next frame so the zero state paints first and the transition has something to run from.
    const raf = requestAnimationFrame(() => setArmed(false));
    return () => cancelAnimationFrame(raf);
  }, [countIn, inView]);
  const zero = countIn && armed;
  const rootEl = useRef<HTMLSpanElement | null>(null);
  const prevDigits = useRef(new Map<string, number>());
  const prevValue = useRef(value);
  const mounted = useRef(false);
  const rootVars = {
    ...(duration != null && { '--oniva-roll-dur': `${duration}ms` }),
  } as CSSProperties;
  const nf = useMemo(() => new Intl.NumberFormat(locale, format), [locale, format]);
  const text = nf.format(value);
  const slots = useMemo(() => toSlots(nf.formatToParts(value)), [nf, value]);
  // Roll each changed column in the direction of the change (up when the value grows, down when it shrinks); columns that
  // appear later (9,999 -> 10,000) rise in. Resting position is the CSS var; WAAPI only paints the journey.
  useLayoutEffect(() => {
    const el = rootEl.current;
    const next = new Map<string, number>();
    const grew = value >= prevValue.current;
    prevValue.current = value;
    if (el) {
      const reduce = prefersReducedMotion();
      el.querySelectorAll<HTMLElement>('[data-nkey]').forEach((col) => {
        const key = col.dataset.nkey!;
        const to = Number(col.dataset.ndigit);
        next.set(key, to);
        if (reduce || typeof col.animate !== 'function') return;
        const from = prevDigits.current.get(key);
        const dur = duration ?? 350;
        const lag = Number(col.dataset.ndelay ?? 0);
        if (from == null) {
          if (!mounted.current) return;
          const cell = col.parentElement;
          cell?.animate?.([{ opacity: 0, transform: 'translateY(-35%)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: EXPO });
          return;
        }
        if (from === to) return;
        const a = grew ? from : from + (to > from ? 10 : 0);
        const b = grew ? to + (to < from ? 10 : 0) : to;
        col.animate([{ transform: `translateY(calc(${a} * -1.2em))` }, { transform: `translateY(calc(${b} * -1.2em))` }], {
          delay: lag,
          duration: dur,
          easing: EXPO,
          fill: 'backwards',
        });
      });
    }
    prevDigits.current = next;
    mounted.current = true;
  });
  const sx = stylex.props(styles.root, xstyle);
  const cell = stylex.props(styles.cell);
  const col = stylex.props(styles.column);
  const dig = stylex.props(styles.digit);
  const sr = stylex.props(styles.sr);
  const inline = stylex.props(styles.inline);
  return (
    <span {...rest} ref={mergeRefs(viewRef, rootEl, ref)} {...mergeSx(sx, className, rootVars)}>
      <span {...sr}>{text}</span>
      <span aria-hidden="true" {...inline}>
        {slots.map((s, si) =>
          s.type === 'text' ? (
            <span key={s.key}>{s.value}</span>
          ) : (
            <span key={s.key} {...cell}>
              <span
                className={col.className}
                data-nkey={s.key}
                data-ndigit={zero ? 0 : Number(s.value)}
                data-ndelay={delay + (digitStagger ? (slots.length - 1 - si) * digitStagger : 0)}
                style={
                  {
                    '--oniva-digit': zero ? 0 : Number(s.value),
                    '--oniva-roll-delay': `${delay + (digitStagger ? (slots.length - 1 - si) * digitStagger : 0)}ms`,
                  } as CSSProperties
                }
              >
                {STACK.map((d, di) => (
                  <span key={di} {...dig}>
                    {d}
                  </span>
                ))}
              </span>
            </span>
          ),
        )}
      </span>
    </span>
  );
}
