import { useEffect, useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { FileUpload, formatBytes, type UploadFile } from './FileUpload';

const wrap = { width: '100%', maxWidth: 460 } as const;

function Simulated() {
  const [files, setFiles] = useState<UploadFile[]>([
    { id: 'a', name: 'Q3-board-report.pdf', size: 2_480_000, progress: 62 },
    { id: 'b', name: 'vendor-ledger.csv', size: 184_000, progress: 100 },
    {
      id: 'c',
      name: 'bank-export-oct.zip',
      size: 74_000_000,
      progress: 18,
      error: 'File exceeds the 50 MB limit.',
    },
  ]);
  useEffect(() => {
    const t = setInterval(() => {
      setFiles((cur) =>
        cur.map((f) =>
          f.progress < 100 && !f.error ? { ...f, progress: Math.min(100, f.progress + 6) } : f,
        ),
      );
    }, 700);
    return () => {
      clearInterval(t);
    };
  }, []);
  return (
    <div style={wrap}>
      <FileUpload
        files={files}
        accept={['.pdf', '.csv', '.zip']}
        hint="PDF, CSV or ZIP up to 50 MB"
        onRemove={(id) => setFiles((cur) => cur.filter((f) => f.id !== id))}
        onFilesAdded={(picked) =>
          setFiles((cur) => [
            ...cur,
            ...picked.map((f, i) => ({
              id: `${Date.now()}-${i}`,
              name: f.name,
              size: f.size,
              progress: 5,
            })),
          ])
        }
      />
    </div>
  );
}

function Panel() {
  const [files, setFiles] = useState<UploadFile[]>([
    { id: 'p1', name: 'Quarterly-Report.pdf', size: 4_400_000, progress: 50, note: '2s left' },
    { id: 'p2', name: 'Hero-Shot.png', size: 2_700_000, progress: 62, note: '2s left' },
    { id: 'p3', name: 'Budget-2027.xlsx', size: 1_400_000, progress: 54, note: '2s left' },
    { id: 'p4', name: 'Product-Demo.mp4', size: 48_000_000, progress: 0, error: 'Too large – max 25 MB' },
  ]);
  useEffect(() => {
    const t = setInterval(() => {
      setFiles((cur) =>
        cur.map((f) =>
          f.progress < 92 && !f.error ? { ...f, progress: Math.min(92, f.progress + 4) } : f,
        ),
      );
    }, 800);
    return () => {
      clearInterval(t);
    };
  }, []);
  const active = files.filter((f) => !f.error);
  const doneCount = active.filter((f) => f.progress >= 100).length;
  const sent = active.reduce((n, f) => n + (f.size * f.progress) / 100, 0);
  const all = active.reduce((n, f) => n + f.size, 0);
  return (
    <div style={{ width: '100%', maxWidth: 680 }}>
      <FileUpload
        variant="panel"
        files={files}
        title="Drop files here or"
        browseLabel="browse"
        accept={['.pdf', '.png', '.jpg', '.xlsx', '.mp4']}
        hint="PDF, PNG, JPG and more · up to 25 MB each"
        onRemove={(id) => setFiles((cur) => cur.filter((f) => f.id !== id))}
        footer={
          doneCount === active.length
            ? `${active.length} files uploaded`
            : `Uploading ${active.length - doneCount} of ${files.length} · ${formatBytes(sent)} of ${formatBytes(all)}`
        }
      />
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'File upload',
    slug: 'file-upload',
    category: 'Forms',
    description:
      'Dropzone with file picker, accepted types and a file list showing progress rings, success and errors.',
  },
  demos: [
    {
      name: 'Panel with queue',
      code: `<FileUpload variant="panel" files={files} browseLabel="browse" hint="PDF, PNG, JPG and more · up to 25 MB each"
  footer="Uploading 3 of 4 · 4.4 of 8.1 MB" onRemove={remove} />`,
      Component: Panel,
    },
    {
      name: 'Dropzone',
      code: `<FileUpload accept={['.pdf', '.csv']} hint="PDF or CSV up to 10 MB" />`,
      Component: () => (
        <div style={wrap}>
          <FileUpload accept={['.pdf', '.csv']} hint="PDF or CSV up to 10 MB" />
        </div>
      ),
    },
    {
      name: 'Progress, success and error',
      code: `<FileUpload files={files} onRemove={remove} onFilesAdded={add} hint="PDF, CSV or ZIP up to 50 MB" />`,
      Component: Simulated,
    },
    {
      name: 'Size and type limits',
      code: `<FileUpload accept={['.pdf', '.csv']} maxSize={2 * 1024 * 1024} hint="PDF or CSV up to 2 MB" />`,
      Component: () => (
        <div style={wrap}>
          <FileUpload accept={['.pdf', '.csv']} maxSize={2 * 1024 * 1024} hint="PDF or CSV up to 2 MB" />
        </div>
      ),
    },
    {
      name: 'Disabled',
      code: `<FileUpload isDisabled hint="Uploads are locked for closed periods." />`,
      Component: () => (
        <div style={wrap}>
          <FileUpload isDisabled hint="Uploads are locked for closed periods." />
        </div>
      ),
    },
  ],
};

export default demo;
