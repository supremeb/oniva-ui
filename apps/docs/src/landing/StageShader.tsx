import { Shader, FlowingGradient, Godrays } from 'shaders/react';
import type { ShaderSceneProps } from './ShaderLayer';

/** Showcase stage: a dim accent wash lit from above by god rays whose strength follows the agent's progress. */
export default function StageShader({ palette: p, fillProps, onReady, onUnavailable, energy = 0.4 }: ShaderSceneProps) {
  return (
    <Shader colorSpace="srgb" disableTelemetry onReady={onReady} onUnavailable={onUnavailable} {...fillProps}>
      <FlowingGradient
        colorA={p.bg}
        colorB={p.isDark ? p.a900 : p.a100}
        colorC={p.isDark ? p.a700 : p.a200}
        colorD={p.isDark ? p.a600 : p.a300}
        colorSpace="oklab"
        speed={0.25}
        distortion={0.5}
      />
      <Godrays
        center={{ x: 0.5, y: -0.15 }}
        rayColor={p.isDark ? p.a400 : p.a500}
        density={0.35}
        intensity={0.12 + 0.5 * energy}
        spotty={0.8}
        speed={0.3}
        blendMode="screen"
      />
    </Shader>
  );
}
