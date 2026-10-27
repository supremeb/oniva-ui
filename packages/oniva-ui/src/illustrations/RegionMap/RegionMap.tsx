// Map shapes: Natural Earth (public domain), see region-geometry.ts.
import * as stylex from '@stylexjs/stylex';
import { useEffect, useId, useState } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { Band, MapSwitcher, mapStyles } from '../../internal/w7-map';
import { Scene, type IllustrationProps } from '../../internal/w7-scene';
import { REGION_GEOMETRY, type RegionGeometry } from './region-geometry';

const styles = stylex.create({
  svg: { overflow: 'visible' },
  stopIn: { stopColor: colors['--oniva-color-on-solid'], stopOpacity: 1 },
  stopOut: { stopColor: colors['--oniva-color-on-solid'], stopOpacity: 0 },
});

export interface RegionOption {
  id: string;
  name: string;
  /** Accessible description while this region is shown. */
  label?: string;
  /** Custom geometry on a 540 x 440 viewBox. Defaults to the built-in `dach` and `us` maps. */
  geometry?: RegionGeometry;
}

export interface RegionMapProps extends IllustrationProps {
  /** Shown region (controlled). */
  region?: string;
  /** Region shown first when `region` is not set. */
  defaultRegion?: string;
  onRegionChange?: (region: string) => void;
  /** Regions in the menu. Defaults to DACH and United States. */
  regions?: RegionOption[];
  /** Show the region menu in the top-left corner. */
  showSwitcher?: boolean;
}

const DEFAULT_REGIONS: RegionOption[] = [
  { id: 'dach', name: 'DACH', label: 'Map of the DACH region: Germany, Austria and Switzerland' },
  { id: 'us', name: 'United States', label: 'Map of the United States' },
];

type Layer = { key: number; id: string; leaving: boolean };

/**
 * Map illustration. The region sits filled in the middle, neighbouring outlines fade out toward the edges, and a pastel
 * band travels along the outer border. Pick another region in the menu and the maps cross-fade.
 */
export function RegionMap({
  region,
  defaultRegion = 'dach',
  onRegionChange,
  regions = DEFAULT_REGIONS,
  showSwitcher = true,
  label,
  ...rest
}: RegionMapProps) {
  const [own, setOwn] = useState(defaultRegion);
  const current = region ?? own;
  const option = regions.find((r) => r.id === current) ?? regions[0]!;
  const [layers, setLayers] = useState<Layer[]>([{ key: 0, id: option.id, leaving: false }]);

  useEffect(() => {
    setLayers((all) => {
      const top = all[all.length - 1]!;
      if (top.id === option.id) return all;
      return [...all.map((l) => ({ ...l, leaving: true })), { key: top.key + 1, id: option.id, leaving: false }];
    });
  }, [option.id]);
  useEffect(() => {
    if (!layers.some((l) => l.leaving)) return;
    const t = window.setTimeout(() => setLayers((all) => all.filter((l) => !l.leaving)), 320);
    return () => window.clearTimeout(t);
  }, [layers]);

  const pick = (id: string) => {
    if (region === undefined) setOwn(id);
    if (id !== current) onRegionChange?.(id);
  };
  const name = label ?? option.label ?? `Map of ${option.name}`;

  return (
    <Scene ratio="540 / 440" role="group" label={name} {...rest}>
      {layers.map((l) => (
        <MapLayer key={l.key} option={regions.find((r) => r.id === l.id) ?? option} leaving={l.leaving} />
      ))}
      {showSwitcher && (
        <MapSwitcher
          label="Region"
          options={regions.map((r) => ({ id: r.id, name: r.name }))}
          value={option.id}
          onChange={pick}
        />
      )}
    </Scene>
  );
}

function MapLayer({ option, leaving }: { option: RegionOption; leaving: boolean }) {
  const id = 'w7r' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const geo: RegionGeometry | undefined =
    option.geometry ?? (REGION_GEOMETRY as Record<string, RegionGeometry>)[option.id];
  if (!geo) return null;
  const [cx, cy, r] = geo.fade;
  return (
    <svg
      viewBox="0 0 540 440"
      aria-hidden="true"
      {...stylex.props(mapStyles.layer, styles.svg, leaving ? mapStyles.leave : mapStyles.enter)}
    >
      <defs>
        <radialGradient id={`${id}-g`} cx={cx} cy={cy} r={r} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopOpacity={0.9} {...stylex.props(styles.stopIn)} />
          <stop offset="0.65" stopOpacity={0.6} {...stylex.props(styles.stopIn)} />
          <stop offset="0.9" stopOpacity={0.18} {...stylex.props(styles.stopIn)} />
          <stop offset="1" {...stylex.props(styles.stopOut)} />
        </radialGradient>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x="0" y="0" width="540" height="440">
          <rect x="0" y="0" width="540" height="440" fill={`url(#${id}-g)`} />
        </mask>
      </defs>
      <g mask={`url(#${id}-m)`}>
        {geo.neighbors.map((d, i) => (
          <path key={i} d={d} {...stylex.props(mapStyles.outline)} />
        ))}
      </g>
      <g {...stylex.props(mapStyles.land)}>
        {geo.land.map((d, i) => (
          <path key={i} d={d} {...stylex.props(mapStyles.fill)} />
        ))}
      </g>
      <Band d={geo.perimeter} land={geo.land} />
    </svg>
  );
}
