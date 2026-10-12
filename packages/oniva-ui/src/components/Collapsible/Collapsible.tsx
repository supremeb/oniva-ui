import * as stylex from '@stylexjs/stylex';
import { focus } from '../../internal/focus';
import {
  Button as AriaButton,
  Disclosure,
  DisclosurePanel,
  Heading,
  type DisclosureProps,
} from 'react-aria-components';
import { ChevronRight } from 'lucide-react';
import type { ReactNode, Ref } from 'react';
import { AnimatedHeight } from '../../motion/AnimatedHeight';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  root: { boxSizing: 'border-box', fontFamily: font['--oniva-font-sans'] },
  heading: { margin: 0 },
  // RAC hides the collapsed panel with [hidden]; keep it rendered so AnimatedHeight can animate.
  panelHost: { contentVisibility: 'visible', display: 'block' },
  trigger: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors['--oniva-color-surface-inset-hover'],
    },
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: {
      default: colors['--oniva-color-text'],
      ':disabled': colors['--oniva-color-text-disabled'],
    },
    cursor: { default: 'pointer', ':disabled': 'not-allowed' },
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 6,
    height: 32,
    lineHeight: font['--oniva-font-lh-14'],
    paddingInline: 8,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color',
    transitionTimingFunction: motion['--oniva-motion-ease-standard'],
  },
  chevron: {
    color: colors['--oniva-color-icon-muted'],
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  chevronOpen: { transform: 'rotate(90deg)' },
  panel: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-14'],
    lineHeight: font['--oniva-font-lh-16'],
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
              className={() => stylex.props(styles.trigger, focus.ring).className ?? ''}
            >
              <ChevronRight
                size={16}
                aria-hidden="true"
                {...stylex.props(styles.chevron, isExpanded && styles.chevronOpen)}
              />
              {trigger}
            </AriaButton>
          </Heading>
          <DisclosurePanel {...stylex.props(styles.panelHost)}>
            <AnimatedHeight isOpen={isExpanded}>
              <div {...stylex.props(styles.panel)}>{children}</div>
            </AnimatedHeight>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
