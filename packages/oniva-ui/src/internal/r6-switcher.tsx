import * as stylex from '@stylexjs/stylex';
import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { colors } from '../tokens/colors.stylex';
import { font } from '../tokens/font.stylex';
import { motion } from '../tokens/motion.stylex';
import { radius } from '../tokens/radius.stylex';
import { shadow } from '../tokens/shadow.stylex';
import { focus } from './focus';

/**
 * Map region/continent menu. A pill that morphs open into a listbox (clip-path grows out of the trigger-sized
 * corner, rows fade in after the shape), one hover fill glides between rows, the check pops in on the selected row.
 * Keyboard moves do not animate the fill's travel beyond the glide (it is the only indicator), selection is instant.
 */

const styles = stylex.create({
  wrap: {
    left: 0,
    padding: 12,
    position: 'absolute',
    top: 0,
    transformOrigin: '0 0',
    zIndex: 2,
  },
  trigger: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-sm'],
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: 13,
    fontWeight: 500,
    gap: 4,
    height: 28,
    lineHeight: 1,
    margin: 0,
    padding: '0 8px 0 12px',
    transform: { default: 'scale(1)', ':active': 'scale(0.96)' },
    transitionDuration: motion['--oniva-motion-dur-press'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    whiteSpace: 'nowrap',
  },
  chevron: {
    height: 14,
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: 14,
  },
  chevronOpen: { transform: 'rotate(180deg)' },
  menu: {
    filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.08)) drop-shadow(0 1px 2.5px rgba(0, 0, 0, 0.05))',
    left: 12,
    position: 'absolute',
    top: 46,
    width: 172,
  },
  menuClosed: { pointerEvents: 'none', visibility: 'hidden' },
  panel: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    clipPath: 'inset(0 0 0 0 round 16px)',
    display: 'flex',
    flexDirection: 'column',
    outline: 'none',
    padding: 5,
    position: 'relative',
    transitionDuration: motion['--oniva-motion-dur-sheet'],
    transitionProperty: 'clip-path',
    transitionTimingFunction: motion['--oniva-motion-ease-drawer'],
  },
  panelClosed: {
    clipPath: 'inset(0 calc(100% - var(--r6-from-w)) calc(100% - var(--r6-from-h)) 0 round calc(var(--r6-from-h) / 2))',
    transitionDuration: motion['--oniva-motion-dur-slow'],
  },
  fill: {
    backgroundColor: colors['--oniva-color-surface-hover'],
    borderRadius: radius['--oniva-radius-lg'],
    left: 5,
    pointerEvents: 'none',
    position: 'absolute',
    right: 5,
    top: 0,
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-in-out'],
  },
  fillGlide: { transitionProperty: 'transform, opacity' },
  option: {
    alignItems: 'center',
    borderRadius: radius['--oniva-radius-lg'],
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: 13,
    fontWeight: 500,
    gap: 8,
    lineHeight: '18px',
    padding: '7px 8px 7px 10px',
    position: 'relative',
    transitionDelay: '110ms',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  optionClosed: {
    opacity: 0,
    transform: 'translateY(-4px)',
    transitionDelay: '0ms',
    transitionDuration: motion['--oniva-motion-dur-fast'],
  },
  name: { flex: '1', minWidth: 0, whiteSpace: 'nowrap' },
  check: {
    height: 15,
    opacity: 0,
    transform: 'scale(0.6)',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-spring'],
    width: 15,
  },
  checkOn: { opacity: 1, transform: 'scale(1)' },
});

export interface SwitcherOption {
  id: string;
  name: string;
}

