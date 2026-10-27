import * as stylex from '@stylexjs/stylex';
import { Activity, Database, Plug, Sparkles, Zap } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ListBox, ListBoxItem, type Selection } from 'react-aria-components';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { focus } from '../../internal/focus';
import { sxClass } from '../../internal/sx';
import { fillSvg } from '../../internal/w7-parts';
import { Scene, useScene, type IllustrationProps } from '../../internal/w7-scene';
import { useIsoLayoutEffect } from '../../internal/r5-beam-engine';

const styles = stylex.create({
  grid: {
    alignItems: 'center',
    display: 'grid',
    gap: '4cqw',
    gridTemplateColumns: '1fr 1fr',
    inset: 0,
    padding: '3cqw 5cqw',
    position: 'absolute',
  },
  stage: { height: '100%', perspective: '140cqw', position: 'relative', width: '100%' },
  iso: {
    height: '29cqw',
    left: '48%',
    marginLeft: '-14.5cqw',
    marginTop: '-14.5cqw',
    position: 'absolute',
    top: '62%',
    transform: 'rotateX(58deg) rotateZ(-42deg)',
    transformStyle: 'preserve-3d',
    width: '29cqw',
  },
  layer: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-xxl'],
    boxShadow: `inset 0 0 0 1px ${colors['--oniva-color-border-hover']}, 0 1.2cqw 0 -0.2cqw ${colors['--oniva-color-border']}`,
    inset: 0,
    opacity: 1,
    position: 'absolute',
    transitionDuration: motion['--oniva-motion-dur-slower'],
    transitionProperty: 'transform, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-in-out'],
  },
  layerAbove: { opacity: 0.55 },
  faceOn: {
    alignItems: 'center',
    backgroundImage: `linear-gradient(145deg, ${accent['--oniva-accent-400']}, ${accent['--oniva-accent-600']})`,
    borderRadius: radius['--oniva-radius-xxl'],
    boxShadow: `inset 0 0 0 1px ${accent['--oniva-accent-700']}, 0 1.2cqw 0 -0.2cqw ${accent['--oniva-accent-700']}`,
    color: colors['--oniva-color-accent-fg'],
    display: 'flex',
    inset: 0,
    justifyContent: 'center',
    opacity: 0,
    position: 'absolute',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  faceOnShown: { opacity: 1 },
  glow: {
    backgroundColor: accent['--oniva-accent-400'],
    borderRadius: radius['--oniva-radius-xxl'],
    filter: 'blur(3.4cqw)',
    inset: '10%',
    opacity: 0,
    position: 'absolute',
    transform: 'translateZ(-0.5cqw) translateY(4cqw)',
    transitionDuration: motion['--oniva-motion-dur-slower'],
    transitionProperty: 'opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  glowOn: { opacity: 0.6 },
  layerIcon: {
    display: 'inline-flex',
    height: '38%',
    transform: 'scale(0.8)',
    transitionDelay: { default: '0ms', ':is([data-on])': '120ms' },
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '38%',
  },
  layerIconOn: { transform: 'scale(1)' },
  z: (cqw: number) => ({ transform: `translateZ(${cqw}cqw)` }),
  list: { display: 'flex', flexDirection: 'column', gap: '0.8cqw', outline: 'none' },
  item: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: radius['--oniva-radius-xl'],
    color: colors['--oniva-color-text-muted'],
    cursor: 'pointer',
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    gap: '2cqw',
    padding: '1.6cqw 2cqw',
    position: 'relative',
    transform: { default: 'scale(1)', ':active': 'scale(0.98)' },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, color, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    zIndex: 1,
  },
  itemOn: { color: colors['--oniva-color-text'] },
  itemHover: { backgroundColor: { default: null, ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-hover'] } } },
  pill: {
    backgroundColor: colors['--oniva-color-surface'],
    borderRadius: radius['--oniva-radius-xl'],
    boxShadow: `${shadow['--oniva-shadow-md']}, 0 0 0 1px ${colors['--oniva-color-border']}`,
    left: 0,
    opacity: 0,
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    top: 0,
    transitionDuration: motion['--oniva-motion-dur-sheet'],
    transitionProperty: 'transform, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-in-out'],
    zIndex: 0,
  },
  listWrap: { position: 'relative' },
  icon: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-md'],
    color: colors['--oniva-color-text-on-tertiary'],
    display: 'inline-flex',
    flexShrink: 0,
    height: '5.2cqw',
    justifyContent: 'center',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'background-color, color, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '5.2cqw',
  },
  iconOn: { backgroundColor: colors['--oniva-color-accent-soft'], color: colors['--oniva-color-accent-soft-fg'], transform: 'scale(1.06)' },
  glyph: { height: '58%', width: '58%' },
  title: { fontSize: '2.5cqw', fontWeight: 600, lineHeight: 1.2, transitionDuration: motion['--oniva-motion-dur-slow'], transitionProperty: 'color' },
  titleOn: { color: colors['--oniva-color-accent-soft-fg'] },
  hint: { color: colors['--oniva-color-text-muted'], display: 'block', fontSize: '1.9cqw', lineHeight: 1.3 },
});

export interface LayerStackItem {
  title: string;
  hint?: string;
  icon?: ReactNode;
}

export interface LayerStackProps extends IllustrationProps {
  /** Up to five entries, top layer first. */
  items?: LayerStackItem[];
  /** Entry to start on (uncontrolled). */
  defaultIndex?: number;
  /** Selected entry (controlled). */
  index?: number;
  /** Time per entry while it plays on its own, in ms. Set to `0` to never auto-play. */
  interval?: number;
  onChange?: (index: number) => void;
}

