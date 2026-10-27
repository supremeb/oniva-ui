import * as stylex from '@stylexjs/stylex';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button as RacButton } from 'react-aria-components';
import { CopyButton, LinkButton, accentNames, accentSwatches, type AccentName } from 'oniva-ui';
import { accent } from '@oniva-tokens/accent.stylex';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import { radius } from '@oniva-tokens/radius.stylex';
import { SITE, VERSION, counts } from '../lib/site';
import { ShaderLayer } from './ShaderLayer';
import { ui } from './ui';
import { mq } from './mq.stylex';

const enter = stylex.keyframes({
  from: { opacity: 0, transform: 'translateY(14px)', filter: 'blur(4px)' },
  to: { opacity: 1, transform: 'none', filter: 'blur(0)' },
});

const s = stylex.create({
  hero: {
    isolation: 'isolate',
    minHeight: { default: 'min(760px, calc(100svh - 57px))', [mq.BP]: 'min(820px, calc(100svh - 57px))' },
    overflow: 'hidden',
    position: 'relative',
  },
  // Shader is masked: faint behind the headline (contrast), full strength as a rising horizon.
  field: {
    inset: 0,
    maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.22) 30%, #000 72%, rgba(0,0,0,0.0) 100%)',
    position: 'absolute',
    WebkitMaskImage:
      'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.22) 30%, #000 72%, rgba(0,0,0,0.0) 100%)',
    zIndex: 0,
  },
  scrim: {
    backgroundImage: `linear-gradient(100deg, color-mix(in srgb, ${colors['--oniva-color-bg']} 88%, transparent) 0%, color-mix(in srgb, ${colors['--oniva-color-bg']} 70%, transparent) 38%, transparent 78%)`,
    inset: 0,
    pointerEvents: 'none',
    position: 'absolute',
    zIndex: 1,
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: 'inherit',
    paddingBlock: { default: '48px 40px', [mq.BP]: '72px 56px' },
    position: 'relative',
    zIndex: 2,
  },
  pill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: `color-mix(in srgb, ${colors['--oniva-color-surface']} 70%, transparent)`,
    backdropFilter: 'blur(8px)',
    borderColor: { default: colors['--oniva-color-border'], ':hover': colors['--oniva-color-border-hover'] },
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text'],
    display: 'inline-flex',
    fontFamily: font['--oniva-font-mono'],
    fontSize: font['--oniva-font-size-12'],
    gap: 8,
    letterSpacing: '0.02em',
    paddingBlock: 5,
    paddingInline: 12,
    textDecoration: 'none',
    transitionDuration: '150ms',
    transitionProperty: 'border-color, background-color',
  },
  dot: {
    backgroundColor: accent['--oniva-accent-500'],
    borderRadius: radius['--oniva-radius-full'],
    height: 6,
    width: 6,
  },
  h1: {
    color: colors['--oniva-color-text'],
    fontFamily: mq.DISPLAY,
    fontSize: { default: 'clamp(46px, 14.5vw, 72px)', [mq.BP]: 'clamp(72px, 9.4vw, 132px)' },
    fontWeight: 500,
    letterSpacing: '-0.055em',
    lineHeight: 0.94,
    margin: 0,
    marginBlockStart: 28,
  },
  line: {
    animationDuration: '700ms',
    animationFillMode: 'backwards',
    animationName: { default: enter, [mq.RM]: 'none' },
    animationTimingFunction: mq.EASE,
    display: 'block',
  },
  dim: { color: colors['--oniva-color-text-muted'] },
  sub: {
    color: colors['--oniva-color-text-muted'],
    fontSize: { default: font['--oniva-font-size-16'], [mq.BP]: font['--oniva-font-size-18'] },
    lineHeight: 1.5,
    margin: 0,
    marginBlockStart: 28,
    maxWidth: 520,
    textWrap: 'pretty',
  },
  actions: { alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 12, marginBlockStart: 28 },
  install: {
    alignItems: 'center',
    backgroundColor: `color-mix(in srgb, ${colors['--oniva-color-surface']} 78%, transparent)`,
    backdropFilter: 'blur(8px)',
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    color: colors['--oniva-color-text'],
    display: 'inline-flex',
    fontFamily: font['--oniva-font-mono'],
    fontSize: font['--oniva-font-size-13'],
    gap: 10,
    height: 44,
    paddingInlineEnd: 6,
    paddingInlineStart: 14,
  },
  prompt: { color: colors['--oniva-color-text-muted'] },
  foot: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    flexWrap: 'wrap',
    fontFamily: font['--oniva-font-mono'],
    fontSize: font['--oniva-font-size-12'],
    gap: 14,
    marginBlockStart: { default: 40, [mq.BP]: 64 },
  },
  swatches: { alignItems: 'center', display: 'flex', gap: 4 },
  sw: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderRadius: radius['--oniva-radius-full'],
    borderWidth: 0,
    cursor: 'pointer',
    display: 'inline-flex',
    height: 28,
    justifyContent: 'center',
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 1,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    padding: 0,
    width: 28,
  },
  swDot: {
    borderRadius: radius['--oniva-radius-full'],
    display: 'block',
    height: 16,
    transform: 'scale(0.9)',
    transitionDuration: '150ms',
    transitionProperty: 'transform, box-shadow',
    transitionTimingFunction: mq.EASE,
    width: 16,
  },
  swOn: {
    boxShadow: `0 0 0 2px ${colors['--oniva-color-bg']}, 0 0 0 4px ${colors['--oniva-color-text']}`,
    transform: 'scale(1)',
  },
  swColor: (c: string) => ({ backgroundColor: c }),
  delay: (ms: number) => ({ animationDelay: `${ms}ms` }),
  hex: { color: colors['--oniva-color-text'] },
  sr: {
    clip: 'rect(0 0 0 0)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
  },
});

