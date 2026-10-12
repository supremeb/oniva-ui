import { useEffect, useState } from 'react';
import type { DemoModule } from '../../internal/demo';
import type { UploadFile } from '../../components/FileUpload';
import { FileUploadCard } from './FileUploadCard';

function Live() {
  const [files, setFiles] = useState<UploadFile[]>([
    { id: 'f1', name: 'Q3-revenue-report.pdf', size: 2_412_000, progress: 100 },
    { id: 'f2', name: 'customers-oct.csv', size: 884_000, progress: 55 },
  ]);
  useEffect(() => {
    const t = setInterval(() => {
      setFiles((fs) =>
        fs.map((f) => (f.progress < 100 ? { ...f, progress: Math.min(100, f.progress + 9) } : f)),
      );
    }, 700);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ maxWidth: 440 }}>
      <FileUploadCard
        files={files}
        usedBytes={4_200_000_000}
        totalBytes={10_000_000_000}
        onFilesAdded={(added) =>
          setFiles((fs) => [
            ...fs,
            ...added.map((f, i) => ({
              id: `${f.name}-${Date.now()}-${i}`,
              name: f.name,
              size: f.size,
              progress: 0,
            })),
          ])
        }
        onRemove={(id) => setFiles((fs) => fs.filter((f) => f.id !== id))}
      />
    </div>
  );
}

const demo: DemoModule = {
  meta: {
    title: 'File upload card',
    slug: 'file-upload-card',
    category: 'Widgets',
    description: 'Upload card with drop zone, live progress list and a storage quota meter.',
  },
  demos: [
    {
      name: 'Live progress',
      code: `<FileUploadCard
  files={files}
  usedBytes={4_200_000_000}
  totalBytes={10_000_000_000}
  onFilesAdded={add}
  onRemove={remove}
/>`,
      Component: Live,
    },
    {
      name: 'With an error',
      code: `<FileUploadCard files={[{ id: 'x', name: 'archive.zip', size: 48_000_000, progress: 20, error: 'Larger than 25 MB' }]} />`,
      Component: () => (
        <div style={{ maxWidth: 440 }}>
          <FileUploadCard
            files={[
              {
                id: 'x',
                name: 'archive.zip',
                size: 48_000_000,
                progress: 20,
                error: 'Larger than 25 MB',
              },
            ]}
          />
        </div>
      ),
    },
  ],
};

export default demo;
