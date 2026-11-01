import { AgentAvatar } from 'oniva-ui';
import type { AgentAvatarStatus } from 'oniva-ui';
import type { ReactNode } from 'react';
import type { StateModule } from '../types';

const row = (children: ReactNode) => <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 20 }}>{children}</div>;

const status = (s: AgentAvatarStatus | undefined, name = 'Research Scout') => ({
  id: s ?? 'none',
  label: s ?? 'no status',
  render: () => row(<AgentAvatar name={name} status={s} />),
});

const mod: StateModule = {
  slug: 'agent-avatar',
  title: 'Agent avatar',
  width: 320,
  groups: [
    {
      label: 'Status',
      states: [
        status(undefined),
        status('idle', 'Invoice Reconciler'),
        status('working'),
        status('waiting', 'Compliance Reviewer'),
        status('error', 'Deploy Bot'),
        {
          id: 'all-statuses',
          label: 'all statuses',
          render: () =>
            row(
              <>
                <AgentAvatar name="Research Scout" status="working" />
                <AgentAvatar name="Invoice Reconciler" status="idle" />
                <AgentAvatar name="Compliance Reviewer" status="waiting" />
                <AgentAvatar name="Deploy Bot" status="error" />
                <AgentAvatar name="Atlas Ops" />
              </>,
            ),
        },
      ],
    },
    {
      label: 'Size',
      states: [
        {
          id: 'sizes',
          label: '16 / 24 / 36 / 56 / 72',
          render: () => row([16, 24, 36, 56, 72].map((s) => <AgentAvatar key={s} name="Atlas Ops" size={s} status="working" />)),
        },
        {
          id: 'sizes-idle',
          label: 'small sizes with dot',
          render: () => row([20, 24, 28, 32].map((s) => <AgentAvatar key={s} name="Quill Reasoner" size={s} status="waiting" />)),
        },
        {
          id: 'large-error',
          label: 'large, error',
          render: () => row(<AgentAvatar name="Deploy Bot" size={96} status="error" />),
        },
      ],
    },
    {
      label: 'Name',
      states: [
        { id: 'single-word', label: 'single word', render: () => row(<AgentAvatar name="Atlas" status="idle" />) },
        { id: 'three-words', label: 'three words (two initials)', render: () => row(<AgentAvatar name="Northwind Labs Release Bot" status="idle" />) },
        { id: 'lowercase', label: 'lowercase', render: () => row(<AgentAvatar name="nova pro" status="idle" />) },
        { id: 'extra-spaces', label: 'extra whitespace', render: () => row(<AgentAvatar name="  Lumen   Fast  " status="working" />) },
        { id: 'unicode', label: 'non-Latin', render: () => row(<AgentAvatar name="東京 ボット" status="idle" />) },
        { id: 'empty-name', label: 'empty name', render: () => row(<AgentAvatar name="" status="idle" />) },
        {
          id: 'tints',
          label: 'tint per name',
          render: () => row(['Atlas 2', 'Nova Pro', 'Lumen Fast', 'Quill Reasoner', 'Deploy Bot', 'Research Scout', 'Invoice Reconciler', 'Compliance Reviewer'].map((n) => <AgentAvatar key={n} name={n} />)),
        },
      ],
    },
  ],
  missing: [
    'Image avatar (no src prop; initials only)',
    'Disabled or offline state (statuses are idle, working, waiting, error only)',
    'Custom tint or tone (tint is derived from the name hash)',
  ],
};
export default mod;
