import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Markdown } from './Markdown';

describe('Markdown', () => {
  it('renders headings, lists, emphasis and inline code', () => {
    render(<Markdown>{'## Summary\n\n- **Revenue** up\n- use `df.sum()`\n'}</Markdown>);
    expect(screen.getByRole('heading', { level: 2, name: 'Summary' })).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByText('Revenue').tagName).toBe('STRONG');
    expect(screen.getByText('df.sum()').tagName).toBe('CODE');
  });

  it('renders tables and fenced code', () => {
    render(
      <Markdown>
        {'| Region | Rev |\n|---|--:|\n| EMEA | $1.2M |\n\n```py\nprint(1)\n```'}
      </Markdown>,
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Rev' })).toBeInTheDocument();
    expect(screen.getByText('print(1)')).toBeInTheDocument();
  });

  it('never renders raw HTML as markup and drops unsafe links', () => {
    const { container } = render(
      <Markdown>
        {
          '<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>\n\n[bad](javascript:alert(1)) [ok](https://example.com)'
        }
      </Markdown>,
    );
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('img')).toBeNull();
    expect(screen.queryByRole('link', { name: 'bad' })).toBeNull();
    expect(screen.getByRole('link', { name: 'ok' })).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
