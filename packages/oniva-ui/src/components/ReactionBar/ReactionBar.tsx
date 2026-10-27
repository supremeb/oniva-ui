import * as stylex from '@stylexjs/stylex';
import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react';
import { useRef, useState, type ComponentType, type HTMLAttributes, type Ref } from 'react';
import { ToggleButton as AriaToggleButton } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { mergeSx, sxClass } from '../../internal/sx';
import { AnimatedNumber } from '../../motion/AnimatedNumber';
import { useFlip } from '../../internal/w1-flip';

export type ReactionKey = 'like' | 'comment' | 'repost' | 'share';

export interface ReactionState {
  count: number;
  active?: boolean;
}

// shrink, spring past full size, settle
const pop = stylex.keyframes({
  '0%': { transform: 'scale(1)' },
  '35%': { transform: 'scale(0.75)' },
  '70%': { transform: 'scale(1.12)' },
  '100%': { transform: 'scale(1)' },
});
const unpop = stylex.keyframes({
  '0%': { transform: 'scale(1)' },
  '40%': { transform: 'scale(0.85)' },
  '100%': { transform: 'scale(1)' },
});
const countIn = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(60%)' },
  to: { opacity: 1, transform: 'translateY(0)' },
});

const styles = stylex.create({
  root: {
    alignItems: 'center',
    boxSizing: 'border-box',
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    gap: 4,
    maxWidth: '100%',
  },
  btn: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-inset-hover'] },
    },
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-sm'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text-muted'],
    cursor: 'pointer',
    display: 'inline-flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-13'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 6,
    minHeight: 28,
    paddingInline: 8,
    touchAction: 'manipulation',
    transform: { default: 'none', ':active': `scale(${motion['--oniva-motion-press-scale']})` },
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, color, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  icon: { display: 'inline-grid', flexShrink: 0, placeItems: 'center' },
  iconLayer: { gridArea: '1 / 1', display: 'inline-flex' },
  fillLayer: {
    opacity: { default: 0, [media.reducedMotion]: 0 },
    transform: 'scale(0.6)',
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  fillOn: { opacity: 1, transform: 'scale(1)' },
  iconPop: {
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationName: { default: pop, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  iconUnpop: {
    animationDuration: motion['--oniva-motion-dur-enter'],
    animationName: { default: unpop, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  countIn: {
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: countIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out-expo'],
  },
  mine: {
    backgroundColor: colors['--oniva-color-accent-tint'],
    borderColor: colors['--oniva-color-accent-text'],
    color: colors['--oniva-color-accent-text'],
  },
  count: { minWidth: 8 },
});

interface ActionDef {
  Icon: ComponentType<{ size?: number; fill?: string; 'aria-hidden'?: boolean | 'true' }>;
  verb: string;
  doneVerb: string;
  noun: { one: string; other: string };
  tone: 'like' | 'repost' | 'accent';
  fillable: boolean;
}

const ACTIONS: Record<ReactionKey, ActionDef> = {
  like: { Icon: Heart, verb: 'Like', doneVerb: 'Unlike', noun: { one: '# like', other: '# likes' }, tone: 'like', fillable: true },
  comment: { Icon: MessageCircle, verb: 'Comment', doneVerb: 'Comment', noun: { one: '# comment', other: '# comments' }, tone: 'accent', fillable: false },
  repost: { Icon: Repeat2, verb: 'Repost', doneVerb: 'Undo repost', noun: { one: '# repost', other: '# reposts' }, tone: 'repost', fillable: false },
  share: { Icon: Share, verb: 'Share', doneVerb: 'Share', noun: { one: '# share', other: '# shares' }, tone: 'accent', fillable: false },
};

const DEFAULT_ACTIONS: ReactionKey[] = ['like', 'comment', 'repost', 'share'];

export interface ReactionBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children' | 'onChange'> {
  /** Starting count and pressed state per action. */
  reactions?: Partial<Record<ReactionKey, ReactionState>>;
  /** Called after a toggle with the new count and state. */
  onReact?: (key: ReactionKey, state: Required<ReactionState>) => void;
  /** Which actions to show, in order. */
  actions?: ReactionKey[];
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Like / comment / repost / share pill: toggle buttons with spring-filled icons and rolling counts. */
export function ReactionBar({
  reactions = {},
  onReact,
  actions = DEFAULT_ACTIONS,
  className,
  xstyle,
  ref,
  ...rest
}: ReactionBarProps) {
  const fmt = useFormatters();
  const [state, setState] = useState<Record<string, Required<ReactionState>>>(() =>
    Object.fromEntries(
      actions.map((k) => [k, { count: reactions[k]?.count ?? 0, active: reactions[k]?.active ?? false }]),
    ),
  );
  const [popped, setPopped] = useState<Record<string, { n: number; on: boolean }>>({});
  const rootRef = useRef<HTMLDivElement | null>(null);
  useFlip(rootRef, 300);

  const toggle = (key: ReactionKey, active: boolean) => {
    const prev = state[key] ?? { count: 0, active: false };
    const next = { count: Math.max(0, prev.count + (active ? 1 : -1)), active };
    setState((s) => ({ ...s, [key]: next }));
    setPopped((p) => ({ ...p, [key]: { n: (p[key]?.n ?? 0) + 1, on: active } }));
    onReact?.(key, next);
  };

  return (
    <div
      role="group"
      aria-label="Reactions"
      {...rest}
      ref={(n) => {
        rootRef.current = n;
        if (typeof ref === 'function') ref(n);
        else if (ref) (ref as { current: HTMLDivElement | null }).current = n;
      }}
      {...mergeSx(stylex.props(styles.root, xstyle), className)}
    >
      {actions.map((key) => {
        const def = ACTIONS[key];
        const s = state[key] ?? { count: 0, active: false };
        const label = `${s.active ? def.doneVerb : def.verb}${s.count ? `, ${fmt.plural(s.count, def.noun)}` : ''}`;
        return (
          <AriaToggleButton
            key={key}
            data-flip-id={key}
            isSelected={s.active}
            onChange={(v) => toggle(key, v)}
            aria-label={label}
            className={({ isSelected }) =>
              sxClass(
                stylex.props(
                  styles.btn,
                  focus.ring,
                  isSelected && styles.mine,
                ),
              )
            }
          >
            {({ isSelected }) => (
              <>
                <span
                  key={popped[key]?.n ?? 0}
                  aria-hidden="true"
                  {...stylex.props(
                    styles.icon,
                    popped[key] ? (popped[key]!.on ? styles.iconPop : styles.iconUnpop) : null,
                  )}
                >
                  <span {...stylex.props(styles.iconLayer)}>
                    <def.Icon size={16} fill="none" />
                  </span>
                  {def.fillable && (
                    <span {...stylex.props(styles.iconLayer, styles.fillLayer, isSelected && styles.fillOn)}>
                      <def.Icon size={16} fill="currentColor" />
                    </span>
                  )}
                </span>
                {s.count > 0 && (
                  <span aria-hidden="true" {...stylex.props(styles.count, styles.countIn)}>
                    <AnimatedNumber value={s.count} format={{ notation: s.count >= 10000 ? 'compact' : 'standard' }} />
                  </span>
                )}
              </>
            )}
          </AriaToggleButton>
        );
      })}
    </div>
  );
}
