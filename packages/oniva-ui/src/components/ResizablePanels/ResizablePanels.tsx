import * as stylex from '@stylexjs/stylex';
import { focus } from '../../internal/focus';
import { useMove } from 'react-aria';
import {
  Children,
  isValidElement,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  root: {
    boxSizing: 'border-box',
    display: 'flex',
    height: '100%',
    minHeight: 0,
    minWidth: 0,
    width: '100%',
  },
  col: { flexDirection: 'column' },
  panel: {
    boxSizing: 'border-box',
    flexGrow: 0,
    flexShrink: 0,
    minHeight: 0,
    minWidth: 0,
    overflow: 'auto',
  },
  size: (p: number) => ({ flexBasis: `${p}%` }),
  handle: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    display: 'flex',
    flexShrink: 0,
    justifyContent: 'center',
    position: 'relative',
    touchAction: 'none',
  },
  handleH: { cursor: 'col-resize', width: 12 },
  handleV: { cursor: 'row-resize', height: 12 },
  grip: {
    backgroundColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-full'],
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color',
  },
  gripH: { height: '100%', width: 2 },
  gripV: { height: 2, width: '100%' },
  gripActive: { backgroundColor: colors['--oniva-color-focus-ring'] },
  pill: {
    backgroundColor: colors['--oniva-color-border-hover'],
    borderRadius: radius['--oniva-radius-full'],
    position: 'absolute',
  },
  pillH: { height: 32, width: 4 },
  pillV: { height: 4, width: 32 },
});

export interface ResizablePanelProps {
  /** Initial size in percent. Unset panels share the remaining space equally. */
  defaultSize?: number;
  /** Minimum size in percent. Default 10. */
  minSize?: number;
  /** Accessible label (used by the handle before this panel is `aria-label`). */
  'aria-label'?: string;
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  className?: string;
}

/** Declarative panel: renders nothing by itself; `ResizablePanels` lays it out. */
export function ResizablePanel(_props: ResizablePanelProps): null {
  return null;
}

function Handle({
  orientation,
  value,
  min,
  max,
  label,
  onMove,
  onEnd,
}: {
  orientation: 'horizontal' | 'vertical';
  value: number;
  min: number;
  max: number;
  label: string;
  onMove: (deltaPx: number) => void;
  onEnd?: () => void;
}) {
  const [active, setActive] = useState(false);
  const horizontal = orientation === 'horizontal';
  const { moveProps } = useMove({
    onMoveStart() {
      setActive(true);
    },
    onMove(e) {
      const d = horizontal ? e.deltaX : e.deltaY;
      onMove(e.pointerType === 'keyboard' ? d * 16 : d);
    },
    onMoveEnd() {
      setActive(false);
      onEnd?.();
    },
  });
  return (
    <div
      {...moveProps}
      role="separator"
      tabIndex={0}
      aria-label={label}
      aria-orientation={horizontal ? 'vertical' : 'horizontal'}
      aria-valuenow={Math.round(value)}
      aria-valuemin={min}
      aria-valuemax={max}
      {...stylex.props(styles.handle, focus.inset, horizontal ? styles.handleH : styles.handleV)}
    >
      <span
        aria-hidden="true"
        {...stylex.props(
          styles.grip,
          horizontal ? styles.gripH : styles.gripV,
          active && styles.gripActive,
        )}
      />
      <span
        aria-hidden="true"
        {...stylex.props(styles.pill, horizontal ? styles.pillH : styles.pillV)}
      />
    </div>
  );
}

export interface ResizablePanelsProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'style' | 'className' | 'children'
> {
  /** `horizontal` = panels side by side (drag left/right). `vertical` = stacked. */
  direction?: 'horizontal' | 'vertical';
  /** `ResizablePanel` children (2 or more). */
  children: ReactNode;
  /** Fires with the new percent sizes after each change. */
  onResize?: (sizes: number[]) => void;
  className?: string;
  style?: CSSProperties;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function ResizablePanels({
  direction = 'horizontal',
  children,
  onResize,
  className,
  style,
  xstyle,
  ref,
  ...rest
}: ResizablePanelsProps) {
  const panels = Children.toArray(children).filter(
    isValidElement,
  ) as ReactElement<ResizablePanelProps>[];
  const [sizes, setSizes] = useState<number[]>(() => {
    const fixed = panels.reduce((a, p) => a + (p.props.defaultSize ?? 0), 0);
    const free = panels.filter((p) => p.props.defaultSize === undefined).length;
    const each = free ? Math.max(100 - fixed, 0) / free : 0;
    return panels.map((p) => p.props.defaultSize ?? each);
  });
  const rootRef = useRef<HTMLDivElement | null>(null);
  const horizontal = direction === 'horizontal';

  const resize = (index: number, deltaPx: number) => {
    const rect = rootRef.current?.getBoundingClientRect();
    const total = rect ? (horizontal ? rect.width : rect.height) : 0;
    const deltaPct = total > 0 ? (deltaPx / total) * 100 : deltaPx / 10;
    setSizes((prev) => {
      const a = prev[index] ?? 0;
      const b = prev[index + 1] ?? 0;
      const minA = panels[index]?.props.minSize ?? 10;
      const minB = panels[index + 1]?.props.minSize ?? 10;
      const next = Math.min(Math.max(a + deltaPct, minA), a + b - minB);
      if (next === a) return prev;
      const out = [...prev];
      out[index] = next;
      out[index + 1] = a + b - next;
      onResize?.(out);
      return out;
    });
  };

  const sx = stylex.props(styles.root, !horizontal && styles.col, xstyle);
  const merged = mergeSx(sx, className, style);
  return (
    <div
      {...rest}
      ref={(n) => {
        rootRef.current = n;
        if (typeof ref === 'function') ref(n);
        else if (ref) ref.current = n;
      }}
      {...merged}
    >
      {panels.map((p, i) => {
        const {
          children: content,
          xstyle: pStyle,
          className: pClass,
          minSize = 10,
          'aria-label': pLabel,
        } = p.props;
        const panelSx = stylex.props(styles.panel, styles.size(sizes[i] ?? 0), pStyle);
        return [
          <div key={`p${i}`} role="group" aria-label={pLabel} {...mergeSx(panelSx, pClass)}>
            {content}
          </div>,
          i < panels.length - 1 && (
            <Handle
              key={`h${i}`}
              orientation={direction}
              value={sizes[i] ?? 0}
              min={minSize}
              max={Math.round(
                (sizes[i] ?? 0) + (sizes[i + 1] ?? 0) - (panels[i + 1]?.props.minSize ?? 10),
              )}
              label={pLabel ? `Resize ${pLabel}` : `Resize panel ${i + 1}`}
              onMove={(d) => resize(i, d)}
            />
          ),
        ];
      })}
    </div>
  );
}
