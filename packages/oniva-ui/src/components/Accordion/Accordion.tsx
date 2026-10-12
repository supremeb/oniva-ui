import * as stylex from '@stylexjs/stylex';
import {
  Button as AriaButton,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  Heading,
  type DisclosureGroupProps,
  type DisclosureProps,
} from 'react-aria-components';
import { ChevronDown } from 'lucide-react';
import { createContext, useContext, type ReactNode, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';

const styles = stylex.create({
  root: {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    width: '100%',
  },
  divided: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.xl,
    borderStyle: 'solid',
    borderWidth: 1,
    overflow: 'hidden',
  },
  cards: {
    backgroundColor: colors.surfaceInset,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderStyle: 'solid',
    borderWidth: 1,
    gap: 8,
    padding: 8,
  },
  item: { boxSizing: 'border-box' },
  itemDivided: {
    borderTopColor: colors.border,
    borderTopStyle: 'solid',
    borderTopWidth: { default: 1, ':first-child': 0 },
  },
  itemCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow.xs,
  },
  heading: { margin: 0 },
  trigger: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: 'transparent', ':hover': colors.surfaceHover },
    borderWidth: 0,
    borderRadius: radius.lg,
    boxSizing: 'border-box',
    color: { default: colors.text, ':disabled': colors.textDisabled },
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    display: 'flex',
    fontFamily: font.sans,
    fontSize: font.size14,
    fontWeight: font.weightMedium,
    gap: 10,
    lineHeight: font.lh14,
    minHeight: 48,
    outlineColor: colors.focusRing,
    outlineOffset: -2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    paddingInline: 16,
    textAlign: 'start',
    transitionDuration: motion.durBase,
    transitionProperty: 'background-color',
    transitionTimingFunction: motion.easeStandard,
    width: '100%',
  },
  icon: { color: colors.iconMuted, display: 'inline-flex', flexShrink: 0 },
  title: { flexGrow: 1 },
  chevron: {
    color: colors.iconMuted,
    flexShrink: 0,
    transitionDuration: motion.durBase,
    transitionProperty: 'transform',
    transitionTimingFunction: motion.easeStandard,
  },
  chevronOpen: { transform: 'rotate(180deg)' },
  panel: {
    color: colors.textMuted,
    fontSize: font.size14,
    lineHeight: font.lh16,
    paddingBlockEnd: 16,
    paddingInline: 16,
  },
});

type Variant = 'divided' | 'cards';
const VariantCtx = createContext<Variant>('divided');

export interface AccordionProps extends Omit<
  DisclosureGroupProps,
  'className' | 'style' | 'children'
> {
  /** `divided`: one bordered container with hairlines. `cards`: white tiles on a gray card. */
  variant?: Variant;
  children?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

export function Accordion({
  variant = 'divided',
  className,
  xstyle,
  ref,
  children,
  ...rest
}: AccordionProps) {
  const sx = stylex.props(styles.root, styles[variant], xstyle);
  return (
    <VariantCtx value={variant}>
      <DisclosureGroup
        {...rest}
        ref={ref}
        {...sx}
        className={[sx.className, className].filter(Boolean).join(' ')}
      >
        {children}
      </DisclosureGroup>
    </VariantCtx>
  );
}

export interface AccordionItemProps extends Omit<
  DisclosureProps,
  'className' | 'style' | 'children'
> {
  /** Required inside an Accordion (identifies the item). */
  id?: string;
  title: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
}

export function AccordionItem({ title, icon, children, xstyle, ...rest }: AccordionItemProps) {
  const variant = useContext(VariantCtx);
  return (
    <Disclosure
      {...rest}
      className={() =>
        stylex.props(
          styles.item,
          variant === 'divided' ? styles.itemDivided : styles.itemCard,
          xstyle,
        ).className ?? ''
      }
    >
      {({ isExpanded }) => (
        <>
          <Heading level={3} {...stylex.props(styles.heading)}>
            <AriaButton
              slot="trigger"
              className={() => stylex.props(styles.trigger).className ?? ''}
            >
              {icon && (
                <span aria-hidden="true" {...stylex.props(styles.icon)}>
                  {icon}
                </span>
              )}
              <span {...stylex.props(styles.title)}>{title}</span>
              <ChevronDown
                size={16}
                aria-hidden="true"
                {...stylex.props(styles.chevron, isExpanded && styles.chevronOpen)}
              />
            </AriaButton>
          </Heading>
          <DisclosurePanel>
            <div {...stylex.props(styles.panel)}>{children}</div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
