import { IceCreamIcon, PackageIcon, PlayIcon, RotateCcwIcon, SendIcon } from '../../icons/IconSet';
import { useEffect, useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../../components/Button';
import { Flowchart, type FlowNode } from './Flowchart';

const nodes: FlowNode[] = [
  { id: 'trigger', kind: 'trigger', title: 'New order created', description: 'Trigger when a new order is created', icon: <IceCreamIcon size={18} /> },
  {
    id: 'if',
    kind: 'condition',
    title: 'Order matches',
    conditions: [
      { id: 'c1', join: 'If', subject: 'order', subjectIcon: <PackageIcon size={12} aria-hidden="true" />, field: 'flavor', operator: 'is', value: 'Rocky Road', valueTone: 'warning' },
      { id: 'c2', join: 'and', subject: 'order', subjectIcon: <PackageIcon size={12} aria-hidden="true" />, field: 'topping', operator: 'is', value: 'Brown butter brittle crunch', valueTone: 'warning' },
    ],
  },
  { id: 'act', kind: 'action', title: 'Notify the kitchen', description: 'Send a ticket to the churn station', icon: <SendIcon size={18} /> },
];

const order = ['trigger', 'if', 'act'];

function Run() {
  const [tick, setTick] = useState(-1);
  useEffect(() => {
    if (tick < 0 || tick > order.length * 2) return;
    const id = setTimeout(() => setTick((t) => t + 1), 1000);
    return () => clearTimeout(id);
  }, [tick]);
  const running = tick >= 0 && tick < order.length * 2;
  const live = nodes.map((n, i) => ({
    ...n,
    status: tick < 0 ? undefined : tick > i * 2 + 1 ? ('done' as const) : tick >= i * 2 ? ('running' as const) : undefined,
  }));
  const active = running ? order[Math.min(order.length - 1, Math.floor(tick / 2))] : undefined;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start', width: '100%' }}>
      <Flowchart nodes={live} activeId={active} isRunning={running} />
      <Button size="sm" variant="secondary" isDisabled={running} onPress={() => setTick(0)}>
        {tick < 0 ? <PlayIcon size={14} aria-hidden="true" /> : <RotateCcwIcon size={14} aria-hidden="true" />} {tick < 0 ? 'Run workflow' : 'Run again'}
      </Button>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Flowchart',
    slug: 'flowchart',
    category: 'AI & Agent',
    description: 'Workflow trigger, condition and action nodes on a dotted canvas. Connectors draw in, a pulse runs along them while the flow executes.',
  },
  demos: [
    {
      name: 'Order workflow',
      code: `<Flowchart
  nodes={[
    { id: 'trigger', kind: 'trigger', title: 'New order created', description: 'Trigger when a new order is created', icon: <IceCreamIcon /> },
    { id: 'if', kind: 'condition', title: 'Order matches', conditions: [
      { id: 'c1', join: 'If', subject: 'order', field: 'flavor', operator: 'is', value: 'Rocky Road', valueTone: 'warning' },
    ] },
    { id: 'act', kind: 'action', title: 'Notify the kitchen' },
  ]}
/>`,
      Component: () => <Flowchart nodes={nodes} />,
    },
    {
      name: 'Running',
      code: `<Flowchart nodes={nodes.map((n) => ({ ...n, status }))} activeId={activeId} isRunning />`,
      Component: Run,
    },
  ],
};

export default demo;
