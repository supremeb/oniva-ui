import type { DemoModule } from '../../internal/demo';
import { MessageBranch } from './MessageBranch';

const branches = [
  <p key="1" style={{ margin: 0, fontSize: 14, lineHeight: '22px' }}>
    The retry loop never caps its delay. After 12 attempts the wait is about 68 minutes, so a flaky endpoint can stall a
    job for over an hour.
  </p>,
  <p key="2" style={{ margin: 0, fontSize: 14, lineHeight: '22px' }}>
    Two issues in PR #482: backoff is uncapped (max wait should be 5 min) and the consumer acks before the handler
    finishes, so a crash silently drops the job.
  </p>,
  <p key="3" style={{ margin: 0, fontSize: 14, lineHeight: '22px' }}>
    Looks good overall. One blocking comment: add jitter to the exponential backoff to avoid thundering-herd retries when
    the webhook target recovers.
  </p>,
];

const demo: DemoModule = {
  meta: {
    title: 'Message branch',
    slug: 'message-branch',
    category: 'AI & Agent',
    description: 'Version switcher for regenerated responses with a directional slide.',
  },
  demos: [
    {
      name: 'Three versions',
      code: `<MessageBranch branches={[<p>…</p>, <p>…</p>, <p>…</p>]} defaultIndex={1} />`,
      Component: () => <MessageBranch branches={branches} defaultIndex={1} />,
    },
  ],
};

export default demo;