export function RegionSwitcher({
  options,
  value,
  onChange,
  label,
}: {
  options: SwitcherOption[];
  value: string;
  onChange: (id: string) => void;
  label: string;
}) {
  const id = 'r6sw' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const wrap = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const rows = useRef<(HTMLDivElement | null)[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [from, setFrom] = useState({ w: 0, h: 0 });
  const [fill, setFill] = useState({ y: 0, h: 0, glide: false });
  const [shown, setShown] = useState(false);
  const wasShown = useRef(false);
  const [scale, setScale] = useState(1);
  const selected = Math.max(0, options.findIndex((o) => o.id === value));

  useLayoutEffect(() => {
    const t = trigger.current;
    if (t) setFrom({ w: t.offsetWidth, h: t.offsetHeight });
  }, [value, open]);

  // The menu scales down with the illustration (to about 60 %)
  useEffect(() => {
    const parent = wrap.current?.parentElement;
    if (!parent || typeof ResizeObserver === 'undefined') return;
    const fit = () => setScale(Math.min(1, Math.max(0.62, parent.clientWidth / 540)));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(parent);
    return () => ro.disconnect();
  }, []);

  const show = () => {
    setActive(selected);
    setShown(false);
    setOpen(true);
  };
  const close = (refocus: boolean) => {
    setOpen(false);
    if (refocus) trigger.current?.focus();
  };
  const pick = (i: number) => {
    onChange(options[i]!.id);
    close(true);
  };
  useEffect(() => {
    if (open) panel.current?.focus({ preventScroll: true });
  }, [open]);

  useLayoutEffect(() => {
    const row = rows.current[active];
    if (row) setFill({ y: row.offsetTop, h: row.offsetHeight, glide: wasShown.current && shown });
    wasShown.current = shown;
  }, [active, open, shown]);

  useEffect(() => {
    if (!open) return;
    const away = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panel.current?.contains(target) || trigger.current?.contains(target)) return;
      close(false);
    };
    document.addEventListener('pointerdown', away);
    return () => document.removeEventListener('pointerdown', away);
  }, [open]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = options.length - 1;
    const moves: Record<string, number> = {
      ArrowDown: Math.min(last, active + 1),
      ArrowUp: Math.max(0, active - 1),
      Home: 0,
      End: last,
    };
    if (event.key in moves) {
      event.preventDefault();
      setActive(moves[event.key]!);
      setShown(true);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      pick(active);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close(true);
    } else if (event.key === 'Tab') {
      close(false);
    }
  };

  const vars = { '--r6-from-w': `${from.w}px`, '--r6-from-h': `${from.h}px` } as CSSProperties;
  return (
    <div ref={wrap} style={{ transform: `scale(${scale})` }} {...stylex.props(styles.wrap)}>
      <button
        ref={trigger}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={`${label}: ${options[selected]!.name}`}
        onClick={() => (open ? close(false) : show())}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            show();
          }
        }}
        {...stylex.props(styles.trigger, focus.ring)}
      >
        <span>{options[selected]!.name}</span>
        <ChevronDown aria-hidden="true" {...stylex.props(styles.chevron, open && styles.chevronOpen)} />
      </button>
      <div
        style={vars}
        data-closed={open ? undefined : ''}
        inert={!open}
        {...stylex.props(styles.menu, !open && styles.menuClosed)}
      >
        <div
          ref={panel}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-label={`Select ${label.toLowerCase()}`}
          aria-activedescendant={`${id}-${active}`}
          onKeyDown={onKeyDown}
          onPointerLeave={() => setShown(false)}
          {...stylex.props(styles.panel, !open && styles.panelClosed)}
        >
          <span
            aria-hidden="true"
            style={{ height: fill.h, opacity: shown ? 1 : 0, transform: `translateY(${fill.y}px)` }}
            {...stylex.props(styles.fill, fill.glide && styles.fillGlide)}
          />
          {options.map((o, i) => (
            <div
              key={o.id}
              ref={(el) => {
                rows.current[i] = el;
              }}
              id={`${id}-${i}`}
              role="option"
              aria-selected={i === selected}
              onPointerEnter={() => {
                setActive(i);
                setShown(true);
              }}
              onClick={() => pick(i)}
              {...stylex.props(styles.option, !open && styles.optionClosed)}
            >
              <span {...stylex.props(styles.name)}>{o.name}</span>
              <Check aria-hidden="true" {...stylex.props(styles.check, i === selected && styles.checkOn)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
