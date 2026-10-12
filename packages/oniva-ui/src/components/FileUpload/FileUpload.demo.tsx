import { useEffect, useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import { FileUpload, type UploadFile } from './FileUpload';

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
