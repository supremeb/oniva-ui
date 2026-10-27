import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from './ThemeProvider';

/** Declarations that the wrapper's own classes set (jsdom has no cascade for custom properties). */
function wrapperDeclarations(el: Element): Record<string, string> {
  const classes = new Set(Array.from(el.classList).map((c) => `.${c}`));
  const out: Record<string, string> = {};
  for (const sheet of Array.from(document.styleSheets)) {
    for (const rule of Array.from(sheet.cssRules)) {
      const text = rule.cssText;
      const open = text.indexOf('{');
      const selectors = text.slice(0, open).split(',').map((x) => x.trim().replace(/:root$/, ''));
      if (!selectors.some((x) => classes.has(x))) continue;
      for (const d of text.slice(open + 1, text.lastIndexOf('}')).split(';')) {
        const i = d.indexOf(':');
        if (i > 0) out[d.slice(0, i).trim()] = d.slice(i + 1).trim();
      }
    }
  }
  return out;
}

function resolve(value: string, decls: Record<string, string>): string {
  let v = value;
  for (let i = 0; i < 5 && /var\(/.test(v); i++) {
    v = v.replace(/var\((--[\w-]+)\)/g, (_, n: string) => decls[n] ?? `var(${n})`);
  }
  return v;
}

const derived = {
  '--oniva-color-accent-fg': '#0a0a0a',
  '--oniva-color-accent-text': '#bb4d00',
  '--oniva-color-accent-soft': '#fef3c6',
  '--oniva-color-accent-soft-hover': '#fee685',
  '--oniva-color-accent-soft-active': '#ffd230',
  '--oniva-color-accent-soft-fg': '#7b3306',
  '--oniva-color-focus-ring': '#bb4d00',
} as const;

describe('ThemeProvider derived accent tokens', () => {
  it('light + amber: derived tokens follow the amber ramp on the wrapper', () => {
    const { container } = render(<ThemeProvider theme="light" accent="amber">x</ThemeProvider>);
    const decls = wrapperDeclarations(container.firstElementChild!);
    for (const [name, want] of Object.entries(derived)) {
      expect(decls[name], name).toBeDefined();
      expect(resolve(decls[name] ?? '', decls).toLowerCase(), name).toBe(want);
    }
    expect(resolve(decls['--oniva-color-accent-tint'] ?? '', decls)).toContain('#fe9a00');
  });

  it('dark + amber: derived tokens follow the amber ramp on the wrapper', () => {
    const { container } = render(<ThemeProvider theme="dark" accent="amber">x</ThemeProvider>);
    const decls = wrapperDeclarations(container.firstElementChild!);
    const want = {
      '--oniva-color-accent-fg': '#0a0a0a',
      '--oniva-color-accent-text': '#ffd230',
      '--oniva-color-accent-soft': '#7b3306',
      '--oniva-color-accent-soft-hover': '#973c00',
      '--oniva-color-accent-soft-active': '#bb4d00',
      '--oniva-color-accent-soft-fg': '#fffbeb',
      '--oniva-color-focus-ring': '#ffb900',
    };
    for (const [name, v] of Object.entries(want)) {
      expect(resolve(decls[name] ?? '', decls).toLowerCase(), name).toBe(v);
    }
  });
});
