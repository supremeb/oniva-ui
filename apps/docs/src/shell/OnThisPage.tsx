import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import { radius } from '@oniva-tokens/radius.stylex';

const s = stylex.create({
  // Pinned just right of the 296px left nav, vertically centred in the viewport (owner: keep the location spotter next to the nav).
  rail: { display: { default: 'none', '@media (min-width: 1180px)': 'block' }, insetBlockStart: '50%', insetInlineStart: 312, position: 'fixed', transform: 'translateY(-50%)', zIndex: 10 },
  list: { listStyle: 'none', margin: 0, padding: 0 },
  li: { position: 'relative' },
  a: { alignItems: 'center', display: 'flex', height: 19, textDecoration: 'none', width: 40 },
  tick: { backgroundColor: colors['--oniva-color-border-hover'], borderRadius: 1, flexShrink: 0, height: 2, transitionDuration: '150ms', transitionProperty: 'width, background-color', width: 14 },
  tickOn: { backgroundColor: colors['--oniva-color-text'], width: 26 },
  label: {
    backgroundColor: colors['--oniva-color-surface'], borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-md'], borderStyle: 'solid', borderWidth: 1, boxShadow: '0 4px 14px rgb(0 0 0 / 0.18)',
    color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-12'], insetBlockStart: -2, insetInlineStart: 36, opacity: 0, padding: '3px 8px', pointerEvents: 'none', position: 'absolute', transitionDuration: '120ms', transitionProperty: 'opacity',
    whiteSpace: 'nowrap', zIndex: 5,
  },
  labelShow: { opacity: 1 },
});

export function OnThisPage() {
  const { pathname } = useLocation();
  const [heads, setHeads] = useState<{ id: string; text: string }[]>([]);
  const [active, setActive] = useState('');
  const [hov, setHov] = useState('');
  useEffect(() => {
    const t = window.setTimeout(() => {
      const hs = [...document.querySelectorAll<HTMLElement>('main h2[id]')];
      setHeads(hs.map((h) => ({ id: h.id, text: h.textContent ?? '' })));
      const io = new IntersectionObserver(
        (es) => {
          const vis = es.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
          if (vis) setActive(vis.target.id);
        },
        { rootMargin: '-80px 0px -65% 0px' },
      );
      hs.forEach((h) => io.observe(h));
      cleanup = () => io.disconnect();
    }, 120);
    let cleanup: () => void = () => undefined;
    return () => { clearTimeout(t); cleanup(); };
  }, [pathname]);
  if (heads.length < 2) return <div />;
  const go = (id: string) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };
  return (
    <nav aria-label="On this page" {...stylex.props(s.rail)} onMouseLeave={() => setHov('')}>
      <ul {...stylex.props(s.list)}>
        {heads.map((h) => (
          <li key={h.id} {...stylex.props(s.li)}>
            <a href={`#${h.id}`} aria-label={h.text} {...stylex.props(s.a)} onMouseEnter={() => setHov(h.id)} onFocus={() => setHov(h.id)} onBlur={() => setHov('')} onClick={(e) => { e.preventDefault(); go(h.id); }}>
              <span {...stylex.props(s.tick, active === h.id && s.tickOn)} aria-hidden="true" />
              <span {...stylex.props(s.label, hov === h.id && s.labelShow)} aria-hidden="true">{h.text}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
