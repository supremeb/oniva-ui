import { useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { Button } from '../../components/Button';
import { Artifact } from './Artifact';

const MEMO = `Q3 retention summary

- Net revenue retention: 112% (+3 pts QoQ)
- SMB logo churn: 2.1%, down from 2.9%
- Expansion led by the Team plan upgrade path ($184k ARR)

Next: segment churn by acquisition channel.`;

function Demo() {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', minHeight: 300 }}>
      {!open && <Button onPress={() => setOpen(true)}>Open artifact</Button>}
      <Artifact
        open={open}
        onClose={() => setOpen(false)}
        title="Q3 retention summary"
        version="v3"
        copyText={MEMO}
        onDownload={() => {}}
        onShare={() => {}}
      >
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 13, lineHeight: '20px' }}>{MEMO}</pre>
      </Artifact>
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'Artifact',
    slug: 'artifact',
    category: 'AI & Agent',
    description: 'Side panel for generated documents with version, actions and a scrolling content slot.',
  },
  demos: [
    {
      name: 'Document artifact',
      code: `<Artifact open={open} onClose={() => setOpen(false)} title="Q3 retention summary" version="v3" copyText={memo} onDownload={…} onShare={…}>
  {memo}
</Artifact>`,
      Component: Demo,
    },
  ],
};

export default demo;
