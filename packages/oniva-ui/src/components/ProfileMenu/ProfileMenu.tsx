import * as stylex from '@stylexjs/stylex';
import { ArrowRight } from 'lucide-react';
import { Button as AriaButton, Menu as AriaMenu, MenuItem as AriaMenuItem, Text as AriaText } from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { focus } from '../../internal/focus';
import { colors } from '../../tokens/colors.stylex';
import { radius } from '../../tokens/radius.stylex';
import { font } from '../../tokens/font.stylex';
import { menuStyles as m } from '../../internal/overlays-menu';
import { useFormatters } from '../../internal/format';
import { mergeSx, sxClass } from '../../internal/sx';
import { w4 } from '../../internal/w4-styles';
import { w4Parts } from '../../internal/w4-parts';
import { useInView } from '../../motion/InView/useInView';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';
import { ProgressBar } from '../ProgressBar';

const styles = stylex.create({
  root: { maxWidth: 320, overflow: 'hidden', width: '100%' },
  head: { alignItems: 'center', display: 'flex', gap: 12, padding: 14 },
  who: { display: 'flex', flexDirection: 'column', minWidth: 0 },
  name: {
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-18'],
  },
  email: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-13'] },
  menu: {
    borderBlockStartColor: colors['--oniva-color-separator'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    maxHeight: 'none',
    padding: 6,
  },
  setup: {
    borderBlockStartColor: colors['--oniva-color-separator'],
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 14,
    paddingBlockEnd: 10,
  },
  nextBtn: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: radius['--oniva-radius-md'],
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    cursor: 'pointer',
    display: 'flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-14'],
    gap: 8,
    justifyContent: 'space-between',
    marginBlockStart: 4,
    paddingBlock: 6,
    textAlign: 'start',
    width: '100%',
  },
  nextHint: { color: colors['--oniva-color-text-muted'] },
  setupHead: { alignItems: 'baseline', display: 'flex', fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-medium'], justifyContent: 'space-between' },
});

export interface ProfileMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  /** Small pill after the label, e.g. "New". */
  badge?: string;
  danger?: boolean;
  onSelect?: () => void;
}

export interface ProfileSetup {
  done: number;
  total: number;
  /** Label of the next step. */
  next?: string;
  onContinue?: () => void;
}

export interface ProfileMenuProps {
  name: string;
  email?: string;
  /** Replaces the default avatar, e.g. an `<img>`. */
  avatar?: ReactNode;
  items: ProfileMenuItem[];
  /** Profile setup progress; leave out to hide. */
  setup?: ProfileSetup;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Account card: signed-in user, a real menu of actions (RAC Menu) and profile setup progress. */
export function ProfileMenu({ name, email, avatar, items, setup, className, xstyle, ref }: ProfileMenuProps) {
  const fmt = useFormatters();
  const { ref: viewRef, inView } = useInView<HTMLDivElement>({ threshold: 0.3 });
  return (
    <div ref={ref} {...mergeSx(stylex.props(w4.card, styles.root, w4Parts.rise, xstyle), className)}>
      <div {...stylex.props(styles.head)}>
        {avatar ?? <Avatar name={name} size="md" />}
        <div {...stylex.props(styles.who)}>
          <span {...stylex.props(styles.name, w4.clamp1)}>{name}</span>
          {email && (
            <span title={email} {...stylex.props(styles.email, w4.clamp1)}>
              {email}
            </span>
          )}
        </div>
      </div>
      <AriaMenu
        aria-label={`${name} account`}
        onAction={(key) => items.find((i) => i.id === key)?.onSelect?.()}
        {...stylex.props(m.menu, styles.menu)}
      >
        {items.map((item) => (
          <AriaMenuItem
            key={item.id}
            id={item.id}
            textValue={item.label}
            className={({ isFocused, isDisabled }) =>
              sxClass(
                stylex.props(
                  m.item,
                  item.danger && m.itemDanger,
                  isFocused && (item.danger ? m.itemDangerFocused : m.itemFocused),
                  isDisabled && m.itemDisabled,
                ),
              )
            }
          >
            {item.icon && (
              <span aria-hidden="true" {...stylex.props(m.itemIcon, item.danger && m.itemIconDanger)}>
                {item.icon}
              </span>
            )}
            <AriaText slot="label" {...stylex.props(m.itemLabel)}>
              {item.label}
            </AriaText>
            {item.badge && (
              <Badge size="sm" variant="danger">
                {item.badge}
              </Badge>
            )}
          </AriaMenuItem>
        ))}
      </AriaMenu>
      {setup && setup.total > 0 && (
        <div ref={viewRef} {...stylex.props(styles.setup)}>
          <div {...stylex.props(styles.setupHead)}>
            <span>Profile setup</span>
            <span aria-hidden="true" {...stylex.props(w4.muted, w4.num)}>
              <AnimatedNumber value={inView ? setup.done : 0} />/{fmt.number(setup.total)}
            </span>
          </div>
          <ProgressBar
            aria-label="Profile setup"
            value={inView ? setup.done : 0}
            minValue={0}
            maxValue={setup.total}
            valueLabel={fmt.percent(setup.done / setup.total)}
            size="sm"
          />
          {setup.next &&
            (setup.onContinue ? (
              <AriaButton onPress={setup.onContinue} className={() => sxClass(stylex.props(styles.nextBtn, focus.ring))}>
                <span {...stylex.props(w4.clamp1)}>
                  <span {...stylex.props(styles.nextHint)}>Next:</span> {setup.next}
                </span>
                <ArrowRight size={16} aria-hidden="true" {...stylex.props(styles.nextHint)} />
              </AriaButton>
            ) : (
              <span {...stylex.props(w4.clamp1)}>
                <span {...stylex.props(styles.nextHint)}>Next:</span> {setup.next}
              </span>
            ))}
        </div>
      )}
    </div>
  );
}
