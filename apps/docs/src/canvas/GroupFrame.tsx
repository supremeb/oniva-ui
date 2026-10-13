import * as stylex from '@stylexjs/stylex';
import { Component, memo, useEffect, useRef, type ReactNode } from 'react';
import { accent } from '@oniva-tokens/accent.stylex';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import { radius } from '@oniva-tokens/radius.stylex';
import type { CanvasEntry } from './catalog';

const fade = stylex.keyframes({
  from: { opacity: 1 },
  to: { opacity: 0 },
});

const MUTED_BORDER = `color-mix(in srgb, ${colors['--oniva-color-text-muted']} 25%, transparent)`;

const styles = stylex.create({
  group: { left: 0, position: 'absolute', top: 0, width: 900 /* keep in sync with GROUP_W in layout.ts */ },
  title: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    height: 20,
    lineHeight: '20px',
    marginBlockEnd: 8,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  frame: {
    borderColor: MUTED_BORDER,
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'dashed',
    borderWidth: 1,
    boxSizing: 'border-box',
    padding: 24,
    position: 'relative',
  },
  slots: { columnGap: 24, display: 'grid', rowGap: 24 },
  slotCaption: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    height: 16,
    lineHeight: '16px',
    marginBlockEnd: 8,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  slotBox: { minWidth: 0 },
  // Fixed-position demo content stays inside its slot; wide content scrolls inside the slot.
  preview: {
    contain: 'layout paint',
    minHeight: 64,
    overflow: 'auto',
    position: 'relative',
  },
  tile: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    height: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
    textAlign: 'center',
  },
  tileTitle: { color: colors['--oniva-color-text'], fontWeight: font['--oniva-font-weight-medium'], lineHeight: 1.1 },
  ring: {
    animationDuration: '1400ms',
    animationFillMode: 'forwards',
    animationName: fade,
    animationTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
    borderColor: accent['--oniva-accent-500'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 2,
    insetBlockEnd: -6,
    insetBlockStart: -6,
    insetInlineEnd: -6,
    insetInlineStart: -6,
    pointerEvents: 'none',
    position: 'absolute',
  },
  ringStatic: { animationName: 'none' },
  error: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], padding: 12 },
});

class PreviewBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p {...stylex.props(styles.error)}>This preview failed to render.</p>
    ) : (
      this.props.children
    );
  }
}

export interface GroupFrameProps {
  entry: CanvasEntry;
  x: number;
  y: number;
  /** Cached (measured) or estimated total height, used while the live preview is unmounted. */
  height: number;
  mode: 'live' | 'tile';
  paused: boolean;
  highlighted: boolean;
  reducedMotion: boolean;
  tileFont: number;
  observe: (el: HTMLElement) => () => void;
}

export const GroupFrame = memo(function GroupFrame({
  entry,
  x,
  y,
  height,
  mode,
  paused,
  highlighted,
  reducedMotion,
  tileFont,
  observe,
}: GroupFrameProps) {
  const ref = useRef<HTMLDivElement>(null);
  const live = mode === 'live';
  useEffect(() => {
    if (!live || !ref.current) return;
    return observe(ref.current);
  }, [live, observe]);
  const titleId = `canvas-title-${entry.id}`;
  return (
    <div
      ref={ref}
      role="group"
      aria-labelledby={titleId}
      id={`group-${entry.slug}`}
      data-canvas-group={entry.id}
      data-canvas-paused={paused ? 'true' : undefined}
      data-mode={mode}
      {...stylex.props(styles.group)}
      style={{ transform: `translate(${x}px, ${y}px)`, height: live ? undefined : height }}
    >
      <div id={titleId} {...stylex.props(styles.title)}>
        {entry.title}
      </div>
      <div {...stylex.props(styles.frame)} style={live ? undefined : { height: Math.max(0, height - 28) }}>
        {live ? (
          <div {...stylex.props(styles.slots)} style={{ gridTemplateColumns: `repeat(${entry.cols}, minmax(0, 1fr))` }}>
            {entry.demos.map((d) => (
              <div key={d.name} {...stylex.props(styles.slotBox)}>
                <div {...stylex.props(styles.slotCaption)}>{d.name}</div>
                <div data-canvas-preview {...stylex.props(styles.preview)}>
                  <PreviewBoundary>
                    <d.Component />
                  </PreviewBoundary>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div aria-hidden="true" {...stylex.props(styles.tile)}>
            <div {...stylex.props(styles.tileTitle)} style={{ fontSize: tileFont }}>
              {entry.title}
            </div>
            <div style={{ fontSize: Math.max(12, tileFont * 0.6) }}>
              {entry.category} · {entry.demos.length} {entry.demos.length === 1 ? 'variant' : 'variants'}
            </div>
          </div>
        )}
        {highlighted ? <span aria-hidden="true" data-testid="canvas-ring" {...stylex.props(styles.ring, reducedMotion && styles.ringStatic)} /> : null}
      </div>
    </div>
  );
});
