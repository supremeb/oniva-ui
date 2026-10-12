import * as stylex from '@stylexjs/stylex';
import {
  Button as AriaButton,
  Disclosure,
  DisclosurePanel,
  Heading,
  type DisclosureProps,
} from 'react-aria-components';
import { ChevronRight } from 'lucide-react';
import type { ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  root: { boxSizing: 'border-box', fontFamily: font.sans },
  heading: { margin: 0 },
  trigger: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: 'transparent', ':hover': colors.surfaceInsetHover },
    borderRadius: radius.md,
    borderWidth: 0,
    color: { default: colors.text, ':disabled': colors.textDisabled },
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    display: 'inline-flex',
    fontFamily: font.sans,
    fontSize: font.size14,
    fontWeight: font.weightMedium,
    gap: 6,
    height: 32,
    lineHeight: font.lh14,
    outlineColor: colors.focusRing,
    outlineOffset: 2,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    paddingInline: 8,
    transitionDuration: motion.durBase,
    transitionProperty: 'background-color',
    transitionTimingFunction: motion.easeStandard,
  },
  chevron: {
    color: colors.iconMuted,
    transitionDuration: motion.durBase,
    transitionProperty: 'transform',
    transitionTimingFunction: motion.easeStandard,
  },
  chevronOpen: { transform: 'rotate(90deg)' },
  panel: {
    color: colors.textMuted,
    fontSize: font.size14,
    lineHeight: font.lh16,
    paddingBlockStart: 4,
    paddingInlineStart: 8,
  },
});

export interface CollapsibleProps extends Omit<
  DisclosureProps,
  'className' | 'style' | 'children'
> {
  /** Trigger label. */
  trigger: ReactNode;
  children?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** A single show/hide region (React Aria Disclosure) with a compact chevron trigger. */
export function Collapsible({
  trigger,
  children,
  className,
  xstyle,
  ref,
  ...rest
}: CollapsibleProps) {
  const sx = stylex.props(styles.root, xstyle);
  return (
    <Disclosure {...rest} ref={ref} className={[sx.className, className].filter(Boolean).join(' ')}>
      {({ isExpanded }) => (
        <>
          <Heading level={3} {...stylex.props(styles.heading)}>
            <AriaButton
              slot="trigger"
              className={() => stylex.props(styles.trigger).className ?? ''}
            >
              <ChevronRight
                size={16}
                aria-hidden="true"
                {...stylex.props(styles.chevron, isExpanded && styles.chevronOpen)}
              />
              {trigger}
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
