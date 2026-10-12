import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { InlineCitation } from './InlineCitation';

describe('InlineCitation', () => {
  it('renders an accessible numbered link to the source', () => {
    render(<p>Rates rose<InlineCitation index={2} title="Fed holds rates" url="https://www.reuters.com/markets/fed" /></p>);
    const link = screen.getByRole('link', { name: 'Source 2: Fed holds rates' });
    expect(link).toHaveAttribute('href', 'https://www.reuters.com/markets/fed');
    expect(link).toHaveTextContent('2');
  });
  it('drops unsafe urls', () => {
    render(<InlineCitation index={1} title="Bad" url="javascript:alert(1)" />);
    expect(screen.getByRole('link', { name: 'Source 1: Bad' })).not.toHaveAttribute('href');
  });
});
