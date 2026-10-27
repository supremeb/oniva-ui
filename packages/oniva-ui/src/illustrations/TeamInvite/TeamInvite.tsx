import * as stylex from '@stylexjs/stylex';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { Avatar } from '../../components/Avatar/Avatar';
import { CursorArrow } from '../../internal/w7-parts';
import { loop, Scene, type IllustrationProps } from '../../internal/w7-scene';

const ease = 'cubic-bezier(0.7, 0, 0.25, 1)';
const press = 'cubic-bezier(0.23, 1, 0.32, 1)';
const DUR = '4.4s';
// Rest position of the invitee relative to the slot (cqw)
const FX = 18;
const FY = 8;

/*
 * One loop (4.4 s):
 *  0-12% rest, 12-16% pick up (lift + press), 16-42% carried into the slot, 42-48% drop and settle,
 *  48-54% line draws solid + dot pops, 54-62% cursor lets go and drifts off, 62-88% hold, 88-100% reset.
 */
const carry = stylex.keyframes({
  '0%, 16%': { opacity: 1, transform: `translate(${FX}cqw, ${FY}cqw)`, animationTimingFunction: ease },
  '42%, 88%': { opacity: 1, transform: 'translate(0, 0)' },
  '94%': { opacity: 0, transform: 'translate(0, 0)' },
  '95%': { opacity: 0, transform: `translate(${FX}cqw, ${FY}cqw)` },
  '100%': { opacity: 1, transform: `translate(${FX}cqw, ${FY}cqw)` },
});
const lift = stylex.keyframes({
  '0%, 12%': { transform: 'scale(1)', animationTimingFunction: press },
  '16%, 40%': { transform: 'scale(1.07)', animationTimingFunction: press },
  '46%, 100%': { transform: 'scale(1)' },
});
const liftShadow = stylex.keyframes({
  '0%, 12%': { opacity: 0, animationTimingFunction: press },
  '16%, 40%': { opacity: 1, animationTimingFunction: press },
  '46%, 100%': { opacity: 0 },
});
const landRing = stylex.keyframes({
  '0%, 44%': { opacity: 0, transform: 'scale(1)' },
  '46%': { opacity: 0.45, transform: 'scale(1)', animationTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' },
  '62%, 100%': { opacity: 0, transform: 'scale(1.5)' },
});
const cursorMove = stylex.keyframes({
  '0%, 11%': { opacity: 1, transform: 'translate(0, 0) scale(1)', animationTimingFunction: press },
  '14%, 42%': { opacity: 1, transform: 'translate(0, 0) scale(0.86)', animationTimingFunction: press },
  '47%': { opacity: 1, transform: 'translate(0, 0) scale(1)', animationTimingFunction: ease },
  '62%, 88%': { opacity: 0, transform: 'translate(10cqw, 6cqw) scale(1)' },
  '95%': { opacity: 0, transform: 'translate(3cqw, 2cqw) scale(1)' },
  '100%': { opacity: 1, transform: 'translate(0, 0) scale(1)' },
});
const draw = stylex.keyframes({
  '0%, 44%': { strokeDashoffset: 1, opacity: 1 },
  '54%, 88%': { strokeDashoffset: 0, opacity: 1 },
  '94%, 100%': { strokeDashoffset: 0, opacity: 0 },
});
const dashedOut = stylex.keyframes({
  '0%, 46%': { opacity: 1 },
  '50%, 92%': { opacity: 0 },
  '100%': { opacity: 1 },
});
const online = stylex.keyframes({
  '0%, 48%': { opacity: 0, transform: 'scale(0.5)' },
  '52%': { opacity: 1, transform: 'scale(1.25)' },
  '56%, 100%': { opacity: 1, transform: 'scale(1)' },
});
const slotFade = stylex.keyframes({
  '0%, 30%': { opacity: 1, transform: 'scale(1)', animationTimingFunction: ease },
  '42%, 90%': { opacity: 0, transform: 'scale(1.12)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
});

const styles = stylex.create({
  svg: { inset: 0, position: 'absolute' },
  line: { fill: 'none', stroke: colors['--oniva-color-border-hover'], strokeWidth: 0.4 },
  dashed: {
    animationDuration: DUR,
    animationName: { default: dashedOut, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
    strokeDasharray: '1.2 1.4',
  },
  solid: {
    animationDuration: DUR,
    animationName: { default: draw, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
    fill: 'none',
    stroke: accent['--oniva-accent-solid'],
    strokeDashoffset: 1,
    strokeDasharray: 1,
    strokeLinecap: 'round',
    strokeWidth: 0.5,
  },
  person: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.4cqw',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
  },
  at: (x: number, y: number) => ({ left: `${x}%`, top: `${y}%` }),
  ring: {
    borderRadius: radius['--oniva-radius-full'],
    boxShadow: `${shadow['--oniva-shadow-md']}, 0 0 0 1px ${colors['--oniva-color-border']}`,
    display: 'block',
    padding: '0.6cqw',
    backgroundColor: colors['--oniva-color-surface'],
  },
  slot: {
    animationDuration: DUR,
    animationName: { default: slotFade, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
    borderColor: colors['--oniva-color-border-control'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'dashed',
    borderWidth: 2,
    boxSizing: 'border-box',
    display: 'block',
    height: '15cqw',
    width: '15cqw',
  },
  name: {
    color: colors['--oniva-color-text-muted'],
    fontFamily: font['--oniva-font-sans'],
    fontSize: '2.2cqw',
    fontWeight: 500,
  },
  invited: {
    alignItems: 'center',
    animationDuration: DUR,
    animationName: { default: carry, [media.reducedMotion]: 'none' },
    animationTimingFunction: ease,
    display: 'flex',
    flexDirection: 'column',
    gap: '1.4cqw',
    opacity: 1,
    transform: `translate(${FX}cqw, ${FY}cqw)`,
  },
  lifter: {
    animationDuration: DUR,
    animationName: { default: lift, [media.reducedMotion]: 'none' },
    borderRadius: radius['--oniva-radius-full'],
    position: 'relative',
  },
  liftShadow: {
    animationDuration: DUR,
    animationName: { default: liftShadow, [media.reducedMotion]: 'none' },
    borderRadius: radius['--oniva-radius-full'],
    boxShadow: shadow['--oniva-shadow-xl'],
    inset: 0,
    opacity: 0,
    pointerEvents: 'none',
    position: 'absolute',
  },
  landRing: {
    animationDuration: DUR,
    animationName: { default: landRing, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
    borderColor: accent['--oniva-accent-solid'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1.5,
    inset: 0,
    opacity: 0,
    pointerEvents: 'none',
    position: 'absolute',
  },
  dot: {
    animationDuration: DUR,
    animationName: { default: online, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
    backgroundColor: colors['--oniva-color-success-solid'],
    borderColor: colors['--oniva-color-surface'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: '0.5cqw',
    bottom: '1.2cqw',
    boxSizing: 'border-box',
    height: '3.6cqw',
    opacity: 0,
    position: 'absolute',
    right: '1cqw',
    transform: 'scale(0.5)',
    width: '3.6cqw',
  },
  cursor: {
    animationDuration: DUR,
    animationName: { default: cursorMove, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'linear',
    filter: 'drop-shadow(0 0.5cqw 1cqw rgba(0,0,0,0.16))',
    height: '6cqw',
    left: '8cqw',
    opacity: 1,
    pointerEvents: 'none',
    position: 'absolute',
    top: '7cqw',
    transformOrigin: '12% 4%',
    width: '5cqw',
    zIndex: 3,
  },
  wrapMove: { position: 'relative' },
});

export interface TeamInviteAvatar {
  name: string;
  /** Image URL; falls back to initials. */
  src?: string;
}

export interface TeamInviteProps extends IllustrationProps {
  /** Two connected teammates, then the one being invited. */
  avatars?: [TeamInviteAvatar, TeamInviteAvatar, TeamInviteAvatar];
}

const DEFAULT: [TeamInviteAvatar, TeamInviteAvatar, TeamInviteAvatar] = [
  { name: 'Maya Chen' },
  { name: 'Dev Patel' },
  { name: 'Sofia Rossi' },
];

/** Two connected teammates; a cursor drags a third into the empty slot, the line turns solid and they go online. A 4.4 s loop: pick up (lift), carry, drop with a ring, dot pops. */
export function TeamInvite({ avatars = DEFAULT, label, ...rest }: TeamInviteProps) {
  const [a, b, c] = avatars;
  return (
    <Scene
      ratio="2 / 1"
      label={label ?? `${a.name} and ${b.name} are connected; ${c.name} is being invited to join them`}
      {...rest}
    >
      <svg viewBox="0 0 100 50" preserveAspectRatio="none" aria-hidden="true" {...stylex.props(styles.svg)}>
        <path d="M26 18 H50" {...stylex.props(styles.line)} />
        <path d="M50 18 H76" {...stylex.props(styles.line, styles.dashed)} />
        <path d="M50 18 H76" pathLength={1} {...stylex.props(styles.solid, loop.run)} />
      </svg>
      <Person x={26} y={36} person={a} />
      <Person x={50} y={36} person={b} />
      <span aria-hidden="true" {...stylex.props(styles.person, styles.at(76, 36))}>
        <span {...stylex.props(styles.slot, loop.run)} />
      </span>
      <span aria-hidden="true" {...stylex.props(styles.person, styles.at(76, 36))}>
        <span {...stylex.props(styles.invited, loop.run)}>
          <span {...stylex.props(styles.lifter, loop.run)}>
            <span {...stylex.props(styles.ring, styles.wrapMove)}>
              <span {...stylex.props(styles.liftShadow, loop.run)} />
              <span {...stylex.props(styles.landRing, loop.run)} />
              <Avatar name={c.name} src={c.src} size="lg" />
              <span {...stylex.props(styles.dot, loop.run)} />
            </span>
          </span>
          <span {...stylex.props(styles.name)}>{c.name.split(' ')[0]}</span>
          <span aria-hidden="true" {...stylex.props(styles.cursor, loop.run)}>
            <CursorArrow />
          </span>
        </span>
      </span>
    </Scene>
  );
}

function Person({ x, y, person }: { x: number; y: number; person: TeamInviteAvatar }) {
  return (
    <span aria-hidden="true" {...stylex.props(styles.person, styles.at(x, y))}>
      <span {...stylex.props(styles.ring)}>
        <Avatar name={person.name} src={person.src} size="lg" />
      </span>
      <span {...stylex.props(styles.name)}>{person.name.split(' ')[0]}</span>
    </span>
  );
}
