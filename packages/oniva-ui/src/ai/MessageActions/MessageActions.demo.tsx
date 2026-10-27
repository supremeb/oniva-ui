import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { MessageActions } from './MessageActions';

const answers = [
  'NRR rose to 112% in Q3, driven by Team plan upgrades.',
  'Net revenue retention reached 112% in Q3; expansion came mostly from Team plan upgrades.',
];

const demo: DemoModule = {
  meta: {
    title: 'Message actions',
    slug: 'message-actions',
    category: 'AI & Agent',
    description: 'Copy, regenerate with a version switcher, thumbs with a reason row, read aloud, share and branch for an assistant message.',
  },
  demos: [
    {
      name: 'In a conversation (feedback panel)',
      code: `<MessageActions variant="panel" text={answer} defaultFeedback="dislike" defaultReasonOpen onRegenerate={…} onSpeak={…} />`,
      Component: () => (
        <div style={{ border: '1px solid var(--oniva-color-border)', borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400, padding: 12, width: '100%' }}>
          <div style={{ alignSelf: 'flex-end', background: 'var(--oniva-color-surface-inner)', border: '1px solid var(--oniva-color-border)', borderRadius: 10, fontSize: 14, padding: '8px 12px' }}>
            Summarize the 2.4 release notes in one sentence.
          </div>
          <div style={{ alignItems: 'center', color: 'var(--oniva-color-text-muted)', display: 'flex', fontSize: 12, gap: 6 }}>
            <span style={{ background: 'var(--oniva-accent-solid)', borderRadius: 2, height: 8, width: 8 }} />
            Atlas 2
          </div>
          <p style={{ fontSize: 14, margin: 0 }}>Version 2.4 adds shared workspaces, cuts sync time in half and fixes the export bug on Windows.</p>
          <MessageActions
            variant="panel"
            text="Version 2.4 adds shared workspaces, cuts sync time in half and fixes the export bug on Windows."
            defaultFeedback="dislike"
            defaultReasonOpen
            onRegenerate={() => {}}
            onSpeak={() => {}}
            reasons={['Not accurate', 'Too long', "Didn't follow instructions", 'Other']}
          />
        </div>
      ),
    },
    {
      name: 'Versions, feedback and read aloud',
      code: `const [versions, setVersions] = useState(answers);
<MessageActions
  text={versions.at(-1)!}
  versions={versions}
  onRegenerate={() => setVersions([...versions, 'Another take…'])}
  onSpeak={(playing) => console.log(playing)}
  onFeedback={(value, reason) => console.log(value, reason)}
/>`,
      Component: function VersionsDemo() {
        const [versions, setVersions] = useState(answers.slice(0, 1));
        const [regen, setRegen] = useState(false);
        return (
          <div>
            <p style={{ margin: '0 0 8px' }}>{versions.at(-1)}</p>
            <MessageActions
              text={versions.at(-1)!}
              versions={versions}
              isRegenerating={regen}
              onRegenerate={() => {
                setRegen(true);
                setTimeout(() => {
                  setVersions((v) => (v.length < answers.length ? [...v, answers[v.length]!] : v));
                  setRegen(false);
                }, 900);
              }}
              onSpeak={() => {}}
            />
          </div>
        );
      },
    },
    {
      name: 'Full set',
      code: `<MessageActions text={answer} onRegenerate={…} onShare={…} onBranch={…} />`,
      Component: () => <MessageActions text={answers[0]!} onRegenerate={() => {}} onShare={() => {}} onBranch={() => {}} />,
    },
    {
      name: 'Copy and feedback only',
      code: `<MessageActions text={answer} reasons={[]} />`,
      Component: () => <MessageActions text={answers[0]!} reasons={[]} />,
    },
  ],
};

export default demo;
