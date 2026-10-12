import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FileUploadCard } from './FileUploadCard';

const files = [
  { id: 'a', name: 'Q3-report.pdf', size: 2_400_000, progress: 100 },
  { id: 'b', name: 'roster.csv', size: 120_000, progress: 40 },
];

describe('FileUploadCard', () => {
  it('lists files and storage usage', () => {
    render(<FileUploadCard files={files} usedBytes={4_200_000_000} totalBytes={10_000_000_000} />);
    expect(screen.getByText('Upload files')).toBeInTheDocument();
    expect(screen.getByText('Q3-report.pdf')).toBeInTheDocument();
    expect(screen.getByText('roster.csv')).toBeInTheDocument();
    expect(screen.getAllByRole('progressbar').length).toBeGreaterThan(0);
  });

  it('omits quota when unset and forwards ref/className', () => {
    let el: HTMLElement | null = null;
    render(
      <FileUploadCard
        files={[]}
        className="extra"
        ref={(n) => {
          el = n;
        }}
      />,
    );
    expect(screen.queryByRole('progressbar')).toBeNull();
    expect(el).toBeInstanceOf(HTMLElement);
    expect((el as unknown as HTMLElement).className).toContain('extra');
  });
});
