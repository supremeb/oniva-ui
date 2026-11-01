import { RunLog } from 'oniva-ui';
import type { StateModule } from '../types';

const E = '\u001b';
const c = (code: string, s: string) => `${E}[${code}m${s}${E}[0m`;

const testRun: string[] = [
  `${c('36', '$')} pnpm test --filter payments`,
  c('2', 'Running 48 tests across 9 files'),
  `${c('32', '✓')} webhooks/retry.test.ts ${c('2', '(6 tests) 212ms')}`,
  `${c('32', '✓')} webhooks/signature.test.ts ${c('2', '(4 tests) 88ms')}`,
  `${c('33', '⚠')} queue/consumer.test.ts: slow test (1.9s)`,
  `${c('31', '✗')} queue/ack-order.test.ts`,
  `  ${c('31', 'AssertionError: expected ack to be called after deliver')}`,
  `${c('32', '✓')} billing/invoice.test.ts ${c('2', '(12 tests) 301ms')}`,
  `${c('1', 'Tests')}  ${c('31', '1 failed')} | ${c('32', '47 passed')} (48)`,
  c('2', 'Duration 4.12s'),
];

const palette: string[] = [
  `${c('31', 'red')} ${c('32', 'green')} ${c('33', 'yellow')} ${c('34', 'blue')} ${c('35', 'magenta')} ${c('36', 'cyan')} ${c('90', 'gray')}`,
  `${c('91', 'bright red')} ${c('92', 'bright green')} ${c('93', 'bright yellow')} ${c('94', 'bright blue')} ${c('95', 'bright magenta')} ${c('96', 'bright cyan')}`,
  `${c('1', 'bold')} ${c('2', 'dim')} ${c('1;32', 'bold green')} ${c('2;31', 'dim red')} ${c('1;2', 'bold dim')}`,
  `${E}[2K${E}[1Gcursor escapes are stripped${E}[?25h`,
  `${c('4;31', 'underline is ignored')} ${c('38;5;208', 'extended colors fall back to plain text')}`,
];

const build: string[] = Array.from({ length: 64 }, (_, i) => {
  const mods = ['auth', 'billing', 'queue', 'search', 'webhooks', 'notifications', 'exports', 'audit'];
  const m = mods[i % mods.length]!;
  const ms = 40 + ((i * 37) % 420);
  if (i === 0) return `${c('36', '$')} pnpm build --filter northwind-api`;
  if (i % 17 === 0) return `${c('33', '⚠')} ${m}: bundle exceeds 250 kB budget (${240 + i} kB)`;
  return `${c('32', '✓')} packages/${m}/src/index.ts ${c('2', `compiled in ${ms}ms`)}`;
});

const longPath =
  'packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter/__fixtures__/snapshots/retry-schedule.worker.snapshot.json';
const longUrl =
  'https://api.northwind.example/v2/workspaces/ws_7f3a91c2d4e84b1f/projects/prj_0b6e5a77/deployments/dpl_9c1d3e5f7a2b4c68/logs?cursor=eyJvZmZzZXQiOjQyMDAsImxpbWl0IjoyMDB9&level=error';

const mod: StateModule = {
  slug: 'run-log',
  title: 'Run log',
  width: 720,
  groups: [
    {
      label: 'Data',
      states: [
        { id: 'empty', label: 'empty', render: () => <RunLog lines={[]} /> },
        { id: 'one-line', label: 'one line', render: () => <RunLog lines={[`${c('36', '$')} git status`]} /> },
        { id: 'typical', label: 'typical test run', render: () => <RunLog title="pnpm test · code review agent" lines={testRun} /> },
        { id: 'long', label: 'long output (scrolls, pinned to end)', render: () => <RunLog title="pnpm build" lines={build} /> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'plain', label: 'plain text, no ANSI', render: () => <RunLog lines={['$ ls -la', 'total 48', 'drwxr-xr-x  9 agent  staff   288 Oct 30 09:14 .', '-rw-r--r--  1 agent  staff  1204 Oct 30 09:14 package.json', '-rw-r--r--  1 agent  staff  8841 Oct 30 09:12 README.md']} /> },
        { id: 'ansi-palette', label: 'ANSI colors, weights, stripped escapes', render: () => <RunLog title="Palette" lines={palette} /> },
        { id: 'blank-lines', label: 'blank lines', render: () => <RunLog lines={['$ node scripts/report.mjs', '', 'Northwind weekly report', '', '', 'done']} /> },
        {
          id: 'long-unbroken',
          label: 'long path and URL wrap',
          render: () => (
            <RunLog
              title="curl · deployment logs"
              lines={[
                `${c('36', '$')} curl -s ${longUrl}`,
                `${c('31', 'ENOENT')}: no such file or directory, open '${longPath}'`,
                `${c('33', '⚠')} ${longPath}`,
              ]}
            />
          ),
        },
        {
          id: 'long-title',
          label: 'long title',
          render: () => (
            <RunLog
              title="pnpm --filter @northwind/exponential-backoff-with-decorrelated-jitter-worker run test:integration --coverage"
              lines={testRun.slice(0, 4)}
            />
          ),
        },
        { id: 'custom-title', label: 'custom title', render: () => <RunLog title="Deploy · staging" lines={[`${c('36', '$')} vercel deploy --target staging`, c('2', 'Uploading 214 files…'), `${c('32', '✓')} Ready: https://northwind-staging.example`]} /> },
      ],
    },
  ],
  missing: [
    'Streaming / new lines arriving (needs lines to change over time; fade-in only applies to lines appended after mount)',
    'Scrolled-up with the "Jump to latest" button visible (needs a user scroll)',
    'Copied confirmation (needs a press)',
    'Loading or error status (the component has no status prop)',
  ],
};
export default mod;
