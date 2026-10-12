import * as stylex from '@stylexjs/stylex';
import { BarChart3, ChevronDown, Menu, ShieldCheck, Workflow, X, Zap } from 'lucide-react';
import { useState } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { Button as AriaButton, Dialog, DialogTrigger, Popover } from 'react-aria-components';
import { focus } from '../../internal/focus';
import { OnivaMark } from '../../internal/blocks-parts';
import { bs } from '../../internal/blocks-styles';
import { mergeSx } from '../../internal/sx';
import { Button } from '../../components/Button/Button';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const NARROW = '@media (max-width: 720px)';

const pop = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(var(--oniva-motion-pop-scale)) translateY(-4px)' },
  to: { opacity: 1, transform: 'scale(1) translateY(0)' },
});
const popOut = stylex.keyframes({ from: { opacity: 1 }, to: { opacity: 0 } });
const drop = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(-4px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

const styles = stylex.create({
  root: {
    backgroundColor: colors['--oniva-color-bg'],
    borderBottomColor: colors['--oniva-color-border'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    boxSizing: 'border-box',
    fontFamily: font['--oniva-font-sans'],
    paddingInline: { default: 32, [NARROW]: 16 },
    width: '100%',
  },
  bar: { alignItems: 'center', display: 'flex', gap: 24, height: 60, marginInline: 'auto', maxWidth: 1120 },
  brand: {
    alignItems: 'center',
    color: colors['--oniva-color-text'],
    display: 'inline-flex',
    fontSize: font['--oniva-font-size-18'],
    fontWeight: font['--oniva-font-weight-semibold'],
    gap: 8,
    textDecoration: 'none',
  },
  nav: { alignItems: 'center', display: { default: 'flex', [NARROW]: 'none' }, flex: '1 1 0%', gap: 4 },
  actions: { alignItems: 'center', display: { default: 'flex', [NARROW]: 'none' }, gap: 8 },
  burger: { display: { default: 'none', [NARROW]: 'inline-flex' }, marginInlineStart: 'auto' },
  item: {
    alignItems: 'center',
    backgroundColor: { default: 'transparent', ':hover': colors['--oniva-color-surface-hover'] },
    borderRadius: radius['--oniva-radius-lg'],
    borderWidth: 0,
    color: { default: colors['--oniva-color-text-muted'], ':hover': colors['--oniva-color-text'] },
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 4,
    height: 36,
    paddingInline: 12,
    textDecoration: 'none',
    transitionDuration: motion['--oniva-motion-dur-instant'],
    transitionProperty: 'background-color, color',
  },
  chev: {
    transform: { default: 'none', ':is([aria-expanded=true] *)': 'rotate(180deg)' },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  popover: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationName: { default: pop, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-card'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-dropdown'],
    boxSizing: 'border-box',
    maxWidth: 'calc(100vw - 32px)',
    transformOrigin: 'var(--trigger-anchor-point, top left)',
    width: 560,
  },
  popExit: {
    animationDuration: motion['--oniva-motion-dur-micro'],
    animationName: { default: popOut, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  dlg: { outline: 'none' },
  mega: { display: 'grid', gap: 4, gridTemplateColumns: '1fr 1fr', padding: 8 },
  megaItem: {
    backgroundColor: { default: 'transparent', ':hover': colors['--oniva-color-surface-hover'] },
    borderRadius: radius['--oniva-radius-xl'],
    color: colors['--oniva-color-text'],
    display: 'flex',
    gap: 12,
    padding: 12,
    textDecoration: 'none',
    transitionDuration: motion['--oniva-motion-dur-instant'],
    transitionProperty: 'background-color',
  },
  megaText: { display: 'flex', flexDirection: 'column', gap: 2 },
  megaTitle: { fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-semibold'] },
  megaDesc: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'], lineHeight: 1.4 },
  mobile: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationName: { default: drop, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    paddingBottom: 16,
  },
});

export interface SiteHeaderLink {
  label: string;
  href: string;
}

export interface SiteHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  links?: SiteHeaderLink[];
  /** Show the Product mega menu. Default true. */
  megaMenu?: boolean;
  actions?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLElement>;
}

const defaultLinks: SiteHeaderLink[] = [
  { label: 'Pricing', href: '#pricing' },
  { label: 'Customers', href: '#customers' },
  { label: 'Changelog', href: '#changelog' },
  { label: 'Docs', href: '#docs' },
];

const mega = [
  { icon: <Workflow size={18} />, title: 'Workflows', desc: 'Orchestrate agents and approvals.' },
  { icon: <BarChart3 size={18} />, title: 'Observability', desc: 'Traces, evals and cost in one view.' },
  { icon: <ShieldCheck size={18} />, title: 'Guardrails', desc: 'Policies, redaction and audit logs.' },
  { icon: <Zap size={18} />, title: 'Gateway', desc: 'Route, cache and fail over models.' },
];

export function SiteHeader({
  links = defaultLinks,
  megaMenu = true,
  actions,
  className,
  xstyle,
  ref,
  ...rest
}: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const sx = stylex.props(styles.root, xstyle);
  const item = stylex.props(styles.item, focus.ring);
  return (
    <header ref={ref} {...rest} {...mergeSx(sx, className)}>
      <div {...stylex.props(styles.bar)}>
        <a href="#top" aria-label="Oniva home" {...stylex.props(styles.brand, focus.ring)}>
          <OnivaMark /> Oniva
        </a>
        <nav aria-label="Main" {...stylex.props(styles.nav)}>
          {megaMenu && (
            <DialogTrigger>
              <AriaButton className={item.className}>
                Product <ChevronDown size={14} aria-hidden="true" {...stylex.props(styles.chev)} />
              </AriaButton>
              <Popover placement="bottom start" offset={8} className={({ isExiting }) => stylex.props(styles.popover, isExiting && styles.popExit).className ?? ''}>
                <Dialog aria-label="Product menu" {...stylex.props(styles.dlg)}>
                  <div {...stylex.props(styles.mega)}>
                    {mega.map((m) => (
                      <a key={m.title} href="#product" {...stylex.props(styles.megaItem, focus.ring)}>
                        <span {...stylex.props(bs.iconBox)} aria-hidden="true">{m.icon}</span>
                        <span {...stylex.props(styles.megaText)}>
                          <span {...stylex.props(styles.megaTitle)}>{m.title}</span>
                          <span {...stylex.props(styles.megaDesc)}>{m.desc}</span>
                        </span>
                      </a>
                    ))}
                  </div>
                </Dialog>
              </Popover>
            </DialogTrigger>
          )}
          {links.map((l) => (
            <a key={l.label} href={l.href} className={item.className}>
              {l.label}
            </a>
          ))}
        </nav>
        <div {...stylex.props(styles.actions)}>
          {actions ?? (
            <>
              <Button variant="ghost">Sign in</Button>
              <Button>Start free</Button>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          isIconOnly
          xstyle={styles.burger}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onPress={() => setOpen((o) => !o)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </div>
      {open && (
        <nav aria-label="Mobile" {...stylex.props(styles.mobile)}>
          {[{ label: 'Product', href: '#product' }, ...links].map((l) => (
            <a key={l.label} href={l.href} className={item.className}>
              {l.label}
            </a>
          ))}
          <Button>Start free</Button>
        </nav>
      )}
    </header>
  );
}
