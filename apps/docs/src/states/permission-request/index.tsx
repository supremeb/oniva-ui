import { PermissionRequest, FileTextIcon, MailIcon } from 'oniva-ui';
import type { PermissionDecision, PermissionPreviewItem } from 'oniva-ui';
import type { StateModule } from '../types';

const NOW = Date.UTC(2026, 9, 31, 14, 30, 0);

const agent = { name: 'Release agent', model: 'Atlas 2' };

const files: PermissionPreviewItem[] = [
  { id: 'f1', label: 'src/queue/RetrySchedule.tsx', meta: '+204 −0' },
  { id: 'f2', label: 'src/queue/retry.ts', meta: '+31 −12' },
  { id: 'f3', label: 'src/queue/retry.test.ts', meta: '+58 −4' },
  { id: 'f4', label: 'queue.config.json', meta: '+3 −1' },
  { id: 'f5', label: 'CHANGELOG.md', meta: '+9 −0' },
  { id: 'f6', label: 'src/queue/index.ts', meta: '+1 −0' },
  { id: 'f7', label: 'docs/retries.md', meta: '+42 −7' },
  { id: 'f8', label: 'package.json', meta: '+1 −1' },
];

const longPath =
  'packages/northwind-queue/src/workers/scheduler/strategies/exponential-backoff-with-decorrelated-jitter.worker.ts';

const longReason =
  'The retry schedule change passed all 214 tests on the last run and the typecheck is clean. Pushing now lets the nightly canary pick it up before the 02:00 UTC batch window, which avoids holding the release for another full day. I will not touch any other branch.';

const allowedOnce: PermissionDecision = { allow: true, scope: 'once', at: NOW };
const allowedTimed: PermissionDecision = { allow: true, scope: 'timed', at: NOW - 12 * 60_000, until: NOW + 48 * 60_000 };
const expired: PermissionDecision = { allow: true, scope: 'timed', at: NOW - 61 * 60_000, until: NOW - 60_000 };
const allowedAlways: PermissionDecision = { allow: true, scope: 'always', at: NOW };
const denied: PermissionDecision = { allow: false, scope: 'once', at: NOW };

const base = {
  agent,
  action: 'push to main',
  target: 'northwind/queue',
  reason: 'Checks passed on the retry fix.',
  preview: files.slice(0, 3),
  now: NOW,
} as const;

const mod: StateModule = {
  slug: 'permission-request',
  title: 'Permission request',
  width: 420,
  groups: [
    {
      label: 'Risk',
      states: [
        { id: 'safe', label: 'safe', render: () => <PermissionRequest {...base} risk="safe" action="read the build log" target="ci/northwind-queue" /> },
        { id: 'risky', label: 'risky (default)', render: () => <PermissionRequest {...base} /> },
        { id: 'destructive', label: 'destructive (no Always)', render: () => <PermissionRequest {...base} risk="destructive" action="delete 3 branches" target="northwind/queue" /> },
      ],
    },
    {
      label: 'Content',
      states: [
        { id: 'bare', label: 'action only', render: () => <PermissionRequest agent={{ name: 'Release agent' }} action="send a status email" now={NOW} /> },
        { id: 'model-only', label: 'model, no target', render: () => <PermissionRequest agent={agent} action="send a status email" now={NOW} /> },
        { id: 'long-reason', label: 'long reason', render: () => <PermissionRequest {...base} reason={longReason} /> },
        {
          id: 'long-target',
          label: 'long target',
          render: () => <PermissionRequest {...base} action="overwrite a worker file" target={longPath} />,
        },
        {
          id: 'few-rows',
          label: 'two rows, no more',
          render: () => <PermissionRequest {...base} preview={files.slice(0, 2)} />,
        },
        {
          id: 'many-rows',
          label: 'eight rows, +5 more',
          render: () => <PermissionRequest {...base} preview={files} previewTitle="8 files will change" />,
        },
        {
          id: 'long-rows',
          label: 'long unbroken row labels',
          render: () => (
            <PermissionRequest
              {...base}
              preview={[
                { id: 'l1', label: longPath, meta: '+204 −0', icon: <FileTextIcon size={13} aria-hidden="true" /> },
                { id: 'l2', label: 'ops-review-team-with-a-very-long-distribution-list@northwind.example', meta: 'to', icon: <MailIcon size={13} aria-hidden="true" /> },
                { id: 'l3', label: 'src/queue/retry.ts', meta: '+31 −12', icon: <FileTextIcon size={13} aria-hidden="true" /> },
              ]}
            />
          ),
        },
      ],
    },
    {
      label: 'Scope',
      states: [
        { id: 'scope-timed', label: 'timed preselected', render: () => <PermissionRequest {...base} defaultScope="timed" /> },
        { id: 'scope-always', label: 'always preselected', render: () => <PermissionRequest {...base} defaultScope="always" /> },
        { id: 'duration-15', label: '15 minute grant', render: () => <PermissionRequest {...base} duration={15} defaultScope="timed" /> },
        { id: 'duration-120', label: '2 hour grant', render: () => <PermissionRequest {...base} duration={120} defaultScope="timed" /> },
        { id: 'scope-single', label: 'only "once" offered', render: () => <PermissionRequest {...base} scopes={['once']} /> },
        { id: 'scope-two', label: 'once or always', render: () => <PermissionRequest {...base} scopes={['once', 'always']} /> },
        {
          id: 'scope-destructive-always',
          label: 'destructive, Always requested',
          render: () => <PermissionRequest {...base} risk="destructive" defaultScope="always" action="delete 3 branches" />,
        },
      ],
    },
    {
      label: 'Answer',
      states: [
        { id: 'allowed-once', label: 'allowed once', render: () => <PermissionRequest {...base} defaultDecision={allowedOnce} /> },
        { id: 'allowed-timed', label: 'allowed, 48 min left', render: () => <PermissionRequest {...base} defaultDecision={allowedTimed} /> },
        { id: 'allowed-expired', label: 'timed grant expired', render: () => <PermissionRequest {...base} defaultDecision={expired} /> },
        { id: 'allowed-always', label: 'allowed always', render: () => <PermissionRequest {...base} defaultDecision={allowedAlways} /> },
        { id: 'denied', label: 'denied', render: () => <PermissionRequest {...base} defaultDecision={denied} /> },
        {
          id: 'denied-long',
          label: 'denied, long action',
          render: () => <PermissionRequest {...base} action={`overwrite ${longPath}`} defaultDecision={denied} />,
        },
      ],
    },
  ],
  missing: [
    'Expanded "N more" rows (needs a click; no defaultOpen prop)',
    'Mid-fold animation between the card and the status line',
    'Pending / loading request and a failed-to-decide error (the component has no such status)',
    'Disabled card (no disabled prop)',
  ],
};

export default mod;
