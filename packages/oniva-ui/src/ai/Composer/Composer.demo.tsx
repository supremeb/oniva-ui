import { useEffect, useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Composer, type ComposerEffort } from './Composer';
import type { AttachmentFile } from '../ComposerAttachments';

const models = [
  { id: 'sonnet-5', name: 'Sonnet 5', description: 'Fast and capable for everyday work' },
  { id: 'opus-5', name: 'Opus 5', description: 'Most intelligent, slower' },
  { id: 'haiku-5', name: 'Haiku 5', description: 'Lightweight and instant' },
];

const demo: DemoModule = {
  meta: {
    title: 'Composer',
    slug: 'composer',
    category: 'AI & Agent',
    description:
      'Chat input with auto-grow, attachments, model selector, permission mode, a Faster ↔ Smarter effort slider, send/stop and the orbiting loader border.',
  },
  demos: [
    {
      name: 'Full composer',
      code: `<Composer
  models={models}
  model={model}
  onModelChange={setModel}
  effort={effort}
  onEffortChange={setEffort}
  attachments={files}
  onAttach={add}
  onRemoveAttachment={remove}
  isStreaming={busy}
  onStop={() => setBusy(false)}
  onSubmit={() => setBusy(true)}
/>`,
      Component: function Full() {
        const [model, setModel] = useState('sonnet-5');
        const [effort, setEffort] = useState<ComposerEffort>('smarter');
        const [busy, setBusy] = useState(false);
        const [files, setFiles] = useState<AttachmentFile[]>([
          { id: 'seed', name: 'q3_revenue.csv', size: 48_200, type: 'text/csv' },
          {
            id: 'seed2',
            name: 'board-deck.pdf',
            size: 2_400_000,
            status: 'uploading',
            progress: 58,
          },
        ]);
        useEffect(() => {
          if (!files.some((f) => f.status === 'uploading')) return;
          const id = setInterval(() => {
            setFiles((fs) =>
              fs.map((f) =>
                f.status === 'uploading'
                  ? f.progress! >= 96
                    ? { ...f, status: 'done', progress: undefined }
                    : { ...f, progress: f.progress! + 6 }
                  : f,
              ),
            );
          }, 400);
          return () => clearInterval(id);
        }, [files]);
        return (
          <div style={{ maxWidth: 640 }}>
            <Composer
              placeholder="Analyze Q3 revenue by segment…"
              models={models}
              model={model}
              onModelChange={setModel}
              effort={effort}
              onEffortChange={setEffort}
              attachments={files}
              onRemoveAttachment={(id) => setFiles((fs) => fs.filter((f) => f.id !== id))}
              onAttach={(picked) =>
                setFiles((fs) => [
                  ...fs,
                  ...picked.map((p, i) => ({
                    id: `${p.name}-${Date.now()}-${i}`,
                    name: p.name,
                    size: p.size,
                    type: p.type,
                    status: 'uploading' as const,
                    progress: 8,
                  })),
                ])
              }
              isStreaming={busy}
              onStop={() => setBusy(false)}
              onSubmit={() => setBusy(true)}
            />
          </div>
        );
      },
    },
    {
      name: 'Working (orbiting light)',
      code: `<Composer isStreaming defaultValue="Summarize churn drivers" onStop={…} />`,
      Component: () => (
        <div style={{ maxWidth: 640 }}>
          <Composer
            isStreaming
            defaultValue="Summarize churn drivers for self-serve"
            hideEffort
            models={models}
          />
        </div>
      ),
    },
    {
      name: 'Minimal',
      code: `<Composer hideEffort hidePermissions />`,
      Component: () => (
        <div style={{ maxWidth: 480 }}>
          <Composer hideEffort hidePermissions placeholder="Message the assistant" />
        </div>
      ),
    },
  ],
};

export default demo;
