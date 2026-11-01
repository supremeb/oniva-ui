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

  it('opens only http(s) links in a new tab', () => {
    render(
      <Markdown>
        {'[web](https://example.com) [mail](mailto:a@example.com) [anchor](#top) [path](/docs)'}
      </Markdown>,
    );
    expect(screen.getByRole('link', { name: 'web' })).toHaveAttribute('target', '_blank');
    for (const name of ['mail', 'anchor', 'path']) {
      expect(screen.getByRole('link', { name })).not.toHaveAttribute('target');
    }
  });

  it('renders task list checkboxes read-only with a state name, without inline styles', () => {
    render(<Markdown>{'- [x] Backfill\n- [ ] Publish runbook'}</Markdown>);
    const done = screen.getByRole('checkbox', { name: 'Done' });
    const open = screen.getByRole('checkbox', { name: 'Not done' });
    expect(done).toBeChecked();
    expect(open).not.toBeChecked();
    expect(done).toHaveAttribute('readonly');
    expect(done).not.toHaveAttribute('style');
  });

  it('keeps ordered list start and nests lists', () => {
    const { container } = render(<Markdown>{'4. a\n5. b\n   - inner\n'}</Markdown>);
    expect(container.querySelector('ol')).toHaveAttribute('start', '4');
    expect(container.querySelector('li ul')).not.toBeNull();
  });

  it('renders an empty string as an empty container and forwards ref/className', () => {
    let node: HTMLDivElement | null = null;
    const { container } = render(
      <Markdown
        className="custom"
        ref={(n) => {
          node = n;
        }}
      >
        {''}
      </Markdown>,
    );
    expect(container.firstElementChild).toBe(node);
    expect(container.firstElementChild).toHaveClass('custom');
    expect(container.firstElementChild).toBeEmptyDOMElement();
  });

  it('shows alt text when an image source is unsafe and keeps safe images lazy', () => {
    const { container } = render(
      <Markdown>{'![chart](javascript:alert(1)) ![logo](/og.svg)'}</Markdown>,
    );
    const imgs = container.querySelectorAll('img');
    expect(imgs).toHaveLength(1);
    expect(imgs[0]).toHaveAttribute('loading', 'lazy');
    expect(container).toHaveTextContent('chart');
  });
});
