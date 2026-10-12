import { useState } from 'react';
import { Button } from '../../components/Button/Button';
import type { DemoModule } from '../../internal/demo';
import { DynamicIsland } from './DynamicIsland';
import type { DynamicIslandState } from './DynamicIsland';

function IslandDemo() {
  const [s, setS] = useState<DynamicIslandState>('compact');
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <DynamicIsland
        state={s}
        compact={<span style={{ fontSize: 13, fontWeight: 500 }}>Now playing</span>}
        expanded={<div style={{ textAlign: 'center' }}><div style={{ fontWeight: 600 }}>Payment received</div><div style={{ fontSize: 13, opacity: 0.7 }}>Acme Corp · $12,480.00</div></div>}
        split={<span style={{ fontSize: 13, fontWeight: 500 }}>Timer 04:12</span>}
        splitAside={<span style={{ fontSize: 12 }}>3</span>}
      />
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {(['compact', 'expanded', 'split'] as const).map((k) => (
          <Button key={k} size="sm" variant={s === k ? 'primary' : 'secondary'} onPress={() => setS(k)}>{k}</Button>
        ))}
      </div>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: "Dynamic island",
    slug: "dynamic-island",
    category: 'Motion',
    description: "Morphing status pill with compact, expanded and split states. Shell morphs by transform; content blur-crossfades.",
  },
  demos: [
    {
      name: "States",
      code: "function IslandDemo() {\n  const [s, setS] = useState<DynamicIslandState>('compact');\n  return (\n    <div style={{ display: 'grid', gap: 16 }}>\n      <DynamicIsland\n        state={s}\n        compact={<span style={{ fontSize: 13, fontWeight: 500 }}>Now playing</span>}\n        expanded={<div style={{ textAlign: 'center' }}><div style={{ fontWeight: 600 }}>Payment received</div><div style={{ fontSize: 13, opacity: 0.7 }}>Acme Corp · $12,480.00</div></div>}\n        split={<span style={{ fontSize: 13, fontWeight: 500 }}>Timer 04:12</span>}\n        splitAside={<span style={{ fontSize: 12 }}>3</span>}\n      />\n      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>\n        {(['compact', 'expanded', 'split'] as const).map((k) => (\n          <Button key={k} size=\"sm\" variant={s === k ? 'primary' : 'secondary'} onPress={() => setS(k)}>{k}</Button>\n        ))}\n      </div>\n    </div>\n  );\n}\n\n<IslandDemo />",
      Component: () => (
        <IslandDemo />
      ),
    },
  ],
};
export default demo;
