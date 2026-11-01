import { CodeBlock } from 'oniva-ui';
import type { StateModule } from '../types';

const py = `import pandas as pd

df = pd.read_csv("q3_revenue.csv", parse_dates=["closed_at"])
by_segment = df.groupby("segment")["amount"].sum().sort_values(ascending=False)
print(by_segment.head())`;

const wide = `export async function syncWorkspaceSnapshot(workspaceId: string, options: { includeArchivedThreads: boolean; maxConcurrentUploads: number }): Promise<SnapshotResult> {
  const response = await fetch(\`https://api.northwind.example/v2/workspaces/\${workspaceId}/snapshots?include_archived=\${options.includeArchivedThreads}&concurrency=\${options.maxConcurrentUploads}\`, { method: 'POST', headers: { 'content-type': 'application/json' } });
  return response.json();
}`;

const tall = Array.from({ length: 48 }, (_, i) => {
  const rows = [
    `export function plan${i + 1}(input: RetryInput): RetryPlan {`,
    `  const delay = Math.min(input.baseMs * 2 ** ${i % 6}, input.capMs);`,
    `  return { attempt: ${i + 1}, delayMs: delay, jitter: input.jitter };`,
    `}`,
  ];
  return rows[i % 4];
}).join('\n');

const unbroken =
  'curl -fsSL https://downloads.northwind.example/releases/atlas-runtime/2.14.0/linux-arm64/atlas-runtime-2.14.0-linux-arm64-musl-static.tar.gz?signature=7f3c9b1e4a2d8c05b6e1f0a9d3c27e48b5a6091c2d4e8f7a3b1c0d9e8f7a6b5c';

const mod: StateModule = {
  slug: 'code-block',
  title: 'Code block',
  width: 560,
  groups: [
    {
      label: 'Header',
      states: [
        {
          id: 'filename-and-language',
          label: 'filename and language',
          render: () => <CodeBlock filename="q3_revenue.py" language="python" code={py} />,
        },
        {
          id: 'filename-only',
          label: 'filename only',
          render: () => <CodeBlock filename="q3_revenue.py" code={py} />,
        },
        {
          id: 'language-only',
          label: 'language only',
          render: () => <CodeBlock language="python" code={py} />,
        },
        {
          id: 'bare',
          label: 'bare, floating copy',
          render: () => <CodeBlock code={py} />,
        },
        {
          id: 'bare-one-line',
          label: 'bare, one line',
          render: () => <CodeBlock code="npm i @oniva/ui" />,
        },
      ],
    },
    {
      label: 'Content',
      states: [
        {
          id: 'empty',
          label: 'empty code',
          render: () => <CodeBlock filename="notes.txt" language="text" code="" />,
        },
        {
          id: 'single-line',
          label: 'single line with header',
          render: () => <CodeBlock filename="install.sh" language="bash" code="npm install northwind-queue@3.2.1" />,
        },
        {
          id: 'wide-lines',
          label: 'long lines scroll sideways',
          render: () => <CodeBlock filename="syncWorkspaceSnapshot.ts" language="typescript" code={wide} />,
        },
        {
          id: 'tall',
          label: 'tall, scrolls past 420px',
          render: () => <CodeBlock filename="retry-plans.ts" language="typescript" code={tall} />,
        },
        {
          id: 'unbroken-bare',
          label: 'unbroken URL, bare',
          render: () => <CodeBlock code={unbroken} />,
        },
        {
          id: 'long-filename',
          label: 'long filename truncates',
          render: () => (
            <CodeBlock
              filename="packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts"
              language="typescript"
              code={wide}
            />
          ),
        },
        {
          id: 'long-filename-narrow',
          label: 'long filename, narrow card',
          render: () => (
            <div style={{ maxWidth: 280 }}>
              <CodeBlock
                filename="exponential-backoff-with-decorrelated-jitter.worker.ts"
                language="typescript"
                code="export const MAX_ATTEMPTS = 8;"
              />
            </div>
          ),
        },
      ],
    },
  ],
  missing: [
    'Copied confirmation (check icon + "Copied" label) needs a click to reach; no prop exposes it.',
    'Copy failure / clipboard unavailable: the component swallows the rejection and still shows "Copied".',
    'Syntax highlighting, line numbers, line wrapping toggle: not supported by the component.',
  ],
};

export default mod;
