import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Home, Settings } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import {
  Sidebar,
  SidebarAccount,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarSearch,
  SidebarSection,
} from './Sidebar';

function Example(props: { onCollapsedChange?: (c: boolean) => void; defaultCollapsed?: boolean }) {
  return (
    <Sidebar aria-label="App" {...props}>
      <SidebarHeader name="Mertcan Esmergul" />
      <SidebarSearch />
      <SidebarContent>
        <SidebarSection title="Workspace" collapsible>
          <SidebarItem href="#home" icon={<Home size={16} />} isActive badge="152">
            Home
          </SidebarItem>
          <SidebarItem href="#set" icon={<Settings size={16} />}>
            Settings
          </SidebarItem>
        </SidebarSection>
      </SidebarContent>
      <SidebarFooter>
        <SidebarAccount name="Aylin Demir" email="aylin@acme.co" />
      </SidebarFooter>
    </Sidebar>
  );
}

describe('Sidebar', () => {
  it('renders landmark, items, active page and badge', () => {
    render(<Example />);
    expect(screen.getByRole('complementary')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument();
    const home = screen.getByRole('link', { name: /Home/ });
    expect(home).toHaveAttribute('aria-current', 'page');
    expect(home).toHaveTextContent('152');
    expect(screen.getByRole('searchbox', { name: 'Quick Search' })).toBeInTheDocument();
  });
  it('collapses via the toggle, hiding labels but keeping accessible names', async () => {
    const onChange = vi.fn();
    render(<Example onCollapsedChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Collapse sidebar' }));
    expect(onChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('complementary')).toHaveAttribute('data-collapsed', 'true');
    expect(screen.queryByText('152')).toBeNull();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Expand sidebar' })).toBeInTheDocument();
  });
  it('collapsible section toggles its items', async () => {
    render(<Example />);
    const t = screen.getByRole('button', { name: /Workspace/ });
    expect(t).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(t);
    expect(screen.queryByRole('link', { name: /Home/ })).toBeNull();
  });
});
