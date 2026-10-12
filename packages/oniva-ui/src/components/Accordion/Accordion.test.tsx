import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Accordion, AccordionItem } from './Accordion';

function Sample({ multiple = false }: { multiple?: boolean }) {
  return (
    <Accordion allowsMultipleExpanded={multiple} className="custom">
      <AccordionItem id="a" title="Alpha">
        Alpha body
      </AccordionItem>
      <AccordionItem id="b" title="Beta">
        Beta body
      </AccordionItem>
    </Accordion>
  );
}

describe('Accordion', () => {
  it('toggles a section via its trigger button', async () => {
    render(<Sample />);
    const alpha = screen.getByRole('button', { name: 'Alpha' });
    expect(alpha).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(alpha);
    expect(alpha).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Alpha body')).toBeVisible();
  });

  it('only keeps one open by default, many when allowed', async () => {
    const { unmount } = render(<Sample />);
    await userEvent.click(screen.getByRole('button', { name: 'Alpha' }));
    await userEvent.click(screen.getByRole('button', { name: 'Beta' }));
    expect(screen.getByRole('button', { name: 'Alpha' })).toHaveAttribute('aria-expanded', 'false');
    unmount();
    render(<Sample multiple />);
    await userEvent.click(screen.getByRole('button', { name: 'Alpha' }));
    await userEvent.click(screen.getByRole('button', { name: 'Beta' }));
    expect(screen.getByRole('button', { name: 'Alpha' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('forwards className', () => {
    const { container } = render(<Sample />);
    expect(container.querySelector('.custom')).toBeInTheDocument();
  });
});
