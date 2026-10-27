import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Folder } from './Folder';

describe('Folder', () => {
  it('shows the folder as the h1, breadcrumbs and file cards', () => {
    render(<Folder folder="Q3 Campaign" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Q3 Campaign' })).toBeInTheDocument();
    expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Campaign-Brief/ })).toBeInTheDocument();
  });

  it('opens a file and navigates back through the breadcrumb', async () => {
    const onOpenFile = vi.fn();
    const onNavigate = vi.fn();
    render(<Folder onOpenFile={onOpenFile} onNavigate={onNavigate} />);
    await userEvent.click(screen.getByRole('button', { name: /Launch-Plan/ }));
    expect(onOpenFile).toHaveBeenCalledWith('f2');
    await userEvent.click(screen.getByRole('link', { name: 'Files' }));
    expect(onNavigate).toHaveBeenCalledWith('Folders');
  });

  it('shows an empty state for an empty folder and fires onUpload', async () => {
    const onUpload = vi.fn();
    render(<Folder folder="Hiring" onUpload={onUpload} />);
    expect(screen.getByText('This folder is empty')).toBeInTheDocument();
    const ups = screen.getAllByRole('button', { name: 'Upload file' });
    await userEvent.click(ups[ups.length - 1]!);
    expect(onUpload).toHaveBeenCalled();
  });

  it('fires folder menu actions and forwards ref/className', async () => {
    const onFolderAction = vi.fn();
    const ref = createRef<HTMLDivElement>();
    render(<Folder ref={ref} className="x" onFolderAction={onFolderAction} />);
    expect(ref.current).toHaveClass('x');
    await userEvent.click(screen.getByRole('button', { name: 'Folder actions' }));
    await userEvent.click(screen.getByRole('menuitem', { name: 'Rename' }));
    expect(onFolderAction).toHaveBeenCalledWith('rename');
  });
});