export interface HeroProps {
  accent: AccentName;
  onAccentChange: (a: AccentName) => void;
  hex: string;
}

export function Hero({ accent: current, onAccentChange, hex }: HeroProps) {
  return (
    <section {...stylex.props(s.hero)} aria-labelledby="hero-title" data-testid="landing-hero">
      <div {...stylex.props(s.field)}>
        <ShaderLayer kind="hero" />
      </div>
      <div {...stylex.props(s.scrim)} aria-hidden="true" />
      <div {...stylex.props(ui.wrap, s.inner)}>
        <Link to="/components/agent-thinking" {...stylex.props(s.pill)}>
          <span {...stylex.props(s.dot)} aria-hidden="true" />
          <span>
            v{VERSION} · {counts.total} components · MIT
          </span>
          <ArrowRight size={12} aria-hidden="true" />
        </Link>
        <h1 id="hero-title" {...stylex.props(s.h1)}>
          <span {...stylex.props(s.sr)}>React design system for dashboards &amp; agent interfaces</span>
          <span aria-hidden="true">
            <span {...stylex.props(s.line)}>The material</span>
            <span {...stylex.props(s.line, s.delay(70))}>
              agents build
            </span>
            <span {...stylex.props(s.line, s.dim, s.delay(140))}>
              interfaces from.
            </span>
          </span>
        </h1>
        <p {...stylex.props(s.sub)}>
          oniva/ui is an open source React design system for dashboards and agent interfaces.{' '}
          {counts.total} components, {counts.charts} charts and {counts.ai} AI building blocks on StyleX and
          React Aria.
        </p>
        <div {...stylex.props(s.actions)}>
          <LinkButton href="#/components" size="lg" variant="primary" endIcon={<ArrowRight size={16} />}>
            Browse components
          </LinkButton>
          <LinkButton
            href={SITE.github}
            size="lg"
            variant="secondary"
            startIcon={<Star size={16} />}
            target="_blank"
            rel="noreferrer"
          >
            Star on GitHub
          </LinkButton>
          <div {...stylex.props(s.install)}>
            <span {...stylex.props(s.prompt)} aria-hidden="true">
              $
            </span>
            <code>npm i oniva-ui</code>
            <CopyButton value="npm i oniva-ui" aria-label="Copy install command" size="sm" variant="ghost" />
          </div>
        </div>
        <div {...stylex.props(s.foot)}>
          <span>Your theme, rendered.</span>
          <div role="group" aria-label="Preview theme color" {...stylex.props(s.swatches)}>
            {accentNames.map((name) => (
              <RacButton
                key={name}
                aria-label={`Preview ${name} theme`}
                aria-pressed={current === name}
                onPress={() => onAccentChange(name)}
                {...stylex.props(s.sw)}
              >
                <span {...stylex.props(s.swDot, s.swColor(accentSwatches[name]), current === name && s.swOn)} />
              </RacButton>
            ))}
          </div>
          <span aria-live="off">
            <span {...stylex.props(s.hex)}>--oniva-accent-500</span> {hex}
          </span>
        </div>
      </div>
    </section>
  );
}
