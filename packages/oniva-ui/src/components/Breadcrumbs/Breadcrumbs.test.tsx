import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Breadcrumb, Breadcrumbs } from './Breadcrumbs';

describe('Breadcrumbs', () => {
  it('renders a labelled nav list, marks the last item current, no separator after it', () => {
    const { container } = render(
      <Breadcrumbs aria-label="Trail" className="x">
        <Breadcrumb href="/">Home</Breadcrumb>
        <Breadcrumb href="/c">Components</Breadcrumb>
        <Breadcrumb>Sidebar</Breadcrumb>
      </Breadcrumbs>,
    );
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getByRole('list')).toHaveClass('x');
    expect(screen.getByText('Sidebar').closest('[aria-current="page"]')).not.toBeNull();
    expect(container.querySelectorAll('svg')).toHaveLength(2);
  });
  it('fires onPress for non-href items', async () => {
    const onPress = vi.fn();
    render(
      <Breadcrumbs>
        <Breadcrumb onPress={onPress}>Projects</Breadcrumb>
        <Breadcrumb>Atlas</Breadcrumb>
      </Breadcrumbs>,
    );
    await userEvent.click(screen.getByText('Projects'));
    expect(onPress).toHaveBeenCalled();
  });
});
