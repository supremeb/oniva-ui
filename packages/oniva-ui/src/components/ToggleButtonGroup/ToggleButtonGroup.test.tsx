import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ToggleButton } from '../ToggleButton';
import { ToggleButtonGroup } from './ToggleButtonGroup';

describe('ToggleButtonGroup', () => {
  it('single selection: selecting one deselects the other', async () => {
    const onSelectionChange = vi.fn();
    render(
      <ToggleButtonGroup aria-label="Range" selectionMode="single" defaultSelectedKeys={['7d']} onSelectionChange={onSelectionChange}>
        <ToggleButton id="7d">7 days</ToggleButton>
        <ToggleButton id="30d">30 days</ToggleButton>
      </ToggleButtonGroup>,
    );
    expect(screen.getByRole('radio', { name: '7 days' })).toBeChecked();
    await userEvent.click(screen.getByRole('radio', { name: '30 days' }));
    expect(onSelectionChange).toHaveBeenCalled();
    expect(screen.getByRole('radio', { name: '30 days' })).toBeChecked();
    expect(screen.getByRole('radio', { name: '7 days' })).not.toBeChecked();
  });
  it('multiple selection keeps both', async () => {
    render(
      <ToggleButtonGroup aria-label="Format" selectionMode="multiple" className="g">
        <ToggleButton id="b">Bold</ToggleButton>
        <ToggleButton id="i">Italic</ToggleButton>
      </ToggleButtonGroup>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Bold' }));
    await userEvent.click(screen.getByRole('button', { name: 'Italic' }));
    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('toolbar')).toHaveClass('g');
  });
});
