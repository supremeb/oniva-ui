import * as stylex from '@stylexjs/stylex';
import { Button as AriaButton } from 'react-aria-components';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, type CSSProperties, type Ref } from 'react';
import { mergeSx } from '../../internal/sx';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const styles = stylex.create({
  root: {
    alignItems: 'center',
    boxSizing: 'border-box',
    display: 'flex',
    fontFamily: font.sans,
    fontSize: font.size14,
    gap: 4,
  },
  footer: { justifyContent: 'space-between', width: '100%' },
  summary: { color: colors.textMuted, fontVariantNumeric: 'tabular-nums' },
  list: { alignItems: 'center', display: 'flex', gap: 4, listStyle: 'none', margin: 0, padding: 0 },
  btn: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: 'transparent', ':hover': colors.surfaceInsetHover },
    borderColor: 'transparent',
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: { default: colors.textMuted, ':hover': colors.text, ':disabled': colors.textDisabled },
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    display: 'inline-flex',
    fontFamily: font.sans,
    fontSize: font.size14,
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font.weightMedium,
    gap: 6,
    height: 32,
    justifyContent: 'center',
    minWidth: 32,
    outlineColor: colors.focusRing,
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    paddingInline: 8,
    transitionDuration: motion.durBase,
    transitionProperty: 'background-color, color, box-shadow',
    transitionTimingFunction: motion.easeStandard,
  },
  outline: {
    backgroundColor: { default: colors.surface, ':hover': colors.surfaceHover, ':disabled': colors.surface },
    borderColor: colors.border,
    boxShadow: shadow.xs,
    color: { default: colors.text, ':disabled': colors.textDisabled },
    paddingInline: 12,
  },
  current: {
    backgroundColor: { default: colors.surface, ':hover': colors.surface },
    borderColor: colors.border,
    boxShadow: shadow.sm,
    color: colors.text,
  },
  currentAccent: {
    backgroundColor: { default: 'transparent', ':hover': 'transparent' },
    backgroundImage: `linear-gradient(180deg, ${accent.accent500}, ${accent.accent600})`,
    borderColor: 'transparent',
    boxShadow: shadow.accentInset,
    color: { default: colors.accentFg, ':hover': colors.accentFg },
  },
  ellipsis: { alignItems: 'center', color: colors.textSubtle, display: 'inline-flex', height: 32, justifyContent: 'center', minWidth: 24 },
});

export type PaginationItem = number | 'ellipsis-start' | 'ellipsis-end';

/** Pages to render: always first/last, `siblings` around the current page, ellipses for gaps. */
export function getPaginationRange(page: number, pageCount: number, siblings = 1): PaginationItem[] {
  const total = siblings * 2 + 5;
  if (pageCount <= total) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const left = Math.max(page - siblings, 1);
  const right = Math.min(page + siblings, pageCount);
  const showLeft = left > 2;
  const showRight = right < pageCount - 1;
  const span = siblings * 2 + 3;
  if (!showLeft && showRight) {
    return [...Array.from({ length: span }, (_, i) => i + 1), 'ellipsis-end', pageCount];
  }
  if (showLeft && !showRight) {
    return [1, 'ellipsis-start', ...Array.from({ length: span }, (_, i) => pageCount - span + 1 + i)];
  }
  return [1, 'ellipsis-start', ...Array.from({ length: right - left + 1 }, (_, i) => left + i), 'ellipsis-end', pageCount];
}

export interface PaginationProps {
  /** Controlled current page (1-based). */
  page?: number;
  defaultPage?: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  /** Pages shown on each side of the current one. */
  siblingCount?: number;
  /** `numbers` = prev, 1 2 … 9, next. `simple` = footer style "Previous / Next →" with a summary. */
  variant?: 'numbers' | 'simple';
  /** Summary text for the `simple` variant, e.g. "Showing 1-10 of 248". Defaults to "Page X of Y". */
  summary?: string;
  /** Highlight current page with the accent gradient. */
  accentCurrent?: boolean;
  'aria-label'?: string;
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function Pagination({
  page: pageProp,
  defaultPage = 1,
  pageCount,
  onPageChange,
  siblingCount = 1,
  variant = 'numbers',
  summary,
  accentCurrent = false,
  'aria-label': ariaLabel = 'Pagination',
  className,
  style,
  xstyle,
  ref,
}: PaginationProps) {
  const [inner, setInner] = useState(defaultPage);
  const page = Math.min(Math.max(pageProp ?? inner, 1), Math.max(pageCount, 1));
  const go = (p: number) => {
    const next = Math.min(Math.max(p, 1), pageCount);
    if (next === page) return;
    if (pageProp === undefined) setInner(next);
    onPageChange?.(next);
  };

  if (variant === 'simple') {
    const sx = stylex.props(styles.root, styles.footer, xstyle);
    return (
      <nav ref={ref} aria-label={ariaLabel} {...mergeSx(sx, className, style)}>
        <span {...stylex.props(styles.summary)}>{summary ?? `Page ${page} of ${pageCount}`}</span>
        <div {...stylex.props(styles.list)}>
          <AriaButton isDisabled={page <= 1} onPress={() => go(page - 1)} {...stylex.props(styles.btn, styles.outline)}>
            <ArrowLeft size={14} />
            Previous
          </AriaButton>
          <AriaButton isDisabled={page >= pageCount} onPress={() => go(page + 1)} {...stylex.props(styles.btn, styles.outline)}>
            Next
            <ArrowRight size={14} />
          </AriaButton>
        </div>
      </nav>
    );
  }

  const sx = stylex.props(styles.root, xstyle);
  return (
    <nav ref={ref} aria-label={ariaLabel} {...mergeSx(sx, className, style)}>
      <ul {...stylex.props(styles.list)}>
        <li>
          <AriaButton aria-label="Previous page" isDisabled={page <= 1} onPress={() => go(page - 1)} {...stylex.props(styles.btn)}>
            <ChevronLeft size={16} />
          </AriaButton>
        </li>
        {getPaginationRange(page, pageCount, siblingCount).map((item) => (
          <li key={item}>
            {typeof item === 'number' ? (
              <AriaButton
                aria-label={`Page ${item}`}
                aria-current={item === page ? 'page' : undefined}
                onPress={() => go(item)}
                {...stylex.props(styles.btn, item === page && (accentCurrent ? styles.currentAccent : styles.current))}
              >
                {item}
              </AriaButton>
            ) : (
              <span aria-hidden="true" {...stylex.props(styles.ellipsis)}>
                …
              </span>
            )}
          </li>
        ))}
        <li>
          <AriaButton aria-label="Next page" isDisabled={page >= pageCount} onPress={() => go(page + 1)} {...stylex.props(styles.btn)}>
            <ChevronRight size={16} />
          </AriaButton>
        </li>
      </ul>
    </nav>
  );
}
