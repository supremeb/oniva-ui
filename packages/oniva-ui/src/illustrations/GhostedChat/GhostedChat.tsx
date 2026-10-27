import * as stylex from '@stylexjs/stylex';
import { ThumbsDown } from 'lucide-react';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { useEffect, useState } from 'react';
import { loop, Scene, useHover, useScene, type IllustrationProps } from '../../internal/w7-scene';

const sweep = stylex.keyframes({
  '0%, 62%': { opacity: 0, transform: 'translateX(-110%)' },
  '70%': { opacity: 1 },
  '92%, 100%': { opacity: 0, transform: 'translateX(110%)' },
});
const arrive = stylex.keyframes({
  from: { filter: 'blur(2px)', opacity: 0, transform: 'translateY(2.6cqw) scale(0.92)' },
  to: { filter: 'blur(0)', opacity: 1, transform: 'translateY(0) scale(1)' },
});
const fade = stylex.keyframes({ from: { opacity: 0 }, to: { opacity: 1 } });
const pulseGlow = stylex.keyframes({ '0%, 100%': { opacity: 0.55 }, '50%': { opacity: 1 } });

const pulseGlowIn = stylex.keyframes({
  '0%': { opacity: 0 },
  '60%': { opacity: 1 },
  '100%': { opacity: 0.55 },
});

const styles = stylex.create({
  waiting: { opacity: 0 },
  arrive: {
    animationDuration: '620ms',
    animationFillMode: 'backwards',
    animationName: { default: arrive, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    transformOrigin: '100% 100%',
  },
  arriveAt: (ms: number) => ({ animationDelay: `${ms}ms` }),
  statusIn: {
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: fade, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  glow: {
    animationDuration: '3.6s',
    animationName: { default: pulseGlow, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
    backgroundImage: `linear-gradient(90deg, ${colors['--oniva-color-danger-solid']}, ${accent['--oniva-accent-500']})`,
    borderRadius: '50%',
    bottom: '3.4cqw',
    filter: 'blur(10px)',
    height: '4cqw',
    left: '12%',
    opacity: 0.55,
    pointerEvents: 'none',
    position: 'absolute',
    right: '12%',
  },
  glowWrap: { position: 'relative' },
  glowSeq: (ms: number) => ({
    animationDelay: `${ms}ms, ${ms + 600}ms`,
    animationDuration: '600ms, 3.6s',
    animationFillMode: 'backwards',
    // Two comma-separated animations (fade in once, then breathe forever): StyleX's lint only knows single values.
    // eslint-disable-next-line @stylexjs/valid-styles
    animationIterationCount: '1, infinite',
    animationName: { default: `${pulseGlowIn}, ${pulseGlow}`, [media.reducedMotion]: 'none' },
  }),
  stage: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    gap: '2.2cqw',
    inset: 0,
    justifyContent: 'center',
    padding: '0 10%',
    position: 'absolute',
  },
  rowWrap: { alignItems: 'flex-end', display: 'flex', flexDirection: 'column', gap: '0.6cqw' },
  bubble: {
    backgroundImage: `linear-gradient(135deg, ${accent['--oniva-accent-500']}, ${accent['--oniva-accent-700']})`,
    borderRadius: '3cqw 3cqw 0.8cqw 3cqw',
    boxSizing: 'border-box',
    color: colors['--oniva-color-accent-fg'],
    fontSize: '2.6cqw',
    fontWeight: 500,
    lineHeight: 1.3,
    maxWidth: '80%',
    overflow: 'hidden',
    padding: '1.8cqw 2.8cqw',
    position: 'relative',
    transform: 'translateY(0)',
    transitionDuration: motion['--oniva-motion-dur-slower'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  lift: { transform: 'translateY(-5cqw)' },
  last: {
    boxShadow: `0 0 4cqw -0.5cqw ${colors['--oniva-color-danger-solid']}`,
  },
  shine: {
    animationDuration: '5.5s',
    animationName: { default: sweep, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
    backgroundImage: `linear-gradient(100deg, transparent, ${colors['--oniva-color-danger-solid']}, transparent)`,
    inset: 0,
    mixBlendMode: 'soft-light',
    position: 'absolute',
  },
  status: {
    color: colors['--oniva-color-text-muted'],
    fontSize: '1.9cqw',
    fontVariantNumeric: 'tabular-nums',
    opacity: 1,
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'opacity',
  },
  statusRead: { color: colors['--oniva-color-text-error'] },
  hide: { opacity: 0 },
  reply: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-info-bg'],
    borderRadius: '3cqw 3cqw 3cqw 0.8cqw',
    bottom: '10%',
    color: colors['--oniva-color-info-fg'],
    display: 'flex',
    height: '7cqw',
    justifyContent: 'center',
    left: '10%',
    opacity: 0,
    position: 'absolute',
    transform: 'translateY(2cqw) scale(0.8)',
    transformOrigin: '0 100%',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-spring'],
    width: '10cqw',
  },
  show: { opacity: 1, transform: 'translateY(0) scale(1)' },
  replyIcon: { height: '3.6cqw', width: '3.6cqw' },
});

export interface GhostedChatProps extends IllustrationProps {
  /** Unanswered outgoing messages (the last three are shown). */
  messages?: string[];
  /** Status line under each message. */
  status?: string;
}

const DEFAULT = [
  'Hi Maya, following up on the pricing proposal',
  'Happy to jump on a quick call this week',
  'Should I send over a revised quote?',
];

/** Three unanswered messages marked as read. Hover to fade the statuses and pop in a thumbs-down reply. */
export function GhostedChat({
  messages = DEFAULT,
  status = 'Read',
  label = 'A chat with three unanswered messages that were read but never replied to',
  ...rest
}: GhostedChatProps) {
  const { hovered, handlers } = useHover();
  return (
    <Scene ratio="4 / 3" label={label} {...handlers} {...rest}>
      <Stage messages={messages} status={status} hovered={hovered} />
    </Scene>
  );
}

function Stage({ messages, status, hovered }: { messages: string[]; status: string; hovered: boolean }) {
  const shown = messages.slice(-3);
  const { live, reduced } = useScene();
  // The messages arrive one by one the first time the scene scrolls into view.
  const [played, setPlayed] = useState(false);
  useEffect(() => {
    if (live) setPlayed(true);
  }, [live]);
  const play = played || reduced;
  return (
    <>
      <div {...stylex.props(styles.stage)}>
        {shown.map((m, i) => {
          const isLast = i === shown.length - 1;
          return (
            <div key={i} {...stylex.props(styles.rowWrap, isLast && styles.glowWrap, !play && styles.waiting)}>
              {isLast && (
                <span
                  aria-hidden="true"
                  {...stylex.props(styles.glow, play && styles.glowSeq(300 + i * 700 + 200))}
                />
              )}
              <div {...stylex.props(styles.bubble, play && styles.arrive, play && styles.arriveAt(300 + i * 700), hovered && styles.lift, isLast && styles.last)}>
                {m}
                {isLast && <span {...stylex.props(styles.shine, loop.run)} />}
              </div>
              <span {...stylex.props(styles.status, play && styles.statusIn, play && styles.arriveAt(300 + i * 700 + 450), isLast && styles.statusRead, hovered && styles.hide)}>
                {status} {`9:${40 + i * 2}`}
              </span>
            </div>
          );
        })}
      </div>
      <span aria-hidden="true" {...stylex.props(styles.reply, hovered && styles.show)}>
        <ThumbsDown {...stylex.props(styles.replyIcon)} />
      </span>
    </>
  );
}
