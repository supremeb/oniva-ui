import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import * as glyphs from './glyphs';
import * as variants from './glyphs/variants';
import { BellIcon, CircleAlertIcon, PlusIcon } from './glyphs';
import { createIcon, type IconGlyph } from './createIcon';
import { body, circle, cut } from './shapes';

const all = Object.entries(glyphs).filter(([, g]) => typeof g === 'function' && 'parts' in g) as [
  string,
  IconGlyph,
][];
// Hand-drawn glyphs are all rendered; the generated base + modifier variants are sampled.
const variantNames = new Set(Object.keys(variants));
const drawn = all.filter(([name]) => !variantNames.has(name));
const sampled = all.filter(([name]) => variantNames.has(name)).filter((_, i) => i % 20 === 0);

describe('IconSet', () => {
  it('is decorative by default and sized by `size`', () => {
    const { container } = render(<BellIcon size={16} />);
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('width', '16');
    expect(svg).toHaveAttribute('viewBox', '0 0 18 18');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('data-icon', 'bell');
  });

  it('becomes an image when it has a title or aria-label', () => {
    render(<BellIcon title="Alerts" />);
    expect(screen.getByRole('img', { name: 'Alerts' })).toBeInTheDocument();
    render(<PlusIcon aria-label="Add" />);
    expect(screen.getByRole('img', { name: 'Add' })).toBeInTheDocument();
  });

  it('forwards ref, className, style and stroke width', () => {
    const ref = createRef<SVGSVGElement>();
    const { container } = render(<PlusIcon ref={ref} className="x" style={{ opacity: 0.5 }} strokeWidth={2} />);
    const svg = container.querySelector('svg')!;
    expect(ref.current).toBe(svg);
    expect(svg).toHaveClass('x');
    expect(svg.style.opacity).toBe('0.5');
    expect(svg).toHaveAttribute('stroke-width', '2');
  });

  it('adds a soft tint layer in duo and knocks details out in fill', () => {
    const { container, rerender } = render(<CircleAlertIcon />);
    expect(container.querySelectorAll('[opacity]')).toHaveLength(0);
    rerender(<CircleAlertIcon variant="duo" />);
    expect(container.querySelector('path[opacity="0.3"]')).not.toBeNull();
    rerender(<CircleAlertIcon variant="fill" />);
    const mask = container.querySelector('mask')!;
    expect(mask).not.toBeNull();
    expect(container.querySelector('g')).toHaveAttribute('mask', `url(#${mask.id})`);
    rerender(<CircleAlertIcon variant="fill-duo" />);
    expect(container.querySelector('path[opacity="0.4"]')).not.toBeNull();
    expect(container.querySelector('clipPath')).not.toBeNull();
  });

  it('erases the modifier zone from the base in a variant', () => {
    const { container } = render(<variants.FolderClockIcon />);
    const mask = container.querySelector('mask[id$="-x"]')!;
    expect(mask).not.toBeNull();
    expect(container.querySelector(`g[mask="url(#${mask.id})"]`)).not.toBeNull();
  });

  it('switches to the 12-grid compact drawing at small sizes', () => {
    const withCompact = all.filter(([, g]) => typeof g.compactParts === 'function');
    expect(withCompact.length).toBeGreaterThan(1000);
    const [, Glyph] = withCompact[0]!;
    const { container, rerender } = render(<Glyph size={12} />);
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 12 12');
    expect(container.querySelector('svg')).toHaveAttribute('data-optical', 'compact');
    rerender(<Glyph size={24} />);
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 18 18');
    rerender(<Glyph size={12} optical="regular" />);
    expect(container.querySelector('svg')).toHaveAttribute('viewBox', '0 0 18 18');
    for (const [, G] of withCompact.filter((_, i) => i % 5 === 0)) {
      for (const variant of ['outline', 'fill-duo'] as const) {
        const r = render(<G size={12} variant={variant} />);
        for (const p of r.container.querySelectorAll('path')) expect(p.getAttribute('d')).not.toMatch(/NaN|undefined/);
        r.unmount();
      }
    }
  });

  it('gives each instance its own mask id', () => {
    const Glyph = createIcon('Test', () => [body(circle(9, 9, 7)), cut(circle(9, 9, 2))]);
    const { container } = render(
      <>
        <Glyph variant="fill" />
        <Glyph variant="fill" />
      </>,
    );
    const ids = [...container.querySelectorAll('mask')].map((m) => m.id);
    expect(new Set(ids).size).toBe(2);
  });

  it('renders every glyph in every style without empty paths', () => {
    expect(drawn.length).toBeGreaterThan(1000);
    expect(variantNames.size).toBeGreaterThan(2000);
    for (const [, Glyph] of [...drawn, ...sampled]) {
      for (const variant of ['outline', 'duo', 'fill', 'fill-duo'] as const) {
        const { container, unmount } = render(<Glyph variant={variant} />);
        const paths = [...container.querySelectorAll('path')];
        expect(paths.length).toBeGreaterThan(0);
        for (const p of paths) expect(p.getAttribute('d')).not.toMatch(/NaN|undefined/);
        unmount();
      }
    }
  });
});
