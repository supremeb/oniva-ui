import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { chartMotion, toneStyle } from '../../internal/charts-styles';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    gap: 8,
    width: '100%',
  },
  track: { display: 'flex', gap: 2, height: 10, position: 'relative' },
  seg: { backgroundColor: 'currentColor', minWidth: 3 },
  first: { borderBottomLeftRadius: 9999, borderTopLeftRadius: 9999 },
  last: { borderBottomRightRadius: 9999, borderTopRightRadius: 9999 },
  marker: {
    backgroundColor: colors['--oniva-color-text'],
    borderColor: colors['--oniva-color-surface'],
    borderRadius: 9999,
    borderStyle: 'solid',
    borderWidth: 2,
    boxSizing: 'border-box',
    height: 16,
    position: 'absolute',
    top: -3,
    transform: 'translateX(-50%)',
    width: 16,
  },
  labels: {
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-medium'],
    justifyContent: 'space-between',
  },
});

export interface CategorySegment {
  /** Size of the segment (relative; they're normalised to 100%). */
  value: number;
  tone?: number;
  label?: ReactNode;
}

export interface CategoryBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  segments: CategorySegment[];
  /** 0..total position of the marker, in the same units as the segments. */
  marker?: number;
  /** Show each segment's label under the bar. */
  showLabels?: boolean;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Segmented bar with an optional marker, e.g. a score against low / fair / good ranges. */
export function CategoryBar({
  segments,
  marker,
  showLabels = false,
  className,
  xstyle,
  ref,
  ...rest
}: CategoryBarProps) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const sx = stylex.props(styles.root, xstyle);
  const summary = segments
    .map(
      (s) =>
        `${typeof s.label === 'string' ? s.label : 'Segment'} ${Math.round((s.value / total) * 100)}%`,
    )
    .join(', ');
  return (
    <div
      role="img"
      aria-label={`Category bar: ${summary}${marker != null ? `; marker at ${marker}` : ''}`}
      {...rest}
      ref={ref}
      {...sx}
      className={[sx.className, className].filter(Boolean).join(' ')}
    >
      <div {...stylex.props(styles.track)}>
        {segments.map((s, i) => (
          <div
            key={i}
            {...stylex.props(
              toneStyle(s.tone ?? i + 1),
              styles.seg,
              i === 0 && styles.first,
              i === segments.length - 1 && styles.last,
              chartMotion.growX,
            )}
            style={{ animationDelay: `${i * 70}ms`, flexGrow: s.value / total, flexBasis: 0 }}
          />
        ))}
        {marker != null && (
          <span
            {...stylex.props(styles.marker)}
            style={{ left: `${Math.min(100, Math.max(0, (marker / total) * 100))}%` }}
          />
        )}
      </div>
      {showLabels && (
        <div {...stylex.props(styles.labels)}>
          {segments.map((s, i) => (
            <span key={i} style={{ flexGrow: s.value / total, flexBasis: 0 }}>
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
