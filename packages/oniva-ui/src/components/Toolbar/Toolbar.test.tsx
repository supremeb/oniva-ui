import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Toolbar, ToolbarButton, ToolbarSeparator, ToolbarToggleButton } from './Toolbar';

describe('Toolbar', () => {
  it('has toolbar role, label and separator', () => {
    render(
      <Toolbar aria-label="Text formatting" className="x">
        <ToolbarToggleButton aria-label="Bold">B</ToolbarToggleButton>
        <ToolbarSeparator />
        <ToolbarButton aria-label="Undo">U</ToolbarButton>
      </Toolbar>,
    );
    expect(screen.getByRole('toolbar', { name: 'Text formatting' })).toHaveClass('x');
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });
  it('toggles and presses', async () => {
    const onPress = vi.fn();
    render(
      <Toolbar aria-label="t">
        <ToolbarToggleButton aria-label="Bold">B</ToolbarToggleButton>
        <ToolbarButton aria-label="Undo" onPress={onPress}>U</ToolbarButton>
      </Toolbar>,
    );
    const bold = screen.getByRole('button', { name: 'Bold' });
    expect(bold).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(bold);
    expect(bold).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(onPress).toHaveBeenCalled();
  });
  it('arrow keys move focus between items', async () => {
    render(
      <Toolbar aria-label="t">
        <ToolbarButton>One</ToolbarButton>
        <ToolbarButton>Two</ToolbarButton>
      </Toolbar>,
    );
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'One' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('button', { name: 'Two' })).toHaveFocus();
  });
});
