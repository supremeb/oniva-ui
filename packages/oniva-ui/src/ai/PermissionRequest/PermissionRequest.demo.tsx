import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { PermissionRequest, type PermissionDecision } from './PermissionRequest';

const preview = [
  { id: 'a', label: 'src/checkout/cart.ts', meta: '+12 −4' },
  { id: 'b', label: 'src/checkout/tax.ts', meta: '+3 −1' },
  { id: 'c', label: 'Deploys to production after the merge' },
  { id: 'd', label: 'Notifies #releases', meta: '1 channel' },
];

function Push() {
  const [d, setD] = useState<PermissionDecision | null>(null);
  return (
    <PermissionRequest
      agent={{ name: 'Coder', model: 'Atlas 2' }}
      action="push to main"
      target="acme/web"
      reason="The fix for the flaky checkout test passed review and every check."
      preview={preview}
      decision={d}
      onDecisionChange={setD}
    />
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Permission request',
    slug: 'permission-request',
    category: 'AI & Agent',
    description: 'An agent asks for one specific right with a concrete preview. Allow once, for a while or always, then it folds into a status line with Revoke.',
  },
  demos: [
    {
      name: 'Push to main',
      code: `<PermissionRequest
  agent={{ name: 'Coder', model: 'Atlas 2' }}
  action="push to main"
  target="acme/web"
  reason="The fix for the flaky checkout test passed review and every check."
  preview={preview}
  decision={d}
  onDecisionChange={setD}
/>`,
      Component: Push,
    },
    {
      name: 'Destructive',
      code: `<PermissionRequest
  agent={{ name: 'Janitor' }}
  action="delete 214 stale branches"
  target="acme/web"
  risk="destructive"
  preview={[{ id: 'a', label: 'release/2025-*', meta: '214 branches' }]}
/>`,
      Component: () => (
        <PermissionRequest
          agent={{ name: 'Janitor' }}
          action="delete 214 stale branches"
          target="acme/web"
          risk="destructive"
          reason="None of them has been touched in over a year."
          preview={[{ id: 'a', label: 'release/2025-*', meta: '214 branches' }]}
        />
      ),
    },
    {
      name: 'Timed grant',
      code: `<PermissionRequest
  agent={{ name: 'Mailer' }}
  action="send 42 emails"
  risk="safe"
  defaultScope="timed"
  duration={30}
/>`,
      Component: () => (
        <PermissionRequest agent={{ name: 'Mailer' }} action="send 42 emails" target="Customers, EU" risk="safe" defaultScope="timed" duration={30} />
      ),
    },
  ],
};

export default demo;
