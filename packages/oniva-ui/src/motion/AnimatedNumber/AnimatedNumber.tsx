import * as stylex from '@stylexjs/stylex';
import { useMemo } from 'react';
import type { CSSProperties, HTMLAttributes, Ref } from 'react';
import { motion } from '../../tokens/motion.stylex';
import { mergeSx } from '../../internal/sx';

const styles = stylex.create({
  root: {
    display: 'inline-flex',
    fontVariantNumeric: 'tabular-nums',
    lineHeight: 1,
    whiteSpace: 'pre',
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
    transitionDuration: motion['--oniva-motion-dur-deliberate'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out-expo'],
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

export interface AnimatedNumberProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'style' | 'children'> {
  value: number;
  /** `Intl.NumberFormat` options (currency, percent, compact, fraction digits…). */
  format?: Intl.NumberFormatOptions;
  locale?: string | string[];
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLSpanElement>;
}

/**
 * Per-digit rolling number (NumberFlow-like). Digits are columns translated with transform
 * (350ms ease-out-expo); new digits mount at their final position. Reduced motion collapses the
 * duration so the value just updates. The full formatted value is exposed to screen readers once.
 */
export function AnimatedNumber({ value, format, locale, className, xstyle, ref, ...rest }: AnimatedNumberProps) {
  const nf = useMemo(() => new Intl.NumberFormat(locale, format), [locale, format]);
  const text = nf.format(value);
  const slots = useMemo(() => toSlots(nf.formatToParts(value)), [nf, value]);
  const sx = stylex.props(styles.root, xstyle);
  const cell = stylex.props(styles.cell);
  const col = stylex.props(styles.column);
  const dig = stylex.props(styles.digit);
  const sr = stylex.props(styles.sr);
  return (
    <span {...rest} ref={ref} {...mergeSx(sx, className)}>
      <span {...sr}>{text}</span>
      <span aria-hidden="true" style={{ display: 'inline-flex' }}>
        {slots.map((s) =>
          s.type === 'text' ? (
            <span key={s.key}>{s.value}</span>
          ) : (
            <span key={s.key} {...cell}>
              <span className={col.className} style={{ '--oniva-digit': Number(s.value) } as CSSProperties}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
                  <span key={d} {...dig}>
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
