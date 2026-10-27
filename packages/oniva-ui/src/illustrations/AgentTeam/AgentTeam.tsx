import * as stylex from '@stylexjs/stylex';
import { ArrowUp, Sparkles } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { Avatar } from '../../components/Avatar/Avatar';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { Tile, surface, type IllustrationItem } from '../../internal/w7-parts';
import { loop, Scene, useScene, useSteps, type IllustrationProps } from '../../internal/w7-scene';
import { media } from '../../tokens/media.stylex';

const blink = stylex.keyframes({ '50%': { opacity: 0 } });
const press = stylex.keyframes({ '0%': { transform: 'scale(1)' }, '40%': { transform: 'scale(0.86)' }, '100%': { transform: 'scale(1)' } });
const ping = stylex.keyframes({ '0%': { opacity: 0.5, transform: 'scale(1)' }, '70%, 100%': { opacity: 0, transform: 'scale(2.2)' } });

const styles = stylex.create({
  svg: { inset: 0, position: 'absolute', transitionDuration: motion['--oniva-motion-dur-slower'], transitionProperty: 'opacity', transitionTimingFunction: motion['--oniva-motion-ease-out'] },
  svgOff: { opacity: 0 },
  line: {
    fill: 'none',
    stroke: colors['--oniva-color-border-control'],
    strokeDasharray: '1.1 1.2',
    strokeLinecap: 'round',
    strokeWidth: 0.3,
  },
  reveal: {
    fill: 'none',
    stroke: 'white',
    strokeDasharray: '1 2',
    strokeDashoffset: 1,
    strokeWidth: 2,
    transitionDuration: '700ms',
    transitionProperty: 'stroke-dashoffset',
    transitionTimingFunction: motion['--oniva-motion-ease-in-out'],
  },
  lineOn: { strokeDashoffset: 0 },
  caret: {
    animationDuration: '1s',
    animationName: blink,
    animationTimingFunction: 'steps(1)',
    backgroundColor: colors['--oniva-color-text'],
    borderRadius: 1,
    display: 'inline-block',
    height: '3.2cqw',
    marginLeft: '0.3cqw',
    verticalAlign: '-0.6cqw',
    width: '0.3cqw',
  },
  typedOff: { opacity: 0, transitionDuration: motion['--oniva-motion-dur-sheet'], transitionProperty: 'opacity', transitionTimingFunction: motion['--oniva-motion-ease-out'] },
  pressed: { animationDuration: '380ms', animationFillMode: 'both', animationName: press, animationTimingFunction: motion['--oniva-motion-ease-spring'] },
  meta: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.6cqw',
    opacity: 0,
    transform: 'translateY(1.5cqw)',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  metaOn: { opacity: 1, transform: 'translateY(0)', transitionDelay: '120ms' },
  cardOff: { opacity: 0, transform: 'none', transitionDuration: motion['--oniva-motion-dur-slower'], transitionProperty: 'opacity', transitionTimingFunction: motion['--oniva-motion-ease-out'] },
  ring: {
    animationDuration: '2.4s',
    animationName: ping,
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundColor: colors['--oniva-color-success-solid'],
    borderRadius: radius['--oniva-radius-full'],
    inset: 0,
    pointerEvents: 'none',
    position: 'absolute',
  },
  lift: {
    transform: { default: 'translateY(0)', ':hover': { default: null, [media.hover]: 'translateY(-0.8cqw)' } },
    transitionDuration: motion['--oniva-motion-dur-enter'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  glow: {
    backgroundImage: `radial-gradient(closest-side, ${accent['--oniva-accent-400']}, ${colors['--oniva-color-purple-fg']} 60%, transparent)`,
    borderRadius: radius['--oniva-radius-full'],
    filter: 'blur(18px)',
    height: '16cqw',
    left: '14%',
    opacity: 0,
    position: 'absolute',
    top: '2cqw',
    transform: 'scale(0.8)',
    transitionDuration: motion['--oniva-motion-dur-slower'],
    transitionProperty: 'opacity, transform',
    width: '72%',
  },
  glowOn: { opacity: 0.45, transform: 'scale(1)' },
  prompt: {
    alignItems: 'center',
    boxSizing: 'border-box',
    display: 'flex',
    fontSize: '2.7cqw',
    gap: '1.6cqw',
    height: '11cqw',
    left: '12%',
    padding: '0 1.6cqw 0 2.6cqw',
    position: 'absolute',
    top: '4.5cqw',
    width: '76%',
  },
  promptIcon: { color: colors['--oniva-color-accent-text'], flexShrink: 0, height: '3.4cqw', width: '3.4cqw' },
  typed: { flexBasis: 0, flexGrow: 1, flexShrink: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'clip', whiteSpace: 'nowrap' },
  send: {
    alignItems: 'center',
    backgroundImage: `linear-gradient(145deg, ${accent['--oniva-accent-500']}, ${accent['--oniva-accent-700']})`,
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-accent-fg'],
    display: 'inline-flex',
    flexShrink: 0,
    height: '7.4cqw',
    justifyContent: 'center',
    transform: 'scale(1)',
    transitionDuration: motion['--oniva-motion-dur-press'],
    transitionProperty: 'transform',
    width: '7.4cqw',
  },
  card: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.6cqw',
    opacity: 0,
    padding: '3cqw 1cqw 2.4cqw',
    position: 'absolute',
    top: '44cqw',
    transform: 'translateY(3cqw) scale(0.94)',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-spring'],
    width: '26%',
  },
  cardOn: { opacity: 1, transform: 'translateY(0) scale(1)' },
  at: (x: number) => ({ left: `${x - 13}%` }),
  avatarWrap: { position: 'relative' },
  dot: {
    backgroundColor: colors['--oniva-color-success-solid'],
    borderColor: colors['--oniva-color-surface'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: '0.5cqw',
    bottom: 0,
    boxSizing: 'border-box',
    height: '3.4cqw',
    position: 'absolute',
    right: 0,
    transform: 'scale(0)',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-spring'],
    width: '3.4cqw',
  },
  dotOn: { transform: 'scale(1)' },
  dotAt: (i: number) => ({ transitionDelay: `${i * 160 + 360}ms` }),
  role: { fontFamily: font['--oniva-font-sans'], fontSize: '2.4cqw', fontWeight: 600 },
  tools: { alignItems: 'center', display: 'flex' },
  overlap: { marginLeft: '-1.2cqw' },
  first: { marginLeft: 0 },
});

export interface AgentTeamMember {
  role: string;
  /** Avatar image URL; falls back to initials from `name`. */
  avatar?: string;
  name?: string;
  /** Up to two tools the agent uses. */
  tools?: IllustrationItem[];
}

export interface AgentTeamProps extends IllustrationProps {
  /** Text that types itself into the prompt pill. */
  prompt?: string;
  /** Three agents, left to right. */
  members?: [AgentTeamMember, AgentTeamMember, AgentTeamMember];
}

const DEFAULT_MEMBERS: [AgentTeamMember, AgentTeamMember, AgentTeamMember] = [
  { role: 'Researcher', name: 'Atlas', tools: [{ name: 'Search' }, { name: 'Docs' }] },
  { role: 'Qualifier', name: 'Nova', tools: [{ name: 'CRM' }, { name: 'Enrich' }] },
  { role: 'Outreach', name: 'Quill', tools: [{ name: 'Mail' }, { name: 'Chat' }] },
];

const XS = [17, 50, 83];

/**
 * A prompt types itself, the send button presses and a glow blooms; dashed lines draw down and three agents pop in one
 * after another, then it starts over. Pauses off-screen; shows the finished team under reduced motion.
 */
export function AgentTeam({
  prompt = 'Build a team to work my inbound pipeline',
  members = DEFAULT_MEMBERS,
  label,
  ...rest
}: AgentTeamProps) {
  return (
    <Scene
      ratio="4 / 3"
      label={label ?? `Prompt "${prompt}" branching out to three agents: ${members.map((m) => m.role).join(', ')}`}
      {...rest}
    >
      <Stage prompt={prompt} members={members} />
    </Scene>
  );
}

function Stage({ prompt, members }: { prompt: string; members: AgentTeamMember[] }) {
  const { live, reduced } = useScene();
  const typeMs = Math.max(900, prompt.length * 38);
  const step = useSteps([typeMs + 500, 600, 700, 450, 450, 450, 2800, 600], { rest: 6 });
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const fading = step === 7;
  const [chars, setChars] = useState(prompt.length);

  useEffect(() => {
    if (reduced) {
      setChars(prompt.length);
      return;
    }
    if (step !== 0) {
      setChars(prompt.length);
      return;
    }
    setChars(0);
    if (!live) return;
    let n = 0;
    const id = window.setInterval(() => {
      n += 1;
      setChars(n);
      if (n >= prompt.length) window.clearInterval(id);
    }, 38);
    return () => window.clearInterval(id);
  }, [step, live, reduced, prompt]);

  const sent = step >= 1;
  return (
    <>
      <span aria-hidden="true" {...stylex.props(styles.glow, sent && !fading && styles.glowOn)} />
      <svg viewBox="0 0 100 75" preserveAspectRatio="none" aria-hidden="true" {...stylex.props(styles.svg, fading && styles.svgOff)}>
        <defs>
          {XS.map((x) => (
            <mask key={x} id={`${uid}-m${x}`} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="75">
              <path d={`M50 20 C50 32, ${x} 30, ${x} 46`} pathLength={1} {...stylex.props(styles.reveal, step >= 1 && styles.lineOn)} />
            </mask>
          ))}
        </defs>
        {XS.map((x) => (
          <path key={x} d={`M50 20 C50 32, ${x} 30, ${x} 46`} mask={`url(#${uid}-m${x})`} {...stylex.props(styles.line)} />
        ))}
      </svg>
      <div aria-hidden="true" {...stylex.props(surface.pill, styles.prompt)}>
        <Sparkles {...stylex.props(styles.promptIcon)} />
        <span {...stylex.props(styles.typed, fading && styles.typedOff)}>
          {prompt.slice(0, chars)}
          {step === 0 && <span {...stylex.props(styles.caret)} />}
        </span>
        <span {...stylex.props(styles.send, step === 1 && styles.pressed)}>
          <ArrowUp size={16} />
        </span>
      </div>
      {members.slice(0, 3).map((m, i) => {
        const on = step >= 3 + i;
        return (
          <div key={m.role} aria-hidden="true" {...stylex.props(styles.card, styles.at(XS[i]!), on && styles.cardOn, fading && styles.cardOff)}>
            <span {...stylex.props(styles.avatarWrap, styles.lift)}>
              <Avatar name={m.name ?? m.role} src={m.avatar} size="lg" />
              <span {...stylex.props(styles.dot, styles.dotAt(i), step >= 6 && !fading && styles.dotOn)}>
                {step >= 6 && !reduced && <span {...stylex.props(styles.ring, loop.run, loop.delay(i * 0.5))} />}
              </span>
            </span>
            <span {...stylex.props(styles.meta, on && styles.metaOn)}>
              <span {...stylex.props(styles.role)}>{m.role}</span>
              <span {...stylex.props(styles.tools)}>
                {(m.tools ?? []).slice(0, 2).map((t, j) => (
                  <Tile key={t.name} item={t} size={6.4} round tone={i * 2 + j} xstyle={j ? styles.overlap : styles.first} />
                ))}
              </span>
            </span>
          </div>
        );
      })}
    </>
  );
}
