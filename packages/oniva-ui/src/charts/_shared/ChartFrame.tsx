import * as stylex from '@stylexjs/stylex';
import {
  useCallback,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { mergeRefs, useChartDimensions } from '../../internal/charts-math';
import { chartMotion } from '../../internal/charts-styles';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { ChartTooltip, type ChartTooltipRow } from '../ChartTooltip/ChartTooltip';

const styles = stylex.create({
  root: {
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-sans'],
    position: 'relative',
    width: '100%',
  },
  svg: { display: 'block', overflow: 'visible' },
  srOnly: {
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

export interface TooltipContent {
  title?: ReactNode;
  rows?: ChartTooltipRow[];
  content?: ReactNode;
}

/** Spread onto an SVG element to make it a hover/focus target that shows a tooltip. */
export interface TipBind {
  tabIndex: 0;
  role: 'graphics-symbol';
  'aria-roledescription': 'data point';
  'aria-label'?: string;
  onPointerMove: (e: PointerEvent<SVGElement>) => void;
  onPointerLeave: () => void;
  onFocus: (e: FocusEvent<SVGElement>) => void;
  onBlur: () => void;
  onKeyDown: (e: KeyboardEvent<SVGElement>) => void;
}

export interface FrameApi {
  width: number;
  height: number;
  bind: (tip: TooltipContent | null, label?: string) => TipBind;
  /** Stable per-instance id for gradients/clip paths. */
  id: string;
}

export interface DataTable {
  columns: string[];
  rows: (string | number)[][];
}

export interface ChartFrameProps {
  /** Accessible summary, e.g. "Revenue by month, January to June". */
  label: string;
  /** Fixed px height, or a function of the measured width (for aspect-driven charts). */
  height?: number | ((width: number) => number);
  /** Fixed width; omit to fill the container. */
  width?: number;
  /** Visually-hidden table that mirrors the data for screen readers. */
  dataTable?: DataTable;
  children: (api: FrameApi) => ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

let counter = 0;

/** Sizing + a11y + tooltip plumbing shared by every SVG chart. */
export function ChartFrame({
  label,
  height: heightProp = 240,
  width: fixedWidth,
  dataTable,
  children,
  className,
  xstyle,
  ref,
}: ChartFrameProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const measured = useChartDimensions(rootRef);
  const width = fixedWidth ?? measured;
  const height = typeof heightProp === 'function' ? heightProp(width) : heightProp;
  const [tip, setTip] = useState<{ x: number; y: number; data: TooltipContent } | null>(null);
  const [id] = useState(() => `oc${++counter}`);

  const at = useCallback((cx: number, cy: number, data: TooltipContent | null) => {
    const r = rootRef.current?.getBoundingClientRect();
    if (!r || !data) return setTip(null);
    setTip({ x: cx - r.left, y: cy - r.top, data });
  }, []);

  const bind = useCallback(
    (data: TooltipContent | null, ariaLabel?: string): TipBind => ({
      tabIndex: 0,
      role: 'graphics-symbol',
      'aria-roledescription': 'data point',
      'aria-label': ariaLabel,
      onPointerMove: (e) => at(e.clientX, e.clientY, data),
      onPointerLeave: () => setTip(null),
      onFocus: (e) => {
        const b = e.currentTarget.getBoundingClientRect();
        at(b.left + b.width / 2, b.top + Math.min(b.height / 2, 24), data);
      },
      onBlur: () => setTip(null),
      onKeyDown: (e) => {
        if (e.key === 'Escape') setTip(null);
      },
    }),
    [at],
  );

  const sx = stylex.props(styles.root, xstyle);
  const align = tip ? (tip.x < 80 ? 'left' : tip.x > width - 80 ? 'right' : 'center') : 'center';
  return (
    <div
      ref={mergeRefs(rootRef, ref)}
      {...sx}
      className={[sx.className, className].filter(Boolean).join(' ')}
      style={{ ...(sx.style as object), height }}
    >
      <svg
        role="group"
        aria-roledescription="chart"
        aria-label={label}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        {...stylex.props(styles.svg, chartMotion.fade)}
      >
        {children({ width, height, bind, id })}
      </svg>
      {tip && (
        <ChartTooltip x={tip.x} y={tip.y} align={align} title={tip.data.title} rows={tip.data.rows}>
          {tip.data.content}
        </ChartTooltip>
      )}
      {dataTable && (
        <div {...stylex.props(styles.srOnly)}>
          <table>
            <caption>{label}</caption>
            <thead>
              <tr>
                {dataTable.columns.map((c) => (
                  <th key={c} scope="col">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataTable.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) =>
                    j === 0 ? (
                      <th key={j} scope="row">
                        {c}
                      </th>
                    ) : (
                      <td key={j}>{c}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
