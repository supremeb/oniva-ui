import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { RunLog } from './RunLog';
import { parseAnsi } from './ansi';

describe('parseAnsi', () => {
  it('splits colored spans and strips escapes', () => {
    const s = parseAnsi('\u001b[31mfail\u001b[0m ok');
    expect(s[0]).toMatchObject({ text: 'fail', color: 'red' });
    expect(s[1]).toMatchObject({ text: ' ok', color: undefined });
  });
});

describe('RunLog', () => {
  it('renders lines as a log and copies plain text', () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<RunLog lines={['$ ls', '\u001b[32mdone\u001b[0m']} />);
    expect(screen.getByRole('log')).toHaveTextContent('done');
    fireEvent.click(screen.getByRole('button', { name: 'Copy output' }));
    expect(writeText).toHaveBeenCalledWith('$ ls\ndone');
  });

  it('shows a placeholder and disables copy when there are no lines', () => {
    render(<RunLog lines={[]} />);
    expect(screen.getByText('Waiting for output…')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy output' })).toBeDisabled();
    expect(screen.getByText('Waiting for output…')).toHaveAttribute('aria-hidden', 'true');
  });

  it('exposes the full title on a truncated title bar', () => {
    render(<RunLog title="pnpm --filter @northwind/very-long-package run test" lines={['ok']} />);
    expect(screen.getByTitle('pnpm --filter @northwind/very-long-package run test')).toBeInTheDocument();
  });
});
