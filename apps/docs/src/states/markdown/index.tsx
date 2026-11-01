import { Markdown } from 'oniva-ui';
import type { StateModule } from '../types';

const longPath =
  'packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts';
const longUrl =
  'https://docs.northwind.example/guides/queue/retry-schedules/exponential-backoff-with-decorrelated-jitter?utm_source=changelog&utm_medium=release-notes&ref=retry-schedule-rollout';

const rich = `## Q3 summary

Revenue closed at **$4.82M**, up *14.2%* QoQ. Key drivers:

1. Enterprise renewals (+$310K)
2. Usage-based add-ons
3. Fewer downgrades in EMEA

| Segment | Q2 | Q3 | Change |
|---|--:|--:|--:|
| Enterprise | $2.61M | $3.02M | +15.7% |
| Mid-market | $1.30M | $1.42M | +9.2% |
| Self-serve | $0.36M | $0.38M | +5.6% |

> Self-serve churn rose to 3.1% in September.

\`\`\`sql
select segment, sum(amount) from deals where quarter = 'Q3' group by 1;
\`\`\`
`;

const wideTable = `| Job | Queue | Worker | Started | Duration | Attempts | Last error | Owner |
|---|---|---|---|--:|--:|---|---|
| nightly-export-2026-10-30 | exports.northwind.example | worker-eu-west-3a | 2026-10-30 02:00:04 | 14m 22s | 1 | none | data-platform |
| invoice-reconcile-batch-4412 | billing.northwind.example | worker-us-east-1c | 2026-10-30 03:15:41 | 6m 08s | 3 | Timeout after 30000ms waiting for ledger lock | billing-core |
| search-reindex-shard-17 | search.northwind.example | worker-ap-south-2b | 2026-10-30 04:40:12 | 41m 55s | 2 | Connection reset by peer | search-infra |`;

const sizes = (md: string) => <Markdown>{md}</Markdown>;