const g = (I: typeof Zap) => <I {...stylex.props(styles.glyph, fillSvg.svg)} />;
const DEFAULT: LayerStackItem[] = [
  { title: 'Interface', hint: 'What your team and customers see', icon: g(Sparkles) },
  { title: 'Automations', hint: 'Rules that run without a click', icon: g(Zap) },
  { title: 'Integrations', hint: 'Two-way sync with your tools', icon: g(Plug) },
  { title: 'Data', hint: 'One governed source of truth', icon: g(Database) },
  { title: 'Monitoring', hint: 'Health checks and alerts', icon: g(Activity) },
];

function StackBody({
  list,
  defaultIndex,
  index: controlled,
  interval,
  onChange,
}: { list: LayerStackItem[] } & Required<Pick<LayerStackProps, 'defaultIndex' | 'interval'>> & Pick<LayerStackProps, 'index' | 'onChange'>) {
  const [own, setOwn] = useState(defaultIndex);
  const [engaged, setEngaged] = useState(false); // hovered or focused
  const [stopped, setStopped] = useState(false); // user picked one
  const { live, reduced } = useScene();
  const current = Math.min(controlled ?? own, list.length - 1);
  const shown = current;
  const auto = interval > 0 && !engaged && !stopped && controlled === undefined && live && !reduced && list.length > 1;
  // Steps through the entries on its own; pauses in place while hovered or focused, stops for good after a pick
  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => setOwn((i) => (i + 1) % list.length), interval);
    return () => window.clearInterval(id);
  }, [auto, interval, list.length]);
  const select = (i: number) => {
    setStopped(true);
    if (controlled === undefined) setOwn(i);
    onChange?.(i);
  };
  const listRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const placed = useRef(false);
  // The white card glides behind the chosen entry (transform only; measured with physical offsets)
  useIsoLayoutEffect(() => {
    const wrap = listRef.current;
    const pill = pillRef.current;
    if (!wrap || !pill) return;
    const place = () => {
      const row = wrap.querySelectorAll<HTMLElement>('[role="option"]')[shown];
      if (!row) return;
      pill.style.height = `${row.offsetHeight}px`;
      pill.style.transform = `translateY(${row.offsetTop}px)`;
      if (!placed.current) {
        // First placement: no glide from the top
        pill.style.transitionDuration = '0s';
        void pill.offsetHeight;
        placed.current = true;
        requestAnimationFrame(() => {
          pill.style.transitionDuration = '';
        });
      }
      pill.style.opacity = '1';
    };
    place();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(place);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [shown, list.length]);
  const n = list.length;
  return (
    <>
      <div
        onPointerEnter={() => setEngaged(true)}
        onPointerLeave={() => setEngaged(false)}
        onFocus={() => setEngaged(true)}
        onBlur={() => setEngaged(false)}
        {...stylex.props(styles.grid)}
      >
        <div aria-hidden="true" {...stylex.props(styles.stage)}>
          <div {...stylex.props(styles.iso)}>
            {list.map((_, i) => {
              const base = (n - 1 - i) * 4.5;
              // The chosen layer and the ones above glide up to open a gap (the bottom layer stays put)
              const lift = i < shown ? 10 : i === shown && shown < n - 1 ? 6 : 0;
              const on = i === shown;
              return (
                <span key={i} {...stylex.props(styles.layer, i < shown && styles.layerAbove, styles.z(base + lift))}>
                  <span {...stylex.props(styles.glow, on && styles.glowOn)} />
                  <span {...stylex.props(styles.faceOn, on && styles.faceOnShown)}>
                    <span data-on={on ? '' : undefined} {...stylex.props(styles.layerIcon, on && styles.layerIconOn)}>
                      {list[i]!.icon ?? g(Sparkles)}
                    </span>
                  </span>
                </span>
              );
            })}
          </div>
        </div>
        <div {...stylex.props(styles.listWrap)}>
        <span ref={pillRef} aria-hidden="true" {...stylex.props(styles.pill)} />
        <ListBox
          ref={listRef}
          aria-label="Layers"
          selectionMode="single"
          disallowEmptySelection
          selectionBehavior="replace"
          selectedKeys={[String(shown)]}
          onSelectionChange={(keys: Selection) => {
            const k = keys === 'all' ? null : [...keys][0];
            if (k != null) select(Number(k));
          }}
          className={sxClass(stylex.props(styles.list))}
        >
          {list.map((it, i) => (
            <ListBoxItem
              key={i}
              id={String(i)}
              textValue={it.title}
              className={({ isSelected, isFocusVisible }) =>
                sxClass(stylex.props(styles.item, isSelected ? styles.itemOn : styles.itemHover, isFocusVisible && focus.inset))
              }
            >
              {({ isSelected }) => (
                <>
                  <span {...stylex.props(styles.icon, isSelected && styles.iconOn)}>{it.icon ?? g(Sparkles)}</span>
                  <span>
                    <span {...stylex.props(styles.title, isSelected && styles.titleOn)}>{it.title}</span>
                    {it.hint && <span {...stylex.props(styles.hint)}>{it.hint}</span>}
                  </span>
                </>
              )}
            </ListBoxItem>
          ))}
        </ListBox>
        </div>
      </div>
    </>
  );
}

/** Isometric stack of layers beside a list. The chosen entry lifts its layer out in colour. Plays on its own until you pick one. */
export function LayerStack({
  items = DEFAULT,
  defaultIndex = 0,
  index,
  interval = 2600,
  onChange,
  label,
  ...rest
}: LayerStackProps) {
  const list = items.slice(0, 5);
  return (
    <Scene ratio="16 / 9" role="group" label={label ?? `Layered stack: ${list.map((l) => l.title).join(', ')}`} {...rest}>
      <StackBody list={list} defaultIndex={defaultIndex} index={index} interval={interval} onChange={onChange} />
    </Scene>
  );
}
