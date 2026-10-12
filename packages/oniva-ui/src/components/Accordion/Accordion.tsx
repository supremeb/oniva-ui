import * as stylex from '@stylexjs/stylex';
import { focus } from '../../internal/focus';
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
    fontFamily: font['--oniva-font-sans'],
    width: '100%',
  },
  divided: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    overflow: 'hidden',
  },
  cards: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-card'],
    borderStyle: 'solid',
    borderWidth: 1,
    gap: 8,
    padding: 8,
  },
  item: { boxSizing: 'border-box' },
  itemDivided: {
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: { default: 1, ':first-child': 0 },
  },
  itemCard: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-xs'],
  },
  heading: { margin: 0 },
  trigger: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: 'transparent', ':hover': colors['--oniva-color-surface-hover'] },
    borderWidth: 0,
    borderRadius: radius['--oniva-radius-lg'],
    boxSizing: 'border-box',
    color: {
      default: colors['--oniva-color-text'],
      ':disabled': colors['--oniva-color-text-disabled'],
    },
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    display: 'flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 10,
    lineHeight: font['--oniva-font-lh-14'],
    minHeight: 48,
    paddingInline: 16,
    textAlign: 'start',
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color',
    transitionTimingFunction: motion['--oniva-motion-ease-standard'],
    width: '100%',
  },
  icon: { color: colors['--oniva-color-icon-muted'], display: 'inline-flex', flexShrink: 0 },
  title: { flexGrow: 1 },
  chevron: {
    color: colors['--oniva-color-icon-muted'],
    flexShrink: 0,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-standard'],
  },
  chevronOpen: { transform: 'rotate(180deg)' },
  panel: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-14'],
    lineHeight: font['--oniva-font-lh-16'],
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
              className={() => stylex.props(styles.trigger, focus.inset).className ?? ''}
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
