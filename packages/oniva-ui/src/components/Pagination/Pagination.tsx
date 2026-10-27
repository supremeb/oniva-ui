import * as stylex from '@stylexjs/stylex';
import { media } from '../../tokens/media.stylex';
import { focus } from '../../internal/focus';
import { Button as AriaButton } from 'react-aria-components';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, type CSSProperties, type Ref } from 'react';
import { mergeSx } from '../../internal/sx';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  root: {
    alignItems: 'center',
    boxSizing: 'border-box',
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    gap: 4,
  },
  footer: { justifyContent: 'space-between', width: '100%' },
  summary: { color: colors['--oniva-color-text-muted'], fontVariantNumeric: 'tabular-nums' },
  list: { alignItems: 'center', display: 'flex', gap: 4, listStyle: 'none', margin: 0, padding: 0 },
  btn: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-inset-hover'] },
    },
    borderColor: 'transparent',
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: {
      default: colors['--oniva-color-text-muted'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-text'] },
      ':disabled': colors['--oniva-color-text-disabled'],
    },
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 6,
    height: 32,
    justifyContent: 'center',
    minWidth: 32,
    paddingInline: 8,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, color, box-shadow',
    transitionTimingFunction: motion['--oniva-motion-ease-standard'],
  },
  outline: {
    backgroundColor: {
      default: colors['--oniva-color-surface'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-hover'] },
      ':disabled': colors['--oniva-color-surface'],
    },
    borderColor: colors['--oniva-color-border'],
    boxShadow: 'none',
    color: {
      default: colors['--oniva-color-text'],
      ':disabled': colors['--oniva-color-text-disabled'],
    },
    paddingInline: 12,
  },
  current: {
    backgroundColor: {
      default: colors['--oniva-color-surface'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface'] },
    },
    borderColor: colors['--oniva-color-border'],
    boxShadow: 'none',
    color: colors['--oniva-color-text'],
  },
  currentAccent: {
    backgroundColor: { default: accent['--oniva-accent-solid'], ':hover': { default: null, [media.hover]: accent['--oniva-accent-solid'] } },
    borderColor: 'transparent',
    boxShadow: 'none',
    color: {
      default: colors['--oniva-color-accent-fg'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-accent-fg'] },
    },
  },
  ellipsis: {
    alignItems: 'center',
    color: colors['--oniva-color-text-subtle'],
    display: 'inline-flex',
    height: 32,
    justifyContent: 'center',
    minWidth: 24,
  },
});

export type PaginationItem = number | 'ellipsis-start' | 'ellipsis-end';

/** Pages to render: always first/last, `siblings` around the current page, ellipses for gaps. */
export function getPaginationRange(
  page: number,
  pageCount: number,
  siblings = 1,
): PaginationItem[] {
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
    return [
      1,
      'ellipsis-start',
      ...Array.from({ length: span }, (_, i) => pageCount - span + 1 + i),
    ];
  }
  return [
    1,
    'ellipsis-start',
    ...Array.from({ length: right - left + 1 }, (_, i) => left + i),
    'ellipsis-end',
    pageCount,
  ];
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
  /** Highlight current page with a flat accent fill. */
  accentCurrent?: boolean;
  'aria-label'?: string;
  /** Override built-in strings (localisation). */
  labels?: {
    previous?: string;
    next?: string;
    previousPage?: string;
    nextPage?: string;
    page?: (page: number) => string;
    summary?: (page: number, pageCount: number) => string;
  };
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
  labels,
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
        <span {...stylex.props(styles.summary)}>{summary ?? labels?.summary?.(page, pageCount) ?? `Page ${page} of ${pageCount}`}</span>
        <div {...stylex.props(styles.list)}>
          <AriaButton
            isDisabled={page <= 1}
            onPress={() => go(page - 1)}
            {...stylex.props(styles.btn, focus.ring, styles.outline)}
          >
            <ArrowLeft size={14} />
            {labels?.previous ?? 'Previous'}
          </AriaButton>
          <AriaButton
            isDisabled={page >= pageCount}
            onPress={() => go(page + 1)}
            {...stylex.props(styles.btn, focus.ring, styles.outline)}
          >
            {labels?.next ?? 'Next'}
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
          <AriaButton
            aria-label={labels?.previousPage ?? 'Previous page'}
            isDisabled={page <= 1}
            onPress={() => go(page - 1)}
            {...stylex.props(styles.btn, focus.ring)}
          >
            <ChevronLeft size={16} />
          </AriaButton>
        </li>
        {getPaginationRange(page, pageCount, siblingCount).map((item) => (
          <li key={item}>
            {typeof item === 'number' ? (
              <AriaButton
                aria-label={labels?.page ? labels.page(item) : `Page ${item}`}
                aria-current={item === page ? 'page' : undefined}
                onPress={() => go(item)}
                {...stylex.props(
                  styles.btn,
                  focus.ring,
                  item === page && (accentCurrent ? styles.currentAccent : styles.current),
                )}
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
          <AriaButton
            aria-label={labels?.nextPage ?? 'Next page'}
            isDisabled={page >= pageCount}
            onPress={() => go(page + 1)}
            {...stylex.props(styles.btn, focus.ring)}
          >
            <ChevronRight size={16} />
          </AriaButton>
        </li>
      </ul>
    </nav>
  );
}
