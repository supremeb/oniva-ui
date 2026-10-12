import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FileUpload, formatBytes } from './FileUpload';

describe('FileUpload', () => {
  it('renders a browse button and adds picked files to the list', async () => {
    const onFilesAdded = vi.fn();
    const { container } = render(<FileUpload onFilesAdded={onFilesAdded} hint="PDF up to 10 MB" />);
    expect(screen.getByRole('button', { name: 'Choose files' })).toBeInTheDocument();
    expect(screen.getByText('PDF up to 10 MB')).toBeInTheDocument();
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['abc'], 'statement.pdf', { type: 'application/pdf' });
    await userEvent.upload(input, file);
    expect(onFilesAdded).toHaveBeenCalledWith([file]);
    expect(await screen.findByText('statement.pdf')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Remove statement.pdf' }));
    expect(screen.queryByText('statement.pdf')).toBeNull();
  });

  it('shows progress ring, complete and error rows from controlled files', () => {
    const onRemove = vi.fn();
    render(
      <FileUpload
        onRemove={onRemove}
        files={[
          { id: '1', name: 'q3-report.pdf', size: 2_400_000, progress: 42 },
          { id: '2', name: 'ledger.csv', size: 12_000, progress: 100 },
          {
            id: '3',
            name: 'huge.zip',
            size: 900_000_000,
            progress: 10,
            error: 'File exceeds 50 MB',
          },
        ]}
      />,
    );
    expect(screen.getByRole('progressbar', { name: 'Uploading q3-report.pdf' })).toHaveAttribute(
      'aria-valuenow',
      '42',
    );
    expect(screen.getByLabelText('Upload complete')).toBeInTheDocument();
    expect(screen.getByText('File exceeds 50 MB')).toBeInTheDocument();
    expect(formatBytes(2048)).toBe('2.0 KB');
  });
});