const mod: StateModule = {
  slug: 'markdown',
  title: 'Markdown',
  width: 720,
  groups: [
    {
      label: 'Document',
      states: [
        { id: 'empty', label: 'empty string', render: () => sizes('') },
        {
          id: 'plain',
          label: 'single paragraph',
          render: () =>
            sizes(
              'The nightly export finished in 14m 22s with no retries. 18,204 rows were written to the warehouse and the checksum matched the source.',
            ),
        },
        { id: 'rich', label: 'rich answer', render: () => sizes(rich) },
      ],
    },
    {
      label: 'Text',
      states: [
        {
          id: 'headings',
          label: 'heading levels 1-6',
          render: () =>
            sizes(
              '# Release notes\n\nIntro paragraph under the title.\n\n## Highlights\n\nBody under h2.\n\n### Fixes\n\nBody under h3.\n\n#### Internals\n\nBody under h4.\n\n##### Appendix\n\nBody under h5.\n\n###### Footnotes\n\nBody under h6.',
            ),
        },
        {
          id: 'inline',
          label: 'bold, italic, strike, code, break',
          render: () =>
            sizes(
              'Retries use **exponential backoff**, *with jitter*, and ~~no fixed delay~~. Set `maxAttempts` to `5`.  \nThis line follows a hard break and ends with ***bold italic***.',
            ),
        },
        {
          id: 'long-unbroken',
          label: 'long path and URL',
          render: () =>
            sizes(
              `The failing worker lives at \`${longPath}\` and the guide is at ${longUrl} so check both.\n\nSingle token with no break opportunities: ${longPath.replaceAll('/', '')}`,
            ),
        },
        {
          id: 'blockquote',
          label: 'blockquote, nested',
          render: () =>
            sizes(
              '> Self-serve churn rose to 3.1% in September.\n>\n> > Excluding annual plans it was 2.4%.\n>\n> - Source: billing export\n> - Window: Sep 1-30',
            ),
        },
        {
          id: 'rule',
          label: 'horizontal rule',
          render: () => sizes('Before the rule.\n\n---\n\nAfter the rule.'),
        },
      ],
    },
    {
      label: 'Lists',
      states: [
        {
          id: 'bullets',
          label: 'bulleted list',
          render: () =>
            sizes(
              '- Enterprise renewals (+$310K)\n- Usage-based add-ons\n- Fewer downgrades in EMEA\n- A deliberately long list item that keeps going so it has to wrap onto a second line inside the list column at this width',
            ),
        },
        {
          id: 'ordered-start',
          label: 'ordered list starting at 4',
          render: () =>
            sizes('4. Roll back the scheduler\n5. Drain the retry queue\n6. Re-enable cron'),
        },
        {
          id: 'nested',
          label: 'nested lists',
          render: () =>
            sizes(
              '1. Prepare\n   - Freeze deploys\n   - Snapshot `queue.config.json`\n2. Migrate\n   1. Run `npm run migrate`\n   2. Verify row counts\n3. Announce in #release-notes',
            ),
        },
        {
          id: 'loose',
          label: 'loose list (paragraph items)',
          render: () =>
            sizes(
              '- First item has a paragraph.\n\n  And a second paragraph inside the same item.\n\n- Second item is separate.\n\n- Third item.',
            ),
        },
        {
          id: 'tasks',
          label: 'task list, done and open',
          render: () =>
            sizes(
              '- [x] Backfill 2026-09 invoices\n- [x] Rotate staging keys\n- [ ] Publish the retry runbook\n- [ ] Remove the legacy scheduler flag',
            ),
        },
      ],
    },
    {
      label: 'Code',
      states: [
        {
          id: 'fenced',
          label: 'fenced code with language',
          render: () =>
            sizes(
              'Run the migration:\n\n```bash\nnpm run migrate -- --env staging --dry-run\n```\n\nThen verify:\n\n```ts\nconst rows = await db.query("select count(*) from invoices");\nconsole.log(rows[0].count);\n```',
            ),
        },
        {
          id: 'fenced-no-lang',
          label: 'fenced code, no language',
          render: () => sizes('```\nretry #1 after 2s\nretry #2 after 4s\nretry #3 after 8s\n```'),
        },
        {
          id: 'fenced-long',
          label: 'fenced code, long line',
          render: () =>
            sizes(
              `\`\`\`ts\nimport { RetrySchedule } from '${longPath}'; export const schedule = new RetrySchedule({ base: 250, factor: 2, jitter: 'decorrelated', maxAttempts: 8, cap: 60_000 });\n\`\`\``,
            ),
        },
      ],
    },
    {
      label: 'Links and media',
      states: [
        {
          id: 'links',
          label: 'safe links (https, mailto, anchor, titled)',
          render: () =>
            sizes(
              'See the [retry guide](https://docs.northwind.example/retries), email [support](mailto:support@northwind.example), jump to [the summary](#summary), or hover [this one](https://docs.northwind.example/slo "Service level objectives").',
            ),
        },
        {
          id: 'links-unsafe',
          label: 'unsafe link dropped',
          render: () =>
            sizes(
              'Click [here](javascript:alert(1)) or [data](data:text/html;base64,PGgxPmhpPC9oMT4=) to continue.',
            ),
        },
        {
          id: 'render-link',
          label: 'custom renderLink (citations)',
          render: () => (
            <Markdown renderLink={({ children, href }) => <sup data-href={href}>[{children}]</sup>}>
              {
                'Churn rose to 3.1% [1](https://docs.northwind.example/churn) while renewals held [2](https://docs.northwind.example/renewals).'
              }
            </Markdown>
          ),
        },
        {
          id: 'image',
          label: 'image, safe src',
          render: () =>
            sizes('![Retry latency by attempt](/og.svg)\n\nCaption paragraph after the image.'),
        },
        {
          id: 'image-unsafe',
          label: 'image, unsafe src falls back to alt',
          render: () =>
            sizes('![Retry latency chart](javascript:alert(1))\n\nThe chart could not be loaded.'),
        },
      ],
    },
    {
      label: 'Tables',
      states: [
        {
          id: 'table-aligned',
          label: 'table, aligned columns',
          render: () =>
            sizes(
              '| Region | Left | Center | Right |\n|:---|:---|:---:|---:|\n| EMEA | $1.20M | 14 | 12.4% |\n| APAC | $0.84M | 9 | 8.1% |\n| AMER | $2.78M | 31 | 15.9% |',
            ),
        },
        { id: 'table-wide', label: 'table, wider than container', render: () => sizes(wideTable) },
      ],
    },
    {
      label: 'Safety',
      states: [
        {
          id: 'raw-html',
          label: 'raw html shown as text',
          render: () =>
            sizes(
              '<script>alert(1)</script>\n\n<div class="callout">Heads up</div>\n\nInline <b>bold</b> tags and <img src=x onerror=alert(1)> stay literal.',
            ),
        },
      ],
    },
  ],
  missing: [
    'Streaming/partial markdown: there is no streaming prop, an unclosed fence or list just renders as parsed.',
    'Loading or error state: the component only renders the string it is given.',
    'Heading levels above h3 are styled identically to h3 (no distinct h4-h6 style).',
    'Code-block copy, line numbers or wrap toggles: Markdown passes only code and language to CodeBlock.',
  ],
};

export default mod;
