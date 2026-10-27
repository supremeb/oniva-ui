import * as stylex from '@stylexjs/stylex';
import { Pause, Play } from 'lucide-react';
import { useState } from 'react';
import { VoiceOrb, type VoiceOrbState } from '../../ai/VoiceOrb/VoiceOrb';
import { Button } from '../../components/Button/Button';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { radius } from '../../tokens/radius.stylex';
import { motion } from '../../tokens/motion.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { Scene, loop, useSteps, type IllustrationProps } from '../../internal/w7-scene';

/* Clean-room scene around the existing VoiceOrb (no third-party source). */

const breathe = stylex.keyframes({
  '0%, 100%': { opacity: 0.4, transform: 'scale(0.94)' },
  '50%': { opacity: 0.8, transform: 'scale(1.06)' },
});

const captionIn = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(4px)', filter: 'blur(2px)' },
  to: { opacity: 1, transform: 'translateY(0)', filter: 'blur(0)' },
});

const styles = stylex.create({
  captionText: {
    animationDuration: motion['--oniva-motion-dur-slow'],
    animationFillMode: 'both',
    animationName: { default: captionIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    display: 'inline-block',
  },
  floor: {
    animationDuration: '6s',
    animationName: { default: breathe, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
    backgroundImage: `radial-gradient(closest-side, ${accent['--oniva-accent-300']}, transparent)`,
    borderRadius: radius['--oniva-radius-full'],
    bottom: '8%',
    filter: 'blur(12px)',
    height: '24%',
    left: '18%',
    position: 'absolute',
    width: '64%',
  },
  stage: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '3cqw',
    inset: 0,
    justifyContent: 'center',
    position: 'absolute',
  },
  chip: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-surface'],
    borderRadius: radius['--oniva-radius-full'],
    boxShadow: `${shadow['--oniva-shadow-sm']}, 0 0 0 1px ${colors['--oniva-color-border']}`,
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: '2.6cqw',
    fontWeight: 500,
    justifyContent: 'center',
    maxWidth: '84%',
    minHeight: '8cqw',
    padding: '1.2cqw 3.2cqw',
    textAlign: 'center',
  },
  pause: { bottom: '2%', position: 'absolute', right: '2%' },
});

export interface VoiceOrbSceneProps extends IllustrationProps {
  /** Orb state (controlled). Without it the scene cycles through every state on its own. */
  state?: VoiceOrbState;
  /** Orb diameter in px. */
  size?: number;
  /** Caption shown for each state. */
  captions?: Partial<Record<VoiceOrbState, string>>;
  /** Show the pause / play control for the automatic demo. */
  showControl?: boolean;
}

const ORDER: VoiceOrbState[] = ['idle', 'listening', 'thinking', 'speaking'];
const CAPTIONS: Record<VoiceOrbState, string> = {
  idle: 'Say something to begin',
  listening: 'What is on my calendar tomorrow?',
  thinking: 'Checking your calendar…',
  speaking: 'You have two meetings: standup at 9:30 and a design review at 2:00.',
};

/** A voice assistant scene: the orb melts through idle, listening, thinking and speaking while a caption follows along. Includes a pause control. */
export function VoiceOrbScene({
  state,
  size = 128,
  captions,
  showControl = true,
  label,
  ...rest
}: VoiceOrbSceneProps) {
  const [paused, setPaused] = useState(false);
  return (
    <Scene
      ratio="4 / 3"
      role="group"
      label={label ?? 'Voice assistant orb with a live caption'}
      {...rest}
    >
      <Inner state={state} size={size} captions={{ ...CAPTIONS, ...captions }} paused={paused} />
      {showControl && state === undefined && (
        <span {...stylex.props(styles.pause)}>
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            aria-label={paused ? 'Play voice demo' : 'Pause voice demo'}
            onPress={() => setPaused((p) => !p)}
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
          </Button>
        </span>
      )}
    </Scene>
  );
}

function Inner({
  state,
  size,
  captions,
  paused,
}: {
  state?: VoiceOrbState;
  size: number;
  captions: Record<VoiceOrbState, string>;
  paused: boolean;
}) {
  const step = useSteps([2000, 2600, 1800, 3200], { paused });
  const shown = state ?? ORDER[step]!;
  return (
    <>
      <span aria-hidden="true" {...stylex.props(styles.floor, loop.run)} />
      <div {...stylex.props(styles.stage)}>
        <VoiceOrb state={shown} size={size} hideLabel name="Assistant" />
        <span aria-live="polite" {...stylex.props(styles.chip)}>
          <span key={shown} {...stylex.props(styles.captionText)}>
            {captions[shown]}
          </span>
        </span>
      </div>
    </>
  );
}
