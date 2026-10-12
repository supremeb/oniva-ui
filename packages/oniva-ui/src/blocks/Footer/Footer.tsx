import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, Ref } from 'react';
import { OnivaMark } from '../../internal/blocks-parts';
import { bs } from '../../internal/blocks-styles';
import { focus } from '../../internal/focus';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';

const NARROW = '@media (max-width: 720px)';

const styles = stylex.create({
  root: { borderTopColor: colors['--oniva-color-border'], borderTopStyle: 'solid', borderTopWidth: 1, paddingBlock: { default: 56, [NARROW]: 40 } },
  grid: { display: 'grid', gap: 32, gridTemplateColumns: { default: '1.5fr repeat(3, 1fr)', [NARROW]: '1fr 1fr' } },
  brand: { gridColumn: { default: 'auto', [NARROW]: 'span 2' }, display: 'flex', flexDirection: 'column', gap: 12 },
  name: { alignItems: 'center', display: 'inline-flex', fontSize: font['--oniva-font-size-18'], fontWeight: font['--oniva-font-weight-semibold'], gap: 8 },
  col: { display: 'flex', flexDirection: 'column', gap: 10 },
  list: { display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none', margin: 0, padding: 0 },
  colTitle: { fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-semibold'], margin: 0 },
  bottom: {
    borderTopColor: colors['--oniva-color-separator'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    flexWrap: 'wrap',
    fontSize: font['--oniva-font-size-13'],
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 40,
    paddingTop: 24,
  },
});

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export const defaultFooterColumns: FooterColumn[] = [
  { title: 'Product', links: [{ label: 'Workflows', href: '#' }, { label: 'Observability', href: '#' }, { label: 'Guardrails', href: '#' }, { label: 'Pricing', href: '#' }] },
  { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Customers', href: '#' }, { label: 'Contact', href: '#' }] },
  { title: 'Resources', links: [{ label: 'Docs', href: '#' }, { label: 'Changelog', href: '#' }, { label: 'Status', href: '#' }, { label: 'Security', href: '#' }] },
];

export interface FooterProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  columns?: FooterColumn[];
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

export function Footer({ columns = defaultFooterColumns, className, xstyle, ref, ...rest }: FooterProps) {
  const sx = stylex.props(bs.section, styles.root, xstyle);
  return (
    <footer ref={ref} {...rest} {...mergeSx(sx, className)}>
      <div {...stylex.props(bs.inner)}>
        <div {...stylex.props(styles.grid)}>
          <div {...stylex.props(styles.brand)}>
            <span {...stylex.props(styles.name)}><OnivaMark /> Oniva</span>
            <p {...stylex.props(bs.p)}>The calm control room for production AI agents.</p>
          </div>
          {columns.map((c) => (
            <nav key={c.title} aria-label={c.title} {...stylex.props(styles.col)}>
              <h2 {...stylex.props(styles.colTitle)}>{c.title}</h2>
              <ul {...stylex.props(styles.list)}>
                {c.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} {...stylex.props(bs.link, focus.ring)}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div {...stylex.props(styles.bottom)}>
          <span>&copy; 2026 Oniva, Inc. All rights reserved.</span>
          <span>Privacy &middot; Terms</span>
        </div>
      </div>
    </footer>
  );
}
