// Clean-room implementation from the public World Map description. Geometry: Natural Earth (public domain), see world-geometry.ts.
import * as stylex from '@stylexjs/stylex';
import { useEffect, useState } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { Band, MapSwitcher, mapStyles } from '../../internal/w7-map';
import { Scene, type IllustrationProps } from '../../internal/w7-scene';
import { WORLD_GEOMETRY, WORLD_HEIGHT, WORLD_WIDTH, type ContinentId } from './world-geometry';

const styles = stylex.create({
  svg: { overflow: 'visible' },
  land: {
    fill: colors['--oniva-color-surface-tertiary'],
    stroke: colors['--oniva-color-surface-tertiary'],
    strokeLinejoin: 'round',
    strokeWidth: 0.6,
  },
  hi: {
    fill: colors['--oniva-color-accent-soft-hover'],
    stroke: colors['--oniva-color-accent-text'],
    strokeLinejoin: 'round',
    strokeWidth: 0.8,
  },
  hiLayer: { filter: 'drop-shadow(0 3px 3.5px rgba(31, 33, 40, 0.12))', transformBox: 'fill-box' },
});

export type Continent = ContinentId;

const NAMES: Record<Continent, string> = {
  'north-america': 'North America',
  'south-america': 'South America',
  europe: 'Europe',
  africa: 'Africa',
  asia: 'Asia',
  oceania: 'Oceania',
};
const ORDER = Object.keys(NAMES) as Continent[];

export interface WorldMapProps extends IllustrationProps {
  /** Highlighted continent (controlled). */
  continent?: Continent;
  /** Continent highlighted first when `continent` is not set. */
  defaultContinent?: Continent;
  onContinentChange?: (continent: Continent) => void;
  /** Show the continent menu in the top-left corner. */
  showSwitcher?: boolean;
}

/**
 * World map with one highlighted continent and a pastel band along its largest coastline. Switch continent from the menu.
 * Decorative: for per-country data use a chart.
 */
export function WorldMap({
  continent,
  defaultContinent = 'europe',
  onContinentChange,
  showSwitcher = true,
  label,
  ...rest
}: WorldMapProps) {
  const [own, setOwn] = useState<Continent>(defaultContinent);
  const current = continent ?? own;
  // The highlighted continent plus any previous one still fading back into the gray world
  const [layers, setLayers] = useState<{ key: number; id: Continent; leaving: boolean }[]>([
    { key: 0, id: current, leaving: false },
  ]);
  useEffect(() => {
    setLayers((all) => {
      const top = all[all.length - 1]!;
      if (top.id === current) return all;
      return [...all.map((l) => ({ ...l, leaving: true })), { key: top.key + 1, id: current, leaving: false }];
    });
  }, [current]);
  useEffect(() => {
    if (!layers.some((l) => l.leaving)) return;
    const t = window.setTimeout(() => setLayers((all) => all.filter((l) => !l.leaving)), 320);
    return () => window.clearTimeout(t);
  }, [layers]);
  const pick = (id: string) => {
    const next = id as Continent;
    if (continent === undefined) setOwn(next);
    if (next !== current) onContinentChange?.(next);
  };
  return (
    <Scene
      ratio={`${WORLD_WIDTH} / ${WORLD_HEIGHT}`}
      role="group"
      label={label ?? `World map with ${NAMES[current]} highlighted`}
      {...rest}
    >
      <svg
        viewBox={`0 0 ${WORLD_WIDTH} ${WORLD_HEIGHT}`}
        aria-hidden="true"
        {...stylex.props(mapStyles.layer, styles.svg)}
      >
        {ORDER.map((id) => (
          <path key={id} d={WORLD_GEOMETRY[id].d} {...stylex.props(styles.land)} />
        ))}
        {layers.map((l) => (
          <g key={l.key} {...stylex.props(styles.hiLayer, l.leaving ? mapStyles.leave : mapStyles.enter)}>
            <path d={WORLD_GEOMETRY[l.id].d} {...stylex.props(styles.hi)} />
            <Band d={WORLD_GEOMETRY[l.id].main} land={[WORLD_GEOMETRY[l.id].d]} />
          </g>
        ))}
      </svg>
      {showSwitcher && (
        <MapSwitcher
          label="Continent"
          options={ORDER.map((id) => ({ id, name: NAMES[id] }))}
          value={current}
          onChange={pick}
        />
      )}
    </Scene>
  );
}
