import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import colorsSrc from '../../../../packages/oniva-ui/src/tokens/colors.stylex.ts?raw';
import themesSrc from '../../../../packages/oniva-ui/src/themes/themes.ts?raw';
import accentSource from '../../../../packages/oniva-ui/src/tokens/accent.stylex.ts?raw';
import { hues } from '../../../../packages/oniva-ui/src/tokens/primitives';
import { RuleCards } from '../components/doc/primitives';

const mono = { fontFamily: 'var(--oniva-font-mono)', fontSize: 13 } as const;
const muted = { color: 'var(--oniva-color-text-muted)' } as const;
const grid = { display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' } as const;
const P = ({ children }: { children: ReactNode }) => <p style={{ ...muted, fontSize: 16, lineHeight: 1.6, margin: '0 0 24px', maxWidth: 680 }}>{children}</p>;
const H3 = ({ children }: { children: ReactNode }) => <h3 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em', margin: '36px 0 12px' }}>{children}</h3>;
const th = { borderBottom: '1px solid var(--oniva-color-border)', color: 'var(--oniva-color-text-subtle)', fontSize: 12, fontWeight: 500, letterSpacing: '0.1em', padding: '10px 16px 10px 0', textAlign: 'start', textTransform: 'uppercase' } as const;
const td = { borderBottom: '1px solid var(--oniva-color-border)', padding: '12px 16px 12px 0', verticalAlign: 'middle' } as const;

/* ------------------------------ colour maths (live) ------------------------------ */
type RGBA = [number, number, number, number];
function parseColor(c: string): RGBA | null {
  let m = /^rgba?\(([^)]+)\)$/.exec(c);
  if (m) { const p = m[1]!.split(/[ ,/]+/).filter(Boolean).map(parseFloat); return [p[0]!, p[1]!, p[2]!, p[3] ?? 1]; }
  m = /^color\(srgb ([^)]+)\)$/.exec(c);
  if (m) { const p = m[1]!.split(/[ /]+/).filter(Boolean).map(parseFloat); return [p[0]! * 255, p[1]! * 255, p[2]! * 255, p[3] ?? 1]; }
  return null;
}
const over = (f: RGBA, b: RGBA): [number, number, number] => [0, 1, 2].map((i) => f[i]! * f[3] + b[i]! * (1 - f[3])) as [number, number, number];
const lum = ([r, g, b]: number[]) => { const f = (x: number) => { const v = x / 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r!) + 0.7152 * f(g!) + 0.0722 * f(b!); };
const ratioOf = (fg: RGBA, bg: RGBA) => { const a = lum(over(fg, bg.slice(0, 3).concat(1) as RGBA)); const b = lum(bg.slice(0, 3)); const [hi, lo] = a > b ? [a, b] : [b, a]; return (hi + 0.05) / (lo + 0.05); };

/** Reads the resolved colour of a CSS variable inside the current theme scope. */
function useResolved(tokens: string[]) {
  const ref = useRef<HTMLDivElement>(null);
  const [vals, setVals] = useState<Record<string, string>>({});
  useLayoutEffect(() => {
    const read = () => {
      const el = ref.current; if (!el) return;
      const out: Record<string, string> = {};
      for (const t of tokens) {
        const p = document.createElement('i'); p.style.color = `var(${t})`; el.appendChild(p);
        out[t] = getComputedStyle(p).color; p.remove();
      }
      setVals(out);
    };
    read();
    const id = window.setTimeout(read, 350);
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['class', 'data-oniva-theme', 'data-accent'] });
    return () => { clearTimeout(id); mo.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, vals] as const;
}

