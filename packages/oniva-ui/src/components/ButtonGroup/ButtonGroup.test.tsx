import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../Button';
import { ButtonGroup } from './ButtonGroup';

describe('ButtonGroup', () => {
  it('renders a labelled group of working buttons', async () => {
    const onPress = vi.fn();
    render(
      <ButtonGroup aria-label="Invoice actions">
        <Button variant="secondary" onPress={onPress}>
          Send
        </Button>
        <Button variant="secondary">Print</Button>
        <Button variant="secondary">Archive</Button>
      </ButtonGroup>,
    );
    expect(screen.getByRole('group', { name: 'Invoice actions' })).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(3);
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(onPress).toHaveBeenCalled();
  });
  it('positions differ between first, middle and last', () => {
    render(
      <ButtonGroup aria-label="g">
        <Button>A</Button>
        <Button>B</Button>
        <Button>C</Button>
      </ButtonGroup>,
    );
    const [a, b, c] = screen.getAllByRole('button');
    expect(a!.className).not.toBe(b!.className);
    expect(b!.className).not.toBe(c!.className);
  });
});
