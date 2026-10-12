import { Shader, FlowingGradient, FlutedGlass, CursorRipples } from 'shaders/react';
import type { ShaderSceneProps } from './ShaderLayer';

/**
 * Hero field: a liquid gradient built from the live accent ramp, seen through reeded glass,
 * with cursor ripples on top. Every color is a design token resolved at runtime (see gate.usePalette).
 */
export default function HeroShader({ palette: p, fillProps, onReady, onUnavailable }: ShaderSceneProps) {
  return (
    <Shader
      colorSpace="srgb"
      disableTelemetry
      onReady={onReady}
      onUnavailable={onUnavailable}
      {...fillProps}
    >
      <FlowingGradient
        colorA={p.isDark ? p.bg : p.a100}
        colorB={p.isDark ? p.a800 : p.a400}
        colorC={p.isDark ? p.a500 : p.a500}
        colorD={p.isDark ? p.a300 : p.a200}
        colorSpace="oklab"
        speed={0.45}
        distortion={0.75}
      />
      <FlutedGlass
        shape="rounded"
        frequency={14}
        softness={0.7}
        refraction={1.1}
        aberration={0}
        highlight={p.isDark ? 0.22 : 0.3}
        highlightSoftness={0.5}
        lightAngle={35}
        speed={0.04}
      />
      <CursorRipples intensity={5} decay={12} radius={0.35} chromaticSplit={0} />
    </Shader>
  );
}