/* ----------------------------------- Color ----------------------------------- */
const STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;
export const HueRamps = () => (
  <div style={{ display: 'grid', gap: 20 }}>
    {Object.entries(hues).map(([name, ramp]) => (
      <div key={name}>
        <div style={{ fontSize: 14, fontWeight: 600, margin: '0 0 8px', textTransform: 'capitalize' }}>{name}</div>
        <div style={{ display: 'grid', gap: 4, gridTemplateColumns: 'repeat(11, minmax(0, 1fr))' }}>
          {STEPS.map((s) => (
            <div key={s} style={{ minWidth: 0 }}>
              <div title={`${name}-${s} ${ramp[s]}`} style={{ background: ramp[s], border: '1px solid var(--oniva-color-border)', borderRadius: 6, height: 40 }} />
              <div style={{ ...mono, color: 'var(--oniva-color-text-muted)', fontSize: 11, marginTop: 4 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const GROUPS: { title: string; tokens: string[] }[] = [
  { title: 'Surfaces', tokens: ['bg', 'surface', 'surface-hover', 'surface-inset', 'surface-tertiary', 'overlay'] },
  { title: 'Borders', tokens: ['border', 'border-hover', 'border-control', 'focus-ring'] },
  { title: 'Text and icons', tokens: ['text', 'text-muted', 'text-subtle', 'text-placeholder', 'text-error', 'icon-muted'] },
  { title: 'Status', tokens: ['success-bg', 'success-fg', 'warning-bg', 'warning-fg', 'danger-bg', 'danger-fg', 'info-bg', 'info-fg'] },
];
function Chip({ token, val }: { token: string; val: string }) {
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ background: `var(--oniva-color-${token})`, border: '1px solid var(--oniva-color-border)', borderRadius: 10, height: 48 }} />
      <div style={{ ...mono, fontSize: 12, marginTop: 6, overflowWrap: 'anywhere' }}>{token}</div>
      <div style={{ ...mono, ...muted, fontSize: 11 }}>{val}</div>
    </div>
  );
}
export const SemanticTokens = () => {
  const all = GROUPS.flatMap((g) => g.tokens.map((t) => `--oniva-color-${t}`));
  const [ref, vals] = useResolved(all);
  return (
    <div ref={ref}>
      {GROUPS.map((g) => (
        <div key={g.title}>
          <H3>{g.title}</H3>
          <div style={grid}>{g.tokens.map((t) => <Chip key={t} token={t} val={vals[`--oniva-color-${t}`] ?? ''} />)}</div>
        </div>
      ))}
    </div>
  );
};

const PAIRS: [string, string, string, number][] = [
  ['text', 'bg', 'Body text on page', 4.5],
  ['text-muted', 'bg', 'Secondary text on page', 4.5],
  ['text-muted', 'surface', 'Secondary text on a card', 4.5],
  ['text-subtle', 'bg', 'Tertiary text on page', 4.5],
  ['text-placeholder', 'surface', 'Placeholder in a field', 4.5],
  ['success-fg', 'success-bg', 'Success badge', 4.5],
  ['danger-fg', 'danger-bg', 'Danger badge', 4.5],
  ['focus-ring', 'bg', 'Focus ring on page', 3],
  ['border-control', 'surface', 'Control border on a card', 3],
];

/* Both themes are read from the token SOURCE so light and dark show side by side whatever theme is active. */
function entries(text: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of text.matchAll(/'(--oniva-[a-z0-9-]+)':\s*(?:'([^']*)'|accent\['(--oniva-accent-[a-z0-9-]+)'\])/g)) out[m[1]!] = m[2] ?? `@${m[3]}`;
  return out;
}
const lightSrc = entries(colorsSrc);
const darkSrc = entries(themesSrc.slice(themesSrc.indexOf('export const darkTheme'), themesSrc.indexOf('export const darkShadowTheme')));
const accentSrc = entries(accentSource);
function hexOrRgb(v: string): RGBA | null {
  if (v.startsWith('#')) { let s = v.slice(1); if (s.length === 3) s = [...s].map((c) => c + c).join(''); return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16)).concat(s.length === 8 ? parseInt(s.slice(6, 8), 16) / 255 : 1) as RGBA; }
  return parseColor(v);
}
function resolve(theme: 'light' | 'dark', token: string): RGBA | null {
  const name = `--oniva-color-${token}`;
  let v = (theme === 'dark' ? darkSrc[name] : undefined) ?? lightSrc[name];
  if (v?.startsWith('@')) v = accentSrc[v.slice(1)];
  return v ? hexOrRgb(v) : null;
}
function PairTable({ theme }: { theme: 'light' | 'dark' }) {
  const hex = (c: number[]) => '#' + c.slice(0, 3).map((x) => Math.round(x).toString(16).padStart(2, '0')).join('');
  return (
    <div style={{ background: 'var(--oniva-color-surface)', border: '1px solid var(--oniva-color-border)', borderRadius: 16, padding: '8px 20px 16px' }}>
      <table style={{ borderCollapse: 'collapse', fontSize: 14, width: '100%' }}>
        <tbody>
          {PAIRS.map(([fg, bg, label, min]) => {
            const f = resolve(theme, fg); const b = resolve(theme, bg);
            const r = f && b ? ratioOf(f, b) : null;
            const ok = r != null && r >= min;
            return (
              <tr key={fg + bg}>
                <td style={td}>{min === 3 ? <span aria-hidden="true" style={{ background: b ? hex(b) : 'transparent', border: `2px solid ${f && b ? hex(over(f, b)) : 'transparent'}`, borderRadius: 8, display: 'inline-block', height: 24, width: 40 }} /> : <span style={{ background: b ? hex(b) : 'transparent', border: '1px solid var(--oniva-color-border)', borderRadius: 8, color: f && b ? hex(over(f, b)) : 'inherit', display: 'inline-block', fontWeight: 600, padding: '2px 10px' }}>Aa</span>}</td>
                <td style={td}>{label}<div style={{ ...mono, ...muted, fontSize: 11 }}>{fg} on {bg}</div></td>
                <td style={{ ...td, ...mono, textAlign: 'end', whiteSpace: 'nowrap' }}>{r ? `${r.toFixed(1)}:1` : 'n/a'}</td>
                <td style={{ ...td, color: ok ? 'var(--oniva-color-success-fg)' : 'var(--oniva-color-danger-fg)', fontSize: 12, textAlign: 'end', whiteSpace: 'nowrap' }}>{r == null ? '' : ok ? `Pass ${min}:1` : `Below ${min}:1`}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export const ContrastRatios = () => (
  <>
    <P>Light and dark are measured side by side from the token source, with translucent fills composited over the surface they sit on. Text needs 4.5:1, controls and focus rings 3:1 (focus ring shown for the default blue accent). The full matrix of two themes by eight accents runs in CI.</P>
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))' }}>
      <div><div style={{ fontSize: 14, fontWeight: 600, margin: '0 0 8px' }}>Light</div><PairTable theme="light" /></div>
      <div><div style={{ fontSize: 14, fontWeight: 600, margin: '0 0 8px' }}>Dark</div><PairTable theme="dark" /></div>
    </div>
  </>
);
export const ColorRules = () => (
  <RuleCards numbered items={[
    { title: 'Use semantic tokens', body: 'Reach for text-muted or surface-inset, never a hue step. Semantic tokens swap per theme, hue steps do not.' },
    { title: 'Accent is one color', body: 'Pick one accent per product. It marks the primary action, selection and focus. Never use two accents in one view.' },
    { title: 'Color is never alone', body: 'Pair status colors with an icon or a word. About 1 in 12 men cannot tell red from green.' },
  ]} />
);

/* --------------------------------- Typography --------------------------------- */
const ROLES: [string, number, number, string, string][] = [
  ['Display', 72, 78, '-0.02em', 'Landing hero only'],
  ['Page title', 40, 46, '-0.025em', 'One per page, h1'],
  ['Section', 24, 30, '-0.015em', 'h2 in docs and settings'],
  ['Subsection', 18, 24, '-0.01em', 'h3, card titles'],
  ['Body large', 16, 22, '0', 'Lede, long reading'],
  ['Body', 14, 20, '0', 'Default UI text'],
  ['Caption', 12, 17, '0', 'Help text, metadata'],
  ['Label', 12, 17, '0.05em', 'Uppercase labels only'],
  ['Micro', 11, 16, '0', 'Kbd, badges'],
];
export const TypeScale = () => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ borderCollapse: 'collapse', fontSize: 14, minWidth: 640, width: '100%' }}>
      <thead><tr><th style={th}>Role</th><th style={th}>Size / leading</th><th style={th}>Tracking</th><th style={th}>Specimen</th></tr></thead>
      <tbody>
        {ROLES.map(([role, size, lh, track, note]) => (
          <tr key={role}>
            <td style={td}>{role}<div style={{ ...muted, fontSize: 12 }}>{note}</div></td>
            <td style={{ ...td, ...mono, whiteSpace: 'nowrap' }}>{size} / {lh}</td>
            <td style={{ ...td, ...mono }}>{track}</td>
            <td style={{ ...td, minWidth: 0 }}><span style={{ display: 'block', fontSize: Math.min(size, 40), fontWeight: size >= 24 ? 500 : 400, letterSpacing: track, lineHeight: `${Math.min(lh, 46)}px`, overflowWrap: 'anywhere', textTransform: role === 'Label' ? 'uppercase' : undefined }}>Ship the quiet details</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
const SIZES = [11, 12, 13, 14, 16, 18, 20, 24, 32, 40, 48, 56, 64, 72];
export const TypeTokens = () => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ borderCollapse: 'collapse', fontSize: 14, width: '100%' }}>
      <thead><tr><th style={th}>Token</th><th style={th}>Size</th><th style={th}>Line height</th></tr></thead>
      <tbody>{SIZES.map((n) => <tr key={n}><td style={{ ...td, ...mono }}>font-size-{n}</td><td style={{ ...td, ...mono }}>{n}px</td><td style={{ ...td, ...mono }}>font-lh-{n}</td></tr>)}</tbody>
    </table>
  </div>
);
export const Weights = () => (
  <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
    {[['regular', 400, 'Body'], ['medium', 500, 'Titles, labels'], ['semibold', 600, 'Emphasis, names'], ['bold', 700, 'Rare, numerals']].map(([n, w, use]) => (
      <div key={String(n)} style={{ background: 'var(--oniva-color-surface)', border: '1px solid var(--oniva-color-border)', borderRadius: 16, padding: 20 }}>
        <div style={{ fontSize: 32, fontWeight: w as number, letterSpacing: '-0.02em' }}>Aa</div>
        <div style={{ fontSize: 14, fontWeight: 600, marginTop: 8 }}>{n}</div>
        <div style={{ ...mono, ...muted, fontSize: 12 }}>{w}</div>
        <div style={{ ...muted, fontSize: 13, marginTop: 4 }}>{use}</div>
      </div>
    ))}
    <div style={{ background: 'var(--oniva-color-surface)', border: '1px solid var(--oniva-color-border)', borderRadius: 16, padding: 20 }}>
      <div style={{ ...mono, fontSize: 24 }}>0123</div>
      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 8 }}>mono</div>
      <div style={{ ...muted, fontSize: 13, marginTop: 4 }}>Code, tokens, IDs</div>
    </div>
  </div>
);
export const TypeRules = () => (
  <RuleCards items={[
    { title: 'Tight at large sizes', body: 'Tracking goes negative from 24px up (-0.015em to -0.025em). At 14px and below it stays at 0.' },
    { title: 'Uppercase needs tracking', body: 'Uppercase labels at 12px take +0.05em to +0.12em. Sentence case never does.' },
    { title: 'Measure', body: 'Keep long text to 60 to 75 characters, about 680px at 16px. Use text-wrap: pretty on paragraphs.' },
    { title: 'Numbers align', body: 'Use tabular-nums in tables, counters and timers so digits do not jitter.' },
    { title: 'Two weights per view', body: 'Regular plus medium covers most screens. Add semibold for names and emphasis only.' },
    { title: 'Minimum 12px', body: 'Nothing below 12px except Kbd and badges at 11px. Do not shrink text to fit.' },
  ]} />
);

/* --------------------------------- Patterns --------------------------------- */
export const Rules = ({ items, numbered }: { items: { title: string; body: string }[]; numbered?: boolean }) => <RuleCards numbered={numbered} items={items} />;
export { P as Para };
