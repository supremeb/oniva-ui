import { useEffect, useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { RunLog } from './RunLog';

const E = '\u001b';
const SCRIPT = [
  `${E}[36m$${E}[0m pnpm test --filter payments`,
  `${E}[2mRunning 48 tests across 9 files${E}[0m`,
  `${E}[32m✓${E}[0m webhooks/retry.test.ts ${E}[2m(6 tests) 212ms${E}[0m`,
  `${E}[32m✓${E}[0m webhooks/signature.test.ts ${E}[2m(4 tests) 88ms${E}[0m`,
  `${E}[33m⚠${E}[0m queue/consumer.test.ts: slow test (1.9s)`,
  `${E}[31m✗${E}[0m queue/ack-order.test.ts`,
  `  ${E}[31mAssertionError: expected ack to be called after deliver${E}[0m`,
  `${E}[32m✓${E}[0m billing/invoice.test.ts ${E}[2m(12 tests) 301ms${E}[0m`,
  `${E}[1mTests${E}[0m  ${E}[31m1 failed${E}[0m | ${E}[32m47 passed${E}[0m (48)`,
  `${E}[2mDuration 4.12s${E}[0m`,
];

function Streaming() {
  const [n, setN] = useState(3);
  useEffect(() => {
    if (n >= SCRIPT.length) return;
    const id = setTimeout(() => setN((v) => v + 1), 700);
    return () => clearTimeout(id);
  }, [n]);
  return <RunLog title="pnpm test · code review agent" lines={SCRIPT.slice(0, n)} />;
}

const demo: DemoModule = {
  meta: {
    title: 'Run log',
    slug: 'run-log',
    category: 'AI & Agent',
    description: 'Terminal-style streaming output with ANSI colors, autoscroll and copy.',
  },
  demos: [
    { name: 'Streaming test run', code: `<RunLog title="pnpm test" lines={lines} />`, Component: Streaming },
    {
      name: 'Static',
      code: `<RunLog lines={['$ git status', 'On branch main']} />`,
      Component: () => <RunLog lines={SCRIPT.slice(0, 5)} />,
    },
  ],
};

export default demo;
